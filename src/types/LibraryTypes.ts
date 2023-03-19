import { GroupType } from "../components/show/helpers/slide.helper";

export type PlaylistType = {
  name: string;
  content: PlaylistEntryType[];
};

export type PlaylistEntryType = {
  id: string;
  name?: string;
  path?: string;
  slides: SlideEntryType[];
};

export type LibraryEntryType = {
  name: string;
  slides: SlideEntryType[];
};

export type SlideType = {
  name: string;
  slides: SlideEntryType[];
};

export type SlideEntryType = {
  id: string;
  text: string;
  group: GroupType;
  theme: string;
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
