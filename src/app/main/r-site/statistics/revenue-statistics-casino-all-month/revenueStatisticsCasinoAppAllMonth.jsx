/** @format */

import React from "react";
// import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import FusePageSimple from "@fuse/core/FusePageSimple";
import RevenueStatisticsCasinoHeaderAllMonth from "./revenueStatisticsCasinoHeaderAllMonth";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import { locale } from "../../../../configs/navigation-i18n";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { Button, CardActionArea, CardActions } from "@mui/material";
import "./revenueStatisticsCasinoAllMonth.css";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import { styled } from "@mui/material/styles";
import { selectUser } from "app/store/userSlice";
import DataHandler from "src/app/handlers/DataHandler";
import APIService from "src/app/services/APIService";
import FuseLoading from "@fuse/core/FuseLoading/FuseLoading";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import SearchIcon from "@mui/icons-material/Search";
import InputBase from "@mui/material/InputBase";
import { showMessage } from "app/store/fuse/messageSlice";
import moment from "moment";
import {
  casinoUserMenu,
  customSortFunction,
  formatSentence,
} from "src/app/services/Utility";
import "flatpickr/dist/themes/material_green.css";
import Flatpickr from "react-flatpickr";
import monthSelectPlugin from "flatpickr/dist/plugins/monthSelect";
import "flatpickr/dist/plugins/monthSelect/style.css";
import jwtDecode from "jwt-decode";
import { date } from "yup";
import ForwardIcon from "@mui/icons-material/Forward";
import { useNavigate } from "react-router-dom";
import PopupState, { bindTrigger, bindMenu } from "material-ui-popup-state";
import { Menu } from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSort } from '@fortawesome/free-solid-svg-icons';
import { faSortUp } from '@fortawesome/free-solid-svg-icons';
import { faSortDown } from '@fortawesome/free-solid-svg-icons';

const role = jwtDecode(DataHandler.getFromSession("accessToken"))["data"];
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
// todayDate.setDate(todayDate.getDate() + 1);
todayDate.setHours(0, 0, 0, 0);
// todayDate.setDate(1);
const nextMonthFirstDay = new Date();
nextMonthFirstDay.setDate(1);
nextMonthFirstDay.setMonth(nextMonthFirstDay.getMonth() + 1);
nextMonthFirstDay.setHours(0, 0, 0, 0);

const endOfCurrentMonth = new Date(nextMonthFirstDay);
endOfCurrentMonth.setDate(endOfCurrentMonth.getDate());
endOfCurrentMonth.setHours(23, 59, 59, 999);

function revenueStatisticsCasinoAppAllMonth() {
  const [userDetails, setUserDetails] = useState();
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const user_id = DataHandler.getFromSession("user_id");
  const [casinoUsers, setCasinoUsers] = useState([]);
  const [monthFirstDay, setMonthFirstDay] = useState(todayDate);
  const [monthLastDay, setMonthLastDay] = useState(endOfCurrentMonth);
  const [casinoUserName, setCasinoUserName] = useState("");
  const [agentUserName, setAgentUserName] = useState("");
  const [selectedprovider] = useSelector((state) => [
    state.provider.selectedprovider,
  ]);
  const [selectLocale] = useSelector((state) => [state.locale.selectLocale]);
  const [selectedLang, setSelectedLang] = useState(locale.en);
  const [loaded, setLoaded] = useState(true);
  const [loading1, setLoading1] = useState(true);
  const [sumArray, setSumArray] = useState();
  const navigate = useNavigate();
  useEffect(() => {
    if (loading1 == false) {
      setLoaded(false);
    }
  }, [loading1]);
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

  const columns = [
    { id: "number", label: `${selectedLang.number}`, minWidth: 20 },
    { id: "agent", label: `${selectedLang.agent_name}`, minWidth: 50 },
    { id: "casino", label: `${selectedLang.casino_user_id}`, minWidth: 50 },
    // { id: "date", label: `${selectedLang.date}`, minWidth: 50 },
    { id: "bet_money", label: `${selectedLang.bet_money}`, minWidth: 50 },
    
    { id: "refund_money", label: `${selectedLang.refund}`, minWidth: 50 },
    { id: "cancel_money", label: `${selectedLang.cancel}`, minWidth: 50 },
    { id: "winning", label: `${selectedLang.winning_amount}`, minWidth: 50 },
    {
      id: "profit_loss",
      label: `${selectedLang.revenue}`,
      minWidth: 50,
    },
    { id: "no_bet", label: `${selectedLang.no_of_bet}`, minWidth: 50 },
    { id: "no_win", label: `${selectedLang.no_of_wins}`, minWidth: 50 },
  ];

  useEffect(() => {
    const month_date = new Date();
    month_date.setHours(0, 0, 0, 0);

    if (month_date) {
      const year = month_date.getFullYear();
      const month = month_date.getMonth() + 1;

      const newMonthFirstDay = new Date(year, month - 1, 1);
      const newMonthEndDay = new Date(year, month, 0);
      newMonthEndDay.setHours(23, 59, 59, 999);
      setMonthFirstDay(newMonthFirstDay);
      setMonthLastDay(newMonthEndDay);
    } else {
      setMonthFirstDay(null);
      setMonthLastDay(null);
    }
  }, []);

  const handleDateChange = (dateFp) => {
    let date = dateFp[0]; //for flatPicker
    if (date) {
      const year = date.getFullYear();
      const month = date.getMonth() + 1;

      const newMonthFirstDay = new Date(year, month - 1, 1);
      const newMonthEndDay = new Date(year, month, 0);
      newMonthEndDay.setHours(23, 59, 59, 999);
      setMonthFirstDay(newMonthFirstDay);
      setMonthLastDay(newMonthEndDay);
    } else {
      setMonthFirstDay(null);
      setMonthLastDay(null);
    }
  };
  const handlePrevMonth = () => {
    if (monthFirstDay) {
      const prevMonthFirstDay = new Date(monthFirstDay);
      prevMonthFirstDay.setMonth(prevMonthFirstDay.getMonth() - 1);

      const prevMonthEndDay = new Date(
        prevMonthFirstDay.getFullYear(),
        prevMonthFirstDay.getMonth() + 1,
        0
      );
      prevMonthEndDay.setHours(23, 59, 59, 999);

      setMonthFirstDay(prevMonthFirstDay);
      setMonthLastDay(prevMonthEndDay);
    }
  };

  const handleNextMonth = () => {
    if (monthFirstDay) {
      const nextMonthFirstDay = new Date(monthFirstDay);
      nextMonthFirstDay.setMonth(nextMonthFirstDay.getMonth() + 1);

      const nextMonthEndDay = new Date(
        nextMonthFirstDay.getFullYear(),
        nextMonthFirstDay.getMonth() + 1,
        0
      );
      nextMonthEndDay.setHours(23, 59, 59, 999);

      setMonthFirstDay(nextMonthFirstDay);
      setMonthLastDay(nextMonthEndDay);
    }
  };
  useEffect(() => {
    const user_id = DataHandler.getFromSession("user_id");
    getUserDetails(user_id);
    getAgentName(firstDay, lastDay);
  }, [selectedprovider]);

  const getUserDetails = (user_id) => {
    APIService({
      url: `${process.env.REACT_APP_R_SITE_API}/user/details?user_id=${user_id}`,
      method: "GET",
    })
      .then((data) => {

        setUserDetails(data.data.data[0]);
        // props.setUserData(data.data.data[0]);
      })
      .catch((e) => console.log("Error : ", e))
      .finally(() => {
        setLoading1(false);
      });
  };

  const [loading, setLoading] = useState(false);

  const getAgentName = (firstDay, lastDay) => {
    setPage(0);
    setLoading(true);
    APIService({
      url: `${process.env.REACT_APP_R_SITE_API}/revenue/casino-user-revenue-all-month?user_id=${user_id}&casinoUserName=${casinoUserName}&agentUserName=${agentUserName}&provider_id=${selectedprovider}&start_date=${monthFirstDay}&end_date=${monthLastDay}`,
      method: "GET",
    })
      .then((res) => {
        // console.log(res)
        setCasinoUsers(res.data.data);
        setRowsPerPage(res.data.data.length);
      })
      .catch((err) => {
        dispatch(
          showMessage({
            variant: "error",
            message: `${selectedLang[`${formatSentence(err?.error?.message)}`] ||
              selectedLang.something_went_wrong
              }`,
          })
        );
        setCasinoUsers([]);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const clickSearch = () => {
    if (!casinoUserName || !agentUserName) {
      dispatch(
        showMessage({
          variant: "error",
          message: `${selectedLang.Pleased_enter_agent_uid_and_casino_username}`,
        })
      );
    } else {
      setPage(0);
      setCasinoUsers([]);
      getAgentName(firstDay, lastDay);
    }
  };

  var date = new Date();
  var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
  var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);

  useEffect(() => {
    const _sumArray = {};
    const _casinoUsers = casinoUsers;
    // Loop through each object in the array
    _casinoUsers.forEach((obj) => {
      // Loop through each field in the object
      for (const field in obj) {
        const fieldValue = parseFloat(obj[field]);
        // If the field doesn't exist in the sumArray, initialize it with the current value
        if (!_sumArray[field]) {
          _sumArray[field] = fieldValue;
        } else {
          // If the field already exists in the sumArray, add the current value to it
          _sumArray[field] += fieldValue;
        }
      }
    });
    setSumArray(_sumArray);
  }, [casinoUsers]);
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
          {""}
        </TableCell>
        <TableCell
          sx={{
            textAlign: "center",
          }}
        >
          {Number(sumArray?.betAmount || 0)?.toLocaleString()}
        </TableCell>
        
        <TableCell
          sx={{
            textAlign: "center",
          }}
        >
          {Number(sumArray?.refund_total_sum || 0)?.toLocaleString()}
        </TableCell>
        <TableCell
          sx={{
            textAlign: "center",
          }}
        >
          {Number(sumArray?.cancel_total_sum || 0)?.toLocaleString()}
        </TableCell>
        <TableCell
          sx={{
            textAlign: "center",
          }}
        >
          {Number(sumArray?.winningAmount || 0)?.toLocaleString()}
        </TableCell>
        <TableCell
          sx={{
            textAlign: "center",
            fontWeight: "bold",
          }}
        >
          {Number(sumArray?.profitOrLoss || 0)?.toLocaleString()}
        </TableCell>
        <TableCell
          sx={{
            textAlign: "center",
          }}
        >
          {Number(sumArray?.numOfBets || 0)?.toLocaleString()}
        </TableCell>
        <TableCell
          sx={{
            textAlign: "center",
          }}
        >
          {Number(sumArray?.numOfWins || 0)?.toLocaleString()}
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

  const [sortBy, setSortBy] = useState("profit_loss"); // Default sorting column
  const [sortOrder, setSortOrder] = useState("desc"); // Default sorting order
  const [sortColoumns, setSortColoumns] = useState({ profit_loss: "desc" });

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

  const initCopystatCasinoUser = [...casinoUsers];

  const sortedAndMappedCasinoUser =
    sortOrder !== ""
      ? initCopystatCasinoUser.sort((a, b) => {
        if (sortBy == "bet_money") {
          return sortOrder === "asc"
            ? a?.betAmount - b?.betAmount
            : b?.betAmount - a?.betAmount;
        } else if (sortBy === "winning") {
          return sortOrder === "asc"
            ? a?.winningAmount - b?.winningAmount
            : b?.winningAmount - a?.winningAmount;
        } else if (sortBy == "profit_loss") {
          const val1 = a?.profitOrLoss;
          const val2 = b?.profitOrLoss;
          return customSortFunction(val1, val2, sortOrder);
        } else if (sortBy == "no_bet") {
          return sortOrder === "asc"
            ? a?.numOfBets - b?.numOfBets
            : b?.numOfBets - a?.numOfBets;
        } else if (sortBy == "no_win") {
          return sortOrder === "asc"
            ? a?.numOfWins - b?.numOfWins
            : b?.numOfWins - a?.numOfWins;
        } else if (sortBy == "date") {
          return sortOrder === "asc"
            ? a?.date.localeCompare(b?.date)
            : b?.date.localeCompare(a?.date);
        }
      })
      : initCopystatCasinoUser;


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



  const addTableData = () => {
    if (casinoUsers.length > 0) {
      return (
        <TableBody>
          {createSumRow()}
          {sortedAndMappedCasinoUser
            //.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            .map((data, index) => {
              return (
                <StyledTableRow hover role="checkbox" tabIndex={-1} key={index}>
                  <TableCell
                    sx={{
                      textAlign: "center",
                    }}
                  >
                    {page * rowsPerPage + index + 1}
                  </TableCell>
                  <TableCell
                    sx={{
                      textAlign: "center",
                    }}
                  >
                    {/* {data?.agent[0]} */}
                    <PopupState variant="popover" popupId="demo-popup-menu">
                      {(popupState) => (
                        <React.Fragment>
                          {/* <Button variant="contained" {...bindTrigger(popupState)}>
														Dashboard
													</Button> */}
                          <span
                            style={{
                              textDecoration: "underline",
                              cursor: "pointer",
                            }}
                            {...bindTrigger(popupState)}
                          >{data.agent}
                          </span>
                          <Menu {...bindMenu(popupState)}>
                            {/* {(role["role"] == "admin" ||
                              role["role"] == "cs" ||
                              myType == "2") && ( */}
                            <MenuItem
                              onClick={() => {
                                popupState.close;
                                navigate(
                                  `/mypage?agent_id=${data?.agent}`
                                );
                              }}
                            >
                              {selectedLang.MYPAGE}
                            </MenuItem>
                            {/* )} */}
                            <MenuItem
                              onClick={() => {
                                popupState.close;
                                navigate(
                                  `/agent/transactionHistory?agent=${data?.agent}`
                                );
                              }}
                            >
                              {selectedLang.TRANSACTIONHISTORYAGENT}
                            </MenuItem>
                            <MenuItem
                              onClick={() => {
                                popupState.close;
                                navigate(
                                  `/agent/agentTreeList?q_agent=${data?.agent_id}`
                                );
                              }}
                            >
                              {selectedLang.change_password}
                            </MenuItem>

                            <MenuItem
                              onClick={() => {
                                popupState.close;
                                navigate(
                                  `/statistics/agentRevenueStatistics?agent=${data?.agent}`
                                );
                              }}
                            >
                              {selectedLang.AGENTRSTATISTICS}
                            </MenuItem>
                            <MenuItem
                              onClick={() => {
                                popupState.close;
                                navigate(
                                  `/statistics/statisticsByGame?agent_id=${data?.agent_id}`
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
                                  `/providerManagement?agent_id=${data?.agent_id}`
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
                                  `/gameManagement?agent_id=${data?.agent_id}`
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
                                  `/statistics/APIerror?agent_id=${data?.agent_id}`
                                );
                              }}
                            >
                              {selectedLang.APIERRORLOG}
                            </MenuItem>
                            <hr style={{ border: "1px solid" }} />
                            <MenuItem
                              onClick={() => {
                                popupState.close;
                                navigate(`/user/userList?agent=${data?._id}`);
                              }}
                            >
                              {selectedLang.USERLIST}
                            </MenuItem>
                            <MenuItem
                              onClick={() => {
                                popupState.close;
                                navigate(
                                  `/user/transactionHistory?agent=${data?.agent}`
                                );
                              }}
                            >
                              {selectedLang.TRANSACTIONHISTORYUSER}
                            </MenuItem>
                            <MenuItem
                              onClick={() => {
                                popupState.close;
                                navigate(`/user/betHistory?agent=${data?.agent}`);
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
                      fontWeight: "bold",
                    }}
                  >
                    {/* {data?.casinoUser[0]} */}
                    {casinoUserMenu(
                      selectedLang,
                      data?.casinoUser[0],
                      navigate
                    )}

                    {/* {casinoUserMenu(
                      selectedLang,
                      data?.casinoUser[0],
                      navigate
                    )} */}
                  </TableCell>
                  {/* <TableCell
                    sx={{
                      textAlign: "center",
                    }}
                  >
                    {data?.date}
                  </TableCell> */}
                  <TableCell
                    sx={{
                      textAlign: "center",
                    }}
                  >
                    {Number(data?.betAmount)?.toLocaleString()}
                  </TableCell>
                  <TableCell
                    sx={{
                      textAlign: "center",
                    }}
                  >
                    {Number(data?.refund_total_sum)?.toLocaleString()}
                  </TableCell>

                  <TableCell
                    sx={{
                      textAlign: "center",
                    }}
                  >
                    {Number(data?.cancel_total_sum)?.toLocaleString()}
                  </TableCell>
                  <TableCell
                    style={{
                      textAlign: "center",
                      fontWeight: "bold",
                      color:
                      Number(data?.winningAmount) < 0
                        ? "red"
                        : Number(data?.winningAmount) > 0
                        ? "#35cdd9"
                        : "white",
                    }}
                  >
                    {Number(data?.winningAmount)?.toLocaleString()}
                  </TableCell>
                  <TableCell
                    style={{
                      textAlign: "center",
                      fontWeight: "bold",
                      color:
                      Number(data?.profitOrLoss || 0) < 0
                        ? "red"
                        : Number(data?.profitOrLoss || 0) > 0
                        ? "#35cdd9"
                        : "white",
                    }}
                  >
                    {Number(data?.profitOrLoss)?.toLocaleString()}
                  </TableCell>
                  <TableCell
                    sx={{
                      textAlign: "center",
                      fontWeight: "bold",
                    }}
                  >
                    {Number(data?.numOfBets)?.toLocaleString()}
                  </TableCell>
                  <TableCell
                    sx={{
                      textAlign: "center",
                    }}
                  >
                    {Number(data?.numOfWins)?.toLocaleString()}
                  </TableCell>
                </StyledTableRow>
              );
            })}
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
            <RevenueStatisticsCasinoHeaderAllMonth
              selectedLang={selectedLang}
            />
          }
          content={
            <Card
              sx={{ width: "100%", marginTop: "20px", borderRadius: "4px" }}
              className="main_card"
            >
              <div className="flex justify-start justify-items-center bg-gray p-10 list_title w-100">
                <span className="list-title">
                  {/* {user.data.displayName} ({userDetails?.id})'s */}
                  {/* {selectedLang.AGENTNAMEID}  */}
                  {/* {month}{" "}
                {curresntdata.getFullYear()} */}
                  {""} {selectedLang.REVENUESTATICS}
                </span>
              </div>

              <div className="row flex justify-end justify-items-center flex-wrap">
                <div className="flex" style={{ flexWrap: "wrap", gap: "10px" }}>
                  {/* <DateTimePicker
												className='datetimePiker one'
												style={{ width: 'auto' }}
												size='small'
												value={monthFirstDay}
												views={['year', 'month']}
												openTo='year'
												disableDay={true}
												// inputFormat="MMMM yyyy"
												inputFormat='yyyy/MM'
												onChange={handleDateChange}
												renderInput={(params) => (
													<TextField
														{...params}
														placeholder={selectedLang.SelectDate}
													/>
												)}
											/> */}
                  <div className="flex" style={{gap:"5px"}}>
                    <button
                      onClick={handlePrevMonth}
                      style={{ transform: "rotate(180deg)" }}
                    >
                      <ForwardIcon sx={{ color: 'white' }} />{" "}
                    </button>
                    <Flatpickr
                      data-enable-time
                      value={monthFirstDay}
                      onChange={handleDateChange}
                      options={{
                        dateFormat: "m/Y",
                        locale: selectedLang.calander,
                      }}
                    />
                    <button onClick={handleNextMonth}>
                      <ForwardIcon sx={{ color: 'white' }} />{" "}
                    </button>
                  </div>
                  {/* <Flatpickr
                        data-enable-time
                        value={monthFirstDay}
                        onChange={handleDateChange}
                        options={{
                          plugins: [
                            new monthSelectPlugin({
                              shorthand: true,
                              dateFormat: "m/Y",
                              altInput: true,
                              altFormat: "m/Y",
                              theme: "light",
                            }),
                          ],
                          static: true,
                          locale: selectedLang.calander,
                        }}
                      /> */}


                  {/* <DatePicker
                  showIcon
                  selected={monthFirstDay}
                  onChange={handleDateChange}
                  dateFormat="MMMM yyyy"
                  showMonthYearPicker
                  className="text-center"
                  placeholderText={selectedLang.period_start_date_time}
                /> */}
                  {/* <div className="px-5"> - </div>

                <DatePicker
                  showIcon
                  selected={monthLastDay}
                  onChange={(date) => setMonthLastDay(date)}
                  placeholderText={selectedLang.period_end_date_time}
                  showTimeSelect
                  timeFormat="HH:mm"
                  timeIntervals={15}
                  timeCaption="time"
                  dateFormat="MMMM d, yyyy h:mm aa"
                  className="text-center "
                /> */}
                  {/* {(role["role"] == "admin" || role["role"] == "cs") && ( */}
                  <InputBase
                    sx={{
                      flex: 1,
                      border: "1px solid #cdcfd3",
                      borderRadius: "4px",
                      padding: "4px 10px",
                    }}
                    value={agentUserName}
                    onChange={(e) => {
                      setAgentUserName(e.target.value);
                    }}
                    placeholder={`${selectedLang.agent_name} *`}
                    inputProps={{ "aria-label": "Casino Users" }}
                  />
                  <InputBase
                    sx={{
                      flex: 1,
                      border: "1px solid #cdcfd3",
                      borderRadius: "4px",
                      padding: "4px 10px",
                    }}
                    value={casinoUserName}
                    onChange={(e) => {
                      setCasinoUserName(e.target.value);
                    }}
                    placeholder={`${selectedLang.casino_users} *`}
                    inputProps={{ "aria-label": "Casino Users" }}
                  />
                  <Button
                    className="flex item-center"
                    variant="contained"
                    color="secondary"
                    endIcon={<SearchIcon size={20}></SearchIcon>}
                    sx={{
                      borderRadius: "4px",
                    }}
                    onClick={(e) => {
                      clickSearch();
                    }}
                  >
                    {selectedLang.search}
                  </Button>
                </div>
              </div>

              <CardContent>
                <Paper
                  sx={{
                    width: "100%",
                    overflow: "hidden",
                    borderRadius: "4px",
                  }}
                >
                  <TableContainer>
                    <Table aria-label="customized table">
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
                      {addTableData()}
                    </Table>
                    {!casinoUsers.length > 0 && !loading && (
                      <div
                        style={{
                          textAlign: "center",
                          color: '#fff',
                          padding: "0.95rem",
                        }}
                      >
                        {selectedLang.no_data_available_in_table}
                      </div>
                    )}
                    {loading && <FuseLoading />}
                  </TableContainer>
                  <TablePagination
                    rowsPerPageOptions={[20, 50, 100, 200, 500]}
                    component="div"
                    count={casinoUsers?.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    labelRowsPerPage={selectedLang.rows_per_page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                  />
                </Paper>
              </CardContent>
            </Card>
          }
        />
      )}
    </>
  );
}

export default revenueStatisticsCasinoAppAllMonth;

// const handleSort = (column) => {
//   if (
//     column == "bet_money" ||
//     column == "winning" ||
//     column == "profit_loss" ||
//     column == "no_bet" ||
//     column == "no_win"
//   ) {
//     if (column === "bet_money") {
//       setSortBy("bet_money");
//       setSortOrder_bet_money(
//         sortOrder === "asc" ? "desc" : sortOrder === "desc" ? "" : "asc"
//       );
//       setSortOrder(
//         sortOrder === "asc" ? "desc" : sortOrder === "desc" ? "" : "asc"
//       );
//     } else if (column === "winning") {
//       setSortBy("winning");
//       setSortOrder_winning(
//         sortOrder === "asc" ? "desc" : sortOrder === "desc" ? "" : "asc"
//       );
//       setSortOrder(
//         sortOrder === "asc" ? "desc" : sortOrder === "desc" ? "" : "asc"
//       );
//     } else if (column == "profit_loss") {
//       setSortBy("profit_loss");
//       setSortOrder_profit_loss(
//         sortOrder === "asc" ? "desc" : sortOrder === "desc" ? "" : "asc"
//       );
//       setSortOrder(
//         sortOrder === "asc" ? "desc" : sortOrder === "desc" ? "" : "asc"
//       );
//     } else if (column == "no_bet") {
//       setSortBy("no_bet");
//       setSortedOrder_no_bet(
//         sortOrder === "asc" ? "desc" : sortOrder === "desc" ? "" : "asc"
//       );
//       setSortOrder(
//         sortOrder === "asc" ? "desc" : sortOrder === "desc" ? "" : "asc"
//       );
//     } else if (column == "no_win") {
//       setSortBy("no_win");
//       setSortedOrder_no_win(
//         sortOrder === "asc" ? "desc" : sortOrder === "desc" ? "" : "asc"
//       );
//       setSortOrder(
//         sortOrder === "asc" ? "desc" : sortOrder === "desc" ? "" : "asc"
//       );
//     }
//   }
// };
