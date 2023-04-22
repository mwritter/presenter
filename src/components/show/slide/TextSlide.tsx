import { Text } from "@mantine/core";
import {
  SlideEntryType,
  ThemeEntryContainerType,
  ThemeEntryTagType,
} from "../../../types/LibraryTypes";
import { useEffect, useState } from "react";
import useStore from "../../../store";

const TextSlide = ({
  slide,
  containerStyle,
  tagStyle,
  themeName,
}: TextSlideProps) => {
  const [themeContainerStyles, setThemeContainerStyle] = useState<
    ThemeEntryContainerType | undefined
  >();
  const [themeTagStyles, setThemeTagStyle] = useState<
    ThemeEntryTagType | undefined
  >();
  const themes = useStore(({ themes }) => themes);
  useEffect(() => {
    if (themes && themeName) {
      const theme = themes.find(({ name }) => name === themeName);
      if (theme?.container) {
        setThemeContainerStyle(theme.container);
      }
      if (theme?.tag) {
        setThemeTagStyle(theme.tag);
      }
    }
  }, [themes, themeName]);
  return (
    <>
      <div
        style={{
          display: "grid",
          position: "absolute",
          border: `${themeName ? "none" : "1px solid green"}`,
          ...(containerStyle ?? themeContainerStyles),
        }}
      >
        {slide.text?.split("\n").map((text, idx) => (
          <Text style={{ zIndex: 1 }} unstyled key={idx}>
            {text}
          </Text>
        ))}
      </div>
      {slide.tag && (
        <Text style={tagStyle ?? themeTagStyles} unstyled>
          {slide.tag}
        </Text>
      )}
    </>
  );
};

interface TextSlideProps {
  slide: SlideEntryType;
  containerStyle?: Partial<ThemeEntryContainerType>;
  tagStyle?: ThemeEntryTagType;
  themeName?: string;
  index?: number;
}

export default TextSlide;
