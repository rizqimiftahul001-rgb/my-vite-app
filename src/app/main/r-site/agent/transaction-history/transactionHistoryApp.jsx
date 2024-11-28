/** @format */

import * as React from "react";
import { useRef } from "react";
import FusePageSimple from "@fuse/core/FusePageSimple";
import TransactionHistoryHeader from "./transactionHistoryHeader";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import "../../dashboard/dashboard.css";
// import { startOfDay, endOfDay, subDays, startOfMonth, endOfMonth, subMonths } from 'date-fns';
import TextField from "@mui/material/TextField";
import { locale } from "../../../../configs/navigation-i18n";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { Autocomplete, Button } from "@mui/material";
import {
  format,
  addDays,
  startOfDay,
  endOfDay,
  subDays,
  startOfMonth,
  endOfMonth,
  subMonths,
} from "date-fns";
import "./transactionHistory.css";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
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
import { useLocation } from "react-router-dom";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import { Tooltip } from "@mui/material";
import InputBase from "@mui/material/InputBase";
import SearchIcon from "@mui/icons-material/Search";
import APIService from "src/app/services/APIService";
import DataHandler from "src/app/handlers/DataHandler";
import jwtDecode from "jwt-decode";
import FuseLoading from "@fuse/core/FuseLoading";
import { showMessage } from "app/store/fuse/messageSlice";
import moment from "moment";
import { formatLocalDateTime, formatSentence } from "src/app/services/Utility";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSort } from "@fortawesome/free-solid-svg-icons";
import { faSortUp } from "@fortawesome/free-solid-svg-icons";
import { faSortDown } from "@fortawesome/free-solid-svg-icons";
import queryString from "query-string";
import cloneDeep from "lodash/cloneDeep";
import "flatpickr/dist/themes/material_green.css";
import Flatpickr from "react-flatpickr";
import PopupState, { bindTrigger, bindMenu } from "material-ui-popup-state";
import { Menu } from "@mui/material";
import { useNavigate } from "react-router-dom";
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

function transactionHistoryApp() {
  const location = useLocation();
  const todayDate = new Date();
  const navigate = useNavigate();
  todayDate.setDate(todayDate.getDate());
  todayDate.setHours(23, 59, 59, 999);
  // const threeDaysAgo = new Date(todayDate);
  // threeDaysAgo.setDate(todayDate.getDate() - 2);
  // threeDaysAgo.setHours(0, 0, 0, 0);
  const threeDaysAgo = new Date();
  threeDaysAgo.setDate(threeDaysAgo.getDate() - 30);
  threeDaysAgo.setHours(0, 0, 0, 0);
  const [status, setType] = useState("");
  const [agentFilterValue, setAgentName] = useState("");
  const [betData2, setBetData2] = useState();
  const [agentList, setAgentList] = useState([]);
  const role = jwtDecode(DataHandler.getFromSession("accessToken"))["data"];
  const user_id = DataHandler.getFromSession("user_id");
  const payment_type = "Sub Agent Deposit";
  const [selectLocale] = useSelector((state) => [state.locale.selectLocale]);
  const [selectedLang, setSelectedLang] = useState(locale.ko);
  const { search } = window.location;
  const { agent } = queryString.parse(search);

  const [agent_search, setAgent] = useState(agent || "");
  const [tras_agen_search, setTAgency] = useState("");
  const [parent, setParent] = useState("");
  const [sumArray, setSumArray] = useState("");
  const [adminrequest, setAdminRequest] = useState([]);
  const [admincard, setAdminCard] = useState();
  const [startDate, setStartDate] = useState(threeDaysAgo);
  const [endDate, setEndDate] = useState(todayDate);
  // const [agentFilterValue, setAgentFilterValue] = useState("");
  // const [status, setStatus] = useState("");
  const [subAgentDepositHistoryData, setSubAgentDepositHistoryData] = useState(
    []
  );
  const [agentDepositHistoryData, setAgentDepositHistoryData] = useState([]);
  const [agentRefundHistoryData, setAgentRefundHistoryData] = useState([]);

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState();
  const dropdownRef = useRef(null);

  const dispatch = useDispatch();
  const [loaded, setLoaded] = useState(true);
  const [loading1, setLoading1] = useState(false);
  const [loading2, setLoading2] = useState(true);
  const [loading3, setLoading3] = useState(true);

  useEffect(() => {
    if (role["role"] != "admin") {
      if (loading1 == false && loading2 == false) {
        setLoaded(false);
      }
    }
    if (role["role"] == "admin" || role["role"] == "cs") {
      if (loading3 == false) {
        setLoaded(false);
      }
    }
  }, [loading1, loading2, loading3]);

  useEffect(() => {
    if (selectLocale == "ko") {
      setSelectedLang(locale.ko);
    } else {
      setSelectedLang(locale.en);
    }
  }, [selectLocale]);

  useEffect(() => {
    if (agent) {
      setAgent(agent);
    }
  }, [location]);

  useEffect(() => {
    if (agent_search && agent) {
      getAdminRequest(startDate, endDate);
      getSubAgentPaymentHistory(startDate, endDate);
      getAgentPaymentHistory(startDate, endDate);
      getAgentRefund(startDate, endDate);
    }
  }, [location, agent_search]);

  const [page1, setPage1] = React.useState(0);
  const [page2, setPage2] = React.useState(0);
  const [page3, setPage3] = React.useState(0);
  const [page4, setPage4] = React.useState(0);

  const [rowsPerPage, setRowsPerPage] = React.useState(20);

  const [value, setValue] = React.useState("3");

  const handleChange2 = (event, newValue) => {
    setValue(newValue);
  };

  const handleChangePage1 = (event, newPage) => {
    setPage1(newPage);
  };

  const handleChangePage2 = (event, newPage) => {
    setPage2(newPage);
  };

  const handleChangePage3 = (event, newPage) => {
    setPage3(newPage);
  };

  const handleChangePage4 = (event, newPage) => {
    setPage4(newPage);
  };

  const onDataFilter = (startDate, endDate) => {

    // console.log(startDate, endDate);
    setEndDate(endDate)
    setStartDate(startDate)

  };

  const handleChangeRowsPerPage = (event) => {
    useEffect;
    setRowsPerPage(+event.target.value);
    setPage1(0);
    setPage2(0);
    setPage3(0);
    setPage4(0);
  };


  const [age, setAge] = React.useState("");

  const handleChange = (event) => {
    setAge(event.target.value);
  };

  useEffect(() => {
    getSubAgentPaymentHistory();
  }, [page1, rowsPerPage, selectedLang]);

  useEffect(() => {
    getAgentPaymentHistory();
  }, [page2, rowsPerPage, selectedLang]);

  useEffect(() => {
    getAdminRequest();
  }, [page3, rowsPerPage, selectedLang]);

  useEffect(() => {
    getAgentRefund();
  }, [page4, rowsPerPage, selectedLang]);

  useEffect(() => {
    getAdminRequestCard();
  }, []);

  const [adminrequestTableCount, _adminrequestTableCount] = useState(0);

  const [sortedAndMappedDataAll, setSortedAndMappedDataAll] = useState([]);
  const [originalSubDepoAll, setOriginalSubDepoAll] = useState([]);

  const [searchType, _searchType] = useState("");
  const handleChangeAdminType = (event, newValue) => {
    // console.log(newValue?.value);
    // const newValue = event.target.value;
    _searchType(newValue?.value || "");
  };

  const [subAgent, setSubAgent] = useState();
  const getAdminRequest = (pageNumber) => {
    // console.log(searchType);
    resetSorting();
    setLoading1(true);
    APIService({
      url: `${process.env.REACT_APP_R_SITE_API
        }/transaction/get-agent-all?&limit=${rowsPerPage}&pageNumber=${page1 + 1
        }&agent=${searchType == "0" ? agent_search : ""
        }&start_date=${startDate}&end_date=${endDate}&parent=${searchType == "1" ? agent_search : ""
        }`,
      method: "GET",
    })
      .then((res) => {
        // console.log(res);
        setAdminRequest(res.data.data.paginatedData);
        // setSumArray((prev) => ({ ...prev, adminrequest: res?.data?.sum }));
        setSumArray((prev) => ({
          ...prev,
          all_deposit: res?.data?.data.sumData[0]?.sumDepositAmount,
        }));
        setSumArray((prev) => ({
          ...prev,
          all_withdraw: res?.data?.data.sumData[0]?.sumWithdrawAmount,
        }));
        setSumArray((prev) => ({
          ...prev,
          all_refund: res?.data?.data.sumData[0]?.sumRefundAmount,
        }));
        _adminrequestTableCount(res.data.data.totalCount);
        setSortedAndMappedDataAll(res.data.data.paginatedData);
        setOriginalSubDepoAll(cloneDeep(res.data.data.paginatedData));
        // setSubAgent(res?.data?.subUsers);
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
        setLoading1(false);
      });
  };

  const getAdminRequestCard = () => {
    APIService({
      url: `${process.env.REACT_APP_R_SITE_API}/transaction/point-details`,
      method: "GET",
    })
      .then((res) => {
        // console.log(res.data.data);
        setAdminCard(res.data.data);
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
        setLoading1(false);
      });
  };
  // const [sortedAndMappedData, setSortedAndMappedData] = useState([]);
  const [originalSubDepo, setOriginalSubDepo] = useState([]);

  const [sortOrder_bbw, setSortOrder_bbw] = useState("");
  const [sortOrder_amt, setSortOrder_amt] = useState("");
  const [sortOrder_bad, setSortOrder_bad] = useState("");

  const resetSorting = () => {
    setSortOrder_bbw("");
    setSortOrder_amt("");
    setSortOrder_bad("");
  };
  const [subAgentTableCount, _subAgentTableCount] = useState(0);
  const getSubAgentPaymentHistory = (pageNumber) => {
    resetSorting();
    setLoading1(true);
    APIService({
      url: `${process.env.REACT_APP_R_SITE_API
        }/transaction/get-agent-deposit?&limit=${rowsPerPage}&pageNumber=${page1 + 1
        }&agent=${searchType == "1" ? agent_search : ""
        }&start_date=${startDate}&end_date=${endDate}&parent=${searchType == "0" ? agent_search : ""
        }`,
      method: "GET",
    })
      .then((res) => {
        setSubAgentDepositHistoryData(res.data.data.paginatedData);
        // setSortedAndMappedData(res.data.data)
        setOriginalSubDepo(cloneDeep(res.data.data));
        setSumArray((prev) => ({
          ...prev,
          agent_deposit: res?.data?.data.sumData[0]?.sumAmount,
        }));
        _subAgentTableCount(res?.data?.data.totalCount);
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
  };

  const [withdrawAgentTableCount, _withdrawAgentTableCount] = useState(0);
  // const [sortedAndMappedDataWithdraw, setSortedAndMappedDataWithdraw] = useState([]);
  const [originalSubDepoWithdraw, setOriginalSubDepoWithdraw] = useState([]);

  const getAgentPaymentHistory = (pageNumber) => {
    setLoading2(true);
    APIService({
      url: `${process.env.REACT_APP_R_SITE_API
        }/transaction/get-agent-withdraw?&limit=${rowsPerPage}&pageNumber=${page1 + 1
        }&agent=${searchType == "0" ? agent_search : ""
        }&start_date=${startDate}&end_date=${endDate}&parent=${searchType == "1" ? agent_search : ""
        }`,
      method: "GET",
    })
      .then((res) => {
        setAgentDepositHistoryData(res.data.data.paginatedData);
        setSumArray((prev) => ({
          ...prev,
          withdraw: res?.data?.data.sumData[0]?.sumAmount,
        }));

        _withdrawAgentTableCount(res?.data?.data.totalCount);

        setOriginalSubDepoWithdraw(cloneDeep(res.data.data));
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
  };

  const [refundAgentTableCount, _refundAgentTableCount] = useState(0);
  const getAgentRefund = (pageNumber) => {
    setLoading2(true);
    APIService({
      url: `${process.env.REACT_APP_R_SITE_API
        }/transaction/get-agent-refund?&limit=${rowsPerPage}&pageNumber=${page4 + 1
        }&agent=${searchType == "0" ? agent_search : ""
        }&start_date=${startDate}&end_date=${endDate}&parent=${searchType == "1" ? agent_search : ""
        }&all=${searchType == "" ? agent_search : ""}`,
      method: "GET",
    })
      .then((res) => {
        setAgentRefundHistoryData(res.data.data.paginatedData);
        setSumArray((prev) => ({
          ...prev,
          refund: res?.data?.data.sumData[0]?.sumAmount,
        }));

        _refundAgentTableCount(res?.data?.data.totalCount);
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
  };

  const handleDateChange = (option, selectedDate = null) => {
    let startDateValue, endDateValue;
    switch (option) {
      case "Today":
        startDateValue = startOfDay(new Date());
        endDateValue = endOfDay(new Date());
        setSelectedOption(
          `${selectedLang.today}: ${format(
            startDateValue,
            "MM/dd/yyyy"
          )} 00:00:00 - ${format(endDateValue, "MM/dd/yyyy")} 23:59:59`
        );
        break;
      case "Yesterday":
        startDateValue = startOfDay(subDays(new Date(), 1));
        endDateValue = endOfDay(subDays(new Date(), 1));
        setSelectedOption(
          `${selectedLang.yesterday}: ${format(
            startDateValue,
            "MM/dd/yyyy"
          )} 00:00:00 - ${format(endDateValue, "MM/dd/yyyy")} 23:59:59`
        );
        break;
      case "This Month":
        startDateValue = startOfMonth(new Date());
        endDateValue = endOfMonth(new Date());
        setSelectedOption(
          `${selectedLang.This_Month}: ${format(
            startDateValue,
            "MM/dd/yyyy"
          )} 00:00:00 - ${format(endDateValue, "MM/dd/yyyy")} 23:59:59`
        );
        break;
      case "Past Month":
        const today = new Date();
        endDateValue = endOfMonth(subMonths(today, 1));
        startDateValue = startOfMonth(subMonths(today, 1));
        setSelectedOption(
          `${selectedLang.Past_Month}: ${format(
            startDateValue,
            "MM/dd/yyyy"
          )} 00:00:00 - ${format(endDateValue, "MM/dd/yyyy")} 23:59:59`
        );
        break;
      case "Past 3 Months":
        const pastThreeMonthsEndDate = new Date();
        endDateValue = endOfMonth(pastThreeMonthsEndDate);
        startDateValue = startOfMonth(subMonths(pastThreeMonthsEndDate, 2));
        setSelectedOption(
          `${selectedLang.Past_3_months}: ${format(
            startDateValue,
            "MM/dd/yyyy"
          )} 00:00:00 - ${format(endDateValue, "MM/dd/yyyy")} 23:59:59`
        );
        break;
      default:
        startDateValue = null;
        endDateValue = null;
        setSelectedOption(selectedLang.any_date);
    }
    setStartDate(startDateValue);
    setEndDate(endDateValue);

    // Update selected date if a date is selected from the date picker
    if (selectedDate) {
      setSelectedOption(
        `${selectedLang.selected_date}: ${format(
          selectedDate,
          "MM/dd/yyyy"
        )} 00:00:00 - ${format(selectedDate, "MM/dd/yyyy")} 23:59:59`
      );
      setStartDate(startOfDay(selectedDate));
      setEndDate(endOfDay(selectedDate));
    }

    // Log the selected date
    if (startDateValue && endDateValue) {
      console.log(
        `${selectedLang.selected_date}: ${format(
          startDateValue,
          "MM/dd/yyyy"
        )} 00:00:00 - ${format(endDateValue, "MM/dd/yyyy")} 23:59:59`
      );
    } else if (startDateValue) {
      console.log(
        `${selectedLang.selected_date}: ${format(
          startDateValue,
          "MM/dd/yyyy"
        )} 00:00:00`
      );
    } else {
      console.log(selectedLang.no_date_selected);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        !event.target.classList.contains("flatpickr-day")
      ) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  // const AdminColumns = [
  //   { id: "name", label: `${selectedLang.number}`, minWidth: 50 },
  //   { id: "code", label: `${selectedLang.agent_name}`, minWidth: 100 },
  //   // {
  //   //   id: "population",
  //   //   label: `${selectedLang.receving_user_name}`,
  //   //   minWidth: 170,
  //   // },
  //   {
  //     id: "size",
  //     label: `${selectedLang.point_amount}`,
  //     minWidth: 170,
  //     format: (value) => value.toLocaleString("en-US"),
  //   },
  //   {
  //     id: "density",
  //     label: `${selectedLang.status}`,
  //     minWidth: 170,
  //   },
  //   {
  //     id: "date",
  //     label: `${selectedLang.date}`,
  //     minWidth: 100,
  //   },
  // ];

  const userColumns0 = [
    { id: "name", label: `${selectedLang.number}`, minWidth: 50 },
    {
      id: "population",
      label: `${selectedLang.TRANSACTION_OPERATOR}`,
      minWidth: 170,
    },
    { id: "code", label: `${selectedLang.OPERATIVE_OPERATOR}`, minWidth: 100 },

    {
      id: "density",
      label: `${selectedLang.balance_before_deposit}`,
      minWidth: 170,
    },
    {
      id: "size",
      label: `${selectedLang.amount}`,
      minWidth: 170,
      format: (value) => value.toLocaleString("en-US"),
    },
    {
      id: "Afdensity",
      label: `${selectedLang.balance_after_deposit}`,
      minWidth: 170,
    },
    {
      id: "date",
      label: `${selectedLang.date}`,
      minWidth: 100,
    },
  ];

  const userColumns4 = [
    { id: "name", label: `${selectedLang.number}`, minWidth: 50 },
    {
      id: "population",
      label: `${selectedLang.TRANSACTION_OPERATOR}`,
      minWidth: 170,
    },
    { id: "code", label: `${selectedLang.OPERATIVE_OPERATOR}`, minWidth: 100 },

    // {
    //   id: "type",
    //   label: `${selectedLang.type}`,
    //   minWidth: 170,
    // },
    {
      id: "density",
      label: `${selectedLang.balance_before}`,
      minWidth: 170,
    },
    {
      id: "size",
      label: `${selectedLang.amount}`,
      minWidth: 170,
      format: (value) => value.toLocaleString("en-US"),
    },
    {
      id: "Afdensity",
      label: `${selectedLang.balance_after}`,
      minWidth: 170,
    },
    {
      id: "date",
      label: `${selectedLang.date}`,
      minWidth: 100,
    },
  ];

  const userColumns3 = [
    { id: "name", label: `${selectedLang.number}`, minWidth: 50 },
    {
      id: "population",
      label: `${selectedLang.TRANSACTION_OPERATOR}`,
      minWidth: 170,
    },
    { id: "code", label: `${selectedLang.OPERATIVE_OPERATOR}`, minWidth: 100 },

    // {
    //   id: "type",
    //   label: `${selectedLang.type}`,
    //   minWidth: 170,
    // },
    {
      id: "density",
      label: `${selectedLang.balance_before}`,
      minWidth: 170,
    },
    {
      id: "size",
      label: `${selectedLang.deposit_money}`,
      minWidth: 170,
      format: (value) => value.toLocaleString("en-US"),
    },
    {
      id: "size",
      label: `${selectedLang.widthraw_money}`,
      minWidth: 170,
      format: (value) => value.toLocaleString("en-US"),
    },
    {
      id: "size",
      label: `${selectedLang.refund}`,
      minWidth: 170,
      format: (value) => value.toLocaleString("en-US"),
    },
    {
      id: "Afdensity",
      label: `${selectedLang.balance_after}`,
      minWidth: 170,
    },
    {
      id: "date",
      label: `${selectedLang.date}`,
      minWidth: 100,
    },
  ];

  const userColumns1 = [
    { id: "name", label: `${selectedLang.number}`, minWidth: 50 },
    {
      id: "population",
      label: `${selectedLang.TRANSACTION_OPERATOR}`,
      minWidth: 170,
    },
    { id: "code", label: `${selectedLang.OPERATIVE_OPERATOR}`, minWidth: 100 },

    {
      id: "density",
      label: `${selectedLang.balance_before_withdraw}`,
      minWidth: 170,
    },
    {
      id: "size",
      label: `${selectedLang.amount}`,
      minWidth: 170,
      format: (value) => value.toLocaleString("en-US"),
    },
    {
      id: "Afdensity",
      label: `${selectedLang.balance_after_withdraw}`,
      minWidth: 170,
    },
    {
      id: "date",
      label: `${selectedLang.date}`,
      minWidth: 100,
    },
  ];

  const getSortIconBBW = (order) => {
    return order === "asc" ? (
      <FontAwesomeIcon icon={faSortUp} className="sort-icon" />
    ) : order === "desc" ? (
      <FontAwesomeIcon icon={faSortDown} className="sort-icon" />
    ) : (
      <FontAwesomeIcon icon={faSort} className="sort-icon" />
    );
  };

  const getSortIconAMT = (order) => {
    return order === "asc" ? (
      <FontAwesomeIcon icon={faSortUp} className="sort-icon" />
    ) : order === "desc" ? (
      <FontAwesomeIcon icon={faSortDown} className="sort-icon" />
    ) : (
      <FontAwesomeIcon icon={faSort} className="sort-icon" />
    );
  };

  const getSortIconBAD = (order) => {
    return order === "asc" ? (
      <FontAwesomeIcon icon={faSortUp} className="sort-icon" />
    ) : order === "desc" ? (
      <FontAwesomeIcon icon={faSortDown} className="sort-icon" />
    ) : (
      <FontAwesomeIcon icon={faSort} className="sort-icon" />
    );
  };

  // const [sortBy, setSortBy] = useState(''); // Default sorting column
  // const handleSort = (column) => {
  // 	if(column =="size" || column =='density'|| column =='Afdensity'){
  // 		if (column === 'density') {
  // 		setSortBy("density")
  // 		setSortOrder_bbw(sortOrder_bbw === 'asc' ? 'desc' : sortOrder_bbw === 'desc' ? '' : 'asc')
  // 		} else if(column=='size'){
  // 		setSortBy("size")
  // 		setSortOrder_amt(sortOrder_amt === 'asc' ? 'desc' : sortOrder_amt === 'desc' ? '' : 'asc')
  // 		}else{
  // 			setSortBy("Afdensity")
  // 			setSortOrder_bad(sortOrder_bad === 'asc' ? 'desc' : sortOrder_bad === 'desc' ? '' : 'asc')
  // 		}
  // 	}
  // };

  const createSumRowDeposite = () => {
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
          {/* {sumArray?.agent_deposit &&
						sumArray?.agent_deposit[0]?.sumBeforePot?.toLocaleString()} */}
        </TableCell>
        <TableCell
          sx={{
            textAlign: "center",
          }}
        >
          {sumArray?.agent_deposit && sumArray?.agent_deposit?.toLocaleString()}
        </TableCell>
        <TableCell
          sx={{
            textAlign: "center",
          }}
        >
          {""}
          {/* {(sumArray?.agent_deposit &&
						sumArray?.agent_deposit[0]?.sumAfterPot?.toLocaleString()) ||
						0} */}
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

  const createSumRowRefund = () => {
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
          {/* {sumArray?.agent_deposit &&
						sumArray?.agent_deposit[0]?.sumBeforePot?.toLocaleString()} */}
        </TableCell>
        <TableCell
          sx={{
            textAlign: "center",
          }}
        >
          {sumArray?.refund && sumArray?.refund?.toLocaleString()}
        </TableCell>
        <TableCell
          sx={{
            textAlign: "center",
          }}
        >
          {""}
          {/* {(sumArray?.agent_deposit &&
						sumArray?.agent_deposit[0]?.sumAfterPot?.toLocaleString()) ||
						0} */}
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

  const [sortBy, setSortBy] = useState("name"); // Default sorting column
  const [sortOrder, setSortOrder] = useState(""); // Default sorting order

  const handleSort = (column) => {
    if (column == "density" || column == "size" || column == "Afdensity") {
      if (column === "density") {
        setSortBy("density");
        setSortOrder_bbw(
          sortOrder === "asc" ? "desc" : sortOrder === "desc" ? "" : "asc"
        );
        setSortOrder(
          sortOrder === "asc" ? "desc" : sortOrder === "desc" ? "" : "asc"
        );
      } else if (column === "size") {
        setSortBy("size");
        setSortOrder_amt(
          sortOrder === "asc" ? "desc" : sortOrder === "desc" ? "" : "asc"
        );
        setSortOrder(
          sortOrder === "asc" ? "desc" : sortOrder === "desc" ? "" : "asc"
        );
        // setSortBy(column);
        // setSortOrder('asc');
      } else {
        setSortBy("Afdensity");
        setSortOrder_bad(
          sortOrder === "asc" ? "desc" : sortOrder === "desc" ? "" : "asc"
        );
        setSortOrder(
          sortOrder === "asc" ? "desc" : sortOrder === "desc" ? "" : "asc"
        );
      }
    }
  };


  const initCopyUsSubAgPaymentData = [...subAgentDepositHistoryData];

  const sortedAndMappedData =
    sortOrder !== ""
      ? initCopyUsSubAgPaymentData.sort((a, b) => {
        if (sortBy === "size") {
          return sortOrder === "asc"
            ? a.amount - b.amount
            : b.amount - a.amount;
        } else if (sortBy == "density") {
          return sortOrder === "asc"
            ? a.before_pot - b.before_pot
            : b.before_pot - a.before_pot;
        } else {
          return sortOrder === "asc"
            ? a.after_pot - b.after_pot
            : b.after_pot - a.after_pot;
        }
      })
      : initCopyUsSubAgPaymentData;

  const addUserSubAgentPaymentData = () => {
    if (subAgentDepositHistoryData.length > 0) {
      return (
        <TableBody>
          {createSumRowDeposite()}
          {sortedAndMappedData
            // .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            .map((data, index) => {
              return (
                <StyledTableRow hover role="checkbox" tabIndex={-1} key={index}>
                  <TableCell
                    sx={{
                      textAlign: "center",
                    }}
                  >
                    {page1 * rowsPerPage + index + 1}
                  </TableCell>
                  <TableCell
                    sx={{
                      textAlign: "center",
                    }}
                  >
                    {role["role"] == "admin" ? (
                      <>
                        <PopupState variant="popover" popupId="demo-popup-menu">
                          {(popupState) => (
                            <React.Fragment>
                              <span
                                style={{
                                  textDecoration: "underline",
                                  textUnderlineOffset: "5px",
                                  cursor: "pointer",
                                }}
                                {...bindTrigger(popupState)}
                              >
                                {data?.from_user_name}
                              </span>
                              <Menu
                                {...bindMenu(popupState)}
                                className="all_menulist"
                              >
                                {/* {(role["role"] == "admin" ||
                                  role["role"] == "cs" ||
                                  myType == "2") && ( */}
                                <MenuItem
                                  onClick={() => {
                                    popupState.close;
                                    navigate(
                                      `/mypage?agent_id=${data?.from_user_id}`
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
                                      `/agent/transactionHistory?agent=${data?.from_user_name}`
                                    );
                                  }}
                                >
                                  {selectedLang.TRANSACTIONHISTORYAGENT}
                                </MenuItem>
                                <MenuItem
                                  onClick={() => {
                                    popupState.close;
                                    navigate(
                                      `/agent/agentTreeList?q_agent=${data?.from_user_id}`
                                    );
                                  }}
                                >
                                  {selectedLang.change_password}
                                </MenuItem>

                                <MenuItem
                                  onClick={() => {
                                    popupState.close;
                                    navigate(
                                      `/statistics/agentRevenueStatistics?agent=${data?.from_user_name}`
                                    );
                                  }}
                                >
                                  {selectedLang.AGENTRSTATISTICS}
                                </MenuItem>
                                <MenuItem
                                  onClick={() => {
                                    popupState.close;
                                    navigate(
                                      `/statistics/statisticsByGame?agent_id=${data?.from_user_id}`
                                    );
                                  }}
                                >
                                  {selectedLang.statisticsByGame}
                                </MenuItem>
                                {/* <MenuItem onClick={popupState.close}>Pot Distribution Statistics</MenuItem> */}
                                <hr style={{ border: "1px solid #e2e8f0 " }} />
                                <MenuItem
                                  onClick={() => {
                                    popupState.close;
                                    navigate(
                                      `/providerManagement?agent_id=${data?.from_user_id}`
                                    );
                                  }}
                                >
                                  {selectedLang.PROVIDERMANAGEMENT}
                                </MenuItem>
                                <hr style={{ border: "1px solid #e2e8f0" }} />
                                <MenuItem
                                  onClick={() => {
                                    popupState.close;
                                    navigate(
                                      `/gameManagement?agent_id=${data?.from_user_id}`
                                    );
                                  }}
                                >
                                  {selectedLang.GAMEMANAGEMENT}
                                </MenuItem>
                                <hr style={{ border: "1px solid #e2e8f0" }} />
                                <MenuItem
                                  onClick={() => {
                                    popupState.close;
                                    navigate(
                                      `/statistics/APIerror?agent_id=${data?.from_user_id}`
                                    );
                                  }}
                                >
                                  {selectedLang.APIERRORLOG}
                                </MenuItem>
                                <hr style={{ border: "1px solid #e2e8f0" }} />
                                <MenuItem
                                  onClick={() => {
                                    popupState.close;
                                    navigate(
                                      `/user/userList?agent=${data?.from_user_name}`
                                    );
                                  }}
                                >
                                  {selectedLang.USERLIST}
                                </MenuItem>
                                <MenuItem
                                  onClick={() => {
                                    popupState.close;
                                    navigate(
                                      `/agent/agentList?agent=${data?.from_user_name}`
                                    );
                                  }}
                                >
                                  {selectedLang.AGENTLIST}
                                </MenuItem>
                                <MenuItem
                                  onClick={() => {
                                    popupState.close;
                                    navigate(
                                      `/user/transactionHistory?agent=${data?.from_user_name}`
                                    );
                                  }}
                                >
                                  {selectedLang.TRANSACTIONHISTORYUSER}
                                </MenuItem>
                                <MenuItem
                                  onClick={() => {
                                    popupState.close;
                                    navigate(
                                      `/user/betHistory?agent=${data?.from_user_name}`
                                    );
                                  }}
                                >
                                  {selectedLang.BETHISTORY}
                                </MenuItem>
                              </Menu>
                            </React.Fragment>
                          )}
                        </PopupState>
                      </>
                    ) : (
                      <>
                        {data?.user?.from == true ? (
                          <>
                            <PopupState
                              variant="popover"
                              popupId="demo-popup-menu"
                            >
                              {(popupState) => (
                                <React.Fragment>
                                  <span
                                    style={{
                                      textDecoration: "underline",
                                      textUnderlineOffset: "5px",
                                      cursor: "pointer",
                                    }}
                                    {...bindTrigger(popupState)}
                                  >
                                    {data?.from_user_name}
                                  </span>
                                  <Menu
                                    {...bindMenu(popupState)}
                                    className="all_menulist"
                                  >
                                    {/* {(role["role"] == "admin" ||
                                  role["role"] == "cs" ||
                                  myType == "2") && ( */}
                                    <MenuItem
                                      onClick={() => {
                                        popupState.close;
                                        navigate(
                                          `/mypage?agent_id=${data?.from_user_id}`
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
                                          `/agent/transactionHistory?agent=${data?.from_user_name}`
                                        );
                                      }}
                                    >
                                      {selectedLang.TRANSACTIONHISTORYAGENT}
                                    </MenuItem>
                                    <MenuItem
                                      onClick={() => {
                                        popupState.close;
                                        navigate(
                                          `/agent/agentTreeList?q_agent=${data?.from_user_id}`
                                        );
                                      }}
                                    >
                                      {selectedLang.change_password}
                                    </MenuItem>

                                    <MenuItem
                                      onClick={() => {
                                        popupState.close;
                                        navigate(
                                          `/statistics/agentRevenueStatistics?agent=${data?.from_user_name}`
                                        );
                                      }}
                                    >
                                      {selectedLang.AGENTRSTATISTICS}
                                    </MenuItem>
                                    <MenuItem
                                      onClick={() => {
                                        popupState.close;
                                        navigate(
                                          `/statistics/statisticsByGame?agent_id=${data?.from_user_id}`
                                        );
                                      }}
                                    >
                                      {selectedLang.statisticsByGame}
                                    </MenuItem>
                                    {/* <MenuItem onClick={popupState.close}>Pot Distribution Statistics</MenuItem> */}
                                    <hr
                                      style={{ border: "1px solid #e2e8f0" }}
                                    />
                                    <MenuItem
                                      onClick={() => {
                                        popupState.close;
                                        navigate(
                                          `/providerManagement?agent_id=${data?.from_user_id}`
                                        );
                                      }}
                                    >
                                      {selectedLang.PROVIDERMANAGEMENT}
                                    </MenuItem>
                                    <hr
                                      style={{ border: "1px solid #e2e8f0" }}
                                    />
                                    <MenuItem
                                      onClick={() => {
                                        popupState.close;
                                        navigate(
                                          `/gameManagement?agent_id=${data?.from_user_id}`
                                        );
                                      }}
                                    >
                                      {selectedLang.GAMEMANAGEMENT}
                                    </MenuItem>
                                    <hr
                                      style={{ border: "1px solid #e2e8f0" }}
                                    />
                                    <MenuItem
                                      onClick={() => {
                                        popupState.close;
                                        navigate(
                                          `/statistics/APIerror?agent_id=${data?.from_user_id}`
                                        );
                                      }}
                                    >
                                      {selectedLang.APIERRORLOG}
                                    </MenuItem>
                                    <hr
                                      style={{ border: "1px solid #e2e8f0 " }}
                                    />
                                    <MenuItem
                                      onClick={() => {
                                        popupState.close;
                                        navigate(
                                          `/user/userList?agent=${data?.from_user_name}`
                                        );
                                      }}
                                    >
                                      {selectedLang.USERLIST}
                                    </MenuItem>
                                    <MenuItem
                                      onClick={() => {
                                        popupState.close;
                                        navigate(
                                          `/agent/agentList?agent=${data?.from_user_name}`
                                        );
                                      }}
                                    >
                                      {selectedLang.AGENTLIST}
                                    </MenuItem>
                                    <MenuItem
                                      onClick={() => {
                                        popupState.close;
                                        navigate(
                                          `/user/transactionHistory?agent=${data?.from_user_name}`
                                        );
                                      }}
                                    >
                                      {selectedLang.TRANSACTIONHISTORYUSER}
                                    </MenuItem>
                                    <MenuItem
                                      onClick={() => {
                                        popupState.close;
                                        navigate(
                                          `/user/betHistory?agent=${data?.from_user_name}`
                                        );
                                      }}
                                    >
                                      {selectedLang.BETHISTORY}
                                    </MenuItem>
                                  </Menu>
                                </React.Fragment>
                              )}
                            </PopupState>
                          </>
                        ) : (
                          <>{data?.from_user_name}</>
                        )}
                      </>
                    )}
                  </TableCell>
                  <TableCell
                    sx={{
                      textAlign: "center",
                    }}
                  >
                    {role["role"] == "admin" ? (
                      <>
                        <PopupState variant="popover" popupId="demo-popup-menu">
                          {(popupState) => (
                            <React.Fragment>
                              <span
                                style={{
                                  textDecoration: "underline",
                                  textUnderlineOffset: "5px",
                                  cursor: "pointer",
                                }}
                                {...bindTrigger(popupState)}
                              >
                                {data?.to_user_name}
                              </span>
                              <Menu
                                {...bindMenu(popupState)}
                                className="all_menulist"
                              >
                                {/* {(role["role"] == "admin" ||
                                  role["role"] == "cs" ||
                                  myType == "2") && ( */}
                                <MenuItem
                                  onClick={() => {
                                    popupState.close;
                                    navigate(
                                      `/mypage?agent_id=${data?.to_user_id}`
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
                                      `/agent/transactionHistory?agent=${data?.to_user_name}`
                                    );
                                  }}
                                >
                                  {selectedLang.TRANSACTIONHISTORYAGENT}
                                </MenuItem>
                                <MenuItem
                                  onClick={() => {
                                    popupState.close;
                                    navigate(
                                      `/agent/agentTreeList?q_agent=${data?.to_user_id}`
                                    );
                                  }}
                                >
                                  {selectedLang.change_password}
                                </MenuItem>

                                <MenuItem
                                  onClick={() => {
                                    popupState.close;
                                    navigate(
                                      `/statistics/agentRevenueStatistics?agent=${data?.to_user_name}`
                                    );
                                  }}
                                >
                                  {selectedLang.AGENTRSTATISTICS}
                                </MenuItem>
                                <MenuItem
                                  onClick={() => {
                                    popupState.close;
                                    navigate(
                                      `/statistics/statisticsByGame?agent_id=${data?.to_user_id}`
                                    );
                                  }}
                                >
                                  {selectedLang.statisticsByGame}
                                </MenuItem>
                                {/* <MenuItem onClick={popupState.close}>Pot Distribution Statistics</MenuItem> */}
                                <hr style={{ border: "1px solid #e2e8f0 " }} />
                                <MenuItem
                                  onClick={() => {
                                    popupState.close;
                                    navigate(
                                      `/providerManagement?agent_id=${data?.to_user_id}`
                                    );
                                  }}
                                >
                                  {selectedLang.PROVIDERMANAGEMENT}
                                </MenuItem>
                                <hr style={{ border: "1px solid #e2e8f0 " }} />
                                <MenuItem
                                  onClick={() => {
                                    popupState.close;
                                    navigate(
                                      `/gameManagement?agent_id=${data?.to_user_id}`
                                    );
                                  }}
                                >
                                  {selectedLang.GAMEMANAGEMENT}
                                </MenuItem>
                                <hr style={{ border: "1px solid #e2e8f0 " }} />
                                <MenuItem
                                  onClick={() => {
                                    popupState.close;
                                    navigate(
                                      `/statistics/APIerror?agent_id=${data?.to_user_id}`
                                    );
                                  }}
                                >
                                  {selectedLang.APIERRORLOG}
                                </MenuItem>
                                <hr style={{ border: "1px solid #e2e8f0 " }} />
                                <MenuItem
                                  onClick={() => {
                                    popupState.close;
                                    navigate(
                                      `/user/userList?agent=${data?.to_user_name}`
                                    );
                                  }}
                                >
                                  {selectedLang.USERLIST}
                                </MenuItem>
                                <MenuItem
                                  onClick={() => {
                                    popupState.close;
                                    navigate(
                                      `/agent/agentList?agent=${data?.to_user_name}`
                                    );
                                  }}
                                >
                                  {selectedLang.AGENTLIST}
                                </MenuItem>
                                <MenuItem
                                  onClick={() => {
                                    popupState.close;
                                    navigate(
                                      `/user/transactionHistory?agent=${data?.to_user_name}`
                                    );
                                  }}
                                >
                                  {selectedLang.TRANSACTIONHISTORYUSER}
                                </MenuItem>
                                <MenuItem
                                  onClick={() => {
                                    popupState.close;
                                    navigate(
                                      `/user/betHistory?agent=${data?.to_user_name}`
                                    );
                                  }}
                                >
                                  {selectedLang.BETHISTORY}
                                </MenuItem>
                              </Menu>
                            </React.Fragment>
                          )}
                        </PopupState>
                      </>
                    ) : (
                      <>
                        {data?.user?.to == true ? (
                          <>
                            <PopupState
                              variant="popover"
                              popupId="demo-popup-menu"
                            >
                              {(popupState) => (
                                <React.Fragment>
                                  <span
                                    style={{
                                      textDecoration: "underline",
                                      textUnderlineOffset: "5px",
                                      cursor: "pointer",
                                    }}
                                    {...bindTrigger(popupState)}
                                  >
                                    {data?.to_user_name}
                                  </span>
                                  <Menu
                                    {...bindMenu(popupState)}
                                    className="all_menulist"
                                  >
                                    {/* {(role["role"] == "admin" ||
                                  role["role"] == "cs" ||
                                  myType == "2") && ( */}
                                    <MenuItem
                                      onClick={() => {
                                        popupState.close;
                                        navigate(
                                          `/mypage?agent_id=${data?.to_user_id}`
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
                                          `/agent/transactionHistory?agent=${data?.to_user_name}`
                                        );
                                      }}
                                    >
                                      {selectedLang.TRANSACTIONHISTORYAGENT}
                                    </MenuItem>
                                    <MenuItem
                                      onClick={() => {
                                        popupState.close;
                                        navigate(
                                          `/agent/agentTreeList?q_agent=${data?.to_user_id}`
                                        );
                                      }}
                                    >
                                      {selectedLang.change_password}
                                    </MenuItem>

                                    <MenuItem
                                      onClick={() => {
                                        popupState.close;
                                        navigate(
                                          `/statistics/agentRevenueStatistics?agent=${data?.to_user_name}`
                                        );
                                      }}
                                    >
                                      {selectedLang.AGENTRSTATISTICS}
                                    </MenuItem>
                                    <MenuItem
                                      onClick={() => {
                                        popupState.close;
                                        navigate(
                                          `/statistics/statisticsByGame?agent_id=${data?.to_user_id}`
                                        );
                                      }}
                                    >
                                      {selectedLang.statisticsByGame}
                                    </MenuItem>
                                    {/* <MenuItem onClick={popupState.close}>Pot Distribution Statistics</MenuItem> */}
                                    <hr
                                      style={{ border: "1px solid #e2e8f0 " }}
                                    />
                                    <MenuItem
                                      onClick={() => {
                                        popupState.close;
                                        navigate(
                                          `/providerManagement?agent_id=${data?.to_user_id}`
                                        );
                                      }}
                                    >
                                      {selectedLang.PROVIDERMANAGEMENT}
                                    </MenuItem>
                                    <hr
                                      style={{ border: "1px solid #e2e8f0 " }}
                                    />
                                    <MenuItem
                                      onClick={() => {
                                        popupState.close;
                                        navigate(
                                          `/gameManagement?agent_id=${data?.to_user_id}`
                                        );
                                      }}
                                    >
                                      {selectedLang.GAMEMANAGEMENT}
                                    </MenuItem>
                                    <hr
                                      style={{ border: "1px solid #e2e8f0 " }}
                                    />
                                    <MenuItem
                                      onClick={() => {
                                        popupState.close;
                                        navigate(
                                          `/statistics/APIerror?agent_id=${data?.to_user_id}`
                                        );
                                      }}
                                    >
                                      {selectedLang.APIERRORLOG}
                                    </MenuItem>
                                    <hr
                                      style={{ border: "1px solid #e2e8f0 " }}
                                    />
                                    <MenuItem
                                      onClick={() => {
                                        popupState.close;
                                        navigate(
                                          `/user/userList?agent=${data?.to_user_name}`
                                        );
                                      }}
                                    >
                                      {selectedLang.USERLIST}
                                    </MenuItem>
                                    <MenuItem
                                      onClick={() => {
                                        popupState.close;
                                        navigate(
                                          `/agent/agentList?agent=${data?.to_user_name}`
                                        );
                                      }}
                                    >
                                      {selectedLang.AGENTLIST}
                                    </MenuItem>
                                    <MenuItem
                                      onClick={() => {
                                        popupState.close;
                                        navigate(
                                          `/user/transactionHistory?agent=${data?.to_user_name}`
                                        );
                                      }}
                                    >
                                      {selectedLang.TRANSACTIONHISTORYUSER}
                                    </MenuItem>
                                    <MenuItem
                                      onClick={() => {
                                        popupState.close;
                                        navigate(
                                          `/user/betHistory?agent=${data?.to_user_name}`
                                        );
                                      }}
                                    >
                                      {selectedLang.BETHISTORY}
                                    </MenuItem>
                                  </Menu>
                                </React.Fragment>
                              )}
                            </PopupState>
                          </>
                        ) : (
                          <>{data?.to_user_name}</>
                        )}
                      </>
                    )}
                  </TableCell>
                  <TableCell
                    sx={{
                      textAlign: "center",
                    }}
                  >
                    {role["role"] == "admin" ? (
                      <>
                        <p className="textSize1">
                          {Number(data?.from_before_pot)?.toLocaleString(
                            "en-US",
                            { maximumFractionDigits: 0 }
                          )}{" "}
                          <span className="textSize">
                            ({data?.from_user_name.split(" ")[0]})
                          </span>
                        </p>
                        <p className="textSize1">
                          {Number(data?.to_before_pot)?.toLocaleString(
                            "en-US",
                            { maximumFractionDigits: 0 }
                          )}{" "}
                          <span className="textSize">
                            ({data?.to_user_name.split(" ")[0]})
                          </span>
                        </p>
                      </>
                    ) : (
                      <>
                        {data?.user?.from == false
                          ? Number(data?.to_before_pot)?.toLocaleString()
                          : Number(data?.from_before_pot)?.toLocaleString()}
                      </>
                    )}
                  </TableCell>
                  <TableCell
                    sx={{
                      textAlign: "center",
                      fontWeight: "bold",
                    }}
                  >
                    {Number(data?.amount)?.toLocaleString()}
                  </TableCell>
                  <TableCell
                    sx={{
                      textAlign: "center",
                    }}
                  >
                    {role["role"] == "admin" ? (
                      // <>{Number(data?.from_after_pot)?.toLocaleString()}</>
                      <>
                        <p className="textSize1">
                          {Number(data?.from_after_pot)?.toLocaleString(
                            "en-US",
                            { maximumFractionDigits: 0 }
                          )}{" "}
                          <span className="textSize">
                            ({data?.from_user_name.split(" ")[0]})
                          </span>
                        </p>
                        <p className="textSize1">
                          {Number(data?.to_after_pot)?.toLocaleString("en-US", {
                            maximumFractionDigits: 0,
                          })}{" "}
                          <span className="textSize">
                            ({data?.to_user_name.split(" ")[0]})
                          </span>
                        </p>
                      </>
                    ) : (
                      <>
                        {data?.user?.from == false
                          ? Number(data?.to_after_pot)?.toLocaleString()
                          : Number(data?.from_after_pot)?.toLocaleString()}
                      </>
                    )}
                  </TableCell>
                  <TableCell
                    sx={{
                      textAlign: "center",
                    }}
                  >
                    {formatLocalDateTime(data.created_at)}
                  </TableCell>
                </StyledTableRow>
              );
            })}
        </TableBody>
      );
    }
  };

  const createSumRowWithdrawal = () => {
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
          {/* {sumArray?.withdraw &&
                sumArray?.withdraw[0]?.sumBeforePot?.toLocaleString()} */}
        </TableCell>
        <TableCell
          sx={{
            textAlign: "center",
            fontWeight: "bold",
          }}
        >
          {"-"}
          {sumArray?.withdraw && sumArray?.withdraw?.toLocaleString()}
        </TableCell>
        <TableCell
          sx={{
            textAlign: "center",
          }}
        >
          {""}
          {/* {(sumArray?.withdraw &&
                sumArray?.withdraw[0]?.sumAfterPot?.toLocaleString()) ||
                0} */}
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

  // function customSortWithdraw(data, sortBy, sortOrder) {
  // 	const originalSubDepoCopy = JSON.parse(JSON.stringify(originalSubDepoWithdraw));

  // 	const amountValues = data.map((item) => item[sortBy]);

  // 	amountValues.sort((a, b) => {
  // 	  if (sortOrder === 'asc') {
  // 		return a - b;
  // 	  } else if (sortOrder === 'desc') {
  // 		return b - a;
  // 	  }
  // 	  return 0;
  // 	});

  // 	data.forEach((item, index) => {
  // 	  if (sortOrder === 'asc' || sortOrder === 'desc') {
  // 		item[sortBy] = amountValues[index];
  // 	  } else {
  // 		const originalValue = originalSubDepoCopy[index][sortBy];
  // 		item[sortBy] = originalValue;
  // 	  }
  // 	});
  //   }
  //   if (sortBy === 'size') {
  // 	customSortWithdraw(sortedAndMappedDataWithdraw, 'amount', sortOrder_amt);
  //   }

  //   if (sortBy === 'density' ) {
  // 	customSortWithdraw(sortedAndMappedDataWithdraw, 'before_pot', sortOrder_bbw);
  //   }

  //   if (sortBy === 'Afdensity') {
  // 	customSortWithdraw(sortedAndMappedDataWithdraw, 'after_pot', sortOrder_bad);
  //   }
  //   Working fine end

  const initCopyPaymentDataData = [...agentDepositHistoryData];

  const sortedAndMappedDataWithdraw =
    sortOrder !== ""
      ? initCopyUsSubAgPaymentData.sort((a, b) => {
        if (sortBy === "size") {
          return sortOrder === "asc"
            ? a.amount - b.amount
            : b.amount - a.amount;
        } else if (sortBy == "density") {
          return sortOrder === "asc"
            ? a.before_pot - b.before_pot
            : b.before_pot - a.before_pot;
        } else {
          return sortOrder === "asc"
            ? a.after_pot - b.after_pot
            : b.after_pot - a.after_pot;
        }
      })
      : initCopyPaymentDataData;

  const addUserCreationPaymentData = () => {
    if (agentDepositHistoryData.length > 0) {
      return (
        <TableBody>
          {createSumRowWithdrawal()}
          {sortedAndMappedDataWithdraw
            //.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            .map((data, index) => {
              return (
                <StyledTableRow hover role="checkbox" tabIndex={-1} key={index}>
                  <TableCell
                    sx={{
                      textAlign: "center",
                    }}
                  >
                    {page1 * rowsPerPage + index + 1}
                  </TableCell>
                  <TableCell
                    sx={{
                      textAlign: "center",
                    }}
                  >
                    {role["role"] == "admin" ? (
                      <>
                        <PopupState variant="popover" popupId="demo-popup-menu">
                          {(popupState) => (
                            <React.Fragment>
                              <span
                                style={{
                                  textDecoration: "underline",
                                  textUnderlineOffset: "5px",
                                  cursor: "pointer",
                                }}
                                {...bindTrigger(popupState)}
                              >
                                {data?.from_user_name}
                              </span>
                              <Menu
                                {...bindMenu(popupState)}
                                className="all_menulist"
                              >
                                {/* {(role["role"] == "admin" ||
                                  role["role"] == "cs" ||
                                  myType == "2") && ( */}
                                <MenuItem
                                  onClick={() => {
                                    popupState.close;
                                    navigate(
                                      `/mypage?agent_id=${data?.from_user_id}`
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
                                      `/agent/transactionHistory?agent=${data?.from_user_name}`
                                    );
                                  }}
                                >
                                  {selectedLang.TRANSACTIONHISTORYAGENT}
                                </MenuItem>
                                <MenuItem
                                  onClick={() => {
                                    popupState.close;
                                    navigate(
                                      `/agent/agentTreeList?q_agent=${data?.from_user_id}`
                                    );
                                  }}
                                >
                                  {selectedLang.change_password}
                                </MenuItem>

                                <MenuItem
                                  onClick={() => {
                                    popupState.close;
                                    navigate(
                                      `/statistics/agentRevenueStatistics?agent=${data?.from_user_name}`
                                    );
                                  }}
                                >
                                  {selectedLang.AGENTRSTATISTICS}
                                </MenuItem>
                                <MenuItem
                                  onClick={() => {
                                    popupState.close;
                                    navigate(
                                      `/statistics/statisticsByGame?agent_id=${data?.from_user_id}`
                                    );
                                  }}
                                >
                                  {selectedLang.statisticsByGame}
                                </MenuItem>
                                {/* <MenuItem onClick={popupState.close}>Pot Distribution Statistics</MenuItem> */}
                                <hr style={{ border: "1px solid #e2e8f0 " }} />
                                <MenuItem
                                  onClick={() => {
                                    popupState.close;
                                    navigate(
                                      `/providerManagement?agent_id=${data?.from_user_id}`
                                    );
                                  }}
                                >
                                  {selectedLang.PROVIDERMANAGEMENT}
                                </MenuItem>
                                <hr style={{ border: "1px solid #e2e8f0 " }} />
                                <MenuItem
                                  onClick={() => {
                                    popupState.close;
                                    navigate(
                                      `/gameManagement?agent_id=${data?.from_user_id}`
                                    );
                                  }}
                                >
                                  {selectedLang.GAMEMANAGEMENT}
                                </MenuItem>
                                <hr style={{ border: "1px solid #e2e8f0 " }} />
                                <MenuItem
                                  onClick={() => {
                                    popupState.close;
                                    navigate(
                                      `/statistics/APIerror?agent_id=${data?.from_user_id}`
                                    );
                                  }}
                                >
                                  {selectedLang.APIERRORLOG}
                                </MenuItem>
                                <hr style={{ border: "1px solid #e2e8f0 " }} />
                                <MenuItem
                                  onClick={() => {
                                    popupState.close;
                                    navigate(
                                      `/user/userList?agent=${data?.from_user_name}`
                                    );
                                  }}
                                >
                                  {selectedLang.USERLIST}
                                </MenuItem>
                                <MenuItem
                                  onClick={() => {
                                    popupState.close;
                                    navigate(
                                      `/agent/agentList?agent=${data?.from_user_name}`
                                    );
                                  }}
                                >
                                  {selectedLang.AGENTLIST}
                                </MenuItem>
                                <MenuItem
                                  onClick={() => {
                                    popupState.close;
                                    navigate(
                                      `/user/transactionHistory?agent=${data?.from_user_name}`
                                    );
                                  }}
                                >
                                  {selectedLang.TRANSACTIONHISTORYUSER}
                                </MenuItem>
                                <MenuItem
                                  onClick={() => {
                                    popupState.close;
                                    navigate(
                                      `/user/betHistory?agent=${data?.from_user_name}`
                                    );
                                  }}
                                >
                                  {selectedLang.BETHISTORY}
                                </MenuItem>
                              </Menu>
                            </React.Fragment>
                          )}
                        </PopupState>
                      </>
                    ) : (
                      <>
                        {data?.user?.from == true ? (
                          <>
                            <PopupState
                              variant="popover"
                              popupId="demo-popup-menu"
                            >
                              {(popupState) => (
                                <React.Fragment>
                                  <span
                                    style={{
                                      textDecoration: "underline",
                                      textUnderlineOffset: "5px",
                                      cursor: "pointer",
                                    }}
                                    {...bindTrigger(popupState)}
                                  >
                                    {data?.from_user_name}
                                  </span>
                                  <Menu
                                    {...bindMenu(popupState)}
                                    className="all_menulist"
                                  >
                                    {/* {(role["role"] == "admin" ||
                                  role["role"] == "cs" ||
                                  myType == "2") && ( */}
                                    <MenuItem
                                      onClick={() => {
                                        popupState.close;
                                        navigate(
                                          `/mypage?agent_id=${data?.from_user_id}`
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
                                          `/agent/transactionHistory?agent=${data?.from_user_name}`
                                        );
                                      }}
                                    >
                                      {selectedLang.TRANSACTIONHISTORYAGENT}
                                    </MenuItem>
                                    <MenuItem
                                      onClick={() => {
                                        popupState.close;
                                        navigate(
                                          `/agent/agentTreeList?q_agent=${data?.from_user_id}`
                                        );
                                      }}
                                    >
                                      {selectedLang.change_password}
                                    </MenuItem>

                                    <MenuItem
                                      onClick={() => {
                                        popupState.close;
                                        navigate(
                                          `/statistics/agentRevenueStatistics?agent=${data?.from_user_name}`
                                        );
                                      }}
                                    >
                                      {selectedLang.AGENTRSTATISTICS}
                                    </MenuItem>
                                    <MenuItem
                                      onClick={() => {
                                        popupState.close;
                                        navigate(
                                          `/statistics/statisticsByGame?agent_id=${data?.from_user_id}`
                                        );
                                      }}
                                    >
                                      {selectedLang.statisticsByGame}
                                    </MenuItem>
                                    {/* <MenuItem onClick={popupState.close}>Pot Distribution Statistics</MenuItem> */}
                                    <hr
                                      style={{ border: "1px solid #e2e8f0 " }}
                                    />
                                    <MenuItem
                                      onClick={() => {
                                        popupState.close;
                                        navigate(
                                          `/providerManagement?agent_id=${data?.from_user_id}`
                                        );
                                      }}
                                    >
                                      {selectedLang.PROVIDERMANAGEMENT}
                                    </MenuItem>
                                    <hr
                                      style={{ border: "1px solid #e2e8f0 " }}
                                    />
                                    <MenuItem
                                      onClick={() => {
                                        popupState.close;
                                        navigate(
                                          `/gameManagement?agent_id=${data?.from_user_id}`
                                        );
                                      }}
                                    >
                                      {selectedLang.GAMEMANAGEMENT}
                                    </MenuItem>
                                    <hr
                                      style={{ border: "1px solid #e2e8f0 " }}
                                    />
                                    <MenuItem
                                      onClick={() => {
                                        popupState.close;
                                        navigate(
                                          `/statistics/APIerror?agent_id=${data?.from_user_id}`
                                        );
                                      }}
                                    >
                                      {selectedLang.APIERRORLOG}
                                    </MenuItem>
                                    <hr
                                      style={{ border: "1px solid #e2e8f0 " }}
                                    />
                                    <MenuItem
                                      onClick={() => {
                                        popupState.close;
                                        navigate(
                                          `/user/userList?agent=${data?.from_user_name}`
                                        );
                                      }}
                                    >
                                      {selectedLang.USERLIST}
                                    </MenuItem>
                                    <MenuItem
                                      onClick={() => {
                                        popupState.close;
                                        navigate(
                                          `/agent/agentList?agent=${data?.from_user_name}`
                                        );
                                      }}
                                    >
                                      {selectedLang.AGENTLIST}
                                    </MenuItem>
                                    <MenuItem
                                      onClick={() => {
                                        popupState.close;
                                        navigate(
                                          `/user/transactionHistory?agent=${data?.from_user_name}`
                                        );
                                      }}
                                    >
                                      {selectedLang.TRANSACTIONHISTORYUSER}
                                    </MenuItem>
                                    <MenuItem
                                      onClick={() => {
                                        popupState.close;
                                        navigate(
                                          `/user/betHistory?agent=${data?.from_user_name}`
                                        );
                                      }}
                                    >
                                      {selectedLang.BETHISTORY}
                                    </MenuItem>
                                  </Menu>
                                </React.Fragment>
                              )}
                            </PopupState>
                          </>
                        ) : (
                          <>{data?.from_user_name}</>
                        )}
                      </>
                    )}
                  </TableCell>
                  <TableCell
                    sx={{
                      textAlign: "center",
                    }}
                  >
                    {role["role"] == "admin" ? (
                      <>
                        <PopupState variant="popover" popupId="demo-popup-menu">
                          {(popupState) => (
                            <React.Fragment>
                              <span
                                style={{
                                  textDecoration: "underline",
                                  textUnderlineOffset: "5px",
                                  cursor: "pointer",
                                }}
                                {...bindTrigger(popupState)}
                              >
                                {data?.to_user_name}
                              </span>
                              <Menu
                                {...bindMenu(popupState)}
                                className="all_menulist"
                              >
                                {/* {(role["role"] == "admin" ||
                                  role["role"] == "cs" ||
                                  myType == "2") && ( */}
                                <MenuItem
                                  onClick={() => {
                                    popupState.close;
                                    navigate(
                                      `/mypage?agent_id=${data?.to_user_id}`
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
                                      `/agent/transactionHistory?agent=${data?.to_user_name}`
                                    );
                                  }}
                                >
                                  {selectedLang.TRANSACTIONHISTORYAGENT}
                                </MenuItem>
                                <MenuItem
                                  onClick={() => {
                                    popupState.close;
                                    navigate(
                                      `/agent/agentTreeList?q_agent=${data?.to_user_id}`
                                    );
                                  }}
                                >
                                  {selectedLang.change_password}
                                </MenuItem>

                                <MenuItem
                                  onClick={() => {
                                    popupState.close;
                                    navigate(
                                      `/statistics/agentRevenueStatistics?agent=${data?.to_user_name}`
                                    );
                                  }}
                                >
                                  {selectedLang.AGENTRSTATISTICS}
                                </MenuItem>
                                <MenuItem
                                  onClick={() => {
                                    popupState.close;
                                    navigate(
                                      `/statistics/statisticsByGame?agent_id=${data?.to_user_id}`
                                    );
                                  }}
                                >
                                  {selectedLang.statisticsByGame}
                                </MenuItem>
                                {/* <MenuItem onClick={popupState.close}>Pot Distribution Statistics</MenuItem> */}
                                <hr style={{ border: "1px solid #e2e8f0 " }} />
                                <MenuItem
                                  onClick={() => {
                                    popupState.close;
                                    navigate(
                                      `/providerManagement?agent_id=${data?.to_user_id}`
                                    );
                                  }}
                                >
                                  {selectedLang.PROVIDERMANAGEMENT}
                                </MenuItem>
                                <hr style={{ border: "1px solid #e2e8f0 " }} />
                                <MenuItem
                                  onClick={() => {
                                    popupState.close;
                                    navigate(
                                      `/gameManagement?agent_id=${data?.to_user_id}`
                                    );
                                  }}
                                >
                                  {selectedLang.GAMEMANAGEMENT}
                                </MenuItem>
                                <hr style={{ border: "1px solid #e2e8f0 " }} />
                                <MenuItem
                                  onClick={() => {
                                    popupState.close;
                                    navigate(
                                      `/statistics/APIerror?agent_id=${data?.to_user_id}`
                                    );
                                  }}
                                >
                                  {selectedLang.APIERRORLOG}
                                </MenuItem>
                                <hr style={{ border: "1px solid #e2e8f0 " }} />
                                <MenuItem
                                  onClick={() => {
                                    popupState.close;
                                    navigate(
                                      `/user/userList?agent=${data?.to_user_name}`
                                    );
                                  }}
                                >
                                  {selectedLang.USERLIST}
                                </MenuItem>
                                <MenuItem
                                  onClick={() => {
                                    popupState.close;
                                    navigate(
                                      `/agent/agentList?agent=${data?.to_user_name}`
                                    );
                                  }}
                                >
                                  {selectedLang.AGENTLIST}
                                </MenuItem>
                                <MenuItem
                                  onClick={() => {
                                    popupState.close;
                                    navigate(
                                      `/user/transactionHistory?agent=${data?.to_user_name}`
                                    );
                                  }}
                                >
                                  {selectedLang.TRANSACTIONHISTORYUSER}
                                </MenuItem>
                                <MenuItem
                                  onClick={() => {
                                    popupState.close;
                                    navigate(
                                      `/user/betHistory?agent=${data?.to_user_name}`
                                    );
                                  }}
                                >
                                  {selectedLang.BETHISTORY}
                                </MenuItem>
                              </Menu>
                            </React.Fragment>
                          )}
                        </PopupState>
                      </>
                    ) : (
                      <>
                        {data?.user?.to == true ? (
                          <>
                            <PopupState
                              variant="popover"
                              popupId="demo-popup-menu"
                            >
                              {(popupState) => (
                                <React.Fragment>
                                  <span
                                    style={{
                                      textDecoration: "underline",
                                      textUnderlineOffset: "5px",
                                      cursor: "pointer",
                                    }}
                                    {...bindTrigger(popupState)}
                                  >
                                    {data?.to_user_name}
                                  </span>
                                  <Menu
                                    {...bindMenu(popupState)}
                                    className="all_menulist"
                                  >
                                    {/* {(role["role"] == "admin" ||
                                  role["role"] == "cs" ||
                                  myType == "2") && ( */}
                                    <MenuItem
                                      onClick={() => {
                                        popupState.close;
                                        navigate(
                                          `/mypage?agent_id=${data?.to_user_id}`
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
                                          `/agent/transactionHistory?agent=${data?.to_user_name}`
                                        );
                                      }}
                                    >
                                      {selectedLang.TRANSACTIONHISTORYAGENT}
                                    </MenuItem>
                                    <MenuItem
                                      onClick={() => {
                                        popupState.close;
                                        navigate(
                                          `/agent/agentTreeList?q_agent=${data?.to_user_id}`
                                        );
                                      }}
                                    >
                                      {selectedLang.change_password}
                                    </MenuItem>

                                    <MenuItem
                                      onClick={() => {
                                        popupState.close;
                                        navigate(
                                          `/statistics/agentRevenueStatistics?agent=${data?.to_user_name}`
                                        );
                                      }}
                                    >
                                      {selectedLang.AGENTRSTATISTICS}
                                    </MenuItem>
                                    <MenuItem
                                      onClick={() => {
                                        popupState.close;
                                        navigate(
                                          `/statistics/statisticsByGame?agent_id=${data?.to_user_id}`
                                        );
                                      }}
                                    >
                                      {selectedLang.statisticsByGame}
                                    </MenuItem>
                                    {/* <MenuItem onClick={popupState.close}>Pot Distribution Statistics</MenuItem> */}
                                    <hr
                                      style={{ border: "1px solid #e2e8f0 " }}
                                    />
                                    <MenuItem
                                      onClick={() => {
                                        popupState.close;
                                        navigate(
                                          `/providerManagement?agent_id=${data?.to_user_id}`
                                        );
                                      }}
                                    >
                                      {selectedLang.PROVIDERMANAGEMENT}
                                    </MenuItem>
                                    <hr
                                      style={{ border: "1px solid #e2e8f0 " }}
                                    />
                                    <MenuItem
                                      onClick={() => {
                                        popupState.close;
                                        navigate(
                                          `/gameManagement?agent_id=${data?.to_user_id}`
                                        );
                                      }}
                                    >
                                      {selectedLang.GAMEMANAGEMENT}
                                    </MenuItem>
                                    <hr
                                      style={{ border: "1px solid #e2e8f0 " }}
                                    />
                                    <MenuItem
                                      onClick={() => {
                                        popupState.close;
                                        navigate(
                                          `/statistics/APIerror?agent_id=${data?.to_user_id}`
                                        );
                                      }}
                                    >
                                      {selectedLang.APIERRORLOG}
                                    </MenuItem>
                                    <hr
                                      style={{ border: "1px solid #e2e8f0 " }}
                                    />
                                    <MenuItem
                                      onClick={() => {
                                        popupState.close;
                                        navigate(
                                          `/user/userList?agent=${data?.to_user_name}`
                                        );
                                      }}
                                    >
                                      {selectedLang.USERLIST}
                                    </MenuItem>
                                    <MenuItem
                                      onClick={() => {
                                        popupState.close;
                                        navigate(
                                          `/agent/agentList?agent=${data?.to_user_name}`
                                        );
                                      }}
                                    >
                                      {selectedLang.AGENTLIST}
                                    </MenuItem>
                                    <MenuItem
                                      onClick={() => {
                                        popupState.close;
                                        navigate(
                                          `/user/transactionHistory?agent=${data?.to_user_name}`
                                        );
                                      }}
                                    >
                                      {selectedLang.TRANSACTIONHISTORYUSER}
                                    </MenuItem>
                                    <MenuItem
                                      onClick={() => {
                                        popupState.close;
                                        navigate(
                                          `/user/betHistory?agent=${data?.to_user_name}`
                                        );
                                      }}
                                    >
                                      {selectedLang.BETHISTORY}
                                    </MenuItem>
                                  </Menu>
                                </React.Fragment>
                              )}
                            </PopupState>
                          </>
                        ) : (
                          <>{data?.to_user_name}</>
                        )}
                      </>
                    )}
                  </TableCell>
                  <TableCell
                    sx={{
                      textAlign: "center",
                    }}
                  >
                    {role["role"] == "admin" ? (
                      <>
                        <p className="textSize1">
                          {Number(data?.from_before_pot)?.toLocaleString(
                            "en-US",
                            { maximumFractionDigits: 0 }
                          )}{" "}
                          <span className="textSize">
                            ({data?.from_user_name.split(" ")[0]})
                          </span>
                        </p>
                        <p className="textSize1">
                          {Number(data?.to_before_pot)?.toLocaleString(
                            "en-US",
                            { maximumFractionDigits: 0 }
                          )}{" "}
                          <span className="textSize">
                            ({data?.to_user_name.split(" ")[0]})
                          </span>
                        </p>
                      </>
                    ) : (
                      <>
                        {data?.user?.from == false
                          ? Number(data?.from_before_pot)?.toLocaleString()
                          : Number(data?.to_before_pot)?.toLocaleString()}
                      </>
                    )}
                  </TableCell>
                  <TableCell
                    sx={{
                      textAlign: "center",
                      fontWeight: "bold",
                    }}
                  >
                    - {Number(data?.amount)?.toLocaleString()}
                  </TableCell>
                  <TableCell
                    sx={{
                      textAlign: "center",
                    }}
                  >
                    {role["role"] == "admin" ? (
                      // <>{Number(data?.from_after_pot)?.toLocaleString()}</>
                      <>
                        <p className="textSize1">
                          {Number(data?.from_after_pot)?.toLocaleString(
                            "en-US",
                            { maximumFractionDigits: 0 }
                          )}{" "}
                          <span className="textSize">
                            ({data?.from_user_name.split(" ")[0]})
                          </span>
                        </p>
                        <p className="textSize1">
                          {Number(data?.to_after_pot)?.toLocaleString("en-US", {
                            maximumFractionDigits: 0,
                          })}{" "}
                          <span className="textSize">
                            ({data?.to_user_name.split(" ")[0]})
                          </span>
                        </p>
                      </>
                    ) : (
                      <>
                        {data?.user?.from == false
                          ? Number(data?.from_after_pot)?.toLocaleString()
                          : Number(data?.to_after_pot)?.toLocaleString()}
                      </>
                    )}
                  </TableCell>
                  <TableCell
                    sx={{
                      textAlign: "center",
                    }}
                  >
                    {formatLocalDateTime(data.created_at)}
                  </TableCell>
                </StyledTableRow>
              );
            })}
        </TableBody>
      );
    }
  };

  const sortedAndMappedDataRefund =
    sortOrder !== ""
      ? initCopyUsSubAgPaymentData.sort((a, b) => {
        if (sortBy === "size") {
          return sortOrder === "asc"
            ? a.amount - b.amount
            : b.amount - a.amount;
        } else if (sortBy == "density") {
          return sortOrder === "asc"
            ? a.before_pot - b.before_pot
            : b.before_pot - a.before_pot;
        } else {
          return sortOrder === "asc"
            ? a.after_pot - b.after_pot
            : b.after_pot - a.after_pot;
        }
      })
      : initCopyPaymentDataData;

  const addRefundData = () => {
    if (agentRefundHistoryData.length > 0) {
      return (
        <TableBody>
          {createSumRowRefund()}
          {agentRefundHistoryData
            //.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            .map((data, index) => {
              return (
                <StyledTableRow hover role="checkbox" tabIndex={-1} key={index}>
                  <TableCell
                    sx={{
                      textAlign: "center",
                    }}
                  >
                    {page1 * rowsPerPage + index + 1}
                  </TableCell>
                  <TableCell
                    sx={{
                      textAlign: "center",
                    }}
                  >
                    {role["role"] == "admin" ? (
                      <>
                        <PopupState variant="popover" popupId="demo-popup-menu">
                          {(popupState) => (
                            <React.Fragment>
                              <span
                                style={{
                                  textDecoration: "underline",
                                  textUnderlineOffset: "5px",
                                  cursor: "pointer",
                                }}
                                {...bindTrigger(popupState)}
                              >
                                {data?.to_user_name}
                              </span>
                              <Menu
                                {...bindMenu(popupState)}
                                className="all_menulist"
                              >
                                {/* {(role["role"] == "admin" ||
                                  role["role"] == "cs" ||
                                  myType == "2") && ( */}
                                <MenuItem
                                  onClick={() => {
                                    popupState.close;
                                    navigate(
                                      `/mypage?agent_id=${data?.to_user_id}`
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
                                      `/agent/transactionHistory?agent=${data?.to_user_name}`
                                    );
                                  }}
                                >
                                  {selectedLang.TRANSACTIONHISTORYAGENT}
                                </MenuItem>
                                <MenuItem
                                  onClick={() => {
                                    popupState.close;
                                    navigate(
                                      `/agent/agentTreeList?q_agent=${data?.to_user_id}`
                                    );
                                  }}
                                >
                                  {selectedLang.change_password}
                                </MenuItem>

                                <MenuItem
                                  onClick={() => {
                                    popupState.close;
                                    navigate(
                                      `/statistics/agentRevenueStatistics?agent=${data?.to_user_name}`
                                    );
                                  }}
                                >
                                  {selectedLang.AGENTRSTATISTICS}
                                </MenuItem>
                                <MenuItem
                                  onClick={() => {
                                    popupState.close;
                                    navigate(
                                      `/statistics/statisticsByGame?agent_id=${data?.to_user_id}`
                                    );
                                  }}
                                >
                                  {selectedLang.statisticsByGame}
                                </MenuItem>
                                {/* <MenuItem onClick={popupState.close}>Pot Distribution Statistics</MenuItem> */}
                                <hr style={{ border: "1px solid #e2e8f0 " }} />
                                <MenuItem
                                  onClick={() => {
                                    popupState.close;
                                    navigate(
                                      `/providerManagement?agent_id=${data?.to_user_id}`
                                    );
                                  }}
                                >
                                  {selectedLang.PROVIDERMANAGEMENT}
                                </MenuItem>
                                <hr style={{ border: "1px solid #e2e8f0 " }} />
                                <MenuItem
                                  onClick={() => {
                                    popupState.close;
                                    navigate(
                                      `/gameManagement?agent_id=${data?.to_user_id}`
                                    );
                                  }}
                                >
                                  {selectedLang.GAMEMANAGEMENT}
                                </MenuItem>
                                <hr style={{ border: "1px solid #e2e8f0 " }} />
                                <MenuItem
                                  onClick={() => {
                                    popupState.close;
                                    navigate(
                                      `/statistics/APIerror?agent_id=${data?.to_user_id}`
                                    );
                                  }}
                                >
                                  {selectedLang.APIERRORLOG}
                                </MenuItem>
                                <hr style={{ border: "1px solid #e2e8f0 " }} />
                                <MenuItem
                                  onClick={() => {
                                    popupState.close;
                                    navigate(
                                      `/user/userList?agent=${data?.to_user_name}`
                                    );
                                  }}
                                >
                                  {selectedLang.USERLIST}
                                </MenuItem>
                                <MenuItem
                                  onClick={() => {
                                    popupState.close;
                                    navigate(
                                      `/agent/agentList?agent=${data?.to_user_name}`
                                    );
                                  }}
                                >
                                  {selectedLang.AGENTLIST}
                                </MenuItem>
                                <MenuItem
                                  onClick={() => {
                                    popupState.close;
                                    navigate(
                                      `/user/transactionHistory?agent=${data?.to_user_name}`
                                    );
                                  }}
                                >
                                  {selectedLang.TRANSACTIONHISTORYUSER}
                                </MenuItem>
                                <MenuItem
                                  onClick={() => {
                                    popupState.close;
                                    navigate(
                                      `/user/betHistory?agent=${data?.to_user_name}`
                                    );
                                  }}
                                >
                                  {selectedLang.BETHISTORY}
                                </MenuItem>
                              </Menu>
                            </React.Fragment>
                          )}
                        </PopupState>
                      </>
                    ) : (
                      <>
                        {data?.user?.to == true ? (
                          <>
                            <PopupState
                              variant="popover"
                              popupId="demo-popup-menu"
                            >
                              {(popupState) => (
                                <React.Fragment>
                                  <span
                                    style={{
                                      textDecoration: "underline",
                                      textUnderlineOffset: "5px",
                                      cursor: "pointer",
                                    }}
                                    {...bindTrigger(popupState)}
                                  >
                                    {data?.to_user_name}
                                  </span>
                                  <Menu
                                    {...bindMenu(popupState)}
                                    className="all_menulist"
                                  >
                                    {/* {(role["role"] == "admin" ||
                                  role["role"] == "cs" ||
                                  myType == "2") && ( */}
                                    <MenuItem
                                      onClick={() => {
                                        popupState.close;
                                        navigate(
                                          `/mypage?agent_id=${data?.to_user_id}`
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
                                          `/agent/transactionHistory?agent=${data?.to_user_name}`
                                        );
                                      }}
                                    >
                                      {selectedLang.TRANSACTIONHISTORYAGENT}
                                    </MenuItem>
                                    <MenuItem
                                      onClick={() => {
                                        popupState.close;
                                        navigate(
                                          `/agent/agentTreeList?q_agent=${data?.to_user_id}`
                                        );
                                      }}
                                    >
                                      {selectedLang.change_password}
                                    </MenuItem>

                                    <MenuItem
                                      onClick={() => {
                                        popupState.close;
                                        navigate(
                                          `/statistics/agentRevenueStatistics?agent=${data?.to_user_name}`
                                        );
                                      }}
                                    >
                                      {selectedLang.AGENTRSTATISTICS}
                                    </MenuItem>
                                    <MenuItem
                                      onClick={() => {
                                        popupState.close;
                                        navigate(
                                          `/statistics/statisticsByGame?agent_id=${data?.to_user_id}`
                                        );
                                      }}
                                    >
                                      {selectedLang.statisticsByGame}
                                    </MenuItem>
                                    {/* <MenuItem onClick={popupState.close}>Pot Distribution Statistics</MenuItem> */}
                                    <hr
                                      style={{ border: "1px solid #e2e8f0 " }}
                                    />
                                    <MenuItem
                                      onClick={() => {
                                        popupState.close;
                                        navigate(
                                          `/providerManagement?agent_id=${data?.to_user_id}`
                                        );
                                      }}
                                    >
                                      {selectedLang.PROVIDERMANAGEMENT}
                                    </MenuItem>
                                    <hr
                                      style={{ border: "1px solid #e2e8f0 " }}
                                    />
                                    <MenuItem
                                      onClick={() => {
                                        popupState.close;
                                        navigate(
                                          `/gameManagement?agent_id=${data?.to_user_id}`
                                        );
                                      }}
                                    >
                                      {selectedLang.GAMEMANAGEMENT}
                                    </MenuItem>
                                    <hr
                                      style={{ border: "1px solid #e2e8f0 " }}
                                    />
                                    <MenuItem
                                      onClick={() => {
                                        popupState.close;
                                        navigate(
                                          `/statistics/APIerror?agent_id=${data?.to_user_id}`
                                        );
                                      }}
                                    >
                                      {selectedLang.APIERRORLOG}
                                    </MenuItem>
                                    <hr
                                      style={{ border: "1px solid #e2e8f0 " }}
                                    />
                                    <MenuItem
                                      onClick={() => {
                                        popupState.close;
                                        navigate(
                                          `/user/userList?agent=${data?.to_user_name}`
                                        );
                                      }}
                                    >
                                      {selectedLang.USERLIST}
                                    </MenuItem>
                                    <MenuItem
                                      onClick={() => {
                                        popupState.close;
                                        navigate(
                                          `/agent/agentList?agent=${data?.to_user_name}`
                                        );
                                      }}
                                    >
                                      {selectedLang.AGENTLIST}
                                    </MenuItem>
                                    <MenuItem
                                      onClick={() => {
                                        popupState.close;
                                        navigate(
                                          `/user/transactionHistory?agent=${data?.to_user_name}`
                                        );
                                      }}
                                    >
                                      {selectedLang.TRANSACTIONHISTORYUSER}
                                    </MenuItem>
                                    <MenuItem
                                      onClick={() => {
                                        popupState.close;
                                        navigate(
                                          `/user/betHistory?agent=${data?.to_user_name}`
                                        );
                                      }}
                                    >
                                      {selectedLang.BETHISTORY}
                                    </MenuItem>
                                  </Menu>
                                </React.Fragment>
                              )}
                            </PopupState>
                          </>
                        ) : (
                          <>{data?.to_user_name}</>
                        )}
                      </>
                    )}
                  </TableCell>
                  <TableCell
                    sx={{
                      textAlign: "center",
                    }}
                  >
                    {role["role"] == "admin" ? (
                      <>
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
                                {data?.from_user_name}
                              </span>
                              <Menu
                                {...bindMenu(popupState)}
                                className="all_menulist"
                              >
                                {/* {(role["role"] == "admin" ||
                                  role["role"] == "cs" ||
                                  myType == "2") && ( */}
                                <MenuItem
                                  onClick={() => {
                                    popupState.close;
                                    navigate(
                                      `/mypage?agent_id=${data?.from_user_id}`
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
                                      `/agent/transactionHistory?agent=${data?.from_user_name}`
                                    );
                                  }}
                                >
                                  {selectedLang.TRANSACTIONHISTORYAGENT}
                                </MenuItem>
                                <MenuItem
                                  onClick={() => {
                                    popupState.close;
                                    navigate(
                                      `/agent/agentTreeList?q_agent=${data?.from_user_id}`
                                    );
                                  }}
                                >
                                  {selectedLang.change_password}
                                </MenuItem>

                                <MenuItem
                                  onClick={() => {
                                    popupState.close;
                                    navigate(
                                      `/statistics/agentRevenueStatistics?agent=${data?.from_user_name}`
                                    );
                                  }}
                                >
                                  {selectedLang.AGENTRSTATISTICS}
                                </MenuItem>
                                <MenuItem
                                  onClick={() => {
                                    popupState.close;
                                    navigate(
                                      `/statistics/statisticsByGame?agent_id=${data?.from_user_id}`
                                    );
                                  }}
                                >
                                  {selectedLang.statisticsByGame}
                                </MenuItem>
                                {/* <MenuItem onClick={popupState.close}>Pot Distribution Statistics</MenuItem> */}
                                <hr style={{ border: "1px solid #e2e8f0 " }} />
                                <MenuItem
                                  onClick={() => {
                                    popupState.close;
                                    navigate(
                                      `/providerManagement?agent_id=${data?.from_user_id}`
                                    );
                                  }}
                                >
                                  {selectedLang.PROVIDERMANAGEMENT}
                                </MenuItem>
                                <hr style={{ border: "1px solid #e2e8f0 " }} />
                                <MenuItem
                                  onClick={() => {
                                    popupState.close;
                                    navigate(
                                      `/gameManagement?agent_id=${data?.from_user_id}`
                                    );
                                  }}
                                >
                                  {selectedLang.GAMEMANAGEMENT}
                                </MenuItem>
                                <hr style={{ border: "1px solid #e2e8f0 " }} />
                                <MenuItem
                                  onClick={() => {
                                    popupState.close;
                                    navigate(
                                      `/statistics/APIerror?agent_id=${data?.from_user_id}`
                                    );
                                  }}
                                >
                                  {selectedLang.APIERRORLOG}
                                </MenuItem>
                                <hr style={{ border: "1px solid #e2e8f0 " }} />
                                <MenuItem
                                  onClick={() => {
                                    popupState.close;
                                    navigate(
                                      `/user/userList?agent=${data?.from_user_name}`
                                    );
                                  }}
                                >
                                  {selectedLang.USERLIST}
                                </MenuItem>
                                <MenuItem
                                  onClick={() => {
                                    popupState.close;
                                    navigate(
                                      `/agent/agentList?agent=${data?.from_user_name}`
                                    );
                                  }}
                                >
                                  {selectedLang.AGENTLIST}
                                </MenuItem>
                                <MenuItem
                                  onClick={() => {
                                    popupState.close;
                                    navigate(
                                      `/user/transactionHistory?agent=${data?.from_user_name}`
                                    );
                                  }}
                                >
                                  {selectedLang.TRANSACTIONHISTORYUSER}
                                </MenuItem>
                                <MenuItem
                                  onClick={() => {
                                    popupState.close;
                                    navigate(
                                      `/user/betHistory?agent=${data?.from_user_name}`
                                    );
                                  }}
                                >
                                  {selectedLang.BETHISTORY}
                                </MenuItem>
                              </Menu>
                            </React.Fragment>
                          )}
                        </PopupState>
                      </>
                    ) : (
                      <>
                        {data?.user?.from == true ? (
                          <>
                            <PopupState
                              variant="popover"
                              popupId="demo-popup-menu"
                            >
                              {(popupState) => (
                                <React.Fragment>
                                  <span
                                    style={{
                                      textDecoration: "underline",
                                      textUnderlineOffset: "5px",
                                      cursor: "pointer",
                                    }}
                                    {...bindTrigger(popupState)}
                                  >
                                    {data?.from_user_name}
                                  </span>
                                  <Menu
                                    {...bindMenu(popupState)}
                                    className="all_menulist"
                                  >
                                    {/* {(role["role"] == "admin" ||
                                  role["role"] == "cs" ||
                                  myType == "2") && ( */}
                                    <MenuItem
                                      onClick={() => {
                                        popupState.close;
                                        navigate(
                                          `/mypage?agent_id=${data?.from_user_id}`
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
                                          `/agent/transactionHistory?agent=${data?.from_user_name}`
                                        );
                                      }}
                                    >
                                      {selectedLang.TRANSACTIONHISTORYAGENT}
                                    </MenuItem>
                                    <MenuItem
                                      onClick={() => {
                                        popupState.close;
                                        navigate(
                                          `/agent/agentTreeList?q_agent=${data?.from_user_id}`
                                        );
                                      }}
                                    >
                                      {selectedLang.change_password}
                                    </MenuItem>

                                    <MenuItem
                                      onClick={() => {
                                        popupState.close;
                                        navigate(
                                          `/statistics/agentRevenueStatistics?agent=${data?.from_user_name}`
                                        );
                                      }}
                                    >
                                      {selectedLang.AGENTRSTATISTICS}
                                    </MenuItem>
                                    <MenuItem
                                      onClick={() => {
                                        popupState.close;
                                        navigate(
                                          `/statistics/statisticsByGame?agent_id=${data?.from_user_id}`
                                        );
                                      }}
                                    >
                                      {selectedLang.statisticsByGame}
                                    </MenuItem>
                                    {/* <MenuItem onClick={popupState.close}>Pot Distribution Statistics</MenuItem> */}
                                    <hr
                                      style={{ border: "1px solid #e2e8f0 " }}
                                    />
                                    <MenuItem
                                      onClick={() => {
                                        popupState.close;
                                        navigate(
                                          `/providerManagement?agent_id=${data?.from_user_id}`
                                        );
                                      }}
                                    >
                                      {selectedLang.PROVIDERMANAGEMENT}
                                    </MenuItem>
                                    <hr
                                      style={{ border: "1px solid #e2e8f0 " }}
                                    />
                                    <MenuItem
                                      onClick={() => {
                                        popupState.close;
                                        navigate(
                                          `/gameManagement?agent_id=${data?.from_user_id}`
                                        );
                                      }}
                                    >
                                      {selectedLang.GAMEMANAGEMENT}
                                    </MenuItem>
                                    <hr
                                      style={{ border: "1px solid #e2e8f0 " }}
                                    />
                                    <MenuItem
                                      onClick={() => {
                                        popupState.close;
                                        navigate(
                                          `/statistics/APIerror?agent_id=${data?.from_user_id}`
                                        );
                                      }}
                                    >
                                      {selectedLang.APIERRORLOG}
                                    </MenuItem>
                                    <hr
                                      style={{ border: "1px solid #e2e8f0 " }}
                                    />
                                    <MenuItem
                                      onClick={() => {
                                        popupState.close;
                                        navigate(
                                          `/user/userList?agent=${data?.from_user_name}`
                                        );
                                      }}
                                    >
                                      {selectedLang.USERLIST}
                                    </MenuItem>
                                    <MenuItem
                                      onClick={() => {
                                        popupState.close;
                                        navigate(
                                          `/agent/agentList?agent=${data?.from_user_name}`
                                        );
                                      }}
                                    >
                                      {selectedLang.AGENTLIST}
                                    </MenuItem>
                                    <MenuItem
                                      onClick={() => {
                                        popupState.close;
                                        navigate(
                                          `/user/transactionHistory?agent=${data?.from_user_name}`
                                        );
                                      }}
                                    >
                                      {selectedLang.TRANSACTIONHISTORYUSER}
                                    </MenuItem>
                                    <MenuItem
                                      onClick={() => {
                                        popupState.close;
                                        navigate(
                                          `/user/betHistory?agent=${data?.from_user_name}`
                                        );
                                      }}
                                    >
                                      {selectedLang.BETHISTORY}
                                    </MenuItem>
                                  </Menu>
                                </React.Fragment>
                              )}
                            </PopupState>
                          </>
                        ) : (
                          <>{data?.from_user_name}</>
                        )}
                      </>
                    )}
                  </TableCell>
                  <TableCell
                    sx={{
                      textAlign: "center",
                    }}
                  >
                    {role["role"] == "admin" ? (
                      <>
                        <p className="textSize1">
                          {Number(data?.to_before_pot)?.toLocaleString(
                            "en-US",
                            { maximumFractionDigits: 0 }
                          )}{" "}
                          <span className="textSize">
                            ({data?.to_user_name.split(" ")[0]})
                          </span>
                        </p>
                        <p className="textSize1">
                          {Number(data?.from_before_pot)?.toLocaleString(
                            "en-US",
                            { maximumFractionDigits: 0 }
                          )}{" "}
                          <span className="textSize">
                            ({data?.from_user_name.split(" ")[0]})
                          </span>
                        </p>
                      </>
                    ) : (
                      <>
                        {data?.user?.from == true
                          ? Number(data?.to_before_pot)?.toLocaleString()
                          : Number(data?.from_before_pot)?.toLocaleString()}
                      </>
                    )}
                  </TableCell>
                  <TableCell
                    sx={{
                      textAlign: "center",
                      fontWeight: "bold",
                    }}
                  >
                    {role["role"] == "admin" ? (
                      <></>
                    ) : (
                      <>{data.plus == false ? <>-</> : <></>}</>
                    )}
                    {Number(data?.amount)?.toLocaleString()}
                  </TableCell>
                  <TableCell
                    sx={{
                      textAlign: "center",
                    }}
                  >
                    {role["role"] == "admin" ? (
                      <>
                        <p className="textSize1">
                          {Number(data?.to_after_pot)?.toLocaleString("en-US", {
                            maximumFractionDigits: 0,
                          })}{" "}
                          <span className="textSize">
                            ({data?.to_user_name.split(" ")[0]})
                          </span>
                        </p>
                        <p className="textSize1">
                          {Number(data?.from_after_pot)?.toLocaleString(
                            "en-US",
                            { maximumFractionDigits: 0 }
                          )}{" "}
                          <span className="textSize">
                            ({data?.from_user_name.split(" ")[0]})
                          </span>
                        </p>
                      </>
                    ) : (
                      <>
                        {data?.user?.from == true
                          ? Number(data?.to_after_pot)?.toLocaleString()
                          : Number(data?.from_after_pot)?.toLocaleString()}
                      </>
                    )}
                  </TableCell>
                  <TableCell
                    sx={{
                      textAlign: "center",
                    }}
                  >
                    {formatLocalDateTime(data.created_at)}
                  </TableCell>
                </StyledTableRow>
              );
            })}
        </TableBody>
      );
    }
  };

  // agent all total row UI
  const createSumRowAll = () => {
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
          {sumArray?.all_deposit && sumArray?.all_deposit?.toLocaleString()}
        </TableCell>
        <TableCell
          sx={{
            textAlign: "center",
          }}
        >
          {""}
          {sumArray?.all_withdraw && sumArray?.all_withdraw?.toLocaleString()}
        </TableCell>
        <TableCell
          sx={{
            textAlign: "center",
            fontWeight: "bold",
          }}
        >
          {sumArray?.all_refund && sumArray?.all_refund?.toLocaleString()}
        </TableCell>
        <TableCell
          sx={{
            textAlign: "center",
          }}
        >
          {""}
          {/* {(sumArray?.adminrequest &&
            sumArray?.adminrequest[0]?.sumAfterPot?.toLocaleString()) ||
            0} */}
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



  const initCopyAdminReq = [...adminrequest];

  const sortedAdminReq =
    sortOrder !== ""
      ? initCopyAdminReq.sort((a, b) => {
        let aafterPot =
          a.transaction_type == "withdraw"
            ? Number(a?.amount * -1)
            : Number(a?.amount);
        let bafterPot =
          b.transaction_type == "withdraw"
            ? Number(b?.amount) * -1
            : Number(b?.amount);
        if (sortBy === "size") {
          return sortOrder === "asc"
            ? aafterPot - bafterPot
            : bafterPot - aafterPot;
        } else if (sortBy == "density") {
          if (a.transaction_type == "deposit") {
            if (role["role"] == "admin") {
              if (a.transaction_relation == "admin_agent") {
                return sortOrder === "asc"
                  ? a.from_before_pot - b.from_before_pot
                  : b.from_before_pot - a.from_before_pot;
              } else {
                return sortOrder === "asc"
                  ? a.to_before_pot - b.to_before_pot
                  : b.to_before_pot - a.to_before_pot;
              }
            } else {
              return sortOrder === "asc"
                ? a.to_before_pot - b.to_before_pot
                : b.to_before_pot - a.to_before_pot;
            }
          } else {
            if (role["role"] == "admin") {
              return sortOrder === "asc"
                ? a.from_before_pot - b.from_before_pot
                : b.from_before_pot - a.from_before_pot;
            } else {
              if (a.transaction_relation == "admin_agent") {
                return sortOrder === "asc"
                  ? a.to_before_pot - b.to_before_pot
                  : b.to_before_pot - a.to_before_pot;
              } else {
                return sortOrder === "asc"
                  ? a.from_before_pot - b.from_before_pot
                  : b.from_before_pot - a.from_before_pot;
              }
            }
          }
        } else {
          if (a.transaction_type == "deposit") {
            if (role["role"] == "admin") {
              if (a.transaction_relation == "admin_agent") {
                return sortOrder === "asc"
                  ? a.from_after_pot - b.from_after_pot
                  : b.from_after_pot - a.from_after_pot;
              } else {
                return sortOrder === "asc"
                  ? a.to_after_pot - b.to_after_pot
                  : b.to_after_pot - a.to_after_pot;
              }
            } else {
              return sortOrder === "asc"
                ? a.to_after_pot - b.to_after_pot
                : b.to_after_pot - a.to_after_pot;
            }
          } else {
            if (role["role"] == "admin") {
              return sortOrder === "asc"
                ? a.from_after_pot - b.from_after_pot
                : b.from_after_pot - a.from_after_pot;
            } else {
              if (a.transaction_relation == "admin_agent") {
                return sortOrder === "asc"
                  ? a.to_after_pot - b.to_after_pot
                  : b.to_after_pot - a.to_after_pot;
              } else {
                return sortOrder === "asc"
                  ? a.from_after_pot - b.from_after_pot
                  : b.from_after_pot - a.from_after_pot;
              }
            }
          }
        }
      })
      : initCopyAdminReq;

  const addAdminRequest = () => {
    if (adminrequest.length > 0) {
      return (
        <TableBody>
          {createSumRowAll()}
          {sortedAdminReq
            //.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            .map((data, index) => {
              return (
                <StyledTableRow
                  hover
                  className={
                    data?.transaction_type == "withdraw"
                      ? "withdraw_row"
                      : data?.transaction_type == "deposit"
                        ? "deposit_row"
                        : data?.transaction_type == "synchronization deposit"
                          ? "syn_deposit_row"
                          : "syn_withdraw_row"
                  }
                  role="checkbox"
                  tabIndex={-1}
                  key={index}
                >
                  {data.refund && data.refund > 0 ? (
                    <>
                      <TableCell
                        sx={{
                          textAlign: "center",
                        }}
                      >
                        {page3 * rowsPerPage + index + 1}
                      </TableCell>
                      <TableCell
                        sx={{
                          textAlign: "center",
                        }}
                      >
                        {role["role"] == "admin" ? (
                          <>
                            <PopupState
                              variant="popover"
                              popupId="demo-popup-menu"
                            >
                              {(popupState) => (
                                <React.Fragment>
                                  <span
                                    style={{
                                      textDecoration: "underline",
                                      textUnderlineOffset: "5px",
                                      cursor: "pointer",
                                    }}
                                    {...bindTrigger(popupState)}
                                  >
                                    {data?.from_user_name}
                                  </span>
                                  <Menu
                                    {...bindMenu(popupState)}
                                    className="all_menulist"
                                  >
                                    {/* {(role["role"] == "admin" ||
                                  role["role"] == "cs" ||
                                  myType == "2") && ( */}
                                    <MenuItem
                                      onClick={() => {
                                        popupState.close;
                                        navigate(
                                          `/mypage?agent_id=${data?.from_user_id}`
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
                                          `/agent/transactionHistory?agent=${data?.from_user_name}`
                                        );
                                      }}
                                    >
                                      {selectedLang.TRANSACTIONHISTORYAGENT}
                                    </MenuItem>
                                    <MenuItem
                                      onClick={() => {
                                        popupState.close;
                                        navigate(
                                          `/agent/agentTreeList?q_agent=${data?.from_user_id}`
                                        );
                                      }}
                                    >
                                      {selectedLang.change_password}
                                    </MenuItem>

                                    <MenuItem
                                      onClick={() => {
                                        popupState.close;
                                        navigate(
                                          `/statistics/agentRevenueStatistics?agent=${data?.from_user_name}`
                                        );
                                      }}
                                    >
                                      {selectedLang.AGENTRSTATISTICS}
                                    </MenuItem>
                                    <MenuItem
                                      onClick={() => {
                                        popupState.close;
                                        navigate(
                                          `/statistics/statisticsByGame?agent_id=${data?.from_user_id}`
                                        );
                                      }}
                                    >
                                      {selectedLang.statisticsByGame}
                                    </MenuItem>
                                    {/* <MenuItem onClick={popupState.close}>Pot Distribution Statistics</MenuItem> */}
                                    <hr
                                      style={{ border: "1px solid #e2e8f0 " }}
                                    />
                                    <MenuItem
                                      onClick={() => {
                                        popupState.close;
                                        navigate(
                                          `/providerManagement?agent_id=${data?.from_user_id}`
                                        );
                                      }}
                                    >
                                      {selectedLang.PROVIDERMANAGEMENT}
                                    </MenuItem>
                                    <hr
                                      style={{ border: "1px solid #e2e8f0 " }}
                                    />
                                    <MenuItem
                                      onClick={() => {
                                        popupState.close;
                                        navigate(
                                          `/gameManagement?agent_id=${data?.from_user_id}`
                                        );
                                      }}
                                    >
                                      {selectedLang.GAMEMANAGEMENT}
                                    </MenuItem>
                                    <hr
                                      style={{ border: "1px solid #e2e8f0 " }}
                                    />
                                    <MenuItem
                                      onClick={() => {
                                        popupState.close;
                                        navigate(
                                          `/statistics/APIerror?agent_id=${data?.from_user_id}`
                                        );
                                      }}
                                    >
                                      {selectedLang.APIERRORLOG}
                                    </MenuItem>
                                    <hr
                                      style={{ border: "1px solid #e2e8f0 " }}
                                    />
                                    <MenuItem
                                      onClick={() => {
                                        popupState.close;
                                        navigate(
                                          `/user/userList?agent=${data?.from_user_name}`
                                        );
                                      }}
                                    >
                                      {selectedLang.USERLIST}
                                    </MenuItem>
                                    <MenuItem
                                      onClick={() => {
                                        popupState.close;
                                        navigate(
                                          `/agent/agentList?agent=${data?.from_user_name}`
                                        );
                                      }}
                                    >
                                      {selectedLang.AGENTLIST}
                                    </MenuItem>
                                    <MenuItem
                                      onClick={() => {
                                        popupState.close;
                                        navigate(
                                          `/user/transactionHistory?agent=${data?.from_user_name}`
                                        );
                                      }}
                                    >
                                      {selectedLang.TRANSACTIONHISTORYUSER}
                                    </MenuItem>
                                    <MenuItem
                                      onClick={() => {
                                        popupState.close;
                                        navigate(
                                          `/user/betHistory?agent=${data?.from_user_name}`
                                        );
                                      }}
                                    >
                                      {selectedLang.BETHISTORY}
                                    </MenuItem>
                                  </Menu>
                                </React.Fragment>
                              )}
                            </PopupState>
                          </>
                        ) : (
                          <>
                            {data?.user?.from == true ? (
                              <>
                                <PopupState
                                  variant="popover"
                                  popupId="demo-popup-menu"
                                >
                                  {(popupState) => (
                                    <React.Fragment>
                                      <span
                                        style={{
                                          textDecoration: "underline",
                                          textUnderlineOffset: "5px",
                                          cursor: "pointer",
                                        }}
                                        {...bindTrigger(popupState)}
                                      >
                                        {data?.from_user_name}
                                      </span>
                                      <Menu
                                        {...bindMenu(popupState)}
                                        className="all_menulist"
                                      >
                                        {/* {(role["role"] == "admin" ||
                                  role["role"] == "cs" ||
                                  myType == "2") && ( */}
                                        <MenuItem
                                          onClick={() => {
                                            popupState.close;
                                            navigate(
                                              `/mypage?agent_id=${data?.from_user_id}`
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
                                              `/agent/transactionHistory?agent=${data?.from_user_name}`
                                            );
                                          }}
                                        >
                                          {selectedLang.TRANSACTIONHISTORYAGENT}
                                        </MenuItem>
                                        <MenuItem
                                          onClick={() => {
                                            popupState.close;
                                            navigate(
                                              `/agent/agentTreeList?q_agent=${data?.from_user_id}`
                                            );
                                          }}
                                        >
                                          {selectedLang.change_password}
                                        </MenuItem>

                                        <MenuItem
                                          onClick={() => {
                                            popupState.close;
                                            navigate(
                                              `/statistics/agentRevenueStatistics?agent=${data?.from_user_name}`
                                            );
                                          }}
                                        >
                                          {selectedLang.AGENTRSTATISTICS}
                                        </MenuItem>
                                        <MenuItem
                                          onClick={() => {
                                            popupState.close;
                                            navigate(
                                              `/statistics/statisticsByGame?agent_id=${data?.from_user_id}`
                                            );
                                          }}
                                        >
                                          {selectedLang.statisticsByGame}
                                        </MenuItem>
                                        {/* <MenuItem onClick={popupState.close}>Pot Distribution Statistics</MenuItem> */}
                                        <hr
                                          style={{
                                            border: "1px solid #e2e8f0 ",
                                          }}
                                        />
                                        <MenuItem
                                          onClick={() => {
                                            popupState.close;
                                            navigate(
                                              `/providerManagement?agent_id=${data?.from_user_id}`
                                            );
                                          }}
                                        >
                                          {selectedLang.PROVIDERMANAGEMENT}
                                        </MenuItem>
                                        <hr
                                          style={{
                                            border: "1px solid #e2e8f0 ",
                                          }}
                                        />
                                        <MenuItem
                                          onClick={() => {
                                            popupState.close;
                                            navigate(
                                              `/gameManagement?agent_id=${data?.from_user_id}`
                                            );
                                          }}
                                        >
                                          {selectedLang.GAMEMANAGEMENT}
                                        </MenuItem>
                                        <hr
                                          style={{
                                            border: "1px solid #e2e8f0 ",
                                          }}
                                        />
                                        <MenuItem
                                          onClick={() => {
                                            popupState.close;
                                            navigate(
                                              `/statistics/APIerror?agent_id=${data?.from_user_id}`
                                            );
                                          }}
                                        >
                                          {selectedLang.APIERRORLOG}
                                        </MenuItem>
                                        <hr
                                          style={{
                                            border: "1px solid #e2e8f0 ",
                                          }}
                                        />
                                        <MenuItem
                                          onClick={() => {
                                            popupState.close;
                                            navigate(
                                              `/user/userList?agent=${data?.from_user_name}`
                                            );
                                          }}
                                        >
                                          {selectedLang.USERLIST}
                                        </MenuItem>
                                        <MenuItem
                                          onClick={() => {
                                            popupState.close;
                                            navigate(
                                              `/agent/agentList?agent=${data?.from_user_name}`
                                            );
                                          }}
                                        >
                                          {selectedLang.AGENTLIST}
                                        </MenuItem>
                                        <MenuItem
                                          onClick={() => {
                                            popupState.close;
                                            navigate(
                                              `/user/transactionHistory?agent=${data?.from_user_name}`
                                            );
                                          }}
                                        >
                                          {selectedLang.TRANSACTIONHISTORYUSER}
                                        </MenuItem>
                                        <MenuItem
                                          onClick={() => {
                                            popupState.close;
                                            navigate(
                                              `/user/betHistory?agent=${data?.from_user_name}`
                                            );
                                          }}
                                        >
                                          {selectedLang.BETHISTORY}
                                        </MenuItem>
                                      </Menu>
                                    </React.Fragment>
                                  )}
                                </PopupState>
                              </>
                            ) : (
                              <>{data?.from_user_name}</>
                            )}
                          </>
                        )}
                      </TableCell>
                      <TableCell
                        sx={{
                          textAlign: "center",
                        }}
                      >
                        {role["role"] == "admin" ? (
                          <>
                            <PopupState
                              variant="popover"
                              popupId="demo-popup-menu"
                            >
                              {(popupState) => (
                                <React.Fragment>
                                  <span
                                    style={{
                                      textDecoration: "underline",
                                      textUnderlineOffset: "5px",
                                      cursor: "pointer",
                                    }}
                                    {...bindTrigger(popupState)}
                                  >
                                    {data?.to_user_name}
                                  </span>
                                  <Menu
                                    {...bindMenu(popupState)}
                                    className="all_menulist"
                                  >
                                    {/* {(role["role"] == "admin" ||
                                  role["role"] == "cs" ||
                                  myType == "2") && ( */}
                                    <MenuItem
                                      onClick={() => {
                                        popupState.close;
                                        navigate(
                                          `/mypage?agent_id=${data?.to_user_id}`
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
                                          `/agent/transactionHistory?agent=${data?.to_user_name}`
                                        );
                                      }}
                                    >
                                      {selectedLang.TRANSACTIONHISTORYAGENT}
                                    </MenuItem>
                                    <MenuItem
                                      onClick={() => {
                                        popupState.close;
                                        navigate(
                                          `/agent/agentTreeList?q_agent=${data?.to_user_id}`
                                        );
                                      }}
                                    >
                                      {selectedLang.change_password}
                                    </MenuItem>

                                    <MenuItem
                                      onClick={() => {
                                        popupState.close;
                                        navigate(
                                          `/statistics/agentRevenueStatistics?agent=${data?.to_user_name}`
                                        );
                                      }}
                                    >
                                      {selectedLang.AGENTRSTATISTICS}
                                    </MenuItem>
                                    <MenuItem
                                      onClick={() => {
                                        popupState.close;
                                        navigate(
                                          `/statistics/statisticsByGame?agent_id=${data?.to_user_id}`
                                        );
                                      }}
                                    >
                                      {selectedLang.statisticsByGame}
                                    </MenuItem>
                                    {/* <MenuItem onClick={popupState.close}>Pot Distribution Statistics</MenuItem> */}
                                    <hr
                                      style={{ border: "1px solid #e2e8f0 " }}
                                    />
                                    <MenuItem
                                      onClick={() => {
                                        popupState.close;
                                        navigate(
                                          `/providerManagement?agent_id=${data?.to_user_id}`
                                        );
                                      }}
                                    >
                                      {selectedLang.PROVIDERMANAGEMENT}
                                    </MenuItem>
                                    <hr
                                      style={{ border: "1px solid #e2e8f0 " }}
                                    />
                                    <MenuItem
                                      onClick={() => {
                                        popupState.close;
                                        navigate(
                                          `/gameManagement?agent_id=${data?.to_user_id}`
                                        );
                                      }}
                                    >
                                      {selectedLang.GAMEMANAGEMENT}
                                    </MenuItem>
                                    <hr
                                      style={{ border: "1px solid #e2e8f0 " }}
                                    />
                                    <MenuItem
                                      onClick={() => {
                                        popupState.close;
                                        navigate(
                                          `/statistics/APIerror?agent_id=${data?.to_user_id}`
                                        );
                                      }}
                                    >
                                      {selectedLang.APIERRORLOG}
                                    </MenuItem>
                                    <hr
                                      style={{ border: "1px solid #e2e8f0 " }}
                                    />
                                    <MenuItem
                                      onClick={() => {
                                        popupState.close;
                                        navigate(
                                          `/user/userList?agent=${data?.to_user_name}`
                                        );
                                      }}
                                    >
                                      {selectedLang.USERLIST}
                                    </MenuItem>
                                    <MenuItem
                                      onClick={() => {
                                        popupState.close;
                                        navigate(
                                          `/agent/agentList?agent=${data?.to_user_name}`
                                        );
                                      }}
                                    >
                                      {selectedLang.AGENTLIST}
                                    </MenuItem>
                                    <MenuItem
                                      onClick={() => {
                                        popupState.close;
                                        navigate(
                                          `/user/transactionHistory?agent=${data?.to_user_name}`
                                        );
                                      }}
                                    >
                                      {selectedLang.TRANSACTIONHISTORYUSER}
                                    </MenuItem>
                                    <MenuItem
                                      onClick={() => {
                                        popupState.close;
                                        navigate(
                                          `/user/betHistory?agent=${data?.to_user_name}`
                                        );
                                      }}
                                    >
                                      {selectedLang.BETHISTORY}
                                    </MenuItem>
                                  </Menu>
                                </React.Fragment>
                              )}
                            </PopupState>
                          </>
                        ) : (
                          <>
                            {data?.user?.to == true ? (
                              <>
                                <PopupState
                                  variant="popover"
                                  popupId="demo-popup-menu"
                                >
                                  {(popupState) => (
                                    <React.Fragment>
                                      <span
                                        style={{
                                          textDecoration: "underline",
                                          textUnderlineOffset: "5px",
                                          cursor: "pointer",
                                        }}
                                        {...bindTrigger(popupState)}
                                      >
                                        {data?.to_user_name}
                                      </span>
                                      <Menu
                                        {...bindMenu(popupState)}
                                        className="all_menulist"
                                      >
                                        {/* {(role["role"] == "admin" ||
                                  role["role"] == "cs" ||
                                  myType == "2") && ( */}
                                        <MenuItem
                                          onClick={() => {
                                            popupState.close;
                                            navigate(
                                              `/mypage?agent_id=${data?.to_user_id}`
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
                                              `/agent/transactionHistory?agent=${data?.to_user_name}`
                                            );
                                          }}
                                        >
                                          {selectedLang.TRANSACTIONHISTORYAGENT}
                                        </MenuItem>
                                        <MenuItem
                                          onClick={() => {
                                            popupState.close;
                                            navigate(
                                              `/agent/agentTreeList?q_agent=${data?.to_user_id}`
                                            );
                                          }}
                                        >
                                          {selectedLang.change_password}
                                        </MenuItem>

                                        <MenuItem
                                          onClick={() => {
                                            popupState.close;
                                            navigate(
                                              `/statistics/agentRevenueStatistics?agent=${data?.to_user_name}`
                                            );
                                          }}
                                        >
                                          {selectedLang.AGENTRSTATISTICS}
                                        </MenuItem>
                                        <MenuItem
                                          onClick={() => {
                                            popupState.close;
                                            navigate(
                                              `/statistics/statisticsByGame?agent_id=${data?.to_user_id}`
                                            );
                                          }}
                                        >
                                          {selectedLang.statisticsByGame}
                                        </MenuItem>
                                        {/* <MenuItem onClick={popupState.close}>Pot Distribution Statistics</MenuItem> */}
                                        <hr
                                          style={{
                                            border: "1px solid #e2e8f0 ",
                                          }}
                                        />
                                        <MenuItem
                                          onClick={() => {
                                            popupState.close;
                                            navigate(
                                              `/providerManagement?agent_id=${data?.to_user_id}`
                                            );
                                          }}
                                        >
                                          {selectedLang.PROVIDERMANAGEMENT}
                                        </MenuItem>
                                        <hr
                                          style={{
                                            border: "1px solid #e2e8f0 ",
                                          }}
                                        />
                                        <MenuItem
                                          onClick={() => {
                                            popupState.close;
                                            navigate(
                                              `/gameManagement?agent_id=${data?.to_user_id}`
                                            );
                                          }}
                                        >
                                          {selectedLang.GAMEMANAGEMENT}
                                        </MenuItem>
                                        <hr
                                          style={{
                                            border: "1px solid #e2e8f0 ",
                                          }}
                                        />
                                        <MenuItem
                                          onClick={() => {
                                            popupState.close;
                                            navigate(
                                              `/statistics/APIerror?agent_id=${data?.to_user_id}`
                                            );
                                          }}
                                        >
                                          {selectedLang.APIERRORLOG}
                                        </MenuItem>
                                        <hr
                                          style={{
                                            border: "1px solid #e2e8f0 ",
                                          }}
                                        />
                                        <MenuItem
                                          onClick={() => {
                                            popupState.close;
                                            navigate(
                                              `/user/userList?agent=${data?.to_user_name}`
                                            );
                                          }}
                                        >
                                          {selectedLang.USERLIST}
                                        </MenuItem>
                                        <MenuItem
                                          onClick={() => {
                                            popupState.close;
                                            navigate(
                                              `/agent/agentList?agent=${data?.to_user_name}`
                                            );
                                          }}
                                        >
                                          {selectedLang.AGENTLIST}
                                        </MenuItem>
                                        <MenuItem
                                          onClick={() => {
                                            popupState.close;
                                            navigate(
                                              `/user/transactionHistory?agent=${data?.to_user_name}`
                                            );
                                          }}
                                        >
                                          {selectedLang.TRANSACTIONHISTORYUSER}
                                        </MenuItem>
                                        <MenuItem
                                          onClick={() => {
                                            popupState.close;
                                            navigate(
                                              `/user/betHistory?agent=${data?.to_user_name}`
                                            );
                                          }}
                                        >
                                          {selectedLang.BETHISTORY}
                                        </MenuItem>
                                      </Menu>
                                    </React.Fragment>
                                  )}
                                </PopupState>
                              </>
                            ) : (
                              <>{data?.to_user_name}</>
                            )}
                          </>
                        )}
                      </TableCell>
                      <TableCell
                        sx={{
                          textAlign: "center",
                        }}
                      >
                        {role["role"] == "admin" ? (
                          <>
                            <p className="textSize1">
                              {Number(data?.to_before_pot)?.toLocaleString(
                                "en-US",
                                { maximumFractionDigits: 0 }
                              )}{" "}
                              <span className="textSize">
                                ({data?.to_user_name.split(" ")[0]})
                              </span>
                            </p>
                            <p className="textSize1">
                              {Number(data?.from_before_pot)?.toLocaleString(
                                "en-US",
                                { maximumFractionDigits: 0 }
                              )}{" "}
                              <span className="textSize">
                                ({data?.from_user_name.split(" ")[0]})
                              </span>
                            </p>
                          </>
                        ) : (
                          <>
                            {data?.user?.from == true
                              ? Number(data?.from_before_pot)?.toLocaleString()
                              : Number(data?.to_before_pot)?.toLocaleString()}
                          </>
                        )}
                      </TableCell>
                      <TableCell
                        sx={{
                          textAlign: "center",
                        }}
                      >
                        {data?.deposit && data.deposit > 0 ? (
                          data.deposit?.toLocaleString()
                        ) : (
                          <></>
                        )}
                      </TableCell>
                      <TableCell
                        sx={{
                          textAlign: "center",
                        }}
                      >
                        {data?.withdraw && data.withdraw > 0 ? (
                          data.withdraw?.toLocaleString()
                        ) : (
                          <></>
                        )}
                      </TableCell>
                      <TableCell
                        sx={{
                          textAlign: "center",
                        }}
                      >
                        {role["role"] === "admin" ? (
                          <p className="textSize1">
                            {data?.refund && data.refund > 0
                              ? data.refund?.toLocaleString()
                              : "-"}{" "}
                            <span className="textSize">
                              ({data?.from_user_name.split(" ")[0]})
                            </span>
                          </p>
                        ) : (
                          <p className="textSize">
                            {data?.refund && data.refund > 0
                              ? data.refund?.toLocaleString()
                              : "-"}
                          </p>
                        )}
                        {/* {data?.refund && data.refund > 0
                              ? data.refund?.toLocaleString()
                              : "-"} */}
                      </TableCell>

                      <TableCell
                        sx={{
                          textAlign: "center",
                        }}
                      >
                        {role["role"] == "admin" ? (
                          // <>{Number(data?.from_after_pot)?.toLocaleString()}</>
                          <>
                            <p className="textSize1">
                              {Number(data?.to_after_pot)?.toLocaleString(
                                "en-US",
                                { maximumFractionDigits: 0 }
                              )}{" "}
                              <span className="textSize">
                                ({data?.to_user_name.split(" ")[0]})
                              </span>
                            </p>
                            <p className="textSize1">
                              {Number(data?.from_after_pot)?.toLocaleString(
                                "en-US",
                                { maximumFractionDigits: 0 }
                              )}{" "}
                              <span className="textSize">
                                ({data?.from_user_name.split(" ")[0]})
                              </span>
                            </p>
                          </>
                        ) : (
                          <>
                            {data?.user?.from == true
                              ? Number(data?.from_after_pot)?.toLocaleString()
                              : Number(data?.to_after_pot)?.toLocaleString()}
                          </>
                        )}
                      </TableCell>
                      <TableCell
                        sx={{
                          textAlign: "center",
                        }}
                      >
                        {formatLocalDateTime(data?.created_at)}
                      </TableCell>
                    </>
                  ) : (
                    <>
                      <TableCell
                        sx={{
                          textAlign: "center",
                        }}
                      >
                        {page3 * rowsPerPage + index + 1}
                      </TableCell>
                      <TableCell
                        sx={{
                          textAlign: "center",
                        }}
                      >
                        {role["role"] == "admin" ? (
                          <>
                            <PopupState
                              variant="popover"
                              popupId="demo-popup-menu"
                            >
                              {(popupState) => (
                                <React.Fragment>
                                  <span
                                    style={{
                                      textDecoration: "underline",
                                      textUnderlineOffset: "5px",
                                      cursor: "pointer",
                                    }}
                                    {...bindTrigger(popupState)}
                                  >
                                    {data?.from_user_name}
                                  </span>
                                  <Menu
                                    {...bindMenu(popupState)}
                                    className="all_menulist"
                                  >
                                    {/* {(role["role"] == "admin" ||
                                  role["role"] == "cs" ||
                                  myType == "2") && ( */}
                                    <MenuItem
                                      onClick={() => {
                                        popupState.close;
                                        navigate(
                                          `/mypage?agent_id=${data?.from_user_id}`
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
                                          `/agent/transactionHistory?agent=${data?.from_user_name}`
                                        );
                                      }}
                                    >
                                      {selectedLang.TRANSACTIONHISTORYAGENT}
                                    </MenuItem>
                                    <MenuItem
                                      onClick={() => {
                                        popupState.close;
                                        navigate(
                                          `/agent/agentTreeList?q_agent=${data?.from_user_id}`
                                        );
                                      }}
                                    >
                                      {selectedLang.change_password}
                                    </MenuItem>

                                    <MenuItem
                                      onClick={() => {
                                        popupState.close;
                                        navigate(
                                          `/statistics/agentRevenueStatistics?agent=${data?.from_user_name}`
                                        );
                                      }}
                                    >
                                      {selectedLang.AGENTRSTATISTICS}
                                    </MenuItem>
                                    <MenuItem
                                      onClick={() => {
                                        popupState.close;
                                        navigate(
                                          `/statistics/statisticsByGame?agent_id=${data?.from_user_id}`
                                        );
                                      }}
                                    >
                                      {selectedLang.statisticsByGame}
                                    </MenuItem>
                                    {/* <MenuItem onClick={popupState.close}>Pot Distribution Statistics</MenuItem> */}
                                    <hr
                                      style={{ border: "1px solid #e2e8f0 " }}
                                    />
                                    <MenuItem
                                      onClick={() => {
                                        popupState.close;
                                        navigate(
                                          `/providerManagement?agent_id=${data?.from_user_id}`
                                        );
                                      }}
                                    >
                                      {selectedLang.PROVIDERMANAGEMENT}
                                    </MenuItem>
                                    <hr
                                      style={{ border: "1px solid #e2e8f0 " }}
                                    />
                                    <MenuItem
                                      onClick={() => {
                                        popupState.close;
                                        navigate(
                                          `/gameManagement?agent_id=${data?.from_user_id}`
                                        );
                                      }}
                                    >
                                      {selectedLang.GAMEMANAGEMENT}
                                    </MenuItem>
                                    <hr
                                      style={{ border: "1px solid #e2e8f0 " }}
                                    />
                                    <MenuItem
                                      onClick={() => {
                                        popupState.close;
                                        navigate(
                                          `/statistics/APIerror?agent_id=${data?.from_user_id}`
                                        );
                                      }}
                                    >
                                      {selectedLang.APIERRORLOG}
                                    </MenuItem>
                                    <hr
                                      style={{ border: "1px solid #e2e8f0 " }}
                                    />
                                    <MenuItem
                                      onClick={() => {
                                        popupState.close;
                                        navigate(
                                          `/user/userList?agent=${data?.from_user_name}`
                                        );
                                      }}
                                    >
                                      {selectedLang.USERLIST}
                                    </MenuItem>
                                    <MenuItem
                                      onClick={() => {
                                        popupState.close;
                                        navigate(
                                          `/agent/agentList?agent=${data?.from_user_name}`
                                        );
                                      }}
                                    >
                                      {selectedLang.AGENTLIST}
                                    </MenuItem>
                                    <MenuItem
                                      onClick={() => {
                                        popupState.close;
                                        navigate(
                                          `/user/transactionHistory?agent=${data?.from_user_name}`
                                        );
                                      }}
                                    >
                                      {selectedLang.TRANSACTIONHISTORYUSER}
                                    </MenuItem>
                                    <MenuItem
                                      onClick={() => {
                                        popupState.close;
                                        navigate(
                                          `/user/betHistory?agent=${data?.from_user_name}`
                                        );
                                      }}
                                    >
                                      {selectedLang.BETHISTORY}
                                    </MenuItem>
                                  </Menu>
                                </React.Fragment>
                              )}
                            </PopupState>
                          </>
                        ) : (
                          <>
                            {data?.user?.from == true ? (
                              <>
                                <PopupState
                                  variant="popover"
                                  popupId="demo-popup-menu"
                                >
                                  {(popupState) => (
                                    <React.Fragment>
                                      <span
                                        style={{
                                          textDecoration: "underline",
                                          textUnderlineOffset: "5px",
                                          cursor: "pointer",
                                        }}
                                        {...bindTrigger(popupState)}
                                      >
                                        {data?.from_user_name}
                                      </span>
                                      <Menu
                                        {...bindMenu(popupState)}
                                        className="all_menulist"
                                      >
                                        {/* {(role["role"] == "admin" ||
                                  role["role"] == "cs" ||
                                  myType == "2") && ( */}
                                        <MenuItem
                                          onClick={() => {
                                            popupState.close;
                                            navigate(
                                              `/mypage?agent_id=${data?.from_user_id}`
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
                                              `/agent/transactionHistory?agent=${data?.from_user_id}`
                                            );
                                          }}
                                        >
                                          {selectedLang.TRANSACTIONHISTORYAGENT}
                                        </MenuItem>
                                        <MenuItem
                                          onClick={() => {
                                            popupState.close;
                                            navigate(
                                              `/agent/agentTreeList?q_agent=${data?.from_user_id}`
                                            );
                                          }}
                                        >
                                          {selectedLang.change_password}
                                        </MenuItem>

                                        <MenuItem
                                          onClick={() => {
                                            popupState.close;
                                            navigate(
                                              `/statistics/agentRevenueStatistics?agent=${data?.from_user_name}`
                                            );
                                          }}
                                        >
                                          {selectedLang.AGENTRSTATISTICS}
                                        </MenuItem>
                                        <MenuItem
                                          onClick={() => {
                                            popupState.close;
                                            navigate(
                                              `/statistics/statisticsByGame?agent_id=${data?.from_user_id}`
                                            );
                                          }}
                                        >
                                          {selectedLang.statisticsByGame}
                                        </MenuItem>
                                        {/* <MenuItem onClick={popupState.close}>Pot Distribution Statistics</MenuItem> */}
                                        <hr
                                          style={{
                                            border: "1px solid #e2e8f0 ",
                                          }}
                                        />
                                        <MenuItem
                                          onClick={() => {
                                            popupState.close;
                                            navigate(
                                              `/providerManagement?agent_id=${data?.from_user_id}`
                                            );
                                          }}
                                        >
                                          {selectedLang.PROVIDERMANAGEMENT}
                                        </MenuItem>
                                        <hr
                                          style={{
                                            border: "1px solid #e2e8f0 ",
                                          }}
                                        />
                                        <MenuItem
                                          onClick={() => {
                                            popupState.close;
                                            navigate(
                                              `/gameManagement?agent_id=${data?.from_user_id}`
                                            );
                                          }}
                                        >
                                          {selectedLang.GAMEMANAGEMENT}
                                        </MenuItem>
                                        <hr
                                          style={{
                                            border: "1px solid #e2e8f0 ",
                                          }}
                                        />
                                        <MenuItem
                                          onClick={() => {
                                            popupState.close;
                                            navigate(
                                              `/statistics/APIerror?agent_id=${data?.from_user_id}`
                                            );
                                          }}
                                        >
                                          {selectedLang.APIERRORLOG}
                                        </MenuItem>
                                        <hr
                                          style={{
                                            border: "1px solid #e2e8f0 ",
                                          }}
                                        />
                                        <MenuItem
                                          onClick={() => {
                                            popupState.close;
                                            navigate(
                                              `/user/userList?agent=${data?.from_user_name}`
                                            );
                                          }}
                                        >
                                          {selectedLang.USERLIST}
                                        </MenuItem>
                                        <MenuItem
                                          onClick={() => {
                                            popupState.close;
                                            navigate(
                                              `/agent/agentList?agent=${data?.from_user_name}`
                                            );
                                          }}
                                        >
                                          {selectedLang.AGENTLIST}
                                        </MenuItem>
                                        <MenuItem
                                          onClick={() => {
                                            popupState.close;
                                            navigate(
                                              `/user/transactionHistory?agent=${data?.from_user_name}`
                                            );
                                          }}
                                        >
                                          {selectedLang.TRANSACTIONHISTORYUSER}
                                        </MenuItem>
                                        <MenuItem
                                          onClick={() => {
                                            popupState.close;
                                            navigate(
                                              `/user/betHistory?agent=${data?.from_user_name}`
                                            );
                                          }}
                                        >
                                          {selectedLang.BETHISTORY}
                                        </MenuItem>
                                      </Menu>
                                    </React.Fragment>
                                  )}
                                </PopupState>
                              </>
                            ) : (
                              <>{data?.from_user_name}</>
                            )}
                          </>
                        )}
                      </TableCell>
                      <TableCell
                        sx={{
                          textAlign: "center",
                        }}
                      >
                        {role["role"] == "admin" ? (
                          <>
                            <PopupState
                              variant="popover"
                              popupId="demo-popup-menu"
                            >
                              {(popupState) => (
                                <React.Fragment>
                                  <span
                                    style={{
                                      textDecoration: "underline",
                                      textUnderlineOffset: "5px",
                                      cursor: "pointer",
                                    }}
                                    {...bindTrigger(popupState)}
                                  >
                                    {data?.to_user_name}
                                  </span>
                                  <Menu
                                    {...bindMenu(popupState)}
                                    className="all_menulist"
                                  >
                                    {/* {(role["role"] == "admin" ||
                                  role["role"] == "cs" ||
                                  myType == "2") && ( */}
                                    <MenuItem
                                      onClick={() => {
                                        popupState.close;
                                        navigate(
                                          `/mypage?agent_id=${data?.to_user_id}`
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
                                          `/agent/transactionHistory?agent=${data?.to_user_name}`
                                        );
                                      }}
                                    >
                                      {selectedLang.TRANSACTIONHISTORYAGENT}
                                    </MenuItem>
                                    <MenuItem
                                      onClick={() => {
                                        popupState.close;
                                        navigate(
                                          `/agent/agentTreeList?q_agent=${data?.to_user_id}`
                                        );
                                      }}
                                    >
                                      {selectedLang.change_password}
                                    </MenuItem>

                                    <MenuItem
                                      onClick={() => {
                                        popupState.close;
                                        navigate(
                                          `/statistics/agentRevenueStatistics?agent=${data?.to_user_name}`
                                        );
                                      }}
                                    >
                                      {selectedLang.AGENTRSTATISTICS}
                                    </MenuItem>
                                    <MenuItem
                                      onClick={() => {
                                        popupState.close;
                                        navigate(
                                          `/statistics/statisticsByGame?agent_id=${data?.to_user_id}`
                                        );
                                      }}
                                    >
                                      {selectedLang.statisticsByGame}
                                    </MenuItem>
                                    {/* <MenuItem onClick={popupState.close}>Pot Distribution Statistics</MenuItem> */}
                                    <hr
                                      style={{ border: "1px solid #e2e8f0 " }}
                                    />
                                    <MenuItem
                                      onClick={() => {
                                        popupState.close;
                                        navigate(
                                          `/providerManagement?agent_id=${data?.to_user_id}`
                                        );
                                      }}
                                    >
                                      {selectedLang.PROVIDERMANAGEMENT}
                                    </MenuItem>
                                    <hr
                                      style={{ border: "1px solid #e2e8f0 " }}
                                    />
                                    <MenuItem
                                      onClick={() => {
                                        popupState.close;
                                        navigate(
                                          `/gameManagement?agent_id=${data?.to_user_id}`
                                        );
                                      }}
                                    >
                                      {selectedLang.GAMEMANAGEMENT}
                                    </MenuItem>
                                    <hr
                                      style={{ border: "1px solid #e2e8f0 " }}
                                    />
                                    <MenuItem
                                      onClick={() => {
                                        popupState.close;
                                        navigate(
                                          `/statistics/APIerror?agent_id=${data?.to_user_id}`
                                        );
                                      }}
                                    >
                                      {selectedLang.APIERRORLOG}
                                    </MenuItem>
                                    <hr
                                      style={{ border: "1px solid #e2e8f0 " }}
                                    />
                                    <MenuItem
                                      onClick={() => {
                                        popupState.close;
                                        navigate(
                                          `/user/userList?agent=${data?.to_user_name}`
                                        );
                                      }}
                                    >
                                      {selectedLang.USERLIST}
                                    </MenuItem>
                                    <MenuItem
                                      onClick={() => {
                                        popupState.close;
                                        navigate(
                                          `/agent/agentList?agent=${data?.to_user_name}`
                                        );
                                      }}
                                    >
                                      {selectedLang.AGENTLIST}
                                    </MenuItem>
                                    <MenuItem
                                      onClick={() => {
                                        popupState.close;
                                        navigate(
                                          `/user/transactionHistory?agent=${data?.to_user_name}`
                                        );
                                      }}
                                    >
                                      {selectedLang.TRANSACTIONHISTORYUSER}
                                    </MenuItem>
                                    <MenuItem
                                      onClick={() => {
                                        popupState.close;
                                        navigate(
                                          `/user/betHistory?agent=${data?.to_user_name}`
                                        );
                                      }}
                                    >
                                      {selectedLang.BETHISTORY}
                                    </MenuItem>
                                  </Menu>
                                </React.Fragment>
                              )}
                            </PopupState>
                          </>
                        ) : (
                          <>
                            {data?.user?.to == true ? (
                              <>
                                <PopupState
                                  variant="popover"
                                  popupId="demo-popup-menu"
                                >
                                  {(popupState) => (
                                    <React.Fragment>
                                      <span
                                        style={{
                                          textDecoration: "underline",
                                          textUnderlineOffset: "5px",
                                          cursor: "pointer",
                                        }}
                                        {...bindTrigger(popupState)}
                                      >
                                        {data?.to_user_name}
                                      </span>
                                      <Menu
                                        {...bindMenu(popupState)}
                                        className="all_menulist"
                                      >
                                        {/* {(role["role"] == "admin" ||
                                  role["role"] == "cs" ||
                                  myType == "2") && ( */}
                                        <MenuItem
                                          onClick={() => {
                                            popupState.close;
                                            navigate(
                                              `/mypage?agent_id=${data?.to_user_id}`
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
                                              `/agent/transactionHistory?agent=${data?.to_user_name}`
                                            );
                                          }}
                                        >
                                          {selectedLang.TRANSACTIONHISTORYAGENT}
                                        </MenuItem>
                                        <MenuItem
                                          onClick={() => {
                                            popupState.close;
                                            navigate(
                                              `/agent/agentTreeList?q_agent=${data?.to_user_id}`
                                            );
                                          }}
                                        >
                                          {selectedLang.change_password}
                                        </MenuItem>

                                        <MenuItem
                                          onClick={() => {
                                            popupState.close;
                                            navigate(
                                              `/statistics/agentRevenueStatistics?agent=${data?.to_user_name}`
                                            );
                                          }}
                                        >
                                          {selectedLang.AGENTRSTATISTICS}
                                        </MenuItem>
                                        <MenuItem
                                          onClick={() => {
                                            popupState.close;
                                            navigate(
                                              `/statistics/statisticsByGame?agent_id=${data?.to_user_id}`
                                            );
                                          }}
                                        >
                                          {selectedLang.statisticsByGame}
                                        </MenuItem>
                                        {/* <MenuItem onClick={popupState.close}>Pot Distribution Statistics</MenuItem> */}
                                        <hr
                                          style={{
                                            border: "1px solid #e2e8f0 ",
                                          }}
                                        />
                                        <MenuItem
                                          onClick={() => {
                                            popupState.close;
                                            navigate(
                                              `/providerManagement?agent_id=${data?.to_user_id}`
                                            );
                                          }}
                                        >
                                          {selectedLang.PROVIDERMANAGEMENT}
                                        </MenuItem>
                                        <hr
                                          style={{
                                            border: "1px solid #e2e8f0 ",
                                          }}
                                        />
                                        <MenuItem
                                          onClick={() => {
                                            popupState.close;
                                            navigate(
                                              `/gameManagement?agent_id=${data?.to_user_id}`
                                            );
                                          }}
                                        >
                                          {selectedLang.GAMEMANAGEMENT}
                                        </MenuItem>
                                        <hr
                                          style={{
                                            border: "1px solid #e2e8f0 ",
                                          }}
                                        />
                                        <MenuItem
                                          onClick={() => {
                                            popupState.close;
                                            navigate(
                                              `/statistics/APIerror?agent_id=${data?.to_user_id}`
                                            );
                                          }}
                                        >
                                          {selectedLang.APIERRORLOG}
                                        </MenuItem>
                                        <hr
                                          style={{
                                            border: "1px solid #e2e8f0 ",
                                          }}
                                        />
                                        <MenuItem
                                          onClick={() => {
                                            popupState.close;
                                            navigate(
                                              `/user/userList?agent=${data?.to_user_name}`
                                            );
                                          }}
                                        >
                                          {selectedLang.USERLIST}
                                        </MenuItem>
                                        <MenuItem
                                          onClick={() => {
                                            popupState.close;
                                            navigate(
                                              `/agent/agentList?agent=${data?.to_user_name}`
                                            );
                                          }}
                                        >
                                          {selectedLang.AGENTLIST}
                                        </MenuItem>
                                        <MenuItem
                                          onClick={() => {
                                            popupState.close;
                                            navigate(
                                              `/user/transactionHistory?agent=${data?.to_user_name}`
                                            );
                                          }}
                                        >
                                          {selectedLang.TRANSACTIONHISTORYUSER}
                                        </MenuItem>
                                        <MenuItem
                                          onClick={() => {
                                            popupState.close;
                                            navigate(
                                              `/user/betHistory?agent=${data?.to_user_name}`
                                            );
                                          }}
                                        >
                                          {selectedLang.BETHISTORY}
                                        </MenuItem>
                                      </Menu>
                                    </React.Fragment>
                                  )}
                                </PopupState>
                              </>
                            ) : (
                              <>{data?.to_user_name}</>
                            )}
                          </>
                        )}
                      </TableCell>
                      <TableCell
                        sx={{
                          textAlign: "center",
                        }}
                      >
                        {role["role"] == "admin" ? (
                          <>
                            <p className="textSize1">
                              {Number(data?.from_before_pot)?.toLocaleString(
                                "en-US",
                                { maximumFractionDigits: 0 }
                              )}{" "}
                              <span className="textSize">
                                ({data?.from_user_name.split(" ")[0]})
                              </span>
                            </p>
                            <p className="textSize1">
                              {Number(data?.to_before_pot)?.toLocaleString(
                                "en-US",
                                { maximumFractionDigits: 0 }
                              )}{" "}
                              <span className="textSize">
                                ({data?.to_user_name.split(" ")[0]})
                              </span>
                            </p>
                          </>
                        ) : (
                          <>
                            {data?.user?.from == false
                              ? Number(data?.to_before_pot)?.toLocaleString()
                              : Number(data?.from_before_pot)?.toLocaleString()}
                          </>
                        )}
                      </TableCell>
                      <TableCell
                        sx={{
                          textAlign: "center",
                        }}
                      >
                        {data?.deposit && data.deposit > 0
                          ? data.deposit?.toLocaleString()
                          : "-"}
                      </TableCell>
                      <TableCell
                        sx={{
                          textAlign: "center",
                        }}
                      >
                        {role["role"] === "admin" ? (
                          <p className="textSize3">
                            {data?.withdraw && data.withdraw > 0
                              ? data.withdraw?.toLocaleString()
                              : "-"}{" "}
                            <span className="textSize3">
                              ({data?.from_user_name.split(" ")[0]})
                            </span>
                          </p>
                        ) : (
                          <p className="textSize">
                            {data?.withdraw && data.withdraw > 0
                              ? data.withdraw?.toLocaleString()
                              : "-"}
                          </p>
                        )}
                      </TableCell>
                      <TableCell
                        sx={{
                          textAlign: "center",
                        }}
                      >
                        {data?.refund && data.refund > 0
                          ? data.refund?.toLocaleString()
                          : "-"}
                      </TableCell>
                      <TableCell
                        sx={{
                          textAlign: "center",
                        }}
                      >
                        {role["role"] == "admin" ? (
                          // <>{Number(data?.from_after_pot)?.toLocaleString()}</>
                          <>
                            <p className="textSize1">
                              {Number(data?.from_after_pot)?.toLocaleString(
                                "en-US",
                                { maximumFractionDigits: 0 }
                              )}{" "}
                              <span className="textSize">
                                ({data?.from_user_name.split(" ")[0]})
                              </span>
                            </p>
                            <p className="textSize1">
                              {Number(data?.to_after_pot)?.toLocaleString(
                                "en-US",
                                { maximumFractionDigits: 0 }
                              )}{" "}
                              <span className="textSize">
                                ({data?.to_user_name.split(" ")[0]})
                              </span>
                            </p>
                          </>
                        ) : (
                          <>
                            {data?.user?.from == false
                              ? Number(data?.to_after_pot)?.toLocaleString()
                              : Number(data?.from_after_pot)?.toLocaleString()}
                          </>
                        )}
                      </TableCell>
                      <TableCell
                        sx={{
                          textAlign: "center",
                        }}
                      >
                        {formatLocalDateTime(data?.created_at)}
                      </TableCell>
                    </>
                  )}
                </StyledTableRow>
              );
            })}
        </TableBody>
      );
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
    const today = new Date();
    const startOfDay = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() - 1, // Today
      0, // Hours
      0, // Minutes
      0 // Seconds
    );

    // Set the end date to "2023-09-27 00:00:00"
    const endOfDay = new Date();

    setStartDate(startOfDay);
    setEndDate(endOfDay);
  };

  const handleThreedayClick = () => {
    const endDate = new Date();
    const startDate = new Date(endDate);
    startDate.setDate(endDate.getDate() - 2);
    startDate.setHours(0, 0, 0, 0); // Set hours, minutes, seconds, and milliseconds to 0 for both dates
    // endDate.setHours(0, 0, 0, 0);
    setStartDate(startDate);
    setEndDate(endDate);
  };

  // 1hur, 6hur, today, yesterday
  const handleCLickOneHour = () => {
    const endDate = new Date();
    const startDate = new Date(endDate);

    // Add 1 hour to both startDate and endDate
    startDate.setHours(startDate.getHours() - 1);
    // endDate.setHours(endDate.getHours());

    setStartDate(startDate);
    setEndDate(endDate);
  };

  const handleClickSixHour = () => {
    const endDate = new Date();
    const startDate = new Date(endDate);

    // Add 1 hour to both startDate and endDate
    startDate.setHours(startDate.getHours() - 6);
    // endDate.setHours(endDate.getHours());

    setStartDate(startDate);
    setEndDate(endDate);
  };

  const handleWeekClick = () => {
    // const endDate = new Date();

    // const startDate = new Date();
    // startDate.setDate(endDate.getDate() - 6);

    // setStartDate(startDate);
    // setEndDate(endDate);

    const currentDate = new Date();
    const startDate = new Date(currentDate);
    startDate.setDate(currentDate.getDate() - 6);
    startDate.setHours(0, 0, 0, 0); // Set time to midnight (00:00:00)

    const endDate = new Date(currentDate);
    // endDate.setHours(0, 0, 0, 0); // Set time to midnight (00:00:00)

    setStartDate(startDate);
    setEndDate(endDate);
  };

  const handleMonthClick = () => {
    // const endDate = new Date();

    // const startDate = new Date();
    // startDate.setMonth(endDate.getMonth() - 1);

    // startDate.setDate(1);

    // endDate.setMonth(endDate.getMonth() + 1);
    // endDate.setDate(0);

    // setStartDate(startDate);
    // setEndDate(endDate);

    const endDate = new Date();
    // endDate.setHours(0, 0, 0, 0); // Set time to 00:00:00.000

    const startDate = new Date(endDate);
    startDate.setDate(endDate.getDate() - 31);
    startDate.setHours(0, 0, 0, 0); // Set time to 00:00:00.000

    setStartDate(startDate);
    setEndDate(endDate);
  };

  const searchHistory = () => {
    // const sDate = new Date(startDate);
    // const eDate = new Date(endDate);
    // const timeDifference = (sDate - eDate) / (1000 * 60 * 60 * 24);

    // if (Math.abs(timeDifference) > 3 && role["role"] != "admin") {
    //   // Display an alert or any other desired user feedback
    //   return dispatch(
    //     showMessage({
    //       variant: "error",
    //       message: `${selectedLang.selected_date_should_not_more_three_days}`,
    //     })
    //   );
    // }

    setPage1(0);
    setPage2(0);
    setPage3(0);
    setPage4(0);
    getAdminRequest();
    getSubAgentPaymentHistory();
    getAgentPaymentHistory();
    getAgentRefund();
  };

  //   const csvHeadersubAgentDepositHistoryData = [
  //     { label: "User Id", key: "userId" },
  //     { label: "Parent Id", key: "parentId" },
  //     { label: "No: of Point", key: "point_amount" },
  //     { label: "Status", key: "status" },
  //     { label: "date", key: "created_at" },
  //   ];

  //   const csvHeaderUserithdrawalHistoryData = [
  //     { label: "User Id", key: "buyer_id" },
  //     { label: "Parent Id", key: "id" },
  //     { label: "Payment Amount", key: "amount" },
  //     { label: "Balance After Payment", key: "balanceAfterPayment" },
  //     { label: "Date", key: "created_at" },
  //   ];

  //   const subAgentDepositHistoryDataCSV =
  //     subAgentDepositHistoryData.length > 0 &&
  //     subAgentDepositHistoryData.map((item) => ({
  //       Status: item.status ? selectedLang.approved : selectedLang.not_approved,
  //       userId: item.childDetails[0]?.id,
  //       parentId: item?.userDetails[0]?.id,
  //       point_amount: item?.point_amount,
  //       created_at: moment(item?.created_at).format("YYYY/MM/DD HH:mm:ss"),
  //       // created_at: dateFormat(item?.created_at),
  //     }));

  //   const agentDepositHistoryDataCsv =
  //     agentDepositHistoryData.length > 0 &&
  //     agentDepositHistoryData.map((item) => ({
  //       buyer_id: item.buyer_id,
  //       id: item.id,
  //       amount: item.amount,
  //       balanceAfterPayment: item.balanceAfterPayment,
  //       created_at: moment(item?.created_at).format("YYYY/MM/DD HH:mm:ss"),
  //       // created_at: dateFormat(item?.created_at),
  //     }));

  const handleStartDateChange = (date) => {
    const currentDate = new Date(endDate);
    const selectedDate = new Date(date);

    // Calculate the difference in days
    const timeDifference = (currentDate - selectedDate) / (1000 * 60 * 60 * 24);

    if (timeDifference > 3) {
      // Display an alert or any other desired user feedback
      dispatch(
        showMessage({
          variant: "error",
          message: `${selectedLang.selected_date_should_not_more_three_days}`,
        })
      );
    } else {
      // Set the selected date if it's within the allowed range
      setStartDate(date);
    }
  };

  const handleEndDateChange = (date) => {
    const currentDate = new Date(startDate);
    const selectedDate = new Date(date);

    // Calculate the difference in days
    const timeDifference = (selectedDate - currentDate) / (1000 * 60 * 60 * 24);

    if (timeDifference > 3) {
      // Display an alert or any other desired user feedback
      dispatch(
        showMessage({
          variant: "error",
          message: `${selectedLang.selected_date_should_not_more_three_days}`,
        })
      );
    } else {
      // Set the selected date if it's within the allowed range
      setEndDate(date);
    }
  };

  return (
    <>
      {/* {" "} */}
      {loaded ? (
        <FuseLoading />
      ) : (
        <FusePageSimple
          header={
            <TransactionHistoryHeader
              selectedLang={selectedLang}
            //   csv_data={
            //     value == 1
            //       ? subAgentDepositHistoryDataCSV
            //       : agentDepositHistoryDataCsv
            //   }
            //   csv_header={
            //     value == 1
            //       ? csvHeadersubAgentDepositHistoryData
            //       : csvHeaderUserithdrawalHistoryData
            //   }
            //   csv_filename={`${
            //     value == 1 ? "user_deposite.csv" : "user_withdrawal.csv"
            //   }`}
            />
          }
          content={
            <Card
              sx={{ width: "100%", marginTop: "20px", borderRadius: "4px" }}
              className="main_card"
            >
              <div
                className="flex justify-start justify-between bg-gray p-16 w-100"
                style={{ display: "none" }}
              >
                <div className="flex justify-start items-center">
                  <span className="list-title">
                    {selectedLang.Agent_listofAdmin}
                  </span>
                </div>
              </div>
              <div
                className="row flex flex-wrap z-index-10 blockpaddings"
                style={{
                  flexWrap: "wrap",
                  justifyContent: "space-between",
                  gap: "10px",
                }}
              >
                <div className="flex item-center calender">
                  <div className="datepikers newdate_picker">
                    {/* <DateTimePicker
                        className="datetimePiker"
                        placeholder={"Start Date"}
                        size="small"
                        value={startDate}
                        inputFormat="yyyy/MM/dd HH:mm:ss"
                        // onChange={handleStartDateChange }
                        onChange={(date) => setStartDate(date)}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            placeholder={selectedLang.end_date}
                          />
                        )}
                      /> */}
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
                    {/* <DateTimePicker
                        className="datetimePiker mr-4"
                        placeholder={"End Date"}
                        size="small"
                        value={endDate}
                        inputFormat="yyyy/MM/dd HH:mm:ss"
                        onChange={(date) => setEndDate(date)}
                        // onChange={handleEndDateChange}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            placeholder={selectedLang.end_date}
                          />
                        )}
                      /> */}

                    {/* 
											<Tooltip
												title={selectedLang.yesterday}
												placement='top'
												arrow> */}
                    {/* <div className="d-flex" style={{ padding: "5px 0" }}>
                      <Button
                        className="flex item-center mybutton smaller"
                        variant="contained"
                        color="secondary"
                        sx={{
                          borderRadius: "4px",
                          margin: "0 3px", 
                          fontSize: "70%", 
                          padding: "3px 8px", 
                          height: "24px", 
                        }}
                        onClick={handleCLickOneHour}
                      >
                        1 {selectedLang.hour}
                      </Button>

                      <Button
                        className="flex item-center mybutton smaller"
                        variant="contained"
                        color="secondary"
                        sx={{
                          borderRadius: "4px",
                          margin: "0 3px", // Adjust the margin value as needed
                          fontSize: "70%", // Reduce font size to make the text smaller
                          padding: "3px 8px", // Reduce padding to make the button smaller
                          height: "24px", // Reduce height to make the button smaller
                        }}
                        onClick={handleClickSixHour}
                      >
                        6 {selectedLang.hour}
                      </Button>

                      <Button
                        className="flex item-center mybutton smaller"
                        variant="contained"
                        color="secondary"
                        sx={{
                          borderRadius: "4px",
                          margin: "0 3px", // Adjust the margin value as needed
                          fontSize: "70%", // Reduce font size to make the text smaller
                          padding: "3px 8px", // Reduce padding to make the button smaller
                          height: "24px", // Reduce height to make the button smaller
                        }}
                        onClick={handleTodayClick}
                      >
                        {selectedLang.today}
                      </Button>

                      <Button
                        className="flex item-center mybutton smaller"
                        variant="contained"
                        color="secondary"
                        sx={{
                          borderRadius: "4px",
                          margin: "0 3px", // Adjust the margin value as needed
                          fontSize: "70%", // Reduce font size to make the text smaller
                          padding: "3px 8px", // Reduce padding to make the button smaller
                          height: "24px", // Reduce height to make the button smaller
                        }}
                        onClick={handleYesterdayClick}
                      >
                        {selectedLang.yesterday}
                      </Button>
                    </div> */}
                    {/* </Tooltip> */}
                  </div>
                </div>
                <div className="col-lg-2 col-md-4 col-sm-4 flex item-center searchall">
                  <div className="col-lg-8 col-md-4 col-sm-4 flex item-center">
                    {/* <InputBase
                        sx={{
                          ml: 1,
                          flex: 1,
                          border: "1px solid #cdcfd3",
                          borderRadius: "4px",
                          minWidth: "80px",
                          width: "80px",
                          padding: "4px 10px",
                          marginRight: "0px",
                          marginLeft: "0px",
                        }}
                        placeholder={selectedLang.agent}
                        value={parent}
                        onChange={(e) => setParent(e.target.value)}
                        inputProps={{ "aria-label": selectedLang.agent }}
                      /> */}
                    <Autocomplete
                      onChange={handleChangeAdminType}
                      value={
                        searchType == ""
                          ? selectedLang.all
                          : searchType == "1"
                            ? selectedLang.agent
                            : selectedLang.target
                      }
                      sx={{
                        width: "150px",
                      }}
                      className="autocomplete"
                      variant="outlined"
                      disablePortal
                      size="small"
                      id="combo-box-demo"
                      options={[
                        { label: `${selectedLang.all}`, value: "" },
                        { label: `${selectedLang.agent}`, value: "1" },
                        { label: `${selectedLang.target}`, value: "0" },
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
                        marginRight: "0px",
                      }}
                      placeholder={
                        searchType == ""
                          ? selectedLang.all
                          : searchType == "1"
                            ? selectedLang.agent
                            : selectedLang.target
                      }
                      value={agent_search}
                      onChange={(e) => setAgent(e.target.value)}
                      inputProps={{ "aria-label": selectedLang.target }}
                    />
                  </div>
                  <Button
                    className="flex item-center"
                    variant="contained"
                    color="secondary"
                    onClick={() => {
                      // getAdminRequest();
                      // getSubAgentPaymentHistory();
                      // getAgentPaymentHistory();
                      searchHistory();
                    }}
                    endIcon={<SearchIcon size={20}></SearchIcon>}
                    sx={{
                      borderRadius: "4px",
                      marginLeft: "10px",
                    }}
                  >
                    {selectedLang.search}
                  </Button>
                </div>
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
                    <>
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
                              label={`${selectedLang.agent_deposit}`}
                              value="1"
                              className="tab_btn"
                            />
                            {/*<Tab
                              label={`${selectedLang.agent_withdrawal}`}
                              value="2"
                              className="tab_btn"
                            />*/}
                            <Tab
                              label={`${selectedLang.agent_withdrawal}`}
                              value="4"
                              className="tab_btn"
                            />
                            <Tab
                              label={selectedLang.sub_agent_pot_history}
                              value="3"
                              className="tab_btn"
                            />
                          </TabList>
                        </Box>
                        <TabPanel value="1" className="common_tab_content">
                          <TableContainer>
                            <Table stickyHeader aria-label="customized table">
                              <TableHead>
                                <TableRow>
                                  {userColumns0.map((column) => (
                                    <StyledTableCell
                                      sx={{
                                        textAlign: "center",
                                        cursor:
                                          column.id === "density" ||
                                            column.id === "size" ||
                                            column.id === "Afdensity"
                                            ? "pointer"
                                            : "default",
                                      }}
                                      key={column.id}
                                      align={column.align}
                                      style={{ minWidth: column.minWidth }}
                                      // active={sortBy === column.id}
                                      onClick={() => handleSort(column.id)}
                                    >
                                      {column.label}
                                      {column.id == "density"
                                        ? getSortIconBBW(sortOrder_bbw)
                                        : column.id == "size"
                                          ? getSortIconAMT(sortOrder_amt)
                                          : column.id == "Afdensity"
                                            ? getSortIconBAD(sortOrder_bad)
                                            : ""}
                                    </StyledTableCell>
                                  ))}
                                </TableRow>
                              </TableHead>
                              {!loading3 && addUserSubAgentPaymentData()}
                            </Table>

                            {loading3 && <FuseLoading />}
                            {!subAgentDepositHistoryData.length > 0 &&
                              !loading3 && (
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
                        </TabPanel>
                        <TabPanel value="2" className="common_tab_content">
                          <TableContainer>
                            <Table stickyHeader aria-label="customized table">
                              <TableHead>
                                <TableRow>
                                  {userColumns1.map((column) => (
                                    <StyledTableCell
                                      sx={{
                                        textAlign: "center",
                                        cursor:
                                          column.id === "size" ||
                                            column.id === "Afdensity" ||
                                            column.id === "density"
                                            ? "pointer"
                                            : "default",
                                      }}
                                      key={column.id}
                                      align={column.align}
                                      style={{ minWidth: column.minWidth }}
                                      // active={true}
                                      // disable={
                                      //   column.id != "size" ||
                                      //   column.id != "density" ||
                                      //   column.id != "Afdensity"
                                      // }
                                      onClick={() => handleSort(column.id)}
                                    >
                                      {column.label}
                                      {column.id == "density"
                                        ? getSortIconBBW(sortOrder_bbw)
                                        : column.id == "size"
                                          ? getSortIconAMT(sortOrder_amt)
                                          : column.id == "Afdensity"
                                            ? getSortIconBAD(sortOrder_bad)
                                            : ""}
                                    </StyledTableCell>
                                  ))}
                                </TableRow>
                              </TableHead>
                              {!loading2 && addUserCreationPaymentData()}
                            </Table>
                            {loading2 && <FuseLoading />}
                            {!agentDepositHistoryData.length > 0 &&
                              !loading2 && (
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
                        </TabPanel>
                        <TabPanel value="3" className="common_tab_content">
                          <TableContainer>
                            <Table stickyHeader aria-label="customized table">
                              <TableHead>
                                <TableRow>
                                  {userColumns3.map((column) => (
                                    <StyledTableCell
                                      sx={{
                                        textAlign: "center",
                                        cursor:
                                          column.id === "density" ||
                                            column.id === "size" ||
                                            column.id === "Afdensity"
                                            ? "pointer"
                                            : "default",
                                      }}
                                      key={column.id}
                                      align={column.align}
                                      style={{ minWidth: column.minWidth }}
                                      // active={sortBy === column.id}
                                      onClick={() => handleSort(column.id)}
                                    >
                                      {column.label}
                                      {column.id == "density"
                                        ? getSortIconBBW(sortOrder_bbw)
                                        : column.id == "size"
                                          ? getSortIconAMT(sortOrder_amt)
                                          : column.id == "Afdensity"
                                            ? getSortIconBAD(sortOrder_bad)
                                            : ""}
                                    </StyledTableCell>
                                  ))}
                                </TableRow>
                              </TableHead>
                              {!loading1 && addAdminRequest()}
                            </Table>

                            {loading1 && <FuseLoading />}
                            {!adminrequest.length > 0 && !loading1 && (
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
                        </TabPanel>
                        <TabPanel value="4" className="common_tab_content">
                          <TableContainer>
                            <Table stickyHeader aria-label="customized table">
                              <TableHead>
                                <TableRow>
                                  {userColumns4.map((column) => (
                                    <StyledTableCell
                                      sx={{
                                        textAlign: "center",
                                        cursor:
                                          column.id === "density" ||
                                            column.id === "size" ||
                                            column.id === "Afdensity"
                                            ? "pointer"
                                            : "default",
                                      }}
                                      key={column.id}
                                      align={column.align}
                                      style={{ minWidth: column.minWidth }}
                                      // active={sortBy === column.id}
                                      onClick={() => handleSort(column.id)}
                                    >
                                      {column.label}
                                      {column.id == "density"
                                        ? getSortIconBBW(sortOrder_bbw)
                                        : column.id == "size"
                                          ? getSortIconAMT(sortOrder_amt)
                                          : column.id == "Afdensity"
                                            ? getSortIconBAD(sortOrder_bad)
                                            : ""}
                                    </StyledTableCell>
                                  ))}
                                </TableRow>
                              </TableHead>
                              {!loading1 && addRefundData()}
                            </Table>

                            {loading1 && <FuseLoading />}
                            {!adminrequest.length > 0 && !loading1 && (
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
                        </TabPanel>
                      </TabContext>
                    </>
                    {value == 3 && (
                      <TablePagination
                        rowsPerPageOptions={[20, 50, 100, 200, 500]}
                        component="div"
                        count={adminrequestTableCount}
                        rowsPerPage={rowsPerPage}
                        page={page3}
                        onPageChange={handleChangePage3}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                        labelRowsPerPage={selectedLang.rows_per_page}
                      />
                    )}

                    {value == 1 && (
                      <TablePagination
                        rowsPerPageOptions={[20, 50, 100, 200, 500]}
                        component="div"
                        count={subAgentTableCount}
                        rowsPerPage={rowsPerPage}
                        page={page1}
                        onPageChange={handleChangePage1}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                        labelRowsPerPage={selectedLang.rows_per_page}
                      />
                    )}

                    {value == 2 && (
                      <TablePagination
                        rowsPerPageOptions={[20, 50, 100, 200, 500]}
                        component="div"
                        count={withdrawAgentTableCount}
                        rowsPerPage={rowsPerPage}
                        page={page2}
                        onPageChange={handleChangePage2}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                        labelRowsPerPage={selectedLang.rows_per_page}
                      />
                    )}

                    {value == 4 && (
                      <TablePagination
                        rowsPerPageOptions={[20, 50, 100, 200, 500]}
                        component="div"
                        count={refundAgentTableCount}
                        rowsPerPage={rowsPerPage}
                        page={page4}
                        onPageChange={handleChangePage4}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                        labelRowsPerPage={selectedLang.rows_per_page}
                      />
                    )}
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

export default transactionHistoryApp;
