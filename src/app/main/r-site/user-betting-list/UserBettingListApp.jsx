/** @format */

import React from "react";
import FusePageSimple from "@fuse/core/FusePageSimple";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { locale } from "../../../configs/navigation-i18n";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import {
  Button,
  CardActionArea,
  CardActions,
  Menu,
  Tooltip,
} from "@mui/material";
import "./provider.css";
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

import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import InputBase from "@mui/material/InputBase";
import SearchIcon from "@mui/icons-material/Search";
import DataHandler from "src/app/handlers/DataHandler";
import jwtDecode from "jwt-decode";
import APIService from "src/app/services/APIService";
import { showMessage } from "app/store/fuse/messageSlice";
import FuseLoading from "@fuse/core/FuseLoading";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Unstable_Grid2";
import TextField from "@mui/material/TextField";
import DoneIcon from "@mui/icons-material/Done";
import Typography from "@mui/material/Typography";
import { headerLoadChanged } from "app/store/headerLoadSlice";
import moment from "moment";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { casinoUserMenu, formatSentence } from "src/app/services/Utility";
import queryString from "query-string";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSort } from '@fortawesome/free-solid-svg-icons';
import { faSortUp } from '@fortawesome/free-solid-svg-icons';
import { faSortDown } from '@fortawesome/free-solid-svg-icons';
import PopupState, { bindTrigger, bindMenu } from "material-ui-popup-state";
import { useNavigate } from "react-router-dom";
import UserBettingListHeader from "./UserBettingListHeader";

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
  "&:last-child TableCell, &:last-child th": {
    border: 0,
  },
}));

const todayDate = new Date();
todayDate.setDate(todayDate.getDate() + 1);
todayDate.setHours(23, 59, 59, 999);
// todayDate.setDate(1);

const threeDaysAgo = new Date(todayDate);
threeDaysAgo.setDate(todayDate.getDate() - 2);
threeDaysAgo.setHours(0, 0, 0, 0);

function UserBettingListApp() {
  const dispatch = useDispatch();
  const [subAgents] = useSelector((state) => [state.subAgents.subAgents]);
  const user_id = DataHandler.getFromSession("user_id");
  const role = jwtDecode(DataHandler.getFromSession("accessToken"))["data"];
  const [userList, setUserList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uid, setUid] = useState("");
  const [uidName, setUidName] = useState("");
  const [requested_amount, setrequested_amount] = useState(0);
  const [withdraw_amount, setwithdraw_amount] = useState(0);
  const [userListCount, setUserListCount] = useState(0);

  const { search } = window.location;

  const { agent } = queryString.parse(search);
  const [affiliateAgent, setAffiliateAgent] = useState(agent || "");

  const [agentt, setagent] = useState("");
  const [selectLocale] = useSelector((state) => [state.locale.selectLocale]);
  const [headerLoad] = useSelector((state) => [state.headerLoad.headerLoad]);
  const [selectedLang, setSelectedLang] = useState(locale.ko);

  const [startDate, setStartDate] = useState(threeDaysAgo);
  const [endDate, setEndDate] = useState(todayDate);

  const [sumArray, setSumArray] = useState("");

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

  useEffect(() => {
    setUserListCount(0);
    setUserList([]);
    setSumArray("");
    setLoading(true);
    getUserList();
  }, [page, rowsPerPage]);

  const [loaded, setLoaded] = useState(true);
  const [loading1, setLoading1] = useState(true);
  const [loading2, setLoading2] = useState(true);

  useEffect(() => {
    if (role["role"] == "admin" || role["role"] == "cs") {
      if (loading1 == false) {
        setLoaded(false);
      }
    } else {
      if (loading2 == false) {
        setLoaded(false);
      }
    }
  }, [loading1, loading2]);

  useEffect(() => {
    if (selectLocale == "ko") {
      setSelectedLang(locale.ko);
    } else {
      setSelectedLang(locale.en);
    }
  }, [selectLocale]);

  const [casino_user, setCasinoUser] = useState("");

  const [user, setUser] = useState("");

  const [userDetails, setUserDetails] = useState("");

  const getUserDetails = () => {
    APIService({
      url: `${process.env.REACT_APP_R_SITE_API}/user/details?user_id=${user_id}`,
      method: "GET",
    })
      .then((data) => {
        // console.log(data);

        setUserDetails(data.data.data[0]);
      })
      .catch((err) => {
        dispatch(
          showMessage({
            variant: "error",
            message: `${selectedLang[`${formatSentence(err?.message)}`] ||
              selectedLang.something_went_wrong
              }`,
          })
        );
      })
      .finally(() => {
        // setLoading3(false);
      });
  };

  useEffect(() => {
    getUserDetails();
  }, []);

  const getUserList = (sortBy, sortOrder_current) => {
    setLoading(true);
    if (role["role"] == "admin" || role["role"] == "cs") {
      APIService({
        url: `${process.env.REACT_APP_R_SITE_API
          }/user/admin-user-list-betting?user_id=${user_id}&pageNumber=${page + 1
          }&limit=${rowsPerPage}&affiliateAgent=${affiliateAgent}&agent=${casino_user}&startDate=${startDate}&endDate=${endDate}&sortBy=${sortBy}&orderby=${sortOrder_current}`,
        method: "GET",
      })
        .then((res) => {
          // console.log(res);
          setUserListCount(res.data.tableCount);
          setUserList(res?.data?.data);
          setSumArray(res?.data?.sumRowData);
          if (res["data"]) {
            setLoading(false);
          }
        })
        .catch((err) => {
          dispatch(
            showMessage({
              variant: "error",
              message: `${selectedLang[`${formatSentence(err?.message)}`] ||
                selectedLang.something_went_wrong
                }`,
            })
          );
        })
        .finally(() => {
          setLoading1(false);
        });
    } else {
      APIService({
        url: `${process.env.REACT_APP_R_SITE_API
          }/user/get-my-casino-users?user_id=${user_id}&pageNumber=${page + 1
          }&limit=${rowsPerPage}&agent=${affiliateAgent}&casino_user=${casino_user}&user=${user}&startDate=${startDate}&endDate=${endDate}}&sortBy=${sortBy}&orderby=${sortOrder_current}`,
        method: "GET",
      })
        .then((res) => {
          // console.log(res);
          setUserListCount(res.data.tableCount);
          setUserList(res?.data?.data);
          setSumArray(res?.data?.sumRowData);
          if (res["data"]) {
            setLoading(false);
          }
        })
        .catch((err) => {
          dispatch(
            showMessage({
              variant: "error",
              message: `${selectedLang[`${formatSentence(err?.message)}`] ||
                selectedLang.something_went_wrong
                }`,
            })
          );
        })
        .finally(() => {
          setLoading2(false);
        });
    }
  };

  const searchUserList = () => {
    setPage(0);
    setUserListCount(0);
    setUserList([]);
    setSumArray("");
    setLoading(true);
    getUserList();
  };

  function dateFormat(date) {
    var d = new Date(date);
    var date = d.getDate();
    var month = d.getMonth() + 1; // Since getMonth() returns month from 0-11 not 1-12
    var year = d.getFullYear();
    var newDate = year + "-" + month + "-" + date;
    return newDate;
  }

  function timeFormat(dateTime) {
    const regex = /([0-9]{4}-[0-9]{2}-[0-9]{2})?.([:0-9]+)/;
    const result = dateTime.match(regex);
    const resultTime = result[2];
    return resultTime;
  }

  const [open, setOpen] = React.useState(false);
  const handleOpen = (username, name) => {
    setUid(username);
    setUidName(name);
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
    setrequested_amount(0);
  };

  const [openWithdraw, setOpenWithdraw] = React.useState(false);
  const handleOpenWithdraw = (username, name) => {
    setUid(username);
    setUidName(name);
    setOpenWithdraw(true);
  };
  const handleCloseWithdraw = () => {
    setOpenWithdraw(false);
    setwithdraw_amount(0);
  };

  const createPayment = (e) => {
    e.preventDefault();

    if (requested_amount <= 0) {
      dispatch(
        showMessage({
          variant: "info",
          message: `${selectedLang.amount_must_be_more_than}`,
        })
      );
    }

    if (uid == "") {
      dispatch(
        showMessage({
          variant: "error",
          message: `${selectedLang.uuid_is_required || selectedLang.something_went_wrong
            }`,
        })
      );
    }

    if (requested_amount > 0 && uid != "") {
      APIService({
        //url: `${process.env.REACT_APP_R_SITE_API}/request-payment/create-casino-payment-by-rsite?uid=${uid}&amount=${requested_amount}`,
        url: `${process.env.REACT_APP_R_SITE_API
          }/transaction/create?amount=${requested_amount}&transaction_type=deposit&transaction_relation=${role["role"] == "admin" ? "admin_casino" : "agent_casino"
          }&to_user_id=${uid}`,
        method: "POST",
      })
        .then((data) => {
          setwithdraw_amount(0);
          setrequested_amount(0);
          dispatch(
            headerLoadChanged({
              headerLoad: !headerLoad,
            })
          );
          getUserList();
          setOpen(false);
          dispatch(
            showMessage({
              variant: "success",
              message: `${selectedLang.payment_success}`,
            })
          );
        })
        .catch((err) => {
          setOpen(false);
          setwithdraw_amount(0);
          setrequested_amount(0);
          dispatch(
            showMessage({
              variant: "error",
              message: `${selectedLang[`${formatSentence(err?.error?.message)}`] ||
                selectedLang.something_went_wrong
                }`,
            })
          );
        })
        .finally(() => { });
    }
  };

  const createWithdraw = (e) => {
    e.preventDefault();

    if (withdraw_amount <= 0) {
      dispatch(
        showMessage({
          variant: "info",
          message: `${selectedLang.amount_must_be_more_than}`,
        })
      );
    }

    if (uid == "") {
      dispatch(
        showMessage({
          variant: "error",
          message: `${selectedLang.uuid_is_required || selectedLang.something_went_wrong
            }`,
        })
      );
    }

    if (withdraw_amount > 0 && uid != "") {
      APIService({
        //url: `${process.env.REACT_APP_R_SITE_API}/request-withdraw/create-casino-withdraw-by-rsite?uid=${uid}&amount=${withdraw_amount}`,
        url: `${process.env.REACT_APP_R_SITE_API
          }/transaction/create?amount=${withdraw_amount}&transaction_type=withdraw&transaction_relation=${role["role"] == "admin" ? "admin_casino" : "agent_casino"
          }&to_user_id=${uid}`,
        method: "POST",
      })
        .then((data) => {
          setwithdraw_amount(0);
          setrequested_amount(0);
          dispatch(
            headerLoadChanged({
              headerLoad: !headerLoad,
            })
          );
          getUserList();
          setOpenWithdraw(false);
          dispatch(
            showMessage({
              variant: "success",
              message: `${selectedLang.widthdraw_success}`,
            })
          );
        })
        .catch((err) => {
          setOpenWithdraw(false);
          setwithdraw_amount(0);
          setrequested_amount(0);
          dispatch(
            showMessage({
              variant: "error",
              message: `${selectedLang[`${formatSentence(err?.error?.message)}`] ||
                selectedLang.something_went_wrong
                }`,
            })
          );
        })
        .finally(() => { });
    }
  };

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    maxWidth: 600,
    bgcolor: "background.paper",
    border: "2px solid #eaecf4",
    boxShadow: 24,
    borderRadius: 4,
    p: 4,
  };

  const columns = [
    {
      id: "number",
      label: `${selectedLang.number}`,
      minWidth: 50,
      numeric: true,
      disablePadding: false,
    },
    { id: "agent", label: `${selectedLang.Affiliated_Agent}`, minWidth: 50 },
    { id: "user", label: `${selectedLang.USER}`, minWidth: 50 },
    { id: "action", label: `${selectedLang.ACTION}`, minWidth: 50 },
    // { id: "user", label: `${selectedLang.GLOBALSETTING}`, minWidth: 50 },
    // { id: "user", label: `${selectedLang.SETTINGBYTYPE}`, minWidth: 50 },
    // { id: "user", label: `${selectedLang.VENDORSPECIFICSETTING}`, minWidth: 50 },
    // { id: "user", label: `${selectedLang.GAMESEPECIFSETTING}`, minWidth: 50 },
    // { id: "bet", label: `${selectedLang.this_month_bet}`, minWidth: 50 },
    // { id: "win", label: `${selectedLang.this_month_wing}`, minWidth: 100 },

    // {
    //     id: "profit",
    //     label: `${selectedLang.profit_and_loss}`,
    //     minWidth: 100,
    //     format: (value) => value.toLocaleString("en-US"),
    // },
    // {
    //     id: "current",
    //     label: `${selectedLang.current_holding}`,
    //     minWidth: 100,
    //     format: (value) => value.toLocaleString("en-US"),
    // },
    //   {
    //     id: "amount",
    //     label: `${selectedLang.amount}`,
    //     minWidth: 100,
    //     format: (value) => value.toLocaleString("en-US"),
    // },
    // {
    //   id: "currentAction",
    //   label: `${selectedLang.action}`,
    //   minWidth: 100,
    //   format: (value) => value.toLocaleString("en-US"),
    // },
    // {
    //     id: "date",
    //     label: `${selectedLang.sugn_up_date}`,
    //     minWidth: 100,
    //     format: (value) => value.toLocaleString("en-US"),
    // },
  ];

  const formatAmount = (amount) => {
    // Convert the amount to a number
    const numericAmount = Number(amount);

    // Check if the numericAmount is valid and not NaN
    if (!isNaN(numericAmount)) {
      // Use toLocaleString to format the amount with thousands separators
      return numericAmount.toLocaleString();
    } else {
      // If the amount is not a valid number, return the original value
      return amount;
    }
  };

  const handleTodayClick = () => {
    const today = new Date();
    const startOfDay = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
      0,
      0,
      0
    );
    const endOfDay = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
      23,
      59,
      59
    );
    setStartDate(startOfDay);
    setEndDate(endOfDay);
  };

  const handleYesterdayClick = () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const startOfDay = new Date(
      yesterday.getFullYear(),
      yesterday.getMonth(),
      yesterday.getDate(),
      0,
      0,
      0
    );
    const endOfDay = new Date(
      yesterday.getFullYear(),
      yesterday.getMonth(),
      yesterday.getDate(),
      23,
      59,
      59
    );
    setStartDate(startOfDay);
    setEndDate(endOfDay);
  };
  // total calc
  // useEffect(() => {
  // 	const _sumArray = {};

  // 	userList?.forEach((obj) => {
  // 		const subObj = obj.CasinoUserData;
  // 		for (const field in subObj) {
  // 			const fieldValue = parseFloat(subObj[field]);

  // 			if (!_sumArray[field]) {
  // 				_sumArray[field] = fieldValue;
  // 			} else {
  // 				_sumArray[field] += fieldValue;
  // 			}
  // 		}
  // 	});

  // 	setSumArray(_sumArray);
  // }, [userList]);

  // total row UI admin
  const createTotalRow = () => {
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
          {sumArray.length > 0 &&
            Number(sumArray[0]?.totalMonthBet || 0)?.toLocaleString()}
        </TableCell>
        <TableCell
          sx={{
            textAlign: "center",
          }}
        >
          {sumArray.length > 0 &&
            Number(sumArray[0]?.totalThisMonthWin || 0)?.toLocaleString()}
        </TableCell>
        <TableCell
          sx={{
            textAlign: "center",
          }}
        >
          {sumArray.length > 0 &&
            Number(sumArray[0]?.totalThisMontProfit || 0).toLocaleString()}
        </TableCell>
        <TableCell
          sx={{
            textAlign: "center",
          }}
        >
          {sumArray.length > 0 &&
            Number(sumArray[0]?.totalBalance || 0).toLocaleString()}
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
      </StyledTableRow>
    );
  };

  const getSortIconBet = (order) => {
    return order === "asc" ? (
      <FontAwesomeIcon icon={faSortUp} className="sort-icon" />
    ) : order === "desc" ? (
      <FontAwesomeIcon icon={faSortDown} className="sort-icon" />
    ) : (
      <FontAwesomeIcon icon={faSort} className="sort-icon" />
    );
  };

  const getSortIconWin = (order) => {
    return order === "asc" ? (
      <FontAwesomeIcon icon={faSortUp} className="sort-icon" />
    ) : order === "desc" ? (
      <FontAwesomeIcon icon={faSortDown} className="sort-icon" />
    ) : (
      <FontAwesomeIcon icon={faSort} className="sort-icon" />
    );
  };

  const getSortIconProfit = (order) => {
    return order === "asc" ? (
      <FontAwesomeIcon icon={faSortUp} className="sort-icon" />
    ) : order === "desc" ? (
      <FontAwesomeIcon icon={faSortDown} className="sort-icon" />
    ) : (
      <FontAwesomeIcon icon={faSort} className="sort-icon" />
    );
  };

  const getSortIconCurrent = (order) => {
    return order === "asc" ? (
      <FontAwesomeIcon icon={faSortUp} className="sort-icon" />
    ) : order === "desc" ? (
      <FontAwesomeIcon icon={faSortDown} className="sort-icon" />
    ) : (
      <FontAwesomeIcon icon={faSort} className="sort-icon" />
    );
  };

  const [sortOrder_bet, setSortOrder_bet] = useState("");
  const [sortOrder_win, setSortOrder_win] = useState("");
  const [sortOrder_profit, setSortOrder_profit] = useState("asc");
  const [sortOrder_current, setSortOrder_current] = useState("");
  const [sortOrder_date, setSortOrder_date] = useState("");

  const [sortBy, setSortBy] = useState("profit"); // Default sorting column
  const [sortOrder, setSortOrder] = useState("asc"); // Default sorting order

  const navigate = useNavigate();

  const handleSort = (column) => {
    if (
      column == "bet" ||
      column == "win" ||
      column == "profit" ||
      column == "date" ||
      column == "current"
    ) {
      if (column === "bet") {
        setSortBy("bet");
        setSortOrder_bet(
          sortOrder === "asc" ? "desc" : sortOrder === "desc" ? "" : "asc"
        );
        setSortOrder(
          sortOrder === "asc" ? "desc" : sortOrder === "desc" ? "" : "asc"
        );
      } else if (column === "win") {
        setSortBy("win");
        setSortOrder_win(
          sortOrder === "asc" ? "desc" : sortOrder === "desc" ? "" : "asc"
        );
        setSortOrder(
          sortOrder === "asc" ? "desc" : sortOrder === "desc" ? "" : "asc"
        );
      } else if (column == "date") {
        setSortBy("date");
        setSortOrder_date(
          sortOrder === "asc" ? "desc" : sortOrder === "desc" ? "" : "asc"
        );
        setSortOrder(
          sortOrder === "asc" ? "desc" : sortOrder === "desc" ? "" : "asc"
        );
        getUserList(
          "date",
          sortOrder === "asc" ? "desc" : sortOrder === "desc" ? "" : "asc"
        );
      } else if (column == "profit") {
        setSortBy("profit");
        setSortOrder_profit(
          sortOrder === "asc" ? "desc" : sortOrder === "desc" ? "" : "asc"
        );
        setSortOrder(
          sortOrder === "asc" ? "desc" : sortOrder === "desc" ? "" : "asc"
        );
        getUserList(
          "profit",
          sortOrder === "asc" ? "desc" : sortOrder === "desc" ? "" : "asc"
        );
      } else {
        setSortBy("current");
        setSortOrder_current(
          sortOrder === "asc" ? "desc" : sortOrder === "desc" ? "" : "asc"
        );
        setSortOrder(
          sortOrder === "asc" ? "desc" : sortOrder === "desc" ? "" : "asc"
        );
        getUserList(
          "current",
          sortOrder_current === "asc"
            ? "desc"
            : sortOrder_current === "desc"
              ? ""
              : "asc"
        );
      }
    }
  };

  const initCopyUserData = [...userList];

  const sortedAndMappedDataUserList =
    sortOrder !== ""
      ? initCopyUserData.sort((a, b) => {
        if (sortBy === "bet") {
          return sortOrder === "asc"
            ? a?.CasinoUserData["month_bet"] - b?.CasinoUserData["month_bet"]
            : b.CasinoUserData["month_bet"] - a.CasinoUserData["month_bet"];
        } else if (sortBy == "win") {
          return sortOrder === "asc"
            ? a.CasinoUserData["month_win"] - b.CasinoUserData["month_win"]
            : b.CasinoUserData["month_win"] - a.CasinoUserData["month_win"];
        } else if (sortBy == "profit") {
          return sortOrder === "asc"
            ? a.CasinoUserData["month_profit_amount"] -
            b.CasinoUserData["month_profit_amount"]
            : b.CasinoUserData["month_profit_amount"] -
            a.CasinoUserData["month_profit_amount"];
        }
        // else {
        // 	return sortOrder === 'asc'
        // 		? a.CasinoUserData.balance_amount -
        // 				b.CasinoUserData.balance_amount
        // 		: b.CasinoUserData.balance_amount -
        // 				a.CasinoUserData.balance_amount;
        // }
      })
      : initCopyUserData;

  const renderUserlist = () => {
    if (role["role"] == "admin" || role["role"] == "cs") {
      return (
        <TableBody>
          {/* {userList.length > 0 && createTotalRow()} */}
          {sortedAndMappedDataUserList
            // .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            .map((user, index) => (
              <StyledTableRow
                className="custom-table"
                hover
                role="checkbox"
                tabIndex={-1}
                key={index}
              >
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
                  {/* {user?.AgentUsers?.id} */}
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
                          {user?.AgentUsers?.id}
                        </span>
                        {/* {subAgents.length > 0 &&
                          subAgents.find((agent) => agent.id == user?.id) && ( */}
                        <Menu {...bindMenu(popupState)}>
                          {/* {(role["role"] == "admin" ||
                              role["role"] == "cs" ||
                              myType == "2") && ( */}
                          <MenuItem

                            onClick={() => {
                              popupState.close;
                              navigate(
                                `/mypage?agent_id=${user?.AgentUsers?.user_id}`
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
                                `/agent/transactionHistory?agent=${user?.AgentUsers?.id}`
                              );
                            }}
                          >
                            {selectedLang.TRANSACTIONHISTORYAGENT}
                         
                          </MenuItem>
                          <MenuItem

                            onClick={() => {
                              popupState.close;
                              navigate(
                                `/agent/agentTreeList?q_agent=${user?.AgentUsers?.user_id}`
                              );
                            }}
                          >
                            {selectedLang.change_password}
                           
                          </MenuItem>

                          <MenuItem


                            onClick={() => {
                              popupState.close;
                              navigate(
                                `/statistics/agentRevenueStatistics?agent=${user?.AgentUsers?.id}`
                              );
                            }}
                          >
                            {selectedLang.AGENTRSTATISTICS}
                           
                          </MenuItem>
                          <MenuItem

                            onClick={() => {
                              popupState.close;
                              navigate(
                                `/statistics/statisticsByGame?agent_id=${user?.AgentUsers?.user_id}`
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
                                `/providerManagement?agent_id=${user?.AgentUsers?.user_id}`
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
                                `/gameManagement?agent_id=${user?.AgentUsers?.user_id}`
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
                                `/statistics/APIerror?agent_id=${user?.AgentUsers?.user_id}`
                              );
                            }}
                          >
                            {selectedLang.APIERRORLOG}
                          
                          </MenuItem>
                          <hr style={{ border: "1px solid" }} />
                          <MenuItem

                            onClick={() => {
                              popupState.close;
                              navigate(
                                `/user/userList?agent=${user?.AgentUsers?.id}`
                              );
                            }}
                          >
                            {selectedLang.USERLIST}
                          
                          </MenuItem>
                          <MenuItem

                            onClick={() => {
                              popupState.close;
                              navigate(
                                `/user/transactionHistory?agent=${user?.AgentUsers?.id}`
                              );
                            }}
                          >
                            {selectedLang.TRANSACTIONHISTORYUSER}
                          
                          </MenuItem>
                          <MenuItem

                            onClick={() => {
                              popupState.close;
                              navigate(
                                `/user/betHistory?agent=${user?.AgentUsers?.id}`
                              );
                            }}
                          >
                            {selectedLang.BETHISTORY}
                            
                          </MenuItem>
                        </Menu>
                        {/* )} */}
                      </React.Fragment>
                    )}
                  </PopupState>
                </TableCell>
                <TableCell
                  sx={{
                    textAlign: "center",
                  }}
                  style={{ fontWeight: "bold" }}
                >
                  {casinoUserMenu(
                    selectedLang,
                    user?.CasinoUserData["username"],
                    navigate
                  )}
                  {/* {user?.CasinoUserData['username']} */}
                </TableCell>
                {/* <TableCell
                                    sx={{
                                        textAlign: "center",
                                    }}
                                >
                                    {Number(user?.CasinoUserData["month_bet"])?.toLocaleString()}
                                </TableCell>
                                <TableCell
                                    sx={{
                                        textAlign: "center",
                                    }}
                                >
                                    {Number(user?.CasinoUserData["month_win"])?.toLocaleString()}
                                </TableCell>
                                <TableCell
                                    sx={{
                                        textAlign: "center",
                                        fontWeight: "bold",
                                    }}
                                >
                                    <span className="font-16">
                                        {Number(
                                            user?.CasinoUserData["month_profit_amount"]
                                        ).toLocaleString()}
                                    </span>
                                </TableCell>
                                <TableCell
                                    sx={{
                                        textAlign: "center",
                                    }}
                                >
                                    {Number(
                                        user?.CasinoUserData.balance_amount
                                    )?.toLocaleString()}
                                </TableCell> */}
                {/* <TableCell
                                    sx={{
                                        textAlign: "center",
                                    }}
                                >
                                    0
                                </TableCell> */}
                {/* <TableCell
                                    sx={{
                                        textAlign: "center",
                                    }}
                                >
                                    0
                                </TableCell> */}
                <TableCell
                  sx={{
                    textAlign: "center",
                  }}
                >
                  <Button
                    // className="flex item-center buttonbox"
                    variant="contained"
                    color="secondary"
                    size="small"
                    sx={{
                      borderRadius: "4px",
                    }}
                    onClick={() =>
                      navigate(
                        `/user-bet-limit?casinoUser=${user?.CasinoUserData?.user_id}`
                      )
                    }
                  >
                    {selectedLang.edit}
                  </Button>
                </TableCell>
                {/* <TableCell
                                    sx={{
                                        textAlign: "center",
                                    }}
                                >
                                    {moment(user?.CasinoUserData?.created_at).format(
                                        "YYYY/MM/DD HH:mm:ss"
                                    )}
                                </TableCell> */}
                {/* {dateFormat(user?.CasinoUserData?.created_at)} */}
              </StyledTableRow>
            ))}
        </TableBody>
      );
    } else {
      return (
        <TableBody>
          {/* {userList.length > 0 && createTotalRow()} */}
          {sortedAndMappedDataUserList
            // .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            .map((user, index) => (
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
                  {/* {user?.id} */}
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
                          {user?.id}
                        </span>
                        {/* {subAgents.length > 0 &&
                          subAgents.find((agent) => agent.id == user?.id) && ( */}
                        <Menu {...bindMenu(popupState)}>
                          {/* {(role["role"] == "admin" ||
                              role["role"] == "cs" ||
                              myType == "2") && ( */}
                          <MenuItem
                            onClick={() => {
                              popupState.close;
                              navigate(`/mypage?agent_id=${user?.user_id}`);
                            }}
                          >
                            {selectedLang.MYPAGE}
                          </MenuItem>
                          {/* )} */}
                          <MenuItem
                            onClick={() => {
                              popupState.close;
                              navigate(
                                `/agent/transactionHistory?agent=${user?.id}`
                              );
                            }}
                          >
                            {selectedLang.TRANSACTIONHISTORYAGENT}
                          </MenuItem>
                          <MenuItem
                            onClick={() => {
                              popupState.close;
                              navigate(
                                `/agent/agentTreeList?q_agent=${user?.user_id}`
                              );
                            }}
                          >
                            {selectedLang.change_password}
                          </MenuItem>

                          <MenuItem
                            onClick={() => {
                              popupState.close;
                              navigate(
                                `/statistics/agentRevenueStatistics?agent=${user?.id}`
                              );
                            }}
                          >
                            {selectedLang.AGENTRSTATISTICS}
                          </MenuItem>
                          <MenuItem
                            onClick={() => {
                              popupState.close;
                              navigate(
                                `/statistics/statisticsByGame?agent_id=${user?.user_id}`
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
                                `/providerManagement?agent_id=${user?.user_id}`
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
                                `/gameManagement?agent_id=${user?.user_id}`
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
                                `/statistics/APIerror?agent_id=${user?.user_id}`
                              );
                            }}
                          >
                            {selectedLang.APIERRORLOG}
                          </MenuItem>
                          <hr style={{ border: "1px solid" }} />
                          <MenuItem
                            onClick={() => {
                              popupState.close;
                              navigate(`/user/userList?agent=${user?.id}`);
                            }}
                          >
                            {selectedLang.USERLIST}
                          </MenuItem>
                          <MenuItem
                            onClick={() => {
                              popupState.close;
                              navigate(
                                `/user/transactionHistory?agent=${user?.id}`
                              );
                            }}
                          >
                            {selectedLang.TRANSACTIONHISTORYUSER}
                          </MenuItem>
                          <MenuItem
                            onClick={() => {
                              popupState.close;
                              navigate(`/user/betHistory?agent=${user?.id}`);
                            }}
                          >
                            {selectedLang.BETHISTORY}
                          </MenuItem>
                        </Menu>
                        {/* )} */}
                      </React.Fragment>
                    )}
                  </PopupState>
                </TableCell>
                <TableCell
                  sx={{
                    textAlign: "center",
                  }}
                >
                  {/* {user?.CasinoUserData["username"]} */}
                  {casinoUserMenu(
                    selectedLang,
                    user?.CasinoUserData["username"],
                    navigate
                  )}
                </TableCell>
                <TableCell
                  sx={{
                    textAlign: "center",
                  }}
                >
                  <Button
                    // className="flex item-center buttonbox"
                    variant="contained"
                    color="secondary"
                    size="small"
                    sx={{
                      borderRadius: "4px",
                    }}
                    onClick={() =>
                      navigate(
                        `/user-bet-limit?casinoUser=${user?.CasinoUserData?.user_id}`
                      )
                    }
                  >
                    {selectedLang.edit}
                  </Button>
                </TableCell>
                {/* <TableCell
                                    sx={{
                                        textAlign: "center",
                                    }}
                                >
                                    Bacarrat
                                </TableCell> */}
                {/* <TableCell
                                    sx={{
                                        textAlign: "center",
                                    }}
                                >
                                    
                                </TableCell> */}
                {/* <TableCell
                                    sx={{
                                        textAlign: "center",
                                    }}
                                >
                                    
                                </TableCell> */}
                {/* <TableCell
                                    sx={{
                                        textAlign: "center",
                                    }}
                                >
                                    100
                                </TableCell> */}
                {/* <TableCell
                                    sx={{
                                        textAlign: "center",
                                    }}
                                >
                                    {user?.CasinoUserData["month_bet"]?.toLocaleString()}
                                </TableCell>
                                <TableCell
                                    sx={{
                                        textAlign: "center",
                                        fontWeight: "bold",
                                    }}
                                >
                                    {user?.CasinoUserData["month_win"]?.toLocaleString()}
                                </TableCell>
                                <TableCell
                                    sx={{
                                        textAlign: "center",
                                    }}
                                >
                                    <span className="font-16">
                                        {user?.CasinoUserData[
                                            "month_profit_amount"
                                        ]?.toLocaleString()}
                                    </span>
                                </TableCell>
                                <TableCell
                                    sx={{
                                        textAlign: "center",
                                    }}
                                >
                                    {user?.CasinoUserData["balance_amount"]?.toLocaleString()}
                                </TableCell> */}
                {/* <TableCell
                    sx={{
                      textAlign: "center",
                    }}>{user?.this_month_profit_lose_amount}</TableCell> */}

                {/* <TableCell
                                    sx={{
                                        textAlign: "center",
                                    }}
                                >
                                    {moment(user?.CasinoUserData?.created_at).format(
                                        "YYYY/MM/DD HH:mm:ss"
                                    )}
                                </TableCell> */}
                {/* {dateFormat(user?.CasinoUserData?.created_at)} */}
              </StyledTableRow>
            ))}
        </TableBody>
      );
    }
  };

  return (
    <>
      {/* <UserBettingListHeader /> */}
      {/* <Typography className="tracking-tight leading-8 main_title">
        <span>{selectedLang.USERBETTINGMANAGEMENT}</span>
      </Typography> */}
      {loaded ? (
        <FuseLoading />
      ) : (
        <FusePageSimple
          header={<UserBettingListHeader selectedLang={selectedLang} />}
          content={
            <Card
              sx={{ width: "100%", marginTop: "20px", borderRadius: "4px" }}
              className="main_card"
            >
              <Modal
                open={open}
                onClose={handleClose}
                className="small_modal"
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
              >
                <Box sx={style} className="Mymodal">
                  <button className="modalclosebtn" onClick={handleClose}>
                    <svg
                      className="svg-icon"
                      viewBox="0 0 1024 1024"
                      version="1.1"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M 590.265 511.987 l 305.521 -305.468 c 21.617 -21.589 21.617 -56.636 0.027 -78.252 c -21.616 -21.617 -56.663 -21.617 -78.279 0 L 512.012 433.735 L 206.544 128.213 c -21.617 -21.617 -56.635 -21.617 -78.252 0 c -21.616 21.589 -21.616 56.635 -0.027 78.252 L 433.76 511.987 L 128.211 817.482 c -21.617 21.59 -21.617 56.635 0 78.251 c 10.808 10.81 24.967 16.213 39.125 16.213 c 14.159 0 28.318 -5.403 39.126 -16.213 l 305.522 -305.468 L 817.48 895.788 C 828.289 906.597 842.447 912 856.606 912 s 28.317 -5.403 39.125 -16.212 c 21.618 -21.59 21.618 -56.636 0.028 -78.252 L 590.265 511.987 Z"
                        fill="#333333"
                      />
                    </svg>
                  </button>
                  <Typography
                    id="modal-modal-title"
                    variant="h5"
                    component="h2"
                    style={{ fontWeight: "700" }}
                  >
                    {selectedLang.create_payment}
                  </Typography>
                  <div>
                    <Grid
                      key={"grid-main"}
                      container
                      rowSpacing={1}
                      columnSpacing={{ xs: 1, sm: 2, md: 3 }}
                    >
                      <Grid xs={12} md={12} key={"grid-sub"}>
                        <Grid
                          key={"grid1"}
                          container
                          spacing={3}
                          sx={{
                            marginTop: "0px",
                            justifyContent: "flex-end",
                          }}
                        >
                          <Grid
                            xs={12}
                            md={12}
                            key={"grid3"}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              width: "100%",
                              paddingTop: "0",
                            }}
                          >
                            <Typography
                              id="modal-modal-title"
                              style={{ fontSize: "16px" }}
                            >
                              {selectedLang.casino_users} : {uidName}
                            </Typography>
                          </Grid>

                          <Grid
                            xs={12}
                            md={12}
                            key={"grid4"}
                            style={{ width: "100%" }}
                          >
                            <TextField
                              type="text"
                              fullWidth
                              size="small"
                              label={selectedLang.amount}
                              value={formatAmount(requested_amount)}
                              color="primary"
                              // onChange={(e) =>
                              //   setrequested_amount(Number(e.target.value))
                              // }
                              onChange={(e) => {
                                const inputValue = e.target.value;
                                const numericValue = inputValue.replace(
                                  /[^0-9.]/g,
                                  ""
                                );
                                setrequested_amount(numericValue);
                              }}
                            />
                          </Grid>
                          <Grid
                            key={"grid6"}
                            xs={12}
                            md={12}
                            style={{ width: "100%", paddingTop: "0" }}
                          >
                            {" "}
                            <Button
                              key={"button-1"}
                              className="flex justify-center"
                              variant="contained"
                              color="secondary"
                              style={{ width: "100%" }}
                              endIcon={
                                <DoneIcon
                                  key={"deone-icon"}
                                  size={20}
                                ></DoneIcon>
                              }
                              sx={{
                                borderRadius: "4px",
                              }}
                              onClick={(e) => createPayment(e)}
                            >
                              {selectedLang.payment}
                            </Button>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                  </div>
                </Box>
              </Modal>
              <Modal
                open={openWithdraw}
                onClose={handleCloseWithdraw}
                className="small_modal"
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
              >
                <Box sx={style} className="Mymodal">
                  <button
                    className="modalclosebtn"
                    onClick={handleCloseWithdraw}
                  >
                    <svg
                      className="svg-icon"
                      viewBox="0 0 1024 1024"
                      version="1.1"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M 590.265 511.987 l 305.521 -305.468 c 21.617 -21.589 21.617 -56.636 0.027 -78.252 c -21.616 -21.617 -56.663 -21.617 -78.279 0 L 512.012 433.735 L 206.544 128.213 c -21.617 -21.617 -56.635 -21.617 -78.252 0 c -21.616 21.589 -21.616 56.635 -0.027 78.252 L 433.76 511.987 L 128.211 817.482 c -21.617 21.59 -21.617 56.635 0 78.251 c 10.808 10.81 24.967 16.213 39.125 16.213 c 14.159 0 28.318 -5.403 39.126 -16.213 l 305.522 -305.468 L 817.48 895.788 C 828.289 906.597 842.447 912 856.606 912 s 28.317 -5.403 39.125 -16.212 c 21.618 -21.59 21.618 -56.636 0.028 -78.252 L 590.265 511.987 Z"
                        fill="#333333"
                      />
                    </svg>
                  </button>
                  <Typography
                    id="modal-modal-title"
                    variant="h5"
                    component="h2"
                    style={{ fontWeight: "700" }}
                  >
                    {selectedLang.create_withdraw}
                  </Typography>
                  <div className="">
                    <Grid
                      key={"grid-main"}
                      container
                      rowSpacing={1}
                      columnSpacing={{ xs: 1, sm: 2, md: 3 }}
                    >
                      <Grid xs={12} md={12} key={"grid-sub"}>
                        <Grid
                          key={"grid1"}
                          container
                          spacing={3}
                          sx={{
                            marginTop: "0px",
                            justifyContent: "flex-end",
                          }}
                        >
                          <Grid
                            xs={12}
                            md={12}
                            key={"grid3"}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              width: "100%",
                              paddingTop: "0",
                            }}
                          >
                            <Typography
                              id="modal-modal-title"
                              style={{ fontSize: "16px" }}
                            >
                              {selectedLang.casino_users} :
                              <span
                                style={{
                                  fontWeight: "600",
                                  paddingLeft: "6px",
                                  color: "#000",
                                }}
                              >
                                {uidName}
                              </span>
                            </Typography>
                          </Grid>
                          <Grid
                            xs={12}
                            md={12}
                            key={"grid4"}
                            style={{ width: "100%" }}
                          >
                            <TextField
                              type="text"
                              fullWidth
                              label={selectedLang.amount}
                              color="primary"
                              size="small"
                              // onChange={(e) =>
                              //   setwithdraw_amount(Number(e.target.value))
                              // }
                              value={formatAmount(withdraw_amount)}
                              onChange={(e) => {
                                const inputValue = e.target.value;
                                const numericValue = inputValue.replace(
                                  /[^0-9.]/g,
                                  ""
                                );
                                setwithdraw_amount(Number(numericValue));
                              }}
                            />
                          </Grid>
                          <Grid
                            key={"grid6"}
                            xs={12}
                            md={12}
                            style={{ width: "100%", paddingTop: "0" }}
                          >
                            {" "}
                            <Button
                              key={"button-1"}
                              className="flex justify-cebter"
                              variant="contained"
                              color="secondary"
                              style={{ width: "100%" }}
                              endIcon={
                                <DoneIcon
                                  key={"deone-icon"}
                                  size={20}
                                ></DoneIcon>
                              }
                              sx={{
                                borderRadius: "4px",
                              }}
                              onClick={(e) => createWithdraw(e)}
                            >
                              {selectedLang.withdraw}
                            </Button>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                  </div>
                </Box>
              </Modal>
              <div className="flex justify-start justify-items-center flex-col bg-gray p-16 w-100">
                <div className="flex justify-items-center items-center">
                  <span className="list-title">{selectedLang.USERLIST}</span>{" "}
                  <Chip
                    label={userList ? userList.length : 0}
                    size="small"
                    color="secondary"
                    sx={{ marginLeft: "10px" }}
                  />
                </div>
                {/* <div>
                <span className="small-text">
                  This month's history shows the total 07-01 00:00:00 ~ 07-19
                  23:59:59.
                </span>
              </div> */}
              </div>

              {/* <div className="row flex justify-end justify-items-center">
              <div className="col-lg-2 col-md-4 col-sm-4 p-10 flex item-center">
                <InputBase
                  sx={{
                    ml: 1,
                    flex: 1,
                    border: "1px solid #cdcfd3",
                    borderRadius: "4px",
                    padding: "4px",
                  }}
                  placeholder={selectedLang.Affiliated_Agent_ID}
                  inputProps={{ "aria-label": "Affiliated Agent ID" }}
                />
              </div>
              <div className="col-lg-8 col-md-4 col-sm-4 flex item-center">
                <InputBase
                  sx={{
                    ml: 1,
                    flex: 1,
                    border: "1px solid #cdcfd3",
                    borderRadius: "4px",
                    padding: "4px 10px",
                  }}
                  placeholder={selectedLang.user_id}
                  inputProps={{ "aria-label": "User ID" }}
                />
              </div>
              <div className="col-lg-2 col-md-4 col-sm-4 p-16 flex item-center">
                <Button
                  className="flex item-center"
                  variant="contained"
                  color="secondary"
                  endIcon={<SearchIcon size={20}></SearchIcon>}
                  sx={{
                    borderRadius: "4px",
                  }}>
                  {selectedLang.search}
                </Button>
              </div>
            </div> */}

              <div className="flex userlist_filter" style={{ flexWrap: "wrap",gap:"10px" }} >
                {/* <div className="datepikers">
                    <DateTimePicker
                      className="datetimePiker"
                      placeholder={"Start Date"}
                      size="small"
                      value={startDate}
                      inputFormat="yyyy/MM/dd HH:mm:ss"
                      onChange={(date) => setStartDate(date)}
                      renderInput={(params) => <TextField {...params} />}
                    />
                    <div className="px-5"> - </div>
                    <DateTimePicker
                      className="datetimePiker"
                      placeholder={"Start Date"}
                      size="small"
                      value={endDate}
                      inputFormat="yyyy/MM/dd HH:mm:ss"
                      onChange={(date) => setEndDate(date)}
                      renderInput={(params) => <TextField {...params} />}
                    />
                  </div> */}

                {/* <Tooltip title={selectedLang.today} placement="top" arrow>
                    <Button
                      className="flex item-center mybutton"
                      variant="contained"
                      color="secondary"
                      sx={{
                        borderRadius: "4px",
                      }}
                      onClick={handleTodayClick}>
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 461 480"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M459.399 177.82V103.778C459.366 74.6652 435.771 51.0709 406.658 51.0382H392.771V42.7105C392.651 19.0835 373.463 0 349.838 0C326.213 0 307.03 19.0826 306.903 42.7105V51.0373H151.791V42.7115C151.67 19.0835 132.482 0 108.858 0C85.2338 0 66.0511 19.0826 65.9222 42.7105V51.0373H52.0318C22.9219 51.0709 -0.672356 74.6652 -0.705078 103.778V427.258C-0.671394 456.371 22.9219 479.965 52.0318 479.999H406.658C435.771 479.965 459.366 456.372 459.398 427.259V185.431C460.233 182.962 460.233 180.288 459.398 177.819L459.399 177.82ZM349.839 23.7858C360.282 23.8003 368.745 32.2598 368.756 42.7105V67.9958C368.677 78.383 360.226 86.7627 349.831 86.7627C339.44 86.7627 330.993 78.383 330.911 67.9958V42.7115C330.922 32.2598 339.388 23.7974 349.839 23.7858ZM89.9284 42.7105C90.0111 32.3166 98.4591 23.936 108.849 23.936C119.244 23.936 127.688 32.3156 127.775 42.7105V67.9958C127.688 78.383 119.244 86.7627 108.85 86.7627C98.4591 86.7627 90.0111 78.383 89.9293 67.9958L89.9284 42.7105ZM52.0318 75.0483H66.5083C69.9595 95.7477 87.8659 110.921 108.851 110.921C129.839 110.921 147.746 95.7477 151.197 75.0483H307.493C310.944 95.7477 328.854 110.921 349.839 110.921C370.824 110.921 388.734 95.7477 392.181 75.0483H406.658C422.519 75.0675 435.369 87.9175 435.388 103.778V169.616H23.3059V103.782C23.3204 87.9214 36.1791 75.0675 52.0318 75.0483ZM406.658 455.987H52.0318C36.1781 455.969 23.3242 443.12 23.3059 427.259V193.626H435.388V427.259C435.369 443.12 422.519 455.97 406.658 455.989V455.987Z"
                          fill="white"
                        />
                        <path
                          d="M289.076 269.62L210.257 346.578L170.242 307.507C165.527 302.901 157.986 302.955 153.339 307.623C148.693 312.296 148.677 319.838 153.302 324.526L153.467 324.683L201.873 371.95C206.535 376.502 213.982 376.502 218.644 371.95L305.854 286.808C310.557 282.184 310.651 274.627 306.065 269.887C301.47 265.15 293.917 265.008 289.144 269.56L289.077 269.623L289.076 269.62Z"
                          fill="white"
                        />
                      </svg>
                    </Button>
                  </Tooltip>

                  <Tooltip title={selectedLang.yesterday} placement="top" arrow>
                    <Button
                      className="flex item-center mybutton"
                      variant="contained"
                      color="secondary"
                      // endIcon={<SearchIcon size={20}></SearchIcon>}
                      sx={{
                        borderRadius: "4px",
                      }}
                      onClick={handleYesterdayClick}>
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 480 480"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M432 32H384V16C384 11.7565 382.314 7.68687 379.314 4.68629C376.313 1.68571 372.243 0 368 0C363.757 0 359.687 1.68571 356.686 4.68629C353.686 7.68687 352 11.7565 352 16V32H128V16C128 11.7565 126.314 7.68687 123.314 4.68629C120.313 1.68571 116.243 0 112 0C107.757 0 103.687 1.68571 100.686 4.68629C97.6857 7.68687 96 11.7565 96 16V32H48C21.536 32 0 53.536 0 80V213.44C0 217.683 1.68571 221.753 4.68629 224.754C7.68687 227.754 11.7565 229.44 16 229.44C20.2435 229.44 24.3131 227.754 27.3137 224.754C30.3143 221.753 32 217.683 32 213.44V160H448V432C448 436.243 446.314 440.313 443.314 443.314C440.313 446.314 436.243 448 432 448H48C39.184 448 32 440.832 32 432V394.56C32 390.317 30.3143 386.247 27.3137 383.246C24.3131 380.246 20.2435 378.56 16 378.56C11.7565 378.56 7.68687 380.246 4.68629 383.246C1.68571 386.247 0 390.317 0 394.56V432C0 458.464 21.536 480 48 480H432C458.464 480 480 458.464 480 432V80C480 53.536 458.464 32 432 32ZM32 128V80C32 71.168 39.184 64 48 64H96C96 68.2435 97.6857 72.3131 100.686 75.3137C103.687 78.3143 107.757 80 112 80C116.243 80 120.313 78.3143 123.314 75.3137C126.314 72.3131 128 68.2435 128 64H352C352 68.2435 353.686 72.3131 356.686 75.3137C359.687 78.3143 363.757 80 368 80C372.243 80 376.313 78.3143 379.314 75.3137C382.314 72.3131 384 68.2435 384 64H432C436.243 64 440.313 65.6857 443.314 68.6863C446.314 71.6869 448 75.7565 448 80V128H32ZM107.312 235.312L54.624 288H240C244.243 288 248.313 289.686 251.314 292.686C254.314 295.687 256 299.757 256 304C256 308.243 254.314 312.313 251.314 315.314C248.313 318.314 244.243 320 240 320H54.624L107.312 372.688C108.84 374.164 110.059 375.929 110.898 377.882C111.736 379.834 112.178 381.933 112.196 384.058C112.214 386.182 111.81 388.289 111.005 390.255C110.201 392.222 109.013 394.008 107.51 395.51C106.008 397.013 104.222 398.201 102.255 399.005C100.289 399.81 98.182 400.214 96.0576 400.196C93.9331 400.178 91.8336 399.736 89.8815 398.898C87.9295 398.059 86.164 396.84 84.688 395.312L4.688 315.312C1.68846 312.312 0.00341606 308.243 0.00341606 304C0.00341606 299.757 1.68846 295.688 4.688 292.688L84.688 212.688C86.164 211.16 87.9295 209.941 89.8815 209.102C91.8336 208.264 93.9331 207.822 96.0576 207.804C98.182 207.786 100.289 208.19 102.255 208.995C104.222 209.799 106.008 210.987 107.51 212.49C109.013 213.992 110.201 215.778 111.005 217.745C111.81 219.711 112.214 221.818 112.196 223.942C112.178 226.067 111.736 228.166 110.898 230.118C110.059 232.071 108.84 233.836 107.312 235.312Z"
                          fill="white"
                        />
                      </svg>
                    </Button>
                  </Tooltip> */}
                <InputBase
                  sx={{
                    flex: 1,
                    border: "1px solid #cdcfd3",
                    borderRadius: "4px",
                    padding: "4px 10px",
                  }}
                  placeholder={selectedLang.agent_id}
                  value={affiliateAgent}
                  onChange={(e) => setAffiliateAgent(e.target.value)}
                  inputProps={{
                    "aria-label": selectedLang.agent_id,
                  }}
                />
                <InputBase
                  sx={{
                    flex: 1,
                    border: "1px solid #cdcfd3",
                    borderRadius: "4px",
                    padding: "4px 10px",
                  }}
                  placeholder={selectedLang.casino_users}
                  value={casino_user}
                  onChange={(e) => setCasinoUser(e.target.value)}
                  inputProps={{
                    "aria-label": selectedLang.casino_users,
                  }}
                />
                <Button
                  className="flex item-center"
                  variant="contained"
                  color="secondary"
                  endIcon={<SearchIcon size={20}></SearchIcon>}
                  sx={{
                    borderRadius: "4px",
                  }}
                  onClick={() => {
                    searchUserList();
                  }}
                >
                  {selectedLang.search}
                </Button>
              </div>

              <div>
                <CardContent>
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
                          {role["role"] == "admin" ? (
                            <TableRow>
                              {columns.map((column) => (
                                <StyledTableCell
                                  sx={{
                                    textAlign: "center",
                                    cursor:
                                      column.id === "bet" ||
                                        column.id === "win" ||
                                        column.id === "profit" ||
                                        column.id === "date" ||
                                        column.id == "current"
                                        ? "pointer"
                                        : "default",
                                  }}
                                  key={column.id}
                                  align={column.align}
                                  style={{ minWidth: column.minWidth }}
                                  onClick={() => handleSort(column.id)}
                                >
                                  {column.label}
                                  {column.id == "bet"
                                    ? getSortIconBet(sortOrder_bet)
                                    : column.id == "win"
                                      ? getSortIconWin(sortOrder_win)
                                      : column.id == "profit"
                                        ? getSortIconCurrent(sortOrder_profit)
                                        : column.id == "current"
                                          ? getSortIconCurrent(sortOrder_current)
                                          : column.id == "date"
                                            ? getSortIconCurrent(sortOrder_date)
                                            : ""}
                                </StyledTableCell>
                              ))}
                            </TableRow>
                          ) : (
                            <TableRow>
                              {columns
                                .filter(
                                  (column) =>
                                    !(
                                      (column.id === "currentAction" &&
                                        userDetails.wallet_type ===
                                        "seamless") ||
                                      (userDetails.wallet_type !==
                                        "seamless" &&
                                        column.id === "currentAction" &&
                                        userDetails.canPayment !== true)
                                    )
                                )

                                .map((column) => (
                                  <StyledTableCell
                                    sx={{
                                      textAlign: "center",
                                      cursor:
                                        column.id === "bet" ||
                                          column.id === "win" ||
                                          column.id === "profit" ||
                                          column.id === "date" ||
                                          column.id == "current"
                                          ? "pointer"
                                          : "default",
                                    }}
                                    key={column.id}
                                    align={column.align}
                                    style={{ minWidth: column.minWidth }}
                                    onClick={() => handleSort(column.id)}
                                  >
                                    {column.label}
                                    {column.id == "bet"
                                      ? getSortIconBet(sortOrder_bet)
                                      : column.id == "win"
                                        ? getSortIconWin(sortOrder_win)
                                        : column.id == "profit"
                                          ? getSortIconCurrent(sortOrder_profit)
                                          : column.id == "current"
                                            ? getSortIconCurrent(sortOrder_current)
                                            : column.id == "date"
                                              ? getSortIconCurrent(sortOrder_date)
                                              : ""}
                                  </StyledTableCell>
                                ))}
                            </TableRow>
                          )}
                        </TableHead>
                        {renderUserlist()}
                      </Table>

                      {!userList.length > 0 && !loading && (
                        <div
                          style={{
                            textAlign: "center",
                            padding: "0.95rem",
                            color: '#fff',
                            fontWeight: "normal",
                            fontSize: "14px",
                          }}
                        >
                          {selectedLang.no_data_available_in_table}
                        </div>
                      )}
                      {loading && <FuseLoading />}
                    </TableContainer>
                    <TablePagination
                      labelRowsPerPage={selectedLang.rows_per_page}
                      rowsPerPageOptions={[20, 50, 100, 200, 500]}
                      component="div"
                      count={userListCount}
                      rowsPerPage={rowsPerPage}
                      page={page}
                      onPageChange={handleChangePage}
                      onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                  </Paper>
                </CardContent>
              </div>
            </Card>
          }
        />
      )}
    </>
  );
}

export default UserBettingListApp;
