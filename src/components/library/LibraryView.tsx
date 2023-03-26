import styled from "@emotion/styled";
import useStore from "../../store";
import { PresenterMode } from "../../types/LibraryTypes";
import LibraryDirView from "./libraries/LibraryDirView";
import LibraryFileInput from "./libraries/LibraryFileInput";
import LibraryViewNav from "./LibraryViewNav";
import MediaDirView from "./media/MediaDirView";
import PlaylistDirView from "./playlists/PlaylistDirView";

const LibraryViewContainer = styled.div`
  grid-area: library;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  color: white;
  width: 250px;
  background-color: #21212a;
  overflow-y: scroll;

  > section {
  }

  &::-webkit-scrollbar {
    width: 1px;
  }

  &::-webkit-scrollbar-track {
    background-color: #21212a;
  }
`;

const LibraryView = () => {
  const mode = useStore(({ mode }) => mode);
  return (
    <LibraryViewContainer>
      {mode === PresenterMode.PLAYLIST && <PlaylistDirView />}
      {mode === PresenterMode.LIBRARY && <LibraryDirView />}
      {mode === PresenterMode.MEDIA && <MediaDirView />}
      <LibraryViewNav />
    </LibraryViewContainer>
  );
};

export default LibraryView;
