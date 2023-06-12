import { Extension } from "@tiptap/core";

// TODO: this messes things up for selecting variables with Enter but is kinda needed
// to keep the URL as one line (ie disallow \n)
export default Extension.create({
  addKeyboardShortcuts() {
    return {
      // Enter: ({ editor }) => {
      //   editor.commands.blur();
      //   return true;
      // },
    };
  },
});
