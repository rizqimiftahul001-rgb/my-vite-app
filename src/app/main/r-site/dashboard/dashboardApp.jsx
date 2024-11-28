import React, { useEffect, useState } from "react";
import FuseLoading from "@fuse/core/FuseLoading/FuseLoading";
import { useDispatch, useSelector } from "react-redux";
import jwtDecode from "jwt-decode";
import APIService from "src/app/services/APIService";
import DataHandler from "src/app/handlers/DataHandler";
import { showMessage } from "app/store/fuse/messageSlice";
import { formatSentence } from "src/app/services/Utility";
import AdminDashboard from "./admin/adminDashboard";
import AgentDashboard from "./agent/agentDashboard";
import { locale } from "../../../configs/navigation-i18n";
import "./dashboard.css";

function DashboardApp() {
  const dispatch = useDispatch();
  const [agentHoldingSummary, setAgentHoldingSummary] = useState([]);
  const user_id = DataHandler.getFromSession("user_id");
  const [agentHoldingDetails, setAgentHoldingDetails] = useState([]);
  const [holdingDetails, setHoldingDetails] = useState();
  const [statData, setStatData] = useState([]);
  const [subagentStats, setSubagentStats] = useState({});
  const [agentRevenue, setAgentRevenue] = useState([]);
  const [distributionAgent, setDistributionAgent] = useState(0);
  const [operationalAgent, setOperationalAgent] = useState(0);
  const [concurrentAgent, setConcurrentAgent] = useState(0);
  const [selectLocale] = useSelector((state) => [state.locale.selectLocale]);
  const [selectedLang, setSelectedLang] = useState(locale.ko);
  const [selectedprovider] = useSelector((state) => [
    state.provider.selectedprovider,
  ]);
  const [gameslistCounts, setGameListCounts] = useState({
    currentGames: 0,
    deletedGames: 0,
    newGames: 0,
    totalGames: 0,
  });
  const [userDetails, setUserDetails] = useState("");
  const userRole = jwtDecode(DataHandler.getFromSession("accessToken"))["data"];
  const [loading, setLoaded] = useState(true);
  const [loading1, setLoading1] = useState(true);
  const [loading2, setLoading2] = useState(true);
  const [loading3, setLoading3] = useState(true);
  const [loading4, setLoading4] = useState(true);
  const [loading5, setLoading5] = useState(true);
  const [loading6, setLoading6] = useState(true);

  useEffect(() => {
    if (selectLocale === "ko") {
      setSelectedLang(locale.ko);
    } else {
      setSelectedLang(locale.en);
    }
  }, [selectLocale]);

  useEffect(() => {
    if (userRole.role === "admin") {
      getAgentBalance();
      getAgentHoldingSummary();
    } else {
      getStatData();
      getAgentRevenue();
    }
    getSubAgentByType();
    getUserHoldings();
    getGameListCount();
    getSubagentStats();
  }, []); // Empty dependency array to run the effect only once

  useEffect(() => {
    getUserDetails();
  }, []);


  useEffect(() => {
    if (userRole.role === "admin") {
      if (
        loading1 === false &&
        loading2 === false &&
        loading4 === false &&
        loading5 === false
      ) {
        setLoaded(false);
      }
    } else {
      if (
        loading3 === false &&
        loading4 === false &&
        loading5 === false &&
        loading6 === false
      ) {
        setLoaded(false);
      }
    }
  }, [loading1, loading2, loading3, loading4, loading5, loading6]);

  const getGameListCount = () => {
    APIService({
      url: `${process.env.REACT_APP_R_SITE_API}/dashboard/game-list-count`,
      method: "GET",
    })
      .then((res) => {
        if (!res.data.error) {
          setGameListCounts(res.data.data);
        }
      })
      .catch((err) => {
        const message = err.message ? err.message : "Data Not Found";
      })
      .finally(() => {
        setLoading4(false);
      });
  };

  const getAgentBalance = () => {
    APIService({
      url: `${process.env.REACT_APP_R_SITE_API}/user/agent-holding`,
      method: "GET",
    })
      .then((res) => {
        setAgentHoldingDetails(res.data.data);
      })
      .catch((err) => {})
      .finally(() => {
        setLoading1(false);
      });
  };

  const getSubAgentByType = () => {
    APIService({
      url: `${process.env.REACT_APP_R_SITE_API}/dashboard/sub-agent-count?user_id=${user_id}`,
      method: "GET",
    })
      .then((res) => {
        setDistributionAgent(res.data.data[0].Distribution);
        setOperationalAgent(res.data.data[0].Operational);
        setConcurrentAgent(res.data.data[0].Concurrent);
      })
      .catch((err) => {
        const message = err.message ? err.message : "Data Not Found";
      })
      .finally(() => {
        setLoading4(false);
      });
  };

  const getAgentHoldingSummary = () => {
    APIService({
      url: `${process.env.REACT_APP_R_SITE_API}/user/get-holding_summary?user_id=${user_id}`,
      method: "GET",
    })
      .then((data) => {
        setAgentHoldingSummary(data.data.data);
      })
      .catch((err) => {
        dispatch(
          showMessage({
            variant: "error",
            message: `${
              selectedLang[`${formatSentence(err?.message)}`] ||
              selectedLang.something_went_wrong
            }`,
          })
        );
      })
      .finally(() => {
        setLoading2(false);
      });
  };

  const getUserHoldings = () => {
    APIService({
      url: `${process.env.REACT_APP_R_SITE_API}/user/user-holding-details?user_id=${user_id}&provider=${selectedprovider}`,
      method: "GET",
    })
      .then((data) => {
        setHoldingDetails(data);
      })
      .catch((e) => {
        console.log("Error : ", e)
      })
      .finally(() => {
        setLoading5(false);
      });
  };

  const getAgentRevenue = () => {
    APIService({
      url: `${process.env.REACT_APP_R_SITE_API}/revenue/one-agent-revenue?user_id=${user_id}`,
      method: "GET",
    })
      .then((res) => {
        setAgentRevenue(res.data.data);
      })
      .catch((err) => {
        const message = err.message ? err.message : "Data Not Found";
      })
      .finally(() => {
        setLoading3(false);
      });
  };

  const getSubagentStats = () => {
    APIService({
      url: `${process.env.REACT_APP_R_SITE_API}/user/agent-count-info`,
      method: "GET",
    })
      .then((res) => {
        setSubagentStats(res.data);
      })
      .catch((err) => {});
  };

 const getStatData = () => {
    APIService({
      url: `${process.env.REACT_APP_R_SITE_API}/dashboard/agent-stat?user_id=${user_id}`,
      method: "GET",
    })
      .then((res) => {
        if (!res.data.error) {
          setStatData(res.data.data);
        }
      })
      .catch((err) => {
        const message = err.message ? err.message : "Data Not Found";
      })
      .finally(() => {
        setLoading6(false);
      });
  };

  const getUserDetails = () => {
    APIService({
      url: `${process.env.REACT_APP_R_SITE_API}/user/details?user_id=${user_id}`,
      method: "GET",
    })
      .then((data) => {
        setUserDetails(data.data.data[0]);
      })
      .catch((e) => {})
      .finally(() => {});
  };

  return (
    <>
      {loading ? (
        <FuseLoading />
      ) : (
        <>
          {userRole.role === "admin" ? (
            <AdminDashboard
              selectedLang={selectedLang}
              agentHoldingDetails={agentHoldingDetails}
              subagentStats={subagentStats}
              gameslistCounts={gameslistCounts}
              agentHoldingSummary={agentHoldingSummary}
              selectedprovider={selectedprovider}
            />
          ) : (
            <AgentDashboard
              holdingDetails={holdingDetails}
              selectedLang={selectedLang}
              subagentStats={subagentStats}
              gameslistCounts={gameslistCounts}
              userRole={userRole}
              agentRevenue={agentRevenue}
              distributionAgent={distributionAgent}
              operationalAgent={operationalAgent}
              concurrentAgent={concurrentAgent}
              statData={statData}
              userDetails={userDetails}
            />
          )}
        </>
      )}
    </>
  );
}

export default DashboardApp;
