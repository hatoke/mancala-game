import { Server } from "socket.io";
import hash from "./hashString.js";

let lobbylist = {};
let playerList = {};

const io = new Server(3000, {
  cors: {
    origin: true,
  },
});

function removeLobby(lobbyId) {
  delete lobbylist[lobbyId];
}

function decreasePlayerCount(lobbyId) {
  if (lobbylist[lobbyId] && lobbylist[lobbyId].lobbyPlayerCount - 1 >= 0) {
    lobbylist[lobbyId].lobbyPlayerCount -= 1;
  } else if (lobbylist[lobbyId] && lobbylist[lobbyId].lobbyPlayerCount - 1 <= -1) {
    removeLobby();
  }
  io.to("lobbyRoom").emit("lobbyList", { ...lobbylist });
}

io.on("connection", (socket) => {
  const socketId = socket.id;
  playerList[socketId] = "";
  console.log(`${socket.id} connected`);

  socket.on("gameEvent", (...args) => {
    const { id, pocketDetails } = args[0];
    const { opponentsPocket, playerPits, opponentsPits, playerPocket } = pocketDetails;
    console.log("player list is ", playerList);
    const nextPlayer = Object.keys(playerList).filter((key, index) => {
      if (playerList[key] == id && socket.id !== key) {
        return key;
      }
    });
    const reSendEvent = {
      opponentsPocket: playerPocket,
      playerPocket: opponentsPocket,
      playerPits: opponentsPits,
      opponentsPits: playerPits,
    };
    io.to(nextPlayer).emit("gameEvent", { board: reSendEvent });
  });

  socket.on("createLobby", async (...args) => {
    const { lobbyName, lobbyPassword } = args[0];
    const id = hash.hashString(`${lobbyName},${Date.now()}`);
    if (!lobbylist[id]) {
      const newLobby = {
        id,
        lobbyName,
        lobbyPassword,
        lobbyStatus: lobbyPassword ? "PRIVATE" : "PUBLIC",
        lobbyPlayerCount: 0,
      };
      lobbylist[newLobby.id] = newLobby;
      socket.emit("enterLobby", { status: true, id });
      io.to("lobbyRoom").emit("lobbyList", { ...lobbylist });
    } else {
      socket.emit("enterLobby", { status: false });
    }
  });

  socket.on("lobbyJoin", (...args) => {
    const { id } = args[0];
    if (lobbylist[id] && lobbylist[id].lobbyPlayerCount < 2) {
      lobbylist[id].lobbyPlayerCount += 1;
      if (lobbylist[id].lobbyPlayerCount == 2) {
        io.to(socket.id).emit("gameEvent", { activePlayer: "OPPONENT", board: false });
      }
      socket.join(id);
      playerList[socket.id] = id;
      io.to("lobbyRoom").emit("lobbyList", { ...lobbylist });
      io.to(id).emit("userJoined", { status: true, message: "player joined to lobby", socketId });
    } else {
      socket.emit("userJoined", { status: false, message: "lobby not found" });
    }
  });

  socket.on("lobbyRoom", () => {
    socket.join("lobbyRoom");
    io.to("lobbyRoom").emit("lobbyList", { ...lobbylist });
  });

  socket.on("lobbyList", (...args) => {
    io.to(socketId).emit(lobbylist);
  });

  socket.on("leaveLobby", (...args) => {
    const { lobbyName } = args[0];
    decreasePlayerCount(lobbyName);
    socket.leave(lobbyName);
  });

  socket.on("disconnect", () => {
    const socketId = socket.id;
    const lobbyId = playerList[socketId];
    decreasePlayerCount(lobbyId);
  });
});
