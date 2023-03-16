import {
  BaseDirectory,
  createDir,
  readDir,
  readTextFile,
} from "@tauri-apps/api/fs";
import { v4 as uuid } from "uuid";
import useStore from "../store";
import { PlaylistEntryType } from "../types/LibraryTypes";

export const getLibraryDirContents = async () => {
  const content = await readDir("library", {
    dir: BaseDirectory.AppData,
    recursive: true,
  });
  useStore.getState().setLibraries(content);
};

export const getLibraryFileData = async (
  name: string
): Promise<PlaylistEntryType> => {
  const path = `library/Default/${name}`;
  const content = await readTextFile(path, {
    dir: BaseDirectory.AppData,
  });
  const parsedContent = JSON.parse(content);
  parsedContent.path = path;
  parsedContent.id = uuid();
  return parsedContent;
};

export const create = async (name: string) => {
  const library = await createDir(`library/${name}`, {
    dir: BaseDirectory.AppData,
    recursive: true,
  });
  await getLibraryDirContents();
};
