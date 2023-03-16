import styled from "@emotion/styled";
import LibraryView from "./components/library/LibraryView";
import ShowView from "./pages/ShowView";

const AppContainer = styled.div``;

function App() {
  return (
    <AppContainer className="App">
      <LibraryView />
      <ShowView />
    </AppContainer>
  );
}

export default App;
