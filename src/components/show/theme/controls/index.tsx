import styled from "@emotion/styled";
import { Button } from "@mantine/core";
import React from "react";
import { editThemeEntry } from "../../../../helpers/theme.helper";
import { ThemeEntryType } from "../../../../types/LibraryTypes";

const ThemeControlsStyled = styled.div`
  grid-area: controls;
`;

const ThemeControls = ({ theme, selectedStyle }: ThemeControlsProps) => {
  return (
    <ThemeControlsStyled>
      <Button
        onClick={() => {
          if (theme) {
            editThemeEntry(theme.name, selectedStyle);
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
}

export default ThemeControls;
