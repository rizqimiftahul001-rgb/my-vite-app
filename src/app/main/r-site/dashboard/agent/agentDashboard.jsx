import React from "react";
import "../dashboard.css";
import Dashboard from "./dashboard";
import Statics from "./statics";
import FusePageSimple from "@fuse/core/FusePageSimple";
import StaticsdHeader from "./staticsdHeader";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import { styled } from "@mui/material/styles";
import DashboardHeader from "../dashboardHeader";

function agentDashboard({
  holdingDetails,
  selectedLang,
  subagentStats,
  gameslistCounts,
  userRole,
  agentRevenue,
  distributionAgent,
  operationalAgent,
  concurrentAgent,
  statData,
  userDetails,
}) {
  return (
    <>
      <Box sx={{ width: "100%" }}>
        <Stack spacing={2}>
          <div>
            <FusePageSimple
              header={<DashboardHeader selectedLang={selectedLang} />}
              content={
                <Dashboard
                  holdingDetails={holdingDetails}
                  selectedLang={selectedLang}
                  subagentStats={subagentStats}
                  gameslistCounts={gameslistCounts}
                  userRole={userRole}
                  agentRevenue={agentRevenue}
                  distributionAgent={distributionAgent}
                  operationalAgent={operationalAgent}
                  concurrentAgent={concurrentAgent}
                  userDetails={userDetails}
                />
              }
            />
          </div>
          <div>
            <FusePageSimple
              header={<StaticsdHeader selectedLang={selectedLang} />}
              content={
                <Statics statData={statData} selectedLang={selectedLang} />
              }
            />
          </div>
        </Stack>
      </Box>
    </>
  );
}

export default agentDashboard;
