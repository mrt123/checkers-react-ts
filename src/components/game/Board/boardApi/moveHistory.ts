import { MoveRecord } from "../state/boardStateTypes";
import { MoveInfo } from "./board";

export const getMoveRecord = (
  moveInfo: MoveInfo,
  moveHistory: MoveRecord[]
): MoveRecord => {
  return {
    playerColor: moveInfo.startingPin.color,
    // enemyColor:
    start: moveInfo.startingPin.position,
    end: moveInfo.targetField.position,
    killedPinCoordinate: null,
    killedSomething: moveInfo.isJump,
    number: moveHistory.length + 1,
  };
};
