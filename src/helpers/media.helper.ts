import { invoke } from "@tauri-apps/api";
import {
  BaseDirectory,
  createDir,
  exists,
  readDir,
  readTextFile,
  renameFile,
  writeTextFile,
} from "@tauri-apps/api/fs";
import { appDataDir } from "@tauri-apps/api/path";
import { convertFileSrc } from "@tauri-apps/api/tauri";
import useStore from "../store";
import { MediaEntryType, MediaType } from "../types/LibraryTypes";
import { Command } from "@tauri-apps/api/shell";
import { v4 as uuid } from "uuid";
/**
 * media
 * |    ...media entry json files
 * |    assets
 *      |   thumbnail
 *      |   source
 */

/**
 * media entry json file
 * {
 *      name: 'Graphics'
 *      items: [
 *          {
 *              id: '1'
 *              name: 'super cool graphic'
 *              thumbnail: 'media/assets/thumbnail/Graphics/super-cool-graphic.jpg'
 *              source: 'media/assets/source/Graphics/super-cool-graphic.mov'
 *          }
 *      ]
 * }
 */

export const getMediaDirContents = async () => {
  const hasMedia = await exists("media", {
    dir: BaseDirectory.AppData,
  });
  if (!hasMedia) {
    await createMediaDir();
  }
  const content = await readDir("media", {
    dir: BaseDirectory.AppData,
    recursive: true,
  });
  useStore
    .getState()
    .setMediaFiles(
      content.filter(
        ({ name = "", children }) => !/^\./.test(name) && !children?.length
      )
    );
};

export const createMediaDir = async () => {
  await createDir(`media/assets/thumbnail`, {
    dir: BaseDirectory.AppData,
    recursive: true,
  });

  await createDir(`media/assets/source`, {
    dir: BaseDirectory.AppData,
    recursive: true,
  });
};

export const getMediaFileData = async (path: string): Promise<MediaType> => {
  const content = await readTextFile(`media/${path}`, {
    dir: BaseDirectory.AppData,
  });
  const parsed = JSON.parse(content);
  parsed.path = path;
  return parsed;
};

export const getMediaThumbnail = async (thumbnail: string) => {
  const appDataDirPath = await appDataDir();
  const path = `${appDataDirPath}/${thumbnail}`;
  return convertFileSrc(path);
};

export const getMediaSource = async (source: string) => {
  const appDataDirPath = await appDataDir();
  const path = `${appDataDirPath}/${source}`;
  return convertFileSrc(path);
};

export const addMediaEntryFile = async (
  mediaFileName: string,
  content: MediaEntryType,
  options?: { media: MediaType }
) => {
  const media = options?.media || useStore.getState().media;

  const fileExists = await exists(`media/${mediaFileName}`, {
    dir: BaseDirectory.AppData,
  });
  if (!fileExists) return;

  if (media) {
    media.items.push(content);
    await writeTextFile(`media/${mediaFileName}`, JSON.stringify(media), {
      dir: BaseDirectory.AppData,
    });
  }

  await getMediaDirContents();
  return content;
};

export const addMediaImageFile = async (
  fileSystemPath: string,
  isThemeMedia: boolean = false
) => {
  const dir = await appDataDir();

  let media = useStore.getState().media;
  if (isThemeMedia) {
    const fileName = "themeAssets.json";
    const hasThemeAssets = await exists(`media/${fileName}`, {
      dir: BaseDirectory.AppData,
    });
    console.log(hasThemeAssets);
    if (!hasThemeAssets) {
      await createMedia(fileName);
    }
    media = await getMediaFileData(fileName);
  }
  if (!media) return;
  const found = media.items.find(
    ({ name }) => name === fileSystemPath.split("/").pop()
  );
  if (found) return found;
  const fileName = fileSystemPath.split("/").pop() || "";
  const sourceDes = `${dir}media/assets/source/${media.id}/${fileName}`;
  console.log({ fileSystemPath });
  const source = await invoke("copy_file_to", {
    sourcePath: fileSystemPath,
    destinationPath: sourceDes,
  })
    .then(() => convertFileSrc(sourceDes))
    .catch(console.log);

  try {
    const thumbnailFilePath = await createMediaFileThumbnail(sourceDes, {
      media,
    });
    if (!thumbnailFilePath) return;
    const thumbnail = convertFileSrc(thumbnailFilePath);
    if (fileName && thumbnail && source) {
      const entry = {
        name: fileName,
        thumbnail,
        source,
      };
      const content = await addMediaEntryFile(media.name, entry, { media });
      return content;
    }
  } catch (err) {
    console.error(err);
  }
};

export const createMediaFileThumbnail = async (
  sourceFilePath: string,
  options?: { media?: MediaType }
) => {
  const media = options?.media || useStore.getState().media;
  if (!media) return;
  const dir = await appDataDir();
  const [fileName, ext] = sourceFilePath.split("/").pop()?.split(".") || [];
  const thumbnailFilePath = `${dir}media/assets/thumbnail/${media.id}/${fileName}.png`;
  if (["mp4", "mov"].includes(ext)) {
    const command = Command.sidecar("binaries/ffmpeg", [
      "-i",
      sourceFilePath,
      "-vf",
      "scale=480:-1",
      "-frames:v",
      "1",
      thumbnailFilePath,
    ]);
    const output = await command.execute();
    if (output.code != 0) {
      console.log(output.stderr);
    }
  } else if (["png", "jpg", "jpeg"]) {
    const command = Command.sidecar("binaries/ffmpeg", [
      "-i",
      sourceFilePath,
      "-vf",
      "scale=480:-1",
      thumbnailFilePath,
    ]);
    const output = await command.execute();
    if (output.code != 0) {
      console.log(output.stderr);
    }
  }
  return thumbnailFilePath;
};

export const renameMedia = async (name: string) => {
  const media = useStore.getState().media;
  if (media) {
    const newName = `${name}`;
    await renameFile(`media/${media.name}`, `media/${newName}`, {
      dir: BaseDirectory.AppData,
    });
    media.name = newName;
    await write(media);
  }
};

export const write = async (media: MediaType) => {
  const content = JSON.stringify(media);
  await writeTextFile(`media/${media.name}`, content, {
    dir: BaseDirectory.AppData,
  });
  useStore.getState().setMedia(media);
  await getMediaDirContents();
};

export const create = async (name: string) => {
  await createMedia(name);
  await getMediaDirContents();
};

export const createMedia = async (name: string) => {
  const id = uuid();
  const mediaFile: MediaType = {
    id,
    name,
    items: [],
  };
  // create entry file
  await writeTextFile(`media/${name}`, JSON.stringify(mediaFile), {
    dir: BaseDirectory.AppData,
  });
  // create thumbnail dir
  await createDir(`media/assets/thumbnail/${id}`, {
    dir: BaseDirectory.AppData,
    recursive: true,
  });
  // create source dir
  await createDir(`media/assets/source/${id}`, {
    dir: BaseDirectory.AppData,
    recursive: true,
  });
  return id;
};
