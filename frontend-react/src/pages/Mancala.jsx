import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { SocketContext } from "../context/socket.context";
import { useParams } from "react-router-dom";
import Pocket from "../components/Pocket";
import "../assets/style/mancala.scss";

function Mancala() {
  const { id } = useParams();
  const navigate = useNavigate();
  const socket = useContext(SocketContext);

  const [lobbyConnection, setLobbyConnection] = useState(false);
  const [prediction, setPrediction] = useState({});
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

  useEffect(() => {
    socket.emit("lobbyJoin", { id });
    socket.on("userJoined", ({ status, message, socketId }) => {
      if (!status) {
        alert("Lobi dolu");
        navigate("/");
      } else {
        setLobbyConnection(true);
      }
    });
    socket.on("gameEvent", ({ activePlayer, board }) => {
      if (board) {
        setPocket(board);
      }
      setActivePlayer(activePlayer);
    });
    return () => leavePage();
  }, [id]);

  const pocketClick = (index, stone) => {
    const player = {
      PLAYER: "OPPONENT",
      OPPONENT: "PLAYER",
    };

    if (activePlayer === "PLAYER") {
      let totalStep = index + (stone - 1);
      let stoneCount = stone;

      if (totalStep > 1) {
        pocketDetails.playerPits[index].stone = 1;
        stoneCount--;
        let playerPocket = pocketDetails.playerPocket;
        let opponentsPocket = pocketDetails.opponentsPocket;
        let playerPits = pocketDetails.playerPits.slice(index + 1);
        let opponentPits = pocketDetails.opponentsPits;

        playerPits.forEach((pit, index) => {
          if (stoneCount >= 1) {
            playerPits[index].stone = pit.stone + 1;
            stoneCount--;
          }
        });

        if (stoneCount >= 1) {
          playerPocket.stone++;
          stoneCount--;
        }

        opponentPits.forEach((pit, index) => {
          if (stoneCount >= 1) {
            opponentPits[index].stone = pit.stone + 1;
            stoneCount--;
          }
        });

        opponentPits.reverse();

        if (stoneCount >= 1) {
          opponentsPocket.stone++;
          stoneCount--;
        }

        socket.emit("gameEvent", { id, pocketDetails });
      }
    }
    setActivePlayer(player[activePlayer]);
  };

  const copyInviteLink = () => {
    navigator.clipboard.writeText(`http://localhost:5173/mancala/${id}`);
  };

  const activeSideClass = (side) => {
    return activePlayer === side && "active-side";
  };

  const leavePage = () => {
    const confirm = window.confirm("Do you want leave game?");
    if (confirm && lobbyConnection) {
      socket.emit("leaveLobby", { lobbyName: id });
    }
  };

  const leaveLobby = () => {
    setLobbyConnection(false);
    socket.emit("leaveLobby", { lobbyName: id });
    navigate("/");
  };

  const renderPocket = ({ side, pocket, clickEvent }) => {
    const sendMouseEvent = (index, stone, eventType) => {
      if (eventType == "LEAVE") {
        clearSelection();
      }

      if (eventType == "ENTER") {
        findMoveForward(index, stone);
      }
    };

    const findMoveForward = (index, stone) => {
      if (side === "PLAYER") {
      }
    };

    const clearSelection = () => {
      setPrediction({});
    };

    return pocket.map((item, index) => {
      return (
        <div
          key={index}
          onMouseEnter={() => {
            sendMouseEvent(index, item.stone, "ENTER");
          }}
          onMouseLeave={() => {
            sendMouseEvent(index, item.stone, "LEAVE");
          }}
        >
          <Pocket
            stone={item.stone}
            clickEvent={() => {
              clickEvent(index, item.stone);
            }}
          />
        </div>
      );
    });
  };

  return (
    <div className="mancala-game">
      <span>Mancala</span>
      <div className="invite-link" onClick={copyInviteLink} href="http://localhost:5173/mancala/2">
        <h1>/mancala/2</h1>
      </div>
      <small>invite friend</small>
      <button onClick={leaveLobby}>Leave Game</button>
      <div className="board">
        <div className="opponents-pit">
          <Pocket stone={pocketDetails.opponentsPocket.stone} />
        </div>
        <div className="pit-wrapper">
          <div className={`opponents-pockets ${activeSideClass("OPPONENT")}`}>{renderPocket({ side: "OPPONENT", pocket: pocketDetails.opponentsPits })}</div>
          <div className={`player-pockets ${activeSideClass("PLAYER")}`}>{renderPocket({ side: "PLAYER", pocket: pocketDetails.playerPits, clickEvent: pocketClick })}</div>
        </div>
        <div className="player-pit">
          <Pocket stone={pocketDetails.playerPocket.stone} />
        </div>
      </div>
    </div>
  );
}

export default Mancala;
