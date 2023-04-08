import { useRoutes } from "react-router-dom";
import { lazyLoadRoutes } from "./LazyLoadRoutes";

export function RouterElement() {
  const routes = [
    {
      path: "/",
      name: "Presenter",
      element: lazyLoadRoutes("Presenter"),
    },
    {
      path: "projector",
      name: "Projector",
      element: lazyLoadRoutes("Projector"),
    },
    {
      path: "prompt",
      name: "Prompt",
      element: lazyLoadRoutes("Prompt"),
    },
  ];

  return useRoutes(routes);
}
