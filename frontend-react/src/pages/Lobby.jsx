import { useState } from "react";
import "../assets/style/Lobby.scss";

import LobbyItem from "../components/LobbyItem";

function Lobby() {
  const [lobbyList, setLobbyList] = useState([
    {
      id: 1,
      name: "Lorem Ipsum Dolor",
      status: "private",
    },
    {
      id: 2,
      name: "Public Mancala Room",
      status: "public",
    },
  ]);

  const renderLobbyList = () => {
    return lobbyList.map((lobby, index) => {
      const { id, name, status } = lobby;
      return <LobbyItem key={index} id={id} name={name} status={status} />;
    });
  };

  return (
    <div className="lobbies">
      <span>Lobby</span>
      <div className="lobby-list">{renderLobbyList()}</div>
    </div>
  );
}

export default Lobby;