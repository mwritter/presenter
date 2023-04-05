import { readDir } from "@tauri-apps/api/fs";
import { fontDir } from "@tauri-apps/api/path";
import { CSSProperties } from "react";

enum FontDirectories {
  SYSTEM,
  USER,
}

const getFontName = ({ name }: { name?: string }) => name?.split(".")[0] || "";

const getFontDirectory = async (directory: FontDirectories) => {
  if (directory === FontDirectories.SYSTEM) {
    return "/System/Library/Fonts/Supplemental";
  }
  return await fontDir();
};

export const getUserFonts = async () => {
  const userFontsDir = await getFontDirectory(FontDirectories.USER);
  const userFonts = await readDir(userFontsDir).then((fonts) =>
    fonts.map(getFontName)
  );
  const systemFonts = await readDir("/System/Library/Fonts/Supplemental").then(
    (fonts) => fonts.map(getFontName)
  );
  return [...new Set([...userFonts, ...systemFonts])]
    .sort()
    .map((fontName) => ({ value: fontName, label: fontName }));
};
