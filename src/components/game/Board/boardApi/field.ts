import { Field } from "../state/boardStateTypes";
import {
  Coordinate,
  getIntermediateFieldCoordinates,
  isSameLocation,
} from "./position";

export const findFieldWithLocation = (fields: Field[], location: Coordinate) =>
  fields.find((f) => isSameLocation(f.position, location));

export const getIntermediateField = (
  start: Coordinate,
  target: Coordinate,
  fields: Field[]
) => {
  const itermediateFieldCoordinates = getIntermediateFieldCoordinates(
    start,
    target,
    fields.length
  );

  const intermediateField = findFieldWithLocation(
    fields,
    itermediateFieldCoordinates
  );

  return intermediateField;
};
