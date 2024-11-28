import { lazy } from "react";

const TransactionHistoryApp = lazy(() => import("./transactionHistoryApp"));

const TransactionHistoryConfigs = {
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: "/agent/transactionHistory",
      element: <TransactionHistoryApp />,
    },
  ],
};

export default TransactionHistoryConfigs;
