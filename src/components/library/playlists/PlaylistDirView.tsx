import { useEffect, useState } from "react";
import styled from "@emotion/styled";
import { ActionIcon, Box, NavLink, NavLinkProps, Title } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import {
  create,
  getPlaylistData,
  getPlaylistsDirContents,
} from "../../../helpers/playlist.helper";
import useStore from "../../../store";
import PlaylistAddInput from "./PlaylistAddInput";
import PlaylistContentEntries from "./PlaylistContentEntries";
import { PlaylistEntryType } from "../../../types/LibraryTypes";
import PlaylistDirEntry from "./PlaylistDirEntry";

const PlaylistDirContainer = styled.section`
  display: flex;
  flex-direction: column;
  justify-items: flex-start;
`;

const PlaylistHeaderContainer = styled.div`
  position: sticky;
  top: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  justify-self: flex-start;
  background-color: #21212a;
  z-index: 1;
`;

const PlaylistDirTitle = styled(Title)`
  align-self: flex-start;
  padding: 0.5rem;
`;

const PlaylistItemNavLink = styled(NavLink)<NavLinkProps>`
  position: relative;
  color: white;

  &:hover {
    background-color: #476480;
  }
  .mantine-NavLink-body {
    position: relative;
    padding: 0 0.2rem;
  }
  .mantine-NavLink-label {
    width: 100px;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .mantine-NavLink-label,
  svg {
    color: white;
  }
`;

const PlaylistDirView = () => {
  const [items, setItems] = useState<PlaylistEntryType[]>([]);
  const [playlists, playlist, setPlaylist] = useStore(
    ({ playlists, playlist, setPlaylist }) => [playlists, playlist, setPlaylist]
  );
  const [addInput, setAddInput] = useState(false);

  useEffect(() => {
    getPlaylistsDirContents();
  }, []);

  useEffect(() => {
    if (playlist) {
      setItems(playlist.content);
    }
  }, [playlist]);

  return (
    <PlaylistDirContainer>
      <PlaylistHeaderContainer>
        <PlaylistDirTitle order={6}>PLAYLIST</PlaylistDirTitle>
        <ActionIcon
          disabled={addInput}
          title="Add Playlist"
          variant="transparent"
          onClick={() => setAddInput(true)}
        >
          <IconPlus size={16} />
        </ActionIcon>
      </PlaylistHeaderContainer>
      {addInput && (
        <PlaylistAddInput
          onClose={() => setAddInput(false)}
          onEnter={(value) => {
            create(value + ".json").then(() => {
              setAddInput(false);
            });
          }}
        />
      )}
      <Box>
        {playlists
          .filter((file) => file.name)
          .map((file) => (
            <div key={file.path}>
              <h3
                onClick={() => {
                  getPlaylistData(file.path).then((data) => setPlaylist(data));
                }}
              >
                <PlaylistDirEntry file={file} />
              </h3>
              {file.name === playlist?.name && (
                <PlaylistContentEntries items={items} />
              )}
            </div>
          ))}
      </Box>
    </PlaylistDirContainer>
  );
};

export default PlaylistDirView;
