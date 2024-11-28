import { lazy } from "react";

const CreateAgentApp = lazy(() => import("./createAgentApp"));

const CreateAgentConfigs = {
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: "/agent/createAgent",
      element: <CreateAgentApp />,
    },
  ],
};

export default CreateAgentConfigs;
