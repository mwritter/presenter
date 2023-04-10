import styled from "@emotion/styled";
import { ActionIcon, Title } from "@mantine/core";
import { IconEdit, IconPaint, IconTrash } from "@tabler/icons-react";
import React from "react";
import {
  editPlaylistSection,
  removeContent,
} from "../../../helpers/playlist.helper";
import useStore from "../../../store";
import { PlaylistEntryType } from "../../../types/LibraryTypes";
import PlaylistChangeThemeMenu from "./PlaylistThemeMenu";

const SectionTitleContainer = styled.div`
  display: flex;
  position: sticky;
  top: 36px;
  background-color: #ccc;
  padding: 5px;
  border-radius: 5px;
  align-items: center;
  z-index: 1;
`;

const SectionTitle = styled(Title)`
  font-size: medium;
  flex: 1;
`;
const PlaylistSectionToolBar = ({
  playlistName,
  section,
}: PlaylistSectionToolBarProps) => {
  const projector = useStore(({ projector }) => projector);
  return (
    <SectionTitleContainer>
      <SectionTitle>{section.name?.split(".")[0]}</SectionTitle>
      <PlaylistChangeThemeMenu
        onHandleThemeChange={(theme) =>
          editPlaylistSection({ theme }, section).then(() => {
            projector?.webview?.emit("set-theme", theme);
          })
        }
      />
      <ActionIcon
        onClick={() => {
          removeContent(playlistName, section.id);
        }}
      >
        <IconTrash size={12} />
      </ActionIcon>
      <ActionIcon
        onClick={() => {
          // TODO: move all actions into a Modal
        }}
      >
        <IconEdit size={12} />
      </ActionIcon>
    </SectionTitleContainer>
  );
};

interface PlaylistSectionToolBarProps {
  playlistName: string;
  section: PlaylistEntryType;
}

export default PlaylistSectionToolBar;
