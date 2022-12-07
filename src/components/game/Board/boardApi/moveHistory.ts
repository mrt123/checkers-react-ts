import { MoveRecord } from "../state/boardStateTypes";
import { MoveResult } from "./board";

export const getMoveRecord = (
  moveResult: MoveResult,
  moveHistory: MoveRecord[]
): MoveRecord => {
  return {
    playerColor: moveResult.description.activePin.color,
    start: moveResult.description.activePin.position,
    end: moveResult.description.targetField.position,
    killedPinCoordinate: moveResult.outcome.killedPin?.position || null,
    killedSomething: !!moveResult.legality.multiTileMoveInfo?.capturedPin,
    number: moveHistory.length + 1,
  };
};
