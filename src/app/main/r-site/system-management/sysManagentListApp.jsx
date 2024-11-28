/** @format */

import * as React from "react";
import FusePageSimple from "@fuse/core/FusePageSimple";
import AgentListHeader from "./sysManaagentListHeader";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { locale } from "../../../configs/navigation-i18n";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { Autocomplete, CardActionArea, CardActions, Menu } from "@mui/material";
import { CardHeader } from "@mui/material";
import "./agentList.css";
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
import Button from "@mui/material/Button";
import InputBase from "@mui/material/InputBase";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import SearchIcon from "@mui/icons-material/Search";
import APIService from "src/app/services/APIService";
import DataHandler from "src/app/handlers/DataHandler";
import FuseLoading from "@fuse/core/FuseLoading";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import { showMessage } from "app/store/fuse/messageSlice";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Unstable_Grid2";
import TextField from "@mui/material/TextField";
import DoneIcon from "@mui/icons-material/Done";
import Switch from "@mui/material/Switch";
import { headerLoadChanged } from "app/store/headerLoadSlice";
import moment from "moment";
import { formatLocalDateTime, formatSentence } from "src/app/services/Utility";
import { useNavigate } from "react-router-dom";
import jwtDecode from "jwt-decode";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import PopupState, { bindTrigger, bindMenu } from "material-ui-popup-state";

// import Box from '@mui/material/Box';
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSort } from "@fortawesome/free-solid-svg-icons";
import { faSortUp } from "@fortawesome/free-solid-svg-icons";
import { faSortDown } from "@fortawesome/free-solid-svg-icons";
import queryString from "query-string";
import cloneDeep from "lodash/cloneDeep";

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
todayDate.setHours(23, 59, 59, 999);
// todayDate.setDate(1);

const threeDaysAgo = new Date(todayDate);
threeDaysAgo.setMonth(todayDate.getMonth() - 1);

function agentListApp() {
  const user_id = DataHandler.getFromSession("user_id");
  const [agentFilterValue, setAgentName] = useState("");

  const [requested_user_id, setrequested_user_id] = useState("");
  const [requested_name, setrequested_name] = useState("");
  const [requested_API, setrequested_API] = useState("");
  const [requested_amount, setrequested_amount] = useState(0);
  const [withdraw_amount, setwithdraw_amount] = useState(0);
  const [checked, setChecked] = React.useState(true);
  const [agentList, setAgentList] = useState("");
  const [type, setType] = useState("");
  const [currency, setCurrency] = useState("");
  const [curresntdata, setCurrentData] = useState(new Date());
  const [selectLocale] = useSelector((state) => [state.locale.selectLocale]);
  const [selectedprovider] = useSelector((state) => [
    state.provider.selectedprovider,
  ]);
  const [headerLoad] = useSelector((state) => [state.headerLoad.headerLoad]);
  const [selectedLang, setSelectedLang] = useState(locale.ko);
  useEffect(() => {
    if (selectLocale == "ko") {
      setSelectedLang(locale.ko);
    } else {
      setSelectedLang(locale.en);
    }
  }, [selectLocale]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(20);
  const [loaded, setLoaded] = useState(true);
  const [loading1, setLoading1] = useState(true);
  const [loading2, setLoading2] = useState(true);
  const [loading3, setLoading3] = useState(true);
  const [loading4, setLoading4] = useState(true);

  useEffect(() => {
    if (
      loading1 == false &&
      loading2 == false &&
      loading3 == false &&
      loading4 == false
    ) {
      setLoaded(false);
    }
  }, [loading1, loading2, loading3, loading4]);

  useEffect(() => {
    if (selectLocale == "ko") {
      setSelectedLang(locale.ko);
    } else {
      setSelectedLang(locale.en);
    }
  }, [selectLocale]);
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

  const [value, setValue] = React.useState("1");

  const handleChange2 = (event, newValue) => {
    setValue(newValue);
  };

  useEffect(() => {
    getTypes();
    getAgentList();
    // getUserDetails();
    getUser();
  }, [selectedprovider, page, rowsPerPage, selectedLang, value]);

  useEffect(() => {
    getUserDetails();
  }, []);

  var date = new Date();
  var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
  var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);

  const dispatch = useDispatch();

  const [monthFirstDay, setMonthFirstDay] = useState(firstDay);
  const [monthLastDay, setMonthLastDay] = useState(lastDay);
  const [month, setMonth] = useState("");
  const [userDetails, setUserDetails] = useState("");
  const [tableDataLoader, setTableDataLoader] = useState(true);

  const [startDate, setStartDate] = useState(threeDaysAgo);
  const [endDate, setEndDate] = useState(todayDate);
  const [amountSum, setAmountSum] = useState(0);

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

    getAgentList(firstDay, lastDay);
  };

  const getLastMonthData = (e) => {
    e.preventDefault();
    const date = new Date();
    var firstDay = new Date(date.getFullYear(), date.getMonth() - 1, 1);
    var lastDay = new Date(date.getFullYear(), date.getMonth(), 0);

    setMonthFirstDay(firstDay);
    setMonthLastDay(lastDay);

    getAgentList(firstDay, lastDay);
  };

  const getUser = () => {
    APIService({
      url: `${process.env.REACT_APP_R_SITE_API}/user/details?user_id=${user_id}`,
      method: "GET",
    })
      .then((data) => {
        setCurrency(data.data.data[0].currency);
      })
      .catch((err) => { })
      .finally(() => {
        setLoading1(false);
      });
  };

  const [agentList_table_count, _agentList_table_count] = useState(0);
  const [myType, setMyType] = useState();

  const [nickname, setNickname] = useState("");

  const [adminType, setAdminType] = useState("");
  const handleChangeAdminType = (event, newValue) => {
    // const newValue = event.target.value;
    setAdminType(newValue?.value || "");
  };

  const getAgentList = (firstDay, lastDay) => {
    APIService({
      url: `${process.env.REACT_APP_R_SITE_API
        }/user/agent-list?user_id=${user_id}&provider=${selectedprovider}&start_date=${firstDay ? firstDay : monthFirstDay
        }&end_date=${lastDay ? lastDay : monthLastDay
        }&agent_name=${agentFilterValue}&pageNumber=${page + 1
        }&limit=${rowsPerPage}&nickname=${nickname}&admin_type=${adminType}&status=${value}`,
      method: "GET",
    })
      .then((res) => {
        setAgentList(res.data.data.UserDataResult.subAgentUsers);
        setMyType(res.data.data.UserDataResult?.type);
        setAmountSum(res.data.data.UserDataResult?.sumAmount);
        setMonth(res.data.data.month);
        _agentList_table_count(
          res.data.data.UserDataResult.table_data_count || 0
        );
      })
      .catch((err) => {
        setAgentList([]);
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
        setTableDataLoader(false);
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
        setLoading3(false);
      });
  };

  const getTypes = () => {
    APIService({
      url: `${process.env.REACT_APP_R_SITE_API}/type/get-type`,
      method: "GET",
    })
      .then((data) => {
        setType(data.data.data);
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
        setLoading4(false);
      });
  };

  const searchHistory = async () => {
    setPage(0);
    setTableDataLoader(true);
    // if ((role["role"] == "admin" || role["role"] == "cs")) {
    if (agentFilterValue.length > 0) {
      getAgentList(true);
    } else {
      getAgentList(false);
    }
    // } else {
    // 	if (agentFilterValue.length > 0) {
    // 		// getSubAgentPaymentHistory(true);
    // 	} else {
    // 		// getSubAgentPaymentHistory(false);
    // 	}
    // }
  };

  const columns = [
    { id: "step", label: `${selectedLang.number}`, minWidth: 20 },
    // { id: "name", label: `${selectedLang.number}`, minWidth: 50 },
    { id: "type", label: `${selectedLang.type}`, minWidth: 50 },
    { id: "aagent", label: `${selectedLang.affiliate_agent}`, minWidth: 50 },
    // { id: "agent", label: `${selectedLang.agent}`, minWidth: 50 },
    { id: "nickName", label: `${selectedLang.agentNickname}`, minWidth: 50 },
    { id: "currency", label: `${selectedLang.currency}`, minWidth: 50 },
    // {
    //   id: "hAmount",
    //   label: `${selectedLang.holding_amount}`,
    //   minWidth: 50,
    //   format: (value) => value.toLocaleString("en-US"),
    // },
    // {
    // 	id: "rate",
    // 	label: `${selectedLang.rate}`,
    // 	minWidth: 100,
    // 	format: (value) => value.toLocaleString("en-US"),
    // },
    // {
    //   id: "tAmount",
    //   label: `${selectedLang.tot_amount_paid}`,
    //   minWidth: 50,
    //   format: (value) => value.toLocaleString("en-US"),
    // },
    // {
    //   id: "charge",
    //   label: `${selectedLang.tot_amount_charge}`,
    //   minWidth: 50,
    //   format: (value) => value.toLocaleString("en-US"),
    // },
    {
      id: "payment",
      label: `${selectedLang.action}`,
      minWidth: 50,
      format: (value) => value.toLocaleString("en-US"),
    },
    // {
    //   id: "activation",
    //   label: `${selectedLang.activation}`,
    //   minWidth: 50,
    //   format: (value) => value.toLocaleString("en-US"),
    // },
    {
      id: "signupTime",
      label: `${selectedLang.date}`,
      minWidth: 100,
    },
  ];

  const columnsCS = [
    { id: "step", label: `${selectedLang.number}`, minWidth: 20 },
    // { id: "name", label: `${selectedLang.number}`, minWidth: 50 },
    { id: "type", label: `${selectedLang.type}`, minWidth: 50 },
    { id: "aagent", label: `${selectedLang.affiliate_agent}`, minWidth: 50 },
    // { id: "agent", label: `${selectedLang.agent}`, minWidth: 50 },
    { id: "nickName", label: `${selectedLang.agentNickname}`, minWidth: 50 },
    { id: "currency", label: `${selectedLang.currency}`, minWidth: 50 },
    {
      id: "hAmount",
      label: `${selectedLang.holding_amount}`,
      minWidth: 50,
      format: (value) => value.toLocaleString("en-US"),
    },
    {
      id: "payment",
      label: `${selectedLang.action}`,
      minWidth: 50,
      format: (value) => value.toLocaleString("en-US"),
    },
    {
      id: "signupTime",
      label: `${selectedLang.date}`,
      minWidth: 100,
    },
  ];

  const [openStatus, setOpenStatus] = React.useState(false);
  const handleOpenStatus = (data) => {
    setrequested_user_id(data?.user_id);
    if (data.status.toString() == "true") {
      setChecked(true);
    } else {
      setChecked(false);
    }
    setrequested_name(data?.id);
    setrequested_API(data?.apiKey[0]);
    setOpenStatus(true);
  };
  const handleCloseStatus = () => {
    setOpenStatus(false);
    setwithdraw_amount(0);
  };

  const [open, setOpen] = React.useState(false);

  const [currtAcba, _currcAcba] = useState(0);

  const [fetchingBalance, _fetchingBalance] = useState(false);
  const getCurrentHolding = (user_id) => {
    _fetchingBalance(true);
    APIService({
      url: `${process.env.REACT_APP_R_SITE_API}/user/user-holding-details?user_id=${user_id}&provider=${selectedprovider}`,
      method: "GET",
    })
      .then((data) => {
        _currcAcba(data?.data?.data[0]?.balance_amount);
      })
      .catch((err) => { })
      .finally(() => {
        _fetchingBalance(false);
      });
  };

  const [myHolding, setMyHolding] = useState();

  const getMyHolding = () => {
    role["role"] == "admin" || role["role"] == "cs"
      ? APIService({
        url: `${process.env.REACT_APP_R_SITE_API}/user/agent-holding`,
        method: "GET",
      })
        .then((res) => {
          //setAgentHoldingDetails(res.data.data);
          setMyHolding(res.data.data[0]?.balance_amount.KRW);
        })
        .catch((err) => { })
        .finally(() => {
          setLoading1(false);
        })
      : APIService({
        url: `${process.env.REACT_APP_R_SITE_API}/user/user-holding-details?user_id=${user_id}&provider=${selectedprovider}`,
        method: "GET",
      })
        .then((res) => {
          //setAgentHoldingDetails(res.data.data);
          setMyHolding(res?.data?.data[0]?.balance_amount);
        })
        .catch((err) => { })
        .finally(() => {
          setLoading1(false);
        });
  };

  useEffect(() => {
    getMyHolding();
  }, []);

  const handleOpen = (data) => {
    getCurrentHolding(data?.user_id);
    setrequested_user_id(data?.user_id);
    setrequested_name(data?.id);
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
    setrequested_amount();
  };

  const [openWithdraw, setOpenWithdraw] = React.useState(false);
  const handleOpenWithdraw = (data) => {
    getCurrentHolding(data?.user_id);
    setrequested_user_id(data?.user_id);
    setrequested_name(data?.id);
    setOpenWithdraw(true);
  };
  const handleCloseWithdraw = () => {
    setOpenWithdraw(false);
  };

  const changeStatus = (event) => {
    setChecked(event.target.checked);
  };

  const createStatus = (requested_user_id, checked) => {
    // e.preventDefault();
    APIService({
      url: `${process.env.REACT_APP_R_SITE_API}/user/change-status`,
      method: "POST",
      data: {
        user_id: requested_user_id,
        status: checked,
      },
    })
      .then((data) => {
        // getAgentList(firstDay, lastDay);

        const userToUpdate = agentList.find(
          (user) => user.user_id === requested_user_id
        );

        if (userToUpdate) {
          userToUpdate.status =
            userToUpdate.status == "true" || userToUpdate?.status == 1
              ? "false"
              : "true";
        }
        setAgentList(agentList);

        setOpenStatus(false);
        dispatch(
          showMessage({
            variant: "success",
            message: `${userToUpdate.status == "true" || userToUpdate?.status == 1
              ? selectedLang.enabled
              : selectedLang.disabled
              }`,
          })
        );
      })
      .catch((err) => {
        setOpenStatus(false);
        dispatch(
          showMessage({
            variant: "error",
            message: `${err?.message || selectedLang.something_went_wrong}`,
          })
        );
      })
      .finally(() => { });
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

    if (requested_user_id == "") {
      dispatch(
        showMessage({
          variant: "error",
          message: `${selectedLang.user_id_is_required ||
            selectedLang.something_went_wrong
            }`,
        })
      );
    }

    if (requested_amount > 0 && requested_user_id != "") {
      APIService({
        //url: `${process.env.REACT_APP_R_SITE_API}/request-payment/create-rsite-payment?amount=${requested_amount}&requested_user_id=${requested_user_id}`,
        url: `${process.env.REACT_APP_R_SITE_API
          }/transaction/create?amount=${requested_amount}&transaction_type=deposit&transaction_relation=${role["role"] == "admin" || role["role"] == "cs"
            ? "admin_agent"
            : "agent_agent"
          }&to_user_id=${requested_user_id}`,
        method: "POST",
      })
        .then((data) => {
          setrequested_amount(0);
          dispatch(
            headerLoadChanged({
              headerLoad: !headerLoad,
            })
          );
          getAgentList(firstDay, lastDay);
          setOpen(false);
          setrequested_amount(0);
          setwithdraw_amount(0);
          dispatch(
            showMessage({
              variant: "success",
              message: `${selectedLang.payment_success}`,
            })
          );
        })
        .catch((err) => {
          setOpen(false);
          setrequested_amount(0);
          setwithdraw_amount(0);
          dispatch(
            showMessage({
              variant: "error",
              message: `${selectedLang[`${formatSentence(err?.message)}`] ||
                selectedLang[`${formatSentence(err?.message)}`] ||
                selectedLang[`${formatSentence(err?.error?.message)}`] ||
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

    if (requested_user_id == "") {
      dispatch(
        showMessage({
          variant: "error",
          message: `${selectedLang.user_id_is_required ||
            selectedLang.something_went_wrong
            }`,
        })
      );
    }

    if (withdraw_amount > 0 && requested_user_id != "") {
      APIService({
        //url: `${process.env.REACT_APP_R_SITE_API}/request-withdraw/create-rsite-withdraw?amount=${withdraw_amount}&user_id=${requested_user_id}`,
        url: `${process.env.REACT_APP_R_SITE_API
          }/transaction/create?amount=${withdraw_amount}&transaction_type=withdraw&transaction_relation=${role["role"] == "admin" || role["role"] == "cs"
            ? "admin_agent"
            : "agent_agent"
          }&to_user_id=${requested_user_id}`,
        method: "POST",
      })
        .then((data) => {
          setwithdraw_amount(0);
          dispatch(
            headerLoadChanged({
              headerLoad: !headerLoad,
            })
          );
          getAgentList(firstDay, lastDay);
          setOpenWithdraw(false);
          setrequested_amount(0);
          setwithdraw_amount(0);
          dispatch(
            showMessage({
              variant: "success",
              message: `${selectedLang.widthdraw_success}`,
            })
          );
        })
        .catch((err) => {
          setOpenWithdraw(false);
          setrequested_amount(0);
          setwithdraw_amount(0);
          dispatch(
            showMessage({
              variant: "error",
              message: `${selectedLang[`${formatSentence(err?.message)}`] ||
                selectedLang[`${formatSentence(err?.message)}`] ||
                selectedLang[`${formatSentence(err?.error?.message)}`] ||
                selectedLang.something_went_wrong
                }`,
            })
          );
        })
        .finally(() => { });
    }
  };

  const getSortIconhAmount = (order) => {
    return order === "asc" ? (
      <FontAwesomeIcon icon={faSortUp} className="sort-icon" />
    ) : order === "desc" ? (
      <FontAwesomeIcon icon={faSortDown} className="sort-icon" />
    ) : (
      <FontAwesomeIcon icon={faSort} className="sort-icon" />
    );
  };

  const [sortBy, setSortBy] = useState("name"); // Default sorting column
  const [sortOrder, setSortOrder] = useState(""); // Default sorting order
  const [sortOrder_hAmount, setSortOrder_hAmount] = useState("");

  const handleSort = (column) => {
    if (column == "hAmount") {
      setSortBy("hAmount");
      setSortOrder_hAmount(
        sortOrder === "asc" ? "desc" : sortOrder === "desc" ? "" : "asc"
      );
      setSortOrder(
        sortOrder === "asc" ? "desc" : sortOrder === "desc" ? "" : "asc"
      );
    }
  };

  const [openCallback, setOpenCallback] = React.useState(false);

  const handleCloseCallback = () => {
    setOpenCallback(false);
  };

  const [currCallbackUser, _currCallbackUser] = useState("");
  const [changeBalancecallbackURL, _changeBalancecallbackURL] = useState("");
  const [balancecallbackURL, _balancecallbackURL] = useState("");
  const handleOpenCallback = (data) => {
    _currCallbackUser(data?.user_id);
    _balancecallbackURL(data?.balancecallbackURL);
    _changeBalancecallbackURL(data?.changeBalancecallbackURL);
    setOpenCallback(true);
  };

  const handleUpdateURLS = () => {
    if (changeBalancecallbackURL !== "" || balancecallbackURL !== "") {
      APIService({
        url: `${process.env.REACT_APP_R_SITE_API}/user/change-callback-urls-ws`,
        method: "PUT",
        data: {
          user_id: currCallbackUser,
          callback_url: {
            changeBalancecallbackURL: changeBalancecallbackURL,
            balancecallbackURL: balancecallbackURL,
          },
        },
      })
        .then((data) => {
          _changeBalancecallbackURL("");
          _balancecallbackURL("");
          getTypes();
          getAgentList();
          getUserDetails();
          getUser();
          dispatch(
            showMessage({
              variant: "success",
              message: `${selectedLang.callback_url_changed_successfully}`,
            })
          );
        })
        .catch((err) => {
          dispatch(
            showMessage({
              variant: "error",
              message: err.error.message,
            })
          );
        })
        .finally(() => {
          getTypes();
          getAgentList();
          getUserDetails();
          getUser();
          setOpenCallback(false);
          _currCallbackUser("");
          _changeBalancecallbackURL("");
          _balancecallbackURL("");
        });
    } else {
      dispatch(
        showMessage({
          variant: "error",
          message: `${selectedLang.emptyField}`,
        })
      );
    }
  };

  // agent list total amount
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
          {amountSum?.toLocaleString()}
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
          {""}
        </TableCell>
      </StyledTableRow>
    );
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

  const navigate = useNavigate();

  const role = jwtDecode(DataHandler.getFromSession("accessToken"))["data"];

  const initCopyAgentList = [...agentList];

  const sortedAndMappedDataAgentList =
    sortOrder !== ""
      ? initCopyAgentList.sort((a, b) => {
        if (sortBy === "hAmount") {
          return sortOrder === "asc"
            ? a.holding.balance_amount - b.holding.balance_amount
            : b.holding.balance_amount - a.holding.balance_amount;
        }
      })
      : initCopyAgentList;

  const addTableData = () => {
    if (agentList) {
      return (
        <TableBody>
          {/* {createTotalRow()} */}
          {sortedAndMappedDataAgentList
            // .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
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
                  {/* <TableCell
                    sx={{
                      textAlign: "center",
                    }}>{data?.number}</TableCell> */}
                  <TableCell
                    sx={{
                      textAlign: "center",
                    }}
                  >
                    {type &&
                      type.length > 0 &&
                      selectedLang[`${getUserType(data?.type)}`]
                      ? selectedLang[`${getUserType(data?.type)}`].split(" ")[0]
                      : "-"}
                  </TableCell>

                  <TableCell
                    sx={{
                      textAlign: "center",
                    }}
                  >
                    {/* {data.parent_id} */}
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
                          >{`${data?.parent_id}(${data?.parent_nickname || ""})`}</span>
                          <Menu {...bindMenu(popupState)}>
                            {/* {(role["role"] == "admin" ||
                              role["role"] == "cs" ||
                              myType == "2") && ( */}
                            <MenuItem
                              onClick={() => {
                                popupState.close;
                                navigate(`/mypage?agent_id=${data?.user_id}`);
                              }}
                            >
                              {selectedLang.MYPAGE}
                            </MenuItem>
                            {/* )} */}
                            <MenuItem
                              onClick={() => {
                                popupState.close;
                                navigate(
                                  `/agent/transactionHistory?agent=${data?.id}`
                                );
                              }}
                            >
                              {selectedLang.TRANSACTIONHISTORYAGENT}
                            </MenuItem>
                            <MenuItem
                              onClick={() => {
                                popupState.close;
                                navigate(
                                  `/agent/agentTreeList?q_agent=${data?.user_id}`
                                );
                              }}
                            >
                              {selectedLang.change_password}
                            </MenuItem>

                            <MenuItem
                              onClick={() => {
                                popupState.close;
                                navigate(
                                  `/statistics/agentRevenueStatistics?agent=${data?.id}`
                                );
                              }}
                            >
                              {selectedLang.AGENTRSTATISTICS}
                            </MenuItem>
                            <MenuItem
                              onClick={() => {
                                popupState.close;
                                navigate(
                                  `/statistics/statisticsByGame?agent_id=${data?.user_id}`
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
                                  `/providerManagement?agent_id=${data?.user_id}`
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
                                  `/gameManagement?agent_id=${data?.user_id}`
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
                                  `/statistics/APIerror?agent_id=${data?.user_id}`
                                );
                              }}
                            >
                              {selectedLang.APIERRORLOG}
                            </MenuItem>
                            <hr style={{ border: "1px solid" }} />
                            <MenuItem
                              onClick={() => {
                                popupState.close;
                                navigate(`/user/userList?agent=${data?.id}`);
                              }}
                            >
                              {selectedLang.USERLIST}
                            </MenuItem>
                            <MenuItem
                              onClick={() => {
                                popupState.close;
                                navigate(
                                  `/user/transactionHistory?agent=${data?.id}`
                                );
                              }}
                            >
                              {selectedLang.TRANSACTIONHISTORYUSER}
                            </MenuItem>
                            <MenuItem
                              onClick={() => {
                                popupState.close;
                                navigate(`/user/betHistory?agent=${data?.id}`);
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
                    {/* {`${data?.id}(${data?.nick_name})`} */}
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
                          >{`${data?.id}(${data?.nick_name})`}</span>
                          <Menu {...bindMenu(popupState)}>
                            {/* {(role["role"] == "admin" ||
                              role["role"] == "cs" ||
                              myType == "2") && ( */}
                            <MenuItem
                              onClick={() => {
                                popupState.close;
                                navigate(`/mypage?agent_id=${data?.user_id}`);
                              }}
                            >
                              {selectedLang.MYPAGE}
                            </MenuItem>
                            {/* )} */}
                            <MenuItem
                              onClick={() => {
                                popupState.close;
                                navigate(
                                  `/agent/transactionHistory?agent=${data?.id}`
                                );
                              }}
                            >
                              {selectedLang.TRANSACTIONHISTORYAGENT}
                            </MenuItem>

                            <MenuItem
                              onClick={() => {
                                popupState.close;
                                navigate(
                                  `/agent/agentTreeList?q_agent=${data?.user_id}`
                                );
                              }}
                            >
                              {selectedLang.change_password}
                            </MenuItem>

                            <MenuItem
                              onClick={() => {
                                popupState.close;
                                navigate(
                                  `/statistics/agentRevenueStatistics?agent=${data?.id}`
                                );
                              }}
                            >
                              {selectedLang.AGENTRSTATISTICS}
                            </MenuItem>
                            <MenuItem
                              onClick={() => {
                                popupState.close;
                                navigate(
                                  `/statistics/statisticsByGame?agent_id=${data?.user_id}`
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
                                  `/providerManagement?agent_id=${data?.user_id}`
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
                                  `/gameManagement?agent_id=${data?.user_id}`
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
                                  `/statistics/APIerror?agent_id=${data?.user_id}`
                                );
                              }}
                            >
                              {selectedLang.APIERRORLOG}
                            </MenuItem>
                            <hr style={{ border: "1px solid" }} />
                            <MenuItem
                              onClick={() => {
                                popupState.close;
                                navigate(`/user/userList?agent=${data?.id}`);
                              }}
                            >
                              {selectedLang.USERLIST}
                            </MenuItem>
                            <MenuItem
                              onClick={() => {
                                popupState.close;
                                navigate(
                                  `/user/transactionHistory?agent=${data?.id}`
                                );
                              }}
                            >
                              {selectedLang.TRANSACTIONHISTORYUSER}
                            </MenuItem>
                            <MenuItem
                              onClick={() => {
                                popupState.close;
                                navigate(`/user/betHistory?agent=${data?.id}`);
                              }}
                            >
                              {selectedLang.BETHISTORY}
                            </MenuItem>
                          </Menu>
                        </React.Fragment>
                      )}
                    </PopupState>
                  </TableCell>
                  {/* <TableCell
										sx={{
											textAlign: 'center',
										}}>
										{data?.nick_name}
									</TableCell> */}
                  <TableCell
                    sx={{
                      textAlign: "center",
                    }}
                  >
                    {data?.currency}
                  </TableCell>
                  {/* <TableCell
                    style={{
                      textDecoration: "underline",
                      cursor: "pointer",
                      fontWeight: "bold",
                    }}
                    onClick={() => {
                      navigate(`/agent/transactionHistory?agent=${data?.id}`);
                    }}
                    sx={{
                      textAlign: "center",
                    }}>
                    {Number(data?.holding?.balance_amount)?.toLocaleString()}
                  </TableCell> */}
                  {/* <TableCell
                    sx={{
                      textAlign: "center",
                    }}>{data?.holding?.rate}</TableCell> */}
                  {/* <TableCell
                    sx={{
                      textAlign: "center",
                    }}>
                    {Number(data?.holding?.total_payment)?.toLocaleString()}
                  </TableCell> */}
                  {/* <TableCell
                    sx={{
                      textAlign: "center",
                    }}>
                    {Number(
                      data?.holding?.total_charged_amount
                    )?.toLocaleString()}
                  </TableCell> */}
                  <TableCell
                    sx={{
                      textAlign: "center",
                    }}
                  >
                    <div className="row flex justify-center">
                      <Button
                        className="flex item-center buttonbox"
                        variant="contained"
                        color="success"
                        size="small"
                        sx={{
                          borderRadius: "4px",
                        }}
                        onClick={() => handleOpenCallback(data)}
                      >
                        {selectedLang.callback_url_customization}
                      </Button>
                    </div>
                  </TableCell>
                  {/* {role["role"] != "cs" && (
                    <>
                      <TableCell
                        sx={{
                          textAlign: "center",
                        }}>
                        <Switch
                          checked={data?.status == 1 || data?.status == "true"}
                          onChange={(event) =>
                            createStatus(data?.user_id, event.target.checked)
                          }
                          color="secondary"
                        />
                      </TableCell>
                    </>
                  )} */}
                  <TableCell
                    sx={{
                      textAlign: "center",
                    }}
                  >
                    {formatLocalDateTime(data.created_at)}
                    {/* {moment(data.created_at).format("YYYY/MM/DD HH:mm:ss")} */}
                    {/* {dateFormat(data.created_at)} */}
                  </TableCell>
                </StyledTableRow>
              );
            })}
        </TableBody>
      );
    }
  };

  function dateFormat(date) {
    var d = new Date(date);
    var date = d.getDate();
    var month = d.getMonth() + 1; // Since getMonth() returns month from 0-11 not 1-12
    var year = d.getFullYear();
    var newDate = year + "-" + month + "-" + date;
    return newDate;
  }

  const addValue = (value) => {
    setrequested_amount(Number(requested_amount || 0) + value);
  };

  const subValue = (value) => {
    setwithdraw_amount(Number(requested_amount || 0) + value);
  };

  const getUserType = (val) => {
    switch (val) {
      case "0":
        return type[0].type_name;
      case "1":
        return type[1].type_name;
      case "2":
        return type[2].type_name;
    }
  };

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

  return (
    <>
      {" "}
      {loaded ? (
        <FuseLoading />
      ) : (
        <FusePageSimple
          header={<AgentListHeader selectedLang={selectedLang} />}
          content={
            <Card
              sx={{ width: "100%", marginTop: "20px", borderRadius: "4px" }}
              className="main_card"
            >
              {/* <CardHeader
              title="List of Admin Transaction Details"
              className="list-title"
              action={
                <Chip
                  label="14"
                  size="small"
                  color="primary"
                  sx={{ position: "absolute", left: "290px", top: "34px" }}
                />
              }
            ></CardHeader> */}
              <Modal
                open={openStatus}
                className="small_modal"
                onClose={handleCloseStatus}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
              >
                <Box sx={style} className="Mymodal">
                  <button className="modalclosebtn" onClick={handleCloseStatus}>
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
                    variant="h6"
                    component="h2"
                    style={{ fontWeight: "700", fontSize: "23px" }}
                  >
                    {selectedLang.change_status}
                  </Typography>
                  <p className="infotext">{selectedLang.status_desc}</p>
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
                            justifyContent: "space-between",
                            marginTop: "0px",
                          }}
                        >
                          <Grid
                            xs={12}
                            md={12}
                            key={"grid3"}
                            style={{
                              width: "100%",
                              paddingBottom: "0px",
                              paddingTop: "0px",
                            }}
                          >
                            <Typography
                              id="modal-modal-title"
                              variant="h6"
                              component="h2"
                              style={{ fontSize: "14px" }}
                            >
                              {selectedLang.agent_name} :
                              <span
                                style={{
                                  paddingLeft: "6px",
                                  fontWeight: "600",
                                  color: "#fff",
                                }}
                              >
                                {requested_name}
                              </span>
                            </Typography>
                            <Typography
                              id="modal-modal-title"
                              variant="h6"
                              style={{ fontSize: "14px", paddingBottom: 0 }}
                              component="h2"
                            >
                              {selectedLang.api_key} :
                              <span
                                style={{
                                  paddingLeft: "6px",
                                  fontWeight: "600",
                                  color: "#fff",
                                }}
                              >
                                {requested_API
                                  ? requested_API
                                  : selectedLang.nodata}
                              </span>
                            </Typography>
                          </Grid>
                          <Grid
                            xs={12}
                            md={12}
                            key={"grid34"}
                            style={{ paddingTop: 0, paddingBottom: 0 }}
                          >
                            <Typography
                              id="modal-modal-title"
                              variant="h6"
                              style={{ fontSize: "14px", paddingBottom: 0 }}
                              component="h2"
                            >
                              {selectedLang.status}:{" "}
                              {checked ? "Active" : "Deactive"}
                              <Switch
                                checked={checked}
                                onChange={changeStatus}
                                color="secondary"
                              />
                            </Typography>
                          </Grid>
                          <Grid
                            xs={12}
                            md={12}
                            style={{ width: "100%" }}
                            key={"grid41"}
                          >
                            <Button
                              key={"button-1"}
                              className="flex justify-center"
                              variant="contained"
                              color="secondary"
                              endIcon={
                                <DoneIcon
                                  key={"deone-icon"}
                                  size={20}
                                ></DoneIcon>
                              }
                              sx={{
                                borderRadius: "4px",
                                width: "100%",
                              }}
                              onClick={(e) => createStatus(e)}
                            >
                              {selectedLang.change}
                            </Button>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                  </div>
                </Box>
              </Modal>
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
                  <Grid
                    key={"grid-main"}
                    container
                    rowSpacing={1}
                    columnSpacing={{ xs: 1, sm: 2, md: 3 }}
                  >
                    <Grid xs={12} md={12} key={"grid-sub"}>
                      <Grid key={"grid1"} container spacing={3}>
                        <Grid xs={12} md={12} key={"grid3"}>
                          <Typography
                            id="modal-modal-title"
                            variant="h6"
                            component="h2"
                            style={{ fontWeight: "700", fontSize: "23px" }}
                          >
                            {selectedLang.create_payment}
                          </Typography>
                        </Grid>
                        {/* <Grid xs={12} md={12} key={"grid4"}>
                            {currency == "KRW" && (
                              <Chip
                                onClick={() => {
                                  addValue(100000000);
                                }}
                                label="100,000,000 KRW"
                                variant="outlined"
                              />
                            )}
                          </Grid> */}
                      </Grid>
                    </Grid>
                  </Grid>{" "}
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
                            justifyContent: "space-between",
                            marginTop: "0px",
                          }}
                        >
                          <Grid
                            xs={12}
                            md={12}
                            key={"grid3"}
                            style={{
                              width: "100%",
                              paddingBottom: "0px",
                              paddingTop: "0px",
                            }}
                          >
                            <Typography
                              id="modal-modal-title"
                              style={{
                                fontSize: "14px",
                                display: "flex",
                                alignItems: "center",
                              }}
                            >
                              {selectedLang.agent_name} :
                              <span
                                style={{
                                  fontWeight: "600",
                                  color: "#fff",
                                  paddingLeft: "6px",
                                }}
                              >
                                {requested_name}
                              </span>
                            </Typography>{" "}
                            <Typography
                              id="modal-modal-title"
                              variant="h6"
                              component="h2"
                              style={{ fontSize: "14px" }}
                            >
                              {selectedLang.holding_amount} :
                              <span
                                style={{
                                  paddingLeft: "6px",
                                  fontWeight: "600",
                                  color: "#fff",
                                }}
                              >
                                {/* 1,00,000 */}
                                {fetchingBalance
                                  ? `Fetching...`
                                  : Number(currtAcba)?.toLocaleString()}
                              </span>
                              {!fetchingBalance && (
                                <Button
                                  onClick={() => {
                                    getCurrentHolding();
                                  }}
                                  className="refresh_btn"
                                  variant="outlined"
                                >
                                  <svg
                                    className="svg-icon"
                                    viewBox="0 0 1024 1024"
                                    version="1.1"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path
                                      d="M896 192v110.72A448 448 0 0 0 544 128 455.04 455.04 0 0 0 128 403.2l64 25.6A391.04 391.04 0 0 1 544 192a388.48 388.48 0 0 1 330.88 192H704v64h256V192zM544 832a388.48 388.48 0 0 1-330.88-192H384V576H128v256h64v-110.72A448 448 0 0 0 544 896 455.04 455.04 0 0 0 960 620.8l-64-25.6A391.04 391.04 0 0 1 544 832z"
                                      fill="#333333"
                                    />
                                  </svg>
                                </Button>
                              )}
                            </Typography>
                            <Typography
                              id="modal-modal-title"
                              variant="h6"
                              component="h2"
                              style={{ fontSize: "14px" }}
                            >
                              {selectedLang.estimated_balance} :
                              <span
                                style={{
                                  paddingLeft: "6px",
                                  fontWeight: "600",
                                  color: "#fff",
                                }}
                              >
                                {fetchingBalance
                                  ? "Calculating.."
                                  : Number(
                                    Number(requested_amount) +
                                    Number(currtAcba) || 0
                                  ).toLocaleString()}
                              </span>
                            </Typography>
                          </Grid>
                          <Grid
                            xs={12}
                            md={12}
                            key={"grid40"}
                            style={{ width: "100%" }}
                          >
                            <TextField
                              type="text"
                              fullWidth
                              size="small"
                              placeholder={selectedLang.amount}
                              color="primary"
                              value={formatAmount(requested_amount)}
                              onChange={(e) => {
                                const inputValue = e.target.value;
                                const numericValue = inputValue.replace(
                                  /[^0-9.]/g,
                                  ""
                                );
                                setrequested_amount(numericValue);
                              }}
                            />
                            {myHolding &&
                              Number(myHolding) < requested_amount && (
                                <span className="text_danger">
                                  {selectedLang.Over_balance_message}
                                </span>
                              )}
                          </Grid>
                          <Grid
                            xs={12}
                            md={12}
                            className="numbtnWrapper"
                            style={{
                              width: "100%",
                              paddingTop: "0",
                              display: "flex",
                              gap: "10px",
                            }}
                            key={"grid4"}
                          >
                            <Button
                              key={"button-1"}
                              className="flex justify-center numbtn"
                              variant="contained"
                              color="secondary"
                              sx={{
                                borderRadius: "4px",
                                width: "100%",
                              }}
                              onClick={() => {
                                addValue(50000000);
                              }}
                            >
                              {" "}
                              {selectedLang.five_million}{" "}
                            </Button>
                            <Button
                              key={"button-1"}
                              className="flex justify-center numbtn"
                              variant="contained"
                              color="secondary"
                              sx={{
                                borderRadius: "4px",
                                width: "100%",
                              }}
                              onClick={() => {
                                addValue(100000000);
                              }}
                            >
                              {" "}
                              {selectedLang.hundred_million}{" "}
                            </Button>
                            <Button
                              key={"button-1"}
                              className="flex justify-center numbtn"
                              variant="contained"
                              color="secondary"
                              sx={{
                                borderRadius: "4px",
                                width: "100%",
                              }}
                              onClick={() => {
                                addValue(300000000);
                              }}
                            >
                              {" "}
                              {selectedLang.three_hundred_million}{" "}
                            </Button>
                            <Button
                              key={"button-1"}
                              className="flex justify-center numbtn"
                              variant="contained"
                              color="secondary"
                              sx={{
                                borderRadius: "4px",
                                width: "100%",
                              }}
                              onClick={() => {
                                addValue(500000000);
                              }}
                            >
                              {" "}
                              {selectedLang.five_hundred_million}{" "}
                            </Button>
                            <Button
                              key={"button-1"}
                              className="flex justify-center numbtn"
                              variant="contained"
                              color="secondary"
                              sx={{
                                borderRadius: "4px",
                                width: "100%",
                              }}
                              onClick={() => {
                                addValue(1000000000);
                              }}
                            >
                              {" "}
                              {selectedLang.one_billion}{" "}
                            </Button>
                            <Button
                              key={"button-1"}
                              className="flex justify-center numbtn"
                              variant="contained"
                              color="secondary"
                              sx={{
                                borderRadius: "4px",
                                width: "100%",
                              }}
                              onClick={() => {
                                // addValue("");
                                setrequested_amount(0);
                              }}
                            >
                              {" "}
                              {selectedLang.clear}{" "}
                            </Button>
                          </Grid>
                          <Grid
                            xs={12}
                            md={12}
                            style={{ width: "100%", paddingTop: "0" }}
                            key={"grid42"}
                          >
                            <Button
                              key="button-1"
                              className="flex justify-center"
                              variant="contained"
                              color="secondary"
                              endIcon={<DoneIcon key="done-icon" size={20} />}
                              sx={{
                                borderRadius: "4px",
                                width: "100%",
                              }}
                              disabled={
                                !myHolding ||
                                Number(myHolding) < requested_amount
                              }
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
                className="small_modal"
                onClose={handleCloseWithdraw}
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
                  <Grid
                    key={"grid-main"}
                    container
                    rowSpacing={1}
                    columnSpacing={{ xs: 1, sm: 2, md: 3 }}
                  >
                    <Grid xs={12} md={12} key={"grid-sub"}>
                      <Typography
                        id="modal-modal-title"
                        variant="h6"
                        component="h2"
                        style={{ fontWeight: "700", fontSize: "23px" }}
                      >
                        {selectedLang.create_withdraw}
                      </Typography>
                      {/* <Grid xs={12} md={12} key={"grid4"}>
                            {currency == "KRW" && (
                              <Chip
                                onClick={() => {
                                  addValue(100000000);
                                }}
                                label="100,000,000 KRW"
                                variant="outlined"
                              />
                            )}
                          </Grid> */}
                    </Grid>
                  </Grid>
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
                            justifyContent: "space-between",
                            marginTop: "0px",
                          }}
                        >
                          <Grid
                            xs={12}
                            md={12}
                            key={"grid3"}
                            style={{
                              width: "100%",
                              paddingBottom: "0px",
                              paddingTop: "0px",
                            }}
                          >
                            <Typography
                              id="modal-modal-title"
                              style={{
                                fontSize: "14px",
                                display: "flex",
                                alignItems: "center",
                              }}
                            >
                              {selectedLang.agent_name} :
                              <span
                                style={{
                                  fontWeight: "600",
                                  color: "#fff",
                                  paddingLeft: "6px",
                                }}
                              >
                                {requested_name}
                              </span>
                            </Typography>{" "}
                            <Typography
                              id="modal-modal-title"
                              variant="h6"
                              component="h2"
                              style={{ fontSize: "14px" }}
                            >
                              {selectedLang.holding_amount} :
                              <span
                                style={{
                                  paddingLeft: "6px",
                                  fontWeight: "600",
                                  color: "#fff",
                                }}
                              >
                                {/* 1,00,000 */}
                                {fetchingBalance
                                  ? `Fetching...`
                                  : Number(currtAcba)?.toLocaleString()}
                              </span>
                              {!fetchingBalance && (
                                <Button
                                  onClick={() => {
                                    getCurrentHolding();
                                  }}
                                  className="refresh_btn"
                                  variant="outlined"
                                >
                                  <svg
                                    className="svg-icon"
                                    viewBox="0 0 1024 1024"
                                    version="1.1"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path
                                      d="M896 192v110.72A448 448 0 0 0 544 128 455.04 455.04 0 0 0 128 403.2l64 25.6A391.04 391.04 0 0 1 544 192a388.48 388.48 0 0 1 330.88 192H704v64h256V192zM544 832a388.48 388.48 0 0 1-330.88-192H384V576H128v256h64v-110.72A448 448 0 0 0 544 896 455.04 455.04 0 0 0 960 620.8l-64-25.6A391.04 391.04 0 0 1 544 832z"
                                      fill="#333333"
                                    />
                                  </svg>
                                </Button>
                              )}
                            </Typography>
                            <Typography
                              id="modal-modal-title"
                              variant="h6"
                              component="h2"
                              style={{ fontSize: "14px" }}
                            >
                              {selectedLang.estimated_balance} :
                              <span
                                style={{
                                  paddingLeft: "6px",
                                  fontWeight: "600",
                                  color: "#fff",
                                }}
                              >
                                {fetchingBalance
                                  ? "Calculating.."
                                  : Number(
                                    Number(currtAcba) -
                                    Number(withdraw_amount) || 0
                                  ).toLocaleString()}
                              </span>
                            </Typography>
                          </Grid>
                          <Grid
                            xs={12}
                            md={12}
                            key={"grid14"}
                            style={{ width: "100%" }}
                          >
                            <TextField
                              type="text"
                              fullWidth
                              size="small"
                              label={selectedLang.amount}
                              color="primary"
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
                            {Number(Number(currtAcba)) < withdraw_amount && (
                              <span className="text_danger">
                                {selectedLang.Over_balance_message}
                              </span>
                            )}
                          </Grid>
                          <Grid
                            xs={12}
                            md={12}
                            className="numbtnWrapper"
                            style={{
                              width: "100%",
                              paddingTop: "0",
                              display: "flex",
                              gap: "10px",
                            }}
                            key={"grid401"}
                          >
                            <Button
                              key={"button-1"}
                              className="flex justify-center numbtn"
                              variant="contained"
                              color="secondary"
                              sx={{
                                borderRadius: "4px",
                                width: "100%",
                              }}
                              onClick={() => {
                                subValue(50000000);
                              }}
                            >
                              {" "}
                              50M{" "}
                            </Button>
                            <Button
                              key={"button-1"}
                              className="flex justify-center numbtn"
                              variant="contained"
                              color="secondary"
                              sx={{
                                borderRadius: "4px",
                                width: "100%",
                              }}
                              onClick={() => {
                                subValue(100000000);
                              }}
                            >
                              {" "}
                              100M{" "}
                            </Button>
                            <Button
                              key={"button-1"}
                              className="flex justify-center numbtn"
                              variant="contained"
                              color="secondary"
                              sx={{
                                borderRadius: "4px",
                                width: "100%",
                              }}
                              onClick={() => {
                                subValue(300000000);
                              }}
                            >
                              {" "}
                              300M{" "}
                            </Button>
                            <Button
                              key={"button-1"}
                              className="flex justify-center numbtn"
                              variant="contained"
                              color="secondary"
                              sx={{
                                borderRadius: "4px",
                                width: "100%",
                              }}
                              onClick={() => {
                                subValue(500000000);
                              }}
                            >
                              {" "}
                              500M{" "}
                            </Button>
                            <Button
                              key={"button-1"}
                              className="flex justify-center numbtn"
                              variant="contained"
                              color="secondary"
                              sx={{
                                borderRadius: "4px",
                                width: "100%",
                              }}
                              onClick={() => {
                                subValue(1000000000);
                              }}
                            >
                              {" "}
                              1B{" "}
                            </Button>
                            <Button
                              key={"button-1"}
                              className="flex justify-center numbtn"
                              variant="contained"
                              color="secondary"
                              sx={{
                                borderRadius: "4px",
                                width: "100%",
                              }}
                              onClick={() => {
                                // addValue("");
                                setwithdraw_amount(0);
                              }}
                            >
                              {" "}
                              {selectedLang.clear}{" "}
                            </Button>
                          </Grid>

                          <Grid
                            key={"grid6"}
                            xs={12}
                            md={12}
                            style={{ width: "100%", paddingTop: "0px" }}
                          >
                            <Button
                              key={"button-1"}
                              className="flex justify-center"
                              variant="contained"
                              color="secondary"
                              endIcon={
                                <DoneIcon
                                  key={"deone-icon"}
                                  size={20}
                                ></DoneIcon>
                              }
                              sx={{
                                borderRadius: "4px",
                                width: "100%",
                              }}
                              onClick={(e) => createWithdraw(e)}
                              disabled={
                                Number(Number(currtAcba)) < withdraw_amount
                              }
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

              {/* Change callbackURls */}

              <Modal
                open={openCallback}
                className="small_modal"
                onClose={handleCloseCallback}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
              >
                <Box sx={style} className="Mymodal">
                  <button
                    className="modalclosebtn"
                    onClick={handleCloseCallback}
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
                  <Grid
                    key={"grid-main"}
                    container
                    rowSpacing={1}
                    columnSpacing={{ xs: 1, sm: 2, md: 3 }}
                  >
                    <Grid xs={12} md={12} key={"grid-sub"}>
                      <Typography
                        id="modal-modal-title"
                        variant="h6"
                        component="h2"
                        style={{ fontWeight: "700", fontSize: "23px" }}
                      >
                        {selectedLang.callback_url_customization}
                      </Typography>
                      {/* <Grid xs={12} md={12} key={"grid4"}>
                            {currency == "KRW" && (
                              <Chip
                                onClick={() => {
                                  addValue(100000000);
                                }}
                                label="100,000,000 KRW"
                                variant="outlined"
                              />
                            )}
                          </Grid> */}
                    </Grid>
                  </Grid>
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
                            justifyContent: "space-between",
                            marginTop: "0px",
                          }}
                        >
                          <Grid
                            xs={12}
                            md={12}
                            key={"grid24"}
                            style={{ width: "100%", paddingBottom: "5px" }}
                          >
                            <TextField
                              type="text"
                              fullWidth
                              size="small"
                              label={selectedLang.change_balance_callback_URL}
                              color="primary"
                              value={changeBalancecallbackURL}
                              onChange={(e) => {
                                _changeBalancecallbackURL(e?.target?.value);
                              }}
                            />
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
                              label={selectedLang.balance_callback_URL}
                              color="primary"
                              value={balancecallbackURL}
                              onChange={(e) => {
                                _balancecallbackURL(e?.target?.value);
                              }}
                            />
                          </Grid>
                          <Grid
                            key={"grid6"}
                            xs={12}
                            md={12}
                            style={{ width: "100%", paddingTop: "0px" }}
                          >
                            <Button
                              key={"button-1"}
                              className="flex justify-center"
                              variant="contained"
                              color="secondary"
                              endIcon={
                                <DoneIcon
                                  key={"deone-icon"}
                                  size={20}
                                ></DoneIcon>
                              }
                              sx={{
                                borderRadius: "4px",
                                width: "100%",
                              }}
                              onClick={(e) => handleUpdateURLS(e)}
                              disabled={
                                Number(Number(currtAcba)) < withdraw_amount
                              }
                            >
                              {selectedLang.update}
                            </Button>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                  </div>
                </Box>
              </Modal>
              {/* End change callbackURLs */}

              <div className="flex justify-start justify-items-center bg-gray p-10 list_title w-100">
                <span className="list-title">
                  {selectedLang.agent_distribution_statistics}{" "}
                  {/* {month} {curresntdata.getFullYear()}{" "}{userDetails.id} */}
                </span>
              </div>

              <div className="flex flex-wrap">
                {/* <div className="datepikers"> */}
                {/* <DateTimePicker
												className='datetimePiker'
												placeholder={'Start Date'}
												size='small'
												value={startDate}
												inputFormat='yyyy/MM/dd HH:mm:ss'
												onChange={(date) => setStartDate(date)}
												renderInput={(params) => <TextField {...params} />}
											/>
											<div className='px-5'> - </div>
											<DateTimePicker
												className='datetimePiker'
												placeholder={'Start Date'}
												size='small'
												value={endDate}
												inputFormat='yyyy/MM/dd HH:mm:ss'
												onChange={(date) => setEndDate(date)}
												renderInput={(params) => <TextField {...params} />}
											/> */}
                {/* </div> */}
                <div
                  className="flex threebox agentblock"
                  style={{
                    alignItems: "center",
                    gap: "10px",
                    flexWrap: "wrap",
                  }}
                >
                  <Autocomplete
                    onChange={handleChangeAdminType}
                    sx={{
                      width: "150px",
                    }}
                    className=""
                    variant="outlined"
                    disablePortal
                    size="small"
                    id="combo-box-demo"
                    options={[
                      { label: `${selectedLang.all}`, value: "" },
                      { label: `${selectedLang.Distribution}`, value: "0" },
                      { label: `${selectedLang.Operational}`, value: "1" },
                      { label: `${selectedLang.Concurrent}`, value: "2" },
                    ]}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        className="textSearch"
                        label={selectedLang.type}
                      />
                    )}
                  />
                  <InputBase
                    sx={{
                      ml: 1,
                      flex: 1,
                      border: "1px solid #cdcfd3",
                      borderRadius: "4px",
                      padding: "4px 10px",
                      margin: "0px",
                    }}
                    placeholder={selectedLang.nick_name}
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    inputProps={{ "aria-label": "Agent Name" }}
                  />
                  <InputBase
                    sx={{
                      ml: 1,
                      flex: 1,
                      border: "1px solid #cdcfd3",
                      borderRadius: "4px",
                      margin: "0px",
                      padding: "4px 10px",
                    }}
                    placeholder={selectedLang.agent_name}
                    value={agentFilterValue}
                    onChange={(e) => setAgentName(e.target.value)}
                    inputProps={{ "aria-label": "Agent Name" }}
                  />
                  <Button
                    className="flex item-center"
                    variant="contained"
                    color="secondary"
                    endIcon={<SearchIcon size={20}></SearchIcon>}
                    sx={{
                      borderRadius: "4px",
                    }}
                    onClick={searchHistory}
                  >
                    {selectedLang.search}
                  </Button>
                </div>

                {/* <div className="col-lg-2 col-md-4 col-sm-4 p-10 pl-0 pr-16 flex item-center">
                    <Button
                      className="flex item-center"
                      variant="contained"
                      color="secondary"
                      // endIcon={<SearchIcon size={20}></SearchIcon>}
                      sx={{
                        borderRadius: "4px",
                      }}
                      onClick={() => {
                        navigate("/agent/createAgent");
                      }}>
                      {selectedLang.CREATEAGENT}
                    </Button>
                  </div> */}
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
                    {/* <TableContainer>
												<Table stickyHeader aria-label='customized table'>
													<TableHead>
														<TableRow>
															{columns.map((column) => (
																<StyledTableCell
																	sx={{
																		textAlign: 'center',
																	}}
																	key={column.id}
																	align={column.align}
																	style={{ minWidth: column.minWidth }}>
																	{column.label}
																</StyledTableCell>
															))}
														</TableRow>
													</TableHead>
													{addTableData()}
												</Table>
												{tableDataLoader && <FuseLoading />}

												{!agentList.length > 0 && !tableDataLoader && (
													<div
														style={{ textAlign: 'center', padding: '0.95rem' }}>
														{selectedLang.no_data_available_in_table}
													</div>
												)}
											</TableContainer>
											<TablePagination
												rowsPerPageOptions={[20, 50, 100, 200, 500]}
												component='div'
												count={agentList_table_count}
												rowsPerPage={rowsPerPage}
												page={page}
												labelRowsPerPage={selectedLang.rows_per_page}
												onPageChange={handleChangePage}
												onRowsPerPageChange={handleChangeRowsPerPage}
											/> */}

                    <TableContainer>
                      <Table stickyHeader aria-label="customized table">
                        <TableHead>
                          {role["role"] == "cs" ? (
                            <TableRow>
                              {columnsCS.map((column) => (
                                <StyledTableCell
                                  sx={{
                                    textAlign: "center",
                                    cursor:
                                      column.id == "hAmount"
                                        ? "pointer"
                                        : "default",
                                  }}
                                  key={column.id}
                                  align={column.align}
                                  style={{
                                    minWidth: column.minWidth,
                                  }}
                                  onClick={() => handleSort(column.id)}
                                >
                                  {column.label}
                                  {column.id == "hAmount"
                                    ? getSortIconhAmount(sortOrder_hAmount)
                                    : ""}
                                </StyledTableCell>
                              ))}
                            </TableRow>
                          ) : (
                            <TableRow>
                              {columns.map((column) => (
                                <StyledTableCell
                                  sx={{
                                    textAlign: "center",
                                    cursor:
                                      column.id == "hAmount"
                                        ? "pointer"
                                        : "default",
                                  }}
                                  key={column.id}
                                  align={column.align}
                                  style={{
                                    minWidth: column.minWidth,
                                  }}
                                  onClick={() => handleSort(column.id)}
                                >
                                  {column.label}
                                  {column.id == "hAmount"
                                    ? getSortIconhAmount(sortOrder_hAmount)
                                    : ""}
                                </StyledTableCell>
                              ))}
                            </TableRow>
                          )}
                        </TableHead>
                        {!tableDataLoader && addTableData()}
                      </Table>
                      {tableDataLoader && <FuseLoading />}

                      {!agentList.length > 0 && !tableDataLoader && (
                        <div
                          style={{
                            textAlign: "center",
                            color: "#fff",
                            padding: "0.95rem",
                          }}
                        >
                          {selectedLang.no_data_available_in_table}
                        </div>
                      )}
                    </TableContainer>
                    <TablePagination
                      rowsPerPageOptions={[20, 50, 100, 200, 500]}
                      component="div"
                      count={agentList_table_count}
                      rowsPerPage={rowsPerPage}
                      page={page}
                      labelRowsPerPage={selectedLang.rows_per_page}
                      onPageChange={handleChangePage}
                      onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                  </Paper>
                </CardContent>

                {/* <div className="flex justify-center items-center mt-4 mb-5">
                <Button
                  className="flex item-center"
                  variant="outlined"
                  color="secondary"
                  startIcon={<ChevronLeftIcon size={20}></ChevronLeftIcon>}
                  sx={{
                    borderRadius: "4px",
                  }}
                  onClick={(e) => {
                    getLastMonthData(e);
                  }}>
                  {selectedLang.view_previous_month}
                </Button>
                <Button
                  className="flex item-center ml-4"
                  variant="contained"
                  color="secondary"
                  endIcon={<ChevronRightIcon size={20}></ChevronRightIcon>}
                  sx={{
                    borderRadius: "4px",
                  }}
                  onClick={(e) => {
                    getThisMonthData(e);
                  }}>
                  {selectedLang.view_next_month}
                </Button>
              </div> */}
              </div>
            </Card>
          }
        />
      )}
    </>
  );
}

export default agentListApp;
