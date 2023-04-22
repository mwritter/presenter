import styled from "@emotion/styled";
import { Button } from "@mantine/core";
import React from "react";
import { editThemeEntry } from "../../../../helpers/theme.helper";
import {
  ThemeEntryContainerType,
  ThemeEntryType,
} from "../../../../types/LibraryTypes";

const ThemeControlsStyled = styled.div`
  grid-area: controls;
  margin-top: 1rem;
`;

const ThemeControls = ({
  theme,
  selectedStyle,
  containerStyle,
}: ThemeControlsProps) => {
  return (
    <ThemeControlsStyled>
      <Button
        onClick={() => {
          if (theme) {
            editThemeEntry({
              name: theme.name,
              style: selectedStyle,
              container: containerStyle,
            });
          }
        }}
      >
        Save Theme
      </Button>
    </ThemeControlsStyled>
  );
};

interface ThemeControlsProps {
  theme: ThemeEntryType | null;
  selectedStyle: Record<string, string>;
  containerStyle: ThemeEntryContainerType;
}

export default ThemeControls;
