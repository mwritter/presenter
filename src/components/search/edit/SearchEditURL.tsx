import styled from "@emotion/styled";
import { Button, Stack, Text } from "@mantine/core";
import { Editor, EditorContent, JSONContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import variables from "../../../util/editor/plugin/variables";
import { useCallback, useEffect, useState } from "react";
import single from "../../../util/editor/plugin/single";

const StyledEditor = styled(EditorContent)`
  .ProseMirror {
    color: white;
    padding: 0.5rem;
    outline: 1px solid white;
    border-radius: 5px;

    &-focused {
      outline: auto;
    }

    p {
      word-break: keep-all;
      [contenteditable="false"] {
        white-space: nowrap;
      }
    }
  }
`;

const SearchEditURL = ({ urlJSON, onChange }: SearchEditURLProps) => {
  console.log("json is" + urlJSON);
  return (
    <Stack>
      <Text color="white">URL</Text>
      <SearchURLEditor onChange={onChange} urlJSON={urlJSON} />
    </Stack>
  );
};

interface SearchEditURLProps {
  urlJSON: string;
  onChange: (url: string, urlJSON: string) => void;
}

export default SearchEditURL;

const SearchURLEditor = ({
  urlJSON,
  onChange,
}: {
  urlJSON: string;
  onChange: (url: string, urlJSON: string) => void;
}) => {
  const [editor, setEditor] = useState<Editor | null>(null);
  const [currentURL, setCurrentURL] = useState(urlJSON || "{}");
  const VariablePlugin = variables([
    "version",
    "book",
    "chapter",
    "start",
    "end",
  ]);

  const onEditorBlur = useCallback((urlJSON: JSONContent) => {
    const saveableURL =
      urlJSON.content?.[0]?.content
        ?.map((c: any) => {
          if (c.type === "text") {
            return c.text;
          } else if (c.type === "mention") {
            return c.attrs.id;
          }
        })
        .join("") || "";
    // setCurrentURL(JSON.stringify(urlJSON))
    onChange(saveableURL, JSON.stringify(urlJSON));
  }, []);

  useEffect(() => {
    if (!editor) {
      setEditor(
        new Editor({
          extensions: [StarterKit, VariablePlugin, single],
          content: JSON.parse(currentURL),
          onBlur: ({ editor }) => {
            const urlJSON = editor.getJSON();
            onEditorBlur(urlJSON);
          },
          editorProps: {
            attributes: {
              autocapitalize: "off",
              autocorrect: "off",
            },
          },
        })
      );
    }
  }, [editor]);

  return (
    <StyledEditor autoCorrect="off" autoCapitalize="off" editor={editor} />
  );
};
