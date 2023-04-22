import styled from "@emotion/styled";
import { CSSProperties, useCallback, useEffect, useRef, useState } from "react";

import ThemeFontEditSection from "./toolbar/font";
import ThemeStage from "./stage";
import useStore from "../../../store";
import {
  ThemeEntryContainerTypeKey,
  ThemeEntryStyleTypeKey,
  ThemeEntryTagType,
} from "../../../types/LibraryTypes";
import ThemeControls from "./controls";
import { Select, TextInput } from "@mantine/core";
import { getMediaDirContents } from "../../../helpers/media.helper";
import BackgroundPickerSelect from "./toolbar/background/BackgroundPickerSelect";
import { convertFileSrc } from "@tauri-apps/api/tauri";
import { open } from "@tauri-apps/api/shell";
import ThemeBackgroundEditSection from "./toolbar/background";
import ThemeContainerEditSection from "./toolbar/container";
import ThemeTagEditSection from "./toolbar/tag";

const ThemeEditorContainer = styled.div`
  display: grid;
  grid-template:
    "controls toolbar"
    "stage toolbar";
  grid-template-columns: 1fr 350px;
  grid-template-rows: auto 1fr;
  height: 100vh;
  overflow: hidden;
  gap: 1rem;
  margin-left: 1rem;
`;

const ThemeToolbar = styled.div`
  grid-area: toolbar;
  display: flex;
  flex-direction: column;
  background-color: #21212a;
  padding: 1rem;
  overflow-y: scroll;
`;

const DEFAULT_VALUES: Record<ThemeEntryStyleTypeKey, string> = {
  fontFamily: "Arial",
  fontSize: "15",
  justifyContent: "start",
  alignItems: "start",
  color: "white",
  display: "flex",
  flexDirection: "column",
  whiteSpace: "nowrap",
  backgroundImage: "",
  backgroundSize: "cover",
  backgroundRepeat: "no-repeat",
  backgroundPosition: "center",
};

const DEFAULT_CONTAINER_VALUES: Record<ThemeEntryContainerTypeKey, string> = {
  display: "grid",
  justifyContent: "start",
  alignContent: "start",
  height: "",
  width: "",
  top: "0",
  left: "0",
};

const ThemeEditor = () => {
  const [selectedStyle, setSelectedStyle] =
    useState<Record<ThemeEntryStyleTypeKey, string>>(DEFAULT_VALUES);
  const [containerStyle, setContainerStyle] = useState<
    Record<ThemeEntryContainerTypeKey, string>
  >(DEFAULT_CONTAINER_VALUES);
  const [tagStyle, setTagStyle] = useState<ThemeEntryTagType>();
  const [tagText, setTagText] = useState<string>("Tag Text");

  const { theme } = useStore(({ theme }) => ({
    theme,
  }));

  const onFontFamilySelectChange = useCallback(
    (fontFamily: string) => setSelectedStyle((cur) => ({ ...cur, fontFamily })),
    []
  );

  const onVerticalAlignmentChange = useCallback(
    (alignContent: string) =>
      setContainerStyle((cur) => ({ ...cur, alignContent })),
    []
  );

  const onHorizontalAlignmentChange = useCallback((justifyContent: string) => {
    setContainerStyle((cur) => ({ ...cur, justifyContent }));
  }, []);

  const onFontSizeChange = useCallback(
    (fontSize: string) =>
      setSelectedStyle((cur) => ({
        ...cur,
        fontSize: `${Number(fontSize) || 0}px`,
      })),
    []
  );

  const onContainerLeftChange = useCallback(
    (left: number) => {
      setContainerStyle((cur) => ({
        ...cur,
        left: `${left}%`,
      }));
    },
    [containerStyle]
  );

  const onContainerTopChange = useCallback((top: number) => {
    setContainerStyle((cur) => ({
      ...cur,
      top: `${top}%`,
    }));
  }, []);

  const onContainerWidthChange = useCallback((width: number) => {
    setContainerStyle((cur) => ({ ...cur, width: `${width}%` }));
  }, []);

  const onContainerHeightChange = useCallback((height: number) => {
    setContainerStyle((cur) => ({ ...cur, height: `${height}%` }));
  }, []);

  const onBackgroundImageChange = useCallback((background: string) => {
    setSelectedStyle((cur) => ({
      ...cur,
      backgroundImage: background ? `url(${background})` : "",
    }));
  }, []);

  const onBackgroundSizeChange = useCallback((size: string) => {
    setSelectedStyle((cur) => ({
      ...cur,
      backgroundSize: size,
    }));
  }, []);

  useEffect(() => {
    getMediaDirContents();
  }, []);

  const onSetTagStyles = useCallback((style: Partial<ThemeEntryTagType>) => {
    setTagStyle((cur) => ({ ...cur, ...style } as ThemeEntryTagType));
  }, []);

  useEffect(() => {
    if (theme?.style) {
      setSelectedStyle((cur) => ({ ...cur, ...theme.style }));
    }
    if (theme?.container) {
      setContainerStyle((cur) => ({ ...cur, ...theme.container }));
    }
    if (theme?.tag) {
      setTagStyle((cur) => ({ ...cur, ...theme.tag } as ThemeEntryTagType));
    }
  }, [theme]);

  return (
    <ThemeEditorContainer>
      <ThemeControls
        theme={theme}
        selectedStyle={selectedStyle}
        containerStyle={containerStyle}
        tagStyle={tagStyle as ThemeEntryTagType}
      />
      <ThemeStage
        selectedStyle={selectedStyle}
        containerStyle={containerStyle}
        tagStyle={tagStyle as ThemeEntryTagType}
        tagText={tagText}
      />
      <ThemeToolbar>
        <ThemeFontEditSection
          containerStyle={containerStyle}
          selectedStyle={selectedStyle}
          onFontFamilySelectChange={onFontFamilySelectChange}
          onHorizontalAlignmentChange={onHorizontalAlignmentChange}
          onVerticalAlignmentChange={onVerticalAlignmentChange}
          onFontSizeChange={onFontSizeChange}
        />
        <ThemeContainerEditSection
          containerStyle={containerStyle}
          onContainerLeftChange={onContainerLeftChange}
          onContainerTopChange={onContainerTopChange}
          onContainerWidthChange={onContainerWidthChange}
          onContainerHeightChange={onContainerHeightChange}
        />
        <ThemeBackgroundEditSection
          selectedStyle={selectedStyle}
          onBackgroundImageChange={onBackgroundImageChange}
          onBackgroundSizeChange={onBackgroundSizeChange}
        />
        <ThemeTagEditSection
          tagStyle={tagStyle}
          tagText={tagText}
          onSetTagText={setTagText}
          onSetTagStyle={onSetTagStyles}
        />
      </ThemeToolbar>
    </ThemeEditorContainer>
  );
};

export default ThemeEditor;
