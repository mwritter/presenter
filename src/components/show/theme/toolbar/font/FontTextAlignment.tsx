import styled from "@emotion/styled";
import { ActionIcon, ActionIconProps } from "@mantine/core";
import {
  IconAlignCenter,
  IconAlignLeft,
  IconAlignRight,
} from "@tabler/icons-react";
import { CSSProperties } from "react";

const FontAlignmentSection = styled.div`
  display: flex;
  width: 100%;
  gap: 1rem;
`;

const FontAlignmentItem = styled(ActionIcon)<FontAlignmentItemProps>`
  color: ${(p) => (p.selected ? "white" : "gray")};
`;

const FontTextAlignment = ({ textAlign, onChange }: FontTextAlignmentProps) => (
  <FontAlignmentSection>
    <FontAlignmentItem
      variant="transparent"
      selected={textAlign === "start"}
      onClick={() => onChange("start")}
    >
      <IconAlignLeft size={16} />
    </FontAlignmentItem>
    <FontAlignmentItem
      variant="transparent"
      selected={textAlign === "center"}
      onClick={() => onChange("center")}
    >
      <IconAlignCenter size={16} />
    </FontAlignmentItem>
    <FontAlignmentItem
      variant="transparent"
      selected={textAlign === "end"}
      onClick={() => onChange("end")}
    >
      <IconAlignRight size={16} />
    </FontAlignmentItem>
  </FontAlignmentSection>
);

type FontAlignmentItemProps = ActionIconProps & {
  selected: boolean;
  onClick: () => void;
};

interface FontTextAlignmentProps {
  textAlign: CSSProperties["textAlign"];
  onChange: (value: string) => void;
}

export default FontTextAlignment;
