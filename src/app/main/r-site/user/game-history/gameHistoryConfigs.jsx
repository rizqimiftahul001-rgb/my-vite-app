import { lazy } from "react";

const GameHistoryApp = lazy(() => import("./gameHistoryApp"));

const GameHistoryConfigs = {
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: "/user/gameHistory",
      element: <GameHistoryApp />,
    },
  ],
};

export default GameHistoryConfigs;
