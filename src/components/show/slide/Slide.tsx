import { useCallback, useEffect, useRef, useState } from "react";
import styled from "@emotion/styled";
import { Groups, GroupType } from "../helpers/slide.helper";
import SlideGroupIndicatorMenu from "./SlideGroupIndicatorMenu";
import useStore from "../../../store";
import { editPlaylistSlideData } from "../../../helpers/playlist.helper";
import { Text } from "@mantine/core";
import {
  LibrarySlideEntryType,
  SlideEntryType,
} from "../../../types/LibraryTypes";
import { TauriEvent } from "@tauri-apps/api/event";

interface SliderContainerProps {
  active?: boolean;
}

const SlideContainer = styled.div<SliderContainerProps>`
  border: 3px solid ${(p) => (p.active ? "#9DC08B" : "#ccc")};
  border-radius: 5px;
  padding: 1rem;
  cursor: pointer;
  background-color: #07090e7f;
`;

const SlideBody = styled.div``;

const SlideGroupIndicator = styled.div<SlideGroupIndicatorProps>`
  bottom: 0%;
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
  const slideRef = useRef<HTMLDivElement>(null);
  const [openedGroupMenu, setOpenedGroupMenu] = useState(false);
  const [height, setHeight] = useState(150);
  const [scale, setScale] = useState(0.1);

  const { playlist, projector } = useStore(({ playlist, projector }) => ({
    playlist,
    projector,
  }));

  const scaleSlide = useCallback(
    (projectorWidth: number, projectorHeight: number) => {
      if (!slideRef.current) return;
      const { clientWidth: width } = slideRef.current;
      const quotient = projectorHeight / projectorWidth;
      const newHeight = quotient * width;
      setHeight(newHeight);
      setScale((width / projectorWidth) * 2.2);
    },
    []
  );

  useEffect(() => {
    projector?.outerSize().then(({ width, height }) => {
      scaleSlide(width, height);
    });
    // For debugging
    projector?.listen(TauriEvent.WINDOW_RESIZED, () => {
      projector?.outerSize().then(({ width, height }) => {
        scaleSlide(width, height);
      });
    });
  }, []);

  return (
    <>
      <SlideContainer
        style={{
          overflow: "hidden",
        }}
        className={`theme-projector-${theme}`}
        active={active}
        onClick={onClick}
      >
        <SlideBody
          ref={slideRef}
          style={{
            height,
            transform: `scale(${scale})`,
          }}
          className={`theme-slide-${theme}`}
        >
          {slide.text.split("\n").map((t, idx) => (
            <Text key={idx}>{t}</Text>
          ))}
        </SlideBody>
        <SlideGroupIndicatorMenu
          opened={openedGroupMenu}
          onChange={setOpenedGroupMenu}
          // TODO: this needs to be dynamic to allow editing library files as well
          onGroupChange={onGroupChange}
        >
          <SlideGroupIndicator groupId={Groups[slide.group]} />
        </SlideGroupIndicatorMenu>
      </SlideContainer>
    </>
  );
};

interface SlideProps {
  slide: SlideEntryType | LibrarySlideEntryType;
  theme: string;
  active: boolean;
  onClick: () => void;
  onGroupChange: (group: GroupType) => void;
}

interface SlideGroupIndicatorProps {
  groupId: Groups;
}

export default Slide;
