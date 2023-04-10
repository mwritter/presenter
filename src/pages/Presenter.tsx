import LibraryView from "../components/library/LibraryView";
import { WebviewWindow, availableMonitors } from "@tauri-apps/api/window";
import ShowView from "./ShowView";
import useStore from "../store";
import { useCallback, useEffect, useState } from "react";
import { listen } from "@tauri-apps/api/event";
import IconNav from "../components/icon-nav";
import UtilityView from "../components/utility";
import { Box } from "@mantine/core";

const listenForProjectorSize = async () => {
  await listen<{ width: number; height: number }>(
    "projector-size",
    async ({ payload: { width, height } }) => {
      const projector = useStore.getState().projector;
      if (projector) {
        useStore.getState().setProjector({ ...projector, height, width });
      }
    }
  );
};

const setWindowMonitors = async () => {
  const monitors = await availableMonitors();
  const [primary, secondary, tertiary] = monitors;
  const projectorMonitor = secondary;
  const promptMonitor = tertiary || primary;
  const projectorWindow = new WebviewWindow("projector", {
    url: "/projector",
    title: "projector",
    fullscreen: true,
  });

  const promptWindow = new WebviewWindow("prompt", {
    url: "/prompt",
    title: "prompt",
    // fullscreen: true,
  });

  projectorWindow.once("tauri://created", () => {
    useStore
      .getState()
      .setProjector({ webview: projectorWindow, height: 1, width: 1 });
    projectorWindow.setPosition(projectorMonitor.position);
    projectorWindow.setFullscreen(true);
  });

  promptWindow.once("tauri://created", () => {
    useStore.getState().setPrompt(promptWindow);
    promptWindow.setPosition(promptMonitor.position);
  });
};

// TODO: when main view is closed or reloaded we need to close / reload
// the projector as well
const Presenter = () => {
  const [view, setView] = useState<string>("slide");

  const onIconNavChange = useCallback((value: string) => {
    setView(value);
  }, []);

  useEffect(() => {
    const unlisten = listenForProjectorSize();
    setWindowMonitors();
  }, []);

  return (
    <div id="Presenter">
      <LibraryView />
      <ShowView />
      <IconNav onChange={onIconNavChange} view={view} />
    </div>
  );
};

export default Presenter;
