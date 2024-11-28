import { lazy } from "react";

const GameManagementApp = lazy(() => import("./GameManagementApp"));

const GameManagementConfigs = {
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: "/gamemanagement",
      element: <GameManagementApp />,
    },
  ],
};

export default GameManagementConfigs;
