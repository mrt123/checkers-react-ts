import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../state/store";
import { isAtSameLocation } from "../Board/boardApi/position";
import {
  MOVE_PIN_TO_FIELD,
  SET_ACTIVE_PIN,
  SET_HIGHEST_YIELDING_JUMPS,
  TRY_HIGLIGHT_FIELD,
  UNSET_HIGHLIGHT_FIELD,
} from "../Board/state/boardActions";
import { Field as FieldType } from "../Board/state/boardStateTypes";
import FieldBox from "./FieldBox";
import FieldCoordinateOverlay from "./FieldCoordinateOverlay";
import useAnimatedPin from "./useAnimatedPin";

interface FieldProps {
  f: FieldType;
}

const moveSound = new Audio("./sounds/amusnd.wav");
const wrongDropSound = new Audio("./sounds/lara_no.wav");
wrongDropSound.volume = 0.07;

const Field = ({ f }: FieldProps) => {
  const dispatch = useDispatch();
  const { activePin } = useSelector((state: RootState) => state.board);

  const debugCoordinatesSwitch = useSelector(
    (state: RootState) => state.debugSwitches.fieldsCoordinates
  );

  const onMouseUp = () => {
    if (f.highlighted) {
      moveSound.play();
      dispatch({ type: MOVE_PIN_TO_FIELD, pin: activePin, field: f });
    } else {
      const pinIsDroppedOnStartField = isAtSameLocation(activePin, f.pin);
      if (!pinIsDroppedOnStartField) {
        wrongDropSound.play();
        dispatch({ type: SET_HIGHEST_YIELDING_JUMPS, value: true });
      }
    }
    dispatch({ type: SET_ACTIVE_PIN, pin: null }); // can't do it in Pin.tsx, since activePin is needed to MOVE_PIN_TO_FIELD
  };

  const img = f.color === "white" ? "./white.jpg" : "./black.jpg";

  const coordinateOverlay = debugCoordinatesSwitch ? (
    <FieldCoordinateOverlay position={f.position} />
  ) : null;

  const handleImageLoaded = (e) => {
    console.log(e); // this is not called, find a better way to detect image load
  };

  const handleMouseLeave = () => {
    if (f.highlighted) dispatch({ type: UNSET_HIGHLIGHT_FIELD, f });
  };

  const pinEl = useAnimatedPin(f);

  if (f.position.x === 9 && f.position.y === 4) console.log(f);

  return (
    <FieldBox
      color={f.color}
      img={img}
      highlight={f.highlighted}
      onMouseEnter={() =>
        activePin && dispatch({ type: TRY_HIGLIGHT_FIELD, f })
      }
      onMouseLeave={handleMouseLeave}
      onMouseUp={onMouseUp}
      cursorIsPointer={!!activePin}
      onLoad={handleImageLoaded}
    >
      {coordinateOverlay}
      {pinEl}
    </FieldBox>
  );
};

export default Field;
