import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../state/store";
import {
  MOVE_PIN_TO_FIELD,
  SET_ACTIVE_PIN,
  TRY_HIGLIGHT_FIELD,
  UNSET_HIGHLIGHT_FIELD,
} from "../Board/state/boardActions";
import { Field as FieldType } from "../Board/state/boardStateTypes";
import Pin from "../Pin/Pin";
import FieldBox from "./FieldBox";
import FieldCoordinateOverlay from "./FieldCoordinateOverlay";

interface FieldProps {
  f: FieldType;
}

const moveSound = new Audio("/sounds/amusnd.wav");
const wrongDropSound = new Audio("/sounds/lara_no.wav");
wrongDropSound.volume = 0.07;

const Field = ({ f }: FieldProps) => {
  const dispatch = useDispatch();
  const activePin = useSelector((state: RootState) => state.board.activePin);
  const debugCoordinatesSwitch = useSelector(
    (state: RootState) => state.debugSwitches.fieldsCoordinates
  );

  const onMouseUp = () => {
    if (f.highlighted) {
      moveSound.play();
      dispatch({ type: MOVE_PIN_TO_FIELD, pin: activePin, field: f });
    } else {
      if (activePin && f.pin !== activePin) wrongDropSound.play();
    }
    dispatch({ type: SET_ACTIVE_PIN, pin: null }); // can't do it in Pin.tsx, since activePin is needed to MOVE_PIN_TO_FIELD
  };

  const img = f.color === "white" ? "white.jpg" : "black.jpg";
  const pinEL = f.pin === null ? null : <Pin config={f.pin} />;
  const coordinateOverlay = debugCoordinatesSwitch ? (
    <FieldCoordinateOverlay position={f.position} />
  ) : null;

  return (
    <FieldBox
      img={img}
      highlight={f.highlighted}
      onMouseEnter={() =>
        activePin && dispatch({ type: TRY_HIGLIGHT_FIELD, f })
      }
      onMouseLeave={() => dispatch({ type: UNSET_HIGHLIGHT_FIELD, f })}
      onMouseUp={onMouseUp}
      cursorIsPointer={!!activePin}
    >
      {coordinateOverlay}
      {pinEL}
    </FieldBox>
  );
};

export default Field;
