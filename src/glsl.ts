import { parser } from "lezer-glsl";
import {
  flatIndent,
  continuedIndent,
  delimitedIndent,
  indentNodeProp,
  foldNodeProp,
  foldInside,
  LRLanguage,
  LanguageSupport,
} from "@codemirror/language";

/// A language provider based on the [Lezer GLSL
/// parser](https://github.com/schimd-daniel/lezer-glsl), extended with
/// highlighting and indentation information.
export const glslLanguage = LRLanguage.define({
  name: "glsl",
  parser: parser.configure({
    props: [
      indentNodeProp.add({
        IfStatement: continuedIndent({ except: /^\s*({|else\b)/ }),
        CaseStatement: (context) => context.baseIndent + context.unit,
        BlockComment: () => null,
        CompoundStatement: delimitedIndent({ closing: "}" }),
        Statement: continuedIndent({ except: /^{/ }),
      }),
      foldNodeProp.add({
        "StructDeclarationList CompoundStatement": foldInside,
        BlockComment(tree) {
          return { from: tree.from + 2, to: tree.to - 2 };
        },
      }),
    ],
  }),
  languageData: {
    commentTokens: { line: "//", block: { open: "/*", close: "*/" } },
    indentOnInput: /^\s*(?:case |default:|\{|\})$/,
    closeBrackets: {
      stringPrefixes: ["L", "u", "U", "u8", "LR", "UR", "uR", "u8R", "R"],
    },
  },
});

/// Language support for GLSL.
export function glsl() {
  return new LanguageSupport(glslLanguage);
}
