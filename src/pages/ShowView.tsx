import styled from "@emotion/styled";
import { ActionIcon, Stack, Title } from "@mantine/core";
import { useEffect, useState } from "react";
import Slide from "../components/show/slide/Slide";
import { GroupType } from "../components/show/helpers/slide.helper";
import useStore from "../store";
import PlaylistEditToolBar from "../components/library/playlists/PlaylistEditToolBar";
import { IconTrash } from "@tabler/icons-react";
import { removeContent } from "../helpers/playlist.helper";

const SectionTitleContainer = styled.div`
  display: flex;
  position: sticky;
  top: 36px;
  justify-content: space-between;
  background-color: #ccc;
  padding: 5px;
  border-radius: 5px;
  align-items: center;
`;

const SectionTitle = styled(Title)`
  font-size: medium;
  flex: 1;
`;

const ShowViewContainer = styled.section`
  position: relative;
  grid-area: show;
  width: 100%;
  max-width: 2000px;
  overflow-y: scroll;
  overflow-x: hidden;
  margin: 0 auto;
`;

const ShowViewGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, 350px);
  gap: 1rem;
  justify-content: center;
`;

const ShowView = () => {
  const [activeSlideId, setActiveSlideId] = useState<string | null>(null);
  const [show, playlist, setShow] = useStore(({ playlist, show, setShow }) => [
    show,
    playlist,
    setShow,
  ]);

  useEffect(() => {
    if (playlist) {
      setShow(playlist);
    }
  }, [show, playlist]);

  return (
    <ShowViewContainer>
      <PlaylistEditToolBar />
      <Stack p={20} spacing={50}>
        {show?.content.map((section) => (
          <Stack key={`${section.id}`}>
            <SectionTitleContainer>
              <SectionTitle>{section.name?.split(".")[0]}</SectionTitle>
              <ActionIcon
                onClick={() => {
                  removeContent(show.name, section.id);
                }}
              >
                <IconTrash size={12} />
              </ActionIcon>
            </SectionTitleContainer>
            <ShowViewGrid>
              {section?.slides?.map((s, idx) => {
                return (
                  <Slide
                    key={idx}
                    sectionId={section.id}
                    slideId={s.id}
                    active={activeSlideId === section.id + idx}
                    text={s.text}
                    group={s.group}
                    onClick={() => setActiveSlideId(section.id + idx)}
                  />
                );
              })}
            </ShowViewGrid>
          </Stack>
        ))}
      </Stack>
    </ShowViewContainer>
  );
};

interface ShowViewProps {
  playlist?: {
    sections: {
      id: string;
      header: string;
      files: {
        name: string;
        path: string;
        data: {
          text: string;
          group: GroupType;
        };
      }[];
    }[];
  };
}

export default ShowView;
