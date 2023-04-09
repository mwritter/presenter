import styled from "@emotion/styled";
import useProjectorScale from "../../../../hooks/useProjectorScale";
import TextSlide from "../../slide/TextSlide";
import { useResizeDetector } from "react-resize-detector";

const ThemeStageContainer = styled.div`
  grid-area: stage;
  width: 100%;
  height: 100%;
  display: grid;
`;

const ThemeStageBody = styled.div`
  overflow: hidden;
`;

const ThemeStage = ({ selectedStyle }: ThemeStageProps) => {
  const { width: stageWidth, ref: stageRef } = useResizeDetector();

  const { value, height, width, projectorWidth, projectorHeight } =
    useProjectorScale({ width: stageWidth || 0 });

  return (
    <ThemeStageContainer ref={stageRef}>
      <div style={{ height, overflow: "hidden", border: "1px solid black" }}>
        <ThemeStageBody
          style={{
            ...selectedStyle,
            height: projectorHeight,
            width: projectorWidth,
            transformOrigin: "left top",
            transform: `scale(${value})`,
          }}
        >
          <TextSlide
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
}

export default ThemeStage;
