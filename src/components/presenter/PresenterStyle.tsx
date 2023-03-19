import { readTextFile } from "@tauri-apps/api/fs";
import { useEffect, useState } from "react";

const getThemes = async () => {
  return await readTextFile(
    `/Users/matthewritter/Library/Application Support/com.presenter-lite/themes/index.css`
  );
};

const PresenterStyle = () => {
  const [themes, setThemes] = useState("");
  useEffect(() => {
    getThemes().then(setThemes);
  }, []);
  return <style>{themes}</style>;
};

export default PresenterStyle;
