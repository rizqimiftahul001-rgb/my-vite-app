import { lazy } from "react";

const StatisticsByGameApp = lazy(() => import("./statisticsByGameApp"));

const statisticsByGameConfigs = {
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: "/statistics/statisticsByGame",
      element: <StatisticsByGameApp />,
    },
  ],
};

export default statisticsByGameConfigs;
