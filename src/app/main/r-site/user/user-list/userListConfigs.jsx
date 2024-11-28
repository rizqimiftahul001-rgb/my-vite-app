import { lazy } from "react";

const UserListApp = lazy(() => import("./userListApp"));

const UserListConfigs = {
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: "/user/userList",
      element: <UserListApp />,
    },
  ],
};

export default UserListConfigs;
