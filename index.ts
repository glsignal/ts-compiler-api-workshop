import ts from "typescript";

const program = ts.createProgram({
  rootNames: ["src/main.ts"],
  options: {
    strict: true,
    target: ts.ScriptTarget.ESNext,
  },
});

function printSource(sourceFile: ts.SourceFile) {
  const printer = ts.createPrinter();
  const result = printer.printNode(
    ts.EmitHint.Unspecified,
    sourceFile,
    sourceFile
  );

  console.log(result);
}

const transformFunction = (node: ts.ArrowFunction): ts.FunctionExpression => {
  return ts.factory.createFunctionExpression(
    node.modifiers,
    node.asteriskToken,
    node.name,
    node.typeParameters,
    node.parameters,
    node.type,
    ts.isExpression(node.body)
      ? ts.factory.createBlock([ts.factory.createReturnStatement(node.body)])
      : node.body
  );
};

const transformDeclaration: ts.Transformer<ts.VariableDeclaration> = (node) => {
  if (
    ts.isFunctionLike(node.initializer) &&
    ts.isArrowFunction(node.initializer)
  ) {
    return ts.factory.updateVariableDeclaration(
      node,
      node.name,
      node.exclamationToken,
      node.type,
      transformFunction(node.initializer)
    );
  }

  if (ts.isIdentifier(node.name) && node.name.text === "hello") {
    return ts.factory.updateVariableDeclaration(
      node,
      ts.factory.createIdentifier("world"),
      node.exclamationToken,
      node.type,
      node.initializer
    );
  }

  return node;
};

const transformDeclarationList: ts.Transformer<ts.VariableDeclarationList> = (
  node
) => {
  return ts.factory.updateVariableDeclarationList(
    node,
    node.declarations.map(transformDeclaration)
  );
};

const transformVariableStatement: ts.Transformer<ts.VariableStatement> = (
  node
) => {
  return ts.factory.updateVariableStatement(
    node,
    node.modifiers,
    transformDeclarationList(node.declarationList)
  );
};

const transformNode: ts.Transformer<ts.Node> = (node) => {
  if (ts.isVariableStatement(node)) {
    return transformVariableStatement(node);
  }

  return node;
};

const transformer: ts.TransformerFactory<ts.SourceFile> =
  (context) => (sourceFile) => {
    return ts.visitEachChild(sourceFile, transformNode, context);
  };

// export const hello = (text?: string) => {
//   console.log(`Hello, ${text ?? "World!"}`);
// };
//
// let world = <T>(t: T): T => {
//     return t;
//   },
//   another = () => {
//     console.log("another");
//   },
//   aThird = () => "test",
//   a = 5,
//   b = "string",
//   c = true;
for (const root of program.getRootFileNames()) {
  const sourceFile = program.getSourceFile(root);
  if (sourceFile && !sourceFile.isDeclarationFile) {
    const result = ts.transform(sourceFile, [transformer]);

    for (const sf of result.transformed) {
      printSource(sf);
    }
  }
}
