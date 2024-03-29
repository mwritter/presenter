import styled from "@emotion/styled";
import { Stack } from "@mantine/core";
import { editLibrarySlideData } from "../../../helpers/library.helper";
import useStore from "../../../store";
import Slide from "../slide/Slide";
import { useState } from "react";

const ShowViewGrid = styled.div`
  display: grid;
  width: 100%;
  grid-template-columns: repeat(auto-fill, 350px);
  gap: 1rem;
  justify-content: center;
  align-self: center;
`;

const LibraryShowView = () => {
  const [loading, setLoading] = useState(false);
  const library = useStore(({ library }) => library);
  return (
    <Stack p={20} spacing={50}>
      {!loading && (
        <ShowViewGrid>
          {library?.slides.map((slide, idx) => (
            <Slide
              index={idx}
              key={idx}
              theme={"default"}
              active={false}
              slide={slide}
              onClick={() => {}}
              onGroupChange={(group) => {
                editLibrarySlideData({ group }, slide.id);
              }}
            />
          ))}
        </ShowViewGrid>
      )}
    </Stack>
  );
};

export default LibraryShowView;
