import { useState } from "react";
import Draggable from "react-draggable";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../state/store";
import { isAtSameLocation } from "../Board/boardApi/position";
import { SET_ACTIVE_PIN } from "../Board/state/boardActions";
import { Pin as PinType } from "../Board/state/boardStateTypes";
import PinBase from "./PinBase";
import PinFace from "./PinFace";

interface PinProps {
  config: PinType;
  animateKill?: boolean;
}

const Pin = ({ config, animateKill }: PinProps) => {
  const dispatch = useDispatch();
  const [isDragged, setIsDragged] = useState(false);
  const [dragPosition, setDragPosition] = useState({ x: 0, y: 0 });

  const onDragStart = () => {
    setIsDragged(true);
    dispatch({ type: SET_ACTIVE_PIN, pin: config });
  };

  const onDragEnd = () => {
    setIsDragged(false);
    setDragPosition({ x: 0, y: 0 });
  };

  const { lockedActivePin } = useSelector((state: RootState) => state.board);

  const pinIsLocked = isAtSameLocation(lockedActivePin, config);
  const shouldPulse = pinIsLocked && !isDragged;

  const tunedColor =
    config.color === "white" ? "rgb(222,222,222)" : config.color;

  return (
    <Draggable onStart={onDragStart} onStop={onDragEnd} position={dragPosition}>
      {/* Note: once element is dragged we disable its pointer events, so that other elements can receive mouse hover events */}
      <PinBase
        isDragged={isDragged}
        color={tunedColor}
        pulse={shouldPulse}
        animateKill={!!animateKill}
        shake={config.shake}
      >
        <PinFace
          showSkull={!!animateKill}
          isDragged={isDragged}
          moveDirection={config.moveDirection}
          isKing={config.isKing}
        />
      </PinBase>
    </Draggable>
  );
};

export default Pin;
