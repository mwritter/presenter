import { Text } from "@mantine/core";
import { SlideEntryType } from "../../../types/LibraryTypes";

const TextSlide = ({ slide }: TextSlideProps) => {
  return (
    <>
      {slide.text?.split("\n").map((text, idx) => (
        <Text unstyled key={idx}>
          {text}
        </Text>
      ))}
    </>
  );
};

interface TextSlideProps {
  slide: SlideEntryType;
}

export default TextSlide;
