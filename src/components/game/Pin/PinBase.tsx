import styled, { css } from "styled-components";
import pulse from "../../general/animations/pulse";
import spinDissapear from "../../general/animations/spinDissapear";

interface PinBaseProps {
  isDragged: boolean;
  color: string;
  pulse?: boolean;
  animateKill?: boolean;
}

const pulseAnimation = css`
  ${pulse("yellow")} 1s infinite;
`;

const getAnimation = (animateKill, pulse) => {
  if (animateKill) return spinDissapear;
  else if (pulse) return pulseAnimation;
  else return "none";
};

//  animation: ${(p) => (p.pulse ? pulseAnimation : "none")};
const PinBase = styled.div<PinBaseProps>`
  z-index: ${(p) => (p.isDragged ? "203" : "202")};
  pointer-events: ${(p) => (p.isDragged ? "none" : "all")};
  background-color: ${(p) => p.color};
  border-radius: 50%;
  animation: ${(p) => getAnimation(p.animateKill, p.pulse)};
`;

export default PinBase;
