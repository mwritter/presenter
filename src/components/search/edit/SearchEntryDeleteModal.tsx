import styled from "@emotion/styled";
import { Button, Group, Modal, Text, Title } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { deleteSearchEntry } from "../../../helpers/search.helper";
import useStore from "../../../store";

const ModalContainer = styled(Modal)`
  .mantine-Modal-header {
    background-color: #282c34;
    color: white;
  }
  .mantine-Modal-content {
    background-color: #282c34;
    border-radius: 5px;
  }
  .mantine-Modal-body {
    border-radius: 0;
  }
`;

const SearchEntryDeleteModal = () => {
  const { search, setSearch } = useStore(({ search, setSearch }) => ({
    setSearch,
    search,
  }));
  const [opened, { open, close }] = useDisclosure();
  return (
    <>
      <ModalContainer
        opened={opened}
        onClose={close}
        title="Delete Search Entry"
        p={10}
      >
        <Text mb={15} size="lg" color="white">
          Are you sure you want to delete this Search entry?
        </Text>
        <Group>
          <Button
            color="red"
            onClick={() => {
              if (search) {
                console.log(search);
                deleteSearchEntry(search.name);
                setSearch(null);
              }
            }}
          >
            Yes
          </Button>
          <Button onClick={close}>Cancel</Button>
        </Group>
      </ModalContainer>
      <Button color="red" onClick={open}>
        Delete
      </Button>
    </>
  );
};

export default SearchEntryDeleteModal;
