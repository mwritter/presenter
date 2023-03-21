import { BaseDirectory, readTextFile } from "@tauri-apps/api/fs";
import { useEffect, useState } from "react";
import { getThemeEnties } from "../../helpers/theme.helper";

const getThemes = async () => {
  await getThemeEnties();
  return await readTextFile(`themes/index.css`, { dir: BaseDirectory.AppData });
};

const PresenterStyle = () => {
  const [themes, setThemes] = useState("");
  useEffect(() => {
    getThemes().then(setThemes);
  }, []);
  return <style>{themes}</style>;
};

export default PresenterStyle;
