import {
  BaseDirectory,
  createDir,
  exists,
  readDir,
  readTextFile,
  writeTextFile,
} from "@tauri-apps/api/fs";
import { v4 as uuid } from "uuid";
import useStore from "../store";
import { LibraryEntryType, PlaylistEntryType } from "../types/LibraryTypes";

export const getLibraryDirContents = async () => {
  const hasLibrary = await exists("library", {
    dir: BaseDirectory.AppData,
  });
  if (!hasLibrary) {
    await createLibraryDir();
  }
  const content = await readDir("library", {
    dir: BaseDirectory.AppData,
    recursive: true,
  });
  useStore.getState().setLibraries(content);
};

export const createLibraryDir = async () => {
  await createDir(`library/Default`, {
    dir: BaseDirectory.AppData,
    recursive: true,
  });
  // Create a Demo slide
  const DemoLibrary: LibraryEntryType = {
    name: "Demo",
    slides: [
      {
        text: "This is a demo",
        group: "NONE",
      },
    ],
  };
  await writeTextFile(
    "library/Default/Demo.json",
    JSON.stringify(DemoLibrary),
    { dir: BaseDirectory.AppData }
  );
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
  parsedContent.theme = "default";
  return parsedContent;
};

export const create = async (name: string) => {
  await createDir(`library/${name}`, {
    dir: BaseDirectory.AppData,
    recursive: true,
  });
  await getLibraryDirContents();
};

export const addLibraryFile = async (content: LibraryEntryType) => {
  const fileExists = await exists(`library/Default/${content.name}`, {
    dir: BaseDirectory.AppData,
  });
  if (fileExists) return;
  await writeTextFile(
    `library/Default/${content.name}`,
    JSON.stringify(content),
    { dir: BaseDirectory.AppData }
  );
  await getLibraryDirContents();
};
