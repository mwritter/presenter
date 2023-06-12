import {
  BaseDirectory,
  createDir,
  exists,
  readTextFile,
  writeTextFile,
} from "@tauri-apps/api/fs";
import useStore from "../store";
import { SearchEntryType } from "../types/LibraryTypes";
import { fetch } from "@tauri-apps/api/http";

export const getSearchEntries = async () => {
  const hasSearch = await exists("search", { dir: BaseDirectory.AppData });
  if (!hasSearch) {
    await createDir("search", { dir: BaseDirectory.AppData });
    await writeTextFile("search/index.json", "[]", {
      dir: BaseDirectory.AppData,
    });
  }

  const outlineString = await readTextFile("search/index.json", {
    dir: BaseDirectory.AppData,
  });
  const outline: SearchEntryType[] = JSON.parse(outlineString);

  useStore.getState().setSearchEntries(outline);
};

export const editSearchEntry = async (content: SearchEntryType) => {
  const searchEntries = useStore.getState().searchEntries;
  if (!searchEntries) return;
  const found = searchEntries.findIndex((entry) => entry.name === content.name);
  console.log(found);
  if (found > -1) {
    console.log({ content });
    const newSearchEntries = [...searchEntries];
    newSearchEntries[found] = content;
    console.log({ newSearchEntries });
    await write(newSearchEntries);
    await getSearchEntries();
    useStore.getState().setSearch(content);
  }
};

export const write = async (searchOutline: SearchEntryType[]) => {
  const content = JSON.stringify(searchOutline);
  await writeTextFile(`search/index.json`, content, {
    dir: BaseDirectory.AppData,
  });
  await getSearchEntries();
};

export const createNewSearchEntry = async (name: string) => {
  // get the search json and parse
  const outlineString = await readTextFile("search/index.json", {
    dir: BaseDirectory.AppData,
  });
  const searchOutline: SearchEntryType[] = JSON.parse(outlineString);

  // add a new empty item to the array
  const newSearch: SearchEntryType = {
    name,
    type: "api", // hard coded for now
    identifier: "",
    tag: "",
    fields: [],
    extractor: {},
    validator: {},
  };

  searchOutline.push(newSearch);
  await write(searchOutline);

  // select this new item
  useStore.getState().setSearch(newSearch);
  useStore.getState().setSearchEditMode(newSearch.name);
};

// Might need to add an ID to these enties to be safer
export const deleteSearchEntry = async (name: string) => {
  // get the search json and parse
  const outlineString = await readTextFile("search/index.json", {
    dir: BaseDirectory.AppData,
  });
  const searchOutline: SearchEntryType[] = JSON.parse(outlineString);

  const newSearchOutline = searchOutline.filter(
    (search) => search.name !== name
  );
  await write(newSearchOutline);
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
  console.log(query);
  const validatedQuery = await validateSearchQuery(query);
  if (validatedQuery.issue) {
    console.log("issue with: ", validatedQuery.issue);
    return {
      text: [],
      query: validatedQuery.query,
      errorField: validatedQuery.issue,
    };
  }
  const {
    extractor: { headers = "", url, keys = [] },
  } = search;
  if (!url) return { text: [], query: validatedQuery.query };
  let parsePath = url;
  let parseKeys = keys;
  for (const variable in query) {
    parsePath = parsePath.replaceAll(`{{${variable}}}`, query[variable] || "");
    parseKeys = parseKeys.map((key) =>
      key.replaceAll(`{{${variable}}}`, query[variable] || "")
    );
  }
  try {
    const response = await fetch<any[] | any>(parsePath, {
      method: "GET",
      headers: headers ? JSON.parse(headers) : {},
    });
    let extractedData = response.data;
    console.log(extractedData);
    if (extractedData instanceof Array) {
      // if we get back and array from the api
      // we assume, if the user didn't specifiy keys
      // this is a text array
      if (!keys.length) {
        return { text: extractedData, query: validatedQuery.query };
      } else {
        // if the user specified keys we assume this is and object
        // loop over each object and drill down into the object
        // the last key should hold some text
        extractedData = extractedData
          .map((item) => {
            for (const key of parseKeys) {
              if (key in item) {
                item = item[key];
              } else {
                console.log(`${key} not in ${item}`);
                item = null;
                break;
              }
            }
            return item;
          })
          .filter((item) => item !== null && item !== undefined);
        return { text: extractedData, query: validatedQuery.query };
      }
    } else {
      throw Error("No supported response type.  The API must return an array");
    }
  } catch (e) {
    console.log(e);
    return { text: [], query: validatedQuery.query };
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
    if (valid?.tag && (query[variable] || valid.default)) {
      parseTag = parseTag.concat(valid.tag);
    }
  }

  // replace variables
  for (const variable in query) {
    const valid = validator[variable];
    parseIdentifier = parseIdentifier.replaceAll(
      `{{${variable}}}`,
      query[variable]
    );
    if (parseTag) {
      parseTag = parseTag.replaceAll(
        `{{${variable}}}`,
        query[variable] || valid.default || ""
      );
    }
  }
  return [parseIdentifier, parseTag];
};

export const parseSearchTag = (tag: string, index?: number) => {
  let parsedTag = tag;
  const search = useStore.getState().search;
  if (!search) return "";

  const { extractor } = search;

  // if 'array' replace $index
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
  return parsedTag;
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
    extractor: { path = "", keys = [] },
    validator,
  } = search;

  let parsePath = path;
  let parseKeys = keys;
  let issue = null;

  for (let variable in validator) {
    if (validator) {
      const valid = validator[variable];
      if (valid) {
        // required
        if (valid.required && (!(variable in query) || !query[variable])) {
          issue = variable;
          console.log(`${variable} not set but is required`);
          break;
        }
        // minLength
        if (valid.minLength && query[variable].length < valid.minLength) {
          issue = variable;
          console.log(`${variable} not long enought ${valid.minLength}`);
          break;
        }
        // pattern
        if (valid.pattern) {
          const regex = new RegExp(valid.pattern);
          if (!regex.test(query[variable])) {
            console.log(`${variable} does not match ${valid.pattern}`);
          }
        }
        // values
        if (valid.values) {
          const found = valid.values.find((value) => {
            const regex = new RegExp(`^${query[variable]}`, "i");
            return regex.test(value);
          });
          if (found) {
            query[variable] = found;
          } else {
            console.log(
              `${variable} does not match any valid values ${valid.values}`
            );
          }
        }
      }
    }
    parsePath = parsePath.replaceAll(`{{${variable}}}`, query[variable]);
    parseKeys = parseKeys.map((key) =>
      key.replaceAll(`{{${variable}}}`, query[variable])
    );
  }

  return {
    query,
    parsePath,
    parseKeys,
    issue,
  };
};
