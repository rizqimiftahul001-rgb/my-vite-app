import { lazy } from "react";


const InvesDetailsApp = lazy(() => import("./InvesDetailsApp"));

const InvestDetailsConfigs = {
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: '/investaccountdetails',
      element: <InvesDetailsApp />,
    },
  ],
};

export default InvestDetailsConfigs;
