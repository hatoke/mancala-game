import { useNavigate, Link } from "react-router-dom";
import "../assets/style/components/LobbyItem.scss";

function LobbyItem(props) {
  const { id, lobbyName, lobbyStatus, lobbyPlayerCount } = props.lobby;
  const navigate = useNavigate();

  const navigateLobby = () => {
    navigate(`/mancala/${id}`);
  };

  return (
    <Link className="lobby-item" to={`/mancala/${id}`}>
      <div onClick={navigateLobby}>
        <h1>{lobbyName}</h1>
        <div className="lobby-detail">
          <span>{lobbyStatus}</span>
          <span className={`player-count ${lobbyPlayerCount < 2 ? "active-player" : "passive-count"}`}>2 / {lobbyPlayerCount}</span>
        </div>
      </div>
    </Link>
  );
}

export default LobbyItem;
