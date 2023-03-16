import styled from "@emotion/styled";
import { FileEntry } from "@tauri-apps/api/fs";
import { getPlaylistData } from "../../../helpers/playlist.helper";
import useStore from "../../../store";

const PlaylistDirEntryContainer = styled.span<PlaylistDirEntryContatinerProps>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-left: 1rem;
  background-color: ${(p) => (p.selected ? "#496c8a" : "")};
  cursor: pointer;

  &:hover {
    background-color: #496c8a;
  }
`;

const PlaylistEntry = styled.p`
  padding: 0.5rem 0;
  font-size: smaller;
  flex: 1;
`;

const PlaylistDirEntry = ({ file }: PlaylistDirEntryProps) => {
  const [playlist, setPlaylist] = useStore(({ playlist, setPlaylist }) => [
    playlist,
    setPlaylist,
  ]);
  const [fileName] = file.name?.split(".") || [];
  return (
    <PlaylistDirEntryContainer
      key={file.path}
      selected={playlist?.name === file.name}
    >
      <PlaylistEntry
        onClick={() => {
          getPlaylistData(file.path).then((data) => setPlaylist(data));
        }}
      >
        {fileName}
      </PlaylistEntry>
    </PlaylistDirEntryContainer>
  );
};
interface PlaylistDirEntryProps {
  file: FileEntry;
}

interface PlaylistDirEntryContatinerProps {
  selected: boolean;
}

export default PlaylistDirEntry;
