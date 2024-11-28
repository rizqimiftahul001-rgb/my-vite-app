import { lazy } from "react";

const SubAgentRevenueStatisticsApp = lazy(() =>
  import("./subAgentRevenueStatisticsApp")
);

const subAgentRevenueStatisticsConfigs = {
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: "/statistics/sub-agentRevenueStatistics",
      element: <SubAgentRevenueStatisticsApp />,
    },
  ],
};

export default subAgentRevenueStatisticsConfigs;
