import { useEffect, useState } from "react";
import useStore from "../../store";
import { buildCSS, getThemeEnties } from "../../helpers/theme.helper";
import { emit, listen } from "@tauri-apps/api/event";

const listenForStyleChange = async (callBack: (payload: string) => void) => {
  await listen<string>("set-styles", ({ payload }) => {
    callBack(payload);
  });
};

const SlideThemeStyles = () => {
  const [css, setCSS] = useState<string>("");
  const themes = useStore(({ themes }) => themes);

  useEffect(() => {
    const unlisten = listenForStyleChange(setCSS);
  }, []);

  // TODO: the projector styles are only loaded when app is init
  // we need to set the styles for all windows based on an emit event
  // intead of just useState here
  useEffect(() => {
    if (themes) {
      emit("set-styles", buildCSS(themes));
    } else {
      getThemeEnties();
    }
  }, [themes]);

  return <style>{css}</style>;
};

export default SlideThemeStyles;
