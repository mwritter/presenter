import { useCallback, useEffect, useState } from "react";
import {
  parseSearchIdentifier,
  parseSearchTag,
  runQuery as _runQuery,
  getSearchEntries,
} from "../../helpers/search.helper";
import { Box } from "@mantine/core";
import useStore from "../../store";
import styled from "@emotion/styled";
import {
  SearchEntryField,
  ThemeEntryTagType,
  ThemeEntryType,
} from "../../types/LibraryTypes";
import SearchAddPlaylistMenu from "./SearchAddPlaylistMenu";
import { addSearchContent } from "../../helpers/playlist.helper";
import SearchGrid from "./SearchGrid";
import SearchControls from "./SearchControls";
import { getThemeEnties } from "../../helpers/theme.helper";

const SearchContainer = styled.div`
  display: grid;
  grid-template-areas:
    "actionmenu"
    "controls"
    "results";
  grid-template-columns: 1fr auto;
  grid-template-rows: auto auto 1fr;
  height: 100%;
  width: 100%;
  overflow: hidden;
`;

const SearchResultControls = styled.div`
  grid-area: actionmenu;
  background-color: #21212a;
  width: 100%;
  height: 2rem;
`;

const SearchView = ({ hidden }: { hidden: boolean }) => {
  const [slides, setSlides] = useState<string[]>([]);
  const [query, setQuery] = useState<Record<string, string>>({});
  const [theme, setTheme] = useState<ThemeEntryType>();
  const [errorField, setErrorField] = useState<string | null>(null);
  const [latestRunQuery, setLatestRunQuery] =
    useState<Record<string, string>>();
  const { search, themes } = useStore(({ search, themes }) => ({
    search,
    themes,
  }));

  const getTag = useCallback(
    (index?: number) => {
      if (latestRunQuery) {
        return (
          parseSearchTag(parseSearchIdentifier(latestRunQuery)[1], index) || ""
        );
      }
      return "";
    },
    [latestRunQuery]
  );
  const runQuery = useCallback(async () => {
    _runQuery(query)
      .then((res) => {
        if (res?.text instanceof Array) {
          setSlides(res.text);
          setLatestRunQuery(res.query);
        }
        if (res.errorField) {
          setErrorField(res.errorField);
        } else {
          setErrorField(null);
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
        <SearchControls
          search={search}
          query={query}
          themes={themes}
          theme={theme}
          onSetTheme={setTheme}
          onFeildChange={onFeildChange}
          onRunQuery={runQuery}
          errorField={errorField}
        />

        <SearchGrid
          slides={slides}
          theme={theme?.name || "default"}
          search={search}
          query={latestRunQuery}
          onGetTag={getTag}
        />
        <SearchResultControls>
          {slides.length ? (
            <SearchAddPlaylistMenu
              disabled={false}
              onPlaylistSelect={(playlistName) => {
                const [name, tag] = parseSearchIdentifier(query);
                let content = slides;
                addSearchContent(playlistName, {
                  name,
                  tag,
                  content,
                });
              }}
            />
          ) : null}
        </SearchResultControls>
      </SearchContainer>
    </Box>
  );
};

export default SearchView;
