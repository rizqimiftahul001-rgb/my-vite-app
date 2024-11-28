import { lazy } from "react";

const NativeApiApp = lazy(() => import("./nativeApiApp"));

const nativeApiConfigs = {
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: "/statistics/nativeAPI",
      element: <NativeApiApp />,
    },
  ],
};

export default nativeApiConfigs;
