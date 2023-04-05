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
  ];

  return useRoutes(routes);
}
