import { useNavigate } from "react-router-dom";
import '../assets/style/components/LobbyItem.scss'

function LobbyItem(props) {
  const { id, name, status } = props;
  const navigate = useNavigate();

  const navigateLobby = () => {
    navigate(`/mancala/${id}`);
  };

  const statusElement = () => {
    return (
      <div>
        <span>{status}</span>
      </div>
    );
  };

  return (
    <div className="lobby-item" onClick={navigateLobby}>
      <h1>{name}</h1>
      {statusElement()}
    </div>
  );
}

export default LobbyItem;
