import { ActionIcon, FileButton } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import { v4 as uuid } from "uuid";
import { addLibraryFile } from "../../../helpers/library.helper";
import { GroupType } from "../../show/helpers/slide.helper";

const handleFilesOnChange = (files: File[]) => {
  const reader = new FileReader();
  const [file] = files;
  reader.onload = (evt) => handleFilesUpload(evt, file);
  reader.readAsText(file);
};

const handleFilesUpload = (evt: ProgressEvent<FileReader>, file: File) => {
  const uploadText = evt.target?.result as string;
  // creates slides based on two returns
  // would be better to split two or more returns
  const slides = uploadText.split("\n\n").map((text) => ({
    id: uuid(),
    text,
    group: "NONE" as GroupType,
  }));
  const fileName = `${file.name.split(".").at(0)}.json`;
  // we're also only reading the first file for now
  addLibraryFile({
    name: fileName,
    path: `library/Default/${fileName}`,
    slides: slides,
  });
};

const LibraryFileInput = () => {
  return (
    <>
      <FileButton multiple onChange={handleFilesOnChange}>
        {(props) => (
          <ActionIcon variant="transparent" {...props}>
            <IconPlus size={16} />
          </ActionIcon>
        )}
      </FileButton>
    </>
  );
};

export default LibraryFileInput;
