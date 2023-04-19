import {
  ActionIcon,
  Button,
  Group,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import { IconPhotoPlus, IconPlus } from "@tabler/icons-react";
import { open } from "@tauri-apps/api/dialog";
import { addMediaImageFile } from "../../../helpers/media.helper";
import { ReactNode, useCallback, useState } from "react";
import styled from "@emotion/styled";
import { FileEntry } from "@tauri-apps/api/fs";

const FileInput = styled(TextInput)`
  .mantine-TextInput-input {
    background-color: #282c34;

    &:disabled {
      opacity: 1;
      color: white;
      cursor: pointer;
    }
  }
`;

const MediaFileInput = ({ target, onChange, value }: MediaFileInputProps) => {
  const getFileAndSave = useCallback(async () => {
    const selected = await open({
      filters: [
        {
          name: "Image",
          extensions: ["png", "jpeg", "jpg", "mp4", "mov"],
        },
      ],
    });
    if (selected) {
      onChange(selected as string);
      // setSelectedFileName(fileName);
      // addMediaImageFile(selected as string);
    }
  }, []);

  return (
    <span onClick={() => getFileAndSave()}>
      {target ?? (
        <Stack>
          <FileInput value={value} disabled placeholder="Choose File" />
        </Stack>
      )}
    </span>
  );
};

interface MediaFileInputProps {
  target?: ReactNode;
  value?: string;
  onChange: (path: string) => void;
}

export default MediaFileInput;
