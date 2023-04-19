import styled from "@emotion/styled";
import MediaFileInput from "../../../../library/media/MediaFileInput";
import { useCallback, useMemo, useState } from "react";
import { Button, Group, TextInput, Title } from "@mantine/core";
import { open } from "@tauri-apps/api/dialog";
import { addMediaImageFile } from "../../../../../helpers/media.helper";
import { ThemeEntryStyleType } from "../../../../../types/LibraryTypes";
import { IconTrash, IconX } from "@tabler/icons-react";

const BackgroundSelectContainer = styled.div``;

const FileInput = styled(TextInput)`
  .mantine-TextInput-input {
    background-color: #282c34;

    &:disabled {
      opacity: 1;
      color: white;
      cursor: pointer;
    }
  }
  & .mantine-TextInput-label {
    color: white;
    font-size: smaller;
  }
`;

// TODO: if changes add a comfirmation pop up before leaving
const BackgroundPickerSelect = ({
  onChange,
  selectedStyle,
}: BackgroundPickerSelectProps) => {
  const backgroundName = useMemo(() => {
    const { backgroundImage } = selectedStyle;
    const fileName = backgroundImage?.split("%2F").pop()?.split(")")[0] || "";
    const decoded = decodeURI(fileName);
    return decoded;
  }, [selectedStyle]);

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
      const addedEntry = await addMediaImageFile(selected as string, true);
      if (addedEntry) {
        onChange(addedEntry.source);
      }
    }
  }, []);

  return (
    <BackgroundSelectContainer>
      <Group style={{ alignItems: "end" }}>
        <span style={{ flex: 1 }} onClick={getFileAndSave}>
          <FileInput
            label="Image"
            value={backgroundName}
            disabled
            placeholder="Choose File"
          />
        </span>
        <Button
          title="Remove Image"
          variant="outline"
          color="red"
          onClick={() => {
            onChange("");
          }}
        >
          <IconTrash size={16} />
        </Button>
      </Group>
    </BackgroundSelectContainer>
  );
};

interface BackgroundPickerSelectProps {
  onChange: (backgroundSrc: string) => void;
  selectedStyle: ThemeEntryStyleType;
}

export default BackgroundPickerSelect;
