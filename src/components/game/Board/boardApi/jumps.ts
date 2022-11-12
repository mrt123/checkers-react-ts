import { Field } from "../state/boardStateTypes";
import { getHihestYieldingJumps, MoveInfo } from "./board";
import { isSameMove } from "./position";

export const moveIsHihestYieldingJump = (
  moveInfo: MoveInfo,
  fields: Field[]
): boolean => {
  const entityWithColor = {
    color: moveInfo.startingPin.color,
  };

  const hihestYieldingJumps = getHihestYieldingJumps(fields, entityWithColor);

  const currentMoveAmongstHighestYielding = hihestYieldingJumps.find((jump) => {
    return isSameMove(jump.moveInfo.move, moveInfo.move);
  });

  return !!currentMoveAmongstHighestYielding;
};

interface JumpInfo {
  jumpOpportunityExistsOnBoard: boolean;
  isHighestYielding: boolean;
}

export const compareWithJumpOpportunities = (
  moveInfo: MoveInfo,
  fields: Field[]
): JumpInfo => {
  const entityWithColor = {
    color: moveInfo.startingPin.color,
  };

  const hihestYieldingJumps = getHihestYieldingJumps(fields, entityWithColor);

  const currentMoveAmongstHighestYielding = hihestYieldingJumps.find((jump) => {
    return isSameMove(jump.moveInfo.move, moveInfo.move);
  });

  return {
    isHighestYielding: !!currentMoveAmongstHighestYielding,
    jumpOpportunityExistsOnBoard: !!hihestYieldingJumps.length, // presence of  any highest yielding jumps confirms existence of jump opportunity
  };
};
