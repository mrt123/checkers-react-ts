import FormGroup from "@mui/material/FormGroup";
import { useSelector } from "react-redux";
import styled from "styled-components";
import { RootState } from "../../state/store";
import Board from "../game/Board/Board";
import { Field } from "../game/Board/state/boardStateTypes";
import MoveHistory from "../game/MoveHistory/MoveHistory";
import PlayerColorIndicator from "../game/Pin/PlayerColorIndicator";
import DebugSwitch from "../general/DebugSwitch";
import AppVersion from "./AppVersion";

const AppContainer = styled.div`
   {
    display: flex;
    justify-content: space-evenly;
    background-color: #282c34;
    min-height: 100vh;
    font-size: calc(10px + 2vmin);
    color: white;
    padding-top: 30px;
  }
`;

const InfoIcon = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 15px;
  padding: 10px;
`;

const InfoText = styled.div`
  margin: 10px;
`;

const App = () => {
  const board = useSelector((state: RootState) => state.board);

  const pinColorsLeft = board.fields.reduce(
    (accumulator: string[], field: Field) => {
      const pinColor = field.pin?.color;
      if (pinColor) {
        if (!accumulator.includes(pinColor)) accumulator.push(pinColor);
      }
      return accumulator;
    },
    []
  );

  const gameIsOver = pinColorsLeft.length === 1;
  const playerInfoColour = gameIsOver
    ? pinColorsLeft[0]
    : board.activePlayer.color;
  const playerInfoText = gameIsOver ? "wins" : "next";

  // TODO: when playing against computer, generate alll possible moves, and choose one randomly

  const isLocalshost = window.location.hostname === "localhost";
  const debuSwitches = !isLocalshost ? null : (
    <FormGroup>
      <DebugSwitch stateAttribute="reduxLogs" label="redux logs" />
      <DebugSwitch
        stateAttribute="fieldsCoordinates"
        label="fields coordinates"
      />
    </FormGroup>
  );

  return (
    <AppContainer>
      <div>
        <Board />
        <InfoIcon>
          <PlayerColorIndicator color={playerInfoColour} />
          <InfoText>{playerInfoText}</InfoText>
        </InfoIcon>
        <AppVersion />
      </div>
      <div>
        <MoveHistory />
        {debuSwitches}
      </div>
    </AppContainer>
  );
};

export default App;
