/** @format */

import * as React from "react";
import FusePageSimple from "@fuse/core/FusePageSimple";
import AgentListHeader from "./agentListHeader";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { locale } from "../../../../configs/navigation-i18n";
import { Box as TreeBox } from '@atlaskit/primitives';
import TableTree from '@atlaskit/table-tree';
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { Autocomplete, CardActionArea, CardActions, Menu } from "@mui/material";
import { CardHeader } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import "./agentList.css";
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
import {
  agentMenu,
  convertToKorean,
  formatLocalDateTime,
  formatSentence,
  formatLocalDateTimeforLastLogin,
} from "src/app/services/Utility";
import { useNavigate } from "react-router-dom";
import jwtDecode from "jwt-decode";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import PopupState, { bindTrigger, bindMenu } from "material-ui-popup-state";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import CloseIcon from "@mui/icons-material/Close";
import ModalComponent from "./modalComponent";

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

import { CSVLink } from "react-csv";

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
  const login_person = DataHandler.getFromSession("login_person");
  const user_id = DataHandler.getFromSession("user_id");

  const [requested_user_id, setrequested_user_id] = useState("");
  const [requested_name, setrequested_name] = useState("");
  const [requested_API, setrequested_API] = useState("");
  const [requested_amount, setrequested_amount] = useState(0);
  const [withdraw_amount, setwithdraw_amount] = useState(0);
  const [checked, setChecked] = React.useState(true);
  const [agentList, setAgentList] = useState("");

  const [csvData, setCsvData] = useState("");
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
  const [sortBy, setSortBy] = useState("hAmount"); 
  const [sortOrder, setSortOrder] = useState("desc"); 

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
  const [value2, setValue2] = React.useState("5");

  const handleChange2 = (event, newValue) => {
    setValue(newValue);
  };


  const handleChange3 = (event, newValue) => {
    setValue2(newValue);
  };


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
  const [tableDataLoader2, setTableDataLoader2] = useState(true);

  const [startDate, setStartDate] = useState(threeDaysAgo);
  const [endDate, setEndDate] = useState(todayDate);
  const [amountSum, setAmountSum] = useState(0);
  const [buttonDisabled, setButtonDisabled] = useState(false);

  // const getThisMonthData = (e) => {
  //   e.preventDefault();
  //   var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
  //   var currentDay = new Date(
  //     date.getFullYear(),
  //     date.getMonth() + 1,
  //     date.getDate()
  //   );
  //   setMonthFirstDay(firstDay);
  //   setMonthLastDay(currentDay);

  //   getAgentList(firstDay, lastDay);
  // };

  // const getLastMonthData = (e) => {
  //   e.preventDefault();
  //   const date = new Date();
  //   var firstDay = new Date(date.getFullYear(), date.getMonth() - 1, 1);
  //   var lastDay = new Date(date.getFullYear(), date.getMonth(), 0);

  //   setMonthFirstDay(firstDay);
  //   setMonthLastDay(lastDay);

  //   getAgentList(firstDay, lastDay);
  // };

  // const getUser = () => {
  //   APIService({
  //     url: `${process.env.REACT_APP_R_SITE_API}/user/details?user_id=${user_id}`,
  //     method: "GET",
  //   })
  //     .then((data) => {
  //       setCurrency(data.data.data[0].currency);
  //     })
  //     .catch((err) => {})
  //     .finally(() => {
  //       setLoading1(false);
  //     });
  // };

  const [agentList_table_count, _agentList_table_count] = useState(0);
  const [myType, setMyType] = useState();

  const [nickname, setNickname] = useState("");
  const [statusType, setStatusType] = useState("");
  const { search } = window.location;
  const { parent_id,agent:agentName } = queryString.parse(search);

  const [agentFilterValue, setAgentName] = useState(agentName !== undefined ? agentName : "");

  useEffect(() => {
    getTypes();
    getAgentList();
    // getUser();
    // getCsvData();
  }, [
    selectedprovider,
    page,
    rowsPerPage,
    selectedLang,
    value,
    sortOrder,
    parent_id,
  ]);

  const [adminType, setAdminType] = useState("");
  const handleChangeAdminType = (event, newValue) => {
    // const newValue = event.target.value;
    setAdminType(newValue?.value || "");
  };

  const [sumRowData, _sumRowData] = useState({});
  const getAgentList = (firstDay, lastDay) => {
    setTableDataLoader(true);
    setAgentList([]);

    let userID;
    if (role["role"] == "admin") {
      userID = user_id;
    } else {
      userID = parent_id ? parent_id : user_id;
    }

    APIService({
      url: `${
        process.env.REACT_APP_R_SITE_API
      }/user/agent-list?user_id=${userID}&provider=${selectedprovider}&start_date=${
        firstDay ? firstDay : monthFirstDay
      }&end_date=${
        lastDay ? lastDay : monthLastDay
      }&agent_name=${agentName !== undefined ? agentName : agentFilterValue}&pageNumber=${
        page + 1
      }&limit=${rowsPerPage}&nickname=${nickname}&admin_type=${adminType}&status=${value}&sort=${sortOrder}&sorBy=${sortBy}&parent_id=${
        parent_id || ""
      }`,
      method: "GET",
    })
      .then((res) => {
        setAgentList(res.data.data.UserDataResult.subAgentUsers);
        setCsvData(res.data.data.UserDataResult.subAgentUsers);

        setMyType(res.data.data.UserDataResult?.type);
        _sumRowData(res.data.data.UserDataResult.subRowsData);

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
            message: `${
              selectedLang[`${formatSentence(err?.message)}`] ||
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

  const getCsvData = (firstDay, lastDay) => {
    APIService({
      url: `${
        process.env.REACT_APP_R_SITE_API
      }/user/agent-list?user_id=${user_id}&provider=${selectedprovider}&start_date=${
        firstDay ? firstDay : monthFirstDay
      }&end_date=${
        lastDay ? lastDay : monthLastDay
      }&agent_name=${agentFilterValue}&pageNumber=1&limit=1000&nickname=${nickname}&admin_type=${adminType}&status=${value}&sort=${sortOrder}&sorBy=${sortBy}&parent_id=${
        parent_id || ""
      }`,
      method: "GET",
    })
      .then((res) => {
        setCsvData(res.data.data.UserDataResult.subAgentUsers);
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
      .finally(() => {});
  };

  const getUserDetails = () => {
    APIService({
      url: `${process.env.REACT_APP_R_SITE_API}/user/details?user_id=${user_id}`,
      method: "GET",
    })
      .then((data) => {
        setUserDetails(data.data.data[0]);
        setCurrency(data.data.data[0].currency);
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
        setLoading3(false);
        setLoading1(false);
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
            message: `${
              selectedLang[`${formatSentence(err?.message)}`] ||
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

  useEffect(()=>{
    searchHistory()
  },[agentName])

  const columns = [
    { id: "step", label: `${selectedLang.number}`, minWidth: 20, sort: false },
    // { id: "name", label: `${selectedLang.number}`, minWidth: 50 },
    // { id: "type", label: `${selectedLang.type}`, minWidth: 50, sort: false },
    {
      id: "aagent",
      label: `${selectedLang.affiliate_agent}`,
      minWidth: 50,
      sort: false,
    },
    // { id: "agent", label: `${selectedLang.agent}`, minWidth: 50 },
    // Anuj
    {
      id: "nickName",
      label: `${selectedLang.agentNickname}`,
      minWidth: 50,
      sort: false,
    },
    // { id: "button", label: ``, minWidth: 100, sort: false },
    // {
    //   id: "currency",
    //   label: `${selectedLang.currency}`,
    //   minWidth: 50,
    //   sort: false,
    // },
    {
      id: "hAmount1",
      label: ``,
      minWidth: 50,
      format: (value) => value.toLocaleString("en-US"),
    },
    {
      id: "hAmount",
      label: `${selectedLang.holding_amount}`,
      minWidth: 50,
      format: (value) => value.toLocaleString("en-US"),
      sort: true,
    },
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
      id: "rate",
      label: `${selectedLang.rate}`,
      minWidth: 50,
      format: (value) => value.toLocaleString("en-US"),
      sort: false,
    },
    {
      id: "total_amount_received",
      label: `${selectedLang.total_amout_recevied}`,
      minWidth: 50,
      format: (value) => value.toLocaleString("en-US"),
      sort: false,
    },
    {
      id: "total_amount_paid",
      label: `${selectedLang.total_amount_paid}`,
      minWidth: 50,
      format: (value) => value.toLocaleString("en-US"),
      sort: false,
    },
    {
      id: "total_amount_refunr",
      label: `${selectedLang.Refund}`,
      minWidth: 50,
      format: (value) => value.toLocaleString("en-US"),
      sort: false,
    },
    {
      id: "payment",
      label: `${selectedLang.action}`,
      minWidth: 150,
      format: (value) => value.toLocaleString("en-US"),
      sort: false,
    },
    {
      id: "last_login_time",
      label: `${selectedLang.last_login_date}`,
      minWidth: 50,
      format: (value) => value.toLocaleString("en-US"),
      sort: true,
    },

    {
      id: "disabletime",
      label: `${selectedLang.disable_time}`,
      minWidth: 50,
      format: (value) => value.toLocaleString("en-US"),
      sort: false,
    },

    {
      id: "activation",
      label: `${selectedLang.activation}`,
      minWidth: 50,
      format: (value) => value.toLocaleString("en-US"),
      sort: false,
    },

    {
      id: "created_at",
      label: `${selectedLang.date_registerd}`,
      minWidth: 100,
      sort: true,
    },
  ];

  const columnsCS = [
    { id: "step", label: `${selectedLang.number}`, minWidth: 20, sort: false },
    // { id: "name", label: `${selectedLang.number}`, minWidth: 50 },
    // { id: "type", label: `${selectedLang.type}`, minWidth: 50 },

    { id: "aagent", label: `${selectedLang.affiliate_agent}`, minWidth: 50 },
    // { id: "agent", label: `${selectedLang.agent}`, minWidth: 50 },
    { id: "nickName", label: `${selectedLang.agentNickname}`, minWidth: 50 },
    { id: "currency", label: ``, minWidth: 100 },
    { id: "currency", label: `${selectedLang.currency}`, minWidth: 50 },
    {
      id: "hAmount",
      label: `${selectedLang.holding_amount}`,
      minWidth: 50,
      format: (value) => value.toLocaleString("en-US"),
      sort: true,
    },
    {
      id: "rate",
      label: `${selectedLang.rate}`,
      minWidth: 50,
      format: (value) => value.toLocaleString("en-US"),
    },
    {
      id: "total_amount_received",
      label: `${selectedLang.total_amout_recevied}`,
      minWidth: 50,
      format: (value) => value.toLocaleString("en-US"),
    },
    {
      id: "total_amount_refunr",
      label: `${selectedLang.Refund}`,
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
      sort: true,
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
      .catch((err) => {})
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
          .catch((err) => {})
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
          .catch((err) => {})
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

  const [passcode, setPasscode] = useState();
  const [activationData, _activationData] = useState({});
  const [openPasscode, _openPasscode] = useState(false);

  const createStatus = (requested_user_id, checked) => {
    // e.preventDefault();
    APIService({
      url: `${process.env.REACT_APP_R_SITE_API}/user/change-status`,
      method: "POST",
      data: {
        user_id: requested_user_id,
        status: checked,
        passcode: passcode,
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
            variant:
              userToUpdate.status == "true" || userToUpdate?.status == 1
                ? "success"
                : "error",
            message: `${
              userToUpdate.status == "true" || userToUpdate?.status == 1
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
            message: `${selectedLang.invalid_verification_code}`,
          })
        );
      })
      .finally(() => {
        setPasscode("");
        _activationData({});
        _openPasscode(false);
      });
  };

  const openPasscodeModel = (requested_user_id, checked) => {
    if (role["role"] == "admin") {
      createStatus(requested_user_id, checked);
    } else {
      _activationData({
        requested_user_id: requested_user_id,
        checked: checked,
      });
      _openPasscode(true);
    }
  };
  const handleClosePasscode = () => {
    _openPasscode(false);
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
          message: `${
            selectedLang.user_id_is_required ||
            selectedLang.something_went_wrong
          }`,
        })
      );
    }

    if (requested_amount > 0 && requested_user_id != "") {
      setButtonDisabled(true);
      APIService({
        //url: `${process.env.REACT_APP_R_SITE_API}/request-payment/create-rsite-payment?amount=${requested_amount}&requested_user_id=${requested_user_id}`,
        url: `${
          process.env.REACT_APP_R_SITE_API
        }/transaction/create?amount=${requested_amount}&transaction_type=deposit&login_person=${login_person}&transaction_relation=${
          role["role"] == "admin" || role["role"] == "cs"
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
              message: `${
                selectedLang[`${formatSentence(err?.message)}`] ||
                selectedLang[`${formatSentence(err?.message)}`] ||
                selectedLang[`${formatSentence(err?.error?.message)}`] ||
                selectedLang.something_went_wrong
              }`,
            })
          );
        })
        .finally(() => {
          setButtonDisabled(false);
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

    if (requested_user_id == "") {
      dispatch(
        showMessage({
          variant: "error",
          message: `${
            selectedLang.user_id_is_required ||
            selectedLang.something_went_wrong
          }`,
        })
      );
    }

    if (withdraw_amount > 0 && requested_user_id != "") {
      setButtonDisabled(true);
      APIService({
        //url: `${process.env.REACT_APP_R_SITE_API}/request-withdraw/create-rsite-withdraw?amount=${withdraw_amount}&user_id=${requested_user_id}`,
        url: `${
          process.env.REACT_APP_R_SITE_API
        }/transaction/create?amount=${withdraw_amount}&transaction_type=withdraw&login_person=${login_person}&transaction_relation=${
          role["role"] == "admin" || role["role"] == "cs"
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
              message: `${
                selectedLang[`${formatSentence(err?.message)}`] ||
                selectedLang[`${formatSentence(err?.message)}`] ||
                selectedLang[`${formatSentence(err?.error?.message)}`] ||
                selectedLang.something_went_wrong
              }`,
            })
          );
        })
        .finally(() => {
          setButtonDisabled(false);
        });
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

  // const [sortOrder_hAmount, setSortOrder_hAmount] = useState("desc");
  // const [sortOrder_date, setSortOrder_date] = useState("");
  const [sortColoumns, setSortColoumns] = useState({
    hAmount: "desc",
  });
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
  // const handleSort = (coloumn) => {
  //   setSortBy(coloumn);
  //   setSortOrder(
  //     sortOrder === "asc" ? "desc" : sortOrder === "desc" ? "" : "asc"
  //   );
  //   if (coloumn == "hAmount") {
  //     setSortOrder_hAmount(
  //       sortOrder === "asc" ? "desc" : sortOrder === "desc" ? "" : "asc"
  //     );
  //   } else if (coloumn == "signupTime") {
  //     setSortOrder_date((prev) =>
  //       prev === "asc" ? "desc" : prev === "desc" ? "" : "asc"
  //     );
  //   }
  // };

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
          {sumRowData?.total_charged_amount?.toLocaleString() || 0}
        </TableCell>
        <TableCell
          sx={{
            textAlign: "center",
          }}
        >
          {sumRowData?.total_payment?.toLocaleString() || 0}
        </TableCell>
        <TableCell
          sx={{
            textAlign: "center",
          }}
        >
          {sumRowData?.total_refund?.toLocaleString() || 0}
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
          {createTotalRow()}
          {agentList
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
                  {/* <TableCell
                    sx={{
                      textAlign: "center",
                    }}
                  >
                    {type?.length > 0
                      ? selectedLang[`${getUserType(data?.type)}`].split(" ")[0]
                      : ""}
                  </TableCell> */}
                  <TableCell
                    sx={{
                      textAlign: "center",
                    }}
                  >
                    {/* {data.parent_id} */}
                    {agentMenu(selectedLang, data, navigate)}
                  </TableCell>
                  <TableCell
                    sx={{
                      textAlign: "center",
                      display: "flex", // Set display to flex to arrange children in a row
                      alignItems: "center", // Align items in the center vertically
                      justifyContent: "space-between",
                    }}
                    style={{ fontWeight: "bold" }}
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
                              overflowWrap: "break-word", // This property can be used for word wrapping
                              wordBreak: "break-all", // This property can be used to break long words
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
                                  `/max-win-management?agent_id=${data?.user_id}`
                                );
                              }}
                            >
                              {selectedLang.WINMANAGEMENT}
                            </MenuItem>
                            
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
                    <div className="row flex justify-end justify-items-center">
                      <div className="col-lg-8 col-md-4 col-sm-4 pl-10 flex item-center">
                        <PopupState variant="popover" popupId="top-popup">
                          {(popupState) => (
                            <React.Fragment>
                              <Button
                                className="flex item-center buttonbox"
                                variant="contained"
                                color="secondary"
                                size="small"
                                sx={{
                                  borderRadius: "4px",
                                }}
                                {...bindTrigger(popupState)}
                              >
                                {selectedLang.TOP}
                              </Button>
                              <Modal {...bindMenu(popupState)}>
                                <Box
                                  sx={{
                                    position: "absolute",
                                    top: "30%",
                                    left: "30%",
                                    width: "50%",
                                    height: "50%",
                                    bgcolor: "background.paper",
                                    borderRadius: "8px",
                                    boxShadow: 24,
                                    p: 4,
                                  }}
                                >
                                  <IconButton
                                    edge="end"
                                    color="inherit"
                                    onClick={popupState.close}
                                    aria-label="close"
                                    sx={{
                                      position: "absolute",
                                      top: "8px",
                                      right: "8px",
                                      marginRight: "5px",
                                    }}
                                  >
                                    <CloseIcon />
                                  </IconButton>

                                  <h2>{selectedLang.agentNickname}</h2>

                                  {data?.parentUsers.map((data, index) => (
                                    <div
                                      key={index}
                                      style={{ marginTop: "3%" }}
                                    >
                                      <PopupState
                                        variant="popover"
                                        popupId="demo-popup-menu"
                                      >
                                        {(popupState) => (
                                          <React.Fragment>
                                            <span
                                              style={{
                                                cursor: "pointer",
                                                overflowWrap: "break-word",
                                                wordBreak: "break-all",
                                                marginTop: "30px", // Adjust margin-top as needed
                                              }}
                                              {...bindTrigger(popupState)}
                                            >
                                              {" "}
                                              {data.id} <ArrowDropDownIcon />
                                            </span>

                                            <Menu {...bindMenu(popupState)}>
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
                                              <MenuItem
                                                onClick={() => {
                                                  popupState.close;
                                                  navigate(
                                                    `/user/betHistory?agent=${data?.id}`
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
                                  ))}
                                  <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={popupState.close}
                                    className="closeBTN"
                                    sx={{
                                      position: "absolute",
                                      bottom: "16px",
                                      right: "16px",
                                      borderRadius: 0,
                                      bgcolor: "blue",
                                    }}
                                  >
                                    Check
                                  </Button>
                                </Box>
                              </Modal>
                            </React.Fragment>
                          )}
                        </PopupState>
                      </div>
                      <div
                        className="col-lg-8 col-md-4 col-sm-4 flex item-center"
                        style={{ marginLeft: "10px" }}
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
                              `/agent/agentList?parent_id=${data?.user_id}`
                            );
                          }}
                        >
                          {selectedLang.bottom}({data?.subUsers})
                        </Button>
                      </div>
                    </div>
                  </TableCell>
                  {/* <TableCell
                    sx={{
                      textAlign: "center",
                    }}
                  >
                    {data?.currency}
                  </TableCell> */}
                  <TableCell
                    style={{
                      textDecoration: "underline",
                      cursor: "pointer",
                      fontWeight: "bold",
                    }}
                    onClick={() => {
                      navigate(
                        `/agent/transactionHistory?agent=${data?.id}`
                      );
                    }}
                    sx={{
                      textAlign: "center",
                    }}
                  >
                    {Number(data?.holding?.balance_amount)?.toLocaleString()}
                  </TableCell>
                  <TableCell
                    sx={{
                      textAlign: "center",
                    }}
                  >
                    {data.holding.rate}
                    {/* {moment(data.created_at).format("YYYY/MM/DD HH:mm:ss")} */}
                    {/* {dateFormat(data.created_at)} */}
                  </TableCell>
                  <TableCell
                    sx={{
                      textAlign: "center",
                    }}
                  >
                    {Number(
                      data.holding.total_charged_amount || 0
                    ).toLocaleString()}
                    {/* {moment(data.created_at).format("YYYY/MM/DD HH:mm:ss")} */}
                    {/* {dateFormat(data.created_at)} */}
                  </TableCell>
                  <TableCell
                    sx={{
                      textAlign: "center",
                    }}
                  >
                    {Number(data.holding.total_payment || 0).toLocaleString()}
                    {/* {moment(data.created_at).format("YYYY/MM/DD HH:mm:ss")} */}
                    {/* {dateFormat(data.created_at)} */}
                  </TableCell>

                  <TableCell
                    sx={{
                      textAlign: "center",
                    }}
                  >
                    {Number(data.holding.total_refund || 0).toLocaleString()}
                    {/* {moment(data.created_at).format("YYYY/MM/DD HH:mm:ss")} */}
                    {/* {dateFormat(data.created_at)} */}
                  </TableCell>
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
                    <div className="row flex justify-end justify-items-center">
                      {/* {role["role"] == "admin" || role["role"] == "cs" ? ( */}
                      {/* <div className="col-lg-8 col-md-4 col-sm-4 pl-10 flex item-center">
                        <Button
                          className="flex item-center buttonbox"
                          variant="contained"
                          color="secondary"
                          size="small"
                          sx={{
                            borderRadius: "4px",
                          }}
                          onClick={() =>
                            navigate(`/mypage?agent_id=${data?.user_id}`)
                          }
                        >
                          {selectedLang.MYPAGE}
                        </Button>
                      </div> */}
                      {/* ) : */}
                      {myType == "2" ? (
                        <div className="col-lg-8 col-md-4 col-sm-4 pl-10 flex item-center">
                          <Button
                            className="flex item-center buttonbox"
                            variant="contained"
                            color="secondary"
                            size="small"
                            sx={{
                              borderRadius: "4px",
                            }}
                            onClick={() =>
                              navigate(`/mypage?agent_id=${data?.user_id}`)
                            }
                          >
                            {selectedLang.MYPAGE}
                          </Button>
                        </div>
                      ) : (
                        ""
                      )}
                      {role["role"] != "cs" && (
                        <>
                          <div className="col-lg-2 col-md-4 col-sm-4 pl-10 flex item-center">
                            <Button
                              className="flex item-center buttonbox"
                              variant="contained"
                              color="success"
                              size="small"
                              sx={{
                                borderRadius: "4px",
                              }}
                              onClick={() => handleOpenWithdraw(data)}
                            >
                              {selectedLang.get_refund}
                            </Button>
                          </div>

                          <div
                            className="col-lg-8 col-md-4 col-sm-4 flex item-center"
                            style={{ marginLeft: "10px" }}
                          >
                            <Button
                              className="flex item-center buttonbox"
                              variant="contained"
                              color="secondary"
                              size="small"
                              sx={{
                                borderRadius: "4px",
                              }}
                              onClick={() => handleOpen(data)}
                            >
                              {selectedLang.payment}
                            </Button>
                          </div>
                        </>
                      )}
                      {/* <div className='col-lg-2 col-md-4 col-sm-4 pl-10 flex item-center'>
												<Button
													className='flex item-center'
													variant='contained'
													color='error'
													size='small'
													sx={{
														borderRadius: '4px',
													}}
													onClick={() => handleOpenStatus(data)}>
													{selectedLang.status}
												</Button>
											</div> */}
                    </div>
                  </TableCell>
                  <TableCell>
                    {data.last_login_time &&
                      formatLocalDateTimeforLastLogin(data.last_login_time)}
                  </TableCell>

                  <TableCell>
                  {data.disable_time
                      ? formatLocalDateTime(data.disable_time)
                      : ""}
                  </TableCell>

                  {role["role"] != "cs" && (
                    <>
                      <TableCell
                        sx={{
                          textAlign: "center",
                        }}
                      >
                        <Switch
                          checked={data?.status == 1 || data?.status == "true"}
                          onChange={(event) =>
                            openPasscodeModel(
                              data?.user_id,
                              event.target.checked
                            )
                          }
                          color="secondary"
                        />
                      </TableCell>
                    </>
                  )}

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
  const csvHeader = [
    { label: "Agent name", key: "nick_name" },
    { label: "AllowedIPs", key: "allowedIPs" },
    { label: "Parent Name", key: "parent_id" },
    { label: "Status", key: "status" },
    { label: "Wallet Type", key: "wallet_type" },
    { label: "ApiKey", key: "apiKey" },
    { label: "Balance CallbackURL", key: "balancecallbackURL" },
    { label: "Change Balance callbackURL", key: "changeBalancecallbackURL" },
    { label: "Created At", key: "created_at" },
  ];

  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

const [treeData,setTreeData] = useState([])


const getAgentTreeData = (agentName,statusType) => {


    APIService({
      url: `${process.env.REACT_APP_R_SITE_API}/user/agent-tree-data?user_id=${user_id}&agentName=${agentName !== undefined ? agentName : ""}&status=${statusType !== undefined ? statusType : ""}`,
      method: "GET",
    })
      .then((data) => {
        setTreeData([data.data.data[0]])
        setLoaded(false)
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
        setTableDataLoader2(true);
       });
  };


useEffect(()=>{
    getAgentTreeData()
},[])

useEffect(()=>{
  searchHistory2()
},[])

useEffect(()=>{
  searchHistory2()
},[value])


const searchHistory2 = async () => {
  setTreeData([])
  setTableDataLoader2(true);
  if(agentFilterValue || nickname){
    getAgentTreeData(agentFilterValue||nickname)
  }
  if(value){
    let activeStatus 
    if(value===1){
      activeStatus = ""
    }else if(value==2){
      activeStatus = "true"
    }else if(value==3){
      activeStatus = "false"
    }
    getAgentTreeData(agentFilterValue||nickname,activeStatus)
  }
};


let Content = { 
  name: "", 
  nickname: "",
  parentId: "", 
  balance_amount: 0,
  rate: "", 
  total_refund: "",
  total_received_amount: "", 
  total_amount_paid: "",
  login_histories: "", 
  parentUsers: "",
  action:"",
  disable_time:"",
  activation:"",
  created_at:""
};


let Item = {
  id: "",
  content: Content,
  hasChildren: false,
  children: []
};


// const Nickname = (Content) => <TreeBox as="span"  style={{fontWeight:"bold",color:"white",textAlign:"center"}}>{Content.name+"("+ Content.nickname + ")"}</TreeBox>;
// const parentUsers = (Content) => <TreeBox as="span" style={{fontWeight:"bold",color:"white",textAlign:"center"}}>{Content.parentUsers}</TreeBox>;

const Nickname = ( Content ) => {
  const navigate = useNavigate();

  return (
    <PopupState variant="popover" popupId="demo-popup-menu">
      {(popupState) => (
        <React.Fragment>
          <TreeBox as="span" {...bindTrigger(popupState)} style={{ fontWeight: 'bold', color: 'white', textAlign: 'center',textDecoration:"underline",cursor: "pointer" }}>
          {Content.name+"("+ Content.nickname + ")"}
          </TreeBox>
          <Menu {...bindMenu(popupState)}>
            <MenuItem
              onClick={() => {
                popupState.close();
                navigate(`/mypage?agent_id=${Content.user_id}`);
              }}
            >
              {selectedLang.MYPAGE}
            </MenuItem>
            <MenuItem
              onClick={() => {
                popupState.close();
                navigate(`/agent/transactionHistory?agent=${Content.name}`);
              }}
            >
              {selectedLang.TRANSACTIONHISTORYAGENT}
            </MenuItem>
            <MenuItem
              onClick={() => {
                popupState.close();
                navigate(`/agent/agentTreeList?q_agent=${Content.user_id}`);
              }}
            >
              {selectedLang.change_password}
            </MenuItem>
            <MenuItem
              onClick={() => {
                popupState.close();
                navigate(`/statistics/agentRevenueStatistics?agent=${Content.name}`);
              }}
            >
              {selectedLang.AGENTRSTATISTICS}
            </MenuItem>
            <MenuItem
              onClick={() => {
                popupState.close();
                navigate(`/statistics/statisticsByGame?agent_id=${Content.user_id}`);
              }}
            >
              {selectedLang.statisticsByGame}
            </MenuItem>
            <hr style={{ border: '1px solid' }} />
            <MenuItem
              onClick={() => {
                popupState.close();
                navigate(`/providerManagement?agent_id=${Content.user_id}`);
              }}
            >
              {selectedLang.PROVIDERMANAGEMENT}
            </MenuItem>
            <hr style={{ border: '1px solid' }} />
            <MenuItem
              onClick={() => {
                popupState.close();
                navigate(`/gameManagement?agent_id=${Content.user_id}`);
              }}
            >
              {selectedLang.GAMEMANAGEMENT}
            </MenuItem>
            <hr style={{ border: '1px solid' }} />
            <MenuItem
              onClick={() => {
                popupState.close();
                navigate(`/statistics/APIerror?agent_id=${Content.user_id}`);
              }}
            >
              {selectedLang.APIERRORLOG}
            </MenuItem>
            <hr style={{ border: '1px solid' }} />
            <MenuItem
              onClick={() => {
                popupState.close();
                navigate(`/user/userList?agent=${Content.name}`);
              }}
            >
              {selectedLang.USERLIST}
            </MenuItem>
            <MenuItem
              onClick={() => {
                popupState.close();
                navigate(`/user/transactionHistory?agent=${Content.name}`);
              }}
            >
              {selectedLang.TRANSACTIONHISTORYUSER}
            </MenuItem>
            <MenuItem
              onClick={() => {
                popupState.close();
                navigate(`/user/betHistory?agent=${Content.name}`);
              }}
            >
              {selectedLang.BETHISTORY}
            </MenuItem>
          </Menu>
        </React.Fragment>
      )}
    </PopupState>
  );
};


const parentUsers = ( Content ) => {
  const navigate = useNavigate();

  return (
    <PopupState variant="popover" popupId="demo-popup-menu">
      {(popupState) => (
        <React.Fragment>
          <TreeBox as="span" {...bindTrigger(popupState)} style={{ fontWeight: 'bold', color: 'white', textAlign: 'center',textDecoration:"underline",cursor: "pointer" }}>
          {Content.parentUsers}
          </TreeBox>
          <Menu {...bindMenu(popupState)}>
            <MenuItem
              onClick={() => {
                popupState.close();
                navigate(`/mypage?agent_id=${Content.parentId}`);
              }}
            >
              {selectedLang.MYPAGE}
            </MenuItem>
            <MenuItem
              onClick={() => {
                popupState.close();
                navigate(`/agent/transactionHistory?agent=${Content.parentUsers}`);
              }}
            >
              {selectedLang.TRANSACTIONHISTORYAGENT}
            </MenuItem>
            <MenuItem
              onClick={() => {
                popupState.close();
                navigate(`/agent/agentTreeList?q_agent=${Content.parentId}`);
              }}
            >
              {selectedLang.change_password}
            </MenuItem>
            <MenuItem
              onClick={() => {
                popupState.close();
                navigate(`/statistics/agentRevenueStatistics?agent=${Content.parentUsers}`);
              }}
            >
              {selectedLang.AGENTRSTATISTICS}
            </MenuItem>
            <MenuItem
              onClick={() => {
                popupState.close();
                navigate(`/statistics/statisticsByGame?agent_id=${Content.parentId}`);
              }}
            >
              {selectedLang.statisticsByGame}
            </MenuItem>
            <hr style={{ border: '1px solid' }} />
            <MenuItem
              onClick={() => {
                popupState.close();
                navigate(`/providerManagement?agent_id=${Content.parentId}`);
              }}
            >
              {selectedLang.PROVIDERMANAGEMENT}
            </MenuItem>
            <hr style={{ border: '1px solid' }} />
            <MenuItem
              onClick={() => {
                popupState.close();
                navigate(`/gameManagement?agent_id=${Content.parentId}`);
              }}
            >
              {selectedLang.GAMEMANAGEMENT}
            </MenuItem>
            <hr style={{ border: '1px solid' }} />
            <MenuItem
              onClick={() => {
                popupState.close();
                navigate(`/statistics/APIerror?agent_id=${Content.parentId}`);
              }}
            >
              {selectedLang.APIERRORLOG}
            </MenuItem>
            <hr style={{ border: '1px solid' }} />
            <MenuItem
              onClick={() => {
                popupState.close();
                navigate(`/user/userList?agent=${Content.parentUsers}`);
              }}
            >
              {selectedLang.USERLIST}
            </MenuItem>
            <MenuItem
              onClick={() => {
                popupState.close();
                navigate(`/user/transactionHistory?agent=${Content.parentUsers}`);
              }}
            >
              {selectedLang.TRANSACTIONHISTORYUSER}
            </MenuItem>
            <MenuItem
              onClick={() => {
                popupState.close();
                navigate(`/user/betHistory?agent=${Content.parentUsers}`);
              }}
            >
              {selectedLang.BETHISTORY}
            </MenuItem>
          </Menu>
        </React.Fragment>
      )}
    </PopupState>
  );
};

const balance_amount = (Content) => 
<TreeBox as="span" style={{fontWeight:"bold",color:"white",textAlign:"center",textDecoration:"underline",cursor:"pointer"}}
  onClick={() => {
    navigate(
      `/agent/transactionHistory?agent=${Content?.name}`
    );
  }}
>{(Content.balance_amount)}</TreeBox>;

const name = (Content) => <TreeBox as="span" style={{fontWeight:"bold",color:"white",textAlign:"center"}} >{Content.name}</TreeBox>;
const parentId = (Content) => <TreeBox as="span" style={{fontWeight:"bold",color:"white",textAlign:"center"}}>{Content.parentId}</TreeBox>;
const rate = (Content) => <TreeBox as="span" style={{fontWeight:"bold",color:"white",textAlign:"center"}}>{(Content.rate)}</TreeBox>;
const total_refund = (Content) => <TreeBox as="span" style={{fontWeight:"bold",color:"white",textAlign:"center"}}>{(Content.total_refund)}</TreeBox>;
const total_received_amount = (Content) => <TreeBox as="span" style={{fontWeight:"bold",color:"white",textAlign:"center"}}>{(Content.total_received_amount)}</TreeBox>;
const total_amount_paid = (Content) => <TreeBox as="span" style={{fontWeight:"bold",color:"white",textAlign:"center"}}>{(Content.total_amount_paid)}</TreeBox>;
const login_histories = (Content) => <TreeBox as="span" style={{fontWeight:"bold",color:"white",textAlign:"center"}}>{Content.name !=="admin"? Content.login_histories :""}</TreeBox>;
const action = (Content) => <TreeBox as="span" style={{fontWeight:"bold",color:"white",textAlign:"center", display:"flex"}}>{Content.action}</TreeBox>;
const disable_time = (Content) => <TreeBox as="span" style={{fontWeight:"bold",color:"white",textAlign:"center"}}>{Content.name !=="admin"? Content.disable_time:""}</TreeBox>;
const activation = (Content) => <TreeBox as="span" style={{fontWeight:"bold",color:"white",textAlign:"center"}}>{Content.activation}</TreeBox>;
const dateTime = (Content) => <TreeBox as="span" style={{fontWeight:"bold",color:"white",textAlign:"center"}}>{Content.name !=="admin" ? Content.created_at :""}</TreeBox>;


    function addActionsAndActivations(node) {
      if(node.id !== "admin"){
        node.content.action = (
          <>
            <div className="col-lg-2 col-md-4 col-sm-4 pl-10 flex item-center">
              <Button
                className="flex item-center buttonbox"
                variant="contained"
                color="success"
                size="small"
                sx={{
                  borderRadius: "4px",
                }}
                onClick={() => handleOpenWithdraw(node)}
              >
                {selectedLang.get_refund}
              </Button>
            </div>
            <div
              className="col-lg-8 col-md-4 col-sm-4 flex item-center"
              style={{ marginLeft: "10px" }}
            >
              <Button
                className="flex item-center buttonbox"
                variant="contained"
                color="secondary"
                size="small"
                sx={{
                  borderRadius: "4px",
                }}
                onClick={() => handleOpen(node)}
              >
                {selectedLang.payment}
              </Button>
            </div>
          </>
        );
  
        node.content.activation = (
          <>
            <Switch
              checked={node.content.status == 1 || node.content.status == "true"}
              onChange={(event) => openPasscodeModel(node?.user_id, event.target.checked)}
              color="secondary"
            />
          </>
        );
  
      }
  
      if (node.children && node.children.length > 0) {
        node.children.forEach((child) => addActionsAndActivations(child));
      }else if(node.children && node.children.length === 0){
        node.hasChildren === false
      }
      
    }

  treeData.forEach((data) => addActionsAndActivations(data));


    const items = [...treeData];


    const CustomHeader = ({ title }) => (
      <span className="table-tree-header">{title}</span>
    );

    const headersCustome = [
      (selectedLang.agentNickname).toUpperCase(),
      (selectedLang.affiliate_agent).toUpperCase(),
      (selectedLang.holding_amount).toUpperCase(),
      (selectedLang.rate).toUpperCase(),
      (selectedLang.total_amout_recevied).toUpperCase(),
      (selectedLang.total_amount_paid).toUpperCase(),
      (selectedLang.Refund).toUpperCase(),
      (selectedLang.action).toUpperCase(),
      (selectedLang.last_login_date).toUpperCase(),
      (selectedLang.disable_time).toUpperCase(),
      (selectedLang.activation).toUpperCase(),
      (selectedLang.date_registerd).toUpperCase()
    ].map(header => <CustomHeader title={header} />);


  return loaded ? (
    <FuseLoading />
  ) : (
    <>
    <FusePageSimple
      header={<AgentListHeader selectedLang={selectedLang} />}
      content={
        <>
          <Card
            sx={{ width: "100%", marginTop: "20px", borderRadius: "4px" }}
            className="main_card"
          >
            {/* {role["role"] == "admin" && (
                  <CSVLink
                    data={csvData}
                    filename={"Agent_List"}
                    headers={csvHeader}
                  >
                    <div
                      className="download_button"
                      style={{ borderRadius: "4px", width: "70px" }}
                    >
                      <img src={csv_image} alt="csv_image" />
                      <span>
                        <span></span>
                      </span>
                    </div>
                  </CSVLink>
                )} */}
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
                          key={"grid41"}
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
                          key={"grid5"}
                        >
                          <Button
                            key={"button-1"}
                            className="flex justify-center"
                            variant="contained"
                            color="secondary"
                            endIcon={
                              <DoneIcon key={"deone-icon"} size={20}></DoneIcon>
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
                            {convertToKorean(Number(currtAcba), selectLocale)}
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
                            {convertToKorean(
                              Number(
                                Number(requested_amount) + Number(currtAcba) ||
                                  0
                              ),
                              selectLocale
                            )}
                          </Typography>
                        </Grid>
                        <Grid
                          xs={12}
                          md={12}
                          key={"grid7"}
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
                          key={"grid1"}
                        >
                          <Button
                            key={"button-2"}
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
                            key={"button-3"}
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
                            key={"button-4"}
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
                            key={"button-5"}
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
                            key={"button-6"}
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
                            key={"button-7"}
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
                          key={"grid401"}
                        >
                          <Button
                            key={"button-8"}
                            className="flex justify-center"
                            variant="contained"
                            color="secondary"
                            endIcon={
                              <DoneIcon key={"deone-icon"} size={20}></DoneIcon>
                            }
                            sx={{
                              borderRadius: "4px",
                              width: "100%",
                            }}
                            disabled={
                              (myHolding &&
                                Number(myHolding) < requested_amount) ||
                              buttonDisabled
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
                <button className="modalclosebtn" onClick={handleCloseWithdraw}>
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
                          {selectedLang.create_withdraw}
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
                            {convertToKorean(Number(currtAcba), selectLocale)}
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
                            {convertToKorean(
                              Number(
                                Number(currtAcba) - Number(withdraw_amount) || 0
                              ),
                              selectLocale
                            )}
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
                          key={"grid04"}
                        >
                          <Button
                            key={"button-9"}
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
                            {selectedLang.five_million}{" "}
                          </Button>
                          <Button
                            key={"button-10"}
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
                            {selectedLang.hundred_million}{" "}
                          </Button>
                          <Button
                            key={"button-11"}
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
                            {selectedLang.three_hundred_million}{" "}
                          </Button>
                          <Button
                            key={"button-12"}
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
                            {selectedLang.five_hundred_million}{" "}
                          </Button>
                          <Button
                            key={"button-13"}
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
                            {selectedLang.one_billion}{" "}
                          </Button>
                          <Button
                            key={"button-14"}
                            className="flex justify-center numbtn"
                            variant="contained"
                            color="secondary"
                            sx={{
                              borderRadius: "4px",
                              width: "100%",
                            }}
                            onClick={() => {
                              // addValue("");
                              setwithdraw_amount(Number(currtAcba));
                            }}
                          >
                            {" "}
                            {selectedLang.MAX}{" "}
                          </Button>
                          <Button
                            key={"button-15"}
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
                            key={"button-16"}
                            className="flex justify-center"
                            variant="contained"
                            color="secondary"
                            endIcon={
                              <DoneIcon key={"deone-icon"} size={20}></DoneIcon>
                            }
                            sx={{
                              borderRadius: "4px",
                              width: "100%",
                            }}
                            onClick={(e) => createWithdraw(e)}
                            disabled={
                              Number(Number(currtAcba)) < withdraw_amount ||
                              buttonDisabled
                            }
                          >
                            {selectedLang.recovery}
                          </Button>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </div>
              </Box>
            </Modal>
            <div className="flex justify-start justify-items-center bg-gray p-10 list_title w-100">
              <span className="list-title">
                {selectedLang.agent_distribution_statistics}{" "}
                {/* {month} {curresntdata.getFullYear()}{" "}{userDetails.id} */}
              </span>
            </div>

            <div
              className="agent_filter_block"
              style={{ gap: "10px", flexWrap: "wrap" }}
            >
              {/* <Autocomplete
                      onChange={handleChangeAdminType}
                      sx={{
                        width: "150px",
                      }}
                      value={
                        adminType == ""
                          ? selectedLang.all
                          : adminType == "0"
                            ? selectedLang.Distribution
                            : adminType == "1"
                              ? selectedLang.Operational
                              : selectedLang.Concurrent
                      }
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
                    /> */}

               {
                value2 === "5"
                ?
                <>
              <InputBase
                sx={{
                  flex: 1,
                  border: "1px solid #cdcfd3",
                  borderRadius: "4px",
                  padding: "4px 10px",
                }}
                placeholder={selectedLang.nick_name}
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                inputProps={{ "aria-label": "Agent Name" }}
              />
              <InputBase
                sx={{
                  flex: 1,
                  border: "1px solid #cdcfd3",
                  borderRadius: "4px",
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
                onClick={value2 === "5"? searchHistory:searchHistory2}
              >
                {selectedLang.search}
              </Button>
                </>
                :
                <>
                </>
               }     

              {role["role"] != "cs" && value2 === "5" && (
                <div className="flex" style={{ gap: "10px" }}>
                  <Button
                    className="flex item-center"
                    variant="contained"
                    color="secondary"
                    sx={{
                      borderRadius: "4px",
                    }}
                    onClick={openModal}
                  >
                    {selectedLang.CREATEAGENT}
                  </Button>
                  <ModalComponent
                    isModalOpen={isModalOpen}
                    closeModal={closeModal}
                    setIsModalOpen={setIsModalOpen}
                  />
                  {/* <Modal
                        open={isModalOpen}
                        onClose={closeModal}
                        aria-labelledby="modal-modal-title"
                        aria-describedby="modal-modal-description"
                      >
                        <div>
                          <div
                            style={{
                              position: "absolute",
                              width: 800,
                              height: 600,
                              backgroundColor: "white",
                              border: "2px solid #fff",
                              boxShadow: 24,
                              p: 4,
                              top: "50%",
                              left: "50%",
                              transform: "translate(-50%, -50%)",
                              borderRadius: "0 8px 8px 0", // Adjust the border radius to match the background image
                            }}
                          >
                            <h2
                              id="modal-modal-title"
                              style={{ color: "black" }}
                            >
                              Create Agent
                            </h2>
                            <p id="modal-modal-description">
                              
                            </p>
                          </div>
                        </div>
                      </Modal> */}

                  {role["role"] == "admin" && (
                    <CSVLink
                      data={csvData}
                      className="download_tag"
                      filename={"Agent_List"}
                      headers={csvHeader}
                    >
                      <div
                        className="download_button"
                        style={{ width: "70px" }}
                      >
                        {selectedLang.Excel}
                      </div>
                    </CSVLink>
                  )}

                  {/* 
                      <Button
                        className="flex item-center"
                        variant="contained"
                        color="secondary"
                        // endIcon={<SearchIcon size={20}></SearchIcon>}
                        sx={{
                          borderRadius: "4px",
                        }}
                        onClick={() => {
                          navigate("");
                        }}
                      >
                        {selectedLang.CREATEAGENT}
                      </Button> */}
                </div>
              )}
            </div>

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
														style={{ textAlign: 'center, padding: '0.95rem' }}>
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
                <TabContext value={value2}>
                  <Box
                    sx={{ borderBottom: 1, borderColor: "divider" }}
                    className="common-tab"
                  >
                    {/* <TabList
                      onChange={handleChange3}
                      aria-label="lab API tabs example"
                    >
                      <Tab
                        label={selectedLang.treeTable}
                        value="6"
                        // onClick={searchHistory2}
                        className="tab_btn"
                      />
                      <Tab
                        label={selectedLang.simpleTable}
                        value="5"
                        className="tab_btn"
                      />
                      
                    </TabList> */}
                  </Box>
              <TabPanel value="5" className="common_tab_content">
                <TabContext value={value}>
                  <Box
                    sx={{ borderBottom: 1, borderColor: "divider" }}
                    className="common-tab"
                  >
                    <TabList
                      onChange={handleChange2}
                      aria-label="lab API tabs example"
                    >
                      <Tab
                        label={selectedLang.all}
                        value="1"
                        className="tab_btn"
                      />
                      <Tab
                        label={selectedLang.activated_agent}
                        value="2"
                        className="tab_btn"
                      />
                      <Tab
                        label={selectedLang.deactivated_agent}
                        value="3"
                        className="tab_btn"
                      />
                    </TabList>
                  </Box>
                  <TabPanel value="1" className="common_tab_content">
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
                                        : column.id == "signupTime"
                                        ? "pointer"
                                        : "default",
                                  }}
                                  key={column.id}
                                  align={column.align}
                                  style={{
                                    minWidth: column.minWidth,
                                  }}
                                  onClick={() => {
                                    if (column?.sort) handleSort(column.id);
                                  }}
                                >
                                  {column.label}
                                  {column?.sort &&
                                    getSortIconhAmount(
                                      sortColoumns?.[column.id]
                                    )}
                                  {/* {column.id == "hAmount"
                                          ? getSortIconhAmount(
                                              sortColoumns?.[column.id]
                                            )
                                          : column.id == "signupTime"
                                          ? getSortIconhAmount(
                                              sortColoumns?.[column.id]
                                            )
                                          : ""} */}
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
                                        : column.id == "signupTime"
                                        ? "pointer"
                                        : "default",
                                  }}
                                  key={column.id}
                                  align={column.align}
                                  style={{
                                    minWidth: column.minWidth,
                                  }}
                                  onClick={() => {
                                    if (column.sort) handleSort(column.id);
                                  }}
                                >
                                  {column.label}
                                  {column?.sort &&
                                    getSortIconhAmount(
                                      sortColoumns?.[column.id]
                                    )}
                                  {/* {column.id == "hAmount"
                                          ? getSortIconhAmount(
                                              sortColoumns?.[column.id]
                                            )
                                          : column.id == "signupTime"
                                          ? getSortIconhAmount(
                                              sortColoumns?.[column.id]
                                            )
                                          : ""} */}
                                </StyledTableCell>
                              ))}
                            </TableRow>
                          )}
                        </TableHead>
                        {addTableData()}
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
                  </TabPanel>

                  <TabPanel value="2" className="common_tab_content">
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
                                        : column.id == "signupTime"
                                        ? "pointer"
                                        : "default",
                                  }}
                                  key={column.id}
                                  align={column.align}
                                  style={{ minWidth: column.minWidth }}
                                  onClick={() => {
                                    if (column?.sort) handleSort(column.id);
                                  }}
                                >
                                  {column.label}
                                  {column.id == "hAmount"
                                    ? getSortIconhAmount(
                                        sortColoumns?.[column.id]
                                      )
                                    : column.id == "signupTime"
                                    ? getSortIconhAmount(
                                        sortColoumns?.[column.id]
                                      )
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
                                        : column.id == "signupTime"
                                        ? "pointer"
                                        : "default",
                                  }}
                                  key={column.id}
                                  align={column.align}
                                  style={{ minWidth: column.minWidth }}
                                  onClick={() => handleSort(column.id)}
                                >
                                  {column.label}
                                  {column.id == "hAmount"
                                    ? getSortIconhAmount(
                                        sortColoumns?.[column.id]
                                      )
                                    : column.id == "signupTime"
                                    ? getSortIconhAmount(
                                        sortColoumns?.[column.id]
                                      )
                                    : ""}
                                </StyledTableCell>
                              ))}
                            </TableRow>
                          )}
                        </TableHead>
                        {addTableData()}
                      </Table>
                      {tableDataLoader && <FuseLoading />}

                      {!agentList.length > 0 && !tableDataLoader && (
                        <div
                          style={{
                            color: "#fff",
                            textAlign: "center",
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
                  </TabPanel>

                  <TabPanel value="3" className="common_tab_content">
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
                                  style={{ minWidth: column.minWidth }}
                                  onClick={() => {
                                    if (column?.sort) handleSort(column.id);
                                  }}
                                >
                                  {column.label}
                                  {column.id == "hAmount"
                                    ? getSortIconhAmount(
                                        sortColoumns?.[column.id]
                                      )
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
                                  style={{ minWidth: column.minWidth }}
                                  onClick={() => handleSort(column.id)}
                                >
                                  {column.label}
                                  {column.id == "hAmount"
                                    ? getSortIconhAmount(
                                        sortColoumns?.[column.id]
                                      )
                                    : ""}
                                </StyledTableCell>
                              ))}
                            </TableRow>
                          )}
                        </TableHead>
                        {addTableData()}
                      </Table>
                      {tableDataLoader && <FuseLoading />}

                      {!agentList.length > 0 && !tableDataLoader && (
                        <div
                          style={{
                            color: "#fff",
                            textAlign: "center",
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
                  </TabPanel>
                </TabContext>
              </TabPanel>

              <TabPanel value="6" className="common_tab_content">
                {/* <TabContext value = {value}>
                <Box
                    sx={{ borderBottom: 1, borderColor: "divider" }}
                    className="common-tab"
                  >
                    <TabList
                      onChange={handleChange2}
                      aria-label="lab API tabs example"
                    >
                      <Tab
                        label={selectedLang.all}
                        value="1"
                        className="tab_btn"
                      />
                      <Tab
                        label={selectedLang.activated_agent}
                        value="2"
                        className="tab_btn"
                      />
                      <Tab
                        label={selectedLang.deactivated_agent}
                        value="3"
                        className="tab_btn"
                      />
                    </TabList>
                  </Box>
                </TabContext> */}
                <div className="tableContainer">
                {!treeData.length > 0 && <FuseLoading />}
                {!treeData.length > 0 && !tableDataLoader2 && (
                  <div
                    style={{
                      color: "#fff",
                      textAlign: "center",
                      padding: "0.95rem",
                    }}
                  >
                    {selectedLang.no_data_available_in_table}
                  </div>
                )}
                  { treeData.length > 0 &&(
                    <Table className = "tableTreeData">
                    <TableTree
                      columns={[
                        Nickname,
                        parentUsers, 
                        balance_amount,
                        rate,
                        total_received_amount,
                        total_amount_paid,
                        total_refund,
                        action,
                        login_histories,
                        disable_time,
                        activation,
                        dateTime
                      ]}
                      headers={treeData.length === 0 ?[]: headersCustome}
                      mainColumnForExpandCollapseLabel={headersCustome[`${selectedLang.agentNickname}`]}
                      columnWidths={['200px', '200px', '200px','200px', '200px', '200px','200px', '200px', '200px',"200px",'200px', '200px']}
                      items={items}
                      label="Aria labelled expand and collapse button example"
                    />
                  </Table>
                  )}
                </div>
              </TabPanel>
                </TabContext>
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
          </Card>

          <Modal
            open={openPasscode}
            onClose={handleClosePasscode}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box
              sx={style}
              className="Mymodal"
              style={{
                display: "flex",
                width: "20%",
                flexDirection: "column",
              }}
            >
              <button className="modalclosebtn" onClick={handleClosePasscode}>
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
                style={{
                  fontWeight: "700",
                  fontSize: "23px",
                }}
              >
                Enter Code
              </Typography>
              {/* Input field for OTP */}
              <TextField
                fullWidth
                className="mt-10"
                color="primary"
                size="small"
                type="number"
                placeholder={`${selectedLang.enter_code}`}
                value={passcode}
                onChange={({ target }) => {
                  setPasscode(target?.value);
                }}
              />
              {/* Button for submitting OTP */}
              <Button
                variant="contained"
                color="secondary"
                className="mt-10"
                onClick={() => {
                  createStatus(
                    activationData?.requested_user_id,
                    activationData?.checked
                  );
                }}
              >
                {selectedLang.submit}
              </Button>
            </Box>
          </Modal>
        </>
      }
    />
    </>
  );
}

export default agentListApp;
