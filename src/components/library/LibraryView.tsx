import styled from "@emotion/styled";
import LibraryFileInput from "./libraries/LibraryFileInput";
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
  return (
    <LibraryViewContainer>
      <PlaylistDirView />
      <LibraryFileInput />
    </LibraryViewContainer>
  );
};

export default LibraryView;
