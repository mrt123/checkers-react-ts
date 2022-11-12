import { applyMiddleware, createStore } from "redux";
import { createLogger } from "redux-logger";
import {
  SET_ACTIVE_PIN,
  UNSET_HIGHLIGHT_FIELD,
} from "../components/game/Board/state/boardActions";
import rootReducer from "./reducers";

const middleWares = [];

if (window.location.hostname === "localhost") {
  const loggerMiddleware = createLogger({
    collapsed: true,
    predicate: (getState, action) => {
      const actionIsUnsettingActivePin =
        action.type === SET_ACTIVE_PIN && action.pin === null;

      return (
        !actionIsUnsettingActivePin &&
        action.type !== UNSET_HIGHLIGHT_FIELD &&
        true
        // getState().debugSwitches.reduxLogs
      );
    },
  });
  middleWares.push(loggerMiddleware);
}

const store = createStore(rootReducer, applyMiddleware(...middleWares));
export type RootState = ReturnType<typeof store.getState>;
export default store;
