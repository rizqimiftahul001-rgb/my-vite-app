import { lazy } from "react";

const DepositHistoryApp = lazy(() => import("./depositHistoryApp"));

const DepositHistoryConfigs = {
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: "/pot-charging-despensing/withdrawHistory",
      element: <DepositHistoryApp />,
    },
  ],
};

export default DepositHistoryConfigs;
