import styled from "@emotion/styled";
import { TextInput } from "@mantine/core";

const TextInputStyled = styled(TextInput)`
  & .mantine-TextInput-input {
    color: white;
    background-color: transparent;
  }
`;

const ItemLibrarySearch = ({
  value,
  onChange,
  onBlur,
}: ItemLibrarySearchProps) => {
  return (
    <TextInputStyled
      value={value}
      px={5}
      autoFocus={true}
      placeholder="Search..."
      onChange={(e) => onChange(e.target.value)}
      onBlur={onBlur}
    />
  );
};

interface ItemLibrarySearchProps {
  value: string;
  onChange: (value: string) => void;
  onBlur: () => void;
}

export default ItemLibrarySearch;
