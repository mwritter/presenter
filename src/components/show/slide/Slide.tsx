import { useCallback, useEffect, useRef, useState } from "react";
import styled from "@emotion/styled";
import { Groups } from "../helpers/slide.helper";
import SlideGroupIndicatorMenu from "./SlideGroupIndicatorMenu";
import useStore from "../../../store";
import { editPlaylistSlideData } from "../../../helpers/playlist.helper";
import { Text } from "@mantine/core";
import { SlideEntryType } from "../../../types/LibraryTypes";
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

const Slide = ({ slide, sectionId, theme, active, onClick }: SlideProps) => {
  const slideRef = useRef<HTMLDivElement>(null);
  const [openedGroupMenu, setOpenedGroupMenu] = useState(false);
  const [height, setHeight] = useState(150);
  const [scale, setScale] = useState(0);

  const { playlist, projector } = useStore(({ playlist, projector }) => ({
    playlist,
    projector,
  }));

  const scaleSlide = useCallback(
    (projectorWidth: number, projectorHeight: number) => {
      if (!slideRef.current) return;
      const { clientWidth: width, clientHeight: height } = slideRef.current;
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
        console.log(width, height);
        scaleSlide(width, height);
      });
    });
  }, []);

  return (
    <>
      {projector && (
        <SlideContainer
          style={{
            overflow: "hidden",
          }}
          className={`theme-projector-${theme}`}
          active={active}
        >
          <SlideBody
            ref={slideRef}
            style={{
              height,
              transform: `scale(${scale})`,
            }}
            className={`theme-slide-${theme}`}
            onClick={onClick}
          >
            {slide.text.split("\n").map((t, idx) => (
              <Text key={idx}>{t}</Text>
            ))}
          </SlideBody>
          <SlideGroupIndicatorMenu
            opened={openedGroupMenu}
            onChange={setOpenedGroupMenu}
            onItemClick={(groupId) => {
              if (playlist) {
                editPlaylistSlideData(
                  slide.id,
                  sectionId,
                  { group: groupId },
                  playlist
                );
              }
            }}
          >
            <SlideGroupIndicator groupId={Groups[slide.group]} />
          </SlideGroupIndicatorMenu>
        </SlideContainer>
      )}
    </>
  );
};

interface SlideProps {
  slide: SlideEntryType;
  sectionId: string;
  theme: string;
  active: boolean;
  onClick: () => void;
}

interface SlideGroupIndicatorProps {
  groupId: Groups;
}

export default Slide;
