import { lazy } from "react";

const AgentListApp = lazy(() => import("./agentListApp"));

const AgentListConfigs = {
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: "/agent/agentList",
      element: <AgentListApp />,
    },
  ],
};

export default AgentListConfigs;
