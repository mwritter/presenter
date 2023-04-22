import styled from "@emotion/styled";
import { Button, Group, Select, Text, TextInput } from "@mantine/core";
import { SearchEntryField, SearchEntryType } from "../../types/LibraryTypes";

const TextInputStyled = styled(TextInput)`
  & .mantine-TextInput-input {
    color: white;
    background-color: transparent;
  }
  & .mantine-TextInput-label {
    color: white;
  }
`;

const SearchControlsContainer = styled.div`
  grid-area: controls;
  display: flex;
  flex-direction: column;
  align-items: start;
  gap: 1rem;
  padding: 1rem;
`;

const SearchControlsStyled = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, 350px);
  gap: 1rem;
  width: 100%;
`;

const SearchSelect = styled(Select)`
  & .mantine-Input-input {
    font-family: ${(p) => p.value};
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

const SearchControls = ({
  search,
  onFeildChange,
  query,
  onRunQuery,
}: SearchControlsProps) => {
  return (
    <SearchControlsContainer>
      <SearchControlsStyled>
        {search &&
          search?.fields.map((field) => {
            const { type, name, data } = field;
            switch (type) {
              case "input":
                return (
                  <TextInputStyled
                    key={name + "-input"}
                    label={name}
                    value={query ? query[name] : ""}
                    onChange={(evt) => {
                      const value = evt.currentTarget?.value || "";
                      onFeildChange(field, value);
                    }}
                  />
                );
              case "select": {
                return (
                  <SearchSelect
                    key={name + "-select"}
                    label={name}
                    data={data || []}
                    value={query ? query[name] : ""}
                    onChange={(value) => {
                      if (!value) return;
                      onFeildChange(field, value);
                    }}
                  />
                );
              }
            }
          })}
      </SearchControlsStyled>
      {query && search && (
        <>
          <Group style={{ gap: "1rem" }}>
            <Text size="xs" color="white" mr={5}>
              Query:
            </Text>
            {Object.entries(query).map(([key, value]) => (
              <Group key={`${key}-key`} style={{ gap: ".1rem" }}>
                <Text weight="bold" size="xs" color="white">
                  {key}:
                </Text>
                <Text size="xs" color="white">
                  {value}
                </Text>
              </Group>
            ))}
          </Group>
        </>
      )}
      {search && !search.fields.find((f) => f.type === "api") && (
        <Button onClick={onRunQuery}>Search</Button>
      )}
    </SearchControlsContainer>
  );
};

interface SearchControlsProps {
  search: SearchEntryType | null;
  onFeildChange: (feild: SearchEntryField, value: string) => void;
  query?: Record<string, string>;
  onRunQuery: () => void;
}

export default SearchControls;