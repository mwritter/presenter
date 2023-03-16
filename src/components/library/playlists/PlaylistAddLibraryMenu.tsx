import styled from "@emotion/styled";
import { Menu, Text, ActionIcon, TextProps } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import { useEffect } from "react";
import { getLibraryDirContents } from "../../../helpers/library.helper";
import { addContent } from "../../../helpers/playlist.helper";
import useStore from "../../../store";

const LibraryMenuDropdown = styled(Menu.Dropdown)`
  background-color: #21212a;
`;

const LibraryEntry = styled(Text)<LibraryEntryProps>`
  color: white;
  background-color: ${(p) => (p.index % 2 === 0 ? "#9a9f9a23" : "")};
  cursor: pointer;
  padding: 0.2rem 1rem;

  &:hover {
    background-color: #476480;
  }
`;

function PlaylistAddLibraryMenu() {
  const [libraries, playlist] = useStore(({ libraries, playlist }) => [
    libraries,
    playlist,
  ]);

  useEffect(() => {
    getLibraryDirContents();
  }, []);

  return (
    <Menu shadow="md" width={200}>
      <Menu.Target>
        <ActionIcon>
          <IconPlus size={14} />
        </ActionIcon>
      </Menu.Target>

      <LibraryMenuDropdown>
        <Menu.Label>Add to Playlist</Menu.Label>
        {libraries.map((f) => {
          return f.children ? (
            <div key={f.path}>
              {f.children
                .filter((l) => l.name && !/^\./.test(l.name))
                .map((c, idx) => (
                  <LibraryEntry
                    index={idx}
                    key={c.path}
                    onClick={() => {
                      if (playlist && c.name) {
                        addContent(playlist.name, c.name);
                      }
                    }}
                  >
                    {c.name?.split(".")[0]}
                  </LibraryEntry>
                ))}
            </div>
          ) : null;
        })}
      </LibraryMenuDropdown>
    </Menu>
  );
}

type LibraryEntryProps = TextProps & {
  index: number;
  onClick: () => void;
};

export default PlaylistAddLibraryMenu;
