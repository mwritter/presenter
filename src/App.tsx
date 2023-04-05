import { MantineProvider } from "@mantine/core";
import { useEffect } from "react";
import { getThemeEnties } from "./helpers/theme.helper";
import { RouterElement } from "./routes";
import useStore from "./store";
import AppStyle from "./components/style";

function App() {
  return (
    <MantineProvider withGlobalStyles withNormalizeCSS>
      <AppStyle />
      <div className="App">
        <RouterElement />
      </div>
    </MantineProvider>
  );
}

export default App;
