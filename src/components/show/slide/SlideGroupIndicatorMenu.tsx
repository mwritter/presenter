import { ReactNode } from "react";
import { Menu } from "@mantine/core";
import { GroupType } from "../helpers/slide.helper";

const SlideGroupIndicatorMenu = ({
  children,
  opened,
  onChange,
  onGroupChange,
}: SlideGroupIndicatorMenuProps) => {
  return (
    <Menu opened={opened} onChange={onChange} withArrow position="bottom-start">
      <Menu.Target>
        <div onClick={(e) => e.stopPropagation()}>{children}</div>
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Label>Change Slide Group</Menu.Label>
        <Menu.Item onClick={() => onGroupChange("VERSE")}>Verse</Menu.Item>
        <Menu.Item onClick={() => onGroupChange("CHORUS")}>Chorus</Menu.Item>
        <Menu.Item onClick={() => onGroupChange("BRIDGE")}>Bridge</Menu.Item>
        <Menu.Item onClick={() => onGroupChange("NONE")}>None</Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
};

interface SlideGroupIndicatorMenuProps {
  children: ReactNode;
  opened: boolean;
  onChange: (opened: boolean) => void;
  onGroupChange: (groupId: GroupType) => void;
}

export default SlideGroupIndicatorMenu;
