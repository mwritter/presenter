import styled from "@emotion/styled";
import { ActionIcon, Text } from "@mantine/core";
import { IconBrush, IconPlayerPlay } from "@tabler/icons-react";
import { useLocation, useNavigate } from "react-router-dom";
import useStore from "../../store";
import { PresenterMode } from "../../types/LibraryTypes";

const ToolbarStyled = styled.div`
  grid-area: toolbar;
  background-color: #21212a;
  padding: 1rem;
  border: 5px solid #282c34;
  border-radius: 10px;
  color: white;
`;

const ToolbarActions = styled.div`
  display: flex;
  gap: 1rem;
`;

const ToolbarActionItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Toolbar = () => {
  const { mode, setMode } = useStore(({ mode, setMode }) => ({
    mode,
    setMode,
  }));
  return (
    <ToolbarStyled>
      <ToolbarActions>
        <ToolbarActionItem>
          <ActionIcon
            variant="transparent"
            onClick={() => {
              setMode(PresenterMode.PLAYLIST);
            }}
          >
            <IconPlayerPlay size={16} />
          </ActionIcon>
          <Text size="xs">Show</Text>
        </ToolbarActionItem>
        <ToolbarActionItem>
          <ActionIcon
            variant="transparent"
            onClick={() => {
              setMode(PresenterMode.THEME);
            }}
          >
            <IconBrush size={16} />
          </ActionIcon>
          <Text size="xs">Theme Editor</Text>
        </ToolbarActionItem>
      </ToolbarActions>
    </ToolbarStyled>
  );
};

export default Toolbar;
