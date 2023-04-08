import { useRef, useState } from "react";
import styled from "@emotion/styled";
import { Groups, GroupType } from "../helpers/slide.helper";
import SlideGroupIndicatorMenu from "./SlideGroupIndicatorMenu";
import { SlideEntryType } from "../../../types/LibraryTypes";
import MediaSlide from "./MediaSlide";
import TextSlide from "./TextSlide";
import useProjectorScale from "../../../hooks/useProjectorScale";
interface SliderContainerProps {
  active?: boolean;
}

const SlideContainer = styled.div<SliderContainerProps>`
  border: 3px solid ${(p) => (p.active ? "#9DC08B" : "#ccc")};
  border-radius: 5px;
  cursor: pointer;
`;

const SlideGroupIndicator = styled.div<SlideGroupIndicatorProps>`
  height: 10px;
  background-color: ${(p) => p.groupId || "gray"};
  border-radius: 5px;
  justify-self: center;
`;

const Slide = ({
  slide,
  theme,
  active,
  onClick,
  onGroupChange,
}: SlideProps) => {
  const [openedGroupMenu, setOpenedGroupMenu] = useState(false);
  const slideRef = useRef<HTMLDivElement>(null);
  // TODO: Move this higher up
  const { value, height, width, projectorHeight, projectorWidth } =
    useProjectorScale({ width: 350 });

  return (
    <>
      <SlideContainer
        style={{
          overflow: "hidden",
          opacity: `${!height && !slide.media?.thumbnail ? 0 : 1}`,
          height: height,
          width: width,
        }}
        active={active}
        onClick={onClick}
      >
        {slide.media?.thumbnail ? (
          <MediaSlide slide={slide} />
        ) : (
          <div
            ref={slideRef}
            style={{
              height: projectorHeight,
              width: projectorWidth,
              transformOrigin: "left top",
              transform: `scale(${value})`,
            }}
            className={theme ? `theme-slide-${theme}` : ""}
          >
            <TextSlide slide={slide} />
          </div>
        )}
        {slide.group && (
          <SlideGroupIndicatorMenu
            opened={openedGroupMenu}
            onChange={setOpenedGroupMenu}
            // TODO: this needs to be dynamic to allow editing library files as well
            onGroupChange={onGroupChange}
          >
            <SlideGroupIndicator groupId={Groups[slide.group]} />
          </SlideGroupIndicatorMenu>
        )}
      </SlideContainer>
    </>
  );
};

interface SlideProps {
  slide: SlideEntryType;
  theme?: string;
  active: boolean;
  onClick: () => void;
  onGroupChange: (group: GroupType) => void;
}

interface SlideGroupIndicatorProps {
  groupId: Groups;
}

export default Slide;
