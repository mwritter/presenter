import {
  BaseDirectory,
  readDir,
  readTextFile,
  renameFile,
  writeTextFile,
} from "@tauri-apps/api/fs";
import { v4 as uuid } from "uuid";
import useStore from "../store";
import {
  PlaylistEntryType,
  PlaylistType,
  SlideEntryType,
} from "../types/LibraryTypes";
import { getLibraryFileData } from "./library.helper";

export const getPlaylistsDirContents = async () => {
  const contents = await readDir("playlists", { dir: BaseDirectory.AppData });
  useStore
    .getState()
    .setPlaylists(contents.filter((r) => r.name && !/^\./.test(r.name)));
};

export const readPlaylistFile = async (
  path: string | null
): Promise<PlaylistType> => {
  if (!path) return Promise.reject();
  const contents = await readTextFile(path);
  return JSON.parse(contents);
};

export const getPlaylistData = async (path: string): Promise<PlaylistType> => {
  const content = await readTextFile(path);
  return JSON.parse(content);
};

export const createNewPlaylist = async (name: string) => {
  const playlistFile: PlaylistType = {
    name,
    content: [],
  };
  await writeTextFile(`playlists/${name}`, JSON.stringify(playlistFile), {
    dir: BaseDirectory.AppData,
  });
};

export const write = async (name: string, playlist: PlaylistType) => {
  const content = JSON.stringify(playlist);
  await writeTextFile(`playlists/${name}`, content, {
    dir: BaseDirectory.AppData,
  });
  useStore.getState().setPlaylist(playlist);
  await getPlaylistsDirContents();
};

export const removeContent = async (name: string, id: string) => {
  const playlist = await parsePlaylist(name);
  const updatedContent = playlist.content.filter((c) => c.id !== id);
  playlist.content = updatedContent;
  await write(name, playlist);
};

export const parsePlaylist = async (
  name: string | null
): Promise<PlaylistType> => {
  if (!name) return Promise.reject();
  const contents = await readTextFile(`playlists/${name}`, {
    dir: BaseDirectory.AppData,
  });
  return JSON.parse(contents);
};

export const editPlaylistSlideData = async (
  slideId: string,
  sectionId: string,
  content: Partial<SlideEntryType>,
  playlist: PlaylistType
) => {
  // You need a playlist selected
  if (!useStore.getState().playlist) return Promise.reject();
  let found = false;
  // Loop over playlist content
  for (const section of playlist.content) {
    if (section.id === sectionId) {
      if (section?.slides.find((s) => s.id === slideId)) {
        found = true;
        section.slides = section.slides.map((s) => {
          if (s.id === slideId) {
            return { ...s, ...content };
          }
          return s;
        });
      }
      break;
    }
  }
  if (found) {
    await write(playlist.name, playlist);
  }
};

export const editAllPlaylistSlideData = async (
  content: Partial<SlideEntryType>,
  playlist: PlaylistType
) => {
  for (const section of playlist.content) {
    const slides = section.slides.map((slide) => ({ ...slide, ...content }));
    section.slides = slides;
  }
  await write(playlist.name, playlist);
};

export const editAllPlaylistSectionSlidesData = async (
  content: Partial<SlideEntryType>,
  playlistSection: PlaylistEntryType
) => {
  const slides = playlistSection.slides.map((slide) => ({
    ...slide,
    ...content,
  }));
  const playlist = useStore.getState().playlist;
  if (playlist) {
    const updatedContent = playlist?.content.map((section) => {
      if (section.id === playlistSection.id) {
        section.slides = slides;
      }
      return section;
    });
    playlist.content = updatedContent;
    await write(playlist.name, playlist);
  }
};

export const renamePlaylist = async (name: string, playlist: PlaylistType) => {
  const newName = `${name}.json`;
  await renameFile(`playlists/${playlist.name}`, `playlists/${newName}`, {
    dir: BaseDirectory.AppData,
  });
  playlist.name = newName;
  await write(playlist.name, playlist);
};

export const create = async (name: string) => {
  await createNewPlaylist(name);
  await getPlaylistsDirContents();
};

export const addContent = async (name: string, libraryName: string) => {
  const playlist = await parsePlaylist(name);
  const content = await getLibraryFileData(libraryName);
  playlist.content = [...playlist.content, content];
  await write(name, playlist);
};
