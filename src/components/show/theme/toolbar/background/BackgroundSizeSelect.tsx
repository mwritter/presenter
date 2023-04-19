import styled from "@emotion/styled";
import { Select } from "@mantine/core";

const SelectStyled = styled(Select)`
  & .mantine-Input-input {
    color: white;
    background-color: #282c34;
  }

  & .mantine-Select-label {
    color: white;
    font-size: smaller;
  }

  & .mantine-Select-item {
    color: white;
    margin: 0.1rem;
    font-size: small;
    &[data-selected="true"],
    &[data-hovered="true"] {
      background-color: #476480;
    }
  }

  & .mantine-Select-dropdown {
    background-color: #282c34;
  }
`;

const BackgroundSizeSelect = ({
  value,
  onChange,
}: BackgroundSizeSelectProps) => {
  return (
    <SelectStyled
      label="Fit"
      value={value}
      onChange={onChange}
      data={[
        { value: "contain", label: "Contain" },
        { value: "cover", label: "Cover" },
      ]}
    />
  );
};

interface BackgroundSizeSelectProps {
  value: string;
  onChange: (value: string) => void;
}

export default BackgroundSizeSelect;
