import ts from "typescript";

let functionCount = 0;
let exportedFunctionsCount = 0;

function parseSourceFile(sourceFile: ts.SourceFile) {
  sourceFile.forEachChild((node) => {
    if (ts.isFunctionDeclaration(node)) {
      functionCount++;

      const hasExportSpecifier = node.modifiers?.some(
        (v) => v.kind === ts.SyntaxKind.ExportKeyword
      );

      if (hasExportSpecifier) {
        exportedFunctionsCount++;
      }
    } else if (ts.isVariableStatement(node)) {
      node.declarationList.forEachChild((child) => {
        if (
          ts.isVariableDeclaration(child) &&
          child.initializer &&
          ts.isArrowFunction(child.initializer)
        ) {
          functionCount++;
        }
      });

      const hasExportSpecifier = node.modifiers?.some(
        (v) => v.kind === ts.SyntaxKind.ExportKeyword
      );
      if (hasExportSpecifier) exportedFunctionsCount++;
    }
  });
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

const sourceFileNames = program.getRootFileNames();

for (const sourceFileName of sourceFileNames) {
  const sourceFile = program.getSourceFile(sourceFileName);

  if (sourceFile) {
    parseSourceFile(sourceFile);
  }
}

console.log({ functionCount, exportedFunctionsCount });
