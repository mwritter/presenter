import styled from "@emotion/styled";
import MessageView from "./message";

const UtilityViewContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  color: white;
  width: 250px;
  background-color: #21212a;
  overflow-y: scroll;
  height: 100%;

  &::-webkit-scrollbar {
    width: 1px;
  }

  &::-webkit-scrollbar-track {
    background-color: #21212a;
  }
`;

const UtilityView = () => {
  return (
    <UtilityViewContainer>
      <MessageView />
    </UtilityViewContainer>
  );
};

export default UtilityView;
