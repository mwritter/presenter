import styled from "@emotion/styled";
import useProjectorScale from "../../../../hooks/useProjectorScale";
import TextSlide from "../../slide/TextSlide";
import { useResizeDetector } from "react-resize-detector";
import { useMove } from "@mantine/hooks";
import { useState } from "react";
import {
  ThemeEntryContainerType,
  ThemeEntryStyleType,
  ThemeEntryTagType,
  ThemeEntryType,
} from "../../../../types/LibraryTypes";
import useStore from "../../../../store";
import {
  IconCross,
  IconCrosshair,
  IconFocusCentered,
} from "@tabler/icons-react";

const ThemeStageContainer = styled.div`
  grid-area: stage;
  width: 100%;
  height: 100%;
  display: grid;
  place-content: center;
`;

const ThemeStageBody = styled.div`
  overflow: hidden;
`;

const CenterIndicator = styled.div`
  position: absolute;
  height: 15px;
  width: 15px;
  border-radius: 100%;
  background-color: red;
`;

const ThemeStage = ({
  selectedStyle,
  containerStyle,
  tagStyle,
  tagText,
}: ThemeStageProps) => {
  const [position, setPosition] = useState({ x: 0.2, y: 0.6 });
  const { ref, active } = useMove(setPosition);
  const { width: stageWidth, ref: stageRef } = useResizeDetector();

  const { value, height, width, projectorWidth, projectorHeight } =
    useProjectorScale({ width: stageWidth || 0 });

  return (
    <ThemeStageContainer ref={stageRef}>
      <div style={{ height, overflow: "hidden", border: "1px solid black" }}>
        <ThemeStageBody
          ref={ref}
          style={{
            ...selectedStyle,
            height: projectorHeight,
            width: projectorWidth,
            transformOrigin: "left top",
            transform: `scale(${value})`,
            position: "relative",
          }}
        >
          <TextSlide
            containerStyle={containerStyle}
            tagStyle={tagStyle}
            slide={{
              id: "theme-slide",
              text: `Text`,
              tag: tagText,
            }}
          />
        </ThemeStageBody>
      </div>
    </ThemeStageContainer>
  );
};

interface ThemeStageProps {
  selectedStyle: Record<string, string>;
  containerStyle?: ThemeEntryContainerType;
  tagStyle: ThemeEntryTagType;
  tagText?: string;
}

export default ThemeStage;
