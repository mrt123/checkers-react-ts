import styled from "styled-components";

interface PinFaceProps {
  isDragged: boolean;
  isKing: boolean;
  moveDirection: "up" | "down";
}

interface PinFaceWrapperProps {
  isDragged: boolean;
}

const PinFaceWrapper = styled.div<PinFaceWrapperProps>`
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  box-shadow: ${(p) =>
    p.isDragged
      ? "-8px 11px 8px 3px rgba(0, 0, 0, 0.5);"
      : "-4px 4px 4px 0px rgba(0, 0, 0, 0.5)"};
  cursor: pointer;
  background: linear-gradient(
    -45deg,
    rgba(0, 0, 0, 0.22),
    rgba(255, 255, 255, 0.25)
  );
`;

interface FaceSymbolProps {
  direction: "up" | "down";
  isKing: boolean;
}

const getSymbol = (isKing: boolean, direction: "up" | "down") => {
  if (isKing) return "♛";
  else return direction === "up" ? "↑" : "↓";
};

const FaceSymbol = styled.div<FaceSymbolProps>`
  &:after {
    content: "${(p) => getSymbol(p.isKing, p.direction)}";
  }
  font-size: ${(p) => (p.isKing ? "35" : "25")}px;
  color: ${(p) => (p.isKing ? "yellow" : "black")};
  opacity: ${(p) => (p.isKing ? "1" : "0.08")};
  text-shadow: ${(p) => (p.isKing ? "0px 0px 7px rgb(0 0 0)" : "none")};
  font-weight: 900;
`;

const PinFace = ({ isDragged, moveDirection, isKing }: PinFaceProps) => {
  return (
    <PinFaceWrapper isDragged={isDragged}>
      <FaceSymbol direction={moveDirection} isKing={isKing} />
    </PinFaceWrapper>
  );
};

export default PinFace;
