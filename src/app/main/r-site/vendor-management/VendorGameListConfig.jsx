import { lazy } from "react";

const VendorGameListApp = lazy(() => import("./VendorGameListApp"));
const VendorGameListConfigs = {
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: "/vendorlistmanagement",
      element: <VendorGameListApp />,
    },
  ],
};

export default VendorGameListConfigs;
