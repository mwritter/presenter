import styled from "@emotion/styled";
import { ActionIcon, List, TextInput, Title } from "@mantine/core";
import { IconEdit } from "@tabler/icons-react";
import { useState } from "react";

import useStore from "../../../store";
import MediaFileInput from "./MediaFileInput";

const MediaEditToolBarContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  position: sticky;
  top: 0px;
  z-index: 1;
  background-color: #21212a;
  padding: 4px;
  padding-left: 1rem;
`;

const MediaTextInput = styled(TextInput)`
  width: 100%;
  padding: 0;
  padding-left: 1rem;
  & .mantine-TextInput-input {
    color: white;
    background-color: transparent;
  }
`;

const MediaActionsList = styled(List)`
  display: flex;
  gap: 0.5rem;
  list-style: none;
`;

const MediaEditToolBar = () => {
  const [editMedia, setEditMedia] = useState(false);
  const media = useStore(({ media }) => media);
  const [mediaName, setMediaName] = useState(media?.name || "");

  return media ? (
    <MediaEditToolBarContainer>
      {editMedia ? (
        <MediaTextInput
          autoFocus
          value={mediaName}
          onChange={(e) => setMediaName(e.target.value)}
          onBlur={() => {
            setMediaName(media.name);
            setEditMedia(false);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              //   renameMedia(mediaName, media).then(() =>
              //     setEditMedia(false)
              //   );
            } else if (e.key === "Escape") {
              setMediaName(media.name);
              setEditMedia(false);
            }
          }}
        />
      ) : (
        <Title order={5} color={"white"}>
          {media.name}
        </Title>
      )}
      <MediaActionsList>
        <List.Item>
          <ActionIcon
            disabled={editMedia}
            onClick={() => {
              setEditMedia((c) => true);
            }}
          >
            <IconEdit size={14} />
          </ActionIcon>
        </List.Item>
        <List.Item>
          <MediaFileInput />
        </List.Item>
      </MediaActionsList>
    </MediaEditToolBarContainer>
  ) : null;
};

export default MediaEditToolBar;
