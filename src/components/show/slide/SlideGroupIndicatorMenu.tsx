import { ReactNode } from "react";
import { Menu } from "@mantine/core";
import { GroupType } from "../helpers/slide.helper";

const SlideGroupIndicatorMenu = ({
  children,
  opened,
  onChange,
  onItemClick,
}: SlideGroupIndicatorMenuProps) => {
  return (
    <Menu opened={opened} onChange={onChange} withArrow position="bottom-start">
      <Menu.Target>{children}</Menu.Target>
      <Menu.Dropdown>
        <Menu.Label>Change Slide Group</Menu.Label>
        <Menu.Item onClick={() => onItemClick("VERSE")}>Verse</Menu.Item>
        <Menu.Item onClick={() => onItemClick("CHORUS")}>Chorus</Menu.Item>
        <Menu.Item onClick={() => onItemClick("BRIDGE")}>Bridge</Menu.Item>
        <Menu.Item onClick={() => onItemClick("NONE")}>None</Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
};

interface SlideGroupIndicatorMenuProps {
  children: ReactNode;
  opened: boolean;
  onChange: (opened: boolean) => void;
  onItemClick: (groupId: GroupType) => void;
}

export default SlideGroupIndicatorMenu;
