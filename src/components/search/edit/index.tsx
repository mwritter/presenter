import styled from "@emotion/styled";
import useStore from "../../../store";
import {
  Autocomplete,
  Box,
  Button,
  Group,
  Select,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import SearchControls from "../SearchControls";
import { useCallback, useEffect, useState } from "react";
import { SearchEntryType } from "../../../types/LibraryTypes";
import SearchEditHeaders from "./SearchEditHeaders";
import SearchEditURL from "./SearchEditURL";

const SearchCreateContainer = styled.div`
  grid-area: results;
  display: flex;
  flex-direction: column;
  position: relative;
  padding: 2rem;
  gap: 1rem;
  overflow-x: hidden;
`;

const TextInputStyled = styled(TextInput)`
  width: ${(p) => p.width ?? "250px"};
  & .mantine-TextInput-input {
    color: white;
    background-color: transparent;
  }
  & .mantine-TextInput-label {
    color: white;
  }
`;

const SearchControlsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const SearchSelect = styled(Select)`
  width: 250px;
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

const SearchEdit = () => {
  const { search } = useStore(({ search }) => ({ search }));
  const [searchState, setSearchState] = useState<SearchEntryType>();
  const [parsedHeaders, setParsedHeaders] = useState<Record<string, string>>(
    {}
  );
  const [urlState, setURLState] = useState({
    editing: false,
    url: "",
  });

  const onHeaderChange = useCallback((headers: Record<string, string>) => {
    setParsedHeaders(headers);
  }, []);

  useEffect(() => {
    if (search) {
      setSearchState(search);
      const { headers, url } = search.extractor;
      if (headers) {
        const parsed = JSON.parse(headers);
        setParsedHeaders(parsed);
      }
      if (url) {
        setURLState((cur) => ({ ...cur, url }));
      }
    }
  }, [search]);

  if (!searchState) return <></>;

  return (
    <SearchCreateContainer>
      <Button style={{ alignSelf: "start" }}>Save</Button>
      <TextInputStyled
        label="Search Name"
        value={searchState.name || ""}
        onChange={(evt) => {
          setSearchState(
            (cur) => ({ ...cur, name: evt.target.value } as SearchEntryType)
          );
        }}
      />
      <SearchControlsContainer>
        <SearchControls search={searchState} editMode={true} />
        <Button style={{ alignSelf: "end" }}>Add Field</Button>
      </SearchControlsContainer>
      <SearchEditURL
        url={urlState.url}
        editMode={urlState.editing}
        onToggleEditMode={() =>
          setURLState((cur) => ({ ...cur, editing: !cur.editing }))
        }
      />
      <SearchSelect
        label="API Return Type"
        data={[
          { value: "array", label: "Array" },
          { value: "object", label: "Object" },
        ]}
        value={searchState.extractor.type}
        onChange={(value) => {
          if (value) {
            setSearchState(
              (cur) =>
                ({
                  ...cur,
                  extractor: { ...cur?.extractor, type: value },
                } as SearchEntryType)
            );
          }
        }}
      />
      <SearchEditHeaders onChange={onHeaderChange} headers={parsedHeaders} />
    </SearchCreateContainer>
  );
};

export default SearchEdit;
