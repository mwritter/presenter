import styled from "@emotion/styled";
import { ActionIcon, Text, TextProps, Title } from "@mantine/core";
import { useEffect, useState } from "react";
import { IconPlus } from "@tabler/icons-react";
import { ThemeEntryType } from "../../../types/LibraryTypes";
import { getThemeEnties } from "../../../helpers/theme.helper";
import useStore from "../../../store";

const ThemeDirContainer = styled.section``;

const ThemeEntry = styled(Text)<ThemeEntryProps>`
  color: white;
  cursor: pointer;
  padding: 0.2rem 1rem;
  background-color: ${(p) => (p.selected ? "#476480" : "")};
  &:hover {
    background-color: #476480;
  }
`;

const ThemeHeaderContainer = styled.div`
  position: sticky;
  top: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  justify-self: flex-start;
  background-color: #21212a;
  z-index: 1;
`;

const ThemeDirTitle = styled(Title)`
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

const ThemeEntryView = () => {
  const [selected, setSelected] = useState<string>();
  const [addInput, setAddInput] = useState(false);

  const { theme, themes, setTheme } = useStore(
    ({ theme, themes, setTheme }) => ({
      theme,
      themes,
      setTheme,
    })
  );

  useEffect(() => {
    getThemeEnties();
  }, []);

  return (
    <ThemeDirContainer>
      <ThemeHeaderContainer>
        <ThemeDirTitle order={6}>MEDIA</ThemeDirTitle>
        <ActionIcon onClick={() => setAddInput(true)}>
          <IconPlus size={16} />
        </ActionIcon>
      </ThemeHeaderContainer>
      <ScrollableList>
        {/* {addInput && (
          <ThemeAddInput
            onClose={() => setAddInput(false)}
            onEnter={(value) => {
              create(value + ".json").then(() => {
                setAddInput(false);
              });
            }}
          />
        )} */}
        {themes.map((entry) => {
          return (
            <ThemeEntry
              selected={theme?.name === entry.name}
              key={entry.name}
              onClick={() => {
                setTheme(entry);
              }}
            >
              {entry.name}
            </ThemeEntry>
          );
        })}
      </ScrollableList>
    </ThemeDirContainer>
  );
};

type ThemeEntryProps = TextProps & {
  selected: boolean;
  onClick: () => void;
};

export default ThemeEntryView;
