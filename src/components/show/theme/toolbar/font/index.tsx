import styled from "@emotion/styled";
import { Title } from "@mantine/core";
import FontAlignment from "./FontAlignment";
import FontFamilySelect from "./FontFamilySelect";
import FontSizeInput from "./FontSizeInput";
import {
  ThemeEntryContainerType,
  ThemeEntryStyleType,
} from "../../../../../types/LibraryTypes";
import FontTextAlignment from "./FontTextAlignment";

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
  containerStyle,
  onFontFamilySelectChange,
  onFontSizeChange,
  onHorizontalAlignmentChange,
  onVerticalAlignmentChange,
  onTextAlinmentChange,
}: ThemeFontEditSectionProps) => {
  return (
    <ThemeToolbarSection>
      <Title order={6} color="white">
        FONT
      </Title>
      <FontAlignment
        vertical={containerStyle?.alignContent}
        horizontal={containerStyle?.justifyContent}
        onHorizontalAlignmentChange={onHorizontalAlignmentChange}
        onVerticalAlignmentChange={onVerticalAlignmentChange}
      />
      <FontTextAlignment
        textAlign={containerStyle?.textAlign}
        onChange={onTextAlinmentChange}
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
  containerStyle?: ThemeEntryContainerType;
  onHorizontalAlignmentChange: (value: string) => void;
  onVerticalAlignmentChange: (value: string) => void;
  onFontFamilySelectChange: (value: string) => void;
  onFontSizeChange: (value: string) => void;
  onTextAlinmentChange: (value: string) => void;
}

export default ThemeFontEditSection;
