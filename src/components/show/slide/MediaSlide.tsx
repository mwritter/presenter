import { SlideEntryType } from "../../../types/LibraryTypes";

const MediaSlide = ({ slide }: MediaSlideProps) => {
  return <img src={slide.media?.thumbnail} height="100%" />;
};

interface MediaSlideProps {
  slide: SlideEntryType;
}

export default MediaSlide;
