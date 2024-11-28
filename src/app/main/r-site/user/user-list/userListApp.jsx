/** @format */

import React, { useRef } from "react";
import FusePageSimple from "@fuse/core/FusePageSimple";
import UserListHeader from "./userListHeader";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { locale } from "../../../../configs/navigation-i18n";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import {
  Button,
  CardActionArea,
  CardActions,
  Menu,
  Tooltip,
} from "@mui/material";
import "./userList.css";
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
import {
  casinoUserMenu,
  customSortFunction,
  formatSentence,
} from "src/app/services/Utility";
import queryString from "query-string";
import PopupState, { bindTrigger, bindMenu } from "material-ui-popup-state";
import { useNavigate } from "react-router-dom";
import Flatpickr from "react-flatpickr";
import { Autocomplete } from "@mui/material";
import { useLocation } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSort } from '@fortawesome/free-solid-svg-icons';
import { faSortUp } from '@fortawesome/free-solid-svg-icons';
import { faSortDown } from '@fortawesome/free-solid-svg-icons';
import DatePicker from "src/app/main/apps/calendar/DatePicker";
import { minWidth } from "@mui/system";


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
todayDate.setDate(todayDate.getDate() + 0);
todayDate.setHours(23, 59, 59, 999);
// todayDate.setDate(1);

const twoDaysAgo = new Date(todayDate);
twoDaysAgo.setDate(todayDate.getDate() - 1);
twoDaysAgo.setHours(0, 0, 0, 0);

function UserListApp() {
  const location = useLocation();
  const dispatch = useDispatch();
  const user_id = DataHandler.getFromSession("user_id");
  const role = jwtDecode(DataHandler.getFromSession("accessToken"))["data"];
  const [userList, setUserList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uid, setUid] = useState("");
  const [uidName, setUidName] = useState("");
  const [requested_amount, setrequested_amount] = useState(0);
  const [withdraw_amount, setwithdraw_amount] = useState(0);
  const [userListCount, setUserListCount] = useState(0);

  const [agentName, setAgentName] = useState([]);
  const [latestData,setLatestData] = useState({
    nickname:'',
    last_play_provider_id:'',
    last_play_vendor:'',
    last_play_game:'',
    last_play_lobbie:'',
    common_invest_token:'',
    invest_token:''
  });
  const { search } = window.location;
  const { agent } = queryString.parse(search);
  // const [affiliateAgent, setAffiliateAgent] = useState(role?.id ? role?.id : agent || "");
  const [affiliateAgent, setAffiliateAgent] = useState(agent || "");
  const [agentt, setagent] = useState("");
  const [selectLocale] = useSelector((state) => [state.locale.selectLocale]);
  const [headerLoad] = useSelector((state) => [state.headerLoad.headerLoad]);
  const [selectedLang, setSelectedLang] = useState(locale.ko);

  const [startDate, setStartDate] = useState(twoDaysAgo);
  const [endDate, setEndDate] = useState(todayDate);

  const [sumArray, setSumArray] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState(0);
  const [holdingAmount, setHoldingAmount] = useState(0);

  const [selectedprovider] = useSelector((state) => [
    state.provider.selectedprovider,
  ]);

  useEffect(() => {
    if (selectLocale == "ko") {
      setSelectedLang(locale.ko);
    } else {
      setSelectedLang(locale.en);
    }
  }, [selectLocale]);

  useEffect(() => {
    if (agent) {
      setAffiliateAgent(agent || "");
    }
  }, [location]);

  useEffect(() => {
    if (affiliateAgent) {
      
      getUserList(sortBy, sortOrder_current);
    }
  }, [location, affiliateAgent]);

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

  useEffect(() => {
    getAgentName();
  }, []);

  const addDynamicSearch = (event, newValue) => {
    setAffiliateAgent(newValue || "");
  };

  useEffect(() => {
    if (selectLocale == "ko") {
      setSelectedLang(locale.ko);
    } else {
      setSelectedLang(locale.en);
    }
  }, [selectLocale]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(500);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleMaxButtonClick = () => {
    setWithdrawAmount(holdingAmount);
  };

  const [age, setAge] = React.useState("");

  const handleChange = (event) => {
    setAge(event.target.value);
  };

  useEffect(() => {
    getUserList(sortBy, sortOrder_current);
  }, [page, rowsPerPage]);

  const [loaded, setLoaded] = useState(true);
  const [loading1, setLoading1] = useState(true);
  const [loading2, setLoading2] = useState(true);

  const [disableButton, setButtonStats] = useState(false);

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

  const { filter_user } = queryString.parse(search);

  const inputRef = useRef(filter_user || "")
  const handleInputChange = (e) => {
    inputRef.current = e.target.value;
  };

  const [user, setUser] = useState("");

  const [userDetails, setUserDetails] = useState("");
  const [sortOrder_bet, setSortOrder_bet] = useState("");
  const [sortOrder_win, setSortOrder_win] = useState("");
  const [sortOrder_profit, setSortOrder_profit] = useState("asc");
  const [sortOrder_current, setSortOrder_current] = useState("desc");
  const [sortOrder_date, setSortOrder_date] = useState("");

  const [sortBy, setSortBy] = useState("date"); // Default sorting column
  const [sortOrder, setSortOrder] = useState("asc"); // Default sorting order

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
          // const val1 = a.CasinoUserData["month_profit_amount"];
          // const val2 = b.CasinoUserData["month_profit_amount"];

          // return customSortFunction(val1, val2, sortOrder);
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


  const getUserDetails = () => {
    APIService({
      url: `${process.env.REACT_APP_R_SITE_API}/user/details?user_id=${user_id}`,
      method: "GET",
    })
      .then((data) => {
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

  useEffect(() => {
    // Check if agent is not undefined, null, or an empty string
    if (agent !== undefined && agent !== null && agent !== "") {
      // Set casino_user to the value of agent
      setAffiliateAgent(agent);
      getUserList(sortBy, sortOrder_current); // Convert agent to string if it's a number
    } else {
      // Set casino_user to empty string if agent is undefined, null, or empty
      setAffiliateAgent("");
    }
  }, [agent]);

  const getUserList = (sortBy, sortOrder_current) => {

    setLoading(true);
    if (role["role"] == "admin" || role["role"] == "cs") {
      APIService({
        url: `${process.env.REACT_APP_R_SITE_API
          }/user/admin-user-list?user_id=${user_id}&pageNumber=${page + 1
          }&limit=${rowsPerPage}&affiliateAgent=${affiliateAgent}&agent=${inputRef.current}&startDate=${startDate}&endDate=${endDate}&sortBy=${sortBy}&orderby=${sortOrder_current}`,
        method: "GET",
      })
        .then((res) => {
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
          }/user/user-list?user_id=${user_id}&pageNumber=${page + 1
          }&limit=${rowsPerPage}&agent=${affiliateAgent}&casino_user=${inputRef.current}&user=${user}&startDate=${startDate}&endDate=${endDate}&sortBy=${sortBy}&orderby=${sortOrder_current}`,
        method: "GET",
      })
        .then((res) => {
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

    getUserList(sortBy, sortOrder_current);
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

  const getLatestCasinoUserData = (casino_user_id)=>{
    APIService({
      url: `${process.env.REACT_APP_R_SITE_API}/user/casino-user/details?casino_user_id=${casino_user_id}`,
      method: "GET",
    })
      .then((res) => {
        setLatestData(
          {
            nickname:res?.data?.data[0]?.nickname || '',
            last_play_provider_id:res?.data?.data[0]?.last_play_provider_id || '',
            last_play_vendor:res?.data?.data[0]?.last_play_vendor || '',
            last_play_game:res?.data?.data[0]?.last_play_game || '',
            last_play_lobbie:res?.data?.data[0]?.last_play_lobbie || '',
            invest_token:res?.data?.data[0]?.invest_token || '',
            common_invest_token:res?.data?.data[0]?.common_invest_token || '',
          }
        )
        setOpenWithdraw2(true)
      })
      .catch((err) => {
        setLatestData([]);
      })
      .finally(() => {
        setLoading2(false);
      });
  }

  const [open, setOpen] = React.useState(false);
  const [currHolding, setCurrHolding] = React.useState(0);
  const [openWithdraw2, setOpenWithdraw2] = React.useState(false);

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

  const handleOpenWithdraw2 = (casino_user_id) => {
    setOpenWithdraw2(true);
  };

  const handleCloseWithdraw2 = () => {
    setOpenWithdraw2(false);
  };

  const handleOpenWithdraw = (username, name, curenthol) => {
    setCurrHolding(curenthol);
    
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
      setButtonStats(true);
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
          getUserList(sortBy, sortOrder_current);

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
        .finally(() => {
          setButtonStats(false);
        });
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
      setButtonStats(true);
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
          getUserList(sortBy, sortOrder_current);
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
        .finally(() => {
          setButtonStats(false);
        });
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
    { id: "bet", label: `${selectedLang.bet_details}`, minWidth: 50 },
    { id: "win", label: `${selectedLang.win_amount}`, minWidth: 100 },
    
    {
      id: "profit",
      label: `${selectedLang.monthly_net}`,
      minWidth: 100,
      format: (value) => value.toLocaleString("en-US"),
    },
    {
      id: "current",
      label: `${selectedLang.current_holding}`,
      minWidth: 100,
      format: (value) => value.toLocaleString("en-US"),
    },
    {
      id: "currentAction",
      label: `${selectedLang.action}`,
      minWidth: 100,
      format: (value) => value.toLocaleString("en-US"),
    },
    {
      id: "date",
      label: `${selectedLang.sugn_up_date}`,
      minWidth: 100,
      format: (value) => value.toLocaleString("en-US"),
    },
  ];

  if (role["role"] == "admin" || role["role"] == "cs") {
    columns.splice(7, 0, {
      id: "casinoUser",
      label: `${selectedLang.lastStatus}`,
      minWidth: 50,
    });
  }

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
            Number(sumArray[0]?.betAmount || 0)?.toLocaleString()}
        </TableCell>
        <TableCell
          sx={{
            textAlign: "center",
          }}
        >
          {sumArray.length > 0 &&
            Number(sumArray[0]?.winningAmount || 0)?.toLocaleString()}
        </TableCell>
        <TableCell
          sx={{
            textAlign: "center",
          }}
        >
          {sumArray.length > 0 &&
            Number(sumArray[0]?.net_profit || 0).toLocaleString()}
        </TableCell>
        <TableCell
          sx={{
            textAlign: "center",
          }}
        >
          {sumArray.length > 0 &&
            Number(sumArray[0]?.totalBalance || 0).toLocaleString()}
        </TableCell>
        {role["role"] === "admin" && (
        <TableCell
          sx={{
            textAlign: "center",
          }}
        >
          {""}
        </TableCell>
        )}
        <TableCell
          sx={{
            textAlign: "center",
          }}
        >
          {""}
        </TableCell>
        {
          role["role"] == "admin" ? 
          <TableCell
          sx={{
              textAlign: "center",
            }}
          >
            {""}
          </TableCell>
          : <TableCell
          sx={{
              textAlign: "center",
            }}
          >
            {""}
          </TableCell>
        }
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

  // const initCopyUserData = [...userList];

  // const sortedAndMappedDataUserList =
  //   sortOrder !== ""
  //     ? initCopyUserData.sort((a, b) => {
  //       if (sortBy === "bet") {
  //         return sortOrder === "asc"
  //           ? a?.CasinoUserData["month_bet"] - b?.CasinoUserData["month_bet"]
  //           : b.CasinoUserData["month_bet"] - a.CasinoUserData["month_bet"];
  //       } else if (sortBy == "win") {
  //         return sortOrder === "asc"
  //           ? a.CasinoUserData["month_win"] - b.CasinoUserData["month_win"]
  //           : b.CasinoUserData["month_win"] - a.CasinoUserData["month_win"];
  //       } else if (sortBy == "profit") {
  //         return sortOrder === "asc"
  //           ? a.CasinoUserData["month_profit_amount"] -
  //           b.CasinoUserData["month_profit_amount"]
  //           : b.CasinoUserData["month_profit_amount"] -
  //           a.CasinoUserData["month_profit_amount"];
  //         // const val1 = a.CasinoUserData["month_profit_amount"];
  //         // const val2 = b.CasinoUserData["month_profit_amount"];

  //         // return customSortFunction(val1, val2, sortOrder);
  //       }
  //       // else {
  //       // 	return sortOrder === 'asc'
  //       // 		? a.CasinoUserData.balance_amount -
  //       // 				b.CasinoUserData.balance_amount
  //       // 		: b.CasinoUserData.balance_amount -
  //       // 				a.CasinoUserData.balance_amount;
  //       // }
  //     })
  //     : initCopyUserData;


 


  const renderUserlist = () => {
    if (role["role"] == "admin" || role["role"] == "cs") {
      return (
        <TableBody>
          {userList.length > 0 && createTotalRow()}
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
                  {/* {user?.CasinoUserData['username']} */}
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
                  {Number(user?.revenue["betAmount"])?.toLocaleString()}
                </TableCell>
                <TableCell
                  sx={{
                    textAlign: "center",
                  }}
                >
                  {Number(user?.revenue["winningAmount"])?.toLocaleString()}
                </TableCell>
                <TableCell
                  sx={{
                    textAlign: "center",
                    fontWeight: "bold",
                  }}
                >
                  <span className="font-16">
                    {Number(user?.revenue["net_profit"]).toLocaleString()}
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
                </TableCell>
                <TableCell
                  sx={{
                    textAlign: "center",
                  }}
                >
                  <div className="col-lg-8 col-md-4 col-sm-4 flex item-center">
                        <Button
                          className="flex item-center buttonbox"
                          variant="contained"
                          color="success"
                          size="small"
                          sx={{
                            borderRadius: "4px",
                          }}
                          onClick={() => getLatestCasinoUserData(user?.CasinoUserData.user_id)}
                        >
                          {selectedLang.status}
                        </Button>
                    </div>
                </TableCell>
                {userDetails?.canPayment == true && user?.AgentUsers?.wallet_type !== "seamless" ?
                (
                  <TableCell
                    sx={{
                      textAlign: "center",
                    }}
                  >
                    <div className="row flex justify-end justify-items-center">
                      <div className="col-lg-8 col-md-4 col-sm-4 flex item-center">
                        <Button
                          className="flex item-center buttonbox"
                          variant="contained"
                          color="secondary"
                          size="small"
                          sx={{
                            borderRadius: "4px",
                          }}
                          onClick={() =>
                            handleOpen(
                              user?.CasinoUserData.user_id,
                              user?.CasinoUserData.username
                            )
                          }
                        >
                          {selectedLang.payment}
                        </Button>
                      </div>
                      <div className="col-lg-2 col-md-4 col-sm-4 pl-10 flex item-center">
                        <Button
                          className="flex item-center buttonbox"
                          variant="contained"
                          color="success"
                          size="small"
                          sx={{
                            borderRadius: "4px",
                          }}
                          onClick={() =>
                            handleOpenWithdraw(
                              user?.CasinoUserData["user_id"],
                              user?.CasinoUserData["username"],
                              user?.revenue ? user.revenue["numOfBets"] : 2
                              // user?.CasinoUserData["numOfBets"]
                            )
                          }
                        >
                          {selectedLang.withdraw}
                        </Button>
                      </div>
                    </div>
                  </TableCell>
                ):
                <TableCell></TableCell>
              }
                <TableCell
                  sx={{
                    textAlign: "center",
                  }}
                >
                  {moment(user?.CasinoUserData?.created_at).tz('Asia/Seoul').format(
                    "YYYY/MM/DD HH:mm:ss"
                  )}

                  {/* {dateFormat(user?.CasinoUserData?.created_at)} */}
                </TableCell>
              </StyledTableRow>
            ))}
        </TableBody>
      );
    } else {
      return (
        <TableBody>
          {userList.length > 0 && createTotalRow()}
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
                        <Menu {...bindMenu(popupState)}>
                          {/* {(role["role"] == "admin" ||
                              role["role"] == "cs" ||
                              myType == "2") && ( */}
                           <MenuItem
                            onClick={() => {
                              popupState.close;
                              navigate(
                                `/mypage?agent_id=${user?.user_id}`
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
                                `/providerManagement?agent_id=${user?.id}`
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
                  {user?.CasinoUserData["revenue"][
                    "betAmount"
                  ]?.toLocaleString()}
                </TableCell>
                <TableCell
                  sx={{
                    textAlign: "center",
                    fontWeight: "bold",
                  }}
                >
                  {user?.CasinoUserData["revenue"][
                    "winningAmount"
                  ]?.toLocaleString()}
                </TableCell>
                <TableCell
                  sx={{
                    textAlign: "center",
                  }}
                >
                  <span className="font-16">
                    {user?.CasinoUserData["revenue"][
                      "net_profit"
                    ]?.toLocaleString()}
                  </span>
                </TableCell>
                <TableCell
                  sx={{
                    textAlign: "center",
                  }}
                >
                  {user?.CasinoUserData["balance_amount"]?.toLocaleString()}
                </TableCell>
                {/* <TableCell
                    sx={{
                      textAlign: "center",
                    }}>{user?.this_month_profit_lose_amount}</TableCell> */}

                {userDetails?.canPayment == true &&
                  userDetails?.wallet_type == "transfer" && (
                    <TableCell
                      sx={{
                        textAlign: "center",
                      }}
                    >
                      {user?.CasinoUserData["transaction"] && (
                        <div className="row flex justify-end justify-items-center">
                          <>
                            <div className="col-lg-8 col-md-4 col-sm-4 flex item-center">
                              <Button
                                className="flex item-center buttonbox"
                                variant="contained"
                                color="secondary"
                                size="small"
                                sx={{
                                  borderRadius: "4px",
                                }}
                                onClick={() =>
                                  handleOpen(
                                    user?.CasinoUserData.user_id,
                                    user?.CasinoUserData.username
                                  )
                                }
                              >
                                {selectedLang.payment}
                              </Button>
                            </div>
                            <div className="col-lg-2 col-md-4 col-sm-4 pl-10 flex item-center">
                              <Button
                                className="flex item-center buttonbox"
                                variant="contained"
                                color="success"
                                size="small"
                                sx={{
                                  borderRadius: "4px",
                                }}
                                onClick={() =>
                                  handleOpenWithdraw(
                                    user?.CasinoUserData["user_id"],
                                    user?.CasinoUserData["username"],
                                    user?.revenue
                                      ? user.revenue["numOfBets"]
                                      : 2
                                  )
                                }
                              >
                                {selectedLang.withdraw}
                              </Button>
                            </div>
                          </>
                        </div>
                      )}
                    </TableCell>
                  )}

                <TableCell
                  sx={{
                    textAlign: "center",
                  }}
                >
                  {moment(user?.CasinoUserData?.created_at).tz('Asia/Seoul').format(
                    "YYYY/MM/DD HH:mm:ss"
                  )}
                  {/* {dateFormat(user?.CasinoUserData?.created_at)} */}
                </TableCell>
              </StyledTableRow>
            ))}
        </TableBody>
      );
    }
  };

  const onDataFilter = (startDate, endDate) => {
    
   
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
          header={<UserListHeader selectedLang={selectedLang} />}
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
                              disabled={disableButton}
                              key={"button-2"}
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
                                  color: "#fff",
                                }}
                              >
                                {uidName}
                              </span>
                            </Typography>
                          </Grid>
                          <Grid
                            xs={12}
                            md={12}
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
                            key={"grid61"}
                            xs={12}
                            md={12}
                            style={{ width: "100%", paddingTop: "0" }}
                          >
                            {" "}
                            <Button
                              disabled={disableButton}
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
              <Modal
                  open={openWithdraw2}
                  className="small_modal"
                  onClose={handleCloseWithdraw2}
                  aria-labelledby="modal-modal-title"
                  aria-describedby="modal-modal-description">
                <Box sx={style} className="Mymodal">
                  <button className="modalclosebtn" onClick={handleCloseWithdraw2}>
                    <svg
                      className="svg-icon"
                      viewBox="0 0 1024 1024"
                      version="1.1"
                      xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M 590.265 511.987 l 305.521 -305.468 c 21.617 -21.589 21.617 -56.636 0.027 -78.252 c -21.616 -21.617 -56.663 -21.617 -78.279 0 L 512.012 433.735 L 206.544 128.213 c -21.617 -21.617 -56.635 -21.617 -78.252 0 c -21.616 21.589 -21.616 56.635 -0.027 78.252 L 433.76 511.987 L 128.211 817.482 c -21.617 21.59 -21.617 56.635 0 78.251 c 10.808 10.81 24.967 16.213 39.125 16.213 c 14.159 0 28.318 -5.403 39.126 -16.213 l 305.522 -305.468 L 817.48 895.788 C 828.289 906.597 842.447 912 856.606 912 s 28.317 -5.403 39.125 -16.212 c 21.618 -21.59 21.618 -56.636 0.028 -78.252 L 590.265 511.987 Z"
                        fill="#333333"
                      />
                    </svg>
                  </button>
                  <Grid
                    key={"grid-main"}
                    container
                    rowSpacing={1}
                    columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                    <Grid xs={12} md={12} key={"grid-sub"}>
                      <Grid key={"grid1"} container spacing={3}>
                        <Grid xs={12} md={12} key={"grid3"}>
                          <Typography
                            id="modal-modal-title"
                            variant="h6"
                            component="h2"
                            style={{ fontWeight: "700", fontSize: "23px" }}>
                            {selectedLang.lastStatus}
                          </Typography>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>{" "}
                  <form className="editform">
                    <div className="edit_textfield">
                      <TextField
                        fullWidth
                        size="small"
                        label={selectedLang.nickname}
                        value={latestData?.nickname || ''}
                        aria-readonly={true}
                        // onChange={(e) => handleChange("title", e.target.value)}
                      />
                    </div>
                    <div className="edit_textfield">
                      <TextField
                        fullWidth
                        size="small"
                        label={selectedLang.last_play_provider_id}
                        value={latestData?.last_play_provider_id || ''}
                        aria-readonly={true}
                        inputProps={{
                          spellCheck: 'false',
                          // autoCorrect: 'off',
                        }}
                        // onChange={(e) => handleChange("thumbnail", e.target.value)}
                      />
                    </div>
                    <div className="edit_textfield">
                      <TextField
                        fullWidth
                        size="small"
                        label={selectedLang.last_play_vendor}
                        value={latestData?.last_play_vendor || ''}
                        aria-readonly={true}
                        inputProps={{
                          spellCheck: 'false',
                          // autoCorrect: 'off',
                        }}
                        // onChange={(e) => handleChange("platform", e.target.value)}
                      />
                    </div>
                    <div className="edit_textfield">
                      <TextField
                        fullWidth
                        size="small"
                        label={selectedLang.last_play_game}
                        value={latestData?.last_play_game || ''}
                        aria-readonly={true}
                        inputProps={{
                          spellCheck: 'false',
                          // autoCorrect: 'off',
                        }}
                        // onChange={(e) => handleChange("type", e.target.value)}
                      />
                    </div>
                    <div className="edit_textfield">
                      <TextField
                        fullWidth
                        size="small"
                        label={selectedLang.last_play_lobbie}
                        value={latestData?.last_play_lobbie || ''}
                        aria-readonly={true}
                        inputProps={{
                          spellCheck: 'false',
                          // autoCorrect: 'off',
                        }}
                        // onChange={(e) => handleChange("game_type", e.target.value)}
                      />
                    </div>
                    <div className="edit_textfield">
                      <TextField
                        fullWidth
                        size="small"
                        label={selectedLang.invest_token}
                        value={latestData?.invest_token || ''}
                        aria-readonly={true}
                        inputProps={{
                          spellCheck: 'false',
                          // autoCorrect: 'off',
                        }}
                        // onChange={(e) => handleChange("game_type", e.target.value)}
                      />
                    </div>
                    <div className="edit_textfield">
                      <TextField
                        fullWidth
                        size="small"
                        label={selectedLang.common_invest_token}
                        value={latestData?.common_invest_token || ''}
                        aria-readonly={true}
                        inputProps={{
                          spellCheck: 'false',
                          // autoCorrect: 'off',
                        }}
                        // onChange={(e) => handleChange("game_type", e.target.value)}
                      />
                    </div>
                  </form>
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

              <div className="flex userlist_filter" style={{ flexWrap: "wrap", gap: "10px" }}>
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

                <div className="flex" style={{ gap: "10px", alignItems: "center", justifyContent: "center", flexWrap: "wrap" }}>
                  {/* <Flatpickr
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
                  /> */}
                   <DatePicker onDataFilter={onDataFilter} />
                </div>
                <Autocomplete
                  onChange={addDynamicSearch}
                  sx={{
                    flex: 1,
                    borderRadius: "4px",
                    maxWidth: "200px"
                  }}
                  value={affiliateAgent}
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
                <InputBase
                  sx={{
                    flex: 1,
                    border: "1px solid #cdcfd3",
                    borderRadius: "4px",
                    padding: "4px 10px",
                    fontSize: "12px",
                  }}
                  placeholder={selectedLang.casino_users}
                  defaultValue={inputRef.current}
                  onChange={handleInputChange}
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

              <CardContent>
                {/* <Paper
                      sx={{
                        width: "100%",
                        overflow: "hidden",
                        borderRadius: "4px",
                      }}
                    > */}
                <TableContainer>
                  <Table aria-label="customized table">
                    <TableHead>
                      {role["role"] == "admin" ? (
                        <TableRow>
                          {columns
                            .filter(
                              (column) =>
                                !(
                                  (column.id === "currentAction" &&
                                    userDetails.wallet_type ===
                                    "seamless") ||
                                  (userDetails.wallet_type !== "seamless" &&
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
                      ) : (
                        <TableRow>
                          {columns
                            .filter(
                              (column) =>
                                !(
                                  (column.id === "currentAction" &&
                                    userDetails.wallet_type ===
                                    "seamless") ||
                                  (userDetails.wallet_type !== "seamless" &&
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
                    {/* <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                          {!loading && <FuseLoading />}
                        </div> */}
                    {!loading && renderUserlist()}
                    {/* {} */}
                  </Table>
                  {!userList.length > 0 && !loading && (
                    <div
                      style={{
                        color: "#fff",
                        textAlign: "center",
                        padding: "1rem",
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
                  rowsPerPage={null}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                />
                {/* </Paper> */}
              </CardContent>
            </Card>
          }
        />
      )}
    </>
  );
}

export default UserListApp;
