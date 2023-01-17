import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Pocket from "../components/Pocket";
import "../assets/style/mancala.scss";

function RenderPocket({ pocket, clickEvent }) {
  const sendMouseEvent = (index, eventType) => {
    console.log(`${index}th pocket mouse ${eventType} event`);
  };

  return pocket.map((item, index) => {
    return (
      <div
        key={index}
        onMouseEnter={() => {
          sendMouseEvent(index, 'ENTER');
        }}
        onMouseLeave={() => {
          sendMouseEvent(index, 'LEAVE');
        }}
      >
        <Pocket stone={item.stone} clickEvent={clickEvent} />
      </div>
    );
  });
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
  const [activePlayer, setActivePlayer] = useState("PLAYER");

  const pocketClick = () => {
    const player = {
      PLAYER: "OPPONENT",
      OPPONENT: "PLAYER",
    };
    console.log("new active player is ", player[activePlayer]);
    setActivePlayer(player[activePlayer]);
  };

  const copyInviteLink = () => {
    navigator.clipboard.writeText(`http://localhost:5173/mancala/${id}`);
  };

  const activeSideClass = (side) => {
    return activePlayer === side && "active-side";
  };

  return (
    <div className="mancala-game">
      <span>Mancala</span>
      <div className="invite-link" onClick={copyInviteLink} href="http://localhost:5173/mancala/2">
        <h1>/mancala/2</h1>
      </div>
      <small>invite friend</small>
      <div className="board">
        <div className="opponents-pit">
          <Pocket stone={pocketDetails.opponentsPocket.stone} />
        </div>
        <div className="pit-wrapper">
          <div className={`opponents-pockets ${activeSideClass("OPPONENT")}`}>
            <RenderPocket pocket={pocketDetails.opponentsPits} />
          </div>
          <div className={`player-pockets ${activeSideClass("PLAYER")}`}>
            <RenderPocket pocket={pocketDetails.playerPits} clickEvent={pocketClick} />
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
