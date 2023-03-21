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
  await writeTextFile("themes/index.json", JSON.stringify(["demo"]), {
    dir: BaseDirectory.AppData,
  });
  await writeTextFile(
    "themes/index.css",
    `
    /* ====== demo ======  */
    .theme-projector-demo {
      display: flex;
      flex-direction: column;
      background: linear-gradient(#e66465, #9198e5);
    }
    .theme-slide-demo {
      display: flex;
      justify-content: center;
      align-items: center;
      color: white;
      font-size: 80px;
    }
    /* ====== demo ======  */
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
