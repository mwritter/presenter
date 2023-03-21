import { BaseDirectory, readTextFile } from "@tauri-apps/api/fs";
import { useEffect, useState } from "react";

const getThemes = async () => {
  return await readTextFile(`themes/index.css`, { dir: BaseDirectory.AppData });
};

const ProjectorStyle = () => {
  const [themes, setThemes] = useState("");
  useEffect(() => {
    getThemes().then(setThemes);
  }, []);
  return <style>{themes}</style>;
};

export default ProjectorStyle;
