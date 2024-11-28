import { lazy } from "react";

const AllAgentListApp = lazy(() => import("./AllAgentListApp"));

const AllAgentListConfigs = {
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: "/statistics/allAgentList",
      element: <AllAgentListApp />,
    },
  ],
};

export default AllAgentListConfigs;
