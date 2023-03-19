import styled from "@emotion/styled";
import { ActionIcon, Title } from "@mantine/core";
import { IconPaint, IconTrash } from "@tabler/icons-react";
import React from "react";
import {
  editAllPlaylistSectionSlidesData,
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
        onHandleThemeChange={(content) =>
          editAllPlaylistSectionSlidesData(content, section).then(() => {
            projector?.emit("set-theme", content.theme);
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
    </SectionTitleContainer>
  );
};

interface PlaylistSectionToolBarProps {
  playlistName: string;
  section: PlaylistEntryType;
}

export default PlaylistSectionToolBar;
