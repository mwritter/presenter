import { useState } from "react";
import styled from "@emotion/styled";
import { Groups, GroupType } from "../helpers/slide.helper";
import SlideGroupIndicatorMenu from "./SlideGroupIndicatorMenu";
import useStore from "../../../store";
import { editPlaylistSlideData } from "../../../helpers/playlist.helper";
import { Text } from "@mantine/core";
import { SlideEntryType } from "../../../types/LibraryTypes";

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
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  height: 150px;
  width: 100%;
  color: white;
`;

const SlideGroupIndicator = styled.div<SlideGroupIndicatorProps>`
  bottom: 0%;
  height: 10px;
  background-color: ${(p) => p.groupId || "gray"};
  border-radius: 5px;
  justify-self: center;
`;

const Slide = ({ slide, sectionId, active, onClick }: SlideProps) => {
  const [openedGroupMenu, setOpenedGroupMenu] = useState(false);
  const playlist = useStore(({ playlist }) => playlist);
  return (
    <SlideContainer style={{ backgroundSize: "cover" }} active={active}>
      <SlideBody onClick={onClick}>
        {slide.text.split("\n").map((t) => (
          <Text>{t}</Text>
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
  active: boolean;
  onClick: () => void;
}

interface SlideGroupIndicatorProps {
  groupId: Groups;
}

export default Slide;
