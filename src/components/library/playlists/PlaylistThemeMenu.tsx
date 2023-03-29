import styled from "@emotion/styled";
import { Menu, Text, ActionIcon, TextProps } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconPaint } from "@tabler/icons-react";
import { BaseDirectory, FileEntry, readDir } from "@tauri-apps/api/fs";
import { useEffect, useState } from "react";
import { editAllPlaylistSlideData } from "../../../helpers/playlist.helper";
import { getThemeEnties } from "../../../helpers/theme.helper";
import useStore from "../../../store";
import {
  PlaylistEntryType,
  PlaylistType,
  SlideEntryType,
} from "../../../types/LibraryTypes";

const ThemeMenuDropdown = styled(Menu.Dropdown)`
  background-color: #21212a;
  z-index: 2;
`;

const ThemeEntry = styled(Text)<ThemeEntryProps>`
  color: white;
  background-color: ${(p) => (p.index % 2 === 0 ? "#9a9f9a23" : "")};
  cursor: pointer;
  padding: 0.2rem 1rem;

  &:hover {
    background-color: #476480;
  }
`;

function PlaylistChangeThemeMenu({
  onHandleThemeChange,
}: PlaylistThemeMenuProps) {
  const { playlist, projector } = useStore(({ playlist, projector }) => ({
    playlist,
    projector,
  }));
  const [themes, setThemes] = useState<string[]>([]);
  const [opened, setOpened] = useState(false);

  useEffect(() => {
    getThemeEnties().then((entries) => {
      setThemes(entries.map(({ name }) => name));
    });
  }, []);

  return (
    <Menu opened={opened} onChange={setOpened} shadow="md" width={200}>
      <Menu.Target>
        <ActionIcon>
          <IconPaint size={14} />
        </ActionIcon>
      </Menu.Target>

      <ThemeMenuDropdown>
        <Menu.Label>Add to Playlist</Menu.Label>
        {themes.map((themeName, idx) => {
          return (
            <ThemeEntry
              index={idx}
              key={themeName}
              onClick={() => {
                if (playlist && themeName) {
                  onHandleThemeChange(themeName);
                  setOpened(false);
                }
              }}
            >
              {themeName}
            </ThemeEntry>
          );
        })}
      </ThemeMenuDropdown>
    </Menu>
  );
}

interface PlaylistThemeMenuProps {
  onHandleThemeChange: (theme: string) => Promise<void>;
}

type ThemeEntryProps = TextProps & {
  index: number;
  onClick: () => void;
};

export default PlaylistChangeThemeMenu;
