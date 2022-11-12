import { Field, Pin, Player } from "../state/boardStateTypes";
import { findFieldWithLocation, getIntermediateField } from "./field";
import { Coordinate, getMoveDistance, isSameLocation, Move } from "./position";

export interface MoveInfo {
  move: Move;
  startingPin: Pin;
  targetField: Field;
  isJump: boolean;
  isOneTileMove: boolean;
  canBeLegal: boolean;
}

interface MoveResult {
  fields: Field[];
  isLegal: boolean;
  isJump: boolean;
  moveInfo: null | MoveInfo;
  updatedPin: Pin | null;
}

interface MoveResultWithKills extends MoveResult {
  numberOfKills: number;
}

interface EntityWithPosition {
  position: Coordinate;
}

export const isAtSameLocation = (
  a: EntityWithPosition | null,
  b: EntityWithPosition | null
) => {
  if (a === null || b === null) return false;
  return isSameLocation(a.position, b.position);
};

/**
 * NOTE: pin has a predefined moveDirection: "up" or "down"
 * - 'down' requires adding to Y axis
 * - 'up' requires substracting from Y axis
 */
const pinMovesInLegalYAxisDirection = (
  pin: Pin,
  fieldTarget: Field,
  moveIsAJump: boolean
) => {
  if (pin.isKing || moveIsAJump) return true;
  if (pin.moveDirection === "down")
    return fieldTarget.position.y > pin.position.y;
  else return fieldTarget.position.y < pin.position.y;
};

const getKilledPin = (
  movingPlayerColor: string,
  moveInfo: MoveInfo,
  fields: Field[]
): Pin | null => {
  if (moveInfo.isJump && moveInfo.canBeLegal) {
    const intermediateField = getIntermediateField(
      moveInfo.move.from,
      moveInfo.move.to,
      fields
    );
    if (
      intermediateField?.pin &&
      intermediateField.pin.color !== movingPlayerColor
    )
      return intermediateField.pin;
    else return null;
  }
  return null;
};

const pinShouldBeNominatedKing = (pin: Pin, boardWidth: number) => {
  return pin.moveDirection === "down"
    ? pin.position.y === boardWidth - 1
    : pin.position.y === 0;
};

const getFieldsAfterMove = (fields: Field[], move: MoveInfo): Field[] => {
  const startField = findFieldWithLocation(fields, move.startingPin.position);
  if (!startField?.pin) return fields;

  const killedPin = getKilledPin(startField.pin.color, move, fields);

  const boardWidth = Math.sqrt(fields.length);
  const newFields = fields.map((f) => {
    if (isAtSameLocation(f, move.startingPin)) return { ...f, pin: null };
    else if (isAtSameLocation(f, move.targetField)) {
      const pinWithUpdatedCoordinates = {
        ...(startField.pin as Pin),
        position: f.position,
      };

      const isKing =
        pinWithUpdatedCoordinates.isKing ||
        pinShouldBeNominatedKing(pinWithUpdatedCoordinates, boardWidth);

      const pinWIthUpdatedKingStatus = {
        ...pinWithUpdatedCoordinates,
        isKing,
      };
      return { ...f, pin: pinWIthUpdatedKingStatus };
    } else if (f.pin === killedPin) {
      return { ...f, pin: null };
    }
    return f;
  });

  return newFields;
};

const getMoveInfo = (pin: Pin, targetField: Field): MoveInfo => {
  const moveDistance = getMoveDistance(pin.position, targetField.position);
  const isInLegalDirection = pinMovesInLegalYAxisDirection(
    pin,
    targetField,
    moveDistance.isJump
  );
  const distanceIsLegal = moveDistance.isOneTileMove || moveDistance.isJump;
  const moveCanBeLegal =
    isInLegalDirection && distanceIsLegal && targetField.pin === null;

  return {
    move: {
      from: pin.position,
      to: targetField.position,
    },
    startingPin: pin,
    targetField: targetField,
    ...moveDistance,
    canBeLegal: moveCanBeLegal, // without analyzing where other pins are
  };
};

/**
 * Notice: not only is jumping compulsory, it is also compulsory to keep jumping until all the jumps are completed
 */
export const tryMove = (
  pin: Pin,
  fieldTarget: Field,
  fields: Field[],
  activePlayer: Player
): MoveResult => {
  if (pin.color !== activePlayer.color)
    return {
      fields,
      isLegal: false,
      isJump: false,
      moveInfo: null,
      updatedPin: null,
    };

  const moveInfo: MoveInfo = getMoveInfo(pin, fieldTarget);

  const killedPin = getKilledPin(activePlayer.color, moveInfo, fields);

  const newFields = getFieldsAfterMove(fields, moveInfo);

  const insSuccessfullKill = moveInfo.isJump && killedPin !== null;
  const moveTypeIsLegal = moveInfo.isOneTileMove || insSuccessfullKill;

  const updatedPin = {
    ...pin,
    position: fieldTarget.position,
  };

  return {
    fields: newFields,
    isLegal: moveInfo.canBeLegal && moveTypeIsLegal,
    isJump: insSuccessfullKill,
    updatedPin: updatedPin || null,
    moveInfo,
  };
};

export const getAllJumpsPossibleForPlayer = (
  player: Player,
  fields: Field[]
) => {
  const allPins = fields.map((f) => f.pin);
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
  const allPossibleMoveResultsForPin = jumpResult.fields.map((f) => {
    const pin = {
      ...jumpResult.moveInfo?.startingPin,
      position: jumpResult.moveInfo?.targetField.position,
    };
    const moveResult =
      pin !== null ? tryMove(pin, f, jumpResult.fields, activePlayer) : null;
    return moveResult;
  });

  const allPossibleJumpsForPin = allPossibleMoveResultsForPin.filter(
    (m) => m !== null && m.isJump && m.isLegal
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
    return moveDistance.isJump;
  });
  return jumpDestinations;
};

/**
 *
 * @returns immediate (single) killing jumps for specific pin
 */
export const getAllPossibleJumpsForAPin = (
  pin: Pin,
  fields: Field[],
  activePlayer: Player
): MoveResultWithKills[] => {
  // to imporve performance we lower field to a subset of jump destiantions
  const jumpDestinations = getJumpDestinationsForPin(pin, fields);

  const allPossibleJumpResultsForPin = jumpDestinations.map((f) => {
    const moveResult = tryMove(pin, f, fields, activePlayer);
    return moveResult;
  });

  const allLegalJumpsForPin = allPossibleJumpResultsForPin.filter(
    (m) => m.isJump && m.isLegal
  );

  return allLegalJumpsForPin.map((jump) => {
    return {
      ...jump,
      numberOfKills: getDeepJumpKillCount(jump, activePlayer),
    };
  });
};

export const getHihestYieldingJumps = (fields: Field[], player: Player) => {
  const allJumpsPossibleForPlayer = getAllJumpsPossibleForPlayer(
    player,
    fields
  );

  const maxKillsInAJump = Math.max(
    ...allJumpsPossibleForPlayer.map((j) => j.numberOfKills)
  );

  return allJumpsPossibleForPlayer.filter(
    (j) => j.numberOfKills === maxKillsInAJump
  );
};
