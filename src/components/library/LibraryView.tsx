import styled from "@emotion/styled";
import PlaylistDirView from "./playlists/PlaylistDirView";

const LibraryViewContainer = styled.div`
  grid-area: library;
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
  return (
    <LibraryViewContainer>
      <PlaylistDirView />
    </LibraryViewContainer>
  );
};

export default LibraryView;
