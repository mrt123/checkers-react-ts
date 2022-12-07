import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import { RootState } from "../../../state/store";
import MoveRecord from "./MoveRecord";

const MoveHistoryBox = styled.div`
  width: 180px;
  height: 600px;
  overflow-y: scroll;
`;

const MoveHistory = () => {
  const moveHistory = useSelector(
    (state: RootState) => state.board.moveHistory
  );
  const moveRecords = moveHistory.map((r, i) => {
    return <MoveRecord key={i} record={r} />;
  });

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    if (messagesEndRef.current)
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [moveHistory]);

  return (
    <MoveHistoryBox>
      {moveRecords}
      <div ref={messagesEndRef} />
    </MoveHistoryBox>
  );
};

export default MoveHistory;
