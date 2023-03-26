import { invoke } from "@tauri-apps/api";
import {
  BaseDirectory,
  createDir,
  exists,
  readDir,
  readTextFile,
  writeTextFile,
} from "@tauri-apps/api/fs";
import { appDataDir } from "@tauri-apps/api/path";
import { convertFileSrc } from "@tauri-apps/api/tauri";
import useStore from "../store";
import { MediaEntryType, MediaType } from "../types/LibraryTypes";
import { Command } from "@tauri-apps/api/shell";
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
  useStore.getState().setMediaFiles(content);
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
  const content = await readTextFile(path);
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
  content: MediaEntryType
) => {
  const media = useStore.getState().media;

  const fileExists = await exists(`media/${mediaFileName}.json`, {
    dir: BaseDirectory.AppData,
  });
  if (!fileExists) return;

  if (media) {
    media.items.push(content);
    await writeTextFile(`media/${mediaFileName}.json`, JSON.stringify(media), {
      dir: BaseDirectory.AppData,
    });
  }

  await getMediaDirContents();
};

export const addMediaImageFile = async (fileSystemPath: string) => {
  const media = useStore.getState().media;
  if (!media) return;
  const dir = await appDataDir();
  const fileName = fileSystemPath.split("/").pop() || "";
  const sourceDes = `${dir}media/assets/source/${media.name}/${fileName}`;

  const source = await invoke("copy_file_to", {
    sourcePath: fileSystemPath,
    destinationPath: sourceDes,
  })
    .then(() => convertFileSrc(sourceDes))
    .catch(console.log);

  try {
    const thumbnailFilePath = await createMediaFileThumbnail(sourceDes);
    if (!thumbnailFilePath) return;
    const thumbnail = convertFileSrc(thumbnailFilePath);
    if (fileName && thumbnail && source) {
      await addMediaEntryFile(media.name, {
        name: fileName,
        thumbnail,
        source,
      });
    }
  } catch (err) {
    console.error(err);
  }
};

export const createMediaFileThumbnail = async (sourceFilePath: string) => {
  const media = useStore.getState().media;
  if (!media) return;
  const dir = await appDataDir();
  const [fileName, ext] = sourceFilePath.split("/").pop()?.split(".") || [];
  const thumbnailFilePath = `${dir}media/assets/thumbnail/${media.name}/${fileName}.png`;
  if (["mp4", "mov"].includes(ext)) {
    console.log("ffmpeg - video");

    const command = Command.sidecar("binaries/ffmpeg", [
      "-i",
      sourceFilePath,
      "-vf",
      "scale=480:-1",
      "-frames:v",
      "1",
      thumbnailFilePath,
    ]);
    await command.execute();
  } else if (["png", "jpg", "jpeg"]) {
    console.log("ffmpeg - image");
    const command = Command.sidecar("binaries/ffmpeg", [
      "-i",
      sourceFilePath,
      "-vf",
      "scale=480:-1",
      thumbnailFilePath,
    ]);
    await command.execute();
  }
  return thumbnailFilePath;
};
