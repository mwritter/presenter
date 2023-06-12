import styled from "@emotion/styled";
import useStore from "../../../store";
import {
  Autocomplete,
  Box,
  Button,
  Group,
  Modal,
  Select,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import SearchControls from "../SearchControls";
import { useCallback, useEffect, useState } from "react";
import { SearchEntryField, SearchEntryType } from "../../../types/LibraryTypes";
import SearchEditHeaders from "./SearchEditHeaders";
import SearchEditURL from "./SearchEditURL";
import { editSearchEntry } from "../../../helpers/search.helper";
import SearchEditFieldModal from "./SearchEditFieldModal";
import SearchEntryDeleteModal from "./SearchEntryDeleteModal";

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
  const [editField, setEditField] = useState<SearchEntryField>();
  const [searchState, setSearchState] = useState<SearchEntryType>();
  const [parsedHeaders, setParsedHeaders] = useState<Record<string, string>>(
    {}
  );
  const [urlState, setURLState] = useState({
    url: "",
    urlJSON: "",
  });

  const onHeaderChange = useCallback((headers: Record<string, string>) => {
    setParsedHeaders(headers);
  }, []);

  const onURLChange = useCallback((url: string, urlJSON: string) => {
    setURLState((cur) => ({ ...cur, url, urlJSON }));
  }, []);

  useEffect(() => {
    setSearchState((cur) => {
      const newHeaders = JSON.stringify(parsedHeaders);
      let { url, urlJSON, headers } = searchState?.extractor || {};
      if (urlState.url !== url) {
        url = urlState.url;
      }

      if (urlState.urlJSON !== urlJSON) {
        urlJSON = urlState.urlJSON;
      }

      if (newHeaders !== headers) {
        headers = newHeaders;
      }

      return {
        ...cur,
        extractor: { ...cur?.extractor, headers, url, urlJSON },
      } as SearchEntryType;
    });
  }, [urlState.url, urlState.urlJSON, parsedHeaders]);

  useEffect(() => {
    if (search) {
      setSearchState(search);
      const { headers, url, urlJSON } = search.extractor;
      if (headers) {
        const parsed = JSON.parse(headers);
        setParsedHeaders(parsed);
      }
      setURLState((cur) => {
        const newCur = { ...cur };
        if (urlJSON) {
          newCur.urlJSON = urlJSON;
        }
        if (url) {
          newCur.url = url;
        }
        return newCur;
      });
    }
  }, [search]);

  if (!searchState) return <></>;

  return (
    <SearchCreateContainer>
      <Group>
        <Button
          style={{ alignSelf: "start" }}
          onClick={() => {
            editSearchEntry(searchState);
          }}
        >
          Save
        </Button>
        <SearchEntryDeleteModal />
      </Group>
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
        <SearchControls
          search={searchState}
          editMode={true}
          onEditField={(field: SearchEntryField) => {
            setEditField(field);
          }}
        />
        <SearchEditFieldModal
          field={editField}
          opened={Boolean(editField)}
          onClose={() => setEditField(undefined)}
        />
      </SearchControlsContainer>
      <SearchEditURL onChange={onURLChange} urlJSON={urlState.urlJSON} />
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
