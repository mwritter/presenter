import {
  BaseDirectory,
  createDir,
  exists,
  readDir,
  readTextFile,
  writeTextFile,
} from "@tauri-apps/api/fs";
import useStore from "../store";
import { SearchEntryType } from "../types/LibraryTypes";

export const getSearchDirContents = async () => {
  const hasPlaylist = await exists("playlists", { dir: BaseDirectory.AppData });
  if (!hasPlaylist) {
    await createDir("search", { dir: BaseDirectory.AppData });
    await writeTextFile("search/index.json", "[]", {
      dir: BaseDirectory.AppData,
    });
  }
  const contents = await readDir("search", {
    dir: BaseDirectory.AppData,
    recursive: true,
  });
  const outlineString = await readTextFile("search/index.json", {
    dir: BaseDirectory.AppData,
  });
  const outline: {
    directory: string;
    field: {
      name: string;
      type: string;
    }[];
  }[] = JSON.parse(outlineString);

  // Only reture directories we have search outlines for
  useStore
    .getState()
    .setSearchDirectories(
      contents.filter(
        (content) =>
          content.name && !/^\./.test(content.name) && content.children?.length
      )
    );
  return {
    content: contents.filter(({ name }) =>
      outline.find(({ directory }) => name === directory)
    ),
    outline,
  };
};

export const setSearchDirectory = async (directoryName: string) => {
  const outlineString = await readTextFile("search/index.json", {
    dir: BaseDirectory.AppData,
  });
  const outlines: SearchEntryType[] = JSON.parse(outlineString);

  const found = outlines.find(({ directory }) => directoryName === directory);

  if (found) {
    useStore.getState().setSearch(found);
  }
};

export const queryDirectory = async (query: Record<string, string>) => {
  const search = useStore.getState().search;
  if (!search) return;
  const {
    extractor: { path, key, type },
  } = search;

  let parsePath = path;
  let parseKey = key;
  for (const variable in query) {
    parsePath = parsePath.replaceAll(`{{${variable}}}`, query[variable]);
    parseKey = parseKey.replaceAll(`{{${variable}}}`, query[variable]);
  }

  try {
    const data = await readTextFile(`search/${search.directory}/${parsePath}`, {
      dir: BaseDirectory.AppData,
    });
    const parsed = JSON.parse(data);
    const item: string | string[] = parsed[parseKey];
    let parseItem: string[] = [];
    if (item) {
      switch (type) {
        case "array": {
          if (!(item instanceof Array)) return;
          const { start, end } = query;
          if (start && end) {
            parseItem = item.slice(+start, +end + 1);
          } else if (start) {
            parseItem = [item[+start] || ""];
          } else {
            parseItem = item;
          }
          break;
        }
        default:
          parseItem = item instanceof Array ? item : [item];
      }
    }
    return parseItem;
  } catch (e) {
    return [];
  }
};
