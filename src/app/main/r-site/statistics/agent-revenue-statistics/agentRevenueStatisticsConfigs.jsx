import { lazy } from "react";

const AgentRevenueStatisticsApp = lazy(() =>
  import("./agentRevenueStatisticsApp")
);

const agentRevenueStatisticsConfigs = {
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: "/statistics/agentRevenueStatistics",
      element: <AgentRevenueStatisticsApp />,
    },
  ],
};

export default agentRevenueStatisticsConfigs;
