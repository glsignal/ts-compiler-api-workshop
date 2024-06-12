import ts from "typescript";
import { ast, query } from "@phenomnomnominal/tsquery";

let functionCount = 0;
let exportedFunctionsCount = 0;

function parseSourceFile(sourceFile: ts.SourceFile) {
  const nodes = query(sourceFile, "ArrowFunction, FunctionDeclaration");
  functionCount += nodes.length;

  const exportedNodes = query(
    sourceFile,
    "FunctionDeclaration:has(ExportKeyword), VariableStatement:has(ExportKeyword) ArrowFunction"
  );
  exportedFunctionsCount += exportedNodes.length;
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
