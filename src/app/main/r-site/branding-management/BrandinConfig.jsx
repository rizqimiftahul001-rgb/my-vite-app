import { lazy } from "react";

const BrandingApp = lazy(() => import("./BrandingApp"));
const BrandingConfigs = {
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: "/brandingManagement",
      element: <BrandingApp />,
    },
  ],
};

export default BrandingConfigs;
