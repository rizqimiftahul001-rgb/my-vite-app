/** @format */

import * as React from "react";
import FusePageSimple from "@fuse/core/FusePageSimple";
import TransactionHistoryHeader from "./transactionHistoryHeader";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import { locale } from "../../../../configs/navigation-i18n";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { Autocomplete, Button } from "@mui/material";
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
import {
  casinoUserMenu,
  formatLocalDateTime,
  formatSentence,
} from "src/app/services/Utility";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSort } from "@fortawesome/free-solid-svg-icons";
import { faSortUp } from "@fortawesome/free-solid-svg-icons";
import { faSortDown } from "@fortawesome/free-solid-svg-icons";
import queryString from "query-string";
import cloneDeep from "lodash/cloneDeep";
import "flatpickr/dist/themes/material_green.css";
import Flatpickr from "react-flatpickr";
import { useNavigate } from "react-router-dom";
import PopupState, { bindTrigger, bindMenu } from "material-ui-popup-state";
import { Menu } from "@mui/material";
import { useLocation } from "react-router-dom";
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

function TransactionHistoryApp() {
  const location = useLocation();
  const todayDate = new Date();
  const navigate = useNavigate();
  todayDate.setDate(todayDate.getDate());
  todayDate.setHours(23, 59, 59, 999);
  const threeDaysAgo = new Date(todayDate);
  threeDaysAgo.setDate(todayDate.getDate() - 2);
  threeDaysAgo.setHours(0, 0, 0, 0);

  const [status, setType] = useState("");
  // const [sortedAndMappedData, setSortedAndMappedData] = useState([]);
  const [originalSubDepo, setOriginalSubDepo] = useState([]);

  const [sortOrder_bbw, setSortOrder_bbw] = useState("");
  const [sortOrder_amt, setSortOrder_amt] = useState("");
  const [sortOrder_bad, setSortOrder_bad] = useState("");
  // const [agentFilterValue, setAgentName] = useState("");
  const [showRoundTooltip, setShowRoundTooltip] = useState(false);
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
  const [parent, setParent] = useState(agent || "");
  const [adminrequest, setAdminRequest] = useState([]);
  const [userId,setUserId] = useState(role["user_id"]);
  const [asyncReq, setAsyncReq] = useState([]);
  const [asyncWithdrawReq, setAsyncWithdrawReq] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [wallet, setWallet] = useState("todayDate");
  const [agentName, setAgentName] = useState([]);
  const [userRole,setUserRole] = useState(role["role"]);
  const [selectedAgent, setSelectedAgent] = useState(role["id"]);
  // const [agentFilterValue, setAgentFilterValue] = useState("");
  // const [status, setStatus] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [subAgentDepositHistoryData, setSubAgentDepositHistoryData] = useState(
    []
  );
  const [agentDepositHistoryData, setAgentDepositHistoryData] = useState([]);
  const [selectedprovider] = useSelector((state) => [
    state.provider.selectedprovider,
  ]);

  const dispatch = useDispatch();
  const [loaded, setLoaded] = useState(true);
  const [loading1, setLoading1] = useState(true);
  const [loading2, setLoading2] = useState(true);
  const [loading3, setLoading3] = useState(true);
  const [loading4, setLoading4] = useState(true);
  const [loading5, setLoading5] = useState(true);
  const [sumArray, setSumArray] = useState({});
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

  const getUserDetails = (userId)=>{
    APIService({
      url: `${process.env.REACT_APP_R_SITE_API}/user/details?user_id=${user_id !== undefined ? userId:role["user_id"]}&provider=${selectedprovider}`,
      method: "GET",
    })
      .then((res) => {
        setUserRole(res.data.data[0]?.role)
        setAgentName(res.data.data.UserDataResult.subAgentUsers);
      })
      .catch((err) => {
        setAgentName([]);
      })
      .finally(() => {
        setLoading2(false);
      });
  }
  
  const getAgentName = () => {


    APIService({
      url: `${process.env.REACT_APP_R_SITE_API}/user/agent-name-list?user_id=${role["user_id"]}&provider=${selectedprovider}`,
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

  const searchHistory = () => {
    const sDate = new Date(startDate);
    const eDate = new Date(endDate);
    const timeDifference = (sDate - eDate) / (1000 * 60 * 60 * 24);
    getUserDetails(userId)
    getAdminRequest(userRole);
    getAgentName()
    setPage1(0);
  };

  useEffect(()=>{
    getAgentName()
  },[])

  const addDynamicSearch = (event, newValue) => {
    if(newValue===null){
      addAdminRequest([])
    }else{
    let userdata = agentName.find(agent => agent.id === newValue);
    setUserId(userdata?.user_id)
    if (newValue) {
        setSelectedAgent(newValue);
    }
    }
    
  };

  useEffect(()=>{
    if(selectedAgent===""){
      getAgentName()
      addAdminRequest([])
    }else{
      searchHistory()
      getAgentName()
    }
  },[selectedAgent,userId])


  
  const getAdminRequest = (userRole) => {
    setLoaded(true)
    setAdminRequest([])
    let forAdminPotHistory = "agent_casino,admin_agent,agent_agent,admin_agent,admin_casino"
    let forUserPotHistory = "agent_casino,admin_agent,agent_agent"
    resetSorting();
    setLoading3(true);
    setLoaded(true)
    APIService({
      url: `${
        process.env.REACT_APP_R_SITE_API
      }/transaction/get-all-agent-user?&limit=${rowsPerPage}&pageNumber=${
        page3 + 1
      }&transaction_relation=${userRole === "admin"?forAdminPotHistory:forUserPotHistory}&agent=${
        searchType == "1" ? agent_search : ""
      }&startDate=${startDate}&endDate=${endDate}&parent=${
        searchType == "0" ? agent_search : ""
      }&all=${searchType == "" ? agent_search : ""}&userId=${userId !== undefined ? userId : role["user_id"]}`,
      method: "GET",
    })
      .then((res) => {
        setAdminRequest(res.data.data);
        setSumArray((prev) => ({ ...prev, adminrequest: res?.data?.sum }));
        _adminrequestTableCount(res.data.tableCount);
        setSortedAndMappedDataAll(res.data.data);
        setOriginalSubDepoAll(cloneDeep(res.data.data));
        setLoading3(false);
        setLoaded(false)
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
      });
  };


  // useEffect(()=>{
  // },[userId])

  useEffect(() => {
    if (agent_search && agent) {
      // getAdminRequest(startDate, endDate);
      getSubAgentPaymentHistory(startDate, endDate);
      getAgentPaymentHistory(startDate, endDate);
      getAsyncHistory(startDate, endDate);
      getAsyncWithdrawHistory(startDate, endDate);
      getAgentName()
    }
  }, [location, agent_search]);

  const [page1, setPage1] = React.useState(0);
  const [page2, setPage2] = React.useState(0);
  const [page3, setPage3] = React.useState(0);
  const [page4, setPage4] = React.useState(0);
  const [page5, setPage5] = React.useState(0);

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

  const handleChangePage5 = (event, newPage) => {
    setPage5(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage1(0);
    setPage2(0);
    setPage3(0);
    setPage4(0);
    setPage5(0);
  };

  const [age, setAge] = React.useState("");

  const handleChange = (event) => {
    setAge(event.target.value);
  };

  useEffect(() => {
    getUser();
  }, [page1, rowsPerPage]);

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
    getAsyncHistory();
  }, [page4, rowsPerPage, selectedLang]);

  useEffect(() => {
    getAsyncWithdrawHistory();
  }, [page5, rowsPerPage, selectedLang]);

  const [adminrequestTableCount, _adminrequestTableCount] = useState(0);

  const [sortedAndMappedDataAll, setSortedAndMappedDataAll] = useState([]);
  const [originalSubDepoAll, setOriginalSubDepoAll] = useState([]);

  const getUser = () => {
    APIService({
      url: `${process.env.REACT_APP_R_SITE_API}/user/details?user_id=${user_id}`,
      method: "GET",
    })
      .then((data) => {
        setWallet(data.data.data[0].wallet_type);
      })
      .catch((err) => {})
      .finally(() => {
        setLoading1(false);
      });
  };

  const [searchType, _searchType] = useState("");
  const handleChangeAdminType = (event, newValue) => {
    // const newValue = event.target.value;
    _searchType(newValue?.value || "");
  };




  const resetSorting = () => {
    setSortOrder_bbw("");
    setSortOrder_amt("");
    setSortOrder_bad("");
  };

  const onDataFilter = (startDate, endDate) => {
    setEndDate(endDate);
    setStartDate(startDate);
  };

  const [subAgentTableCount, _subAgentTableCount] = useState(0);
  const getSubAgentPaymentHistory = (pageNumber) => {
    resetSorting();
    setLoading1(true);
    APIService({
      url: `${
        process.env.REACT_APP_R_SITE_API
      }/transaction/get-deposit?&limit=${rowsPerPage}&pageNumber=${
        page1 + 1
      }&transaction_relation=${
        role["role"] === "admin" || role["role"] === "cs"
          ? "agent_casino,admin_casino"
          : "agent_casino"
      }&agent=${
        searchType == "0" ? agent_search : ""
      }&startDate=${startDate}&endDate=${endDate}&parent=${
        searchType == "1" ? agent_search : ""
      }&all=${searchType == "" ? agent_search : ""}`,
      method: "GET",
    })
      .then((res) => {
        setSubAgentDepositHistoryData(res.data.data);
        // setSortedAndMappedData(res.data.data)
        setOriginalSubDepo(cloneDeep(res.data.data));
        setSumArray((prev) => ({ ...prev, deposit: res?.data?.sum }));
        _subAgentTableCount(res?.data?.tableCount);
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
        setLoading1(false);
      });
  };

  const [subAsyncTableCount, _asyncTableCount] = useState(0);

  const getAsyncHistory = () => {
    resetSorting();
    setLoading4(true);
    APIService({
      url: `${
        process.env.REACT_APP_R_SITE_API
      }/transaction/get-synchronization?&limit=${rowsPerPage}&pageNumber=${
        page4 + 1
      }&transaction_relation=${
        role["role"] === "admin" || role["role"] === "cs"
          ? "agent_casino,admin_casino"
          : "agent_casino"
      }&agent=${
        searchType == "1" ? agent_search : ""
      }&startDate=${startDate}&endDate=${endDate}&parent=${
        searchType == "0" ? agent_search : ""
      }&all=${searchType == "" ? agent_search : ""}`,
      method: "GET",
    })
      .then((res) => {
        setSumArray((prev) => ({ ...prev, sync_deposite: res?.data?.sum }));

        setAsyncReq(res.data.data);
        _asyncTableCount(res?.data?.tableCount);
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

  const [subAsyncWithdrawTableCount, _asyncWithdrawTableCount] = useState(0);

  const getAsyncWithdrawHistory = () => {
    resetSorting();
    setLoading5(true);
    APIService({
      url: `${
        process.env.REACT_APP_R_SITE_API
      }/transaction/get-synchronization-withdraw?&limit=${rowsPerPage}&pageNumber=${
        page5 + 1
      }&transaction_relation=${
        role["role"] === "admin" || role["role"] === "cs"
          ? "agent_casino,admin_casino"
          : "agent_casino"
      }&agent=${
        searchType == "1" ? agent_search : ""
      }&startDate=${startDate}&endDate=${endDate}&parent=${
        searchType == "0" ? agent_search : ""
      }&all=${searchType == "" ? agent_search : ""}`,
      method: "GET",
    })
      .then((res) => {
        setSumArray((prev) => ({ ...prev, sync_widthraw: res?.data?.sum }));

        setAsyncWithdrawReq(res.data.data);
        _asyncWithdrawTableCount(res?.data?.tableCount);
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
        setLoading5(false);
      });
  };

  const [withdrawAgentTableCount, _withdrawAgentTableCount] = useState(0);

  const [originalSubDepoWithdraw, setOriginalSubDepoWithdraw] = useState([]);

  const getAgentPaymentHistory = (pageNumber) => {
    setLoading2(true);
    APIService({
      url: `${
        process.env.REACT_APP_R_SITE_API
      }/transaction/get-withdraw?&limit=${rowsPerPage}&pageNumber=${
        page2 + 1
      }&transaction_relation=${
        role["role"] === "admin" || role["role"] === "cs"
          ? "agent_casino,admin_casino"
          : "agent_casino"
      }&agent=${
        searchType == "1" ? agent_search : ""
      }&startDate=${startDate}&endDate=${endDate}&parent=${
        searchType == "0" ? agent_search : ""
      }&all=${searchType == "" ? agent_search : ""}`,
      method: "GET",
    })
      .then((res) => {
        setAgentDepositHistoryData(res.data.data);
        setSumArray((prev) => ({ ...prev, withdraw: res?.data?.sum }));
        _withdrawAgentTableCount(res?.data?.tableCount);
        setOriginalSubDepoWithdraw(cloneDeep(res.data.data));
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

  const userColumns3 = [
    { id: "name", label: `${selectedLang.no}`, minWidth: 50 },
    {
      id: "population",
      label: `${selectedLang.tradingAgent}`,
      minWidth: 170,
    },
    { id: "code", label: `${selectedLang.targetAgent}`, minWidth: 100 },
    {
      id: "type",
      label: `${selectedLang.Transactiontype}`,
      minWidth: 170,
    },
    {
      id: "density",
      label: `${selectedLang.prevBalance}`,
      minWidth: 170,
    },
    {
      id: "size",
      label: `${selectedLang.transactionAmt}`,
      minWidth: 170,
      format: (value) => value.toLocaleString("en-US"),
    },
    {
      id: "Afdensity",
      label: `${selectedLang.amountAfter}`,
      minWidth: 170,
    },
    {
      id: "status",
      label: `${selectedLang.statusTransac}`,
      minWidth: 100,
    },
    { id:"transactionId",label:`${selectedLang.potTransactionId}`,minWidth:150 },
    {
      id: "date",
      label: `${selectedLang.transDate}`,
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

  useEffect(() => {
    const handlePopstate = () => {
      window.location.reload(true);
    };

    window.addEventListener("popstate", handlePopstate);

    return () => {
      window.removeEventListener("popstate", handlePopstate);
    };
  }, []);


  // admin request total row UI
  const createSumRowAdminReq = () => {
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
          {sumArray?.adminrequest &&
            sumArray?.adminrequest[0]?.sumAmount?.toLocaleString()}
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

  const initCopyAdminReq = [...adminrequest];

  const sortedAdminReq =
    sortOrder !== ""
      ? initCopyAdminReq.sort((a, b) => {
          let aafterPot =
            Number(a?.before_pot) > Number(a?.after_pot || 0)
              ? Number(a?.amount * -1)
              : Number(a?.amount);
          let bafterPot =
            Number(b?.before_pot) > Number(b?.after_pot || 0)
              ? Number(b?.amount) * -1
              : Number(b?.amount);
          if (sortBy === "size") {
            return sortOrder === "asc"
              ? aafterPot - bafterPot
              : bafterPot - aafterPot;
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
      : initCopyAdminReq;

  const initCopyasyncReq = [...asyncReq];

  const sortedAdminReqasyncReq =
    sortOrder !== ""
      ? initCopyasyncReq.sort((a, b) => {
          let aafterPot =
            Number(a?.before_pot) > Number(a?.after_pot || 0)
              ? Number(a?.amount * -1)
              : Number(a?.amount);
          let bafterPot =
            Number(b?.before_pot) > Number(b?.after_pot || 0)
              ? Number(b?.amount) * -1
              : Number(b?.amount);
          if (sortBy === "size") {
            return sortOrder === "asc"
              ? aafterPot - bafterPot
              : bafterPot - aafterPot;
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
      : initCopyasyncReq;

  const handleRoundClick = (round_id) => {
    if (round_id) {
      const tempTextArea = document.createElement("textarea");
      tempTextArea.value = round_id;
      document.body.appendChild(tempTextArea);
      tempTextArea.select();
      document.execCommand("copy");
      document.body.removeChild(tempTextArea);

      dispatch(
        showMessage({
          variant: "success",
          message: `${selectedLang.Transaction_ID_copied_successfully}`,
        })
      );
    }
  };

  const initCopyasyncWithdrawReq = [...asyncWithdrawReq];

  const sortedReqasyncWithdrawReq =
    sortOrder !== ""
      ? initCopyasyncWithdrawReq.sort((a, b) => {
          let aafterPot =
            Number(a?.before_pot) > Number(a?.after_pot || 0)
              ? Number(a?.amount * -1)
              : Number(a?.amount);
          let bafterPot =
            Number(b?.before_pot) > Number(b?.after_pot || 0)
              ? Number(b?.amount) * -1
              : Number(b?.amount);
          if (sortBy === "size") {
            return sortOrder === "asc"
              ? aafterPot - bafterPot
              : bafterPot - aafterPot;
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
      : initCopyasyncWithdrawReq;

  const addAdminRequest = () => {
    if (adminrequest.length > 0) {
      return (
        <TableBody>
          {createSumRowAdminReq()}
          {sortedAdminReq
            .map((data, index) => {
              return (
                <StyledTableRow
                  hover
                  className={
                    data?.transaction_type == "withdraw"
                      ? "withdraw_row"
                      : data?.transaction_type == "deposit" || data?.transaction_type == "refund"
                      ? "deposit_row"
                      : data?.transaction_type == "synchronization deposit"
                      ? "syn_deposit_row"
                      : "syn_withdraw_row"
                  }
                  role="checkbox"
                  tabIndex={-1}
                  key={index}
                >
                  <TableCell
                    sx={{
                      textAlign: "center",
                    }}
                  >
                    {page3 * rowsPerPage + index + 1}
                  </TableCell>
                  {/* {
                    // these three
                  }  */}

                    {
                      userRole === "admin"
                      ?
                      <>
                  <TableCell
                    sx={{
                      textAlign: "center",
                    }}
                  >
                    {/* {data?.from_user_name} */}
                    {
                    data?.transaction_type === "withdraw" && (data?.transaction_relation==="admin_agent") && data?.parentchildCheckId !== data?.to_user_id
                    ?
                    (
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

                              <hr style={{ border: "1px solid #e2e8f0" }} />
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
                                  popupState.close();
                                  navigate(
                                    `/user/userList?agent=${data?.from_user_name}`
                                  );
                                }}
                              >
                                {selectedLang.USERLIST}
                              </MenuItem>
                              <MenuItem
                                onClick={() => {
                                  popupState.close();
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
                    )
                    :
                    data?.transaction_type === "refund" && (data?.transaction_relation==="admin_agent") && data?.parentchildCheckId !== data?.from_user_id
                    ?
                    (
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

                              <hr style={{ border: "1px solid #e2e8f0" }} />
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
                              <hr style={{ border: "1px solid #e2e8f0" }} />
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
                              <hr style={{ border: "1px solid #e2e8f0" }} />
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
                              <hr style={{ border: "1px solid #e2e8f0" }} />
                              <MenuItem
                                onClick={() => {
                                  popupState.close();
                                  navigate(
                                    `/user/userList?agent=${data?.to_user_name}`
                                  );
                                }}
                              >
                                {selectedLang.USERLIST}
                              </MenuItem>
                              <MenuItem
                                onClick={() => {
                                  popupState.close();
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
                    )
                    :
                    data?.transaction_type === "refund" && (data?.transaction_relation==="admin_agent")
                    ?
                    (
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

                              <hr style={{ border: "1px solid #e2e8f0" }} />
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
                                  popupState.close();
                                  navigate(
                                    `/user/userList?agent=${data?.from_user_name}`
                                  );
                                }}
                              >
                                {selectedLang.USERLIST}
                              </MenuItem>
                              <MenuItem
                                onClick={() => {
                                  popupState.close();
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
                    )
                    :
                    data?.transaction_type === "withdraw" && (data?.transaction_relation==="admin_agent") 
                    ?
                    (
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

                              <hr style={{ border: "1px solid #e2e8f0" }} />
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
                              <hr style={{ border: "1px solid #e2e8f0" }} />
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
                              <hr style={{ border: "1px solid #e2e8f0" }} />
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
                              <hr style={{ border: "1px solid #e2e8f0" }} />
                              <MenuItem
                                onClick={() => {
                                  popupState.close();
                                  navigate(
                                    `/user/userList?agent=${data?.to_user_name}`
                                  );
                                }}
                              >
                                {selectedLang.USERLIST}
                              </MenuItem>
                              <MenuItem
                                onClick={() => {
                                  popupState.close();
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
                    )
                    :
                    //old
                    data?.transaction_type === "refund" && (data?.transaction_relation==="agent_agent")
                    ?
                    (
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

                              <hr style={{ border: "1px solid #e2e8f0" }} />
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
                              <hr style={{ border: "1px solid #e2e8f0" }} />
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
                              <hr style={{ border: "1px solid #e2e8f0" }} />
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
                              <hr style={{ border: "1px solid #e2e8f0" }} />
                              <MenuItem
                                onClick={() => {
                                  popupState.close();
                                  navigate(
                                    `/user/userList?agent=${data?.to_user_name}`
                                  );
                                }}
                              >
                                {selectedLang.USERLIST}
                              </MenuItem>
                              <MenuItem
                                onClick={() => {
                                  popupState.close();
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
                    )
                    :  
                    data?.transaction_type === "withdraw" && (data?.transaction_relation==="agent_agent" || data?.transaction_relation==="admin_agent") 
                    ?
                    (
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

                              <hr style={{ border: "1px solid #e2e8f0" }} />
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
                                  popupState.close();
                                  navigate(
                                    `/user/userList?agent=${data?.from_user_name}`
                                  );
                                }}
                              >
                                {selectedLang.USERLIST}
                              </MenuItem>
                              <MenuItem
                                onClick={() => {
                                  popupState.close();
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
                    )
                    :
                    data?.transaction_type === "withdraw" 
                    ? 
                    (
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

                              <hr style={{ border: "1px solid #e2e8f0" }} />
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
                              <hr style={{ border: "1px solid #e2e8f0" }} />
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
                              <hr style={{ border: "1px solid #e2e8f0" }} />
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
                              <hr style={{ border: "1px solid #e2e8f0" }} />
                              <MenuItem
                                onClick={() => {
                                  popupState.close();
                                  navigate(
                                    `/user/userList?agent=${data?.to_user_name}`
                                  );
                                }}
                              >
                                {selectedLang.USERLIST}
                              </MenuItem>
                              <MenuItem
                                onClick={() => {
                                  popupState.close();
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
                    ) 
                    :
                    (
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

                              <hr style={{ border: "1px solid #e2e8f0" }} />
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
                                  popupState.close();
                                  navigate(
                                    `/user/userList?agent=${data?.from_user_name}`
                                  );
                                }}
                              >
                                {selectedLang.USERLIST}
                              </MenuItem>
                              <MenuItem
                                onClick={() => {
                                  popupState.close();
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
                    )
                    }
                  </TableCell>

                  <TableCell
                    sx={{
                      textAlign: "center",
                      fontWeight: "bold",
                      textUnderlineOffset: "5px",
                    }}
                  >
                    {
                    data?.transaction_relation === "admin_agent" && (data?.transaction_type==="withdraw") && data?.parentchildCheckId !== data?.to_user_id
                    ?
                    casinoUserMenu(
                      selectedLang,
                      data?.to_user_name,
                      navigate
                    )
                    :  
                    data?.transaction_relation === "admin_agent" && (data?.transaction_type==="refund") && data?.parentchildCheckId !== data?.from_user_id
                    ?
                    casinoUserMenu(
                      selectedLang,
                      data?.from_user_name,
                      navigate
                    )
                    :  
                    data?.transaction_relation === "admin_agent" && (data?.transaction_type==="withdraw") 
                    ?
                    ""
                    :
                    data?.transaction_relation === "admin_agent" && (data?.transaction_type==="refund")
                    ?
                    ""
                    :
                    (data?.transaction_relation === "agent_agent" && (data?.transaction_type==="refund"))
                    ?
                    casinoUserMenu(
                      selectedLang,
                      data?.from_user_name,
                      navigate
                    )
                    :
                    (data?.transaction_relation === "agent_agent" && (data?.transaction_type==="withdraw"))
                    ?
                    casinoUserMenu(
                      selectedLang,
                      data?.to_user_name,
                      navigate
                    )
                    :
                    //old
                    data?.transaction_relation === "admin_agent" && (data?.transaction_type==="withdraw") && data?.from_user_id !== data?.parentchildCheckId
                    ?
                    casinoUserMenu(
                      selectedLang,
                      data?.to_user_name,
                      navigate
                    )
                    :
                    data?.transaction_relation === "admin_agent" && (data?.transaction_type==="refund" || data?.transaction_type==="deposit") && data?.to_user_id !== data?.parentchildCheckId
                    ?
                    casinoUserMenu(
                      selectedLang,
                      data?.from_user_name,
                      navigate
                    )
                    :
                    (data?.transaction_relation === "agent_agent" && data?.transaction_type==="withdraw" && data?.from_user_id === data?.parentchildCheckId)
                    ||
                    (data?.transaction_relation === "agent_agent" && (data?.transaction_type==="deposit" || data?.transaction_type==="refund")  && data?.to_user_id === data?.parentchildCheckId)
                    ? ""
                    :
                    data?.transaction_relation === "agent_agent" && data?.transaction_type === "withdraw"
                    ?
                    casinoUserMenu(
                      selectedLang,
                      data?.to_user_name,
                      navigate
                    )
                    :data?.transaction_relation === "agent_agent" && (data?.transaction_type === "refund" || data?.transaction_type === "deposit")
                    ?
                    casinoUserMenu(
                      selectedLang,
                      data?.from_user_name,
                      navigate
                    )
                    :
                    data?.transaction_relation !== "admin_agent" ? data?.transaction_type === "withdraw"
                      ? casinoUserMenu(
                          selectedLang,
                          data?.from_user_name,
                          navigate
                        )
                      : casinoUserMenu(
                          selectedLang,
                          data?.to_user_name,
                          navigate
                        )
                      :
                      data?.transaction_relation === "agent_agent" && data?.transaction_type==="withdraw" && data?.to_user_id === data?.parentchildCheckId 
                      ? ""
                      : data?.transaction_relation === "agent_agent" && data?.transaction_type==="deposit" && data?.from_user_id === data?.parentchildCheckId 
                      ? "" 
                      : ""
                    }
                  </TableCell>

                  <TableCell
                    sx={{
                      textAlign: "center",
                      color:
                        data?.transaction_type == "deposit"
                          ? "blue"
                          : data?.transaction_type == "withdraw"
                          ? "red"
                          : "",
                      fontWeight:"bold"
                    }}
                  >
                    {
                        data?.transaction_relation === "admin_casino" && (data?.transaction_type==="deposit")
                        ? (selectedLang.userWithdraw) 
                        :
                        data?.transaction_relation === "admin_casino" && (data?.transaction_type==="withdraw")
                        ? (selectedLang.userDeposit) 
                        :
                        data?.transaction_relation === "admin_agent" && (data?.transaction_type === "withdraw") && data?.parentchildCheckId !== data?.to_user_id
                        ? (selectedLang.paymentToSubAgent) 
                        :
                        data?.transaction_relation === "admin_agent" && (data?.transaction_type === "refund") && data?.parentchildCheckId !== data?.from_user_id
                        ? (selectedLang.fromSubAgent) 
                        :
                        data?.transaction_relation === "admin_agent" && (data?.transaction_type === "withdraw")
                        ? (selectedLang.upperDeposit) 
                        :
                        data?.transaction_relation === "admin_agent" && (data?.transaction_type === "refund" || data?.transaction_type === "deposit")
                        ? (selectedLang.upperWithdraw) 
                        :
                        data?.transaction_relation === "agent_agent" && (data?.transaction_type==="refund") 
                        ?
                         (selectedLang.fromSubAgent)
                        :
                        data?.transaction_relation === "agent_agent" && (data?.transaction_type==="withdraw") 
                        ?
                         (selectedLang.paymentToSubAgent)
                        :
                        data?.transaction_relation === "agent_casino" && (data?.transaction_type==="deposit")
                        ? (selectedLang.userWithdraw) 
                        :
                        data?.transaction_relation === "agent_casino" && (data?.transaction_type==="withdraw")
                        ? (selectedLang.userDeposit) 
                        :
                        //old
                        data?.transaction_relation === "admin_agent" && (data?.transaction_type === "withdraw") && data?.from_user_id !== data?.parentchildCheckId
                        ? (selectedLang.fromSubAgent)
                        :
                        data?.transaction_relation === "admin_agent" && (data?.transaction_type === "refund" || data?.transaction_type === "deposit") && data?.to_user_id !== data?.parentchildCheckId
                        ? (selectedLang.paymentToSubAgent) 
                        :
                        data?.transaction_relation === "admin_agent" && (data?.transaction_type === "refund" || data?.transaction_type === "deposit")
                        ? (selectedLang.upperWithdraw)
                        :
                        data?.transaction_relation === "agent_agent" && data?.transaction_type==="withdraw" && data?.from_user_id === data?.parentchildCheckId 
                        ?  (selectedLang.upperDeposit) 
                        : data?.transaction_relation === "agent_agent" && (data?.transaction_type==="deposit" || data?.transaction_type==="refund") && data?.to_user_id === data?.parentchildCheckId ?
                         (selectedLang.upperWithdraw)
                        : 
                        data?.transaction_relation === "agent_agent" && data?.transaction_type==="withdraw" && data?.to_user_id !== data?.parentchildCheckId 
                        ? (selectedLang.fromSubAgent) 
                        : data?.transaction_relation === "agent_agent" && (data?.transaction_type==="deposit") && data?.from_user_id === data?.parentchildCheckId ?
                        (selectedLang.paymentToSubAgent)
                        : data?.transaction_relation === "agent_agent" && ( data?.transaction_type==="refund") && data?.from_user_id !== data?.parentchildCheckId ?
                        (selectedLang.paymentToSubAgent)
                         :
                        data?.transaction_relation === "agent_casino"
                        ? (selectLocale !== "en" ? "유저" : "User ") + (selectedLang[`${formatSentence(data?.transaction_type)}`]?.toUpperCase() || data?.transaction_type?.toUpperCase())
                        : data?.transaction_relation === "admin_agent"
                        ? (selectLocale !== "en" ? "상부 " : "Upper ") + (selectedLang[`${formatSentence(data?.transaction_type)}`]?.toUpperCase() || data?.transaction_type?.toUpperCase())
                        : data?.transaction_relation === "admin_casino"
                        ? (selectLocale !== "en" ? "유저 " : "User ") + (selectedLang[`${formatSentence(data?.transaction_type)}`]?.toUpperCase() || data?.transaction_type?.toUpperCase())
                        :""
                    }
                  </TableCell>
                      </>
                      :
                      <>
                  <TableCell
                    sx={{
                      textAlign: "center",
                    }}
                  >
                    {/* {data?.from_user_name} */}
                    {
                    data?.transaction_type === "withdraw" && (data?.transaction_relation==="agent_agent") && (userRole ==="admin"? (role["user_id"] === data?.to_user_id):(userId === data?.to_user_id))
                    ?
                    (
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

                              <hr style={{ border: "1px solid #e2e8f0" }} />
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
                              <hr style={{ border: "1px solid #e2e8f0" }} />
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
                              <hr style={{ border: "1px solid #e2e8f0" }} />
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
                              <hr style={{ border: "1px solid #e2e8f0" }} />
                              <MenuItem
                                onClick={() => {
                                  popupState.close();
                                  navigate(
                                    `/user/userList?agent=${data?.to_user_name}`
                                  );
                                }}
                              >
                                {selectedLang.USERLIST}
                              </MenuItem>
                              <MenuItem
                                onClick={() => {
                                  popupState.close();
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
                    )
                    :
                    data?.transaction_type === "withdraw" && (data?.transaction_relation==="agent_agent") && (userRole ==="admin"? (role["user_id"] === data?.from_user_id):(userId === data?.from_user_id))
                    ?
                    (
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

                              <hr style={{ border: "1px solid #e2e8f0" }} />
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
                                  popupState.close();
                                  navigate(
                                    `/user/userList?agent=${data?.from_user_name}`
                                  );
                                }}
                              >
                                {selectedLang.USERLIST}
                              </MenuItem>
                              <MenuItem
                                onClick={() => {
                                  popupState.close();
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
                    )
                    :
                    data?.transaction_type === "refund" && (data?.transaction_relation==="agent_agent") && (userRole ==="admin"? (role["user_id"] === data?.to_user_id):(userId === data?.to_user_id))
                    ?
                    (
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

                              <hr style={{ border: "1px solid #e2e8f0" }} />
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
                              <hr style={{ border: "1px solid #e2e8f0" }} />
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
                              <hr style={{ border: "1px solid #e2e8f0" }} />
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
                              <hr style={{ border: "1px solid #e2e8f0" }} />
                              <MenuItem
                                onClick={() => {
                                  popupState.close();
                                  navigate(
                                    `/user/userList?agent=${data?.to_user_name}`
                                  );
                                }}
                              >
                                {selectedLang.USERLIST}
                              </MenuItem>
                              <MenuItem
                                onClick={() => {
                                  popupState.close();
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
                    )
                    :
                    data?.transaction_type === "withdraw" && (data?.transaction_relation==="admin_agent") && role["user_id"] === data?.to_user_id
                    ?
                    (
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

                              <hr style={{ border: "1px solid #e2e8f0" }} />
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
                              <hr style={{ border: "1px solid #e2e8f0" }} />
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
                              <hr style={{ border: "1px solid #e2e8f0" }} />
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
                              <hr style={{ border: "1px solid #e2e8f0" }} />
                              <MenuItem
                                onClick={() => {
                                  popupState.close();
                                  navigate(
                                    `/user/userList?agent=${data?.to_user_name}`
                                  );
                                }}
                              >
                                {selectedLang.USERLIST}
                              </MenuItem>
                              <MenuItem
                                onClick={() => {
                                  popupState.close();
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
                    )
                    :
                    data?.transaction_type === "refund" && (data?.transaction_relation==="admin_agent") && data?.from_user_id === role["user_id"]
                    ?
                    (
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

                              <hr style={{ border: "1px solid #e2e8f0" }} />
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
                                  popupState.close();
                                  navigate(
                                    `/user/userList?agent=${data?.from_user_name}`
                                  );
                                }}
                              >
                                {selectedLang.USERLIST}
                              </MenuItem>
                              <MenuItem
                                onClick={() => {
                                  popupState.close();
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
                    )
                    :
                    data?.transaction_type === "refund" && (data?.transaction_relation==="admin_agent")
                    ?
                    (
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

                              <hr style={{ border: "1px solid #e2e8f0" }} />
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
                                  popupState.close();
                                  navigate(
                                    `/user/userList?agent=${data?.from_user_name}`
                                  );
                                }}
                              >
                                {selectedLang.USERLIST}
                              </MenuItem>
                              <MenuItem
                                onClick={() => {
                                  popupState.close();
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
                    )
                    :
                    data?.transaction_type === "withdraw" && (data?.transaction_relation==="admin_agent") 
                    ?
                    (
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

                              <hr style={{ border: "1px solid #e2e8f0" }} />
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
                              <hr style={{ border: "1px solid #e2e8f0" }} />
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
                              <hr style={{ border: "1px solid #e2e8f0" }} />
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
                              <hr style={{ border: "1px solid #e2e8f0" }} />
                              <MenuItem
                                onClick={() => {
                                  popupState.close();
                                  navigate(
                                    `/user/userList?agent=${data?.to_user_name}`
                                  );
                                }}
                              >
                                {selectedLang.USERLIST}
                              </MenuItem>
                              <MenuItem
                                onClick={() => {
                                  popupState.close();
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
                    )
                    :
                    //old
                    data?.transaction_type === "refund" && (data?.transaction_relation==="agent_agent") && role["user_id"] === data?.from_user_id
                    ?
                    (
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

                              <hr style={{ border: "1px solid #e2e8f0" }} />
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
                                  popupState.close();
                                  navigate(
                                    `/user/userList?agent=${data?.from_user_name}`
                                  );
                                }}
                              >
                                {selectedLang.USERLIST}
                              </MenuItem>
                              <MenuItem
                                onClick={() => {
                                  popupState.close();
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
                    )
                    :
                    data?.transaction_type === "withdraw" && (data?.transaction_relation==="agent_agent") && role["user_id"] === data?.to_user_id
                    ?
                    (
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

                              <hr style={{ border: "1px solid #e2e8f0" }} />
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
                              <hr style={{ border: "1px solid #e2e8f0" }} />
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
                              <hr style={{ border: "1px solid #e2e8f0" }} />
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
                              <hr style={{ border: "1px solid #e2e8f0" }} />
                              <MenuItem
                                onClick={() => {
                                  popupState.close();
                                  navigate(
                                    `/user/userList?agent=${data?.to_user_name}`
                                  );
                                }}
                              >
                                {selectedLang.USERLIST}
                              </MenuItem>
                              <MenuItem
                                onClick={() => {
                                  popupState.close();
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
                    ) 
                    :  
                    data?.transaction_type === "withdraw" && (data?.transaction_relation==="agent_agent" || data?.transaction_relation==="admin_agent") 
                    ?
                    (
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

                              <hr style={{ border: "1px solid #e2e8f0" }} />
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
                                  popupState.close();
                                  navigate(
                                    `/user/userList?agent=${data?.from_user_name}`
                                  );
                                }}
                              >
                                {selectedLang.USERLIST}
                              </MenuItem>
                              <MenuItem
                                onClick={() => {
                                  popupState.close();
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
                    )
                    :
                    data?.transaction_type === "withdraw" 
                    ? 
                    (
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

                              <hr style={{ border: "1px solid #e2e8f0" }} />
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
                              <hr style={{ border: "1px solid #e2e8f0" }} />
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
                              <hr style={{ border: "1px solid #e2e8f0" }} />
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
                              <hr style={{ border: "1px solid #e2e8f0" }} />
                              <MenuItem
                                onClick={() => {
                                  popupState.close();
                                  navigate(
                                    `/user/userList?agent=${data?.to_user_name}`
                                  );
                                }}
                              >
                                {selectedLang.USERLIST}
                              </MenuItem>
                              <MenuItem
                                onClick={() => {
                                  popupState.close();
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
                    ) 
                    :
                    (
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

                              <hr style={{ border: "1px solid #e2e8f0" }} />
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
                                  popupState.close();
                                  navigate(
                                    `/user/userList?agent=${data?.from_user_name}`
                                  );
                                }}
                              >
                                {selectedLang.USERLIST}
                              </MenuItem>
                              <MenuItem
                                onClick={() => {
                                  popupState.close();
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
                    )
                    }
                  </TableCell>

                  <TableCell
                    sx={{
                      textAlign: "center",
                      fontWeight: "bold",
                      textUnderlineOffset: "5px",
                    }}
                  >
                    {
                    data?.transaction_relation === "admin_agent" && (data?.transaction_type === "withdraw") && role["user_id"] !== data?.to_user_id
                    ?
                    ""
                    :  
                    data?.transaction_type === "refund" && (data?.transaction_relation==="admin_agent") && data?.from_user_id === role["user_id"]
                    ?
                    ""
                    :  
                    data?.transaction_relation === "admin_agent" && (data?.transaction_type==="withdraw") 
                    ?
                    ""
                    :
                    data?.transaction_relation === "admin_agent" && (data?.transaction_type==="refund")
                    ?
                    ""
                    :
                    (data?.transaction_relation === "agent_agent" && (data?.transaction_type==="refund") && (userRole ==="admin"? (role["user_id"] === data?.to_user_id):(userId === data?.to_user_id)))
                    ?
                    casinoUserMenu(
                      selectedLang,
                      data?.from_user_name,
                      navigate
                    )
                    :
                    (data?.transaction_relation === "agent_agent" && (data?.transaction_type==="withdraw") && (userRole ==="admin"? (data?.from_user_id === role["user_id"]):(userId === data?.from_user_id)))
                    ?
                    casinoUserMenu(
                      selectedLang,
                      data?.to_user_name,
                      navigate
                    )
                    :
                    //old
                    data?.transaction_relation === "admin_agent" && (data?.transaction_type==="withdraw") && data?.from_user_id !== data?.parentchildCheckId
                    ?
                    casinoUserMenu(
                      selectedLang,
                      data?.to_user_name,
                      navigate
                    )
                    :
                    data?.transaction_relation === "admin_agent" && (data?.transaction_type==="refund" || data?.transaction_type==="deposit") && data?.to_user_id !== data?.parentchildCheckId
                    ?
                    casinoUserMenu(
                      selectedLang,
                      data?.from_user_name,
                      navigate
                    )
                    :
                    (data?.transaction_relation === "agent_agent" && data?.transaction_type==="withdraw" && data?.from_user_id === data?.parentchildCheckId)
                    ||
                    (data?.transaction_relation === "agent_agent" && (data?.transaction_type==="deposit" || data?.transaction_type==="refund")  && data?.to_user_id === data?.parentchildCheckId)
                    ? ""
                    :
                    data?.transaction_relation === "agent_agent" && data?.transaction_type === "withdraw"
                    ?
                    casinoUserMenu(
                      selectedLang,
                      data?.to_user_name,
                      navigate
                    )
                    :data?.transaction_relation === "agent_agent" && (data?.transaction_type === "refund" || data?.transaction_type === "deposit")
                    ?
                    casinoUserMenu(
                      selectedLang,
                      data?.from_user_name,
                      navigate
                    )
                    :
                    data?.transaction_relation !== "admin_agent" ? data?.transaction_type === "withdraw"
                      ? casinoUserMenu(
                          selectedLang,
                          data?.from_user_name,
                          navigate
                        )
                      : casinoUserMenu(
                          selectedLang,
                          data?.to_user_name,
                          navigate
                        )
                      :
                      data?.transaction_relation === "agent_agent" && data?.transaction_type==="withdraw" && data?.to_user_id === data?.parentchildCheckId 
                      ? ""
                      : data?.transaction_relation === "agent_agent" && data?.transaction_type==="deposit" && data?.from_user_id === data?.parentchildCheckId 
                      ? "" 
                      : ""
                    }
                  </TableCell>

                  <TableCell
                    sx={{
                      textAlign: "center",
                      color:
                        data?.transaction_type == "deposit"
                          ? "blue"
                          : data?.transaction_type == "withdraw"
                          ? "red"
                          : "",
                      fontWeight:"bold"
                    }}
                  >
                    {
                        data?.transaction_type === "refund" && (data?.transaction_relation==="agent_agent") && (userRole ==="admin"? (role["user_id"] === data?.to_user_id):(userId === data?.from_user_id))
                        ?
                        selectedLang.upperWithdraw
                        :
                        data?.transaction_type === "refund" && (data?.transaction_relation==="agent_agent") && (userRole ==="admin"? (role["user_id"] === data?.to_user_id):(userId === data?.to_user_id))
                        ?
                        selectedLang.fromSubAgent
                        :
                        data?.transaction_relation === "admin_casino" && (data?.transaction_type==="deposit")
                        ? (selectedLang.userWithdraw) 
                        :
                        data?.transaction_relation === "admin_casino" && (data?.transaction_type==="withdraw")
                        ? (selectedLang.userDeposit) 
                        :
                        data?.transaction_relation === "admin_agent" && (data?.transaction_type === "withdraw") && role["user_id"] !== data?.to_user_id
                        ? (selectedLang.upperDeposit) 
                        :
                        data?.transaction_relation === "admin_agent" && (data?.transaction_type === "refund") && role["user_id"] !== data?.from_user_id
                        ? (selectedLang.upperWithdraw) 
                        :
                        data?.transaction_relation === "admin_agent" && (data?.transaction_type === "withdraw")
                        ? (selectedLang.upperDeposit) 
                        :
                        data?.transaction_relation === "admin_agent" && (data?.transaction_type === "refund" || data?.transaction_type === "deposit")
                        ? (selectedLang.upperWithdraw) 
                        :
                        data?.transaction_relation === "agent_agent" && (data?.transaction_type==="refund") && role["user_id"] !== data?.to_user_id
                        ?
                         (selectedLang.upperWithdraw)
                        :
                        data?.transaction_relation === "agent_agent" && (data?.transaction_type==="withdraw") && (userRole ==="admin"? (role["user_id"] !== data?.from_user_id):(userId !== data?.from_user_id))
                        ?
                         (selectedLang.upperDeposit)
                        :
                        data?.transaction_relation === "agent_agent" && (data?.transaction_type==="withdraw") 
                        ?
                         (selectedLang.paymentToSubAgent)
                        :
                        data?.transaction_relation === "agent_casino" && (data?.transaction_type==="deposit")
                        ? (selectedLang.userWithdraw) 
                        :
                        data?.transaction_relation === "agent_casino" && (data?.transaction_type==="withdraw")
                        ? (selectedLang.userDeposit) 
                        :
                        //old
                        data?.transaction_relation === "admin_agent" && (data?.transaction_type === "withdraw") && data?.from_user_id !== data?.parentchildCheckId
                        ? (selectedLang.fromSubAgent)
                        :
                        data?.transaction_relation === "admin_agent" && (data?.transaction_type === "refund" || data?.transaction_type === "deposit") && data?.to_user_id !== data?.parentchildCheckId
                        ? (selectedLang.paymentToSubAgent) 
                        :
                        data?.transaction_relation === "admin_agent" && (data?.transaction_type === "refund" || data?.transaction_type === "deposit")
                        ? (selectedLang.upperWithdraw)
                        :
                        data?.transaction_relation === "agent_agent" && data?.transaction_type==="withdraw" && data?.from_user_id === data?.parentchildCheckId 
                        ?  (selectedLang.upperDeposit) 
                        : data?.transaction_relation === "agent_agent" && (data?.transaction_type==="deposit" || data?.transaction_type==="refund") && data?.to_user_id === data?.parentchildCheckId ?
                         (selectedLang.upperDeposit)
                        : 
                        data?.transaction_relation === "agent_agent" && data?.transaction_type==="withdraw" && data?.to_user_id !== data?.parentchildCheckId 
                        ? (selectedLang.fromSubAgent) 
                        : data?.transaction_relation === "agent_agent" && (data?.transaction_type==="deposit") && data?.from_user_id === data?.parentchildCheckId ?
                        (selectedLang.paymentToSubAgent)
                        : data?.transaction_relation === "agent_agent" && ( data?.transaction_type==="refund") && data?.from_user_id !== data?.parentchildCheckId ?
                        (selectedLang.paymentToSubAgent)
                         :
                        data?.transaction_relation === "agent_casino"
                        ? (selectLocale !== "en" ? "유저 " : "User ") + (selectedLang[`${formatSentence(data?.transaction_type)}`]?.toUpperCase() || data?.transaction_type?.toUpperCase())
                        : data?.transaction_relation === "admin_agent"
                        ? (selectLocale !== "en" ? "상부 " : "Upper ") + (selectedLang[`${formatSentence(data?.transaction_type)}`]?.toUpperCase() || data?.transaction_type?.toUpperCase())
                        : data?.transaction_relation === "admin_casino"
                        ? (selectLocale !== "en" ? "유저 " : "User ") + (selectedLang[`${formatSentence(data?.transaction_type)}`]?.toUpperCase() || data?.transaction_type?.toUpperCase())
                        :""
                    }
                  </TableCell>
                      </>

                    }

                  <TableCell
                    sx={{
                      textAlign: "center",
                    }}
                  >
                    {userRole == "admin" 
                    ? 
                    (
                      (data?.transaction_type === "refund" || data?.transaction_type === "deposit") && (data?.transaction_relation === "admin_agent" || data?.transaction_relation === "agent_agent") ?
                      <>
                        {Math.floor(
                          Math.abs(Number(data?.to_before_pot))
                        )?.toLocaleString()}
                      </>:
                      <>
                        <p className="textSize1">
                        {Math.floor(Math.abs(Number(data?.from_before_pot))).toLocaleString()}
                        </p>
                      </>
                    ) : 
                    (
                      data?.transaction_type === "refund" && (data?.transaction_relation==="agent_agent") && (userRole ==="admin"? (role["user_id"] === data?.to_user_id):(userId === data?.from_user_id))
                        ?
                        <>
                      {Math.floor(
                        Math.abs(Number(data?.from_before_pot))
                      )?.toLocaleString()}
                    </>:
                    data?.transaction_type === "withdraw" && (data?.transaction_relation==="agent_agent") && (userRole ==="admin"? (role["user_id"] === data?.to_user_id):(userId === data?.to_user_id))
                    ?
                    <>
                    {Math.floor(
                      Math.abs(Number(data?.to_before_pot))
                    )?.toLocaleString()}
                  </>
                  :
                  (data?.transaction_type === "withdraw") && data?.transaction_relation === "admin_agent" ?
                      <>
                        {Math.floor(
                          Math.abs(Number(data?.to_before_pot))
                        )?.toLocaleString()}
                      </>:
                      //old
                      (data?.transaction_type === "refund" || data?.transaction_type === "deposit") && data?.transaction_relation === "agent_agent" ?
                      <>
                        {Math.floor(
                          Math.abs(Number(data?.to_before_pot))
                        )?.toLocaleString()}
                      </>:
                      <>
                      {Math.floor(
                        Math.abs(Number(data?.from_before_pot))
                      )?.toLocaleString()}
                    </>
                    )}
                  </TableCell>

                  <TableCell
                    style={{
                      textAlign: "center",
                      fontWeight: "bold",
                    }}
                  >
                    {/* {Number(data?.before_pot) > Number(data?.after_pot || 0) */}

                    {userRole == "admin" ? 
                    (
                      <p className="textSize3">
                        {data?.transaction_relation === "admin_agent"
                        ?
                        <>
                        <p style={{color:(data?.transaction_relation === "admin_agent" && data?.transaction_type == "withdraw" )? "red" : "#35cdd9"}}>
                        {data?.transaction_type == "withdraw" ? "-" : ""}
                        {Number(data?.amount)?.toLocaleString()}{" "}
                        </p>
                        </>
                        :
                        <>
                        <p style={{color:(data?.transaction_type == "withdraw" )? "#35cdd9" : "red"}}>
                        {data?.transaction_type == "withdraw" ? "" : "-"}
                        {Number(data?.amount)?.toLocaleString()}{" "}
                        </p>
                        </>
                        }
                        
                        {/* <span className="textSize3">
                          ({data?.from_user_name.split(" ")[0]})
                        </span> */}
                      </p>
                    ) : 
                    (
                      <p className="textSize3">
                        {
                        data?.transaction_type === "refund" && (data?.transaction_relation==="agent_agent") && (userRole ==="admin"? (role["user_id"] === data?.to_user_id):(userId === data?.from_user_id))
                        ?
                        <>
                        <p style={{color:((data?.transaction_relation === "agent_agent" || data?.transaction_relation === "admin_agent") && data?.transaction_type == "refund" )? "red" : "#35cdd9"}}>
                        {data?.transaction_type == "refund" ? "-" : ""}
                        {Number(data?.amount)?.toLocaleString()}
                        </p>
                        </>
                        :
                        data?.transaction_type === "withdraw" && (data?.transaction_relation==="agent_agent") && (userRole ==="admin"? (role["user_id"] === data?.to_user_id):(userId === data?.to_user_id))
                        ?
                        <>
                        <p style={{color:((data?.transaction_relation === "agent_agent" || data?.transaction_relation === "admin_agent") && data?.transaction_type == "withdraw" )? "#35cdd9" : "red"}}>
                        {data?.transaction_type == "withdraw" ? "" : "-"}
                        {Number(data?.amount)?.toLocaleString()}
                        </p>
                        </>
                        :
                        data?.transaction_relation === "agent_agent"
                        ?
                        <>
                        <p style={{color:((data?.transaction_relation === "agent_agent" || data?.transaction_relation === "admin_agent") && data?.transaction_type == "withdraw" )? "red" : "#35cdd9"}}>
                        {data?.transaction_type == "withdraw" ? "-" : ""}
                        {Number(data?.amount)?.toLocaleString()}
                        </p>
                        </>
                        :
                        <>
                        <p style={{color:(data?.transaction_type == "withdraw" )? "#35cdd9" : "red"}}>
                        {data?.transaction_type == "withdraw" ? "" : "-"}
                        {Number(data?.amount)?.toLocaleString()}
                        </p>
                        </>
                        }
                        
                      </p>
                    )}
                  </TableCell>
                  
                  <TableCell
                    sx={{
                      textAlign: "center",
                      fontWeight:"bold"
                    }}
                  >
                    {userRole === "admin" ? 
                    (
                      (data?.transaction_type === "refund" || data?.transaction_type === "deposit") && (data?.transaction_relation === "admin_agent" || data?.transaction_relation === "agent_agent" )?
                      <div >
                       {Math.floor(
                          Math.abs(Number(data?.to_after_pot))
                        )?.toLocaleString()}
                      </div>:
                      <>
                        <p>
                          {Math.floor(data?.from_after_pot || 0)?.toLocaleString()}{" "}
                        </p>
                      </>
                    ) : 
                    (
                      data?.transaction_type === "refund" && (data?.transaction_relation==="agent_agent") && (userRole ==="admin"? (role["user_id"] === data?.to_user_id):(userId === data?.from_user_id))
                      ?
                      <>
                    {Math.floor(
                      Math.abs(Number(data?.from_after_pot))
                    )?.toLocaleString()}
                  </>:
                  data?.transaction_type === "withdraw" && (data?.transaction_relation==="agent_agent") && (userRole ==="admin"? (role["user_id"] === data?.to_user_id):(userId === data?.to_user_id))
                  ?
                  <>
                  {Math.floor(
                    Math.abs(Number(data?.to_after_pot))
                  )?.toLocaleString()}
                </>
                : 
                      (data?.transaction_type === "withdraw") && data?.transaction_relation === "admin_agent" ?
                      <>
                        {Math.floor(
                          Math.abs(Number(data?.to_after_pot))
                        )?.toLocaleString()}
                      </>:
                      //old
                      (data?.transaction_type === "refund" || data?.transaction_type === "deposit") && data?.transaction_relation === "agent_agent" ?
                      <>
                        {Math.floor(
                          Math.abs(Number(data?.to_after_pot))
                        )?.toLocaleString()}
                      </>:
                      <>{Math.floor(data?.from_after_pot || 0)?.toLocaleString()} </>
                    )}
                  </TableCell>
                  <TableCell
                    sx={{
                      textAlign: "center",
                      fontWeight:"bold"
                    }}
                  >
                    <p style={{color:data?.status===true ? "#35cdd9" : "red"}}>
                    {data?.status===true?"true":"false"}
                    </p>
                  </TableCell>
                  <TableCell
                    sx={{
                      textAlign: "center",
                      fontSize:"2px"
                    }}
                  >
                    <p className="roundHead">
                    {(data?.transaction_id)}
                    <span style={{marginLeft:'2px'}} onClick={() => handleRoundClick(data?.transaction_id)}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-12 h-12"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 0 0-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 0 1-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H9.75"
                        />
                      </svg>
                    </span>
                    {showRoundTooltip && (
                      <Tooltip title="Copied!" placement="right" />
                    )}
                    </p>
                  </TableCell>
                  <TableCell
                    sx={{
                      textAlign: "center",
                    }}
                  >
                    {formatLocalDateTime(data?.created_at)}
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
            <TransactionHistoryHeader
              selectedLang={selectedLang}
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
                    <DatePicker onDataFilter={onDataFilter} />
                    
                  </div>
                </div>
                <div>
                <FormControl>
                  <Autocomplete
                    onChange={addDynamicSearch}
                    onInputChange={(event, newValue) => {
                      // event.preventDefault();
                      setSelectedAgent(newValue);
                    }}
                    sx={{
                      ml: 0,
                      flex: 1,
                      borderRadius: "4px",
                      padding: "6px 0px",
                      marginRight: "10px",
                      width: "240px",
                    }}
                    value={selectedAgent || null}
                    className=""
                    variant="outlined"
                    disablePortal
                    size="small"
                    id="combo-box-demo"
                    options={agentName.map((a) => a.id)}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        className="textSearch"
                        label={selectedLang.agent_id}
                      />
                    )}
                  />
                </FormControl>
                </div>
                <div className="col-lg-2 col-md-4 col-sm-4 flex item-center searchall">
                  <div className="col-lg-8 col-md-4 col-sm-4 flex item-center">
                    {/* <Autocomplete
                      onChange={handleChangeAdminType}
                      value={
                        searchType == ""
                          ? selectedLang.all
                          : searchType == "1"
                          ? selectedLang.agent
                          : selectedLang.USER
                      }
                      sx={{
                        width: "150px",
                      }}
                      className="autocomplete allselect"
                      variant="outlined"
                      disablePortal
                      size="small"
                      id="combo-box-demo"
                      options={[
                        { label: `${selectedLang.all}`, value: "" },
                        { label: `${selectedLang.agent}`, value: "1" },
                        { label: `${selectedLang.USER}`, value: "0" },
                      ]}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          className="textSearch"
                          label={selectedLang.type}
                        />
                      )}
                    /> */}
                    <InputBase
                      sx={{
                        ml: 1,
                        flex: 1,
                        border: "1px solid #cdcfd3",
                        borderRadius: "4px",
                        padding: "4px 10px",
                        marginRight: "0px",
                      }}
                      placeholder={selectedLang.targetAgentUser}
                      value={agent_search}
                      onChange={(e) => setAgent(e.target.value)}
                      inputProps={{ "aria-label": selectedLang.agent }}
                    />
                  </div>
                  <Button
                    className="flex item-center"
                    variant="contained"
                    color="secondary"
                    onClick={() => {
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
                              {!loading3 && addAdminRequest()}
                            </Table>

                            {!adminrequest.length > 0 && !loading3 && (
                              <div
                                style={{
                                  textAlign: "center",
                                  color: "#fff",
                                  padding: "1rem",
                                }}
                              >
                                {selectedLang.no_data_available_in_table}
                              </div>
                            )}
                            {loading3 && <FuseLoading />}
                          </TableContainer>
                        </TabPanel>
                      </TabContext>
                    </>
                    {value == 3 && (
                      <TablePagination
                        rowsPerPageOptions={[20, 50, 100, 200, 500]}
                        component="div"
                        count={
                          adminrequestTableCount ? adminrequestTableCount : 0
                        }
                        rowsPerPage={rowsPerPage}
                        page={page3}
                        onPageChange={handleChangePage3}
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

export default TransactionHistoryApp;
