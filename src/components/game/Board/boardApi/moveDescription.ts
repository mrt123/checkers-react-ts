// LETS START A NEW MODULE ... ONE WHICH IS CONCERNED PURELY ABOUT HIGH LEVEL ABSTRACTION OF A MOVE

import { Field, Pin } from "../state/boardStateTypes";
import { MoveLegality } from "./moveLegality";
import { Coordinate, isSameLocation } from "./position";

export interface MoveDescription {
  activePin: Pin;
  targetField: Field;
  intermediateFields: Field[];
  distance: number;
  isDiagonal: boolean;
  direction: "up" | "down";
}

export interface MoveInfo {
  move: MoveDescription;
  moveLegality: MoveLegality;
}

export interface MoveDistanceType {
  isJump: boolean;
  isOneTileMove: boolean;
  isKingJump: boolean;
}

export const getMoveDistance = (
  start: Coordinate,
  target: Coordinate
): MoveDistanceType => {
  const moveDistanceX = Math.abs(target.x - start.x);
  const moveDistanceY = Math.abs(target.y - start.y);

  const isOneTileMove = moveDistanceX === 1 && moveDistanceY === 1;
  const isJump = moveDistanceX === 2 && moveDistanceY === 2;
  const isDiagonal = moveDistanceX === moveDistanceY;
  const isKingJump = moveDistanceX > 1 && moveDistanceY > 1 && isDiagonal;
  return {
    isOneTileMove,
    isJump,
    isKingJump,
  };
};

// TODO: unit-test in 4 directions
const getIntermediateFields = (
  start: Coordinate,
  finish: Coordinate,
  fields: Field[],
  direction: "up" | "down"
): Field[] => {
  const numberOfPointsInAxis = Math.sqrt(fields.length);
  const availbleValuesInAxis = [...Array(numberOfPointsInAxis).keys()]; // [0, 1, 2, 3, ...]

  const greaterX = Math.max(start.x, finish.x);
  const smallerX = Math.min(start.x, finish.x);
  const intermediateX = availbleValuesInAxis.slice(smallerX + 1, greaterX);

  const horizontalDirection: "right" | "left" =
    finish.x > start.x ? "right" : "left";

  const intermediateXOrdered =
    horizontalDirection === "right" ? intermediateX : intermediateX.reverse();

  const greaterY = Math.max(start.y, finish.y);
  const smallerY = Math.min(start.y, finish.y);
  const intermediateY = availbleValuesInAxis.slice(smallerY + 1, greaterY);
  const intermediateYOrdered =
    direction === "down" ? intermediateY : intermediateY.reverse();

  const intermediateFieldCoordinates = intermediateXOrdered.map((x, i) => {
    return { x, y: intermediateYOrdered[i] };
  });

  const intermediateFields = intermediateFieldCoordinates
    .map((c) => {
      return fields.find((f) => isSameLocation(c, f.position));
    })
    .filter((f): f is Field => !!f);

  return intermediateFields;
};

const getMoveDirection = (
  start: Coordinate,
  finish: Coordinate
): "up" | "down" => {
  return start.y < finish.y ? "down" : "up";
};

const isDiagonalMove = (start: Coordinate, target: Coordinate) => {
  const moveDistanceX = Math.abs(target.x - start.x);
  const moveDistanceY = Math.abs(target.y - start.y);
  return moveDistanceX === moveDistanceY;
};

export const getMoveDescription = (
  activePin: Pin,
  targetField: Field,
  fields: Field[]
): MoveDescription => {
  const direction = getMoveDirection(activePin.position, targetField.position);
  const intermediateFields = getIntermediateFields(
    activePin.position,
    targetField.position,
    fields,
    direction
  );

  return {
    activePin,
    targetField,
    intermediateFields,
    distance: intermediateFields.length + 1,
    isDiagonal: isDiagonalMove(activePin.position, targetField.position),
    direction,
  };
};
