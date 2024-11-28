import { lazy } from "react";

const AgentTreeListApp = lazy(() => import("./agentTreeListApp"));

const AgentTreeListConfigs = {
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: "/agent/agentTreeList",
      element: <AgentTreeListApp />,
    },
  ],
};

export default AgentTreeListConfigs;
