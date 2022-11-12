import { useSelector } from "react-redux";
import { RootState } from "../../../state/store";
import Field from "../Field/Field";
import BoardBox from "./BoardBox";

const Board = () => {
  const fields = useSelector((state: RootState) => state.board.fields);
  const fieldsEls = fields.map((f, i) => <Field key={i} f={f} />);
  const boardWidth = Math.sqrt(fields.length);
  return <BoardBox boardWidth={boardWidth}>{fieldsEls}</BoardBox>;
};

export default Board;
