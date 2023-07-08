import React, { useContext, useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { SocketContext, socket } from "./context/socket.context";
import router from "./router/index";

import "./assets/style/index.scss";
import Modal from "./components/Modal";

function HowToPlay() {
  const [rulesModal, setRulesModal] = useState({
    show: false,
    overlay: true,
  });

  const modalShowToggle = () => {
    setRulesModal((modal) => ({ ...modal, show: !modal.show }));
  };

  return (
    <>
      <Modal show={rulesModal.show} setShow={modalShowToggle} overlay={rulesModal.overlay}>
        <h1>How To Play</h1>
        <p className="block mb-15">Mancala is a two-player stone game played with a board and various numbers of stones. The objective of the game is to collect more stones than your opponent.</p>
        <ul className="mb-15">
          <li>Set up the game board: Place the game board between the two players and put four stones in each of the six pits on either side of the board.</li>
          <li>Determine who goes first: The players can flip a coin, or the player who goes first can be determined by mutual agreement.</li>
          <li>Begin the game: The first player picks up all the stones in one of their pits and sows them one by one into each pit around the board in a counter-clockwise direction. If the player drops the last stone in their opponent's pit, they get another turn.</li>
          <li>Capturing stones: If the last stone lands in an empty pit on the player's side, the player captures all the stones in the opposite pit and adds them to their store (the larger pit at the end of the row on their side). If the opposite pit is also empty, the turn ends.</li>
          <li>Keep playing: The players take turns picking up stones and sowing them until one player has no stones on their side of the board. The other player then places any remaining stones in their store.</li>
          <li>Determine the winner: The player who has the most stones in their store at the end of the game wins.</li>
        </ul>
        <p>Mancala is a simple game to learn, but it requires strategy and planning to win. Have fun playing!</p>
      </Modal>
      <div className="how-to-play" onClick={modalShowToggle}>
        <span>How to Play?</span>
      </div>
    </>
  );
}

function PlayerCount() {
  const socket = useContext(SocketContext);
  const [playerCount, setPlayerCount] = useState(0);

  useEffect(() => {
    socket.on("playerCount", (args) => {
      const { count } = args;
      setPlayerCount(count);
      console.log("player count is ", count);
    });
  });

  return (
    <>
      <div className="game-player-count">
        <span>Idle Player: {playerCount}</span>
        <span>In-Game Player: 0</span>
        {/* //TODO seperate player count */}
        <span>Total Player: {playerCount + 0}</span>
      </div>
    </>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <SocketContext.Provider value={socket}>
    <PlayerCount />
    <HowToPlay />
    <RouterProvider router={router} />
  </SocketContext.Provider>
);
