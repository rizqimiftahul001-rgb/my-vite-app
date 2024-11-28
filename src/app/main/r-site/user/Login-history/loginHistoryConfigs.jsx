import { lazy } from "react";

const TransactionHistoryApp = lazy(() => import("./loginHistoryApp"));

const TransactionHistoryConfigs = {
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: "/login-history",
      element: <TransactionHistoryApp />,
    },
  ],
};

export default TransactionHistoryConfigs;
