import { lazy } from "react";

const PublicDetailsHistoryApp = lazy(() => import("./PublicDetailsHistoryApp"));
import authRoles from "../../../auth/authRoles";

const PublicDetailsHistoryConfigs = {
  settings: {
    layout: {
      config: {
        navbar: {
          display: false,
        },
        toolbar: {
          display: false,
        },
        footer: {
          display: false,
        },
        leftSidePanel: {
          display: false,
        },
        rightSidePanel: {
          display: false,
        },
      },
    },
  },
  auth: authRoles.onlyGuest,
  routes: [
    {
      path: "public-details-history/:bet_transaction_id",
      element: <PublicDetailsHistoryApp />,
    },
    {
      path: "public-details-history",
      element: <PublicDetailsHistoryApp />,
    },
  ],
};

export default PublicDetailsHistoryConfigs;
