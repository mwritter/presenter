import {
  BaseDirectory,
  createDir,
  exists,
  readTextFile,
  writeTextFile,
} from "@tauri-apps/api/fs";
import { CSSProperties } from "react";
import { ThemeEntryType } from "../types/LibraryTypes";
import { defatulTheme } from "../components/show/theme/styles/default";
import useStore from "../store";

/**
 * Theme Entries Shape
 * [
 *    {
 *      name: 'default',
 *      style: {
 *        fontFamily: "Arial"
 *        ...
 *      },
 *      media: { source: "path/to/image/use/for/background" }
 *    },
 *    ...
 * ]
 */

export const createThemeDir = async () => {
  await createDir("themes", {
    dir: BaseDirectory.AppData,
    recursive: true,
  });
  await writeTextFile(
    "themes/index.json",
    JSON.stringify([
      {
        name: "default",
        style: defatulTheme,
      },
    ]),
    {
      dir: BaseDirectory.AppData,
    }
  );
};

export const write = async (content: ThemeEntryType[]) => {
  await writeTextFile("themes/index.json", JSON.stringify(content), {
    dir: BaseDirectory.AppData,
  });
  await getThemeEnties();
};

export const addThemeEntry = async (
  name: string,
  style: ThemeEntryType["style"]
) => {
  const currentThemes = useStore.getState().themes;
  const newThemes: ThemeEntryType[] = [...currentThemes, { name, style }];

  await write(newThemes);
};

export const editThemeEntry = async (
  name: string,
  style: ThemeEntryType["style"]
) => {
  const currentThemes = useStore.getState().themes;
  const updatedThemes = currentThemes.map((theme) => {
    if (theme.name === name) {
      return { ...theme, style };
    }
    return theme;
  });

  await write(updatedThemes);
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
  useStore.getState().setThemes(entries);
};

export const buildCSS = (themes: ThemeEntryType[]) => {
  return themes.reduce((pre, cur) => {
    return `${pre} .theme-slide-${cur.name} ${JSON.stringify(cur.style)
      .replace(/([a-z])([A-Z])/g, "$1-$2")
      .toLowerCase()
      .replaceAll(/\"/g, "")
      .replaceAll(",", ";")}`;
  }, "");
};

// TODO: Remove theme
// 1. remove the entry from index.json
// 2. remove the css associated with the theme in index.css
// 3. add a media aspect to the Theme
//    - the theme creates the css but we need to some how store a media source as well
//    - we'll use this media source to attach to each slide media: { source: 'path/to/src' }
//    - this way the Projector can set a background image or video bind the text
