import styled from "styled-components";

const PlayerColorIndicator = styled.span`
  display: inline-block;
  width: 17px;
  height: 17px;
  border-radius: 50%;
  background-color: ${(p) => p.color};
`;

export default PlayerColorIndicator;
