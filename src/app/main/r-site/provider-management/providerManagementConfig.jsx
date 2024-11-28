import { lazy } from "react";

const ProviderManagementApp = lazy(() => import("./providerManagementApp"));

const providerManagementConfigs = {
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: "/providermanagement",
      element: <ProviderManagementApp />,
    },
  ],
};

export default providerManagementConfigs;
