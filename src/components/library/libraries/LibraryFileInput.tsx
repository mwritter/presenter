import styled from "@emotion/styled";
import { ActionIcon, FileButton, FileInput } from "@mantine/core";
import { IconFileUpload } from "@tabler/icons-react";
import { useEffect, useState } from "react";
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
  // we're also only reading the first file for now
  addLibraryFile({
    name: file.name,
    slides: slides,
  });
};

const LibraryFileInput = () => {
  const [files, setFiles] = useState<File[] | null>(null);

  useEffect(() => {
    if (files) {
      const reader = new FileReader();
      reader.addEventListener("load", (evt) => {
        const uploadText = reader.result as string;
        // creates slides based on two returns
        // would be better to split two or more returns
        const slides = uploadText.split("\n\n").map((text) => ({
          id: uuid(),
          text,
          group: "NONE" as GroupType,
        }));
        // we're also only reading the first file for now
        addLibraryFile({
          name: files[0].name,
          slides: slides,
        });
      });
      reader.readAsText(files[0]);
    }
  }, [files]);

  return (
    <>
      <FileButton multiple onChange={setFiles}>
        {(props) => (
          <ActionIcon {...props}>
            <IconFileUpload size={14} />
          </ActionIcon>
        )}
      </FileButton>
    </>
  );
};

export default LibraryFileInput;
