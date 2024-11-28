import { lazy } from "react";

const RpointRequestedListApp = lazy(() => import("./rpointRequestedListApp"));

const RpointRequestedListConfigs = {
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: "/agent/rpointRequestedList",
      element: <RpointRequestedListApp />,
    },
  ],
};

export default RpointRequestedListConfigs;
