import styled from "@emotion/styled";
import { Stack } from "@mantine/core";

import useStore from "../../../store";
import MediaEditToolBar from "../../library/media/MediaEditToolBar";

const ShowViewGrid = styled.div`
  display: grid;
  max-width: 2000px;
  width: 100%;
  grid-template-columns: repeat(auto-fill, 350px);
  gap: 1rem;
  justify-content: center;
  align-self: center;
`;

const MediaFileContainer = styled.div`
  display: flex;
  justify-content: center;
  width: 350px;
  border: 3px solid #ccc;
  border-radius: 5px;
  cursor: pointer;
  background-color: #07090e7f;
`;

const MediaShowView = () => {
  const media = useStore(({ media }) => media);

  return (
    <>
      <MediaEditToolBar />
      <Stack p={20} spacing={50}>
        <ShowViewGrid>
          {media?.items.map((item) => (
            <MediaFileContainer key={item.name}>
              <img src={item.thumbnail} width="100%" />
            </MediaFileContainer>
          ))}
        </ShowViewGrid>
      </Stack>
    </>
  );
};

export default MediaShowView;
