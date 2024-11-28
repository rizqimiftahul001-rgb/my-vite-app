import { lazy } from "react";

const DailySummaryApp = lazy(() =>
  import("./dailySummaryApp")
);

const dailySummaryConfigs = {
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: "/statistics/DailySummary",
      element: <DailySummaryApp />,
    },
  ],
};

export default dailySummaryConfigs;
