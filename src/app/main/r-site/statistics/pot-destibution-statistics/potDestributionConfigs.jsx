import { lazy } from "react";

const PotDestributionApp = lazy(() => import("./potDestributionApp"));

const potDestributionConfigs = {
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: "/statistics/potDestribution",
      element: <PotDestributionApp />,
    },
  ],
};

export default potDestributionConfigs;
