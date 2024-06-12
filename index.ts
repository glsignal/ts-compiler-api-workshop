import ts from "typescript";

const host = ts.createCompilerHost({});

const writeFile: ts.WriteFileCallback = (
  fileName,
  text,
  writeByteOrderMark,
  onError,
  sourceFiles,
  data
) => {
  console.log("Writing: ", fileName);
};

host.writeFile = writeFile;

const program = ts.createProgram({
  host,
  rootNames: ["src/main.ts"],
  options: { strict: true, outDir: "dist", module: ts.ModuleKind.ESNext },
});

const sourceFiles = program.getRootFileNames();

sourceFiles.forEach((f) => {
  console.log(f);
});

const result = program.emit(undefined, writeFile);

console.log(result);
