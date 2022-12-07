import { createPin, generateFields, PinGenerator } from "../generateFields";
import { Field, Player } from "../state/boardStateTypes";
import { tryMove } from "./board";
import { includesLocation } from "./position";

describe("tryMove", () => {
  it("king can jump with capture and land 1 step after enemy (x4 y3) ", () => {
    const activePlayer: Player = { color: "white" };
    const getActivePin = () => {
      return createPin(7, 0, "white", "up", true);
    };

    const targetField: Field = {
      color: "black",
      position: { x: 4, y: 5 },
      highlighted: false,
      pin: null,
    };

    const whitePins = [
      { x: 3, y: 2 },
      { x: 2, y: 1 },
    ];

    const darkPins = [
      { x: 8, y: 5 },
      { x: 5, y: 2 },
      { x: 6, y: 3 },
    ];

    const testPinGenerateForField: PinGenerator = (f: Field) => {
      if (includesLocation(f.position, whitePins))
        return createPin(f.position.x, f.position.y, "white", "up", false);
      if (includesLocation(f.position, darkPins))
        return createPin(f.position.x, f.position.y, "orange", "down");
      else return null;
    };

    const fields = generateFields(testPinGenerateForField);

    const moveResult = tryMove(
      getActivePin(),
      targetField,
      fields,
      activePlayer
    );

    expect(moveResult.legality.isLegal).toBe(false);
  });
});
