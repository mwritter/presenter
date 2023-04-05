import React, { ReactNode, useEffect, useState } from "react";
import useStore from "../../store";
import { buildCSS } from "../../helpers/theme.helper";

const AppStyle = () => {
  const [css, setCSS] = useState<string>("");
  const themes = useStore(({ themes }) => themes);
  useEffect(() => {
    setCSS(buildCSS(themes));
  }, [themes]);

  return <style>{css}</style>;
};

export default AppStyle;
