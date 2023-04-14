import styled from "@emotion/styled";
import { Stack } from "@mantine/core";
import { useCallback, useEffect, useState } from "react";

import useStore from "../../../store";
import { MediaEntryType } from "../../../types/LibraryTypes";
import MediaEditToolBar from "../../library/media/MediaEditToolBar";

const ShowViewGrid = styled.div`
  display: grid;
  width: 100%;
  grid-template-columns: repeat(auto-fill, 350px);
  gap: 1rem;
  justify-content: center;
  align-self: center;
`;

const MediaFileContainer = styled.div<MediaFileContainerProps>`
  display: flex;
  justify-content: center;
  width: 350px;
  border: 3px solid;
  border-color: ${(p) => (p.selected ? "#9DC08B" : "#ccc")};
  border-radius: 5px;
  cursor: pointer;
  background-color: #07090e7f;
`;

const MediaShowView = () => {
  const [selectedMedia, setSelectedMedia] = useState<MediaEntryType[]>([]);
  const [selectAll, setSelectAll] = useState(false);

  const media = useStore(({ media }) => media);

  // TODO: allow shift and ctrl click for quick selections
  const selectMedia = useCallback((mediaEntry: MediaEntryType) => {
    const found = selectedMedia.find(({ name }) => name === mediaEntry.name);

    setSelectedMedia((cur) =>
      found
        ? cur.filter(({ name }) => name !== mediaEntry.name)
        : [...cur, mediaEntry]
    );
  }, []);

  useEffect(() => {
    if (selectAll && media?.items) {
      setSelectedMedia(media.items);
    } else {
      setSelectedMedia([]);
    }
  }, [selectAll]);

  return (
    <>
      <MediaEditToolBar
        selected={selectedMedia}
        selectAll={selectAll}
        onSelectAll={setSelectAll}
        onReset={() => {
          setSelectedMedia([]);
          setSelectAll(false);
        }}
      />
      <Stack p={20} spacing={50}>
        <ShowViewGrid>
          {media?.items.map((item, idx) => (
            <MediaFileContainer
              key={item.name}
              selected={Boolean(
                selectedMedia.find((m) => m.name === item.name)
              )}
              onClick={() => {
                selectMedia(item);
              }}
            >
              <img src={item.thumbnail} width="100%" />
            </MediaFileContainer>
          ))}
        </ShowViewGrid>
      </Stack>
    </>
  );
};

interface MediaFileContainerProps {
  selected: boolean;
}

export default MediaShowView;
