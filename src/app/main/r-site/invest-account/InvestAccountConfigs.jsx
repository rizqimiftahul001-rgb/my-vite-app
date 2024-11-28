import { lazy } from "react";


const InvestAccountApp = lazy(() => import("./InvestAccountApp"));

const InvestAccountConfigs = {
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: '/investaccount',
      element: <InvestAccountApp />,
    },
  ],
};

export default InvestAccountConfigs;
