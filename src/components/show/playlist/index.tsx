import styled from "@emotion/styled";
import { useState } from "react";
import { Stack } from "@mantine/core";
import useStore from "../../../store";
import PlaylistEditToolBar from "../../library/playlists/PlaylistEditToolBar";
import PlaylistSectionToolBar from "../../library/playlists/PlaylistSectionToolBar";
import Slide from "../slide/Slide";
import { editPlaylistSlideData } from "../../../helpers/playlist.helper";

const ShowViewGrid = styled.div`
  display: grid;
  max-width: 2000px;
  width: 100%;
  grid-template-columns: repeat(auto-fill, 350px);
  gap: 1rem;
  justify-content: center;
  align-self: center;
`;

const PlaylistShowView = () => {
  const [activeSlideId, setActiveSlideId] = useState<string | null>(null);
  const [projector, show, playlist, setShow] = useStore(
    ({ projector, playlist, show, setShow }) => [
      projector,
      show,
      playlist,
      setShow,
    ]
  );
  return (
    <>
      <PlaylistEditToolBar />
      <Stack style={{ zIndex: 0 }} p={20} spacing={50}>
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
                    theme={section.theme}
                    active={activeSlideId === section.id + idx}
                    slide={slide}
                    onClick={() => {
                      setActiveSlideId(section.id + idx);
                      projector?.emit("set-slide", {
                        ...slide,
                        theme: section.theme,
                      });
                    }}
                    onGroupChange={(group) => {
                      if (playlist) {
                        editPlaylistSlideData(
                          slide.id,
                          section.id,
                          { group },
                          playlist
                        );
                      }
                    }}
                  />
                );
              })}
            </ShowViewGrid>
          </Stack>
        ))}
      </Stack>
    </>
  );
};

export default PlaylistShowView;
