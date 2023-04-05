import styled from "@emotion/styled";
import { Center, SegmentedControl } from "@mantine/core";
import {
  IconFolder,
  IconPhoto,
  IconPlayerPlay,
  IconSquare,
} from "@tabler/icons-react";
import useStore from "../../store";
import { PresenterMode } from "../../types/LibraryTypes";

const SegmentedControlStyled = styled(SegmentedControl)`
  background-color: #21212a;

  & .mantine-SegmentedControl-control {
    border-color: #282c34;
  }

  & .mantine-SegmentedControl-indicator {
    background-color: #282c34;
    color: white;
  }

  & .mantine-SegmentedControl-label {
    &:hover {
      color: white;
    }
    &[data-active="true"] {
      color: white;
    }
  }
`;

const LibraryViewNav = () => {
  const { mode, setMode } = useStore(({ mode, setMode }) => ({
    mode,
    setMode,
  }));
  return (
    <SegmentedControlStyled
      value={mode.toString()}
      onChange={(value) => setMode(parseInt(value))}
      data={[
        {
          value: PresenterMode.PLAYLIST.toString(),
          label: (
            <Center>
              <IconPlayerPlay size={14} />
            </Center>
          ),
        },
        {
          value: PresenterMode.LIBRARY.toString(),
          label: (
            <Center>
              <IconFolder size={14} />
            </Center>
          ),
        },
        {
          value: PresenterMode.MEDIA.toString(),
          label: (
            <Center>
              <IconPhoto size={14} />
            </Center>
          ),
        },
        {
          value: PresenterMode.THEME.toString(),
          label: (
            <Center>
              <IconSquare size={14} />
            </Center>
          ),
        },
      ]}
    />
  );
};

export default LibraryViewNav;
