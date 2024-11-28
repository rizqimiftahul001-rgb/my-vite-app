import { lazy } from "react";

const UserRevenueStatisticsApp = lazy(() =>
  import("./userRevenueStatisticsApp")
);

const userRevenueStatisticsConfigs = {
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: "/statistics/userRevenueStatistics",
      element: <UserRevenueStatisticsApp />,
    },
  ],
};

export default userRevenueStatisticsConfigs;
