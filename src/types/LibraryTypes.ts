import { CSSProperties } from "react";
import { GroupType } from "../components/show/helpers/slide.helper";

export type PlaylistType = {
  name: string;
  content: PlaylistEntryType[];
};

export type PlaylistEntryType = {
  id: string;
  theme?: string;
  name: string;
  path?: string;
  slides: SlideEntryType[];
};

export type PlaylistMediaEntryType = MediaEntryType & {
  id: string;
};

export type MediaType = {
  id: string;
  name: string;
  items: MediaEntryType[];
};

export type MediaEntryType = {
  name: string;
  thumbnail: string;
  source: string;
};

export type LibraryEntryType = {
  name: string;
  path: string;
  slides: LibrarySlideEntryType[];
};

export type SlideType = {
  name: string;
  slides: SlideEntryType[];
};

export type SlideEntryType = {
  id: string;
  text?: string;
  group?: GroupType;
  media?: MediaEntryType;
  tag?: string;
};

export type LibrarySlideEntryType = {
  id: string;
  text: string;
  group: GroupType;
};

export type BibleType = {
  name: string;
  version: string;
  chapters: BibleChapterType[];
};

export type BibleChapterType = {
  verses: BibleVerseType[];
};

export type BibleVerseType = {
  text: string;
};

export type ModeType = PresenterMode;

export enum PresenterMode {
  PLAYLIST,
  LIBRARY,
  MEDIA,
  THEME,
  SEARCH,
}

export type ThemeEntryType = {
  name: string;
  style?: Record<ThemeEntryStyleTypeKey, string>;
  media?: {
    source: string;
  };
  container: ThemeEntryContainerType;
  tag?: ThemeEntryTagType;
};

export type ThemeEntryStyleType = {
  alignItems: string;
  justifyContent: string;
  fontFamily: string;
  fontSize: string;
  color: string;
  display: string;
  flexDirection: string;
  whiteSpace: string;
  backgroundImage: string;
  backgroundSize: string;
  backgroundRepeat: string;
  backgroundPosition: string;
};

export type ThemeEntryContainerType = {
  height: CSSProperties["height"];
  width: CSSProperties["width"];
  top: CSSProperties["top"];
  left: CSSProperties["left"];
  alignContent: CSSProperties["alignContent"];
  justifyContent: CSSProperties["justifyContent"];
  display: CSSProperties["display"];
  textAlign: CSSProperties["textAlign"];
};

export type ThemeEntryTagType = {
  top: CSSProperties["top"];
  left: CSSProperties["left"];
  fontSize: CSSProperties["fontSize"];
  fontFamily: CSSProperties["fontFamily"];
  color: CSSProperties["color"];
};

export type ThemeEntryStyleTypeKey = keyof ThemeEntryStyleType;
export type ThemeEntryContainerTypeKey = keyof ThemeEntryContainerType;
export type ThemeEntryTagTypeKey = keyof ThemeEntryTagType;

export type SearchEntryType = {
  name: string;
  type: string;
  identifier: string;
  fields: SearchEntryField[];
  tag?: string;
  extractor: {
    path?: string;
    keys?: string[];
    type?: string;
    url?: string;
    urlJSON?: string;
    headers?: string;
    args?: string[];
    cmd?: string;
  };
  validator: Record<string, SearchValidator>;
};

export type SearchEntryField = {
  id: string;
  name: string;
  type: string;
  variables: string[];
  delimiters?: string[];
  data?: string[];
};

export type SearchValidator = {
  values?: string[];
  pattern?: string;
  type?: string;
  path?: string;
  required?: boolean;
  minLength?: number;
  identifier?: string;
  tag?: string;
  default?: string;
};
