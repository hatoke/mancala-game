import { Server } from "socket.io";

const io = new Server(3000, {
  cors: {
    origin: true,
  },
});

io.on("connection", (socket) => {
  console.log(socket.id + "   " + new Date());
});
