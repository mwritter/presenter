import {
  BaseDirectory,
  createDir,
  exists,
  readTextFile,
  writeTextFile,
} from "@tauri-apps/api/fs";
import { ThemeEntryType } from "../types/LibraryTypes";

export const createThemeDir = async () => {
  await createDir("themes", {
    dir: BaseDirectory.AppData,
    recursive: true,
  });
  await writeTextFile(
    "themes/index.json",
    JSON.stringify([{ name: "default" }]),
    {
      dir: BaseDirectory.AppData,
    }
  );
  await writeTextFile(
    "themes/index.css",
    `
    /* ====== default ======  */
    .theme-projector-default {
      display: flex;
      flex-direction: column;
      background: black;
    }
    .theme-slide-default {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      color: white;
      font-size: 80px;
      white-space: nowrap;
    }
    /* ====== default ======  */
  `,
    { dir: BaseDirectory.AppData }
  );
};

export const getThemeEnties = async () => {
  const hasThemes = await exists("themes", {
    dir: BaseDirectory.AppData,
  });
  if (!hasThemes) {
    await createThemeDir();
  }
  const themes = await readTextFile("themes/index.json", {
    dir: BaseDirectory.AppData,
  });
  const entries: ThemeEntryType[] = JSON.parse(themes);
  return entries;
};

// TODO: Remove theme
// 1. remove the entry from index.json
// 2. remove the css associated with the theme in index.css
// 3. add a media aspect to the Theme
//    - the theme creates the css but we need to some how store a media source as well
//    - we'll use this media source to attach to each slide media: { source: 'path/to/src' }
//    - this way the Projector can set a background image or video bind the text
