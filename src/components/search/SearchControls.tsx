import styled from "@emotion/styled";
import {
  Autocomplete,
  Button,
  Group,
  LoadingOverlay,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import {
  SearchEntryField,
  SearchEntryType,
  ThemeEntryType,
} from "../../types/LibraryTypes";

const TextInputStyled = styled(TextInput)`
  & .mantine-TextInput-input {
    color: white;
    background-color: transparent;
  }
  & .mantine-TextInput-label {
    color: white;
  }
`;

const SearchControlsContainer = styled.div<SearchControlsContainerProps>`
  grid-area: ${(p) => (p.editMode ? "" : "controls")};
  display: flex;
  flex-direction: column;
  align-items: start;
  overflow-x: hidden;
  gap: 1rem;
  padding: 1rem;
  border: ${(p) => (p.editMode ? "1px solid white" : "none")};
`;

const SearchControlsStyled = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, 350px);
  gap: 1rem;
  width: 100%;
`;

const SearchSelect = styled(Autocomplete)`
  & .mantine-Input-input {
    color: white;
    background-color: #282c34;
  }

  & .mantine-Autocomplete-label {
    color: white;
    font-size: smaller;
  }

  & .mantine-Autocomplete-item {
    color: white;
    margin: 0.1rem;
    font-size: small;
    &[data-selected="true"],
    &[data-hovered="true"] {
      background-color: #476480;
    }
  }

  & .mantine-Autocomplete-dropdown {
    background-color: #282c34;
  }
`;

const SystemControls = styled.div``;

const SearchControls = ({
  search,
  themes,
  theme,
  onSetTheme,
  onFeildChange,
  query,
  onRunQuery,
  errorField,
  disabled,
  editMode,
}: SearchControlsProps) => {
  return (
    <SearchControlsContainer editMode={editMode}>
      <SearchControlsStyled>
        {search &&
          search?.fields.map((field) => {
            const { type, name, data, variables } = field;
            switch (type) {
              case "input":
                return (
                  <TextInputStyled
                    disabled={disabled || editMode}
                    key={name + "-input"}
                    error={
                      errorField && variables.includes(errorField)
                        ? errorField
                        : ""
                    }
                    label={name}
                    value={query ? query[name] : ""}
                    onChange={(evt) => {
                      const value = evt.currentTarget?.value || "";
                      onFeildChange?.(field, value);
                    }}
                  />
                );
              case "select": {
                return (
                  <SearchSelect
                    disabled={disabled || editMode}
                    autoComplete="false"
                    error={
                      errorField && variables.includes(errorField)
                        ? errorField
                        : ""
                    }
                    key={name + "-select"}
                    label={name}
                    data={data || []}
                    value={query ? query[name] : ""}
                    onChange={(value) => {
                      onFeildChange?.(field, value);
                    }}
                  />
                );
              }
            }
          })}
      </SearchControlsStyled>
      {query && search && !editMode && (
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
      <SystemControls>
        {search && !editMode && (
          <Stack style={{ flexDirection: "row", alignItems: "end" }}>
            <SearchSelect
              disabled={disabled}
              label="Theme"
              value={theme?.name}
              data={
                themes?.map(({ name }) => ({ value: name, label: name })) || []
              }
              onChange={(value) => {
                const found = themes?.find(({ name }) => name === value);
                if (found) {
                  onSetTheme?.(found);
                }
              }}
            />
            <Button disabled={disabled} onClick={onRunQuery}>
              <>
                <LoadingOverlay
                  visible={disabled || false}
                  exitTransitionDuration={250}
                  overlayOpacity={0.1}
                  transitionDuration={250}
                  overlayBlur={1}
                  overlayColor="black"
                  loaderProps={{ color: "white", size: "xs" }}
                />
                Search
              </>
            </Button>
          </Stack>
        )}
      </SystemControls>
    </SearchControlsContainer>
  );
};

interface SearchControlsProps {
  search: SearchEntryType | null;
  theme?: ThemeEntryType;
  themes?: ThemeEntryType[];
  onSetTheme?: (theme: ThemeEntryType) => void;
  onFeildChange?: (feild: SearchEntryField, value: string) => void;
  query?: Record<string, string>;
  onRunQuery?: () => void;
  errorField?: string | null;
  disabled?: boolean;
  editMode: boolean;
}

interface SearchControlsContainerProps {
  editMode: boolean;
}

export default SearchControls;
