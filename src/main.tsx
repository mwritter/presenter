import { MantineProvider } from "@mantine/core";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import "./styles.css";
import SlideThemeStyles from "./components/style";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <MantineProvider withGlobalStyles withNormalizeCSS>
    <SlideThemeStyles />
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </MantineProvider>
);
