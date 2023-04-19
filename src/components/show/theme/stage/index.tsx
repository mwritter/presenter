import styled from "@emotion/styled";
import useProjectorScale from "../../../../hooks/useProjectorScale";
import TextSlide from "../../slide/TextSlide";
import { useResizeDetector } from "react-resize-detector";
import { useMove } from "@mantine/hooks";
import { useState } from "react";
import {
  ThemeEntryContainerType,
  ThemeEntryStyleType,
  ThemeEntryType,
} from "../../../../types/LibraryTypes";
import useStore from "../../../../store";

const ThemeStageContainer = styled.div`
  grid-area: stage;
  width: 100%;
  height: 100%;
  display: grid;
`;

const ThemeStageBody = styled.div`
  overflow: hidden;
`;

const ThemeStage = ({ selectedStyle, containerStyle }: ThemeStageProps) => {
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
            slide={{
              id: "theme-slide",
              text: `Text`,
            }}
          />
        </ThemeStageBody>
      </div>
    </ThemeStageContainer>
  );
};

interface ThemeStageProps {
  selectedStyle: Record<string, string>;
  containerStyle: ThemeEntryContainerType;
}

export default ThemeStage;
