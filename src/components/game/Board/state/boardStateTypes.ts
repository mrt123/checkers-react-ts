export interface PositionOnBoard {
  x: number;
  y: number;
}

export interface Pin {
  color: string;
  moveDirection: "up" | "down";
  position: PositionOnBoard;
  isKing: boolean;
}

export interface Field {
  color: string;
  position: PositionOnBoard;
  highlighted: boolean;
  pin: null | Pin;
}

export interface Player {
  color: string;
}

export interface MoveRecord {
  playerColor: string;
  start: PositionOnBoard;
  end: PositionOnBoard;
  killedPinCoordinate: PositionOnBoard | null;
  killedSomething: boolean;
  number: number;
}

export interface BoardState {
  activePlayer: Player;
  activePin: null | Pin;
  fields: Field[];
  moveHistory: MoveRecord[];
  lockedActivePin: null | Pin;
}
