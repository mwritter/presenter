import { useCallback, useEffect, useState } from "react";
import {
  parseSearchIdentifier,
  parseSearchTag,
  queryAPI,
  queryDirectory,
  queryPresenterCLI,
  runQuery as _runQuery,
  getSearchEntries,
} from "../../helpers/search.helper";
import {
  ActionIcon,
  Box,
  BoxProps,
  Button,
  Center,
  ColorInput,
  ColorInputProps,
  Group,
  Select,
  Text,
  TextInput,
} from "@mantine/core";
import useStore from "../../store";
import styled from "@emotion/styled";
import Slide from "../show/slide/Slide";
import {
  SearchEntryField,
  ThemeEntryTagType,
  ThemeEntryTagTypeKey,
  ThemeEntryType,
} from "../../types/LibraryTypes";
import { IconPlaylistAdd } from "@tabler/icons-react";
import SearchAddPlaylistMenu from "./SearchAddPlaylistMenu";
import { addSearchContent } from "../../helpers/playlist.helper";
import ThemeFontEditSection from "../show/theme/toolbar/font";
import FontSizeInput from "../show/theme/toolbar/font/FontSizeInput";
import FontFamilySelect from "../show/theme/toolbar/font/FontFamilySelect";
import SearchGrid from "./SearchGrid";
import SearchControls from "./SearchControls";
import SearchTagToolbar from "./SearchTagToolbar";
import { getThemeEnties } from "../../helpers/theme.helper";
import SearchIconNav from "./SearchIconNav";

const SearchContainer = styled.div`
  display: grid;
  grid-template-areas:
    "controls actionmenu"
    "results actionmenu";
  grid-template-columns: 1fr auto;
  grid-template-rows: auto 1fr;
  height: 100%;
  width: 100%;
  overflow: hidden;
`;

const SearchResultControls = styled.div`
  position: fixed;
  bottom: 0;
  background-color: #21212a;
  width: 100%;
  height: 2rem;
`;

const SearchView = ({ hidden }: { hidden: boolean }) => {
  const [slides, setSlides] = useState<string[]>([]);
  const [query, setQuery] = useState<Record<string, string>>({});
  const [theme, setTheme] = useState<ThemeEntryType>();
  const [tagStyle, setTagStyle] = useState<ThemeEntryTagType>();
  const [actionDrawer, setActionDrawer] = useState<string | null>(null);
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

  // TODO: add required variables
  const runQuery = useCallback(async () => {
    // TODO: this needs to parse the items like it was doing in queryDirectory
    _runQuery(query)
      .then((res) => {
        if (res?.text instanceof Array) {
          setSlides(res.text);
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

  const updateTagStyle = useCallback((style: Partial<ThemeEntryTagType>) => {
    console.log(style);
    setTagStyle((cur) => ({ ...cur, ...style } as ThemeEntryTagType));
  }, []);

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
          onFeildChange={onFeildChange}
          onRunQuery={runQuery}
        />

        <SearchGrid
          slides={slides}
          theme={theme?.name || "default"}
          tagStyle={tagStyle}
          search={search}
          query={latestRunQuery}
          onGetTag={getTag}
        />
        <SearchIconNav
          onChange={setActionDrawer}
          view={actionDrawer}
          themes={themes}
          theme={theme}
          tagStyle={tagStyle}
          query={query}
          onThemeChange={setTheme}
          onUpdateTagStyle={updateTagStyle}
          onGetTag={getTag}
        />
      </SearchContainer>
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
    </Box>
  );
};

export default SearchView;
