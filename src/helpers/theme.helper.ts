import { BaseDirectory, readTextFile } from "@tauri-apps/api/fs";

export const getThemeEnties = async () => {
  const themeEntries = await readTextFile("themes/index.json", {
    dir: BaseDirectory.AppData,
  });
  return JSON.parse(themeEntries);
};
