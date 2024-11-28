import { lazy } from "react";

const ExtendedApiApp = lazy(() => import("./extendedApiApp"));

const extendedApiConfigs = {
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: "/statistics/ExtendedAPI",
      element: <ExtendedApiApp />,
    },
  ],
};

export default extendedApiConfigs;
