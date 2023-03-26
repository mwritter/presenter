import { GroupType } from "../components/show/helpers/slide.helper";

export type PlaylistType = {
  name: string;
  content: PlaylistEntryType[];
};

export type PlaylistEntryType = {
  id: string;
  theme: string;
  name?: string;
  path?: string;
  slides: SlideEntryType[] | PlaylistMediaEntryType[];
};

export type PlaylistMediaEntryType = MediaEntryType & {
  id: string;
};

export type MediaType = {
  name: string;
  path: string;
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
  text: string;
  group: GroupType;
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
}
