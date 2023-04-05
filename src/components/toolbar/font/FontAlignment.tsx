import styled from "@emotion/styled";
import { ActionIcon, ActionIconProps } from "@mantine/core";
import {
  IconLayoutAlignCenter,
  IconLayoutAlignLeft,
  IconLayoutAlignRight,
} from "@tabler/icons-react";
import { CSSProperties } from "react";

const FontAlignmentActionContainer = styled.div`
  display: flex;
  justify-content: space-between;
`;

const FontAlignmentItem = styled(ActionIcon)<FontAlignmentItemProps>`
  color: ${(p) => (p.selected ? "white" : "gray")};
`;

const FontVerticalAlignment = ({
  vertical,
  onChange,
}: FontVerticalAlignmentProps) => (
  <>
    <FontAlignmentItem
      selected={vertical === "start"}
      onClick={() => onChange("start")}
    >
      <IconLayoutAlignLeft size={16} />
    </FontAlignmentItem>
    <FontAlignmentItem
      selected={vertical === "center"}
      onClick={() => onChange("center")}
    >
      <IconLayoutAlignCenter size={16} />
    </FontAlignmentItem>
    <FontAlignmentItem
      selected={vertical === "end"}
      onClick={() => onChange("end")}
    >
      <IconLayoutAlignRight size={16} />
    </FontAlignmentItem>
  </>
);

const FontHorizontalAlignment = ({
  horizontal,
  onChange,
}: FontHorizontalAlignmentProps) => (
  <>
    <FontAlignmentItem
      selected={horizontal === "start"}
      onClick={() => onChange("start")}
    >
      <IconLayoutAlignLeft size={16} />
    </FontAlignmentItem>
    <FontAlignmentItem
      selected={horizontal === "center"}
      onClick={() => onChange("center")}
    >
      <IconLayoutAlignCenter size={16} />
    </FontAlignmentItem>
    <FontAlignmentItem
      selected={horizontal === "end"}
      onClick={() => onChange("end")}
    >
      <IconLayoutAlignRight size={16} />
    </FontAlignmentItem>
  </>
);

const FontAlignment = ({
  vertical,
  horizontal,
  onHorizontalAlignmentChange,
  onVerticalAlignmentChange,
}: FontAlignmentProps) => {
  return (
    <FontAlignmentActionContainer>
      <FontVerticalAlignment
        vertical={vertical}
        onChange={onVerticalAlignmentChange}
      />
      <FontHorizontalAlignment
        horizontal={horizontal}
        onChange={onHorizontalAlignmentChange}
      />
    </FontAlignmentActionContainer>
  );
};

interface FontAlignmentProps {
  vertical: CSSProperties["alignItems"];
  horizontal: CSSProperties["justifyContent"];
  onVerticalAlignmentChange: (value: string) => void;
  onHorizontalAlignmentChange: (value: string) => void;
}

interface FontHorizontalAlignmentProps {
  horizontal: FontAlignmentProps["horizontal"];
  onChange: FontAlignmentProps["onHorizontalAlignmentChange"];
}

interface FontVerticalAlignmentProps {
  vertical: FontAlignmentProps["vertical"];
  onChange: FontAlignmentProps["onVerticalAlignmentChange"];
}

type FontAlignmentItemProps = ActionIconProps & {
  selected: boolean;
  onClick: () => void;
};

export default FontAlignment;
