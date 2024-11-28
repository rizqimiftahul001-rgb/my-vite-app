import { lazy } from "react";

const ChargingHostoryApp = lazy(() => import("./chargingHostoryApp"));

const ChargingHostoryConfigs = {
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: "/pot-charging-despensing/chargingHistory",
      element: <ChargingHostoryApp />,
    },
  ],
};

export default ChargingHostoryConfigs;
