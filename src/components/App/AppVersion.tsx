import styled from "styled-components";

const AppVersionContainer = styled.div`
  position: absolute;
  font-size: 10px;
  bottom: 10px;
  left: 10px;
`;

const AppVersion = () => {
  return (
    <AppVersionContainer>
      v: {process.env.REACT_APP_VERSION}
    </AppVersionContainer>
  );
};

export default AppVersion;
