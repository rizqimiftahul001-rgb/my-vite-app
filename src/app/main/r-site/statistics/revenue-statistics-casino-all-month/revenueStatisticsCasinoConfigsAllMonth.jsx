import { lazy } from "react";

const RevenueStatisticsCasinoAppAllMonth = lazy(() =>
  import("./revenueStatisticsCasinoAppAllMonth")
);

const revenueStatisticsCasinoConfigsAllMonth = {
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: "/statistics/revenueStatisticsCasinoAllMonth",
      element: <RevenueStatisticsCasinoAppAllMonth />,
    },
  ],
};

export default revenueStatisticsCasinoConfigsAllMonth;
