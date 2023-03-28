import { Text } from "@mantine/core";
import { SlideEntryType } from "../../../types/LibraryTypes";
import { Groups, GroupType } from "../helpers/slide.helper";

const TextSlide = ({ slide, onGroupChange }: TextSlideProps) => {
  return (
    <>
      {slide.text?.split("\n").map((t, idx) => (
        <Text key={idx}>{t}</Text>
      ))}
    </>
  );
};

interface TextSlideProps {
  slide: SlideEntryType;
  onGroupChange: (groupId: GroupType) => void;
}

interface SlideGroupIndicatorProps {
  groupId: Groups;
}

export default TextSlide;
