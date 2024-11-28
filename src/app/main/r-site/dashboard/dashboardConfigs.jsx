import { lazy } from "react";

const DashboardApp = lazy(() => import("./dashboardApp"));

const dashboardConfigs = {
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: "/dashboard",
      element: <DashboardApp />,
    },
  ],
};

export default dashboardConfigs;
