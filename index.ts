import ts from "typescript";

function printCode(...nodes: ts.Statement[]) {
  const resultFile = ts.createSourceFile(
    "./source.ts",
    "",
    ts.ScriptTarget.Latest,
    false,
    ts.ScriptKind.TSX
  );

  const printer = ts.createPrinter({ newLine: ts.NewLineKind.LineFeed });

  const sourceFile = ts.factory.createSourceFile(
    nodes,
    ts.factory.createToken(ts.SyntaxKind.EndOfFileToken),
    ts.NodeFlags.None
  );

  const result = printer.printNode(
    ts.EmitHint.Unspecified,
    sourceFile,
    resultFile
  );

  console.log(result);
}

const host = ts.createCompilerHost({});

const program = ts.createProgram({
  host,
  rootNames: ["src/main.ts"],
  options: {
    module: ts.ModuleKind.ESNext,
    noEmitOnError: true,
    outDir: "dist",
    strict: true,
  },
});

// const a = 17;
const variable = ts.factory.createVariableStatement(
  undefined,
  ts.factory.createVariableDeclarationList(
    [
      ts.factory.createVariableDeclaration(
        ts.factory.createIdentifier("a"),
        undefined,
        undefined,
        ts.factory.createNumericLiteral("17")
      ),
    ],
    ts.NodeFlags.Const
  )
);

// function hello() {
//   const array = ['h', 'e', 'l', 'l', 'o'];
//   return array.join(',');
// }
const hello = ts.factory.createFunctionDeclaration(
  undefined,
  undefined,
  ts.factory.createIdentifier("hello"),
  undefined,
  [],
  undefined,
  ts.factory.createBlock(
    [
      ts.factory.createVariableStatement(
        undefined,
        ts.factory.createVariableDeclarationList(
          [
            ts.factory.createVariableDeclaration(
              ts.factory.createIdentifier("array"),
              undefined,
              undefined,
              ts.factory.createArrayLiteralExpression([
                ts.factory.createStringLiteral("h", true),
                ts.factory.createStringLiteral("e", true),
                ts.factory.createStringLiteral("l", true),
                ts.factory.createStringLiteral("l", true),
                ts.factory.createStringLiteral("o", true),
              ])
            ),
          ],
          ts.NodeFlags.Const
        )
      ),
      ts.factory.createReturnStatement(
        ts.factory.createCallExpression(
          ts.factory.createPropertyAccessExpression(
            ts.factory.createIdentifier("array"),
            ts.factory.createIdentifier("join")
          ),
          undefined,
          [ts.factory.createStringLiteral(",", true)]
        )
      ),
    ],
    true
  )
);

printCode(variable, hello);
