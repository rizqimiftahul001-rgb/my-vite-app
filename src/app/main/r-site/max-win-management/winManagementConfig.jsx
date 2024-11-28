import { lazy } from "react";

const WinManagementApp = lazy(() => import("./winManagementApp"));

const winManagementConfigs = {
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: "/max-win-management",
      element: <WinManagementApp />,
    },
  ],
};

export default winManagementConfigs;
