/** @format */

import React from "react";
import FusePageSimple from "@fuse/core/FusePageSimple";
import AgentRevenueStatisticsHeader from "./agentRevenueStatisticsHeader";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { locale } from "../../../../configs/navigation-i18n";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { Button, CardActionArea, CardActions } from "@mui/material";
import "./agentRevenue.css";
import Chip from "@mui/material/Chip";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import { styled } from "@mui/material/styles";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import InputBase from "@mui/material/InputBase";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import APIService from "src/app/services/APIService";
import DataHandler from "src/app/handlers/DataHandler";
import jwtDecode from "jwt-decode";
import FuseLoading from "@fuse/core/FuseLoading/FuseLoading";
import { formatDate } from "src/app/services/Utility";
import SearchIcon from "@mui/icons-material/Search";
import queryString from "query-string";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSort } from '@fortawesome/free-solid-svg-icons';
import { faSortUp } from '@fortawesome/free-solid-svg-icons';
import { faSortDown } from '@fortawesome/free-solid-svg-icons';
import PopupState, { bindTrigger, bindMenu } from "material-ui-popup-state";
import { Menu } from "@mui/material";
import { useNavigate } from "react-router-dom";

import TextField from "@mui/material/TextField";
import { Autocomplete } from "@mui/material";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

const todayDate = new Date();
todayDate.setDate(todayDate.getDate() + 1);

const nextMonthFirstDay = new Date(todayDate);
nextMonthFirstDay.setMonth(nextMonthFirstDay.getMonth() + 1, 1);

nextMonthFirstDay.setDate(0);
nextMonthFirstDay.setHours(23, 59, 59, 999);

function agentRevenueStatisticsApp() {
  const [agentData, setAgentData] = useState([]);
  const navigate = useNavigate();
  const user_id = DataHandler.getFromSession("user_id");
  const [month, setMonth] = useState("");
  const [userData, setUserData] = useState();
  const [curresntdata, setCurrentData] = useState(new Date());
  const role = jwtDecode(DataHandler.getFromSession("accessToken"))["data"];
  const [monthFirstDay, setMonthFirstDay] = useState(todayDate);
  const [monthLastDay, setMonthLastDay] = useState(nextMonthFirstDay);
  const [agentName, setAgentName] = useState([]);
  const [selectedprovider] = useSelector((state) => [
    state.provider.selectedprovider,
  ]);
  const [selectLocale] = useSelector((state) => [state.locale.selectLocale]);
  const [selectedLang, setSelectedLang] = useState(locale.en);
  const [loaded, setLoaded] = useState(true);
  const [loading1, setLoading1] = useState(true);
  const [loading2, setLoading2] = useState(true);
  const [subLoader, setSubLoader] = useState(true);
  const { search } = window.location;
  const { agent, subAgent } = queryString.parse(search);
  const [filterAgent, setFilterAgent] = useState(agent || "");
  const [csvDataPaymentRequest, setCsvData] = useState();
  const [sumArray, setSumArray] = useState();

  const [adminType, setAdminType] = useState("");
  const addDynamicSearch = (event, newValue) => {

    // const newValue = event.target.value;
    setFilterAgent(newValue || "");
    //setAdminType(newValue?.value || "");
  };

  useEffect(() => {
    if (loading1 == false && loading2 == false) {
      setLoaded(false);
    }
  }, [loading1, loading2]);

  useEffect(() => {
    if (selectLocale == "ko") {
      setSelectedLang(locale.ko);
    } else {
      setSelectedLang(locale.en);
    }
  }, [selectLocale]);

  const currentDate = new Date();
  const currentMonth = currentDate.toLocaleString("default", { month: "long" });
  const previousMonthDate = new Date(currentDate);
  previousMonthDate.setMonth(currentDate.getMonth() - 1);
  const previousMonthName = previousMonthDate.toLocaleString("default", {
    month: "long",
  });

  useEffect(() => {
    getAgentData(firstDay, lastDay);
    getAgentName();
  }, [selectedprovider]);

  useEffect(() => {
    getSubAgentData(subAgent);
  }, [subAgent]);

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(20);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const [age, setAge] = React.useState("");

  const handleChange = (event) => {
    setAge(event.target.value);
  };

  const columns = [
    { id: "no", label: `${selectedLang.number}`, minWidth: 50 },
    { id: "agent_name", label: `${selectedLang.agent_name}`, minWidth: 50 },
    {
      id: "no_casino_user",
      label: `${selectedLang.number_of_lower_users}`,
      minWidth: 50,
    },
    {
      id: "bet_money",
      label: `${selectedLang.bet_money}`,
      minWidth: 50,
    },
    {
      id: "winning",
      label: `${selectedLang.win_money}`,
      minWidth: 50,
    },
    {
      id: "profit_loss",
      label: `${selectedLang.profit_and_loss}`,
      minWidth: 50,
    },
    {
      id: "no_bet",
      label: `${selectedLang.no_of_bet}`,
      minWidth: 50,
    },
    {
      id: "no_win",
      label: `${selectedLang.no_of_wins}`,
      minWidth: 50,
    },
  ];

  const columns11 = [
    { id: "date", label: `${selectedLang.date}`, minWidth: 50 },
    {
      id: "bet_money",
      label: `${selectedLang.bet_money}`,
      minWidth: 50,
    },
    {
      id: "winning",
      label: `${selectedLang.win_money}`,
      minWidth: 50,
    },
    {
      id: "profit_loss",
      label: `${selectedLang.profit_and_loss}`,
      minWidth: 50,
    },
    {
      id: "no_bet",
      label: `${selectedLang.no_of_bet}`,
      minWidth: 50,
    },
    {
      id: "no_win",
      label: `${selectedLang.no_of_wins}`,
      minWidth: 50,
    },
  ];

  var date = new Date();
  var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
  var lastDay = nextMonthFirstDay;

  useEffect(() => {
    getAgentData(firstDay, lastDay);
    getAgentName();
  }, []);

  const getThisMonthData = (e) => {
    setAgentData([]);
    e.preventDefault();
    var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    var currentDay = new Date(
      date.getFullYear(),
      date.getMonth() + 1,
      date.getDate()
    );
    setMonthFirstDay(firstDay);
    setMonthLastDay(currentDay);

    getAgentData(firstDay, lastDay);
  };

  const getLastMonthData = (e) => {
    const todayDate = new Date();
    todayDate.setDate(1);
    todayDate.setDate(todayDate.getDate() - 1);
    todayDate.setHours(23, 59, 59, 999);

    setAgentData([]);
    e.preventDefault();
    const date = new Date();
    var firstDay = new Date(date.getFullYear(), date.getMonth() - 1, 1);
    var lastDay = todayDate;

    setMonthFirstDay(firstDay);
    setMonthLastDay(lastDay);

    getAgentData(firstDay, lastDay);
  };

  const getAgentData = (firstDay, lastDay) => {
    setSubLoader(true);
    APIService({
      url: `${process.env.REACT_APP_R_SITE_API
        }/revenue/agent-revenue?user_id=${user_id}&start_date=${firstDay ? firstDay : monthFirstDay
        }&end_date=${lastDay ? lastDay : monthLastDay}&agent=${filterAgent}`,
      method: "GET",
    })
      .then((res) => {

        setAgentData(res.data.data.agentRevenue);
        setMonth(res.data.data.month);
        setUserData(res.data.data.userData);
      })
      .catch((err) => { })
      .finally(() => {
        setLoading1(false);
        setSubLoader(false);
      });
  };
  const getSubAgentData = (agentName) => {
    setAgentData([]);
    setSubLoader(true);
    APIService({
      url: `${process.env.REACT_APP_R_SITE_API
        }/revenue/sub-agent-revenue-list?user_id=${agentName}&username=${agentName || ""
        }&start_date=${monthFirstDay}&end_date=${monthLastDay}`,
      method: "GET",
    })
      .then((res) => {
        setAgentData(res.data.data.agentRevenue);
        // setSubAgentData(res.data.data.agentRevenue);
        // setMonth(res.data.data.month);
      })
      .catch((err) => { })
      .finally(() => {
        setLoading1(false);
        setSubLoader(false);
      });
  };

  const getAgentName = () => {
    APIService({
      url: `${process.env.REACT_APP_R_SITE_API}/user/agent-name-list?user_id=${user_id}&provider=${selectedprovider}`,
      method: "GET",
    })
      .then((res) => {
        setAgentName(res.data.data.UserDataResult.subAgentUsers);
      })
      .catch((err) => {
        setAgentName([]);
      })
      .finally(() => {
        setLoading2(false);
      });
  };

  const csvHeader = [
    { label: "Date", key: "formated_date" },
    { label: "Bet Money", key: "bet_amount" },
    { label: "Winning Money", key: "winning_amount" },
    { label: "Profit or loss for this month", key: "profit_or_loss" },
    { label: "Number of bets", key: "no_of_bets" },
    { label: "Number of wins", key: "no_of_wins" },
  ];
  useEffect(() => {

    const _csvDataPaymentRequest =
      agentData?.length > 0 &&
      agentData?.map((item) => ({
        ...item,
        formated_date: formatDate(item?.revenue?.date),
        bet_amount: Number(item.revenue.betAmount)?.toLocaleString(),
        winning_amount: Number(item.revenue.winningAmount)?.toLocaleString(),
        profit_or_loss: Number(item.revenue.profitOrLoss),
        no_of_bets: item.revenue.numOfBets,
        no_of_wins: item.revenue.numOfWins,
      }));
    setCsvData(_csvDataPaymentRequest);
  }, [agentData]);
  useEffect(() => {
    let _agentData = agentData;
    // if ((role['role'] == 'admin' || role['role'] == 'cs')) {
    // 	_agentData = agentData.slice(
    // 		page * rowsPerPage,
    // 		page * rowsPerPage + rowsPerPage
    // 	);
    // }

    const _sumArray = {};
    // Loop through object to cal sum
    _agentData.forEach((obj) => {
      const subObj = obj?.revenue;

      for (const field in subObj) {
        const fieldValue = parseFloat(subObj[field]) || 0;

        if (!_sumArray[field]) {
          _sumArray[field] = fieldValue;
        } else {
          _sumArray[field] += fieldValue;
        }
      }
    });
    setSumArray(_sumArray);

  }, [agentData]);
  const createSumRow = () => {
    if (
      agentData.length > 0 &&
      (role["role"] == "admin" || role["role"] == "cs")
    ) {
      return (
        <StyledTableRow
          className="total-row"
          hover
          role="checkbox"
          tabIndex={-1}
        >
          <TableCell
            sx={{
              textAlign: "center",
            }}
          >
            {selectedLang.total}
          </TableCell>
          <TableCell
            sx={{
              textAlign: "center",
            }}
          >
            {""}
          </TableCell>
          <TableCell
            sx={{
              textAlign: "center",
            }}
          >
            {sumArray?.casinoUser}
          </TableCell>
          <TableCell
            sx={{
              textAlign: "center",
            }}
          >
            {sumArray?.betAmount?.toLocaleString()}
          </TableCell>
          <TableCell
            sx={{
              textAlign: "center",
            }}
          >
            {sumArray?.winningAmount?.toLocaleString()}
          </TableCell>
          <TableCell
            sx={{
              textAlign: "center",
              fontWeight: "800",
            }}
          >
            {sumArray?.profitOrLoss?.toLocaleString()}
          </TableCell>
          <TableCell
            sx={{
              textAlign: "center",
            }}
          >
            {sumArray?.numOfBets}
          </TableCell>
          <TableCell
            sx={{
              textAlign: "center",
            }}
          >
            {sumArray?.numOfWins}
          </TableCell>
        </StyledTableRow>
      );
    } else {
      return (
        <StyledTableRow
          className="total-row"
          hover
          role="checkbox"
          tabIndex={-1}
        >
          <TableCell
            sx={{
              textAlign: "center",
            }}
          >
            {selectedLang.total}
          </TableCell>
          <TableCell
            sx={{
              textAlign: "center",
            }}
          >
            {sumArray?.betAmount?.toLocaleString()}
          </TableCell>
          <TableCell
            sx={{
              textAlign: "center",
            }}
          >
            {sumArray?.winningAmount?.toLocaleString()}
          </TableCell>
          <TableCell
            sx={{
              textAlign: "center",
              fontWeight: "bold",
            }}
          >
            {sumArray?.profitOrLoss?.toLocaleString()}
          </TableCell>
          <TableCell
            sx={{
              textAlign: "center",
            }}
          >
            {sumArray?.numOfBets}
          </TableCell>
          <TableCell
            sx={{
              textAlign: "center",
            }}
          >
            {sumArray?.numOfWins}
          </TableCell>
        </StyledTableRow>
      );
    }
  };

  const getSortIconBetMoney = (order) => {
    return order === "asc" ? (
      <FontAwesomeIcon icon={faSortUp} className="sort-icon" />
    ) : order === "desc" ? (
      <FontAwesomeIcon icon={faSortDown} className="sort-icon" />
    ) : (
      <FontAwesomeIcon icon={faSort} className="sort-icon" />
    );
  };

  const [sortColoumns, setSortColoumns] = useState({
    bet_money: "",
    winning: "",
    profit_loss: "",
    casino_user: "",
    no_bet: "",
    no_win: "",
    agent_name: "",
  });

  const [sortBy, setSortBy] = useState(""); // Default sorting column
  const [sortOrder, setSortOrder] = useState(""); // Default sorting order

  const handleSort = (column) => {
    setSortBy(column);
    setSortColoumns((pre) => ({
      // ...pre,
      [column]:
        sortOrder === "asc" ? "desc" : sortOrder === "desc" ? "" : "asc",
    }));
    setSortOrder(
      sortOrder === "asc" ? "desc" : sortOrder === "desc" ? "" : "asc"
    );
  };

  useEffect(() => {
    // handleSort('profit_loss');
  }, []);

  const initCopyAgentData = [...agentData];
  const sortedAndMappedAgentData =
    sortOrder !== ""
      ? initCopyAgentData.sort((a, b) => {
        if (sortBy == "bet_money") {
          return sortOrder === "asc"
            ? a?.revenue.betAmount - b?.revenue.betAmount
            : b?.revenue.betAmount - a?.revenue.betAmount;
        } else if (sortBy === "winning") {
          return sortOrder === "asc"
            ? a?.revenue.winningAmount - b?.revenue.winningAmount
            : b?.revenue.winningAmount - a?.revenue.winningAmount;
        } else if (sortBy == "profit_loss") {
          return sortOrder === "asc"
            ? a?.revenue.profitOrLoss - b?.revenue.profitOrLoss
            : b?.revenue.profitOrLoss - a?.revenue.profitOrLoss;
        } else if (sortBy == "no_bet") {
          return sortOrder === "asc"
            ? a?.revenue.numOfBets - b?.revenue.numOfBets
            : b?.revenue.numOfBets - a?.revenue.numOfBets;
        } else if (sortBy == "no_win") {
          return sortOrder === "asc"
            ? a?.revenue.numOfWins - b?.revenue.numOfWins
            : b?.revenue.numOfWins - a?.revenue.numOfWins;
        } else if (sortBy == "no_casino_user") {
          return sortOrder === "asc"
            ? a?.revenue.casinoUser - b?.revenue.casinoUser
            : b?.revenue.casinoUser - a?.revenue.casinoUser;
        } else if (sortBy == "agent_name") {
          return sortOrder === "asc"
            ? a?.agent.localeCompare(b?.agent)
            : b?.agent.localeCompare(a?.agent);
        } else if (sortBy == "date") {
          return sortOrder === "asc"
            ? a?.revenue.date.localeCompare(b?.revenue.date)
            : b?.revenue.date.localeCompare(a?.revenue.date);
        }
      })
      : initCopyAgentData;

  const displayAgentData = () => {
    if (
      agentData.length > 0 &&
      (role["role"] == "admin" || role["role"] == "cs")
    ) {
      return (
        <TableBody>
          {agentData.length > 0 && createSumRow()}
          {sortedAndMappedAgentData
            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            .map((agent, index) => (
              <StyledTableRow hover role="checkbox" tabIndex={-1} key={index}>
                <TableCell
                  sx={{
                    textAlign: "center",
                  }}
                >
                  {page * rowsPerPage + index + 1}
                </TableCell>
                <TableCell
                  className="row flex  justify-items-center"
                  sx={{
                    justifyContent: "space-between",
                    textAlign: "center",
                  }}
                >
                  {/* {agent.agent} */}
                  <div style={{ marginTop: "8px" }}>
                    <PopupState variant="popover" popupId="demo-popup-menu">
                      {(popupState) => (
                        <React.Fragment>
                          <span
                            style={{
                              textDecoration: "underline",
                              cursor: "pointer",
                            }}
                            {...bindTrigger(popupState)}
                          >
                            {agent.agent}
                          </span>
                          <Menu {...bindMenu(popupState)}>
                            {/* {(role["role"] == "admin" ||
                              role["role"] == "cs" ||
                              myType == "2") && ( */}
                            <MenuItem
                              onClick={() => {
                                popupState.close;
                                navigate(`/mypage?agent_id=${user_id}`);
                              }}
                            >
                              {selectedLang.MYPAGE}
                            </MenuItem>
                            {/* )} */}
                            <MenuItem
                              onClick={() => {
                                popupState.close;
                                navigate(
                                  `/agent/transactionHistory?agent=${agent?.agent}`
                                );
                              }}
                            >
                              {selectedLang.TRANSACTIONHISTORYAGENT}
                            </MenuItem>
                            <MenuItem
                              onClick={() => {
                                popupState.close;
                                navigate(
                                  `/agent/agentTreeList?q_agent=${agent.agent}`
                                );
                              }}
                            >
                              {selectedLang.change_password}
                            </MenuItem>

                            <MenuItem
                              onClick={() => {
                                popupState.close;
                                navigate(
                                  `/statistics/agentRevenueStatistics?agent=${agent?.agent}`
                                );
                              }}
                            >
                              {selectedLang.AGENTRSTATISTICS}
                            </MenuItem>
                            <MenuItem
                              onClick={() => {
                                popupState.close;
                                navigate(
                                  `/statistics/statisticsByGame?agent_id=${agent.agent}`
                                );
                              }}
                            >
                              {selectedLang.statisticsByGame}
                            </MenuItem>
                            {/* <MenuItem onClick={popupState.close}>Pot Distribution Statistics</MenuItem> */}
                            <hr style={{ border: "1px solid" }} />
                            <MenuItem
                              onClick={() => {
                                popupState.close;
                                navigate(
                                  `/providerManagement?agent_id=${agent.agent}`
                                );
                              }}
                            >
                              {selectedLang.PROVIDERMANAGEMENT}
                            </MenuItem>
                            <hr style={{ border: "1px solid" }} />
                            <MenuItem
                              onClick={() => {
                                popupState.close;
                                navigate(
                                  `/gameManagement?agent_id=${agent.agent}`
                                );
                              }}
                            >
                              {selectedLang.GAMEMANAGEMENT}
                            </MenuItem>
                            <hr style={{ border: "1px solid" }} />
                            <MenuItem
                              onClick={() => {
                                popupState.close;
                                navigate(
                                  `/statistics/APIerror?agent_id=${agent.agent}`
                                );
                              }}
                            >
                              {selectedLang.APIERRORLOG}
                            </MenuItem>
                            <hr style={{ border: "1px solid" }} />
                            <MenuItem
                              onClick={() => {
                                popupState.close;
                                navigate(`/user/userList?agent=${agent?.agent}`);
                              }}
                            >
                              {selectedLang.USERLIST}
                            </MenuItem>
                            <MenuItem
                              onClick={() => {
                                popupState.close;
                                navigate(
                                  `/user/transactionHistory?agent=${agent?.agent}`
                                );
                              }}
                            >
                              {selectedLang.TRANSACTIONHISTORYUSER}
                            </MenuItem>
                            <MenuItem
                              onClick={() => {
                                popupState.close;
                                navigate(
                                  `/user/betHistory?agent=${agent?.agent}`
                                );
                              }}
                            >
                              {selectedLang.BETHISTORY}
                            </MenuItem>
                          </Menu>
                        </React.Fragment>
                      )}
                    </PopupState>
                  </div>
                  <div
                    className=" flex item-center"
                    style={{ marginLeft: "1px" }}
                  >
                    <Button
                      className="flex item-center buttonbox"
                      variant="contained"
                      color="secondary"
                      size="normal"
                      sx={{
                        borderRadius: "4px",
                      }}
                      onClick={() => {
                        // getSubAgentData(agent);
                        navigate(
                          `/statistics/agentRevenueStatistics?subAgent=${agent.agent}`
                        );
                      }}
                    >
                      {selectedLang.bottom}
                    </Button>
                  </div>
                </TableCell>
                <TableCell
                  sx={{
                    textAlign: "center",
                  }}
                >
                  {agent.revenue.casinoUser}
                </TableCell>
                <TableCell
                  sx={{
                    textAlign: "center",
                  }}
                >
                  {Number(agent.revenue.betAmount)?.toLocaleString()}
                </TableCell>
                <TableCell
                  sx={{
                    textAlign: "center",
                  }}
                >
                  {Number(agent.revenue.winningAmount)?.toLocaleString()}
                </TableCell>
                <TableCell
                  sx={{
                    textAlign: "center",
                    fontWeight: "bold",
                  }}
                >
                  {Number(agent.revenue.profitOrLoss)?.toLocaleString()}
                </TableCell>
                <TableCell
                  sx={{
                    textAlign: "center",
                  }}
                >
                  {agent.revenue.numOfBets}
                </TableCell>
                <TableCell
                  sx={{
                    textAlign: "center",
                  }}
                >
                  {agent.revenue.numOfWins}
                </TableCell>
              </StyledTableRow>
            ))}
        </TableBody>
      );
    } else {
      return (
        <TableBody>
          {agentData.length > 0 && createSumRow()}
          {sortedAndMappedAgentData.map((agent, index) => (
            <StyledTableRow hover role="checkbox" tabIndex={-1} key={index}>
              <TableCell
                sx={{
                  textAlign: "center",
                }}
              >
                {formatDate(agent.revenue.date)}
                {/* {agent?.revenue?.date} */}
              </TableCell>
              <TableCell
                sx={{
                  textAlign: "center",
                }}
              >
                {Number(agent.revenue.betAmount)?.toLocaleString()}
              </TableCell>
              <TableCell
                sx={{
                  textAlign: "center",
                }}
              >
                {Number(agent.revenue.winningAmount)?.toLocaleString()}
              </TableCell>
              <TableCell
                sx={{
                  textAlign: "center",
                }}
              >
                {Number(agent.revenue.profitOrLoss).toLocaleString()}
              </TableCell>
              <TableCell
                sx={{
                  textAlign: "center",
                }}
              >
                {agent.revenue.numOfBets}
              </TableCell>
              <TableCell
                sx={{
                  textAlign: "center",
                }}
              >
                {agent.revenue.numOfWins}
              </TableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      );
    }
  };

  return (
    <>
      {" "}
      {loaded ? (
        <FuseLoading />
      ) : (
        <FusePageSimple
          header={
            <AgentRevenueStatisticsHeader
              selectedLang={selectedLang}
              csv_data={csvDataPaymentRequest}
              csv_header={csvHeader}
              csv_filename={"payment_history.csv"}
            />
          }
          content={
            <Card
              sx={{ width: "100%", marginTop: "20px", borderRadius: "4px" }}
              className="main_card"
            >
              <div className="flex justify-start justify-items-center bg-gray p-10 list_title w-100">
                <span className="list-title">
                  {selectedLang.AGENTRSTATISTICS} {selectedLang[month]}{" "}
                  {curresntdata.getFullYear()}
                  {""}
                  {/* {selectedLang.distribution_statistics} */}
                </span>
              </div>

              {/* {(role['role'] == 'admin' || role['role'] == 'cs') && !agent_id && ( */}
              <>
                <div className="row flex justify-end justify-items-center">
                  <div className="col-lg-8 col-md-4 col-sm-4 flex item-center">
                    <Autocomplete
                      onChange={addDynamicSearch}
                      sx={{
                        ml: 1,
                        flex: 1,

                        borderRadius: "4px",
                        padding: "4px 10px",
                        marginRight: "10px",
                        width: "240px",
                      }}
                      // value={
                      //   adminType == ""
                      //     ? selectedLang.all
                      //     : adminType == "0"
                      //       ? selectedLang.Distribution
                      //       : adminType == "1"
                      //         ? selectedLang.Operational
                      //         : selectedLang.Concurrent
                      // }
                      className=""
                      variant="outlined"
                      disablePortal
                      size="small"
                      id="combo-box-demo"
                      options={
                        agentName.map((a) => a.id)

                        // { label: `${selectedLang.Concurrent}`, value: "2" },
                      }
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          className="textSearch"
                          label={selectedLang.agent_id}
                        />
                      )}
                    />

                    {/* <InputBase
                        sx={{
                          ml: 1,
                          flex: 1,
                          border: "1px solid #cdcfd3",
                          borderRadius: "4px",
                          padding: "4px 10px",
                          marginRight: "10px",
                        }}
                        placeholder={selectedLang.agent_name}
                        value={filterAgent}
                        onChange={(e) => setFilterAgent(e.target.value)}
                        inputProps={{ "aria-label": "Agent Name" }}
                      /> */}
                  </div>
                  <div className="col-lg-2 col-md-4 col-sm-4 p-10 pl-0 pr-16 flex item-center">
                    <Button
                      className="flex item-center"
                      variant="contained"
                      color="secondary"
                      endIcon={<SearchIcon size={20}></SearchIcon>}
                      sx={{
                        borderRadius: "4px",
                      }}
                      onClick={() => {
                        getAgentData(firstDay, lastDay);
                      }}
                    >
                      {selectedLang.search}
                    </Button>
                  </div>
                </div>
              </>
              {/* )} */}

              {/* <div className="row flex justify-end justify-items-center">
              <div className="col-lg-2 col-md-4 col-sm-4 p-10">
                <FormControl sx={{ m: 1, minWidth: 220 }} size="small">
                  <InputLabel id="demo-select-small">
                    {selectedLang.select_agent}
                  </InputLabel>
                  <Select
                    labelId="demo-select-small"
                    id="demo-select-small"
                    value={age}
                    label="Select Agent"
                    onChange={handleChange}>
                    <MenuItem value={10}>agent1</MenuItem>
                    <MenuItem value={20}>agent2</MenuItem>
                    <MenuItem value={30}>agent3</MenuItem>
                  </Select>
                </FormControl>
              </div>
            </div> */}

              <div>
                <CardContent className="cardcontent">
                  <Paper
                    sx={{
                      width: "100%",
                      overflow: "hidden",
                      borderRadius: "4px",
                    }}
                  >
                    <TableContainer>
                      <Table stickyHeader aria-label="customized table">
                        <TableHead>
                          {role["role"] == "admin" || role["role"] == "cs" ? (
                            <TableRow>
                              {columns.map((column) => (
                                <StyledTableCell
                                  sx={{
                                    textAlign: "center",
                                    cursor:
                                      column.id === "bet_money" ||
                                        column.id === "winning" ||
                                        column.id === "profit_loss" ||
                                        column.id === "no_bet" ||
                                        column.id === "no_casino_user" ||
                                        column.id === "no_win"
                                        ? "pointer"
                                        : "default",
                                  }}
                                  key={column.id}
                                  align={column.align}
                                  style={{ minWidth: column.minWidth }}
                                  onClick={() => handleSort(column.id)}
                                >
                                  {column.label}
                                  {column.id !== "no"
                                    ? getSortIconBetMoney(
                                      sortColoumns?.[column.id]
                                    )
                                    : ""}
                                  {/* {column.id == "bet_money"
                                      ? getSortIconBetMoney(
                                          sortColoumns.bet_money
                                        )
                                      : column.id == "winning"
                                      ? getSortIconWinning(sortColoumns.winning)
                                      : column.id === "no_casino_user"
                                      ? getSortIconWinning(
                                          sortColoumns.no_casino_user
                                        )
                                      : column.id == "profit_loss"
                                      ? getSortIconProfLoss(
                                          sortColoumns.profit_loss
                                        )
                                      : column.id == "no_bet"
                                      ? getSortIconNoBet(sortColoumns.no_bet)
                                      : column.id == "no_win"
                                      ? getSortIconNoWin(sortColoumns.no_win)
                                      : ""} */}
                                </StyledTableCell>
                              ))}
                            </TableRow>
                          ) : (
                            <TableRow>
                              {columns11.map((column) => (
                                <StyledTableCell
                                  sx={{
                                    textAlign: "center",
                                    cursor:
                                      column.id === "bet_money" ||
                                        column.id === "winning" ||
                                        column.id === "profit_loss" ||
                                        column.id === "no_bet" ||
                                        column.id === "no_casino_user" ||
                                        column.id === "no_win"
                                        ? "pointer"
                                        : "default",
                                  }}
                                  key={column.id}
                                  align={column.align}
                                  style={{ minWidth: column.minWidth }}
                                  onClick={() => handleSort(column.id)}
                                >
                                  {column.label}
                                  {column.id !== ""
                                    ? getSortIconBetMoney(
                                      sortColoumns?.[column.id]
                                    )
                                    : ""}
                                  {/* {column.id == "bet_money"
                                      ? getSortIconBetMoney(sortOrder_bet_money)
                                      : column.id == "winning"
                                      ? getSortIconWinning(sortOrder_winning)
                                      : column.id == "profit_loss"
                                      ? getSortIconProfLoss(
                                          sortOrder_profit_loss
                                        )
                                      : column.id == "no_bet"
                                      ? getSortIconNoBet(sortedOrder_no_bet)
                                      : column.id == "no_win"
                                      ? getSortIconNoWin(sortedOrder_no_win)
                                      : ""} */}
                                </StyledTableCell>
                              ))}
                            </TableRow>
                          )}
                        </TableHead>
                        {displayAgentData()}
                      </Table>
                      {subLoader && <FuseLoading />}
                      {!agentData.length > 0 && !subLoader && (
                        <div
                          style={{
                            textAlign: "center",
                            color:'#fff',
                            padding: "0.95rem",
                          }}
                        >
                          {selectedLang.no_data_available_in_table}
                        </div>
                      )}
                    </TableContainer>
                    {(role["role"] == "admin" || role["role"] == "cs") && (
                      <TablePagination
                        rowsPerPageOptions={[20, 50, 100, 200, 500]}
                        component="div"
                        count={agentData?.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                        labelRowsPerPage={selectedLang.rows_per_page}
                      />
                    )}
                  </Paper>
                </CardContent>
                <div className="flex flex-wrap justify-center items-center mt-3 mb-5">
                  {month != previousMonthName && (
                    <Button
                      className="flex item-center"
                      variant="outlined"
                      color="secondary"
                      startIcon={
                        <ChevronLeftIcon size={20}></ChevronLeftIcon>
                      }
                      sx={{
                        borderRadius: "4px",
                      }}
                      onClick={(e) => {
                        getLastMonthData(e);
                      }}
                    >
                      {selectedLang.view_previous_month}
                    </Button>
                  )}
                  {month != currentMonth && (
                    <Button
                      className="flex item-center ml-4"
                      variant="contained"
                      color="secondary"
                      endIcon={
                        <ChevronRightIcon size={20}></ChevronRightIcon>
                      }
                      sx={{
                        borderRadius: "4px",
                      }}
                      onClick={(e) => {
                        getThisMonthData(e);
                      }}
                    >
                      {selectedLang.view_next_month}
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          }
        />
      )}
    </>
  );
}

export default agentRevenueStatisticsApp;
