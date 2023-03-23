import styled from "@emotion/styled";
import { Box } from "@mantine/core";
import { useEffect, useState } from "react";
import useStore from "../store";
import { PresenterMode } from "../types/LibraryTypes";
import PlaylistShowView from "../components/show/playlist";
import LibraryShowView from "../components/show/library";

const ShowViewContainer = styled.section`
  position: relative;
  grid-area: show;
  width: 100%;
  overflow-y: scroll;
  overflow-x: hidden;
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
      <Box hidden={mode !== PresenterMode.PLAYLIST && Boolean(library)}>
        <PlaylistShowView />
      </Box>
      <Box hidden={mode !== PresenterMode.LIBRARY && !Boolean(library)}>
        <LibraryShowView />
      </Box>
    </ShowViewContainer>
  );
};

export default ShowView;
