import { Field, GameStatus, Player } from "../state/boardStateTypes";
import { PLAYER_DATA } from "../state/defaultState";
import { MoveResult } from "./board";

export const getGameSatus = (moveResult: MoveResult): GameStatus => {
  const pinColorsLeft = moveResult.outcome.fields.reduce(
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

export function getOtherPlayer(player: Player) {
  return {
    color:
      player.color === PLAYER_DATA.p1Color
        ? PLAYER_DATA.p2Color
        : PLAYER_DATA.p1Color,
  };
}
