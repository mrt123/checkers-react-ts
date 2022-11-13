import styled from "styled-components";
import { conditionalPulse } from "../../general/animations/pulse";

interface ColorIndicatorContainerProps {
  pulse?: boolean;
}

const ColorIndicatorContainer = styled.span<ColorIndicatorContainerProps>`
  background-color: ${(p) => p.color};
  box-shadow: ${(p) => `0 0 0 0 ${p.color}`};
  animation: ${conditionalPulse};
  display: inline-block;
  width: 17px;
  height: 17px;
  border-radius: 50%;
`;

interface PlayerColorIndicatorProps {
  color: string;
  animatePulse?: boolean;
}

const PlayerColorIndicator = ({
  color,
  animatePulse,
}: PlayerColorIndicatorProps) => {
  return <ColorIndicatorContainer color={color} pulse={animatePulse} />;
};

export default PlayerColorIndicator;
