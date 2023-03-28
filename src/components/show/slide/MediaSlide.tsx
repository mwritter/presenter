import React from "react";
import { SlideEntryType } from "../../../types/LibraryTypes";

const MediaSlide = ({ slide }: MediaSlideProps) => {
  return <img src={slide.media?.thumbnail} width="100%" />;
};

interface MediaSlideProps {
  slide: SlideEntryType;
}

export default MediaSlide;
