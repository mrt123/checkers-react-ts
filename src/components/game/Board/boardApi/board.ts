import { Field, Pin, Player } from "../state/boardStateTypes";
import { findFieldWithLocation } from "./field";
import { getMoveDescription, MoveDescription } from "./moveDescription";
import { getMoveLegality, MoveLegality } from "./moveLegality";
import { isAtSameLocation } from "./position";

export interface MoveOutcome {
  fields: Field[];
  killedPin: Pin | null;
  updatedPin: Pin;
  pinHasBeenPromoted: boolean;
}

const pinShouldBeNominatedKing = (pin: Pin, fields: Field[]) => {
  const boardWidth = Math.sqrt(fields.length);
  return pin.moveDirection === "down"
    ? pin.position.y === boardWidth - 1
    : pin.position.y === 0;
};

const getFieldsAfterMove = (
  fields: Field[],
  moveDescription: MoveDescription,
  killedPin: Pin | null
): Field[] => {
  const startField = findFieldWithLocation(
    fields,
    moveDescription.activePin.position
  );
  if (!startField?.pin) return fields;

  const newFields = fields.map((f) => {
    if (isAtSameLocation(f, moveDescription.activePin))
      return { ...f, pin: null };
    else if (isAtSameLocation(f, moveDescription.targetField)) {
      const pinWithUpdatedCoordinates = {
        ...(startField.pin as Pin),
        position: f.position,
      };

      const isKing =
        pinWithUpdatedCoordinates.isKing ||
        pinShouldBeNominatedKing(pinWithUpdatedCoordinates, fields);

      const pinWIthUpdatedKingStatus = {
        ...pinWithUpdatedCoordinates,
        isKing,
      };
      return { ...f, pin: pinWIthUpdatedKingStatus };
    } else if (f.pin !== null && f.pin === killedPin) {
      return { ...f, pin: null };
    }
    return f;
  });

  return newFields;
};

export interface MoveResult {
  description: MoveDescription;
  legality: MoveLegality;
  outcome: MoveOutcome;
}

export const tryMove = (
  pin: Pin,
  fieldTarget: Field,
  fields: Field[],
  activePlayer: Player
): MoveResult => {
  const moveDescription = getMoveDescription(pin, fieldTarget, fields);
  const legality = getMoveLegality(activePlayer, moveDescription);
  const killedPin = legality.multiTileMoveInfo?.capturedPin || null;
  const newFields = getFieldsAfterMove(fields, moveDescription, killedPin);
  const updatedPin = {
    ...pin,
    position: fieldTarget.position,
  };

  return {
    description: moveDescription,
    legality,
    outcome: {
      fields: newFields,
      killedPin,
      updatedPin,
      pinHasBeenPromoted: pinShouldBeNominatedKing(updatedPin, fields),
    },
  };
};
