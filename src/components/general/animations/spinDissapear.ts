import { css, keyframes } from "styled-components";

const spinDissapearFrames = keyframes`
  0% {
    rotate: 0deg;
    scale: 1;
  }
  50% {
    scale 1;
    rotate: 0deg;
  }

  100% {
    rotate: 360deg;
    scale: 0;
  }
`;

const spinDissapear = css`
  ${spinDissapearFrames} 1s ease-in
`;

export default spinDissapear;
