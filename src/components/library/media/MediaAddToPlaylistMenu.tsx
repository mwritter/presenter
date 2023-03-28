import styled from "@emotion/styled";
import { Menu, Text, ActionIcon, TextProps } from "@mantine/core";
import { IconBrowserPlus, IconPlus } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { getPlaylistsDirContents } from "../../../helpers/playlist.helper";
import { addContent } from "../../../helpers/playlist.helper";
import useStore from "../../../store";

const PlaylistMenuDropdown = styled(Menu.Dropdown)`
  background-color: #21212a;
`;

const PlaylistEntry = styled(Text)<PlaylistEntryProps>`
  color: white;
  background-color: ${(p) => (p.index % 2 === 0 ? "#9a9f9a23" : "")};
  cursor: pointer;
  padding: 0.2rem 1rem;

  &:hover {
    background-color: #476480;
  }
`;

function MediaAddPlaylistMenu({
  disabled,
  onPlaylistSelect,
}: MediaAddPlaylistMenuProps) {
  const [opened, setOpened] = useState(false);
  const [playlists, playlist] = useStore(({ playlists, playlist }) => [
    playlists,
    playlist,
  ]);

  useEffect(() => {
    getPlaylistsDirContents();
  }, []);

  return (
    <Menu shadow="md" width={200} opened={opened} onChange={setOpened}>
      <Menu.Target>
        <ActionIcon disabled={disabled} variant="transparent">
          <IconBrowserPlus size={14} />
        </ActionIcon>
      </Menu.Target>

      <PlaylistMenuDropdown>
        <Menu.Label>Add to Playlist</Menu.Label>
        {playlists.map((f, idx) => {
          return (
            <div key={f.path}>
              <PlaylistEntry
                index={idx}
                key={f.path}
                onClick={() => {
                  if (f.name) {
                    onPlaylistSelect(f.name);
                    setOpened(false);
                  }
                }}
              >
                {f.name?.split(".")[0]}
              </PlaylistEntry>
            </div>
          );
        })}
      </PlaylistMenuDropdown>
    </Menu>
  );
}

interface MediaAddPlaylistMenuProps {
  disabled: boolean;
  onPlaylistSelect: (playlistName: string) => void;
}

type PlaylistEntryProps = TextProps & {
  index: number;
  onClick: () => void;
};

export default MediaAddPlaylistMenu;
