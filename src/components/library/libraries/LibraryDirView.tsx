import styled from "@emotion/styled";
import { Text, TextProps } from "@mantine/core";
import useStore from "../../../store";
import { addContent } from "../../../helpers/playlist.helper";
import { useEffect } from "react";
import { getLibraryDirContents } from "../../../helpers/library.helper";

const LibraryDirContainer = styled.section``;

const LibraryEntry = styled(Text)<LibraryEntryProps>`
  color: white;
  background-color: ${(p) => (p.index % 2 === 0 ? "#454747" : "")};
  cursor: pointer;
  padding: 0.2rem 1rem;

  &:hover {
    background-color: #476480;
  }
`;

const ScrollableList = styled.div`
  overflow-y: scroll;
  &::-webkit-scrollbar {
    width: 1px;
  }

  &::-webkit-scrollbar-track {
    background-color: #21212a;
  }
`;

const LibraryDirView = () => {
  const [libraries, playlist] = useStore(({ libraries, playlist }) => [
    libraries,
    playlist,
  ]);

  useEffect(() => {
    getLibraryDirContents();
  }, []);

  return (
    <LibraryDirContainer>
      <ScrollableList>
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
                        if (playlist.name && c.name) {
                          addContent(playlist.name, c.name);
                        }
                      }
                    }}
                  >
                    {c.name?.split(".")[0]}
                  </LibraryEntry>
                ))}
            </div>
          ) : null;
        })}
      </ScrollableList>
    </LibraryDirContainer>
  );
};

type LibraryEntryProps = TextProps & {
  index: number;
  onClick: () => void;
};

export default LibraryDirView;
