import { io } from "socket.io-client";

export default function useSocket() {
  let socket = io("ws://localhost:3000");

  return socket;
}
