import { Text } from "@mantine/core";
import {
  SlideEntryType,
  ThemeEntryContainerType,
} from "../../../types/LibraryTypes";
import { useEffect, useState } from "react";
import useStore from "../../../store";

const TextSlide = ({ slide, containerStyle, themeName }: TextSlideProps) => {
  const [styles, setStyles] = useState<ThemeEntryContainerType | undefined>();
  const themes = useStore(({ themes }) => themes);
  useEffect(() => {
    if (themes && themeName) {
      console.log(themeName);
      const theme = themes.find(({ name }) => name === themeName);
      if (theme?.container) {
        setStyles(theme.container);
      }
    }
  }, [themes, themeName]);
  return (
    <div
      style={{
        display: "grid",
        position: "absolute",
        border: `${themeName ? "none" : "1px solid green"}`,
        ...(containerStyle ?? styles),
      }}
    >
      {slide.text?.split("\n").map((text, idx) => (
        <Text style={{ zIndex: 1 }} unstyled key={idx}>
          {text}
        </Text>
      ))}
    </div>
  );
};

interface TextSlideProps {
  slide: SlideEntryType;
  containerStyle?: ThemeEntryContainerType;
  themeName?: string;
}

export default TextSlide;
