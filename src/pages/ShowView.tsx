import styled from "@emotion/styled";
import { ActionIcon, Stack, Title } from "@mantine/core";
import { useEffect, useRef, useState } from "react";
import Slide from "../components/show/slide/Slide";
import { GroupType } from "../components/show/helpers/slide.helper";
import useStore from "../store";
import PlaylistEditToolBar from "../components/library/playlists/PlaylistEditToolBar";
import { IconTrash } from "@tabler/icons-react";
import { removeContent } from "../helpers/playlist.helper";
import ShowProjectorButton from "../components/show/ShowProjectorButton";
import { appWindow, WebviewWindow } from "@tauri-apps/api/window";
import PlaylistSectionToolBar from "../components/library/playlists/PlaylistSectionToolBar";

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
  const [projector, show, playlist, setShow] = useStore(
    ({ projector, playlist, show, setShow }) => [
      projector,
      show,
      playlist,
      setShow,
    ]
  );

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
            <PlaylistSectionToolBar
              playlistName={show.name}
              section={section}
            />
            <ShowViewGrid>
              {section?.slides?.map((slide, idx) => {
                return (
                  <Slide
                    key={idx}
                    sectionId={section.id}
                    theme={section.theme}
                    active={activeSlideId === section.id + idx}
                    slide={slide}
                    onClick={() => {
                      setActiveSlideId(section.id + idx);
                      projector
                        ?.emit("set-slide", {
                          ...slide,
                          theme: section.theme,
                        })
                        .then(() => {
                          console.log("setting");
                        });
                    }}
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

export default ShowView;
