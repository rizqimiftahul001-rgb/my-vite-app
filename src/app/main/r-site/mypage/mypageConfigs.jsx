import { lazy } from "react";

const MypageApp = lazy(() => import("./mypageApp"));

const dashboardConfigs = {
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: "/mypage",
      element: <MypageApp />,
    },
  ],
};

export default dashboardConfigs;
