import { ActionIcon } from "@mantine/core";
import { IconPhotoPlus, IconPlus } from "@tabler/icons-react";
import { open } from "@tauri-apps/api/dialog";
import { addMediaImageFile } from "../../../helpers/media.helper";

const getFileAndSave = async () => {
  const selected = await open({
    multiple: true,
    filters: [
      {
        name: "Image",
        extensions: ["png", "jpeg", "jpg", "mp4", "mov"],
      },
    ],
  });
  // TODO: currently on for first file selected, we can loop over the array of mulitple
  if (Array.isArray(selected)) {
    const [path] = selected;
    addMediaImageFile(path);
  }
};

const MediaFileInput = () => {
  return (
    <>
      <ActionIcon variant="transparent" onClick={() => getFileAndSave()}>
        <IconPhotoPlus size={16} />
      </ActionIcon>
    </>
  );
};

export default MediaFileInput;
