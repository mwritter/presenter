import styled from "@emotion/styled";
import { Box, Slider, SliderProps } from "@mantine/core";
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
`;

const ShowViewControls = styled.div`
  position: fixed;
  bottom: 0;
  background-color: #21212a;
  width: 100%;
`;

const GridItemSizeControl = styled(Slider)<SliderProps>`
  width: 200px;
`;

const ShowView = () => {
  const [gridItemSize, setGridItemSize] = useState<number>(0);
  const [sliderValue, setSliderValue] = useState<number>(0);
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
        <PlaylistShowView slideSize={gridItemSize} />
        <ShowViewControls>
          <GridItemSizeControl
            defaultValue={25}
            min={25}
            value={sliderValue}
            onChange={setSliderValue}
            onChangeEnd={setGridItemSize}
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
    </ShowViewContainer>
  );
};

export default ShowView;
