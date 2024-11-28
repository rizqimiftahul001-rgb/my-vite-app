import { lazy } from "react";

const AllAgentRevenueStatisticsApp = lazy(() =>
  import("./allAgentRevenueStatisticsApp")
);

const allAgentRevenueStatisticsConfigs = {
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: "/statistics/all-agentRevenueStatistics",
      element: <AllAgentRevenueStatisticsApp />,
    },
  ],
};

export default allAgentRevenueStatisticsConfigs;
