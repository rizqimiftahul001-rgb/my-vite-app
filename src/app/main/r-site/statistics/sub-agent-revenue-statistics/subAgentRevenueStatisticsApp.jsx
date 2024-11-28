/** @format */

import React from "react";
import FusePageSimple from "@fuse/core/FusePageSimple";
import SubAgentRevenueStatisticsHeader from "./subAgentRevenueStatisticsHeader";
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
import Flatpickr from "react-flatpickr";
import InputBase from "@mui/material/InputBase";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import jwtDecode from "jwt-decode";
import DataHandler from "src/app/handlers/DataHandler";
import APIService from "src/app/services/APIService";
import FuseLoading from "@fuse/core/FuseLoading/FuseLoading";
import SearchIcon from "@mui/icons-material/Search";
import PopupState, { bindTrigger, bindMenu } from "material-ui-popup-state";
import { Menu } from "@mui/material";
import { useNavigate } from "react-router-dom";
import queryString from "query-string";
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

function subAgentRevenueStatisticsApp() {
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
    // { id: "no", label: `${selectedLang.date}`, minWidth: 100 },
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

  const [searchUsername, _searchUsername] = useState()

  const getSubAgentData = (firstDay, lastDay) => {
    setSubAgentData([]);
    setSubLoader(true);
    APIService({
      url: `${process.env.REACT_APP_R_SITE_API
        }/revenue/sub-agent-revenue-list?user_id=${user_id}&agent=${searchUsername || ""}&username=${agent || ""
        }&start_date=${startDate}&end_date=${endDate
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
          {Number(sumArray?.profitOrLoss || 0).toLocaleString()}
          {/* {sumArray?.profitOrLoss?.toLocaleString()} */}
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

  const [sortOrder_bet_money, setSortOrder_bet_money] = useState("");
  const [sortOrder_winning, setSortOrder_winning] = useState("");
  const [sortOrder_profit_loss, setSortOrder_profit_loss] = useState("");
  const [sortedOrder_no_bet, setSortedOrder_no_bet] = useState("");
  const [sortedOrder_no_win, setSortedOrder_no_win] = useState("");

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

  useEffect(() => {
    const handlePopstate = () => {
      // Reload the page when the user navigates back
      window.location.reload(true);
    };

    // Add the event listener when the component mounts
    window.addEventListener('popstate', handlePopstate);

    // Remove the event listener when the component unmounts
    return () => {
      window.removeEventListener('popstate', handlePopstate);
    };
  }, []);

  // const handleSort = (column) => {
  // 	if (
  // 		column == 'bet_money' ||
  // 		column == 'winning' ||
  // 		column == 'profit_loss' ||
  // 		column == 'no_bet' ||
  // 		column == 'no_win'
  // 	) {
  // 		if (column === 'bet_money') {
  // 			setSortBy('bet_money');
  // 			setSortOrder_bet_money(
  // 				sortOrder === 'asc' ? 'desc' : sortOrder === 'desc' ? '' : 'asc'
  // 			);
  // 			setSortOrder(
  // 				sortOrder === 'asc' ? 'desc' : sortOrder === 'desc' ? '' : 'asc'
  // 			);
  // 		} else if (column === 'winning') {
  // 			setSortBy('winning');
  // 			setSortOrder_winning(
  // 				sortOrder === 'asc' ? 'desc' : sortOrder === 'desc' ? '' : 'asc'
  // 			);
  // 			setSortOrder(
  // 				sortOrder === 'asc' ? 'desc' : sortOrder === 'desc' ? '' : 'asc'
  // 			);
  // 		} else if (column == 'profit_loss') {
  // 			setSortBy('profit_loss');
  // 			setSortOrder_profit_loss(
  // 				sortOrder === 'asc' ? 'desc' : sortOrder === 'desc' ? '' : 'asc'
  // 			);
  // 			setSortOrder(
  // 				sortOrder === 'asc' ? 'desc' : sortOrder === 'desc' ? '' : 'asc'
  // 			);
  // 		} else if (column == 'no_bet') {
  // 			setSortBy('no_bet');
  // 			setSortedOrder_no_bet(
  // 				sortOrder === 'asc' ? 'desc' : sortOrder === 'desc' ? '' : 'asc'
  // 			);
  // 			setSortOrder(
  // 				sortOrder === 'asc' ? 'desc' : sortOrder === 'desc' ? '' : 'asc'
  // 			);
  // 		} else if (column == 'no_win') {
  // 			setSortBy('no_win');
  // 			setSortedOrder_no_win(
  // 				sortOrder === 'asc' ? 'desc' : sortOrder === 'desc' ? '' : 'asc'
  // 			);
  // 			setSortOrder(
  // 				sortOrder === 'asc' ? 'desc' : sortOrder === 'desc' ? '' : 'asc'
  // 			);
  // 		}
  // 	}
  // };

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
          console.log(a?.agent - b?.agent);
          return sortOrder === "asc"
            ? a?.agent.localeCompare(b?.agent)
            : b?.agent.localeCompare(a?.agent);
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
                {/* <TableCell
                  sx={{
                    textAlign: "center",
                  }}
                >
                  {page * rowsPerPage + index + 1}
                </TableCell> */}
                {/* <TableCell
                  sx={{
                    textAlign: "center",
                  }}
                >
                  {agent?.date?.substring(0, 10)}
                </TableCell> */}
                <TableCell
                  className="row flex  justify-items-center"
                  sx={{
                    justifyContent: "space-between",
                    textAlign: "center",
                    // justifyContent: "center",
                    alignItems: "center",
                    // textAlign: "center",
                  }}
                >
                  {/* {agent.agent} */}
                  <PopupState variant="popover" popupId="demo-popup-menu">
                    {(popupState) => (
                      <React.Fragment>
                        <span
                          style={{
                            textDecoration: "underline",
                            cursor: "pointer",
                            fontWeight: "bold",
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
                              navigate(`/mypage?agent_id=${agent.agent_id}`);
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
                                `/agent/agentTreeList?q_agent=${agent.agent_id}`
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
                                `/statistics/statisticsByGame?agent_id=${agent.agent_id}`
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
                                `/providerManagement?agent_id=${agent.agent_id}`
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
                                `/gameManagement?agent_id=${agent.agent_id}`
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
                                `/statistics/APIerror?agent_id=${agent.agent_id}`
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

                  <div
                    className=" flex item-center"
                    style={{ marginLeft: "5px" }}
                  >
                    <Button
                      className="flex item-center buttonbox"
                      variant="contained"
                      color="secondary"
                      size="small"
                      sx={{
                        borderRadius: "4px",
                        width: "100px",
                      }}
                      onClick={() => {
                        navigate(
                          `/statistics/sub-agentRevenueStatistics?agent=${agent.agent}`,

                        );
                        window.location.reload(true);
                      }}
                    >
                      {selectedLang.bottom} ({agent?.bottom_count || 0})
                    </Button>
                  </div>
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
                  style={{
                    textAlign: "center",
                    fontWeight: "bold",
                    color:
                      Number(agent.revenue.profitOrLoss) < 0
                      ? "red"
                      : Number(agent.revenue.profitOrLoss) > 0
                      ? "#35cdd9"
                      : "white",
                  }}
                >
                  {Number(agent.revenue.profitOrLoss || 0).toLocaleString()}

                  {/* {agent.revenue.profitOrLoss} */}
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

  const onDataFilter = (startDate, endDate) => {
    
    // console.log(startDate, endDate);
    setEndDate(endDate)
    setStartDate(startDate)
 
  };

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
              {/* <div
                  className="row flex justify-end justify-items-center mainboxs"
                  style={{
                    flexWrap: "wrap",
                    padding: "18px",
                    paddingBottom: 0,
                  }}
                >
                  <div
                    className="flex item-center"
                    style={{ flexWrap: "wrap" }}
                  >
                   
                    <InputBase
                      className="inpbox"
                      sx={{
                        ml: 1,
                        flex: 1,
                        border: "1px solid #cdcfd3",
                        borderRadius: "4px",
                        padding: "4px 10px",
                        marginRight: "10px",
                        marginLeft: "0",
                      }}
                      // value={filterUser}
                      // onChange={(e) => _filterUser(e.target.value)}
                      placeholder={selectedLang.agent_id}
                      inputProps={{
                        "aria-label": `${selectedLang.USER}`,
                      }}
                    />
                  </div>
                  <div className="flex item-center">
                    <Button
                      className="flex item-center"
                      variant="contained"
                      color="secondary"
                      endIcon={<SearchIcon size={20}></SearchIcon>}
                      sx={{
                        borderRadius: "4px",
                      }}
                      // onClick={getAgentName}
                    >
                      {selectedLang.search}
                    </Button>
                  </div>
                </div> */}
              <div
                className="row flex flex-wrap"
                style={{
                  flexWrap: "wrap",
                  justifyContent: "flex-end",
                }}
              >
                {/* <div className="col-lg-2 col-md-4 col-sm-4 p-10 flex item-center"> */}

                {/* </div> */}
                {/* <div className="col-lg-2 col-md-4 col-sm-4 p-10 pl-0 flex item-center"> */}
                <div className="datepikers newdate_picker">
                  {/* <div className="d-flex datebox_wrapper">
                    <Flatpickr
                      options={{
                        locale: selectedLang.calander,
                      }}
                      data-enable-time
                      value={startDate}
                      onChange={(date) => setStartDate(date)}
                    />
                    <div className="text-white"> - </div>
                    <Flatpickr
                      options={{
                        locale: selectedLang.calander,
                      }}
                      data-enable-time
                      value={endDate}
                      onChange={(date) => setEndDate(date)}
                    />
                  </div> */}
                  <DatePicker onDataFilter={onDataFilter} />
                  <InputBase
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
                        setPage(0), getSubAgentData(firstDay, lastDay);
                      }}
                    >
                      {selectedLang.search}
                    </Button>
                  </div>
                </div>
                {/* </div> */}
              </div>
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
                                {column.id !== "no"
                                  ? getSortIconBetMoney(
                                    sortColoumns?.[column.id]
                                  )
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

export default subAgentRevenueStatisticsApp;
