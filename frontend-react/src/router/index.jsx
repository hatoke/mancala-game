import { createBrowserRouter } from "react-router-dom";

import Lobby from '../pages/Lobby'
import Mancala from '../pages/Mancala'

const router = createBrowserRouter([
  {
    path: "",
    element: <Lobby />,
  },
  {
    path: "/mancala/:id",
    element: <Mancala />,
  },
]);

export default router;
