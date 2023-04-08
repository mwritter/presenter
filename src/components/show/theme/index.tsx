import styled from "@emotion/styled";
import { Button } from "@mantine/core";
import { BaseDirectory, readTextFile } from "@tauri-apps/api/fs";
import { CSSProperties, useCallback, useEffect, useState } from "react";
import {
  addThemeEntry,
  buildCSS,
  editThemeEntry,
} from "../../../helpers/theme.helper";
import ThemeFontEditSection from "./toolbar/font";
import ThemeStage from "./stage";
import useStore from "../../../store";
import {
  ThemeEntryStyleType,
  ThemeEntryStyleTypeKey,
  ThemeEntryType,
} from "../../../types/LibraryTypes";
import ThemeControls from "./controls";

const ThemeEditorContainer = styled.div`
  display: grid;
  grid-template:
    "controls toolbar"
    "stage toolbar";
  grid-template-columns: 1fr 250px;
  grid-template-rows: auto 1fr;
  height: 100vh;
  gap: 1rem;
`;

const ThemeToolbar = styled.div`
  grid-area: toolbar;
  display: flex;
  flex-direction: column;
  background-color: #21212a;
  padding: 1rem;
`;

const DEFAULT_VALUES = {
  fontFamily: "Arial",
  fontSize: "15",
  justifyContent: "start",
  alignItems: "start",
  color: "white",
  display: "flex",
  flexDirection: "column",
  whiteSpace: "nowrap",
};

const ThemeEditor = () => {
  const [selectedStyle, setSelectedStyle] =
    useState<Record<ThemeEntryStyleTypeKey, string>>(DEFAULT_VALUES);

  const { theme, setTheme } = useStore(({ theme, setTheme }) => ({
    theme,
    setTheme,
  }));

  const onFontFamilySelectChange = useCallback(
    (fontFamily: string) => setSelectedStyle((cur) => ({ ...cur, fontFamily })),
    []
  );

  const onVerticalAlignmentChange = useCallback(
    (justifyContent: string) =>
      setSelectedStyle((cur) => ({ ...cur, justifyContent })),
    []
  );

  const onHorizontalAlignmentChange = useCallback((alignItems: string) => {
    setSelectedStyle((cur) => ({ ...cur, alignItems }));
  }, []);

  const onFontSizeChange = useCallback(
    (fontSize: string) =>
      setSelectedStyle((cur) => ({
        ...cur,
        fontSize: `${Number(fontSize) || 0}px`,
      })),
    []
  );

  useEffect(() => {
    if (theme?.style) {
      setSelectedStyle(theme.style);
    }
  }, [theme]);

  return (
    <ThemeEditorContainer>
      <ThemeControls theme={theme} selectedStyle={selectedStyle} />
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
    </ThemeEditorContainer>
  );
};

export default ThemeEditor;
