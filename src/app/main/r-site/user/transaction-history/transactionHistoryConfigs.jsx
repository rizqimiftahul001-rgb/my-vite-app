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
      path: "/user/transactionHistory",
      element: <TransactionHistoryApp />,
    },
  ],
};

export default TransactionHistoryConfigs;
