import styled from "@emotion/styled";
import { NumberInput } from "@mantine/core";
import { CSSProperties } from "react";

const FontSizeInputStyled = styled(NumberInput)`
  width: 50%;
  align-self: end;
  justify-self: end;
  & .mantine-Input-input {
    color: white;
    background-color: transparent;
  }

  & .mantine-NumberInput-label {
    color: white;
  }

  & .mantine-NumberInput-control {
    color: white;
  }
`;

const FontSizeInput = ({ value = 15, onChange }: FontSizeInputProps) => {
  return (
    <FontSizeInputStyled
      label="Size"
      min={0}
      max={200}
      value={parseInt(value?.toString())}
      onChange={onChange}
    />
  );
};

interface FontSizeInputProps {
  value: CSSProperties["fontSize"];
  onChange: (value: number) => void;
}

export default FontSizeInput;
