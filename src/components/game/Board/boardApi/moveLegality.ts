import { Pin, Player } from "../state/boardStateTypes";
import { getIntermediateFieldsInfo } from "./field";
import { MoveDescription } from "./moveDescription";

export interface MoveLegality {
  oneTileMoveInfo: OneTileMoveInfo | null;
  multiTileMoveInfo: MultiTileMoveInfo | null;
  isLegal: boolean;
}

interface OneTileMoveInfo {
  isOneTileMove: boolean;
  isLegal: boolean;
}

const isTargetEmpty = (move: MoveDescription) => {
  return move.targetField.pin === null;
};

const getOneTileMoveInfo = (move: MoveDescription): OneTileMoveInfo => {
  const isOneTileMove = move.distance === 1;
  const isInLegalDirection = move.activePin.moveDirection === move.direction;

  return {
    isOneTileMove,
    isLegal:
      isOneTileMove &&
      isTargetEmpty(move) &&
      (isInLegalDirection || move.activePin.isKing),
  };
};

interface MultiTileMoveInfo {
  capturedPin: Pin | null;
  isKingCapture: boolean;
  isRegularCapture: boolean;
  isCapture: boolean;
  isKingMoveWithoutCapture: boolean;
  isLegal: boolean;
}

const getCaptureInfo = (move: MoveDescription): MultiTileMoveInfo => {
  const intermediateFieldsInfo = getIntermediateFieldsInfo(
    move.intermediateFields,
    move.activePin.color
  );

  const isRegularCapture =
    intermediateFieldsInfo.pathIsJumpable && move.distance === 2;

  const { isKing } = move.activePin;

  const isKingMoveWithoutCapture =
    move.distance > 1 && isKing && intermediateFieldsInfo.jumpablePin === null;

  const isKingCapture =
    intermediateFieldsInfo.pathIsJumpable && move.distance > 2 && isKing;

  return {
    capturedPin: intermediateFieldsInfo.jumpablePin,
    isKingCapture,
    isRegularCapture,
    isCapture: isKingCapture || isRegularCapture,
    isKingMoveWithoutCapture,
    isLegal: isKingCapture || isRegularCapture || isKingMoveWithoutCapture, // TODO: use isLegal to highlight fields
  };
};

export const getMoveLegality = (
  activePlayer: Player,
  move: MoveDescription
): MoveLegality => {
  // Note: getCaptureInfo replies on move.intermediateFields (perhaps we can leverage this in getOneTileMoveInfo and fundamentals)
  const moveHasLegalFoundations = isTargetEmpty(move) && move.isDiagonal;

  if (!moveHasLegalFoundations)
    return {
      oneTileMoveInfo: null,
      multiTileMoveInfo: null,
      isLegal: false,
    };

  const oneTileMoveInfo = getOneTileMoveInfo(move);
  if (move.activePin.color !== activePlayer.color)
    return { oneTileMoveInfo, multiTileMoveInfo: null, isLegal: false };

  const multiTileMoveInfo = oneTileMoveInfo.isOneTileMove
    ? null
    : getCaptureInfo(move);

  return {
    oneTileMoveInfo,
    multiTileMoveInfo,
    isLegal: multiTileMoveInfo?.isLegal || oneTileMoveInfo.isLegal,
  };
};
