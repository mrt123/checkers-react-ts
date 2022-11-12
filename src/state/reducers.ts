import { combineReducers } from "redux";
import boardReducer from "../components/game/Board/state/boardReducer";

export const SET_DEBUG_SWITCH = "SET_DEBUG_SWITCH";

export type DebugAction = {
  type: typeof SET_DEBUG_SWITCH;
  value: boolean;
  switchName: string;
};

export interface DebuSwitchesState {
  reduxLogs: boolean;
  fieldsCoordinates: boolean;
}

const defaultDebugSwitchesState = {
  reduxLogs: false,
  fieldsCoordinates: false,
};

const debugSwitchesReducer = (
  state: DebuSwitchesState = defaultDebugSwitchesState,
  action: DebugAction
): DebuSwitchesState => {
  switch (action.type) {
    case SET_DEBUG_SWITCH: {
      return {
        ...state,
        [action.switchName]: action.value,
      };
    }
    default: {
      return state;
    }
  }
};

export default combineReducers({
  board: boardReducer,
  debugSwitches: debugSwitchesReducer,
});
