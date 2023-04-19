import styled from "@emotion/styled";
import { ActionIcon, Text, TextProps, Title } from "@mantine/core";
import { useEffect, useState } from "react";
import { IconPlus } from "@tabler/icons-react";
import { SearchEntryType } from "../../../types/LibraryTypes";
import useStore from "../../../store";
import {
  getSearchDirContents,
  setSearchDirectory,
} from "../../../helpers/search.helper";

const SearchDirContainer = styled.section``;

const SearchEntry = styled(Text)<SearchEntryProps>`
  color: white;
  cursor: pointer;
  padding: 0.2rem 1rem;
  background-color: ${(p) => (p.selected ? "#476480" : "")};
  &:hover {
    background-color: #476480;
  }
`;

const SearchHeaderContainer = styled.div`
  position: sticky;
  top: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  justify-self: flex-start;
  background-color: #21212a;
  z-index: 1;
`;

const SearchDirTitle = styled(Title)`
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

const SearchEntryView = () => {
  const { searchDirectories, search } = useStore(
    ({ searchDirectories, search }) => ({
      searchDirectories,
      search,
    })
  );

  useEffect(() => {
    getSearchDirContents();
  }, []);
  // TODO: add a segment control for directory vs api search
  return (
    <SearchDirContainer>
      <SearchHeaderContainer>
        <SearchDirTitle order={6}>SEARCH</SearchDirTitle>
        <ActionIcon onClick={() => {}}>
          <IconPlus size={16} />
        </ActionIcon>
      </SearchHeaderContainer>
      <ScrollableList>
        {searchDirectories.map((directory) => {
          return (
            <SearchEntry
              selected={search?.directory === directory.name}
              key={directory.name}
              onClick={() => {
                if (directory.name) {
                  setSearchDirectory(directory.name);
                }
              }}
            >
              {directory.name}
            </SearchEntry>
          );
        })}
      </ScrollableList>
    </SearchDirContainer>
  );
};

type SearchEntryProps = TextProps & {
  selected: boolean;
  onClick: () => void;
};

export default SearchEntryView;
