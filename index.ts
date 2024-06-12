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
      const returnType = signature?.getReturnType();

      const returnTypeString = returnType
        ? checker.typeToString(returnType)
        : "???";

      console.log(returnTypeString);
    }
  });
}

for (const rootFileName of program.getRootFileNames()) {
  const sourceFile = program.getSourceFile(rootFileName);

  if (sourceFile && !sourceFile.isDeclarationFile) {
    typeCheckSourceFile(sourceFile);
  }
}
