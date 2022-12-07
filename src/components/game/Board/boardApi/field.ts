import { Field, Pin } from "../state/boardStateTypes";
import { Coordinate, isAtSameLocation, isSameLocation } from "./position";

interface FieldHighloghtConfig {
  fields: Field[];
  targetField: Field;
  shouldBeHighlighted: boolean;
}

export function getFieldsWithHighlight(config: FieldHighloghtConfig): Field[] {
  return config.fields.map((f) => {
    const fieldMatch = isAtSameLocation(f, config.targetField);
    return fieldMatch ? { ...f, highlighted: config.shouldBeHighlighted } : f;
  });
}

interface PinShakingConfig {
  pins?: Pin[];
  fields: Field[];
  shouldShake: boolean;
  allPins?: boolean;
}

export const unshakeAllPins = (fields: Field[]) => {
  return updatePinShake({ fields, allPins: true, shouldShake: false });
};

export const updatePinShake = (config: PinShakingConfig): Field[] => {
  return config.fields.map((f) => {
    if (!f.pin) return f;
    else {
      const shouldShakePin = config.allPins
        ? config.shouldShake
        : !!config.pins?.find((p) => isAtSameLocation(p, f));

      return { ...f, pin: { ...f.pin, shake: shouldShakePin } };
    }
  });
};

export const findFieldWithLocation = (fields: Field[], location: Coordinate) =>
  fields.find((f) => isSameLocation(f.position, location));

const fieldHasEnemy = (playerColor: string, field: Field | undefined) => {
  const fieldHasPin = !!field?.pin;
  const fieldColorIsEnemy = field?.pin?.color !== playerColor;
  return fieldHasPin && fieldColorIsEnemy;
};

export interface IntermediateFieldsInfo {
  containsOnePin: boolean;
  containsOneEnemy: boolean;
  pathIsJumpable: boolean;
  jumpablePin: Pin | null;
}

export const getIntermediateFieldsInfo = (
  intermediateFields: Field[],
  movingPlayerColor: string
): IntermediateFieldsInfo => {
  const intermediateFieldsWithPins = intermediateFields.filter(
    (f) => f.pin !== null
  );
  const containsOneEnemy = fieldHasEnemy(
    movingPlayerColor,
    intermediateFieldsWithPins[0]
  );

  const containsOnePin = intermediateFieldsWithPins.length === 1;
  const pathIsJumpable = containsOnePin && containsOneEnemy;

  return {
    containsOnePin,
    containsOneEnemy,
    pathIsJumpable,
    jumpablePin: pathIsJumpable ? intermediateFieldsWithPins[0].pin : null,
  };
};
