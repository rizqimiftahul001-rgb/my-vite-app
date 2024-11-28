import { lazy } from "react";

const BetHistoryApp = lazy(() => import("./betHistoryApp"));

const BetHistoryConfigs = {
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: "/user/betHistory",
      element: <BetHistoryApp />,
    },
  ],
};

export default BetHistoryConfigs;
