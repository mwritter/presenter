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
import {
  LibraryEntryType,
  LibrarySlideEntryType,
  PlaylistEntryType,
} from "../types/LibraryTypes";

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
    path: "library/Default/Demo.json",
    slides: [
      {
        id: uuid(),
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

export const getLibraryFileDataForPlaylist = async (
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

export const getLibraryFileData = async (
  name: string
): Promise<LibraryEntryType> => {
  const path = `library/Default/${name}`;
  const content = await readTextFile(path, {
    dir: BaseDirectory.AppData,
  });
  const parsedContent = JSON.parse(content);
  parsedContent.path = path;
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
  const fileExists = await exists(content.path, {
    dir: BaseDirectory.AppData,
  });
  if (fileExists) return;
  await writeTextFile(content.path, JSON.stringify(content), {
    dir: BaseDirectory.AppData,
  });
  await getLibraryDirContents();
};

export const editLibrarySlideData = async (
  content: Partial<LibrarySlideEntryType>,
  slideId: string
) => {
  const library = useStore.getState().library;
  if (library) {
    const slides = library.slides.map((slide) => {
      if (slide.id === slideId) {
        return { ...slide, ...content };
      }
      return slide;
    });
    library.slides = slides;
    await write(library);
  }
};

export const write = async (library: LibraryEntryType) => {
  const content = JSON.stringify(library);
  await writeTextFile(`library/Default/${library.name}`, content, {
    dir: BaseDirectory.AppData,
  });
  useStore.getState().setLibrary(library);
  await getLibraryDirContents();
};
