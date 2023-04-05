import styled from "@emotion/styled";
import { TauriEvent } from "@tauri-apps/api/event";
import React, { useCallback, useEffect, useRef, useState } from "react";
import useStore from "../../../../store";
import { ThemeEntryStyleType } from "../../../../types/LibraryTypes";

const ThemeStageContainer = styled.div`
  display: grid;
  grid-area: stage;
  border: 1px solid black;
  width: 100%;
`;

const ThemeStage = ({ selectedStyle }: ThemeStageProps) => {
  const slideRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);
  const [scale, setScale] = useState(0.1);

  const { projector } = useStore(({ projector }) => ({
    projector,
  }));

  // TODO: refactor this into hook
  const scaleSlide = useCallback(
    (projectorWidth: number, projectorHeight: number) => {
      if (!slideRef.current) return;
      const { clientWidth: width } = slideRef.current;
      const quotient = projectorHeight / projectorWidth;
      const newHeight = quotient * width;
      setHeight(newHeight);
      setScale((width / projectorWidth) * 2.2);
    },
    []
  );

  useEffect(() => {
    projector?.outerSize().then(({ width, height }) => {
      scaleSlide(width, height);
    });
    // For debugging
    projector?.listen(TauriEvent.WINDOW_RESIZED, () => {
      projector?.outerSize().then(({ width, height }) => {
        scaleSlide(width, height);
      });
    });
  }, []);

  return (
    <ThemeStageContainer ref={slideRef} style={{ height, ...selectedStyle }}>
      ThemeStage
    </ThemeStageContainer>
  );
};

interface ThemeStageProps {
  selectedStyle: ThemeEntryStyleType;
}

export default ThemeStage;
