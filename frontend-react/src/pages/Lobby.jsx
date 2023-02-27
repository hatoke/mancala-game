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
  const [modalOptions, setModalOptions] = useState({
    show: false,
    overlay: false,
  });
  const [lobbyList, setLobbyList] = useState({});
  const [lobby, setLobby] = useState({ lobbyName: "", lobbyStatus: "PUBLIC", lobbyPassword: "" });
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

  const setLobbyForm = (event, element) => {
    const formElement = {};
    formElement[element] = event.target.value;
    setLobby((prevState) => ({
      ...prevState,
      ...formElement,
    }));
  };

  const createLobby = () => {
    // TODO maybe need refactor with input validation lib
    if (lobby.lobbyName.length > 3) {
      if (lobby.lobbyStatus === "PUBLIC") {
        socket.emit("createLobby", lobby);
      } else if (lobby.lobbyStatus === "PRIVATE") {
        if (lobby.lobbyPassword.length > 3) {
          socket.emit("createLobby", lobby);
        } else {
          alert("Lobby password cannot be shorter than 3 characters");
        }
      }
    } else {
      alert("Lobby name cannot be shorter than 3 characters");
    }
  };

  const modalShowToggle = () => {
    setModalOptions((modal) => ({ ...modal, show: !modal.show }));
  };

  return (
    <div className="lobbies">
      <Modal show={modalOptions.show} setShow={modalShowToggle} headText={modalOptions.headText}>
        <div className="lobby-form">
          <div className="form-item mb-10">
            <span className="mb-5">Lobby Status</span>
            <div>
              <label htmlFor="public" className="mr-30">
                <input name="lobbyStatus" checked={lobby.lobbyStatus === "PUBLIC"} value={"PUBLIC"} id="public" type="radio" onChange={(e) => setLobbyForm(e, "lobbyStatus")} />
                <span>Public</span>
              </label>
              <label htmlFor="private">
                <input name="lobbyStatus" value={"PRIVATE"} id="private" type="radio" onChange={(e) => setLobbyForm(e, "lobbyStatus")} />
                <span>Private</span>
              </label>
            </div>
          </div>
          <div className="form-item">
            <span>Lobby Name</span>
            <input type="text" onChange={(e) => setLobbyForm(e, "lobbyName")} />
          </div>
          {lobby.lobbyStatus === "PRIVATE" && (
            <>
              <div className="form-item">
                <span>Lobby Password</span>
                <input type="password" onChange={(e) => setLobbyForm(e, "lobbyPassword")} />
              </div>
            </>
          )}
          <div className="btn btn-orange w-100" onClick={() => createLobby()}>
            <span>Create New Lobby</span>
          </div>
        </div>
      </Modal>
      <div className="flex-col a-items-center j-content-center">
        <div className="flex a-items-center">
          <div className="mr-40">
            <h1>Lobies</h1>
          </div>
          <div className="btn btn-orange" onClick={modalShowToggle}>
            Create New Lobby
          </div>
        </div>
        <div className="lobby-list">
          <RenderLobbyList lobbyList={lobbyList} />
        </div>
      </div>
    </div>
  );
}

export default Lobby;
