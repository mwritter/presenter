import { useCallback, useEffect, useState } from "react";
import {
  parseSearchIdentifier,
  parseSearchTag,
  runQuery as _runQuery,
  getSearchEntries,
} from "../../helpers/search.helper";
import { ActionIcon, Box } from "@mantine/core";
import useStore from "../../store";
import styled from "@emotion/styled";
import {
  SearchEntryField,
  SlideEntryType,
  ThemeEntryType,
} from "../../types/LibraryTypes";
import SearchAddPlaylistMenu from "./SearchAddPlaylistMenu";
import { addSearchContent } from "../../helpers/playlist.helper";
import SearchGrid from "./SearchGrid";
import SearchControls from "./SearchControls";
import { getThemeEnties } from "../../helpers/theme.helper";
import { IconEdit } from "@tabler/icons-react";
import SearchEdit from "./edit";

const SearchContainer = styled.div`
  display: grid;
  grid-template-areas:
    "actionmenu"
    "controls"
    "results";
  grid-template-columns: 1fr;
  grid-template-rows: auto auto 1fr;
  height: 100%;
  width: 100%;
`;

const SearchBarControls = styled.div`
  display: flex;
  grid-area: actionmenu;
  background-color: #21212a;
  width: 100%;
  height: 2rem;
`;

const SearchView = ({ hidden }: { hidden: boolean }) => {
  const [slides, setSlides] = useState<SlideEntryType[]>([]);
  const [query, setQuery] = useState<Record<string, string>>({});
  const [theme, setTheme] = useState<ThemeEntryType>();
  const [errorField, setErrorField] = useState<string | null>(null);
  const [latestRunQuery, setLatestRunQuery] =
    useState<Record<string, string>>();
  const [isLoading, setIsLoading] = useState(false);
  const { search, searchEditMode, setSearchEditMode, themes } = useStore(
    ({ search, searchEditMode, setSearchEditMode, themes }) => ({
      search,
      searchEditMode,
      setSearchEditMode,
      themes,
    })
  );

  const runQuery = useCallback(async () => {
    setIsLoading(true);
    _runQuery(query)
      .then((res) => {
        if (res?.text instanceof Array) {
          const [, parsedTag] = query ? parseSearchIdentifier(query) : [];
          console.log("ptag = ", parsedTag);
          setSlides(
            res.text.map((t, idx) => ({
              id: `slide-${idx}`,
              text: t,
              tag: parsedTag ? parseSearchTag(parsedTag, idx) : "",
            }))
          );
          setLatestRunQuery(res.query);
        }
        if (res.errorField) {
          setErrorField(res.errorField);
        } else {
          setErrorField(null);
        }
      })
      .catch(() => setLatestRunQuery(query))
      .finally(() => {
        setIsLoading(false);
      });
  }, [query, latestRunQuery]);

  const onFieldChange = useCallback(
    (field: SearchEntryField, value: string) => {
      let queryValues = [value];
      if (field.delimiters) {
        const regex = new RegExp(`[${field.delimiters}]`);
        queryValues = value.split(regex);
      }
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
    getSearchEntries();
    getThemeEnties();
  }, []);

  useEffect(() => {
    if (!theme) {
      const defaultTheme = themes.find(({ name }) => name === "default");
      if (defaultTheme) setTheme(defaultTheme);
    }
  }, [themes]);

  return (
    <Box hidden={hidden} w={"100%"} h={"100%"}>
      <SearchContainer>
        {searchEditMode !== search?.name && (
          <SearchControls
            search={search}
            query={query}
            themes={themes}
            theme={theme}
            onSetTheme={setTheme}
            onFieldChange={onFieldChange}
            onRunQuery={runQuery}
            errorField={errorField}
            disabled={isLoading}
            editMode={searchEditMode === search?.name}
          />
        )}

        {searchEditMode === search?.name ? (
          <SearchEdit />
        ) : (
          <SearchGrid
            slides={slides}
            theme={theme?.name || "default"}
            search={search}
            query={latestRunQuery}
            isLoading={isLoading}
          />
        )}

        <SearchBarControls>
          {search && (
            <ActionIcon
              variant="transparent"
              onClick={() => {
                if (searchEditMode !== search.name) {
                  setSearchEditMode(search.name);
                } else {
                  setSearchEditMode(null);
                }
              }}
            >
              <IconEdit size={14} />
            </ActionIcon>
          )}
          {slides.length ? (
            <SearchAddPlaylistMenu
              disabled={false}
              onPlaylistSelect={(playlistName) => {
                const [name, tag] = parseSearchIdentifier(query);
                let content = slides.map((slide) => slide.text || "");
                addSearchContent(playlistName, {
                  name,
                  tag,
                  content,
                });
              }}
            />
          ) : null}
        </SearchBarControls>
      </SearchContainer>
    </Box>
  );
};

export default SearchView;
