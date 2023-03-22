import {
  BaseDirectory,
  createDir,
  exists,
  readTextFile,
  writeTextFile,
} from "@tauri-apps/api/fs";

export const createThemeDir = async () => {
  await createDir("themes", {
    dir: BaseDirectory.AppData,
    recursive: true,
  });
  await writeTextFile("themes/index.json", JSON.stringify(["default"]), {
    dir: BaseDirectory.AppData,
  });
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
  const themeEntries = await readTextFile("themes/index.json", {
    dir: BaseDirectory.AppData,
  });
  return JSON.parse(themeEntries);
};

// TODO: Remove theme
// 1. remove the entry from index.json
// 2. remove the css associated with the theme in index.css
