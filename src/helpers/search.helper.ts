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
import { Command } from "@tauri-apps/api/shell";

export const getSearchEntries = async () => {
  const hasPlaylist = await exists("playlists", { dir: BaseDirectory.AppData });
  if (!hasPlaylist) {
    await createDir("search", { dir: BaseDirectory.AppData });
    await writeTextFile("search/index.json", "[]", {
      dir: BaseDirectory.AppData,
    });
  }
  // const contents = await readDir("search", {
  //   dir: BaseDirectory.AppData,
  //   recursive: true,
  // });
  const outlineString = await readTextFile("search/index.json", {
    dir: BaseDirectory.AppData,
  });
  const outline: SearchEntryType[] = JSON.parse(outlineString);

  // Only reture directories we have search outlines for
  useStore.getState().setSearchEntries(outline);
};

export const setSearchEntry = async (entry: SearchEntryType) => {
  const outlineString = await readTextFile("search/index.json", {
    dir: BaseDirectory.AppData,
  });
  const outlines: SearchEntryType[] = JSON.parse(outlineString);

  const found = outlines.find(({ name }) => entry.name === name);

  if (found) {
    useStore.getState().setSearch(found);
  }
};

export const queryAPI = async (query: Record<string, string>) => {
  const search = useStore.getState().search;
  if (!search) return { text: [], query };
  const validatedQuery = await validateSearchQuery(query);
  if (validatedQuery.issue) {
    console.log("issue with: ", validatedQuery.issue);
    return { text: [], query: validatedQuery.query };
  }
  const {
    extractor: { headers, url, key = "" },
  } = search;
  if (!url) return { text: [], query: validatedQuery.query };
  let parsePath = url;
  let parseKey = key;
  for (const variable in query) {
    parsePath = parsePath.replaceAll(`{{${variable}}}`, query[variable]);
    parseKey = parseKey.replaceAll(`{{${variable}}}`, query[variable]);
  }
  try {
    const response = await fetch(parsePath, {
      headers: JSON.parse(headers || ""),
    });
    const { data } = await response.json();
    return { text: data[parseKey], query: validatedQuery.query };
  } catch (e) {
    console.log(e);
    return { text: [], query: validatedQuery.query };
  }
};

export const queryDirectory = async (
  query: Record<string, string>
): Promise<{ text: string[]; query: Record<string, string> }> => {
  const search = useStore.getState().search;
  if (!search) return { text: [], query };
  const {
    extractor: { path = "", key = "", type = "" },
    validator,
  } = search;

  let parsePath = path;
  let parseKey = key;
  let issue = null;

  for (let variable in query) {
    if (validator) {
      const valid = validator[variable];
      if (valid) {
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
                }
                try {
                  const content = await readDir(
                    `search/${search.directory}/${entryPath}`,
                    { dir: BaseDirectory.AppData, recursive: true }
                  );
                  const found = content
                    .map(({ name }) => name || "")
                    .find((value) => {
                      const regex = new RegExp(`^${query[variable]}`, "i");
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
        } else if (valid.values) {
          const found = valid.values.find((value) => {
            const regex = new RegExp(`^${query[variable]}`, "i");
            return regex.test(value);
          });
          if (found) {
            query[variable] = found;
          }
        }
      }
    }
    parsePath = parsePath.replaceAll(`{{${variable}}}`, query[variable]);
    parseKey = parseKey.replaceAll(`{{${variable}}}`, query[variable]);
  }

  if (issue) {
    return { text: [], query };
  }

  try {
    const data = await readTextFile(
      `search/${search?.directory}/${parsePath}`,
      {
        dir: BaseDirectory.AppData,
      }
    );
    const parsed = JSON.parse(data);
    const item: string | string[] = parsed[parseKey];
    let parseItem: string[] = [];
    if (item) {
      switch (type) {
        case "array": {
          if (!(item instanceof Array)) return { text: [], query };
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
    return { text: parseItem, query };
  } catch (e) {
    console.log(e);
    return { text: [], query };
  }
};

export const parseSearchIdentifier = (query: Record<string, string>) => {
  const search = useStore.getState().search;
  if (!search) return ["", ""];
  const { tag = "", identifier = "", validator } = search;
  let parseIdentifier = identifier;
  let parseTag = tag;

  // update with validator
  for (const variable in validator || []) {
    const valid = validator[variable];
    if (valid?.identifier && query[variable]) {
      parseIdentifier = parseIdentifier.concat(valid.identifier);
    }
    if (valid?.tag && query[variable]) {
      parseTag = parseTag.concat(valid.tag);
    }
  }

  // replace variables
  for (const variable in query) {
    parseIdentifier = parseIdentifier.replaceAll(
      `{{${variable}}}`,
      query[variable]
    );
    if (parseTag) {
      parseTag = parseTag.replaceAll(`{{${variable}}}`, query[variable]);
    }
  }
  return [parseIdentifier, parseTag];
};

export const parseSearchTag = (tag: string, index?: number) => {
  let parsedTag = tag;
  const search = useStore.getState().search;
  if (!search) return "";

  const { extractor, validator } = search;

  // if 'array' replace index
  switch (extractor.type) {
    case "array": {
      parsedTag = parsedTag.replaceAll("$index", (index || 0).toString());
    }
  }

  // if [[content]] this is math replace [[content]] with eval(content)
  const toEvalRegex = new RegExp(/\[\[.+?\]\]/, "g");
  const itemRegex = new RegExp(/(?<=\[\[).+?(?=\]\])/, "g");
  const matches = parsedTag.match(toEvalRegex);
  if (matches) {
    const evaluated = matches.map((m) => {
      const [value] = m.match(itemRegex) || [];
      if (value) {
        try {
          return value ? eval(value) : null;
        } catch (e) {
          return "";
        }
      }
    });
    for (const [idx, match] of matches.entries()) {
      parsedTag = parsedTag.replace(match, evaluated[+idx] || "?");
    }
    return parsedTag;
  }
};

export const queryPresenterCLI = async (
  query: Record<string, string>
): Promise<{
  text: string[];
  query: Record<string, string>;
  errorMessage?: string;
  errorField?: string;
}> => {
  const validatedQuery = await validateSearchQuery(query);
  const search = useStore.getState().search;
  console.log("Valid", validatedQuery);
  if (validatedQuery.issue || !search) {
    console.log("issue with: ", validatedQuery.issue || "no search outline");
    return {
      text: [],
      query: validatedQuery.query,
      errorField: validatedQuery.issue || "",
      errorMessage: validatedQuery.issue ?? "",
    };
  }
  const {
    extractor: { args = "", cmd = "" },
  } = search;
  const value = JSON.stringify(query);
  // args is the cmd arguments
  // value is the search query JSON
  // cmd is the actual commend that will be executed
  // on your machine, make sure to have this command accessible globally on your machine 'presenter-cli'
  const commandResult = await new Command("presenter-cli", [
    ...args,
    value,
    cmd,
  ]).execute();

  if (commandResult.code !== 0) {
    console.error(commandResult.stderr);
    return { text: [], query: validatedQuery.query };
  }

  try {
    const output: { error: string; text: string[] } = JSON.parse(
      commandResult.stdout
    );
    if (output.error) {
      console.error(output.error);
      return { text: [], query: validatedQuery.query };
    }
    return { text: output.text, query: validatedQuery.query };
  } catch (e) {
    console.error(e);
    return { text: [], query: validatedQuery.query };
  }
};

export const runQuery = async (query: Record<string, string>) => {
  let text: string[] = [];
  let result: {
    text: string[];
    query: Record<string, string>;
    errorMessage?: string | undefined;
    errorField?: string | undefined;
  } = { text, query };
  const search = useStore.getState().search;
  if (!search) return result;

  switch (search.type) {
    case "directory":
      result = await queryDirectory(query);
      break;
    case "presenter-cli":
      result = await queryPresenterCLI(query);
      break;
    case "api":
      result = await queryAPI(query);
      break;
  }

  return result;
};

const validateSearchQuery = async (query: Record<string, string>) => {
  const search = useStore.getState().search;
  if (!search) return { text: [], query };
  const {
    extractor: { path = "", key = "", type = "" },
    validator,
  } = search;

  let parsePath = path;
  let parseKey = key;
  let issue = null;

  for (let variable in validator) {
    if (validator) {
      const valid = validator[variable];
      if (valid) {
        console.log(variable);
        console.log(valid);
        if (valid.required && (!(variable in query) || !query[variable])) {
          issue = variable;
          break;
        }
        if (valid.minLength && query[variable].length < valid.minLength) {
          issue = variable;
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
            // check the file names as valid values
            case "entry": {
              if (valid.path) {
                const matches = valid.path.match(/(?<=\{\{).+?(?=\}\})/g) ?? [];
                let entryPath = valid.path;
                for (const match of matches) {
                  entryPath = entryPath.replaceAll(
                    `{{${match}}}`,
                    query[match]
                  );
                }
                try {
                  const content = await readDir(
                    `search/${search.directory}/${entryPath}`,
                    { dir: BaseDirectory.AppData, recursive: true }
                  );
                  const found = content
                    .map(({ name }) => name || "")
                    .find((value) => {
                      const regex = new RegExp(`^${query[variable]}`, "i");
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
        } else if (valid.values) {
          const found = valid.values.find((value) => {
            const regex = new RegExp(`^${query[variable]}`, "i");
            return regex.test(value);
          });
          if (found) {
            query[variable] = found;
          }
        }
      }
    }
    parsePath = parsePath.replaceAll(`{{${variable}}}`, query[variable]);
    parseKey = parseKey.replaceAll(`{{${variable}}}`, query[variable]);
  }

  return {
    query,
    parsePath,
    parseKey,
    issue,
  };
};
