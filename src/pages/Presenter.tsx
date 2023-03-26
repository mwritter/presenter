import LibraryView from "../components/library/LibraryView";
import { WebviewWindow, availableMonitors } from "@tauri-apps/api/window";
import ShowView from "./ShowView";
import useStore from "../store";
import { useEffect } from "react";

const setProjectorMonitor = async () => {
  const monitors = await availableMonitors();
  let [monitor] = monitors;
  if (monitors.length > 1) {
    [, monitor] = monitors;
  }
  const projectorWindow = new WebviewWindow("projector", {
    url: "/projector",
    title: "projector",
    // fullscreen: true,
  });

  projectorWindow.once("tauri://created", () => {
    useStore.getState().setProjector(projectorWindow);
    projectorWindow.setPosition(monitor.position);
  });
};

// TODO: when main view is closed or reloaded we need to close / reload
// the projector as well
const Presenter = () => {
  useEffect(() => {
    setProjectorMonitor();
  }, []);

  return (
    <div id="Presenter">
      <LibraryView />
      <ShowView />
    </div>
  );
};

export default Presenter;
