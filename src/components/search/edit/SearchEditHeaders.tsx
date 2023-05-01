import styled from "@emotion/styled";
import { Box, Button, Group, Text, TextInput } from "@mantine/core";
import { useEffect, useState } from "react";
import { IconTrash } from "@tabler/icons-react";

const SearchAddHeaderContainer = styled.div`
  width: 500px;
  display: grid;
  gap: 1rem;
`;

const SearchEditHeaders = ({ headers, onChange }: SearchEditHeadersProps) => {
  const [state, setState] = useState({
    adding: false,
    key: "",
    value: "",
  });

  return (
    <SearchAddHeaderContainer>
      <Text size="sm" color="white" style={{ gridColumn: "1 / -1" }}>
        Headers
      </Text>
      {Object.entries(headers).length
        ? Object.entries(headers).map(([key, value], idx) => (
            <SearchHeaderInput
              key={idx}
              keyValue={key}
              value={value}
              onDeleteHeader={(key) => {
                const newHeaders = { ...headers };
                delete newHeaders[key];
                onChange(newHeaders);
              }}
            />
          ))
        : null}
      {!state.adding && (
        <Button
          style={{ justifySelf: "start" }}
          onClick={() => setState((cur) => ({ ...cur, adding: true }))}
        >
          Add Header
        </Button>
      )}
      {state.adding ? (
        <SearchHeaderInput
          keyValue={state.key}
          value={state.value}
          onChange={(key: string, value: string) => {
            setState((cur) => ({ ...cur, key, value }));
          }}
        />
      ) : null}
      {state.adding && (
        <Group>
          <Button
            onClick={() => {
              if (state.key.trim().length && state.value.trim().length) {
                if (state.key in headers) return;
                onChange({ ...headers, [state.key]: state.value });
                setState({ adding: false, key: "", value: "" });
              }
            }}
          >
            Save
          </Button>
          <Button
            color="red"
            onClick={() => setState((cur) => ({ ...cur, adding: false }))}
          >
            Cancel
          </Button>
        </Group>
      )}
    </SearchAddHeaderContainer>
  );
};

interface SearchEditHeadersProps {
  onChange: (headers: Record<string, string>) => void;
  headers: Record<string, string>;
}

export default SearchEditHeaders;

const TextInputStyled = styled(TextInput)`
  width: 250px;
  & .mantine-TextInput-input {
    color: white;
    background-color: transparent;
  }
  & .mantine-TextInput-label {
    color: white;
  }
`;

const SearchHeaderInput = ({
  keyValue,
  value,
  onChange,
  onDeleteHeader,
}: {
  keyValue: string;
  value: string;
  onChange?: (key: string, value: string) => void;
  onDeleteHeader?: (key: string) => void;
}) => {
  const [state, setState] = useState({ key: keyValue, value });

  useEffect(() => {
    onChange?.(state.key, state.value);
  }, [state]);

  return (
    <Box
      style={{
        display: "grid",
        gridTemplateColumns: "auto auto auto",
        justifyContent: "start",
        gap: "0.5rem",
      }}
    >
      <TextInputStyled
        placeholder="Key"
        value={state.key}
        onChange={(evt) => {
          setState((cur) => ({ ...cur, key: evt.target.value }));
        }}
      />
      <TextInputStyled
        placeholder="Value"
        value={state.value}
        onChange={(evt) => {
          setState((cur) => ({ ...cur, value: evt.target.value }));
        }}
      />
      {onDeleteHeader && (
        <Button
          variant="filled"
          color="red"
          onClick={() => onDeleteHeader(state.key)}
        >
          <IconTrash size={14} />
        </Button>
      )}
    </Box>
  );
};
