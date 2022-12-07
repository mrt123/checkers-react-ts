export interface PositionChange {
  from: Coordinate;
  to: Coordinate;
}

export interface Coordinate {
  x: number;
  y: number;
}

export const isSameMove = (
  moveA: PositionChange,
  moveB: PositionChange
): boolean => {
  return (
    isSameLocation(moveA.from, moveB.from) && isSameLocation(moveA.to, moveB.to)
  );
};

export const getIntermediateFieldsCoordinates = (
  start: Coordinate,
  target: Coordinate,
  numberOfFieldsInABoard: number
): Coordinate[] => {
  const numberOfPointsInAxis = Math.sqrt(numberOfFieldsInABoard);
  const availbleValuesInAxis = [...Array(numberOfPointsInAxis).keys()];

  const greaterX = Math.max(start.x, target.x);
  const smallerX = Math.min(start.x, target.x);
  const intermediateX = availbleValuesInAxis.slice(smallerX + 1, greaterX);

  const greaterY = Math.max(start.y, target.y);
  const smallerY = Math.min(start.y, target.y);
  const intermediateY = availbleValuesInAxis.slice(smallerY + 1, greaterY);

  return intermediateX.map((x, index) => {
    return { x, y: intermediateY[index] };
  });
};

export const getIntermediateFieldCoordinates = (
  start: Coordinate,
  target: Coordinate,
  numberOfFieldsInABoard: number
): Coordinate => {
  const numberOfPointsInAxis = Math.sqrt(numberOfFieldsInABoard);
  const availbleValuesInAxis = [...Array(numberOfPointsInAxis).keys()]; // [0, 1, 2, 3, ...]

  const greaterX = Math.max(start.x, target.x);
  const smallerX = Math.min(start.x, target.x);
  const intermediateX = availbleValuesInAxis.slice(smallerX + 1, greaterX);

  const greaterY = Math.max(start.y, target.y);
  const smallerY = Math.min(start.y, target.y);
  const intermediateY = availbleValuesInAxis.slice(smallerY + 1, greaterY);

  return {
    x: intermediateX[0], // TODO: to support bigger jumps return array
    y: intermediateY[0],
  };
};

export const isSameLocation = (a: Coordinate | null, b: Coordinate) => {
  return a !== null && a.x === b.x && a.y === b.y;
};

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

export const includesLocation = (
  location: Coordinate,
  locations: Coordinate[]
) => {
  return locations.some((l) => isSameLocation(l, location));
};
