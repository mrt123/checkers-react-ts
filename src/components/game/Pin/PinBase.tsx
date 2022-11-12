import styled from "styled-components";

interface PinBaseProps {
  isDragged: boolean;
  color: string;
}

const PinBase = styled.div<PinBaseProps>`
  z-index: ${(p) => (p.isDragged ? "203" : "202")};
  pointer-events: ${(p) => (p.isDragged ? "none" : "all")};
  background-color: ${(p) => p.color};
  border-radius: 50%;
`;

export default PinBase;
