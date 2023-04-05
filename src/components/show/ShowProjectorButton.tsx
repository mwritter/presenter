import { ActionIcon } from "@mantine/core";
import { IconEye, IconEyeOff } from "@tabler/icons-react";
import { availableMonitors, WebviewWindow } from "@tauri-apps/api/window";
import { TauriEvent } from "@tauri-apps/api/event";
import React, { useEffect, useState } from "react";

// TODO: just a button for toggling the projector for now
const ShowProjectorButton = () => {
  const [projector, setProjector] = useState<WebviewWindow | null>(null);

  return (
    <span>
      {projector ? (
        <ActionIcon
          variant="transparent"
          onClick={() => {
            console.log("Closing");
            projector.emit("say-hey");
            // projector.close().then(() => {
            //   setProjector(null);
            // });
          }}
        >
          <IconEyeOff size={14} />
        </ActionIcon>
      ) : (
        <ActionIcon
          variant="transparent"
          onClick={() => {
            if (projector) return;

            const webview = new WebviewWindow("projector", {
              url: "/projector",
              focus: false,
              hiddenTitle: true,
              decorations: false,
              //   fullscreen: true,
            });

            webview.once("tauri://created", () => {
              console.log("Created");
              setProjector(webview);
            });

            webview.once(TauriEvent.WINDOW_CLOSE_REQUESTED, () => {
              console.log("Closed");
              setProjector(null);
            });
          }}
        >
          <IconEye size={14} />
        </ActionIcon>
      )}
    </span>
  );
};

export default ShowProjectorButton;
