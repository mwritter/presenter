import styled from "@emotion/styled";
import { Text, TextProps, Title } from "@mantine/core";
import useStore from "../../../store";
import { useEffect, useState } from "react";
import {
  getLibraryDirContents,
  getLibraryFileData,
} from "../../../helpers/library.helper";
import LibraryFileInput from "./LibraryFileInput";

const LibraryDirContainer = styled.section``;

const LibraryEntry = styled(Text)<LibraryEntryProps>`
  color: white;
  cursor: pointer;
  padding: 0.2rem 1rem;
  background-color: ${(p) => (p.selected ? "#476480" : "")};
  &:hover {
    background-color: #476480;
  }
`;

const LibraryHeaderContainer = styled.div`
  position: sticky;
  top: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  justify-self: flex-start;
  background-color: #21212a;
  z-index: 1;
`;

const LibraryDirTitle = styled(Title)`
  align-self: flex-start;
  padding: 0.5rem;
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
  const [libraries, library, playlist, setLibrary] = useStore(
    ({ libraries, library, playlist, setLibrary }) => [
      libraries,
      library,
      playlist,
      setLibrary,
    ]
  );
  const [selected, setSelected] = useState<string>(library?.path || "");

  useEffect(() => {
    getLibraryDirContents();
  }, []);

  return (
    <LibraryDirContainer>
      <LibraryHeaderContainer>
        <LibraryDirTitle order={6}>LIBRARY</LibraryDirTitle>
        <LibraryFileInput />
      </LibraryHeaderContainer>
      <ScrollableList>
        {libraries.map((f) => {
          return f.children ? (
            <div key={f.path}>
              {f.children
                .filter((l) => l.name && !/^\./.test(l.name))
                .map((c, idx) => (
                  <LibraryEntry
                    selected={selected === c.path}
                    key={c.path}
                    onClick={() => {
                      if (c.name) {
                        getLibraryFileData(c.name).then(setLibrary);
                      }
                      setSelected(c.path);
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
  selected: boolean;
  onClick: () => void;
};

export default LibraryDirView;
