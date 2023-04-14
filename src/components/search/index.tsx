import { BaseDirectory, FileEntry, readTextFile } from "@tauri-apps/api/fs";
import { useCallback, useEffect, useState } from "react";
import {
  getSearchDirContents,
  queryDirectory,
} from "../../helpers/search.helper";
import { Button, Select, Text, TextInput } from "@mantine/core";
import useStore from "../../store";
import styled from "@emotion/styled";
import Slide from "../show/slide/Slide";
import { getThemeEnties } from "../../helpers/theme.helper";
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

const SearchControls = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, 350px);
  gap: 1rem;
  width: 100%;
`;

const SearchControlsContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: start;
  gap: 1rem;
  padding: 1rem;
`;

const SearchGrid = styled.div`
  display: grid;
  width: 100%;
  grid-template-columns: repeat(auto-fill, 350px);
  gap: 1rem;
  justify-content: center;
  align-self: center;
  margin-top: 2rem;
`;

const SearchView = () => {
  const [slides, setSlides] = useState<string[]>([]);
  const [query, setQuery] = useState<Record<string, string>>({});
  const { search } = useStore(({ search }) => ({ search }));

  const runQuery = useCallback(async () => queryDirectory(query), [query]);

  const onFeildChange = useCallback(
    (feild: SearchEntryField, value: string) => {
      const regex = new RegExp(`[${feild.delimiters}]`);
      const queryValues = value.split(regex);
      const queryObject: Record<string, string> = queryValues.reduce(
        (pre, cur, idx) => ({
          ...pre,
          [feild.variables[idx]]: cur,
        }),
        {}
      );

      setQuery((cur) => ({
        ...cur,
        ...queryObject,
      }));
    },
    []
  );

  useEffect(() => {
    getSearchDirContents();
  }, []);

  return (
    <>
      <SearchControlsContainer>
        <SearchControls>
          {search &&
            search?.fields.map((field) => {
              const { type, name, variables, delimiters, data } = field;
              switch (type) {
                case "input":
                  return (
                    <TextInputStyled
                      key={name}
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
                      key={name}
                      label={name}
                      data={data}
                      value={query ? query[name] : ""}
                      onChange={(value) => {
                        if (!value) return;
                        onFeildChange(field, value);
                      }}
                    />
                  );
                }
                default:
                  return <></>;
              }
            })}
        </SearchControls>
        {search && <Button onClick={runQuery}>Search</Button>}
      </SearchControlsContainer>
      <SearchGrid>
        {slides.map((slide, idx) => (
          <Slide
            key={idx}
            slide={{ id: `slide-${idx}`, text: slide }}
            size={350}
            style={{
              color: "white",
              whiteSpace: "normal",
              padding: "20rem",
            }}
          />
        ))}
      </SearchGrid>
    </>
  );
};

export default SearchView;
