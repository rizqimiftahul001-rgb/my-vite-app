import { lazy } from "react";



const EnvControllerApp = lazy(() => import("./EnvControllerApp"));

const EnvControllerConfigs = {
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: '/envcontroller',
      element: <EnvControllerApp />,
    },
  ],
};

export default EnvControllerConfigs;
