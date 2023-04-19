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

// TODO: add an API search content as well

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
  const outline: SearchEntryType[] = JSON.parse(outlineString);

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

export const queryAPI = async (query: Record<string, string>) => {
  const search = useStore.getState().search;
  if (!search) return;
  const {
    extractor: { headers, url, key },
  } = search;
  if (!url) return;
  let parsePath = url;
  let parseKey = key;
  for (const variable in query) {
    parsePath = parsePath.replaceAll(`{{${variable}}}`, query[variable]);
    parseKey = parseKey.replaceAll(`{{${variable}}}`, query[variable]);
  }
  console.log(parsePath);
  try {
    const response = await fetch(parsePath, {
      headers: JSON.parse(headers || ""),
    });
    const { data } = await response.json();
    console.log(data);
    return [data[parseKey]] || [];
  } catch (e) {
    console.log(e);
    return [];
  }
};

export const queryDirectory = async (query: Record<string, string>) => {
  const search = useStore.getState().search;
  if (!search) return;
  const {
    extractor: { path, key, type },
    validator,
  } = search;

  let parsePath = path;
  let parseKey = key;
  let issue = null;

  for (let variable in query) {
    if (validator) {
      console.log("variable start: " + variable + " => " + query[variable]);
      const valid = validator[variable];
      if (valid) {
        console.log({ query });
        if (valid.required && (!(variable in query) || !query[variable])) {
          issue = true;
          break;
        }
        if (valid.minLength && query[variable].length < valid.minLength) {
          issue = true;
          break;
        }
        if (valid.pattern) {
          const regex = new RegExp(valid.pattern);
          if (!regex.test(query[variable])) {
            console.log(`${variable} does not match ${valid.pattern}`);
          }
        }
        if (valid.type) {
          switch (valid.type) {
            // is a file entry in the directory
            case "entry": {
              if (valid.path) {
                const matches = valid.path.match(/(?<=\{\{).+?(?=\}\})/g) ?? [];
                let entryPath = valid.path;
                for (const match of matches) {
                  entryPath = entryPath.replaceAll(
                    `{{${match}}}`,
                    query[match]
                  );
                  console.log(entryPath);
                }
                try {
                  const content = await readDir(
                    `search/${search.directory}/${entryPath}`,
                    { dir: BaseDirectory.AppData, recursive: true }
                  );
                  console.log(content);
                  const found = content
                    .map(({ name }) => name || "")
                    .find((value) => {
                      const regex = new RegExp(`^${query[variable]}`, "i");
                      console.log(regex);
                      return regex.test(value);
                    });
                  if (found) {
                    query[variable] = found.split(".")[0];
                  }
                } catch (e) {
                  console.log(e);
                }
              }
            }
          }
        } else if (valid.value) {
          console.log("values: ", valid.value);
          const found = valid.value.find((value) => {
            const regex = new RegExp(`^${query[variable]}`, "i");
            return regex.test(value);
          });
          if (found) {
            query[variable] = found;
          }
        }

        console.log("variable end: " + variable + " => " + query[variable]);
      }
    }
    parsePath = parsePath.replaceAll(`{{${variable}}}`, query[variable]);
    parseKey = parseKey.replaceAll(`{{${variable}}}`, query[variable]);
  }

  if (issue) {
    return { items: [], query };
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
          if (!(item instanceof Array)) return { items: [], query };
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
    return { items: parseItem, query };
  } catch (e) {
    console.log(e);
    return { items: [], query };
  }
};

export const parseSearchIdentifier = (query: Record<string, string>) => {
  const search = useStore.getState().search;
  if (!search) return "";
  const { identifier, validator } = search;
  let parseIdentifier = identifier;

  for (const variable in validator) {
    const valid = validator[variable];
    if (valid?.identifier && query[variable]) {
      parseIdentifier = parseIdentifier.concat(valid.identifier);
    }
  }
  for (const variable in query) {
    parseIdentifier = parseIdentifier.replaceAll(
      `{{${variable}}}`,
      query[variable]
    );
  }
  return parseIdentifier;
};
