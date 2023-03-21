import { createRef, useCallback, useEffect, useRef, useState } from "react";
import styled from "@emotion/styled";
import { Groups, GroupType } from "../helpers/slide.helper";
import SlideGroupIndicatorMenu from "./SlideGroupIndicatorMenu";
import useStore from "../../../store";
import { editPlaylistSlideData } from "../../../helpers/playlist.helper";
import { Text } from "@mantine/core";
import { SlideEntryType } from "../../../types/LibraryTypes";
import { WebviewWindow } from "@tauri-apps/api/window";

interface SliderContainerProps {
  active?: boolean;
}

const SlideContainer = styled.div<SliderContainerProps>`
  border: 3px solid ${(p) => (p.active ? "#9DC08B" : "#ccc")};
  border-radius: 5px;
  padding: 1rem;
  cursor: pointer;
  background-color: #07090e7f;
  place-content: center;
`;

const SlideBody = styled.div`
  height: 150px;
`;

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
  const [scale, setScale] = useState(0);
  const [left, setLeft] = useState(0);
  const [top, setTop] = useState(0);

  const { playlist, projector } = useStore(({ playlist, projector }) => ({
    playlist,
    projector,
  }));

  const measure = useCallback(
    (projectorWidth: number, projectorHeight: number) => {
      if (!slideRef.current) return;
      const { clientWidth: width, clientHeight: height } = slideRef.current;
      let value = 0,
        left = 0,
        top = 0;
      // Fill height
      if ((projectorHeight / projectorWidth) * width > height) {
        value = height / projectorHeight;
        left = (width - value * projectorWidth) / 2;
      }
      // Else, fill width
      else {
        value = width / projectorWidth;
        top = (height - value * projectorHeight) / 2;
      }
      console.log("left", left);
      console.log("top", top);
      setScale(() => {
        console.log("scale is", scale);
        return value;
      });
      setLeft(left);
      setTop(top);
    },
    []
  );

  useEffect(() => {
    if (slideRef.current) {
      projector?.innerSize().then(({ width, height }) => {
        console.log(width, height);
        measure(width, height);
      });
    }
  }, []);

  return (
    <SlideContainer className={`theme-projector-${theme}`} active={active}>
      <SlideBody
        style={{
          height: "150px",
          width: "350px",
          transform: `translate(${left}px, ${top}px) scale(${scale})`,
        }}
        ref={slideRef}
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
