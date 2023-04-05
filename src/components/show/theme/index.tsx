import styled from "@emotion/styled";
import { Button } from "@mantine/core";
import { BaseDirectory, readTextFile } from "@tauri-apps/api/fs";
import { CSSProperties, useCallback, useEffect, useState } from "react";
import {
  addThemeEntry,
  buildCSS,
  editThemeEntry,
} from "../../../helpers/theme.helper";
import ThemeFontEditSection from "../../toolbar/font";
import ThemeStage from "./stage";
import useStore from "../../../store";
import { ThemeEntryStyleType } from "../../../types/LibraryTypes";

const ThemeEditorContainer = styled.div`
  display: grid;
  grid-template: "stage toolbar";
  grid-template-columns: 1fr 250px;
  height: 100vh;
  padding: 1rem;
  gap: 1rem;
`;

const ThemeToolbar = styled.div`
  grid-area: toolbar;
  display: flex;
  flex-direction: column;
  padding: 1rem 0;
`;

const DEFAULT_VALUES = {
  fontFamily: "Arial",
  fontSize: 15,
  justifyContent: "start",
  alignItems: "start",
  color: "white",
  display: "flex",
  flexDirection: "column",
  whiteSpace: "nowrap",
} as ThemeEntryStyleType;

const ThemeEditor = () => {
  const [selectedStyle, setSelectedStyle] =
    useState<ThemeEntryStyleType>(DEFAULT_VALUES);

  const { theme, setTheme } = useStore(({ theme, setTheme }) => ({
    theme,
    setTheme,
  }));

  const onFontFamilySelectChange = useCallback(
    (fontFamily: CSSProperties["fontFamily"]) =>
      setSelectedStyle((cur) => ({ ...cur, fontFamily })),
    []
  );

  const onHorizontalAlignmentChange = useCallback(
    (justifyContent: CSSProperties["justifyContent"]) =>
      setSelectedStyle((cur) => ({ ...cur, justifyContent })),
    []
  );

  const onVerticalAlignmentChange = useCallback(
    (alignItems: CSSProperties["alignItems"]) => {
      console.log("here");
      setSelectedStyle((cur) => ({ ...cur, alignItems }));
    },
    []
  );

  const onFontSizeChange = useCallback(
    (fontSize: CSSProperties["fontSize"]) =>
      setSelectedStyle((cur) => ({ ...cur, fontSize: `${fontSize}px` })),
    []
  );

  useEffect(() => {
    console.log(theme?.style);
    if (theme?.style) {
      setSelectedStyle(theme.style);
    }
  }, [theme]);

  return (
    <ThemeEditorContainer>
      <ThemeStage selectedStyle={selectedStyle} />
      <ThemeToolbar>
        <ThemeFontEditSection
          selectedStyle={selectedStyle}
          onFontFamilySelectChange={onFontFamilySelectChange}
          onHorizontalAlignmentChange={onHorizontalAlignmentChange}
          onVerticalAlignmentChange={onVerticalAlignmentChange}
          onFontSizeChange={onFontSizeChange}
        />
      </ThemeToolbar>
      <Button
        onClick={() => {
          if (theme) {
            editThemeEntry(theme.name, selectedStyle);
          }
        }}
      >
        Save it
      </Button>
    </ThemeEditorContainer>
  );
};

export default ThemeEditor;
