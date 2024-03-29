import styled from "@emotion/styled";
import useStore from "../../store";
import { PresenterMode } from "../../types/LibraryTypes";
import LibraryDirView from "./libraries/LibraryDirView";
import LibraryViewNav from "./LibraryViewNav";
import MediaDirView from "./media/MediaDirView";
import PlaylistDirView from "./playlists/PlaylistDirView";
import ThemeEntryView from "./theme/ThemeEntryView";
import SearchEntryView from "./search/SearchEntryView";

const LibraryViewContainer = styled.div`
  grid-area: library;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  color: white;
  width: 250px;
  background-color: #21212a;
  overflow-y: scroll;
  height: 100%;

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
      {mode === PresenterMode.THEME && <ThemeEntryView />}
      {mode === PresenterMode.SEARCH && <SearchEntryView />}
      <LibraryViewNav />
    </LibraryViewContainer>
  );
};

export default LibraryView;
