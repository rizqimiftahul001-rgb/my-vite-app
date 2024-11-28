import { lazy } from "react";
import GGRReport from "./GGRReport/GGRReport";
import ApiErrorLogAppSC from "./api-error-log/apiErrorLogScApp";

const TransactionHistoryApp = lazy(() => import("./adminGGRLimit"));

const AdminManagementConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: "/agent/balance-limits",
      element: <TransactionHistoryApp />,
    },

    {
      path: "/agent/balance-limits/:id",
      element: <GGRReport />,
    },

    
    {
      path: "/agent/api-errors",
      element: <ApiErrorLogAppSC />,
    },
    
  ],
};

export default AdminManagementConfig;
