import { tryMove } from "../boardApi/board";
import {
  getFieldsWithHighlight,
  unshakeAllPins,
  updatePinShake,
} from "../boardApi/field";
import { getGameSatus, getOtherPlayer } from "../boardApi/gameStatus";
import {
  compareWithJumpOpportunities,
  getAllPossibleJumpsForAPin,
  getHihestYieldingJumps as getHighestYieldingJumps,
} from "../boardApi/jumps";
import { getMoveRecord } from "../boardApi/moveHistory";
import { isAtSameLocation } from "../boardApi/position";
import {
  BoardAction,
  MOVE_PIN_TO_FIELD,
  SET_ACTIVE_PIN,
  SET_HIGHEST_YIELDING_JUMPS,
  SET_LAST_KILLED_PIN,
  TRY_HIGLIGHT_FIELD,
  UNSET_HIGHLIGHT_FIELD,
} from "./boardActions";
import { BoardState, Pin } from "./boardStateTypes";
import defaultState from "./defaultState";

const boardReducer = (
  state: BoardState = defaultState,
  action: BoardAction
) => {
  switch (action.type) {
    case SET_ACTIVE_PIN: {
      // NOTE unsetting actions logs might be switched off
      const actionIsAnUnset = action.pin === null;

      return {
        ...state,
        activePin: action.pin,
        fields: actionIsAnUnset ? state.fields : unshakeAllPins(state.fields),
      };
    }

    case SET_LAST_KILLED_PIN: {
      return {
        ...state,
        lastKilledPin: action.pin,
      };
    }

    case TRY_HIGLIGHT_FIELD: {
      const pinIsNotAllowedToMove =
        state.lockedActivePin &&
        !isAtSameLocation(state.activePin, state.lockedActivePin);

      if (pinIsNotAllowedToMove) return state;

      const moveResult = tryMove(
        state.activePin as Pin,
        action.f,
        state.fields,
        state.activePlayer
      );

      console.log(moveResult);

      if (!moveResult.legality.isLegal) return state; // early termination for performance

      /**
       * Notice:
       * - jumping is compulsory when capture can be made
       * - jump yiedling largest capture must be chosen
       * - it is compulsory to keep jumping until all the jumps are completed
       */

      const moveJumpInfo = compareWithJumpOpportunities(
        !!state.lockedActivePin,
        moveResult.description,
        state.fields
      );

      if (moveJumpInfo.jumpOpportunityExistsOnBoard) {
        return {
          ...state,
          fields: getFieldsWithHighlight({
            fields: state.fields,
            targetField: action.f,
            shouldBeHighlighted: moveJumpInfo.isHighestYielding,
          }),
        };
      } else {
        if (moveResult.legality.isLegal)
          return {
            ...state,
            fields: getFieldsWithHighlight({
              fields: state.fields,
              targetField: action.f,
              shouldBeHighlighted: true,
            }),
          };
        else return state;
      }
    }

    case UNSET_HIGHLIGHT_FIELD: {
      // if field is not highlighted do not change state (avoids re-render of components relying on this state part)
      if (!action.f.highlighted) return state;

      return {
        ...state,
        fields: getFieldsWithHighlight({
          fields: state.fields,
          targetField: action.f,
          shouldBeHighlighted: false,
        }),
      };
    }

    case MOVE_PIN_TO_FIELD: {
      // NOTE: even though this action is executed on higlighted (legal) field, we still calculate MoveResult to get updated fields
      const moveResult = tryMove(
        action.pin,
        action.field,
        state.fields,
        state.activePlayer
      );

      const { multiTileMoveInfo } = moveResult.legality;

      const consecutiveCapturePossible = multiTileMoveInfo?.isCapture
        ? getAllPossibleJumpsForAPin(
            moveResult.outcome.updatedPin,
            moveResult.outcome.fields,
            state.activePlayer
          )
        : [];

      const forceAnotherJump = consecutiveCapturePossible.length > 0;
      const gameStatus = getGameSatus(moveResult);
      const lockActivePin = forceAnotherJump || gameStatus.gameOver;
      const nextPlayer = lockActivePin
        ? state.activePlayer
        : getOtherPlayer(state.activePlayer);

      const moveRecord = getMoveRecord(moveResult, state.moveHistory);

      return {
        ...state,
        fields: moveResult.outcome.fields,
        activePin: moveResult.outcome.updatedPin,
        lockedActivePin: lockActivePin ? moveResult.outcome.updatedPin : null,
        activePlayer: nextPlayer,
        moveHistory: [...state.moveHistory, moveRecord],
        gameStatus,
        lastKilledPin: moveResult.outcome.killedPin || null,
      };
    }

    case SET_HIGHEST_YIELDING_JUMPS: {
      const exclusivePin = state.lockedActivePin ? state.lockedActivePin : null;
      const highestYieldingJumps = getHighestYieldingJumps(
        state.fields,
        state.activePin?.color,
        exclusivePin
      );

      const pinsToShake = highestYieldingJumps.map(
        (j) => j.description.activePin
      );

      return {
        ...state,
        showJumpOpportunities: action.value, // TODO: might be used later for user control to toggle hints
        highestYieldingJumps,
        fields: updatePinShake({
          fields: state.fields,
          pins: pinsToShake,
          shouldShake: true,
        }),
      };
    }

    default: {
      return state;
    }
  }
};

export default boardReducer;
