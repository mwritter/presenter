import styled from "@emotion/styled";
import {
  Box,
  Button,
  ColorInput,
  ColorInputProps,
  Select,
  Slider,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import React, { useEffect, useState } from "react";
import FontFamilySelect from "../show/theme/toolbar/font/FontFamilySelect";
import FontSizeInput from "../show/theme/toolbar/font/FontSizeInput";
import {
  ThemeEntryTagType,
  ThemeEntryTagTypeKey,
  ThemeEntryType,
} from "../../types/LibraryTypes";
import { editThemeEntry } from "../../helpers/theme.helper";
import Slide from "../show/slide/Slide";
import useStore from "../../store";

// TODO: animate this in and out like a drawer or use a drawer with no overlay
// also this shouldn't be editing the file on change it should have a save botton
const SearchTagToolbarContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  background-color: #21212a;
  height: 100%;
  width: 100%;
  padding: 1rem;
  position: fixed;
  right: 0;
  overflow: scroll;
  padding-bottom: 5rem;
`;

const SearchTagColorInput = styled(ColorInput)<ColorInputProps>`
  .mantine-ColorInput-label {
    color: white;
  }

  .mantine-ColorInput-input {
    background: transparent;
    color: white;
  }
`;

const SearchSelect = styled(Select)`
  & .mantine-Input-input {
    color: white;
    background-color: #282c34;
  }

  & .mantine-Select-label {
    color: white;
    font-size: smaller;
  }

  & .mantine-Select-item {
    color: white;
    margin: 0.1rem;
    font-size: small;
    &[data-selected="true"],
    &[data-hovered="true"] {
      background-color: #476480;
    }
  }

  & .mantine-Select-dropdown {
    background-color: #282c34;
  }
`;

const TextInputStyled = styled(TextInput)`
  & .mantine-TextInput-input {
    color: white;
    background-color: transparent;
  }

  & .mantine-TextInput-label {
    color: white;
  }
`;

// TODO: maybe make this a drawer

const SearchTagToolbar = ({
  query,
  themes,
  theme,
  tagStyle,
  onThemeChange,
  onUpdateTagStyle,
  onGetTag,
}: SearchTagToolbarProps) => {
  const [dummyTag, setDummyTag] = useState<string>(onGetTag());
  useEffect(() => {
    if (theme && theme.tag) {
      onUpdateTagStyle(theme.tag);
    }
  }, [theme]);

  return (
    <SearchTagToolbarContainer>
      <Title order={5} color="white">
        Tag
      </Title>
      <Box style={{ alignSelf: "center" }}>
        <Slide
          slide={{ id: "tag-preview", tag: dummyTag }}
          tagStyle={tagStyle}
          containerStyle={{}}
          theme={theme?.name}
          size={250}
        />
      </Box>
      <TextInputStyled
        label="Tag Text"
        onChange={(evt) => setDummyTag(evt.target.value)}
      />

      <SearchSelect
        value={theme?.name}
        data={themes.map((theme) => ({ value: theme.name, label: theme.name }))}
        onChange={(value) => {
          const found = themes.find(({ name }) => name === value);
          if (found) onThemeChange(found);
        }}
      />
      <FontFamilySelect
        value={tagStyle?.fontFamily || theme?.style?.fontFamily}
        onChange={(value) => {
          onUpdateTagStyle({ fontFamily: value });
        }}
      />
      <FontSizeInput
        value={tagStyle?.fontSize.split("px")[0]}
        onChange={(value) => {
          console.log(value);
          onUpdateTagStyle({ fontSize: `${value}px` });
        }}
      />
      <SearchTagColorInput
        label="Font Color"
        format="rgba"
        value={tagStyle?.color}
        onChange={(color) => {
          onUpdateTagStyle({ color });
        }}
      />

      <Stack style={{ gap: 0 }}>
        <Text color="white" size="xs" weight="bold">
          Top
        </Text>
        <Slider
          value={+(tagStyle?.top.split("%")[0] || 50)}
          onChange={(value) => {
            onUpdateTagStyle({ top: `${value}%` });
          }}
        />
      </Stack>
      <Stack style={{ gap: 0 }}>
        <Text color="white" size="xs" weight="bold">
          Left
        </Text>
        <Slider
          value={+(tagStyle?.left.split("%")[0] || 50)}
          onChange={(value) => {
            onUpdateTagStyle({ left: `${value}%` });
          }}
        />
      </Stack>

      <Button
        onClick={() => {
          if (theme?.name) {
            editThemeEntry({ name: theme.name, tag: tagStyle });
          }
        }}
      >
        Save Tag Style
      </Button>
    </SearchTagToolbarContainer>
  );
};

interface SearchTagToolbarProps {
  query: Record<string, string>;
  themes: ThemeEntryType[];
  theme?: ThemeEntryType;
  tagStyle?: ThemeEntryTagType;
  onThemeChange: (theme: ThemeEntryType) => void;
  onUpdateTagStyle: (style: Partial<ThemeEntryTagType>) => void;
  onGetTag: (index?: number) => string;
}

export default SearchTagToolbar;
