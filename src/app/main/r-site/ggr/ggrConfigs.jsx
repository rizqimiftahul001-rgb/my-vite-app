import { lazy } from "react";


const GGRApp = lazy(() => import("./ggrApp"));

const GGRConfigs = {
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: '/ggr',
      element: <GGRApp />,
    },
  ],
};

export default GGRConfigs;
