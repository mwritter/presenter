import { useDisclosure } from "@mantine/hooks";
import { Modal, Group, Button, ActionIcon } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import LibraryDirView from "../libraries/LibraryDirView";
import styled from "@emotion/styled";

const ModalStyled = styled(Modal)`
  .mantine-Modal-content {
    border: 1px solid white;
    background-color: #21212a;
  }
  .mantine-Modal-body {
    display: grid;
    padding: 0;
    padding-bottom: 2rem;
  }
  .mantine-Modal-header {
    color: white;
    background-color: #21212a;
  }

  .mantine-Modal-overlay {
    background-color: #00000025;
  }
`;

const PlaylistAddLibraryModal = () => {
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <>
      <ModalStyled
        yOffset="1%"
        size="xs"
        opened={opened}
        onClose={close}
        title="Add to Playlist"
      >
        <LibraryDirView />
      </ModalStyled>

      <Group position="center">
        <ActionIcon onClick={open}>
          <IconPlus size={14} />
        </ActionIcon>
      </Group>
    </>
  );
};

export default PlaylistAddLibraryModal;
