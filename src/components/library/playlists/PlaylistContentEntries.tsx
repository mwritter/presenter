import styled from "@emotion/styled";
import { Text, TextProps } from "@mantine/core";
import { PlaylistEntryType } from "../../../types/LibraryTypes";
import DndListHandle from "../dnd";

const PlaylistContentEntriesContainer = styled.div`
  position: relative;
  &:not(:empty)::before {
    position: absolute;
    left: 1.5rem;
    content: "";
    width: 5px;
    height: 100%;
    border-left: 1px solid white;
    border-bottom: 1px solid white;
  }
`;

const PlaylistItem = styled(Text)<TextProps>`
  border: 1px solid transparent;
  padding: 0 2.5rem;
  color: white;
  cursor: pointer;
  &:hover {
    border: 1px solid #3e72a3;
    background-color: transparent;
  }
`;

const PlaylistContentEntries = ({ items }: PlaylistContentEntriesProps) => {
  console.log(items);
  // return <DndListHandle data={items} />;
};

interface PlaylistContentEntriesProps {
  items: PlaylistEntryType[];
}

export default PlaylistContentEntries;
