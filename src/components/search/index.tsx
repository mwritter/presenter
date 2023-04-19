import { useCallback, useEffect, useState } from "react";
import {
  getSearchDirContents,
  parseSearchIdentifier,
  queryAPI,
  queryDirectory,
} from "../../helpers/search.helper";
import {
  ActionIcon,
  Box,
  BoxProps,
  Button,
  Center,
  Group,
  Select,
  Text,
  TextInput,
} from "@mantine/core";
import useStore from "../../store";
import styled from "@emotion/styled";
import Slide from "../show/slide/Slide";
import { SearchEntryField } from "../../types/LibraryTypes";
import { IconPlaylistAdd } from "@tabler/icons-react";
import SearchAddPlaylistMenu from "./SearchAddPlaylistMenu";
import { addSearchContent } from "../../helpers/playlist.helper";

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

const SearchResultControls = styled.div`
  position: fixed;
  bottom: 0;
  background-color: #21212a;
  width: 100%;
`;

const SearchView = ({ hidden }: { hidden: boolean }) => {
  const [slides, setSlides] = useState<string[]>([]);
  const [query, setQuery] = useState<Record<string, string>>({});
  const [latestRunQuery, setLatestRunQuery] =
    useState<Record<string, string>>();
  const { search } = useStore(({ search }) => ({ search }));

  // TODO: add required variables
  const runQuery = useCallback(async () => {
    queryDirectory(query)
      .then((res) => {
        if (res?.items instanceof Array) {
          setSlides(res.items);
          setLatestRunQuery(res.query);
        }
      })
      .catch(() => setLatestRunQuery(query));
  }, [query]);

  const onFeildChange = useCallback(
    (field: SearchEntryField, value: string) => {
      let queryValues = [value];
      if (field.delimiters) {
        const regex = new RegExp(`[${field.delimiters}]`);
        queryValues = value.split(regex);
      }
      console.log({ queryValues });
      const queryObject: Record<string, string> = field.variables.reduce(
        (pre, cur, idx) => ({
          ...pre,
          [cur]: queryValues[idx],
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
    <Box hidden={hidden}>
      <SearchControlsContainer>
        <SearchControls>
          {search &&
            search?.fields.map((field) => {
              const { type, name, data } = field;
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
                      data={data || []}
                      value={query ? query[name] : ""}
                      onChange={(value) => {
                        if (!value) return;
                        onFeildChange(field, value);
                      }}
                    />
                  );
                }
                case "api": {
                  return (
                    <TextInputStyled
                      key={name}
                      label={name}
                      value={query ? query[name] : ""}
                      onChange={(evt) => {
                        const value = evt.currentTarget?.value || "";
                        onFeildChange(field, value);
                      }}
                      onKeyUp={(evt) => {
                        if (evt.key === "Enter") {
                          console.log("fetch");
                          queryAPI(query).then((res) => {
                            if (res instanceof Array) {
                              setSlides(res);
                            }
                          });
                        }
                      }}
                    />
                  );
                }
                default:
                  return <></>;
              }
            })}
        </SearchControls>
        {latestRunQuery && (
          <>
            <Group style={{ gap: "1rem" }}>
              <Text size="xs" color="white" mr={5}>
                Query:
              </Text>
              {Object.entries(latestRunQuery).map(([key, value]) => (
                <Group key={`${key}-key`} style={{ gap: ".1rem" }}>
                  <Text weight="bold" size="xs" color="white">
                    {key}:
                  </Text>
                  <Text key={key} size="xs" color="white">
                    {value}
                  </Text>
                </Group>
              ))}
            </Group>
          </>
        )}
        {search && !search.fields.find((f) => f.type === "api") && (
          <Button onClick={runQuery}>Search</Button>
        )}
      </SearchControlsContainer>
      {slides.length ? (
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
      ) : (
        <>
          {search && latestRunQuery && (
            <Center>
              <Text color="white">No items to display</Text>
            </Center>
          )}
        </>
      )}
      <SearchResultControls>
        <SearchAddPlaylistMenu
          disabled={false}
          onPlaylistSelect={(playlistName) => {
            addSearchContent(playlistName, {
              name: parseSearchIdentifier(query),
              content: slides,
            });
          }}
        />
      </SearchResultControls>
    </Box>
  );
};

export default SearchView;
