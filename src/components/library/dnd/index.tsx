import styled from "@emotion/styled";
import { Box, Text, TextProps } from "@mantine/core";
import { useListState } from "@mantine/hooks";
import { useEffect } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { PlaylistEntryType } from "../../../types/LibraryTypes";

const ListItemContainer = styled.div`
  display: flex;
  position: relative;
  &:has(.list-item)::before {
    position: absolute;
    left: 1.5rem;
    content: "";
    width: 5px;
    height: 100%;
    border-left: 1px solid white;
    border-bottom: 1px solid white;
  }
  & > div {
    width: 100%;
  }
`;

const ListItem = styled(Text)<TextProps>`
  border: 1px solid transparent;
  padding: 0 2.5rem;
  color: white;
  cursor: pointer;
  &:hover {
    border: 1px solid #3e72a3;
    background-color: transparent;
  }
`;

const DndListHandle = ({ data, onReorder }: DndListHandleProps) => {
  const [state, handlers] = useListState<PlaylistEntryType>([]);

  useEffect(() => {
    handlers.setState(data);
  }, [data]);

  useEffect(() => {
    const change = data.filter((d, i) => d.id !== state.at(i)?.id);
    if (state.length && change.length) {
      onReorder(state);
    }
  }, [state]);

  const items = state.map((item, index) => (
    <Draggable key={item.id} index={index} draggableId={item.id}>
      {(provided, snapshot) => (
        <div ref={provided.innerRef} {...provided.draggableProps}>
          <Box w="100%" {...provided.dragHandleProps}>
            <ListItem className="list-item">{item.name}</ListItem>
          </Box>
        </div>
      )}
    </Draggable>
  ));

  return (
    <ListItemContainer>
      <DragDropContext
        onDragEnd={({ destination, source }) => {
          handlers.reorder({ from: source.index, to: destination?.index || 0 });
        }}
      >
        <Droppable droppableId="dnd-list" direction="vertical">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
              {items}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </ListItemContainer>
  );
};

interface DndListHandleProps {
  data: PlaylistEntryType[];
  onReorder: (data: PlaylistEntryType[]) => void;
}

export default DndListHandle;
