import styled from "@emotion/styled";
import {
  ActionIcon,
  Box,
  Checkbox,
  Group,
  List,
  TextInput,
  Title,
} from "@mantine/core";
import { IconEdit } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { addMediaContent } from "../../../helpers/playlist.helper";

import useStore from "../../../store";
import { MediaEntryType } from "../../../types/LibraryTypes";
import MediaAddPlaylistMenu from "./MediaAddToPlaylistMenu";
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
  flex: 1;
  padding: 0;
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

const MediaEditToolBar = ({
  selected,
  selectAll,
  onSelectAll,
  onReset,
}: MediaEditToolBarProps) => {
  const [editMedia, setEditMedia] = useState(false);
  const media = useStore(({ media }) => media);
  const [mediaName, setMediaName] = useState<string>();

  useEffect(() => {
    if (media) setMediaName(media.name);
  }, [media]);

  return media ? (
    <MediaEditToolBarContainer>
      <Group style={{ flex: 1 }}>
        <Checkbox
          size="xs"
          color="gray"
          checked={selectAll}
          onChange={(evt) => onSelectAll(evt.currentTarget.checked)}
        />
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
      </Group>
      <MediaActionsList>
        <List.Item>
          <ActionIcon
            disabled={editMedia}
            onClick={() => {
              setEditMedia(true);
            }}
          >
            <IconEdit size={14} />
          </ActionIcon>
        </List.Item>
        <List.Item>
          <MediaFileInput />
        </List.Item>
        <List.Item>
          <MediaAddPlaylistMenu
            disabled={!Boolean(selected.length)}
            onPlaylistSelect={(playlistName) => {
              addMediaContent(playlistName, selected).then(onReset);
            }}
          />
        </List.Item>
      </MediaActionsList>
    </MediaEditToolBarContainer>
  ) : null;
};

interface MediaEditToolBarProps {
  selected: MediaEntryType[];
  selectAll: boolean;
  onSelectAll: (value: boolean) => void;
  onReset: () => void;
}

export default MediaEditToolBar;
