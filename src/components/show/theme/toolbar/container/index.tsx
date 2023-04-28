import styled from "@emotion/styled";
import { Slider, Stack, Text, Title } from "@mantine/core";
import { ThemeEntryContainerType } from "../../../../../types/LibraryTypes";

const ThemeToolbarSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const ThemeContainerEditSection = ({
  containerStyle,
  onContainerLeftChange,
  onContainerTopChange,
  onContainerWidthChange,
  onContainerHeightChange,
}: ThemeContainerEditSectionProps) => {
  const { height = 0, width = 0, left = 0, top = 0 } = containerStyle || {};
  const heightValue = +height?.toString()?.split("%")[0];
  const widthValue = +width?.toString().split("%")[0];
  const leftValue = +left?.toString().split("%")[0];
  const topValue = +top?.toString().split("%")[0];
  return (
    <ThemeToolbarSection>
      <Title order={6} color="white">
        CONTAINER
      </Title>
      <Stack style={{ gap: 0 }}>
        <Text color="white" size="xs" weight="bold">
          Height
        </Text>
        <Slider
          min={10}
          value={heightValue >= 10 ? heightValue : 10}
          onChange={onContainerHeightChange}
        />
      </Stack>
      <Stack style={{ gap: 0 }}>
        <Text color="white" size="xs" weight="bold">
          Width
        </Text>
        <Slider
          min={10}
          value={widthValue >= 10 ? widthValue : 10}
          onChange={onContainerWidthChange}
        />
      </Stack>
      <Stack style={{ gap: 0 }}>
        <Text color="white" size="xs" weight="bold">
          Top
        </Text>
        <Slider value={topValue} onChange={onContainerTopChange} />
      </Stack>
      <Stack style={{ gap: 0 }}>
        <Text color="white" size="xs" weight="bold">
          Left
        </Text>
        <Slider value={leftValue} onChange={onContainerLeftChange} />
      </Stack>
    </ThemeToolbarSection>
  );
};

interface ThemeContainerEditSectionProps {
  containerStyle?: ThemeEntryContainerType;
  onContainerLeftChange: (value: number) => void;
  onContainerTopChange: (value: number) => void;
  onContainerWidthChange: (value: number) => void;
  onContainerHeightChange: (value: number) => void;
}

export default ThemeContainerEditSection;
