import styled from "styled-components";

const FIELD_WIDTH = 60;

interface BoardBoxProps {
  boardWidth: number;
}

export default styled.div<BoardBoxProps>`
  display: flex;
  flex-wrap: wrap;
  outline: 7px double #5e4c3e;
  border-radius: 5px;
  width: ${(p) => p.boardWidth * FIELD_WIDTH}px;
  height: ${(p) => p.boardWidth * FIELD_WIDTH}px;
  background: grey;
  font-size: 10px;
`;
