/** @format */

import React from "react";
import FusePageSimple from "@fuse/core/FusePageSimple";
import SubAgentRevenueStatisticsHeader from "./allAgentRevenueStatisticsHeader";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { locale } from "../../../../configs/navigation-i18n";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { Button, CardActionArea, CardActions } from "@mui/material";
import "./subagentRevenue.css";
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
import jwtDecode from "jwt-decode";
import DataHandler from "src/app/handlers/DataHandler";
import { customSortFunction } from "src/app/services/Utility";
import APIService from "src/app/services/APIService";
import FuseLoading from "@fuse/core/FuseLoading/FuseLoading";
import SearchIcon from "@mui/icons-material/Search";
import PopupState, { bindTrigger, bindMenu } from "material-ui-popup-state";
import { Menu } from "@mui/material";
import { useNavigate } from "react-router-dom";
import queryString from "query-string";
import Flatpickr from "react-flatpickr";
import 'flatpickr/dist/themes/light.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSort } from '@fortawesome/free-solid-svg-icons';
import { faSortUp } from '@fortawesome/free-solid-svg-icons';
import { faSortDown } from '@fortawesome/free-solid-svg-icons';
import DatePicker from "src/app/main/apps/calendar/DatePicker";

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
todayDate.setDate(todayDate.getDate());
todayDate.setHours(23, 59, 59, 999);

const threeDaysAgo = new Date(todayDate);
threeDaysAgo.setDate(todayDate.getDate());
threeDaysAgo.setHours(0, 0, 0, 0);

function allAgentRevenueStatisticsApp() {
  const [subAgentData, setSubAgentData] = useState([]);
  const navigate = useNavigate();
  const user_id = DataHandler.getFromSession("user_id");
  const [month, setMonth] = useState("");
  const [curresntdata, setCurrentData] = useState(new Date());
  const role = jwtDecode(DataHandler.getFromSession("accessToken"))["data"];
  const [monthFirstDay, setMonthFirstDay] = useState(firstDay);
  const [monthLastDay, setMonthLastDay] = useState(lastDay);
  const [agentName, setAgentName] = useState([]);
  const [subAgentName, setSubAgentName] = useState([]);
  const [changeAgent, setSelectedAgent] = useState(false);
  const [selectedprovider] = useSelector((state) => [
    state.provider.selectedprovider,
  ]);
  var date = new Date();
  var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
  var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);

  const currentDate = new Date();
  const currentMonth = currentDate.toLocaleString("default", { month: "long" });
  const previousMonthDate = new Date(currentDate);
  previousMonthDate.setMonth(currentDate.getMonth() - 1);
  const previousMonthName = previousMonthDate.toLocaleString("default", {
    month: "long",
  });



  const [selectLocale] = useSelector((state) => [state.locale.selectLocale]);
  const [selectedLang, setSelectedLang] = useState(locale.en);
  const [loaded, setLoaded] = useState(true);
  const [loading1, setLoading1] = useState(true);
  const [loading2, setLoading2] = useState(true);
  const [sumArray, setSumArray] = useState();
  const [subLoader, setSubLoader] = useState(true);
  const { search } = window.location;
  const { agent } = queryString.parse(search);

  const [searchUsername, _searchUsername] = useState(agent || "")

  const [startDate, setStartDate] = useState(threeDaysAgo);
  const [endDate, setEndDate] = useState(todayDate);
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
    // { id: "date", label: `${selectedLang.date}`, minWidth: 50 },
    { id: "agent_name", label: `${selectedLang.agent_name}`, minWidth: 50 },
    {
      id: "no_casino_user",
      label: `${selectedLang.casino_user_count}`,
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
      id: "refund_money",
      label: `${selectedLang.refund}`,
      minWidth: 50,
    },
    {
      id: "cancel_money",
      label: `${selectedLang.cancel}`,
      minWidth: 50,
    },
    {
      id: "profit_loss",
      label: `${selectedLang.revenue}`,
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

  useEffect(() => {
    getSubAgentData(firstDay, lastDay);
    getAgentName();
  }, [agent]);

  useEffect(() => {
    getSubAgentData(firstDay, lastDay);
    getAgentName();
  }, [selectedprovider]);

  const getThisMonthData = (e) => {
    e.preventDefault();
    var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    var currentDay = new Date(
      date.getFullYear(),
      date.getMonth() + 1,
      date.getDate()
    );
    setMonthFirstDay(firstDay);
    setMonthLastDay(currentDay);
    getSubAgentData(firstDay, lastDay);
  };

  const getLastMonthData = (e) => {
    e.preventDefault();
    const date = new Date();
    var firstDay = new Date(date.getFullYear(), date.getMonth() - 1, 1);
    var lastDay = new Date(date.getFullYear(), date.getMonth(), 0);

    setMonthFirstDay(firstDay);
    setMonthLastDay(lastDay);
    getSubAgentData(firstDay, lastDay);
  };

  const getSubAgentData = (firstDay, lastDay) => {
    setSubAgentData([]);
    setSubLoader(true);
    APIService({
      url: `${process.env.REACT_APP_R_SITE_API
        }/revenue/all-agent-revenue-list?user_id=${user_id}&username=${searchUsername || ""
        }&start_date=${startDate ? startDate : monthFirstDay}&end_date=${endDate ? endDate : monthLastDay
        }`,
      method: "GET",
    })
      .then((res) => {
        setSubAgentData(res.data.data.agentRevenue);
        setMonth(res.data.data.month);
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

  const selectAgent = (userId) => {
    setSelectedAgent(true);
    setSelectedUserId(userId);

    setLoading(true);
    APIService({
      url: `${config.rsite_api_url}/user/agent-name-list?user_id=${userId}&provider=${selectedprovider}`,
      method: "GET",
    })
      .then((res) => {
        setSubAgentName(res.data.data.UserDataResult.subAgentUsers);
      })
      .catch((err) => {
        setSubAgentName([]);
      })
      .finally(() => { });
  };
  useEffect(() => {
    const _sumArray = {};
    const _subAgentData = subAgentData;
    _subAgentData.forEach((obj) => {
      const subObj = obj?.revenue;
      for (const field in subObj) {
        const fieldValue = parseFloat(subObj[field]);

        if (!_sumArray[field]) {
          _sumArray[field] = fieldValue;
        } else {
          _sumArray[field] += fieldValue;
        }
      }
    });
    setSumArray(_sumArray);
  }, [subAgentData]);

  function convertToCustomFormat(isoDate) {
    const year = isoDate.slice(0, 4);
    const month = isoDate.slice(5, 7);
    const day = isoDate.slice(8, 10);
    const time = isoDate.slice(11, 19);

    return `${year}/${month}/${day} ${time}`;
  }

  const onDataFilter = (startDate, endDate) => {
    
    // console.log(startDate, endDate);
    setEndDate(endDate)
    setStartDate(startDate)
 
  };

  const createSumRow = () => {
    return (
      <StyledTableRow className="total-row" hover role="checkbox" tabIndex={-1}>
        <TableCell
          sx={{
            textAlign: "center",
          }}
        >
          {selectedLang.total}
        </TableCell>
        {/* <TableCell
          sx={{
            textAlign: "center",
          }}
        >
          {""}
        </TableCell> */}
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
          {Number(sumArray?.casinoUser || 0).toLocaleString()}
          {/* {sumArray?.casinoUser?.toLocaleString()} */}
        </TableCell>
        <TableCell
          sx={{
            textAlign: "center",
          }}
        >
          {Number(sumArray?.betAmount || 0).toLocaleString()}

          {/* {sumArray?.betAmount?.toLocaleString()} */}
        </TableCell>
        <TableCell
          sx={{
            textAlign: "center",
          }}
        >
          {Number(sumArray?.winningAmount || 0).toLocaleString()}
          {/* {sumArray?.winningAmount?.toLocaleString()} */}
        </TableCell>
        
        <TableCell
          sx={{
            textAlign: "center",
          }}
        >
          {Number(sumArray?.refund_total_sum || 0).toLocaleString()}

          {/* {sumArray?.betAmount?.toLocaleString()} */}
        </TableCell>
        <TableCell
          sx={{
            textAlign: "center",
          }}
        >
          {Number(sumArray?.cancel_total_sum || 0).toLocaleString()}

          {/* {sumArray?.betAmount?.toLocaleString()} */}
        </TableCell>
        <TableCell
          sx={{
            textAlign: "center",
          }}
        >
          {Number(sumArray?.profit_or_loss || 0).toLocaleString()}
        </TableCell>
        <TableCell
          sx={{
            textAlign: "center",
          }}
        >
          {Number(sumArray?.numOfBets || 0).toLocaleString()}
          {/* {sumArray?.numOfBets?.toLocaleString()} */}
        </TableCell>
        <TableCell
          sx={{
            textAlign: "center",
          }}
        >
          {Number(sumArray?.numOfWins || 0).toLocaleString()}

          {/* {sumArray?.numOfWins?.toLocaleString()} */}
        </TableCell>
      </StyledTableRow>
    );
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

  const [sortBy, setSortBy] = useState("name"); // Default sorting column
  const [sortOrder, setSortOrder] = useState("asc"); // Default sorting order
  const [sortColoumns, setSortColoumns] = useState({
    bet_money: "",
    winning: "",
    profit_loss: "",
    casino_user: "",
    no_bet: "",
    no_win: "",
    agent_name: "",
  });

  useEffect(() => {
    handleSort("profit_loss");
  }, []);

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

  const initCopySubAgentData = [...subAgentData];
  const sortedAndMappedSubAgentData =
    sortOrder !== ""
      ? initCopySubAgentData.sort((a, b) => {
        if (sortBy == "bet_money") {
          return sortOrder === "asc"
            ? a?.revenue.betAmount - b?.revenue.betAmount
            : b?.revenue.betAmount - a?.revenue.betAmount;
        } else if (sortBy === "winning") {
          return sortOrder === "asc"
            ? a?.revenue.winningAmount - b?.revenue.winningAmount
            : b?.revenue.winningAmount - a?.revenue.winningAmount;
        } else if (sortBy == "profit_loss") {
          const val1 = a?.revenue.profit_or_loss
          const val2 = b?.revenue.profit_or_loss
          return customSortFunction(val1, val2, sortOrder);
          return sortOrder === "asc"
            ? a?.revenue.profit_or_loss - b?.revenue.profit_or_loss
            : b?.revenue.profit_or_loss - a?.revenue.profit_or_loss;
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
          console.log(a?.agent - b?.agent);
          return sortOrder === "asc"
            ? a?.agent.localeCompare(b?.agent)
            : b?.agent.localeCompare(a?.agent);
        }else if (sortBy == "refund_money") {
          return sortOrder === "asc"
            ? a?.revenue.refund_total_sum - b?.revenue.refund_total_sum
            : b?.revenue.refund_total_sum - a?.revenue.refund_total_sum;
        }
        else if (sortBy == "cancel_money") {
          return sortOrder === "asc"
            ? a?.revenue.cancel_total_sum - b?.revenue.cancel_total_sum
            : b?.revenue.cancel_total_sum - a?.revenue.cancel_total_sum;
        }
      })
      : initCopySubAgentData;

  const displaySubAgentData = () => {
    if (subAgentData.length > 0) {
      return (
        <TableBody>
          {createSumRow()}
          {sortedAndMappedSubAgentData
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
                {/* <TableCell
                  sx={{
                    textAlign: "center",
                  }}
                >
                  {(agent?.date)}
                </TableCell> */}
                <TableCell
                  className=""
                  sx={{
                    textAlign: "center",
                  }}
                >
                  {/* {agent.agent} */}
                  <PopupState variant="popover" popupId="demo-popup-menu">
                    {(popupState) => (
                      <React.Fragment>
                        <span
                          className="w-100"
                          style={{
                            textDecoration: "underline",
                            cursor: "pointer",
                            textAlign: "center",
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
                              navigate(`/mypage?agent_id=${agent?.revenue?.user_id}`);
                            }}
                          >
                            {selectedLang.MYPAGE}
                          </MenuItem>
                          {/* )} */}
                          <MenuItem
                            onClick={() => {
                              popupState.close;
                              navigate(
                                `/agent/transactionHistory?agent=${agent.agent}`
                              );
                            }}
                          >
                            {selectedLang.TRANSACTIONHISTORYAGENT}
                          </MenuItem>
                          <MenuItem
                            onClick={() => {
                              popupState.close;
                              navigate(
                                `/agent/agentTreeList?q_agent=${agent?.revenue?.user_id}`
                              );
                            }}
                          >
                            {selectedLang.change_password}
                          </MenuItem>

                          <MenuItem
                            onClick={() => {
                              popupState.close;
                              navigate(
                                `/statistics/agentRevenueStatistics?agent=${agent.agent}`
                              );
                            }}
                          >
                            {selectedLang.AGENTRSTATISTICS}
                          </MenuItem>
                          <MenuItem
                            onClick={() => {
                              popupState.close;
                              navigate(
                                `/statistics/statisticsByGame?agent_id=${agent?.revenue?.user_id}`
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
                                `/providerManagement?agent_id=${agent?.revenue?.user_id}`
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
                                `/gameManagement?agent_id=${user_id}`
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
                                `/statistics/APIerror?agent_id=${agent?.revenue?.user_id}`
                              );
                            }}
                          >
                            {selectedLang.APIERRORLOG}
                          </MenuItem>
                          <hr style={{ border: "1px solid" }} />
                          <MenuItem
                            onClick={() => {
                              popupState.close;
                              navigate(`/user/userList?agent=${agent.agent}`);
                            }}
                          >
                            {selectedLang.USERLIST}
                          </MenuItem>
                          <MenuItem
                            onClick={() => {
                              popupState.close;
                              navigate(
                                `/user/transactionHistory?agent=${agent.agent}`
                              );
                            }}
                          >
                            {selectedLang.TRANSACTIONHISTORYUSER}
                          </MenuItem>
                          <MenuItem
                            onClick={() => {
                              popupState.close;
                              navigate(`/user/betHistory?agent=${agent.agent}`);
                            }}
                          >
                            {selectedLang.BETHISTORY}
                          </MenuItem>
                        </Menu>
                      </React.Fragment>
                    )}
                  </PopupState>
                </TableCell>
                <TableCell
                  sx={{
                    textAlign: "center",
                  }}
                >
                  {Number(agent.revenue.casinoUser || 0).toLocaleString()}

                  {/* {agent.revenue.casinoUser} */}
                </TableCell>
                <TableCell
                  sx={{
                    textAlign: "center",
                  }}
                >
                  {Number(agent.revenue?.betAmount || 0).toLocaleString()}
                  {/* {agent.revenue?.betAmount?.toLocaleString()} */}
                </TableCell>
                <TableCell
                  style={{
                    textAlign: "center",
                    fontWeight: "bold",
                    color:
                      Number(agent.revenue.winningAmount || 0) < 0
                        ? "red"
                        : Number(agent.revenue.winningAmount || 0) > 0
                        ? "#35cdd9"
                        : "white",
                  }}
                >
                  {Number(agent.revenue.winningAmount || 0).toLocaleString()}

                  {/* {agent.revenue.winningAmount} */}
                </TableCell>
                <TableCell
                  sx={{
                    textAlign: "center",
                  }}
                >
                  {Number(
                    agent.revenue?.refund_total_sum || 0
                  ).toLocaleString()}
                  {/* {agent.revenue?.betAmount?.toLocaleString()} */}
                </TableCell>
                <TableCell
                  sx={{
                    textAlign: "center",
                  }}
                >
                  {Number(
                    agent.revenue?.cancel_total_sum || 0
                  ).toLocaleString()}
                  {/* {agent.revenue?.betAmount?.toLocaleString()} */}
                </TableCell>
                <TableCell
                  style={{
                    textAlign: "center",
                    fontWeight: "bold",
                    color:
                      Number(agent.revenue.profit_or_loss || 0) < 0
                        ? "red"
                        : Number(agent.revenue.profit_or_loss || 0) > 0
                        ? "#35cdd9"
                        : "white",
                  }}
                >
                  {Number(agent.revenue.profit_or_loss || 0).toLocaleString()}
                </TableCell>
                <TableCell
                  sx={{
                    textAlign: "center",
                  }}
                >
                  {Number(agent.revenue.numOfBets || 0).toLocaleString()}

                  {/* {agent.revenue.numOfBets} */}
                </TableCell>
                <TableCell
                  sx={{
                    textAlign: "center",
                  }}
                >
                  {Number(agent.revenue.numOfWins || 0).toLocaleString()}

                  {/* {agent.revenue.numOfWins} */}
                </TableCell>
              </StyledTableRow>
            ))}
        </TableBody>
      );
    }
  };

  // useEffect(() => {
  //   const defaultStartDate = new Date(today);
  //   defaultStartDate.setDate(today.getDate() - 2);
  //   setStartDate(defaultStartDate);

  //   const defaultEndDate = new Date(today);
  //   defaultEndDate.setDate(today.getDate() - 0);
  //   setEndDate(defaultEndDate);
  // }, []);

  return (
    <>
      {" "}
      {loaded ? (
        <FuseLoading />
      ) : (
        <FusePageSimple
          header={
            <SubAgentRevenueStatisticsHeader selectedLang={selectedLang} />
          }
          content={
            <Card
              sx={{ width: "100%", marginTop: "20px", borderRadius: "4px" }}
              className="main_card"
            >
              <div className="flex justify-start justify-items-center bg-gray p-10 list_title w-100">
                <span className="list-title">
                  <span className="list-title">
                    {selectedLang.SUBAGENTRSTATISTICS} {month}{" "}
                    {curresntdata.getFullYear()}
                    {/* {""} {selectedLang.distribution_statistics} */}
                  </span>
                </span>
              </div>

              <div
                className="row flex flex-wrap"
                style={{
                  flexWrap: "wrap",
                  justifyContent: "flex-end",
                }}
              >
                <div
                  className="flex item-center calender"
                >
                  {/* <div className="col-lg-2 col-md-4 col-sm-4 p-10 flex item-center"> */}

                  {/* </div> */}
                  {/* <div className="col-lg-2 col-md-4 col-sm-4 p-10 pl-0 flex item-center"> */}
                  <div className="datepikers newdate_picker">
                    <div className="d-flex datebox-wrapper" style={{justifyContent:"center" , marginTop: "12px" }}>
                      {/* <Flatpickr
                        className="date-picker"
                        options={{
                          dateFormat: "Y/m/d",
                          locale: selectedLang.calander,
                        }}
                        data-enable-time
                        value={startDate}
                        onChange={(date) => setStartDate(date[0])}
                      />
                      <div className="text-white mx-2"> - </div>
                      <Flatpickr
                        className="date-picker"
                        options={{
                          dateFormat: "Y/m/d",
                          locale: selectedLang.calander,
                        }}
                        data-enable-time
                        value={endDate}
                        onChange={(date) => setEndDate(date[0])}
                      /> */}
                      <DatePicker onDataFilter={onDataFilter} />
                    </div>
                    <InputBase
                      className="mobile_margin"
                      sx={{
                        ml: 1,
                        flex: 1,
                        border: "1px solid #cdcfd3",
                        borderRadius: "4px",
                        padding: "4px 10px",
                        margin: "0",
                      }}
                      placeholder={selectedLang.agent_name}
                      // value={filterAgent}
                      onChange={(e) => _searchUsername(e.target.value)}
                      inputProps={{ "aria-label": "Agent Name" }}
                    />
                    <div className="d-flex flex">
                      <Button
                        className="flex item-center"
                        variant="contained"
                        color="secondary"
                        endIcon={<SearchIcon size={20}></SearchIcon>}
                        sx={{
                          borderRadius: "4px",

                        }}
                        onClick={() => {
                          // setPage(0), searchData();
                          getSubAgentData();
                        }}
                      >
                        {selectedLang.search}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
              {/* </div> */}


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
                                {column.id !== "no" && column.id !== "agent_name" && column.id !== "date"
                                  ? getSortIconBetMoney(sortColoumns?.[column.id])
                                  : ""}

                                {/* {column.id == "bet_money"
                                    ? getSortIconBetMoney(sortOrder_bet_money)
                                    : column.id == "winning"
                                    ? getSortIconWinning(sortOrder_winning)
                                    : column.id == "profit_loss"
                                    ? getSortIconProfLoss(sortOrder_profit_loss)
                                    : column.id == "no_bet"
                                    ? getSortIconNoBet(sortedOrder_no_bet)
                                    : column.id == "no_win"
                                    ? getSortIconNoWin(sortedOrder_no_win)
                                    : ""} */}
                              </StyledTableCell>
                            ))}
                          </TableRow>
                        </TableHead>
                        {displaySubAgentData()}
                      </Table>

                      {subLoader && <FuseLoading />}

                      {!subAgentData.length > 0 && !subLoader && (
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
                    <TablePagination
                      labelRowsPerPage={selectedLang.rows_per_page}
                      rowsPerPageOptions={[20, 50, 100, 200, 500]}
                      component="div"
                      count={subAgentData?.length}
                      rowsPerPage={rowsPerPage}
                      page={page}
                      onPageChange={handleChangePage}
                      onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                  </Paper>
                </CardContent>
                {/* <div className="flex justify-center items-center mt-3 mb-5">
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
                  </div> */}
              </div>
            </Card>
          }
        />
      )}
    </>
  );
}

export default allAgentRevenueStatisticsApp;
