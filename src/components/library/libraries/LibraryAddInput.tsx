import styled from "@emotion/styled";
import { TextInput } from "@mantine/core";
import { useState } from "react";

const TextInputStyled = styled(TextInput)`
  & .mantine-TextInput-input {
    color: white;
    background-color: transparent;
  }
`;

const LibraryAddInput = ({ onClose, onEnter }: LibraryAddInputProps) => {
  const [value, setValue] = useState<string>("");
  return (
    <TextInputStyled
      p={5}
      autoFocus
      placeholder="New Library"
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onBlur={onClose}
      onKeyDown={(e) => {
        if (e.key === "Escape") {
          onClose();
        } else if (e.key === "Enter") {
          onEnter(e.currentTarget.value);
        }
      }}
    />
  );
};

interface LibraryAddInputProps {
  onClose: () => void;
  onEnter: (value: string) => void;
}

export default LibraryAddInput;
