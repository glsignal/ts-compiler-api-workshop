import ts from "typescript";

const program = ts.createProgram({
  rootNames: ["src/main.ts"],
  options: {
    strict: true,
    target: ts.ScriptTarget.ESNext,
  },
});

const checker = program.getTypeChecker();

function typeCheckSourceFile(sourceFile: ts.SourceFile) {
  sourceFile.forEachChild((node) => {
    if (ts.isFunctionDeclaration(node)) {
      const signature = checker.getSignatureFromDeclaration(node);

      signature?.getParameters().forEach((parameter) => {
        const symbolType = checker.getTypeOfSymbol(parameter);

        symbolType.getProperties().forEach((property) => {
          console.log(
            `Field '${property.name}' is type '${checker.typeToString(
              checker.getTypeOfSymbol(property)
            )}'`
          );
        });
      });
    }
  });
}

for (const rootFileName of program.getRootFileNames()) {
  const sourceFile = program.getSourceFile(rootFileName);

  if (sourceFile && !sourceFile.isDeclarationFile) {
    typeCheckSourceFile(sourceFile);
  }
}
