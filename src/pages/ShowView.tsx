import styled from "@emotion/styled";
import { Box } from "@mantine/core";
import { useEffect, useState } from "react";
import useStore from "../store";
import { PresenterMode } from "../types/LibraryTypes";
import PlaylistShowView from "../components/show/playlist";
import LibraryShowView from "../components/show/library";
import MediaShowView from "../components/show/media";
import ThemeEditor from "../components/show/theme";

const ShowViewContainer = styled.section`
  position: relative;
  grid-area: show;
  width: 100%;
  overflow-y: scroll;
  overflow-x: hidden;
  margin-top: 1rem;
`;

const ShowView = () => {
  const [mode, show, playlist, setShow, library] = useStore(
    ({ mode, playlist, show, setShow, library }) => [
      mode,
      show,
      playlist,
      setShow,
      library,
    ]
  );

  useEffect(() => {
    if (playlist) {
      setShow(playlist);
    }
  }, [show, playlist]);

  return (
    <ShowViewContainer>
      <Box hidden={mode !== PresenterMode.PLAYLIST}>
        <PlaylistShowView />
      </Box>
      <Box hidden={mode !== PresenterMode.LIBRARY}>
        <LibraryShowView />
      </Box>
      <Box hidden={mode !== PresenterMode.MEDIA}>
        <MediaShowView />
      </Box>
      <Box hidden={mode !== PresenterMode.THEME}>
        <ThemeEditor />
      </Box>
    </ShowViewContainer>
  );
};

export default ShowView;
