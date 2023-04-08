import { useCallback, useEffect, useState } from "react";
import useStore from "../store";

const useProjectorScale = ({ width }: useProjecotorScaleProps) => {
  const projector = useStore(({ projector }) => projector);

  const [scale, _setScale] = useState({
    value: 0,
    height: 0,
    width,
    projectorHeight: 0,
    projectorWidth: 0,
  });

  const setScale = useCallback(
    (projectorWidth = 1, projectorHeight = 1) => {
      _setScale((cur) => ({
        ...cur,
        projectorHeight,
        projectorWidth,
        width,
        value: width / projectorWidth,
        height: width * (projectorHeight / projectorWidth),
      }));
    },
    [width]
  );

  useEffect(() => {
    if (projector) {
      setScale(projector.width, projector.height);
    }
  }, [projector, width]);

  return scale;
};

interface useProjecotorScaleProps {
  width: number;
}

export default useProjectorScale;
