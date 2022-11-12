import styled from "styled-components";

interface FieldCoordinateOverlayProps {
  position: {
    x: number;
    y: number;
  };
}

const OverlayBox = styled.span`
  position: absolute;
  top: 0;
  right: 0;
  color: yellow;
`;

const FieldCoordinateOverlay = ({ position }: FieldCoordinateOverlayProps) => {
  return (
    <OverlayBox>
      x{position.x}/y{position.y}
    </OverlayBox>
  );
};
export default FieldCoordinateOverlay;
