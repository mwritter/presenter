import styled from "@emotion/styled";
import { ActionIcon, List, TextInput, Title } from "@mantine/core";
import { IconEdit } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import {
  editAllPlaylistSlideData,
  renamePlaylist,
} from "../../../helpers/playlist.helper";
import useStore from "../../../store";
import PlaylistAddLibraryMenu from "./PlaylistAddLibraryMenu";
import PlaylistChangeThemeMenu from "./PlaylistThemeMenu";

const PlaylistEditToolBarContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  position: sticky;
  top: 0px;
  z-index: 1;
  background-color: #21212a;
  padding: 4px;
  padding-left: 1rem;
`;

const PlaylistTextInput = styled(TextInput)`
  width: 100%;
  padding: 0;
  padding-left: 1rem;
  & .mantine-TextInput-input {
    color: white;
    background-color: transparent;
  }
`;

const PlaylistActionsList = styled(List)`
  display: flex;
  gap: 0.5rem;
  list-style: none;
`;

const PlaylistEditToolBar = () => {
  const [editPlaylist, setEditPlaylist] = useState(false);
  const { playlist, projector } = useStore(({ playlist, projector }) => ({
    playlist,
    projector,
  }));
  const [playlistName, setPlaylistName] = useState("");

  useEffect(() => {
    setPlaylistName(playlist?.name.split(".")[0] || "");
    () => setEditPlaylist(false);
  }, [playlist]);

  return playlist ? (
    <PlaylistEditToolBarContainer>
      {editPlaylist ? (
        <PlaylistTextInput
          autoFocus
          value={playlistName}
          onChange={(e) => setPlaylistName(e.target.value)}
          onBlur={() => {
            setPlaylistName(playlist.name.split(".")[0]);
            setEditPlaylist(false);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              renamePlaylist(playlistName, playlist).then(() =>
                setEditPlaylist(false)
              );
            } else if (e.key === "Escape") {
              setPlaylistName(playlist.name.split(".")[0]);
              setEditPlaylist(false);
            }
          }}
        />
      ) : (
        <Title order={5} color={"white"}>
          {playlist.name.split(".")[0]}
        </Title>
      )}
      <PlaylistActionsList>
        <List.Item>
          <ActionIcon
            disabled={editPlaylist}
            onClick={() => {
              setEditPlaylist((c) => true);
            }}
          >
            <IconEdit size={14} />
          </ActionIcon>
        </List.Item>
        <List.Item>
          <PlaylistAddLibraryMenu />
        </List.Item>
      </PlaylistActionsList>
    </PlaylistEditToolBarContainer>
  ) : null;
};

export default PlaylistEditToolBar;
