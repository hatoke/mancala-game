import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Modal from "../components/Modal";
import { SocketContext } from "../context/socket.context";
import LobbyItem from "../components/LobbyItem";
import "../assets/style/Lobby.scss";

function RenderLobbyList({ lobbyList }) {
  if (Object.keys(lobbyList).length > 0) {
    return Object.keys(lobbyList).map((lobby, index) => {
      return <LobbyItem key={index} lobby={lobbyList[lobby]} />;
    });
  }
}

function Lobby() {
  const socket = useContext(SocketContext);
  const [lobbyList, setLobbyList] = useState({});
  const [lobby, setLobby] = useState({ lobbyName: "" });
  const navigate = useNavigate();

  useEffect(() => {
    socket.emit("lobbyRoom");

    socket.on("lobbyList", (args) => {
      setLobbyList({ ...args });
    });

    socket.on("enterLobby", (args) => {
      const { status, id } = args;
      if (status) {
        navigate(`/mancala/${args.id}`);
      }
    });
  }, []);

  const createLobby = () => {
    socket.emit("createLobby", lobby);
  };

  return (
    <div className="lobbies">
      <h1>Lobby List</h1>
      <div>
        <input
          type="text"
          onChange={(e) => {
            setLobby((current) => {
              return {
                lobbyName: e.target.value,
              };
            });
          }}
        />
        <button onClick={createLobby}>Yeni Lobi Oluştur</button>
      </div>
      <div className="lobby-list">
        <RenderLobbyList lobbyList={lobbyList} />
      </div>
    </div>
  );
}

export default Lobby;
