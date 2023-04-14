import styled from "@emotion/styled";
import VersesView from "./verses";

const PluginViewContainer = styled.section`
  grid-area: main;
  width: 100%;
  overflow-y: scroll;
  overflow-x: hidden;
`;

const PluginView = () => {
  return (
    <PluginViewContainer>
      <VersesView />
    </PluginViewContainer>
  );
};

export default PluginView;
