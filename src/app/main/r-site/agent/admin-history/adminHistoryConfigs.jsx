import { lazy } from "react";

const TransactionHistoryApp = lazy(() => import("./adminHistoryApp"));

const TransactionHistoryConfigs = {
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: "/agent/adminHistory",
      element: <TransactionHistoryApp />,
    },
  ],
};

export default TransactionHistoryConfigs;
