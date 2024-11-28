import transactionHistoryConfigs from "./transaction-history/transactionHistoryConfigs";
import adminHistoryConfigs from "./admin-history/adminHistoryConfigs";
import agentListConfigs from "./agent-lits/agentListConfigs";
import agentTreeListConfigs from "./agent-tree-list/agentTreeListConfigs";
import createAgentConfigs from "./create-agent/createAgentConfigs";
import requestRpointConfigs from "./request-r-point/requestRpointConfigs";
import rpointRequestedListConfigs from "./r-point-requested-list/rpointRequestedListConfigs";
import myRpointHistoryConfigs from "./my-r-point-history/myRpointHistoryConfigs";
import AdminManagementConfig from "./admin-management/adminGGRLimitConfig";
import GeneratePotConfig from "./admin-management/GeneratePot/GeneratePotConfig";

const agentConfigs = [
  transactionHistoryConfigs,
  agentListConfigs,
  agentTreeListConfigs,
  createAgentConfigs,
  requestRpointConfigs,
  rpointRequestedListConfigs,
  myRpointHistoryConfigs,
  adminHistoryConfigs,
  AdminManagementConfig,
  GeneratePotConfig,
];

export default agentConfigs;
