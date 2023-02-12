import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { SocketContext, socket } from "./context/socket.context";
import router from "./router/index";

import "./assets/style/index.scss";

ReactDOM.createRoot(document.getElementById("root")).render(
  <SocketContext.Provider value={socket}>
    <RouterProvider router={router} />
  </SocketContext.Provider>
);
