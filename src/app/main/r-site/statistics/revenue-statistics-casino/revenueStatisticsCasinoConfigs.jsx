import { lazy } from "react";

const RevenueStatisticsCasinoApp = lazy(() =>
  import("./revenueStatisticsCasinoApp")
);

const revenueStatisticsCasinoConfigs = {
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: "/statistics/revenueStatisticsCasino",
      element: <RevenueStatisticsCasinoApp />,
    },
  ],
};

export default revenueStatisticsCasinoConfigs;
