import Color from "color";
import { css, keyframes } from "styled-components";

const pulse = (color: string) => {
  // when used for a component, this should execute each time component uses different color to pulse
  const colorObject = Color(color);
  const colorObjectStrongOpacity = colorObject.alpha(0.7).toString();
  const colorObjectTransparent = colorObject.alpha(0).toString();

  return keyframes`
    0% {
      transform: scale(0.95);
      box-shadow: 0 0 0 0 ${colorObjectStrongOpacity};
    }
    
    70% {
      transform: scale(1);
      box-shadow: 0 0 0 10px ${colorObjectTransparent};
    }
    
    100% {
      transform: scale(0.95);
      box-shadow: 0 0 0 0 ${colorObjectTransparent};
    }
    }`;
};

export const conditionalPulse = (p) => {
  return p.pulse
    ? css`
        ${pulse(p.color)} 1s infinite;
      `
    : css`none`;
};

export default pulse;
