import styled from "styled-components";

interface FaceSymbolProps {
  direction: "up" | "down";
  isKing: boolean;
  showSkull: boolean;
}

const getSymbol = (
  isKing: boolean,
  direction: "up" | "down",
  showSkull: boolean
) => {
  if (isKing) return "♛";
  else if (showSkull) return "☠";
  else return direction === "up" ? "↑" : "↓";
};

const FaceSymbol = styled.div<FaceSymbolProps>`
  &:after {
    content: "${(p) => getSymbol(p.isKing, p.direction, p.showSkull)}";
  }
  font-size: ${(p) => (p.isKing || p.showSkull ? "35" : "25")}px;
  color: ${(p) => (p.isKing ? "yellow" : "black")};
  opacity: ${(p) => (p.isKing || p.showSkull ? "1" : "0.08")};
  text-shadow: ${(p) => (p.isKing ? "0px 0px 7px rgb(0 0 0)" : "none")};
  font-weight: 900;
`;

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

interface PinFaceProps {
  isDragged: boolean;
  isKing: boolean;
  showSkull: boolean;
  moveDirection: "up" | "down";
}

const PinFace = ({
  isDragged,
  moveDirection,
  isKing,
  showSkull,
}: PinFaceProps) => {
  return (
    <PinFaceWrapper isDragged={isDragged}>
      <FaceSymbol
        direction={moveDirection}
        isKing={isKing}
        showSkull={showSkull}
      />
    </PinFaceWrapper>
  );
};

export default PinFace;
