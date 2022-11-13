import { useSelector } from "react-redux";
import styled from "styled-components";
import { RootState } from "../../state/store";
import PlayerColorIndicatorContainer from "./Pin/PlayerColorIndicator";

const PlayerStatusContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 15px;
  padding: 10px;
`;

const InfoText = styled.div`
  margin: 10px;
`;

const PlayerStatus = () => {
  const gameStatus = useSelector((state: RootState) => state.board.gameStatus);

  const activePlayer = useSelector(
    (state: RootState) => state.board.activePlayer
  );

  const playerInfoText = gameStatus.gameOver ? "wins" : "next";

  return (
    <PlayerStatusContainer>
      <PlayerColorIndicatorContainer color={activePlayer.color} animatePulse />
      <InfoText>{playerInfoText}</InfoText>
    </PlayerStatusContainer>
  );
};

export default PlayerStatus;
