import Mention from "@tiptap/extension-mention";
// @ts-ignore-next-line
import suggestion from "./suggestion";

export default (variables: string[]) =>
  Mention.configure({
    HTMLAttributes: {
      class: "url-variable",
    },
    renderLabel: ({ options, node }) => {
      return `${node.attrs.label}`;
    },
    suggestion: suggestion(variables),
  });
