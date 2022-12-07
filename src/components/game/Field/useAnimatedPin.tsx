import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../state/store";
import { isAtSameLocation } from "../Board/boardApi/position";
import { SET_LAST_KILLED_PIN } from "../Board/state/boardActions";
import { Field } from "../Board/state/boardStateTypes";
import Pin from "../Pin/Pin";

const useAnimatedPin = (field: Field) => {
  const dispatch = useDispatch();
  const lastKilledPin = useSelector(
    (state: RootState) => state.board.lastKilledPin
  );

  if (field.position.x === 9 && field.position.y === 4) console.log(field);

  useEffect(() => {
    if (lastKilledPin && isAtSameLocation(lastKilledPin, field))
      setTimeout(
        () => dispatch({ type: SET_LAST_KILLED_PIN, pin: null }),
        900 // synchronized with kill animation
      );
  }, [lastKilledPin, dispatch, field]);

  const pinWithKillAnimation =
    lastKilledPin && isAtSameLocation(field, lastKilledPin) ? (
      <Pin config={lastKilledPin} animateKill />
    ) : null;

  // console.log({ killAnimatedPin }); figure out re-renders on SET_ACTIVE_PIN
  const pinEL =
    field.pin === null ? pinWithKillAnimation : <Pin config={field.pin} />;

  return pinEL;
};

export default useAnimatedPin;
