import { useEffect, useState } from "react";
import styled from "@emotion/styled";
import { ActionIcon, Box, NavLink, NavLinkProps, Title } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import {
  create,
  getPlaylistData,
  getPlaylistsDirContents,
  write,
} from "../../../helpers/playlist.helper";
import useStore from "../../../store";
import PlaylistAddInput from "./PlaylistAddInput";
import PlaylistContentEntries from "./PlaylistContentEntries";
import { PlaylistEntryType } from "../../../types/LibraryTypes";
import PlaylistDirEntry from "./PlaylistDirEntry";
import DndListHandle from "../dnd";

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

const PlaylistDirView = () => {
  const [playlists, playlist, setPlaylist] = useStore(
    ({ playlists, playlist, setPlaylist }) => [playlists, playlist, setPlaylist]
  );
  const [addInput, setAddInput] = useState(false);

  useEffect(() => {
    getPlaylistsDirContents();
  }, []);

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
              {playlist && file.name === playlist?.name ? (
                <DndListHandle
                  data={playlist.content}
                  onReorder={(content) => {
                    console.log("here");
                    playlist.content = content;
                    write(playlist.name, playlist);
                  }}
                />
              ) : null}
            </div>
          ))}
      </Box>
    </PlaylistDirContainer>
  );
};

export default PlaylistDirView;
