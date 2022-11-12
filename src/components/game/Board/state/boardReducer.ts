import {
  getAllPossibleJumpsForAPin,
  isAtSameLocation,
  tryMove,
} from "../boardApi/board";
import { compareWithJumpOpportunities } from "../boardApi/jumps";
import { getMoveRecord } from "../boardApi/moveHistory";
import {
  BoardAction,
  MOVE_PIN_TO_FIELD,
  SET_ACTIVE_PIN,
  TRY_HIGLIGHT_FIELD,
  UNSET_HIGHLIGHT_FIELD,
} from "./boardActions";
import { BoardState, Field, Pin, Player } from "./boardStateTypes";
import defaultState, { PLAYER_DATA } from "./defaultState";

const boardReducer = (
  state: BoardState = defaultState,
  action: BoardAction
) => {
  switch (action.type) {
    case SET_ACTIVE_PIN: {
      return {
        ...state,
        activePin: action.pin,
      };
    }

    case TRY_HIGLIGHT_FIELD: {
      const pinIsNotAllowedToMove =
        state.lockedActivePin &&
        state.activePin &&
        !isAtSameLocation(state.activePin, state.lockedActivePin);

      if (pinIsNotAllowedToMove) return state;

      const moveResult = tryMove(
        state.activePin as Pin,
        action.f,
        state.fields,
        state.activePlayer
      );

      if (!moveResult.isLegal) return state; // early termination for performance

      const moveJumpInfo = compareWithJumpOpportunities(
        moveResult.moveInfo,
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
        if (moveResult.isLegal)
          return {
            ...state,
            fields: getFieldsWithHighlight({
              fields: state.fields,
              targetField: action.f,
              shouldBeHighlighted: true,
            }),
            lockedActivePin: null,
          };
        else return state;
      }
    }

    case UNSET_HIGHLIGHT_FIELD: {
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

      const furtherJumpsPossibleForPin = moveResult.isJump
        ? getAllPossibleJumpsForAPin(
            moveResult.updatedPin,
            moveResult.fields,
            state.activePlayer
          )
        : [];

      const forceAnotherJump = furtherJumpsPossibleForPin.length > 0;

      const nextPlayer = forceAnotherJump
        ? state.activePlayer
        : getOtherPlayer(state.activePlayer);

      const moveRecord = getMoveRecord(moveResult.moveInfo, state.moveHistory);

      return {
        ...state,
        fields: moveResult.fields,
        activePin: moveResult.updatedPin,
        lockedActivePin: forceAnotherJump ? moveResult.updatedPin : null,
        activePlayer: nextPlayer,
        moveHistory: [...state.moveHistory, moveRecord],
      };
    }

    default: {
      return state;
    }
  }
};

function getOtherPlayer(player: Player) {
  return {
    color:
      player.color === PLAYER_DATA.p1Color
        ? PLAYER_DATA.p2Color
        : PLAYER_DATA.p1Color,
  };
}

interface FieldHighloghtConfig {
  fields: Field[];
  targetField: Field;
  shouldBeHighlighted: boolean;
}

function getFieldsWithHighlight(config: FieldHighloghtConfig): Field[] {
  return config.fields.map((f) => {
    const fieldMatch = isAtSameLocation(f, config.targetField);
    return fieldMatch ? { ...f, highlighted: config.shouldBeHighlighted } : f;
  });
}

export default boardReducer;
