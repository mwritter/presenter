import styled from "@emotion/styled";
import {
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
import FontSizeInput from "../font/FontSizeInput";
import FontFamilySelect from "../font/FontFamilySelect";
import useStore from "../../../../../store";
import { ThemeEntryTagType } from "../../../../../types/LibraryTypes";

const ThemeToolbarSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const ThemeTagColorInput = styled(ColorInput)<ColorInputProps>`
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

const ThemeTagEditSection = ({
  tagStyle,
  tagText,
  onSetTagStyle,
  onSetTagText,
}: ThemeTagEditSectionProps) => {
  const theme = useStore(({ theme }) => theme);

  return (
    <ThemeToolbarSection>
      <Title order={6} color="white">
        TAG
      </Title>
      <TextInputStyled
        label="Tag Text"
        value={tagText}
        onChange={(evt) => onSetTagText(evt.target.value)}
      />
      <FontFamilySelect
        value={tagStyle?.fontFamily || theme?.style?.fontFamily}
        onChange={(value) => {
          onSetTagStyle({ fontFamily: value });
        }}
      />
      <FontSizeInput
        value={tagStyle?.fontSize?.toString().split("px")[0] || 0}
        onChange={(value) => {
          onSetTagStyle({ fontSize: `${value}px` });
        }}
      />
      <ThemeTagColorInput
        label="Font Color"
        format="rgba"
        value={tagStyle?.color}
        onChange={(color) => {
          onSetTagStyle({ color });
        }}
      />

      <Stack style={{ gap: 0 }}>
        <Text color="white" size="xs" weight="bold">
          Top
        </Text>
        <Slider
          value={+(tagStyle?.top?.toString().split("%")[0] || 50)}
          onChange={(value) => {
            const top = `${value}%`;
            onSetTagStyle({ top });
          }}
        />
      </Stack>
      <Stack style={{ gap: 0 }}>
        <Text color="white" size="xs" weight="bold">
          Left
        </Text>
        <Slider
          value={+(tagStyle?.left?.toString().split("%")[0] || 50)}
          onChange={(value) => {
            const left = `${value}%`;
            onSetTagStyle({ left });
          }}
        />
      </Stack>
    </ThemeToolbarSection>
  );
};

interface ThemeTagEditSectionProps {
  tagStyle?: ThemeEntryTagType;
  tagText: string;
  onSetTagStyle: (style: Partial<ThemeEntryTagType>) => void;
  onSetTagText: (text: string) => void;
}

export default ThemeTagEditSection;
