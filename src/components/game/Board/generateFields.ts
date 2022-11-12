import { Field, Pin } from "./state/boardStateTypes";
import { PLAYER_DATA } from "./state/defaultState";

export const BOARD_WIDTH = 10;

function createPin(
  x: number,
  y: number,
  color: string,
  moveDirection: "up" | "down"
) {
  return { position: { x, y }, color, moveDirection, isKing: false };
}

function generatePinForField(f: Field, boardHeight: number): Pin | null {
  if (f.position.y <= 3 && f.color === "black")
    return createPin(f.position.x, f.position.y, PLAYER_DATA.p1Color, "down");

  const yCoordinateOfTopPlayer2Row = boardHeight - 4;

  if (f.position.y >= yCoordinateOfTopPlayer2Row && f.color === "black")
    return createPin(f.position.x, f.position.y, PLAYER_DATA.p2Color, "up");
  else return null;
}

const getFieldColor = (x: number, y: number) => {
  return (x + y) % 2 === 0 ? "white" : "black";
};

const generateFields = (): Field[] => {
  const arrayLikeObject = {
    length: Math.pow(BOARD_WIDTH, 2),
  } as Array<unknown>;
  const fields = Array.apply(null, arrayLikeObject).map((arg1, i) => {
    const y = Math.floor(i / BOARD_WIDTH);
    const x = i - BOARD_WIDTH * y;
    const f = {
      position: {
        x,
        y,
      },
      highlighted: false,
      color: getFieldColor(x, y),
      pin: null,
    };
    return { ...f, pin: generatePinForField(f, BOARD_WIDTH) };
  });
  return fields;
};

export default generateFields;
