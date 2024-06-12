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

// import React from "react";
// import {
//   PageTitle,
//   PageSubtitle,
//   PageBody,
//   PageTags,
//   PageTag,
// } from "my-ui-lib";
//
// export default function IntroPage() {
//   const context = useContext();
//
//   return (
//     <>
//       <PageTitle>My Page Title</PageTitle>
//       <PageSubtitle>My Page Subtitle</PageSubtitle>
//       <PageBody>Hello, world!</PageBody>
//       <PageTags>
//         <PageTag>Tag 1</PageTag>
//         <PageTag>Tag 2</PageTag>
//       </PageTags>
//     </>
//   );
// }
interface InputConfig {
  name: string;
  title: string;
  subtitle?: string;
  path: string;
  parent: string;
  content: string;
  tags?: Array<{ id: string; name: string }>;
}

function generatePage(input: InputConfig): ts.Node[] {
  const requireTags = Boolean(input.tags?.length);
  const requireSubtitle = input.subtitle != null;

  function importSpecifier(name: string) {
    return ts.factory.createImportSpecifier(
      false,
      undefined,
      ts.factory.createIdentifier(name)
    );
  }

  return [
    ts.factory.createImportDeclaration(
      undefined,
      ts.factory.createImportClause(
        false,
        ts.factory.createIdentifier("React"),
        undefined
      ),
      ts.factory.createIdentifier("react"),
      undefined
    ),
    ts.factory.createImportDeclaration(
      undefined,
      ts.factory.createImportClause(
        false,
        undefined,
        ts.factory.createNamedImports([
          importSpecifier("PageTitle"),
          ...(requireSubtitle ? [importSpecifier("PageSubtitle")] : []),
          importSpecifier("PageBody"),
          ...(requireTags
            ? [importSpecifier("Tags"), importSpecifier("Tag")]
            : []),
        ])
      ),
      ts.factory.createIdentifier("my-ui-lib"),
      undefined
    ),
    ts.factory.createFunctionExpression(
      [
        ts.factory.createModifier(ts.SyntaxKind.ExportKeyword),
        ts.factory.createModifier(ts.SyntaxKind.DefaultKeyword),
      ],
      undefined,
      input.name,
      undefined,
      undefined,
      undefined,
      ts.factory.createBlock(
        [
          ts.factory.createVariableStatement(undefined, [
            ts.factory.createVariableDeclaration(
              "context",
              undefined,
              undefined,
              ts.factory.createCallExpression(
                ts.factory.createIdentifier("useContext"),
                undefined,
                undefined
              )
            ),
          ]),
        ],
        true
      )
    ),
  ];
}

const input = {
  name: "IntroPage",
  title: "My Page Title",
  subtitle: "My Page Subtitle",
  path: "/pages/intro",
  parent: "cloud",
  content: "Hello, world!",
  tags: [
    { id: "tag1", name: "Tag 1" },
    { id: "tag2", name: "Tag 2" },
  ],
};
const page = generatePage(input);

printCode(...page);
