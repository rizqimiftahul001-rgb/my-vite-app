import { lazy } from "react";

const AgentListApp = lazy(() => import("./sysManagentListApp"));

const SysMAgentListConfigs = {
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: "/systemManagement",
      element: <AgentListApp />,
    },
  ],
};

export default SysMAgentListConfigs;
