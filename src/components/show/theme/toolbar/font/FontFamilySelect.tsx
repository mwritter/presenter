import styled from "@emotion/styled";
import { Select, Text } from "@mantine/core";
import { CSSProperties, forwardRef, useEffect, useState } from "react";
import { getUserFonts } from "../../../../../helpers/font.helper";

const FontSelect = styled(Select)`
  & .mantine-Input-input {
    font-family: ${(p) => p.value};
    color: white;
    background-color: #282c34;
  }

  & .mantine-Select-label {
    color: white;
    font-size: smaller;
  }

  & .mantine-Select-item {
    color: white;
    margin: 0.1rem;
    font-size: small;
    &[data-selected="true"],
    &[data-hovered="true"] {
      background-color: #476480;
    }
  }

  & .mantine-Select-dropdown {
    background-color: #282c34;
  }
`;

const FontSelectItem = forwardRef<
  HTMLDivElement,
  { value: string; label: string }
>(({ value, ...others }: { value: string; label: string }, ref) => {
  return (
    <div ref={ref} {...others}>
      <Text style={{ fontFamily: value }}>{value}</Text>
    </div>
  );
});

const FontFamilySelect = ({ value, onChange }: FontFamilySelectProps) => {
  const [fonts, setFonts] = useState<Font[]>([]);

  useEffect(() => {
    getUserFonts().then(setFonts);
  }, []);

  return (
    <FontSelect
      label="Style"
      itemComponent={FontSelectItem}
      data={fonts}
      searchable
      maxDropdownHeight={400}
      nothingFound="No fonts found"
      value={value}
      onChange={onChange}
    />
  );
};

interface FontFamilySelectProps {
  value?: CSSProperties["fontFamily"];
  onChange: (value: string) => void;
}

type Font = {
  value: string;
  label: string;
};

export default FontFamilySelect;
