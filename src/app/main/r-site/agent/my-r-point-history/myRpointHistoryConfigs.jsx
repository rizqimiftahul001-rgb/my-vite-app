import { lazy } from "react";

const MyRpointHistoryApp = lazy(() => import("./myRpointHistoryApp"));

const myRpointHistoryConfigs = {
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: "/agent/MyRpointHistory",
      element: <MyRpointHistoryApp />,
    },
  ],
};

export default myRpointHistoryConfigs;
