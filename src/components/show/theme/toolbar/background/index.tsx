import styled from "@emotion/styled";
import { BackgroundImage, Title } from "@mantine/core";
import { ThemeEntryStyleType } from "../../../../../types/LibraryTypes";
import BackgroundPickerSelect from "./BackgroundPickerSelect";
import BackgroundSizeSelect from "./BackgroundSizeSelect";

const ThemeToolbarSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const ThemeBackgroundEditSection = ({
  selectedStyle,
  onBackgroundImageChange,
  onBackgroundSizeChange,
}: ThemeBackgroundEditSectionProps) => {
  return (
    <ThemeToolbarSection>
      <Title order={6} color="white">
        BACKGROUND
      </Title>
      <BackgroundPickerSelect
        selectedStyle={selectedStyle}
        onChange={onBackgroundImageChange}
      />
      <BackgroundSizeSelect
        value={selectedStyle.backgroundSize}
        onChange={onBackgroundSizeChange}
      />
    </ThemeToolbarSection>
  );
};

interface ThemeBackgroundEditSectionProps {
  selectedStyle: ThemeEntryStyleType;
  onBackgroundImageChange: (value: string) => void;
  onBackgroundSizeChange: (value: string) => void;
}

export default ThemeBackgroundEditSection;
