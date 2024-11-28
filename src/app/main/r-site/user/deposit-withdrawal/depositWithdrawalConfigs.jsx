import { lazy } from "react";

const DepositWithdrawalApp = lazy(() => import("./depositWithdrawalApp"));

const DepositWithdrawalConfigs = {
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: "/user/depositWithdrawal",
      element: <DepositWithdrawalApp />,
    },
  ],
};

export default DepositWithdrawalConfigs;
