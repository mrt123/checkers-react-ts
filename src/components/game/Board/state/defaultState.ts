import generateFields from "../generateFields";
import { BoardState } from "./boardStateTypes";

export const PLAYER_DATA = {
  p1Color: "orange",
  p2Color: "white",
};

const defaultState: BoardState = {
  activePlayer: {
    color: PLAYER_DATA.p2Color,
  },
  activePin: null,
  fields: generateFields(),
  moveHistory: [],
  lockedActivePin: null,
};

export default defaultState;
