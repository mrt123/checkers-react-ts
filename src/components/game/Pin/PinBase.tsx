import styled, { css } from "styled-components";
import pulse from "../../general/animations/pulse";
import shake from "../../general/animations/shake";
import spinDissapear from "../../general/animations/spinDissapear";

interface PinBaseProps {
  isDragged: boolean;
  color: string;
  pulse?: boolean;
  animateKill?: boolean;
  shake: boolean;
}

const pulseAnimation = css`
  ${pulse("yellow")} 1s infinite;
`;

const getAnimation = (
  animateKill: boolean,
  pulse: boolean,
  shouldSHake: boolean
) => {
  if (animateKill) return spinDissapear;
  else if (shouldSHake) return shake;
  else if (pulse) return pulseAnimation;
  else return "none";
};

//  animation: ${(p) => (p.pulse ? pulseAnimation : "none")};
const PinBase = styled.div<PinBaseProps>`
  z-index: ${(p) => (p.isDragged ? "203" : "202")};
  pointer-events: ${(p) => (p.isDragged ? "none" : "all")};
  background-color: ${(p) => p.color};
  border-radius: 50%;
  animation: ${(p) => getAnimation(!!p.animateKill, !!p.pulse, p.shake)};
`;

export default PinBase;
