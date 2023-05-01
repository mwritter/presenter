import styled from "@emotion/styled";
import { Box, Button, Stack, Text, Title } from "@mantine/core";

const SearchEditURLEditMode = ({ url }: Pick<SearchEditURLProps, "url">) => {
  return <div>Edit {url}</div>;
};

const SearchEditURLDisplayMode = ({ url }: Pick<SearchEditURLProps, "url">) => {
  const variables = url.match(/(?<=\{\{)(.*?)(?=\}\})/) || [];

  let parsed = url;
  for (const variable of variables) {
    parsed = parsed.replaceAll(`{{${variable}}}`, variable);
  }

  return (
    <div>
      Display{" "}
      {url.split(/[\/&?=.]/).map((part) => {
        if (/^\{\{/.test(part)) {
          const variable = part.match(/(?<=\{\{)(.*?)(?=\}\})/)?.[0] || "";

          return <StyledVariable>{variable}</StyledVariable>;
        }
        return part;
      })}
    </div>
  );
};

const StyledVariable = styled.span`
  color: white;
`;

const SearchEditURL = ({
  url,
  editMode,
  onToggleEditMode,
}: SearchEditURLProps) => {
  return (
    <Stack>
      <Text color="white">URL</Text>
      {editMode ? (
        <SearchEditURLEditMode url={url} />
      ) : (
        <SearchEditURLDisplayMode url={url} />
      )}
      <Button style={{ alignSelf: "start" }} onClick={onToggleEditMode}>
        {editMode ? "Save" : "Edit"}
      </Button>
    </Stack>
  );
};

interface SearchEditURLProps {
  url: string;
  editMode: boolean;
  onToggleEditMode: () => void;
}

export default SearchEditURL;
