import ts from "typescript";
import { ast, query } from "@phenomnomnominal/tsquery";

function isNaNIdentifier(node: ts.Node): boolean {
  return ts.isIdentifier(node) && node.escapedText === "NaN";
}

function checkNode(sourceFile: ts.SourceFile, node: ts.Node) {
  if (
    ts.isBinaryExpression(node) &&
    (isNaNIdentifier(node.left) || isNaNIdentifier(node.right))
  ) {
    const position = ts.getLineAndCharacterOfPosition(sourceFile, node.pos);
    console.log(
      "Warning: expressions with NaN should use `isNaN`\n" +
        `  ${sourceFile.fileName}:${position.line}: "${node.getText(
          sourceFile
        )}"\n`
    );
  } else node.forEachChild((child) => checkNode(sourceFile, child));
}

function parseSourceFile(sourceFile: ts.SourceFile) {
  checkNode(sourceFile, sourceFile);
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
