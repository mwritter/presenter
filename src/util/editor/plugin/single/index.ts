import { Extension } from "@tiptap/core";

export default Extension.create({
  addKeyboardShortcuts() {
    return {
      Enter: ({ editor }) => {
        editor.commands.blur();
        return true;
      },
    };
  },
});
