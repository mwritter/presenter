import { MantineProvider } from "@mantine/core";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import "./styles.css";
import PresenterStyle from "./components/presenter/PresenterStyle";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <>
    <PresenterStyle />
    <BrowserRouter>
      <MantineProvider withGlobalStyles withNormalizeCSS>
        <App />
      </MantineProvider>
    </BrowserRouter>
  </>
);
