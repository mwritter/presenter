import styled from "@emotion/styled";
import { Button, ButtonProps, FocusTrap, Text, TextProps } from "@mantine/core";
import { forwardRef, useEffect, useImperativeHandle, useState } from "react";

const VariableListContainer = styled.div`
  display: grid;
  background-color: #21212a;
  padding: 1rem;
  border-radius: 5px;
  overflow-y: auto;
  overflow-x: hidden;
  max-height: 400px;
`;

const VariableListItem = styled(Text)<TextProps & { onClick: () => void }>`
  cursor: pointer;
  min-width: 250px;
  padding: 0 0.5rem;

  &.is-selected {
    background-color: #476480;
  }
`;

export default forwardRef(
  (props: { items: any[]; command: (args: any) => {} }, ref) => {
    const [selectedIndex, setSelectedIndex] = useState(0);

    const selectItem = (index: number) => {
      const item = props.items[index];

      if (item) {
        props.command({ id: `{{${item}}}`, label: item });
      }
    };

    const upHandler = () => {
      setSelectedIndex(
        (selectedIndex + props.items.length - 1) % props.items.length
      );
    };

    const downHandler = () => {
      setSelectedIndex((selectedIndex + 1) % props.items.length);
    };

    const selectHandler = () => {
      selectItem(selectedIndex);
    };

    useEffect(() => setSelectedIndex(0), [props.items]);

    useImperativeHandle(ref, () => ({
      onKeyDown: ({ event }: { event: React.KeyboardEvent }) => {
        if (event.key === "ArrowUp") {
          upHandler();
          return true;
        }

        if (event.key === "ArrowDown") {
          downHandler();
          return true;
        }

        if (event.code === "Enter") {
          selectHandler();
          return true;
        }

        return false;
      },
    }));

    return (
      <VariableListContainer>
        {props.items.length ? (
          props.items.map((item, index) => (
            <VariableListItem
              color="white"
              data-value={item.id}
              className={`item ${index === selectedIndex ? "is-selected" : ""}`}
              key={index}
              onClick={() => selectItem(index)}
            >
              {item}
            </VariableListItem>
          ))
        ) : (
          <div className="item">No result</div>
        )}
      </VariableListContainer>
    );
  }
);
