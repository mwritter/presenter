import styled from "@emotion/styled";
import {
  Button,
  ColorInput,
  ColorInputProps,
  NumberInput,
  Textarea,
  TextareaProps,
} from "@mantine/core";
import { emit } from "@tauri-apps/api/event";
import { CSSProperties, useCallback, useEffect, useState } from "react";
import FontSizeInput from "../../show/theme/toolbar/font/FontSizeInput";
import Slide from "../../show/slide/Slide";

const MessageViewContainer = styled.div`
  display: grid;
  gap: 1rem;
`;

const MessageViewText = styled(Textarea)<TextareaProps>`
  & .mantine-Input-input {
    background: transparent;
    color: white;
  }
`;

const MessageColorInput = styled(ColorInput)<ColorInputProps>`
  .mantine-ColorInput-label {
    color: white;
  }

  .mantine-ColorInput-input {
    background: transparent;
    color: white;
  }
`;

const MessageNumberInput = styled(NumberInput)`
  .mantine-NumberInput-label {
    color: white;
  }
  .mantine-NumberInput-input {
    background: transparent;
    color: white;
  }
`;

const MessageView = () => {
  const [state, setState] = useState<MessageType>({
    show: false,
    text: "",
    style: {
      bottom: "10%",
      left: "10%",
      fontSize: "48px",
      color: "rgba(255, 255, 255, 1)",
      backgroundColor: "rgba(0, 0, 0, 0)",
    },
  });

  const toggleShow = useCallback(
    (show: boolean) => {
      emit("toggle-message", {
        show,
        text: state.text,
        style: state.style,
      });
      setState((cur) => ({ ...cur, show }));
    },
    [state]
  );

  return (
    <MessageViewContainer>
      <MessageViewText
        onChange={(evt) =>
          setState((cur) => ({ ...cur, text: evt.target.value }))
        }
      />

      <MessageColorInput
        label="Font Color"
        format="rgba"
        value={state.style?.color}
        onChange={(color) => {
          setState((cur) => ({ ...cur, style: { ...cur.style, color } }));
        }}
      />
      <MessageColorInput
        label="Background Color"
        format="rgba"
        value={state.style?.backgroundColor}
        onChange={(backgroundColor) => {
          setState((cur) => ({
            ...cur,
            style: { ...cur.style, backgroundColor },
          }));
        }}
      />
      <FontSizeInput
        value={+(state.style?.fontSize?.toString()?.split("p")[0] || "0")}
        onChange={(value) => {
          setState((cur) => ({
            ...cur,
            style: { ...cur.style, fontSize: `${value}px` },
          }));
        }}
      />
      {!state.show ? (
        <Button onClick={() => toggleShow(true)}>Show</Button>
      ) : (
        <Button onClick={() => toggleShow(false)}>Hide</Button>
      )}
      {/* TODO: add preview or rework this message theming */}
      {state.text && (
        <Slide
          slide={{ id: "message-preview", text: state.text }}
          theme="message"
          size={275}
          style={state.style}
        />
      )}
    </MessageViewContainer>
  );
};

type MessageType = {
  show: boolean;
  text: string;
  style: CSSProperties | null;
};

export default MessageView;
