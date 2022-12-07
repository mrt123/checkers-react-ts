import { css, keyframes } from "styled-components";

const shakeFrames = keyframes`
  10%, 90% {
    transform: translate3d(-1px, 0, 0);
  }
  
  20%, 80% {
    transform: translate3d(2px, 0, 0);
  }

  30%, 50%, 70% {
    transform: translate3d(-4px, 0, 0);
  }

  40%, 60% {
    transform: translate3d(4px, 0, 0);
  }
`;

const shake = css`
  ${shakeFrames} 0.82s cubic-bezier(.36,.07,.19,.97) both infinite
`;

export default shake;
