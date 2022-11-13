import { Field, GameStatus } from "../state/boardStateTypes";
import { MoveResult } from "./board";

export const getGameSatus = (moveResult: MoveResult): GameStatus => {
  const pinColorsLeft = moveResult.fields.reduce(
    (accumulator: string[], field: Field) => {
      const pinColor = field.pin?.color;
      if (pinColor) {
        if (!accumulator.includes(pinColor)) accumulator.push(pinColor);
      }
      return accumulator;
    },
    []
  );

  const gameOver = pinColorsLeft.length === 1;
  const winnerColor = pinColorsLeft.length < 2 ? pinColorsLeft[0] : null;

  return {
    winnerColor,
    gameOver,
  };
};
