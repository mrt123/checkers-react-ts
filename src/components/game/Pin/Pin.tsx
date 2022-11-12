import { useState } from "react";
import Draggable from "react-draggable";
import { useDispatch } from "react-redux";
import { SET_ACTIVE_PIN } from "../Board/state/boardActions";
import { Pin as PinType } from "../Board/state/boardStateTypes";
import PinBase from "./PinBase";
import PinFace from "./PinFace";

interface PinProps {
  config: PinType;
}

const Pin = ({ config }: PinProps) => {
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

  // NOTE: Below good example of kill animation
  // spinning = [
  //   { transform: "rotate(0) scale(1)" },
  //   { transform: "rotate(360deg) scale(0)" },
  // ];

  // spinTiming = {
  //   duration: 2000,
  //   iterations: 1,
  // };

  // el = document.querySelector(
  //   "#root > div > div > div.sc-eDvSVe.llPSnE > div:nth-child(47) > div"
  // );

  // el.animate(spinning, spinTiming);

  const tunedColor =
    config.color === "white" ? "rgb(222,222,222)" : config.color;

  return (
    <Draggable onStart={onDragStart} onStop={onDragEnd} position={dragPosition}>
      {/* Note: once element is dragged we disable its pointer events, so that other elements can receive mouse hover events */}
      <PinBase isDragged={isDragged} color={tunedColor}>
        <PinFace
          isDragged={isDragged}
          moveDirection={config.moveDirection}
          isKing={config.isKing}
        />
      </PinBase>
    </Draggable>
  );
};

export default Pin;
