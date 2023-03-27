import styled from "styled-components";

const CreateRoomStyled = styled.div`
  display: flex;
  padding: ${({ theme }) => theme.padding.medium};
  width: 100%;

  .createRoomButton {
    display: flex;
    flex-direction: column;
    justify-content: end;
  }
`;

export default CreateRoomStyled;