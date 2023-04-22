import styled from "@emotion/styled";
import { Center, Text } from "@mantine/core";
import React from "react";
import Slide from "../show/slide/Slide";
import { SearchEntryType, ThemeEntryTagType } from "../../types/LibraryTypes";

const SearchGridContainer = styled.div`
  grid-area: results;
  display: grid;
  width: 100%;
  height: 100%;
  grid-template-columns: repeat(auto-fill, 350px);
  gap: 1rem;
  justify-content: center;
  align-content: start;
  align-self: center;
  overflow-y: scroll;
`;

const SearchGrid = ({
  slides,
  theme,
  search,
  query,
  onGetTag,
}: SearchGridProps) => {
  return (
    <SearchGridContainer>
      {slides.length
        ? slides.map((slide, idx) => (
            <Slide
              index={idx}
              theme={theme}
              key={idx}
              slide={{
                id: `slide-${idx}`,
                text: slide,
                tag: onGetTag(idx),
              }}
              size={350}
            />
          ))
        : search &&
          query && (
            <Center>
              <Text color="white">No items to display</Text>
            </Center>
          )}
    </SearchGridContainer>
  );
};

interface SearchGridProps {
  slides: string[];
  theme: string;
  search: SearchEntryType | null;
  query?: Record<string, string>;
  onGetTag: (index: number) => string;
}

export default SearchGrid;
