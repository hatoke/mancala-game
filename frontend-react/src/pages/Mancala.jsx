import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { SocketContext } from "../context/socket.context";
import { useParams } from "react-router-dom";
import Pocket from "../components/Pocket";
import Modal from "../components/Modal";
import "../assets/style/mancala.scss";

function PasswordModal({ id, lobbyStatus }) {
  const socket = useContext(SocketContext);
  const [lobbyPassword, setLobbyPassword] = useState("");  
  const [modalOptions, setModalOptions] = useState({
    show: lobbyStatus,
    overlay: false,
  });

  useEffect(() => {
    setModalOptions((state) => ({ ...state, show: lobbyStatus }));
  }, [lobbyStatus]);

  const modalShowToggle = () => {
    setModalOptions((modal) => ({ ...modal, show: !modal.show }));
  };

  const lobbyJoin = () => {
    if (lobbyPassword.length > 0) {
      socket.emit("lobbyJoin", { id, password: lobbyPassword });
    } else {
      alert("Password cannot be empty");
    }
  };

  return (
    <Modal show={modalOptions.show} overlay={modalOptions.overlay} setShow={modalShowToggle} headText={modalOptions.headText}>
      <div className="lobby-form">
        <div className="form-item">
          <span>Lobby Password</span>
          <input className="lobby-password" type="text" onChange={(e) => setLobbyPassword(e.target.value)} />
        </div>
        <div className="btn btn-orange w-100" onClick={() => lobbyJoin()}>
          <span>Join Lobby</span>
        </div>
      </div>
    </Modal>
  );
}

function Mancala() {
  const { id } = useParams();
  const navigate = useNavigate();
  const socket = useContext(SocketContext);

  const [lobbyStatus, setLobbyStatus] = useState(false);
  const [lobbyConnection, setLobbyConnection] = useState(false);
  const [playersReady, setPlayerReady] = useState(false);
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
    socket.on("userJoined", ({ status, statusCode, message }) => {
      const wrongPass = () => {
        alert("Password wrong, please try again");
      };
      const statusList = {
        200: () => {
          setLobbyStatus(false);
          setLobbyConnection(true);
        },
        403: () => {
          if (lobbyStatus) {
            wrongPass();
          }
          setLobbyStatus(true);
        },
        404: () => {
          alert("Loby not found");
          navigate("/");
        },
      };
      if (statusList[statusCode]) {
        statusList[statusCode]();
      } else {
        alert("Something went wrong but idk");
      }
    });
    socket.on("gameEvent", ({ activePlayer, board }) => {
      if (board) {
        console.log("boar is ", board);
        setPocket(board);
      }
      if (activePlayer) {
        console.log("active player is ", activePlayer);
        setActivePlayer(activePlayer);
      }
    });
    return () => leavePage();
  }, [id]);

  const pocketClick = (index, stone) => {
    const player = {
      PLAYER: "OPPONENT",
      OPPONENT: "PLAYER",
    };

    if (activePlayer === "PLAYER" && playersReady) {
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
    // TODO mouseOver tint
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
      <PasswordModal id={id} lobbyStatus={lobbyStatus} />
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
