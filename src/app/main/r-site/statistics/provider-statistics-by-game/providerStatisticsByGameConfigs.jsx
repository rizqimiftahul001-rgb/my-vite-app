import { lazy } from "react";

const StatisticsByGameApp = lazy(() => import("./providerStatisticsByGameApp"));

const providerStatisticsByGameConfigs = {
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: "/statistics/providerStatisticsByGame",
      element: <StatisticsByGameApp />,
    },
  ],
};

export default providerStatisticsByGameConfigs;
