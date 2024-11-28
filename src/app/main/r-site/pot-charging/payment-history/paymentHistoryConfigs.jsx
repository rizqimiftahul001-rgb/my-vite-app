import { lazy } from "react";

const PaymentHistoryApp = lazy(() => import("./paymentHistoryApp"));

const PaymentHistoryConfigs = {
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: "/pot-charging-despensing/paymentHistory",
      element: <PaymentHistoryApp />,
    },
  ],
};

export default PaymentHistoryConfigs;
