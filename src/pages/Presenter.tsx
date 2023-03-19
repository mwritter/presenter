import LibraryView from "../components/library/LibraryView";
import { WebviewWindow, availableMonitors } from "@tauri-apps/api/window";
import ShowView from "./ShowView";
import useStore from "../store";
import { useEffect } from "react";
import PresenterStyle from "../components/presenter/PresenterStyle";

const setProjectorMonitor = async () => {
  const monitors = await availableMonitors();
  let [monitor] = monitors;
  if (monitors.length > 1) {
    [, monitor] = monitors;
  }
  const projectorWindow = new WebviewWindow("projector", {
    url: "/projector",
  });

  projectorWindow.once("tauri://created", () => {
    useStore.getState().setProjector(projectorWindow);
    projectorWindow.setPosition(monitor.position);
  });
};

const Presenter = () => {
  useEffect(() => {
    setProjectorMonitor();
  }, []);

  return (
    <>
      <PresenterStyle />
      <div id="Presenter">
        <LibraryView />
        <ShowView />
      </div>
    </>
  );
};

export default Presenter;
