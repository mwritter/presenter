import styled from "@emotion/styled";
import { ActionIcon, Drawer, DrawerProps, Group } from "@mantine/core";
import { IconMessageShare, IconTag, IconTools } from "@tabler/icons-react";
import MessageView from "../utility/message";
import SearchTagToolbar from "./SearchTagToolbar";
import {
  ThemeEntryTagType,
  ThemeEntryTagTypeKey,
  ThemeEntryType,
} from "../../types/LibraryTypes";

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

const SearchIconNav = ({
  view,
  themes,
  theme,
  tagStyle,
  query,
  onChange,
  onThemeChange,
  onUpdateTagStyle,
  onGetTag,
}: SearchIconNavProps) => {
  return (
    <>
      <DrawerContainer
        keepMounted
        opened={view === "tag"}
        onClose={() => onChange(null)}
        title="Tag Style"
        size="xs"
        position="right"
        overlayProps={{ opacity: 0 }}
      >
        <SearchTagToolbar
          query={query}
          themes={themes}
          theme={theme}
          tagStyle={tagStyle}
          onThemeChange={onThemeChange}
          onUpdateTagStyle={onUpdateTagStyle}
          onGetTag={onGetTag}
        />
      </DrawerContainer>

      <NavbarContainer>
        <Group position="center">
          <ActionIcon onClick={() => onChange("tag")} variant="transparent">
            <IconTag size={16} />
          </ActionIcon>
        </Group>
      </NavbarContainer>
    </>
  );
};

interface SearchIconNavProps {
  view: string | null;
  themes: ThemeEntryType[];
  theme?: ThemeEntryType;
  tagStyle?: ThemeEntryTagType;
  query: Record<string, string>;
  onChange: (value: string | null) => void;
  onThemeChange: (theme: ThemeEntryType) => void;
  onUpdateTagStyle: (style: Partial<ThemeEntryTagType>) => void;
  onGetTag: (index?: number) => string;
}

export default SearchIconNav;
