import styled from "@emotion/styled";
import { ActionIcon, Text, TextProps, Title } from "@mantine/core";
import useStore from "../../../store";
import { useEffect, useState } from "react";
import {
  create,
  getMediaDirContents,
  getMediaFileData,
} from "../../../helpers/media.helper";
import { IconPlus } from "@tabler/icons-react";
import MediaAddInput from "./MediaAddInput";

const MediaDirContainer = styled.section``;

const MediaEntry = styled(Text)<MediaEntryProps>`
  color: white;
  cursor: pointer;
  padding: 0.2rem 1rem;
  background-color: ${(p) => (p.selected ? "#476480" : "")};
  &:hover {
    background-color: #476480;
  }
`;

const MediaHeaderContainer = styled.div`
  position: sticky;
  top: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  justify-self: flex-start;
  background-color: #21212a;
  z-index: 1;
`;

const MediaDirTitle = styled(Title)`
  align-self: flex-start;
  padding: 0.5rem;
`;

const ScrollableList = styled.div`
  overflow-y: scroll;
  &::-webkit-scrollbar {
    width: 1px;
  }

  &::-webkit-scrollbar-track {
    background-color: #21212a;
  }
`;

const MediaDirView = () => {
  const [mediaFiles, media, setMedia] = useStore(
    ({ mediaFiles, media, setMedia }) => [mediaFiles, media, setMedia]
  );
  const [selected, setSelected] = useState<string>(media?.name || "");
  const [addInput, setAddInput] = useState(false);
  useEffect(() => {
    getMediaDirContents();
  }, []);

  return (
    <MediaDirContainer>
      <MediaHeaderContainer>
        <MediaDirTitle order={6}>MEDIA</MediaDirTitle>
        <ActionIcon onClick={() => setAddInput(true)}>
          <IconPlus size={16} />
        </ActionIcon>
      </MediaHeaderContainer>
      <ScrollableList>
        {addInput && (
          <MediaAddInput
            onClose={() => setAddInput(false)}
            onEnter={(value) => {
              create(value + ".json").then(() => {
                setAddInput(false);
              });
            }}
          />
        )}
        {mediaFiles
          .filter((f) => !/^\./.test(f?.name || ""))
          .map((f) => {
            return !f.children ? (
              <div key={f.path}>
                <MediaEntry
                  selected={selected === f.name}
                  key={f.path}
                  onClick={() => {
                    getMediaFileData(f.path).then(setMedia);
                    setSelected(f.path);
                  }}
                >
                  {f.name?.split(".")[0]}
                </MediaEntry>
              </div>
            ) : null;
          })}
      </ScrollableList>
    </MediaDirContainer>
  );
};

type MediaEntryProps = TextProps & {
  selected: boolean;
  onClick: () => void;
};

export default MediaDirView;
