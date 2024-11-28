import { lazy } from "react";

const UserMoneyApp = lazy(() => import("./userMoneyApp"));

const UserListConfigs = {
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: "/user/Money",
      element: <UserMoneyApp />,
    },
  ],
};

export default UserListConfigs;
