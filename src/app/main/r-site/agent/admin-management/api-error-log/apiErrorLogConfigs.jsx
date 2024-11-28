import { lazy } from "react";

const ApiErrorLogApp = lazy(() => import("./apiErrorLogApp"));

const apiErrorLogConfigs = {
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: "/statistics/APIerror",
      element: <ApiErrorLogApp />,
    },
  ],
};

export default apiErrorLogConfigs;
