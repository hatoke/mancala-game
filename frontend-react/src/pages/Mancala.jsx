import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Pocket from "../components/Pocket";
import "../assets/style/mancala.scss";

function RenderPocket({ pocket }) {
  return pocket.map((item, index) => <Pocket key={index} stone={item.stone} />);
}

function Mancala() {
  const { id } = useParams();
  const [pocketDetails, setPocket] = useState({
    opponentsPocket: {
      stone: 0,
    },
    playerPits: [
      {
        stone: 4,
      },
      {
        stone: 4,
      },
      {
        stone: 4,
      },
      {
        stone: 4,
      },
      {
        stone: 4,
      },
      {
        stone: 4,
      },
    ],
    opponentsPits: [
      {
        stone: 4,
      },
      {
        stone: 4,
      },
      {
        stone: 4,
      },
      {
        stone: 4,
      },
      {
        stone: 4,
      },
      {
        stone: 4,
      },
    ],
    playerPocket: {
      stone: 0,
    },
  });

  return (
    <div className="mancala-game">
      <span>Mancala</span>
      <a className="invite-link" href="http://localhost:5173/mancala/2"><h1>http://localhost:5173/mancala/2</h1></a>
      <small>invite friend</small>
      <div className="board">
        <div className="opponents-pit">
          <Pocket stone={pocketDetails.opponentsPocket.stone} />
        </div>
        <div className="pit-wrapper">
          <div className="opponents-pockets">
            <RenderPocket pocket={pocketDetails.opponentsPits} />
          </div>
          <div className="player-pockets">
            <RenderPocket pocket={pocketDetails.playerPits} />
          </div>
        </div>
        <div className="player-pit">
          <Pocket stone={pocketDetails.playerPocket.stone} />
        </div>
      </div>
    </div>
  );
}

export default Mancala;
