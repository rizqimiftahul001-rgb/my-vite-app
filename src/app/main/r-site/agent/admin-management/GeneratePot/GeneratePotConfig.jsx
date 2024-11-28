import { lazy } from "react";

const GeneratePotApp = lazy(() => import("./GeneratePot"));

const AdminManagementConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: "/agent/generate-pot",
      element: <GeneratePotApp />,
    },
  ],
};

export default AdminManagementConfig;
