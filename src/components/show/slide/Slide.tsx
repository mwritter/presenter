import { CSSProperties, useRef, useState } from "react";
import styled from "@emotion/styled";
import { Groups, GroupType } from "../helpers/slide.helper";
import SlideGroupIndicatorMenu from "./SlideGroupIndicatorMenu";
import {
  SlideEntryType,
  ThemeEntryContainerType,
  ThemeEntryTagType,
} from "../../../types/LibraryTypes";
import MediaSlide from "./MediaSlide";
import TextSlide from "./TextSlide";
import useProjectorScale from "../../../hooks/useProjectorScale";
interface SliderContainerProps {
  active?: boolean;
}

const SlideContainer = styled.div<SliderContainerProps>`
  border: 3px solid ${(p) => (p.active ? "#d7be62" : "#ccc")};
  border-radius: 5px;
  cursor: pointer;
  background-color: black;
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
  active = false,
  onClick,
  onGroupChange,
  size,
  style = {},
  index,
  tagStyle,
  containerStyle,
}: SlideProps) => {
  const [openedGroupMenu, setOpenedGroupMenu] = useState(false);
  const slideRef = useRef<HTMLDivElement>(null);
  const { value, height, width, projectorHeight, projectorWidth } =
    useProjectorScale({ width: size || 350 });

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
        {/* TODO figure out media slide with text */}
        {slide.media?.thumbnail ? (
          <MediaSlide slide={slide} />
        ) : slide.id === "message-preview" ? (
          <div
            ref={slideRef}
            style={{
              height: projectorHeight,
              width: projectorWidth,
              transformOrigin: "left top",
              transform: `scale(${value})`,
            }}
          >
            <span className="theme-slide-message" style={style || {}}>
              <TextSlide themeName={theme} slide={slide} />
            </span>
          </div>
        ) : (
          <div
            ref={slideRef}
            style={{
              height: projectorHeight,
              width: projectorWidth,
              transformOrigin: "left top",
              transform: `scale(${value})`,
              ...style,
            }}
            className={theme ? `theme-slide-${theme}` : "theme-slide-default"}
          >
            <TextSlide
              index={index}
              themeName={theme}
              slide={slide}
              tagStyle={tagStyle}
              containerStyle={containerStyle}
            />
          </div>
        )}
        {slide.group && onGroupChange && (
          <SlideGroupIndicatorMenu
            opened={openedGroupMenu}
            onChange={setOpenedGroupMenu}
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
  active?: boolean;
  onClick?: () => void;
  onGroupChange?: (group: GroupType) => void;
  size?: number;
  style?: CSSProperties | null;
  index?: number;
  tagStyle?: ThemeEntryTagType;
  containerStyle?: Partial<ThemeEntryContainerType>;
}

interface SlideGroupIndicatorProps {
  groupId: Groups;
}

export default Slide;
