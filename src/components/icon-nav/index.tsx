import styled from "@emotion/styled";
import { ActionIcon, Drawer, DrawerProps, Group } from "@mantine/core";
import { IconMessageShare, IconTools } from "@tabler/icons-react";
import MessageView from "../utility/message";

const NavbarContainer = styled.div`
  grid-area: actionmenu;
  border-right: 1px solid #282c34;
  background-color: #21212a;
`;

const DrawerContainer = styled(Drawer)<DrawerProps>`
  & .mantine-Modal-content {
    background-color: #21212a;
  }

  & .mantine-Modal-header {
    color: white;
    background-color: #21212a;
  }
`;

const IconNav = ({ onChange, view }: IconNavProps) => {
  return (
    <>
      <DrawerContainer
        keepMounted
        opened={view === "utility"}
        onClose={() => onChange("")}
        title="Message"
        size="xs"
      >
        <MessageView />
      </DrawerContainer>

      <NavbarContainer>
        <Group position="center">
          <ActionIcon onClick={() => onChange("utility")} variant="transparent">
            <IconMessageShare size={16} />
          </ActionIcon>
        </Group>
      </NavbarContainer>
    </>
  );
};

interface IconNavProps {
  onChange: (value: string) => void;
  view: string;
}

export default IconNav;
