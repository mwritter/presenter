import styled from "@emotion/styled";
import { Box, Slider, SliderProps } from "@mantine/core";
import { useEffect, useState } from "react";
import useStore from "../store";
import { PresenterMode } from "../types/LibraryTypes";
import PlaylistShowView from "../components/show/playlist";
import LibraryShowView from "../components/show/library";
import MediaShowView from "../components/show/media";
import ThemeEditor from "../components/show/theme";
import SearchView from "../components/search";

const ShowViewContainer = styled.section`
  grid-area: main;
  width: 100%;
  overflow-y: scroll;
`;

const ShowViewControls = styled.div`
  position: fixed;
  bottom: 0;
  background-color: #21212a;
  width: 100%;
`;

const GridItemSizeControl = styled(Slider)<SliderProps>`
  width: 200px;

  .mantine-Slider-thumb {
    background-color: black;
    width: 1rem;
    height: 1rem;
    border: 1px solid white;
  }

  .mantine-Slider-track {
    &:before {
      opacity: 0.5;
    }
  }

  .mantine-Slider-bar {
    background-color: white;
    opacity: 0.5;
  }
`;

const ShowView = () => {
  const [gridItemSize, setGridItemSize] = useState<number>(0);
  const [mode, show, playlist, setShow] = useStore(
    ({ mode, playlist, show, setShow }) => [mode, show, playlist, setShow]
  );

  useEffect(() => {
    if (playlist) {
      setShow(playlist);
    }
  }, [show, playlist]);

  return (
    <ShowViewContainer>
      <Box hidden={mode !== PresenterMode.PLAYLIST}>
        <PlaylistShowView slideSize={gridItemSize} />
        <ShowViewControls>
          <GridItemSizeControl
            defaultValue={40}
            min={40}
            value={gridItemSize}
            onChange={setGridItemSize}
          />
        </ShowViewControls>
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
      <SearchView hidden={mode !== PresenterMode.SEARCH} />
    </ShowViewContainer>
  );
};

export default ShowView;
