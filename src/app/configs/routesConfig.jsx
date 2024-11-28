/** @format */

import { lazy } from "react";
import FuseUtils from "@fuse/utils";
import FuseLoading from "@fuse/core/FuseLoading";
import { Navigate } from "react-router-dom";
import settingsConfig from "app/configs/settingsConfig";
import userInterfaceConfigs from "../main/user-interface/UserInterfaceConfigs";
import SignInConfig from "../main/sign-in/SignInConfig";
import SignUpConfig from "../main/sign-up/SignUpConfig";
import SignOutConfig from "../main/sign-out/SignOutConfig";
import dashboardsConfigs from "../main/dashboards/dashboardsConfigs";
import appsConfigs from "../main/apps/appsConfigs";
import pagesConfigs from "../main/pages/pagesConfigs";
import authRoleExamplesConfigs from "../main/auth/authRoleExamplesConfigs";
import DocumentationConfig from "../main/documentation/DocumentationConfig";
import DataHandler from "../handlers/DataHandler";

import dashboardConfigs from "../main/r-site/dashboard/dashboardConfigs";
import mypageConfigs from "../main/r-site/mypage/mypageConfigs";
import providerManagementConfigs from "../main/r-site/provider-management/providerManagementConfig";
import serviceDeskConfigs from "../main/r-site/service-desk/serviceDeskConfigs";
import agentConfigs from "../main/r-site/agent/agentConfigs";
import userConfigs from "../main/r-site/user/userConfigs";
import potChargingConfigs from "../main/r-site/pot-charging/potChargingConfigs";
import statisticsConfigs from "../main/r-site/statistics/statisticsConfigs";
import developerConfigs from "../main/r-site/developer/developerConfigs";
import GameManagementConfigs from "../main/r-site/game-management/GameManagementConfig";
import WinManagementConfigs from "../main/r-site/max-win-management/winManagementConfig";
import loginHistoryConfig from "../main/r-site/user/Login-history/loginHistoryConfigs";
import SysMAgentListConfigs from "../main/r-site/system-management/sysManaagentListConfigs";
import GameListManagementConfigs from "../main/r-site/game-management/game-list-management/GameListManagementConfig";
import AggregatorManagementConfigs from "../main/r-site/aggregator-management/AggregatorManagementConfigs";
import UserBettingListConfigs from "../main/r-site/user-betting-list/UserBettingListConfigs";
import userLimitManagementConfig from "../main/r-site/user-bet-management/userLimitConfig";
import BehaviourLogConfigs from "../main/r-site/developer/behavior-log/BehaviorLogConfig";
import VendorGameListConfigs from "../main/r-site/vendor-management/VendorGameListConfig";
import UserMoneyConfigs from "../main/r-site/user/user-money-management/userListConfigs";
import InvestAccountConfigs from "../main/r-site/invest-account/InvestAccountConfigs";
import InvestDetailsConfigs from "../main/r-site/invest-direct-details/InvestDetailsConfigs";
import BrandingConfigs from "../main/r-site/branding-management/BrandinConfig";
import DetailsHistoryConfigs from "../main/r-site/details-history/DetailsHistoryConfigs";
import PublicDetailsHistoryConfigs from "../main/r-site/public-detail-history/PublicDetailsHistoryConfigs";
import ggrConfigs from "../main/r-site/ggr/ggrConfigs";
import GameStatusManagementConfigs from "../main/r-site/Gamestatusmt/GameListManagementConfig";
import EnvControllerConfigs from "../main/r-site/env-controller/EnvControllerConfigs";
const PublicDetailsHistoryApp = lazy(() =>
  import("../main/r-site/public-detail-history/PublicDetailsHistoryApp")
);

const check_tocken = DataHandler.getFromSession("accessToken");
const role = DataHandler.getFromSession("role");

if (check_tocken) {
  var routeConfigs = [
    // ...appsConfigs,
    // ...dashboardsConfigs,
    // ...authRoleExamplesConfigs,
    // ...userInterfaceConfigs,
    // DocumentationConfig,
    // SignUpConfig,
    ...pagesConfigs,
    ...agentConfigs,
    ...userConfigs,
    ...potChargingConfigs,
    ...statisticsConfigs,
    ...developerConfigs,
    SignOutConfig,
    SignInConfig,
    dashboardConfigs,
    mypageConfigs,
    ggrConfigs,
    providerManagementConfigs,
    serviceDeskConfigs,
    GameManagementConfigs,
    WinManagementConfigs,
    loginHistoryConfig,
    SysMAgentListConfigs,
    GameListManagementConfigs,
    AggregatorManagementConfigs,
    UserBettingListConfigs,
    userLimitManagementConfig,
    BehaviourLogConfigs,
    VendorGameListConfigs,
    BrandingConfigs,
    UserMoneyConfigs,
    DetailsHistoryConfigs,
    PublicDetailsHistoryConfigs,
    GameStatusManagementConfigs,
    EnvControllerConfigs,
  ];
  if (role === "admin") {
    // routeConfigs.push(InvestAccountConfigs)
    routeConfigs.push(InvestDetailsConfigs);
  }
} else {
  var routeConfigs = [SignInConfig, PublicDetailsHistoryConfigs];
}

const routes = [
  ...FuseUtils.generateRoutesFromConfigs(
    routeConfigs,
    settingsConfig.defaultAuth
  ),
  {
    path: "public-details-history/:bet_transaction_id",
    element: <PublicDetailsHistoryApp />,
  },
  {
    path: "public-details-history",
    element: <PublicDetailsHistoryApp />,
  },
  {
    path: "/",
    element: (
      <>
        {check_tocken ? <Navigate to="dashboard" /> : <Navigate to="sign-in" />}
      </>
    ),
  },
  {
    path: "loading",
    element: <FuseLoading />,
  },
  {
    path: "*",
    element: (
      <>
        {check_tocken ? (
          <Navigate to="pages/error/404" />
        ) : (
          <Navigate to="sign-in" />
        )}
      </>
    ),
  },
];

export default routes;
