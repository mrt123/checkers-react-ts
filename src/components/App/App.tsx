import styled from "styled-components";
import Board from "../game/Board/Board";
import MoveHistory from "../game/MoveHistory/MoveHistory";
import PlayerStatus from "../game/PlayerStatus";
import AppVersion from "./AppVersion";
import DebugSwitches from "./DebugSwitches";

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

const App = () => {
  // TODO: when playing against computer, generate alll possible moves, and choose one randomly

  const isLocalshost = window.location.hostname === "localhost";
  const debuSwitches = !isLocalshost ? null : <DebugSwitches />;

  return (
    <AppContainer>
      <div>
        <Board />
        <PlayerStatus />
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
