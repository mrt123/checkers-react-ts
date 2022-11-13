import { Field, Pin } from "./boardStateTypes";

export const SET_ACTIVE_PIN = "SET_ACTIVE_PIN";
export const SET_LAST_KILLED_PIN = "SET_LAST_KILLED_PIN";
export const TRY_HIGLIGHT_FIELD = "TRY_HIGLIGHT_FIELD";
export const UNSET_HIGHLIGHT_FIELD = "UNSET_HIGHLIGHT_FIELD";
export const MOVE_PIN_TO_FIELD = "MOVE_PIN_TO_FIELD";

export type BoardAction =
  | {
      type: typeof SET_ACTIVE_PIN;
      pin: Pin;
    }
  | {
      type: typeof SET_LAST_KILLED_PIN;
      pin: Pin | null;
    }
  | {
      type: typeof TRY_HIGLIGHT_FIELD;
      f: Field;
    }
  | {
      type: typeof UNSET_HIGHLIGHT_FIELD;
      f: Field;
    }
  | {
      type: typeof MOVE_PIN_TO_FIELD;
      pin: Pin;
      field: Field;
    };
