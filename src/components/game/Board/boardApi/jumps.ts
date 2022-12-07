import { Field, Pin, Player } from "../state/boardStateTypes";
import { MoveResult, tryMove } from "./board";
import { getMoveDistance, MoveDescription } from "./moveDescription";
import { isSameMove } from "./position";

export interface JumpInfo {
  jumpOpportunityExistsOnBoard: boolean;
  isHighestYielding: boolean;
}

export const getAllJumpsPossibleForPlayer = (
  player: Player,
  fields: Field[],
  exclusivePin: Pin | null
) => {
  const allPins = exclusivePin ? [exclusivePin] : fields.map((f) => f.pin);
  const playerPins = allPins.filter((p) => p?.color === player.color);

  const playerPinsPossibilities = playerPins.map((pin) => {
    const possibleJumpsForAPin = getAllPossibleJumpsForAPin(
      pin as Pin,
      fields,
      player
    );

    const maxKillsInAJump = Math.max(
      ...possibleJumpsForAPin.map((j) => j.numberOfKills)
    );

    const jumpsWithMaxKills = possibleJumpsForAPin.filter(
      (j) => j.numberOfKills === maxKillsInAJump
    );

    return {
      possibleJumps: possibleJumpsForAPin,
      jumpsArePossible: possibleJumpsForAPin.length > 0,
      jumpsWithMaxKills,
      maxKillsInAJump,
    };
  });

  const allPossibleJumps = playerPinsPossibilities
    .filter((pP) => pP.jumpsArePossible)
    .flatMap((pP) => pP.possibleJumps);

  return allPossibleJumps;
};

const getDeepJumpKillCount = (jumpResult: MoveResult, activePlayer: Player) => {
  const allPossibleMoveResultsForPin = jumpResult.outcome.fields.map((f) => {
    const pin = {
      ...jumpResult.description.activePin,
      position: jumpResult.description.targetField.position,
    };
    const moveResult =
      pin !== null
        ? tryMove(pin, f, jumpResult.outcome.fields, activePlayer)
        : null;
    return moveResult;
  });

  const allPossibleJumpsForPin: MoveResult[] =
    allPossibleMoveResultsForPin.filter(
      (m): m is MoveResult =>
        m !== null && !!m.legality.multiTileMoveInfo?.isCapture
    );

  const deepKillCountForEachPath = allPossibleJumpsForPin.map((j) =>
    getDeepJumpKillCount(j, activePlayer)
  );

  return (
    1 + // each recursive execution means + 1 jump level was possible
    Math.max(0, ...deepKillCountForEachPath)
  );
};

const getJumpDestinationsForPin = (pin: Pin, fields: Field[]): Field[] => {
  const jumpDestinations = fields.filter((f) => {
    const moveDistance = getMoveDistance(pin.position, f.position);
    return moveDistance.isJump || moveDistance.isKingJump;
  });
  return jumpDestinations;
};

interface MoveResultWithKills extends MoveResult {
  numberOfKills: number;
}

/**
 *
 * @returns immediate (single) killing jumps for specific pin
 */
export const getAllPossibleJumpsForAPin = (
  pin: Pin,
  fields: Field[],
  activePlayer: Player
): MoveResultWithKills[] => {
  // to imporve performance we lower field-set to a subset of jump destiantions
  const jumpDestinations = getJumpDestinationsForPin(pin, fields);

  const allPossibleJumpResultsForPin = jumpDestinations.map((f) => {
    const moveResult = tryMove(pin, f, fields, activePlayer);
    return moveResult;
  });

  const allLegalJumpsForPin = allPossibleJumpResultsForPin.filter(
    (m) => !!m.legality.multiTileMoveInfo?.isCapture
  );

  return allLegalJumpsForPin.map((jump) => {
    return {
      ...jump,
      numberOfKills: getDeepJumpKillCount(jump, activePlayer),
    };
  });
};

export const getHihestYieldingJumps = (
  fields: Field[],
  playerColor: string | undefined,
  exclusivePin: Pin | null
) => {
  if (!playerColor) return [];

  const allJumpsPossibleForPlayer = getAllJumpsPossibleForPlayer(
    { color: playerColor },
    fields,
    exclusivePin
  );

  const maxKillsInAJump = Math.max(
    ...allJumpsPossibleForPlayer.map((j) => j.numberOfKills)
  );

  console.log({
    allJumpsPossibleForPlayer,
    maxKillsInAJump,
    x: allJumpsPossibleForPlayer.filter(
      (j) => j.numberOfKills === maxKillsInAJump
    ),
  });

  return allJumpsPossibleForPlayer.filter(
    (j) => j.numberOfKills === maxKillsInAJump
  );
};

export const compareWithJumpOpportunities = (
  moveIsPerformedByLockedPin: boolean,
  move: MoveDescription,
  fields: Field[]
): JumpInfo => {
  const exclusivePin = moveIsPerformedByLockedPin ? move.activePin : null;

  const hihestYieldingJumps = getHihestYieldingJumps(
    fields,
    move.activePin.color,
    exclusivePin
  );

  const currentMoveAmongstHighestYielding = hihestYieldingJumps.find((jump) => {
    const tempMoveA = {
      from: jump.description.activePin.position,
      to: jump.description.targetField.position,
    };

    const tempMoveB = {
      from: move.activePin.position,
      to: move.targetField.position,
    };

    return isSameMove(tempMoveA, tempMoveB);
  });

  return {
    isHighestYielding: !!currentMoveAmongstHighestYielding,
    jumpOpportunityExistsOnBoard: !!hihestYieldingJumps.length, // presence of  any highest yielding jumps confirms existence of jump opportunity
  };
};
