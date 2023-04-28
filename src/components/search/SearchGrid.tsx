import styled from "@emotion/styled";
import { Center, LoadingOverlay, Text } from "@mantine/core";
import Slide from "../show/slide/Slide";
import { SearchEntryType, SlideEntryType } from "../../types/LibraryTypes";

const SearchGridContainer = styled.div`
  grid-area: results;
  position: relative;
  display: grid;
  padding: 2rem 0;
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
  isLoading,
}: SearchGridProps) => {
  return (
    <SearchGridContainer>
      {slides.length
        ? slides.map((slide, idx) => (
            <Slide
              index={idx}
              theme={theme}
              key={idx}
              slide={slide}
              size={350}
            />
          ))
        : search &&
          query && (
            <Center style={{ gridColumn: "1 / -1", placeSelf: "center" }}>
              <Text color="white">No items to display</Text>
            </Center>
          )}
    </SearchGridContainer>
  );
};

interface SearchGridProps {
  slides: SlideEntryType[];
  theme: string;
  search: SearchEntryType | null;
  query?: Record<string, string>;
  isLoading: boolean;
}

export default SearchGrid;
