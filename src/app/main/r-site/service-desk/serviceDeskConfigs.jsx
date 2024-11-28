import { useState, useEffect, lazy } from "react";
import DataHandler from "src/app/handlers/DataHandler";
import APIService from "src/app/services/APIService";
import APISupport from "src/app/services/APISupport";
import { Route, Routes, useNavigate } from "react-router-dom";
import FuseLoading from "@fuse/core/FuseLoading/FuseLoading";

const ServiceDeskApp = lazy(() => import("./serviceDeskApp"));
const user_id = DataHandler.getFromSession("user_id");

const ServiceDeskLoader = () => {
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  useEffect(() => {
    navigate(-1);
    window.open("https://support.kingpot.asia/login", "_blank");
    // APIService({
    //   url: `${process.env.REACT_APP_R_SITE_API}/user/details?user_id=${user_id}`,
    //   method: "GET",
    // })
    //   .then((data) => {
    //     APISupport({
    //       url: process.env.REACT_APP_CS_SITE,
    //       method: "POST",
    //       data: {
    //         userid: data.data.data[0].id,
    //         password: "astro1234",
    //         user_ack: true,
    //       },
    //     })
    //       .then((data) => {
    //         navigate(-1);
    //         window.open(data.data, "_blank");
    //       })
    //       .catch((err) => {
    //         //navigate("/dashboard", { replace: true });
    //       })
    //       .finally(() => {});
    //   })
    //   .catch((err) => {});
  }, []);

  if (isLoading) {
    return <FuseLoading />;
  }
};

const serviceDeskConfigs = {
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: "/serviceDesk",
      element: <ServiceDeskLoader />,
    },
  ],
};

export default serviceDeskConfigs;
