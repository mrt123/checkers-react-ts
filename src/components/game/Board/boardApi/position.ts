export interface Move {
  from: Coordinate;
  to: Coordinate;
}

export interface Coordinate {
  x: number;
  y: number;
}

interface MoveDistanceType {
  isJump: boolean;
  isOneTileMove: boolean;
}

export const isSameMove = (moveA: Move, moveB: Move): boolean => {
  return (
    isSameLocation(moveA.from, moveB.from) && isSameLocation(moveA.to, moveB.to)
  );
};

export const getIntermediateFieldCoordinates = (
  start: Coordinate,
  target: Coordinate,
  numberOfFieldsInABoard: number
): Coordinate => {
  const numberOfPointsInAxis = Math.sqrt(numberOfFieldsInABoard);
  const availbleValuesInAxis = [...Array(numberOfPointsInAxis).keys()];

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

export const getMoveDistance = (
  start: Coordinate,
  target: Coordinate
): MoveDistanceType => {
  const moveDistanceX = Math.abs(target.x - start.x);
  const moveDistanceY = Math.abs(target.y - start.y);
  const isOneTileMove = moveDistanceX === 1 && moveDistanceY === 1;
  const isJump = moveDistanceX === 2 && moveDistanceY === 2;
  return {
    isOneTileMove,
    isJump,
  };
};
