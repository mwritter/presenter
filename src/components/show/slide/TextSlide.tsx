import { Text } from "@mantine/core";
import { SlideEntryType } from "../../../types/LibraryTypes";

const TextSlide = ({ slide, contentEditable = false }: TextSlideProps) => {
  return (
    <>
      {slide.text?.split("\n").map((text, idx) => (
        <Text contentEditable={contentEditable} unstyled key={idx}>
          {text}
        </Text>
      ))}
    </>
  );
};

interface TextSlideProps {
  slide: SlideEntryType;
  contentEditable?: boolean;
}

export default TextSlide;
