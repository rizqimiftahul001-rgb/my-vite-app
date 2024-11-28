import { lazy } from "react";

const RequestRpointApp = lazy(() => import("./requestRpointApp"));

const RequestRpointConfigs = {
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: "/operator/requestRpoint",
      element: <RequestRpointApp />,
    },
  ],
};

export default RequestRpointConfigs;
