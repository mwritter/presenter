import styled from "@emotion/styled";
import { Title } from "@mantine/core";
import FontAlignment from "./FontAlignment";
import FontFamilySelect from "./FontFamilySelect";
import FontSizeInput from "./FontSizeInput";
import { ThemeEntryStyleType } from "../../../../../types/LibraryTypes";

const DEFAULT_VALUES = {
  fontFamily: "Arial",
  fontSize: 15,
  justifyContent: "start",
  alignItems: "start",
};

const ThemeToolbarSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const ThemeFontEditSection = ({
  selectedStyle,
  onFontFamilySelectChange,
  onFontSizeChange,
  onHorizontalAlignmentChange,
  onVerticalAlignmentChange,
}: ThemeFontEditSectionProps) => {
  return (
    <ThemeToolbarSection>
      <Title order={6} color="white">
        FONT
      </Title>
      <FontAlignment
        vertical={selectedStyle.justifyContent}
        horizontal={selectedStyle.alignItems}
        onHorizontalAlignmentChange={onHorizontalAlignmentChange}
        onVerticalAlignmentChange={onVerticalAlignmentChange}
      />
      <FontFamilySelect
        value={selectedStyle.fontFamily}
        onChange={onFontFamilySelectChange}
      />
      <FontSizeInput
        value={selectedStyle?.fontSize || DEFAULT_VALUES.fontSize}
        onChange={onFontSizeChange}
      />
    </ThemeToolbarSection>
  );
};

interface ThemeFontEditSectionProps {
  selectedStyle: ThemeEntryStyleType;
  onHorizontalAlignmentChange: (value: string) => void;
  onVerticalAlignmentChange: (value: string) => void;
  onFontFamilySelectChange: (value: string) => void;
  onFontSizeChange: (value: string) => void;
}

export default ThemeFontEditSection;
