import { MantineProvider } from "@mantine/core";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import PresenterStyle from "./components/presenter/PresenterStyle";
import "./styles.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <>
    <PresenterStyle />
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </>
);
