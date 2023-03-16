import { useState } from "react";
import styled from "@emotion/styled";
import { Groups, GroupType } from "../helpers/slide.helper";
import SlideGroupIndicatorMenu from "./SlideGroupIndicatorMenu";
import useStore from "../../../store";
import { editPlaylistSlideData } from "../../../helpers/playlist.helper";
import { Text } from "@mantine/core";

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

const SlideBody = styled.div`
  display: grid;
  place-content: center;
  text-align: center;
  height: 150px;
  color: white;
`;

const SlideGroupIndicator = styled.div<SlideGroupIndicatorProps>`
  bottom: 10%;
  height: 10px;
  width: 100%;
  background-color: ${(p) => p.groupId || "gray"};
  border-radius: 10px;
`;

const Slide = ({
  sectionId,
  slideId,
  text,
  active,
  group,
  onClick,
}: SlideProps) => {
  const [openedGroupMenu, setOpenedGroupMenu] = useState(false);
  const playlist = useStore(({ playlist }) => playlist);
  return (
    <SlideContainer active={active}>
      <SlideBody onClick={onClick}>
        {text.split("\n").map((t) => (
          <Text>{t}</Text>
        ))}
      </SlideBody>
      <SlideGroupIndicatorMenu
        opened={openedGroupMenu}
        onChange={setOpenedGroupMenu}
        onItemClick={(groupId) => {
          if (playlist) {
            editPlaylistSlideData(
              slideId,
              sectionId,
              { group: groupId },
              playlist
            );
          }
        }}
      >
        <SlideGroupIndicator groupId={Groups[group]} />
      </SlideGroupIndicatorMenu>
    </SlideContainer>
  );
};

interface SlideProps {
  sectionId: string;
  slideId: string;
  text: string;
  active: boolean;
  group: GroupType;
  onClick: () => void;
}

interface SlideGroupIndicatorProps {
  groupId: Groups;
}

export default Slide;
