import { generateFields, generatePinForField } from "../generateFields";
import { BoardState } from "./boardStateTypes";

export const PLAYER_DATA = {
  p1Color: "orange",
  p2Color: "white",
};

const defaultState: BoardState = {
  gameStatus: {
    gameOver: false,
    winnerColor: null,
  },
  activePlayer: {
    color: PLAYER_DATA.p2Color,
  },
  activePin: null,
  fields: generateFields(generatePinForField),
  moveHistory: [],
  lockedActivePin: null,
  lastKilledPin: null,
  showJumpOpportunities: false,
  highestYieldingJumps: [],
};

export default defaultState;
