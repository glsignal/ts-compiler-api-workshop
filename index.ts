import ts from "typescript";

const host = ts.createCompilerHost({});

const program = ts.createProgram({
  host,
  rootNames: ["src/main.ts"],
  options: {
    sourceMap: true,
    strict: true,
    outDir: "dist",
    module: ts.ModuleKind.ESNext,
    noEmitOnError: true,
  },
});

const result = program.emit();

result.diagnostics.forEach((d) => {
  if (d.file && d.start) {
    const p = ts.getLineAndCharacterOfPosition(d.file, d.start);
    const message = ts.flattenDiagnosticMessageText(d.messageText, "\n");
    console.log(
      `${d.file.fileName}:${p.line} (${p.character}): ${message} (ts${d.code})`
    );
  } else {
    console.log(ts.flattenDiagnosticMessageText(d.messageText, "\n"));
  }
});
