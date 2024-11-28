import { lazy } from "react";

const WinManagementApp = lazy(() => import("./userLimitApp"));

const userLimitManagementConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: "/user-bet-limit",
      element: <WinManagementApp />,
    },
  ],
};

export default userLimitManagementConfig;
