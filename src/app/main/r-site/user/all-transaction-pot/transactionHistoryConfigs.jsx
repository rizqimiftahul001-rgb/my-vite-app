import { lazy } from "react";

const AllTransactionHistoryApp = lazy(() => import("./transactionHistoryApp"));

const AllTransactionHistoryConfigs = {
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: "/all/transactionHistory",
      element: <AllTransactionHistoryApp />,
    },
  ],
};

export default AllTransactionHistoryConfigs;
