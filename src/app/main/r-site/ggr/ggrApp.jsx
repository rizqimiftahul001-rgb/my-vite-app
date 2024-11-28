/** @format */

import * as React from "react";
import FusePageSimple from "@fuse/core/FusePageSimple";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { locale } from "../../../configs/navigation-i18n";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { Autocomplete, CardActionArea, CardActions, Menu } from "@mui/material";
import { CardHeader } from "@mui/material";
// import "./agentList.css";
import "./ggr.css";
import Chip from "@mui/material/Chip";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import { hideMessage } from "app/store/fuse/messageSlice";
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
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import GGRHeader from "./ggrHeader";

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

function GGRApp() {
  const user_id = DataHandler.getFromSession("user_id");
  const [agentFilterValue, setAgentName] = useState("");

  const [requested_user_id, setrequested_user_id] = useState("");
  const [requested_name, setrequested_name] = useState("");
  const [requested_API, setrequested_API] = useState("");
  const [requested_amount, setrequested_amount] = useState(0);
  const [withdraw_amount, setwithdraw_amount] = useState(0);
  const [checked, setChecked] = React.useState(true);
  const [agentList, setAgentList] = useState("");
  const [providerGGR, setProviderGGR] = useState("");
  const [type, setType] = useState("");
  const [currency, setCurrency] = useState("");
  const [curresntdata, setCurrentData] = useState(new Date());
  const [parentId, setParentId] = useState(null);

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
      loading2 == false
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

  // const handleChange = (event) => {
  //   setAge(event.target.value);
  // };

  const [value, setValue] = React.useState("1");

  const handleChange2 = (event, newValue) => {
    setValue(newValue);
  };

  var date = new Date();
  var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
  var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);

  const dispatch = useDispatch();

  const [monthFirstDay, setMonthFirstDay] = useState(firstDay);
  const [monthLastDay, setMonthLastDay] = useState(lastDay);
  const [month, setMonth] = useState("");
  const [userDetails, setUserDetails] = useState("");
  const [tableDataLoader, setTableDataLoader] = useState(true);
  const [loading, setLoading] = useState(false);
  const [startDate, setStartDate] = useState(threeDaysAgo);
  const [endDate, setEndDate] = useState(todayDate);
  const [amountSum, setAmountSum] = useState(0);
  const [getInvest, setGetInvest] = useState(null);
  const [investDetails, setInvestDetails] = useState(null);

  const defaultForm = {
    agent: "",
    backoffice_pw: "",
    backoffice_url: "",
    backoffice_user: "",
    created_at: "",
    opcode: "",
    secret_key: "",
    updated_at: "",
  };

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
  const role = jwtDecode(DataHandler.getFromSession("accessToken"))["data"];

  const [agentList_table_count, _agentList_table_count] = useState(0);
  const [myType, setMyType] = useState();

  const [nickname, setNickname] = useState("");

  const [adminType, setAdminType] = useState("");
  const handleChangeAdminType = (event, newValue) => {
    // const newValue = event.target.value;
    setAdminType(newValue?.value || "");
  };

  const [sortBy, setSortBy] = useState("userHolding"); 
  const [sortOrder, setSortOrder] = useState("desc");
  const [sortOrder_hAmount, setSortOrder_hAmount] = useState("");
  const [sortOrder_payment, setSortOrder_payment] = useState("desc");


  const getAgentList = () => {
    setLoading2(true);
    setTableDataLoader(true);

    APIService({
      url: `${process.env.REACT_APP_R_SITE_API
        }/user/get-invest-account?agent=${agentFilterValue}&nickname=${nickname}&pageNumber=${page + 1
        }&limitData=${rowsPerPage}&sortBy=${sortBy}&orderBy=${sortOrder}`,
      method: "GET",
    })
      .then((res) => {
        setAgentList(res.data.data.paginatedUsers);
      })
      .catch((err) => {
        setAgentList([]);
        console.error("Error:", err);
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

  useEffect(()=>{
    getAgentList()
  },[sortBy,sortOrder])

  useEffect(() => {
    getAgentList();
    getProviderGGR();
  }, [page, rowsPerPage]);


  const getProviderGGR = () => {
    setLoading1(true);
    APIService({
      url: `${process.env.REACT_APP_R_SITE_API
        }/user/provider-ggr`,
      method: "GET",
    })
      .then((res) => {
        setProviderGGR(res.data.data);
      })
      .catch((err) => {
        setProviderGGR([]);
        console.error("Error:", err);
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

  const searchHistory = async () => {
    setPage(0);
    setTableDataLoader(true);
    // if ((role["role"] == "admin" || role["role"] == "cs")) {
    if (agentFilterValue.length > 0) {
      getAgentList(true);
    } else {
      getAgentList(false);
    }

  };

  const columns = [
    { id: "step", label: `${selectedLang.number}`, minWidth: 20 },
    { id: "aagent", label: `${selectedLang.affiliate_agent_ggr}`, minWidth: 50 },
    { id: "aagentbalance", label: `${selectedLang.affiliate_agent_balance_ggr}`, minWidth: 50 },
    { id: "nickName", label: `${selectedLang.agentNickname}`, minWidth: 50 },
  ];
  if (role["role"] === "admin") {
    columns.splice(4, 0, { id: "agentBalance", label: `${selectedLang.agentBalance}`, minWidth: 50 },
      //   { id: "userBalance", label: `${selectedLang.userBalance}`, minWidth: 50 }
    )
  }




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

  const [myHolding, setMyHolding] = useState();

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

  const showNotification = (type, message) => {
    dispatch(showMessage({ variant: type, message }));

    setTimeout(() => {
      dispatch(hideMessage());
    }, 3000);
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

  const getSortIconhAmount = (order) => {
    return order === "asc" ? (
      <FontAwesomeIcon icon={faSortUp} className="sort-icon" />
    ) : order === "desc" ? (
      <FontAwesomeIcon icon={faSortDown} className="sort-icon" />
    ) : (
      <FontAwesomeIcon icon={faSort} className="sort-icon" />
    );
  };

  const getSortIconPayment = (order) => {
    return order === "asc" ? (
      <FontAwesomeIcon icon={faSortUp} className="sort-icon" />
    ) : order === "desc" ? (
      <FontAwesomeIcon icon={faSortDown} className="sort-icon" />
    ) : (
      <FontAwesomeIcon icon={faSort} className="sort-icon" />
    );
  };


  const handleSort = (column) => {
    if (column == "aagentbalance") {
      setSortBy("investAgentBalance");
      setSortOrder_hAmount(
        sortOrder === "asc" ? "desc" : sortOrder === "desc" ? "" : "asc"
      );
      setSortOrder_payment("");
      setSortOrder(
        sortOrder === "asc" ? "desc" : sortOrder === "desc" ? "" : "asc"
      );
    }else if (column === "agentBalance") {
      setSortBy("userHolding");
      setSortOrder_payment(
        sortOrder === "asc" ? "desc" : sortOrder === "desc" ? "" : "asc"
      );
      setSortOrder_hAmount("")
      setSortOrder(
        sortOrder === "asc" ? "desc" : sortOrder === "desc" ? "" : "asc"
      );
    }
  };

  const [openCallback, setOpenCallback] = useState(false);


  useEffect(() => {
    if (getInvest) {
      setInvestDetails(getInvest);
    } else {
      setInvestDetails(defaultForm);
    }
  }, [getInvest, openCallback]);


  const handleCloseCallback = () => {
    setOpenCallback(false);
  };

  const [currCallbackUser, _currCallbackUser] = useState("");
  const [changeBalancecallbackURL, _changeBalancecallbackURL] = useState("");
  const [balancecallbackURL, _balancecallbackURL] = useState("");
  const handleOpenCallback = (data) => {
    setInvestDetails(defaultForm);
    const rowData = agentList
      ? agentList.filter((items) => items.user_id === data.user_id)
      : [];


    setParentId(rowData[0].user_id);

    const investDetails =
      rowData[0].investDetails.length > 0 ? rowData[0].investDetails[0] : {};


    setGetInvest(investDetails);

    _currCallbackUser(data?.user_id);
    _balancecallbackURL(data?.balancecallbackURL);
    _changeBalancecallbackURL(data?.changeBalancecallbackURL);
    setOpenCallback(true);
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
          {""}
        </TableCell>

        <TableCell
          sx={{
            textAlign: "center",
          }}
        >
          {amountSum?.toLocaleString()}
        </TableCell>


      </StyledTableRow>
    );
  };

  // useEffect(() => {
  //   if (openCallback) {
  //     // console.log("Modal Opened. InvestDetails:", investDetails);
  //   }
  // }, [openCallback, investDetails]);



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

  const initCopyAgentList = Array.isArray(agentList) ? [...agentList] : [];

  const sortedAndMappedDataAgentList =
    sortOrder !== ""
      ? initCopyAgentList.sort((a, b) => {
        if (sortBy === "aagentbalance12") {
          return sortOrder === "asc"
            ? a.affilated_agent_balance - b?.affilated_agent_balance
            : b.affilated_agent_balance - a.affilated_agent_balance;
        }else if(sortBy === "agentBalance12"){
          return sortOrder === "asc"
            ? a?.investDetails[0] === undefined ? 0 :a?.investDetails[0].agent_balance - b?.investDetails[0] === undefined ? 0 :b?.investDetails[0].agent_balance
            : b?.investDetails[0] === undefined ? 0 :b?.investDetails[0].agent_balance - a?.investDetails[0] === undefined ? 0 :a?.investDetails[0].agent_balance;
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
                              // textDecoration: "underline",
                              cursor: "pointer",
                            }}
                            {...bindTrigger(popupState)}
                          >{data?.investDetails.length === 0 ? "-" : data?.investDetails[0]?.backoffice_user}</span>
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

                  {
                    role["role"] === "admin" 
                    ? 
                    <>
                    {/* <TableCell
                    sx={{
                      textAlign: "center",
                    }}
                    >
                      <p style={{fontWeight:'bolder'}}> {data?.affilated_agent_balance ? Number(data?.affilated_agent_balance).toLocaleString('en-US')+"  Pots" : "-"} </p>
                    </TableCell> */}
                    <TableCell
                          sx={{
                            textAlign: "center",
                            fontWeight:"bold"
                          }}
                        >
                          {data?.investAgentBalance ? Number(data?.investAgentBalance).toLocaleString('en-US')+" Pots" :"-"}
                        </TableCell>
                    </> 
                    : 
                    <></>
                  }

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
                  {
                    role["role"] === "admin"
                      ?
                      <>
                        <TableCell
                          sx={{
                            textAlign: "center",
                            fontWeight:"bold"
                          }}
                        >
                          {data?.userHolding ? data?.userHolding.toLocaleString('en-US')+" Pots": "-"}
                        </TableCell>
                      </>
                      :
                      <></>
                  }
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
          header={<GGRHeader selectedLang={selectedLang} />}
          content={
            <Card
              sx={{ width: "100%", marginTop: "20px", borderRadius: "4px" }}
              className="main_card"
            >
              <div
                className="betcards"
                style={{
                  marginBottom: "10px",
                  fontSize: "12px",
                  fontWeight: 600,
                  color: "#Fff",
                  display: "flex",
                }}
              >
                <div className="dashboard_card">
                  <div className="dashboard_two_icons">
                    <div class="d_icon">
                      <svg width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M0 7.24264C0 4.56993 3.23143 3.23143 5.12132 5.12132L44.8787 44.8787C46.7686 46.7686 45.4301 50 42.7574 50H3C1.34315 50 0 48.6569 0 47V7.24264Z" fill="#313578" />
                        <path d="M31.8081 27.6221C35.9834 27.6221 39.3682 24.2373 39.3682 20.062C39.3682 15.8867 35.9834 12.502 31.8081 12.502C27.6328 12.502 24.248 15.8867 24.248 20.062C24.248 24.2373 27.6328 27.6221 31.8081 27.6221Z" fill="#D6BCF2" />
                        <path fillRule="evenodd" clipRule="evenodd" d="M27.7699 20.3167H27.0873C26.8099 20.3167 26.5851 20.0925 26.5851 19.8157C26.5851 19.5389 26.8093 19.3147 27.0873 19.3147H27.6102C27.6046 19.2308 27.6046 19.1462 27.6046 19.0604C27.6046 18.9753 27.6046 18.8907 27.6102 18.8068H27.0873C26.8099 18.8068 26.5851 18.5826 26.5851 18.3058C26.5851 18.029 26.8093 17.8048 27.0873 17.8048H27.7699C28.2277 16.1346 29.5691 14.9216 31.1466 14.9216C32.2689 14.9216 33.2972 15.519 33.9735 16.5611C34.0095 16.6163 34.0343 16.678 34.0463 16.7428C34.0584 16.8075 34.0575 16.874 34.0438 16.9384C34.0301 17.0029 34.0037 17.0639 33.9663 17.1182C33.9289 17.1724 33.8811 17.2187 33.8257 17.2543C33.5953 17.4046 33.2853 17.3389 33.1344 17.1065C32.6471 16.3551 31.9232 15.9236 31.146 15.9236C30.1065 15.9236 29.2109 16.6989 28.8183 17.8048H31.3646C31.642 17.8048 31.8668 18.029 31.8668 18.3058C31.8668 18.5826 31.6426 18.8068 31.3646 18.8068H28.6141C28.6085 18.8907 28.6053 18.9753 28.6053 19.0604C28.6053 19.1462 28.6085 19.2308 28.6141 19.3147H31.3646C31.642 19.3147 31.8668 19.5389 31.8668 19.8157C31.8668 20.0925 31.6426 20.3167 31.3646 20.3167H28.8183C29.2109 21.4227 30.1065 22.1979 31.146 22.1979C31.9232 22.1979 32.6465 21.7671 33.1344 21.0156C33.2822 20.7833 33.5921 20.7175 33.8257 20.8678C34.0593 21.0187 34.1238 21.3287 33.9735 21.5611C33.2972 22.6025 32.2689 23.2006 31.1466 23.2006C29.5691 23.1999 28.2277 21.9869 27.7699 20.3167ZM30.8066 13.7962C27.9058 13.7962 25.5424 16.1578 25.5424 19.0604C25.5424 21.9631 27.9058 24.3253 30.8066 24.3253C33.7105 24.3253 36.074 21.9637 36.074 19.0604C36.074 16.1578 33.7105 13.7962 30.8066 13.7962ZM30.8066 25.3273C34.2629 25.3273 37.0753 22.5161 37.0753 19.0604C37.0753 15.6048 34.2629 12.7942 30.8066 12.7942C27.3535 12.7942 24.541 15.6054 24.541 19.0604C24.541 22.5167 27.3535 25.3273 30.8066 25.3273ZM30.8066 12.0014C26.9163 12.0014 23.7494 15.1683 23.7494 19.0604C23.7494 22.9532 26.9163 26.1195 30.8066 26.1195C34.7 26.1195 37.8669 22.9532 37.8669 19.0604C37.8669 15.1683 34.7006 12.0014 30.8066 12.0014ZM30.8066 27.1221C35.2523 27.1221 38.8683 23.5056 38.8683 19.0611C38.8683 14.6166 35.2523 11 30.8066 11C26.3634 11 22.748 14.616 22.748 19.0611C22.748 23.5056 26.364 27.1221 30.8066 27.1221ZM38.6529 33.5193L24.8572 37.216C23.9147 37.4684 22.9935 37.3444 22.036 36.8378L17.5514 34.4624C16.1186 33.7028 14.7364 33.6051 13.1495 34.1662V25.8076L16.3309 24.4925C17.2615 24.1086 18.2008 24.1055 19.1314 24.4825L26.833 28.9696C27.3059 29.2451 27.6453 29.6916 27.7875 30.2271C27.9265 30.7619 27.8526 31.3174 27.5777 31.7902C27.0046 32.7728 25.7402 33.1059 24.7564 32.5336L20.6263 30.1275C20.3871 29.9879 20.0796 30.0686 19.9412 30.3079C19.8022 30.5471 19.8823 30.854 20.1215 30.993L24.2542 33.3997C24.7389 33.6815 25.2674 33.8155 25.7903 33.8155C26.7566 33.8155 27.696 33.3589 28.2834 32.5361L37.7129 30.0104C38.1794 29.8851 38.6673 29.9509 39.0894 30.1939C39.5089 30.4375 39.8102 30.8283 39.9373 31.2942C40.1947 32.2624 39.6192 33.2606 38.6529 33.5193ZM12.1369 35.7456H10.0101C10.007 35.7456 10.0014 35.7399 10.0014 35.7362V24.227C10.0014 24.2232 10.007 24.2176 10.0101 24.2176H12.1369C12.14 24.2176 12.1456 24.2226 12.1456 24.227V35.7356C12.1456 35.7399 12.14 35.7456 12.1369 35.7456ZM40.9036 31.0362C40.7113 30.311 40.2448 29.7042 39.5891 29.3272C38.9366 28.9495 38.1769 28.8487 37.4536 29.0428L28.7982 31.3618C28.8896 30.9084 28.8778 30.435 28.7538 29.9722C28.5471 29.1781 28.0417 28.5149 27.3384 28.1047L19.6049 23.5995C19.5874 23.5882 19.5667 23.5782 19.546 23.5694C18.3524 23.0741 17.1412 23.0734 15.9507 23.5663L13.1501 24.7236V24.227C13.1501 23.6696 12.6955 23.2156 12.1369 23.2156H10.0101C9.45153 23.2156 9 23.6696 9 24.227V35.7356C9 36.2929 9.45215 36.747 10.0101 36.747H12.1369C12.6955 36.747 13.1501 36.2929 13.1501 35.7356V35.2377C14.6181 34.6352 15.8061 34.6709 17.0817 35.3473L21.5663 37.7226C22.3547 38.1391 23.1263 38.3464 23.9091 38.3464C24.308 38.3464 24.7094 38.2919 25.1171 38.1829L38.9128 34.4868C40.4132 34.0854 41.3057 32.5367 40.9036 31.0362Z" fill="#9D85DF" />
                      </svg>
                    </div>
                  </div>
                  <div className="dashboard_inner">
                    <div className="">
                      <div className="dashboard_icon">
                        <p>{providerGGR.length > 0 ? Number(providerGGR.find(data => data.provider_id == "10").ggr).toLocaleString() : 0}
                          <span>{selectedLang.Honor_Link}</span>
                        </p>
                      </div>
                      <h3>{selectedLang.TOTAL_GGR_BALANCE}</h3>
                    </div>
                  </div>
                </div>
                <div className="dashboard_card">
                  <div className="dashboard_two_icons">
                    <div class="d_icon">
                      <svg width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M0 7.24264C0 4.56993 3.23143 3.23143 5.12132 5.12132L44.8787 44.8787C46.7686 46.7686 45.4301 50 42.7574 50H3C1.34315 50 0 48.6569 0 47V7.24264Z" fill="#313578" />
                        <path d="M31.8081 27.6221C35.9834 27.6221 39.3682 24.2373 39.3682 20.062C39.3682 15.8867 35.9834 12.502 31.8081 12.502C27.6328 12.502 24.248 15.8867 24.248 20.062C24.248 24.2373 27.6328 27.6221 31.8081 27.6221Z" fill="#D6BCF2" />
                        <path fillRule="evenodd" clipRule="evenodd" d="M27.7699 20.3167H27.0873C26.8099 20.3167 26.5851 20.0925 26.5851 19.8157C26.5851 19.5389 26.8093 19.3147 27.0873 19.3147H27.6102C27.6046 19.2308 27.6046 19.1462 27.6046 19.0604C27.6046 18.9753 27.6046 18.8907 27.6102 18.8068H27.0873C26.8099 18.8068 26.5851 18.5826 26.5851 18.3058C26.5851 18.029 26.8093 17.8048 27.0873 17.8048H27.7699C28.2277 16.1346 29.5691 14.9216 31.1466 14.9216C32.2689 14.9216 33.2972 15.519 33.9735 16.5611C34.0095 16.6163 34.0343 16.678 34.0463 16.7428C34.0584 16.8075 34.0575 16.874 34.0438 16.9384C34.0301 17.0029 34.0037 17.0639 33.9663 17.1182C33.9289 17.1724 33.8811 17.2187 33.8257 17.2543C33.5953 17.4046 33.2853 17.3389 33.1344 17.1065C32.6471 16.3551 31.9232 15.9236 31.146 15.9236C30.1065 15.9236 29.2109 16.6989 28.8183 17.8048H31.3646C31.642 17.8048 31.8668 18.029 31.8668 18.3058C31.8668 18.5826 31.6426 18.8068 31.3646 18.8068H28.6141C28.6085 18.8907 28.6053 18.9753 28.6053 19.0604C28.6053 19.1462 28.6085 19.2308 28.6141 19.3147H31.3646C31.642 19.3147 31.8668 19.5389 31.8668 19.8157C31.8668 20.0925 31.6426 20.3167 31.3646 20.3167H28.8183C29.2109 21.4227 30.1065 22.1979 31.146 22.1979C31.9232 22.1979 32.6465 21.7671 33.1344 21.0156C33.2822 20.7833 33.5921 20.7175 33.8257 20.8678C34.0593 21.0187 34.1238 21.3287 33.9735 21.5611C33.2972 22.6025 32.2689 23.2006 31.1466 23.2006C29.5691 23.1999 28.2277 21.9869 27.7699 20.3167ZM30.8066 13.7962C27.9058 13.7962 25.5424 16.1578 25.5424 19.0604C25.5424 21.9631 27.9058 24.3253 30.8066 24.3253C33.7105 24.3253 36.074 21.9637 36.074 19.0604C36.074 16.1578 33.7105 13.7962 30.8066 13.7962ZM30.8066 25.3273C34.2629 25.3273 37.0753 22.5161 37.0753 19.0604C37.0753 15.6048 34.2629 12.7942 30.8066 12.7942C27.3535 12.7942 24.541 15.6054 24.541 19.0604C24.541 22.5167 27.3535 25.3273 30.8066 25.3273ZM30.8066 12.0014C26.9163 12.0014 23.7494 15.1683 23.7494 19.0604C23.7494 22.9532 26.9163 26.1195 30.8066 26.1195C34.7 26.1195 37.8669 22.9532 37.8669 19.0604C37.8669 15.1683 34.7006 12.0014 30.8066 12.0014ZM30.8066 27.1221C35.2523 27.1221 38.8683 23.5056 38.8683 19.0611C38.8683 14.6166 35.2523 11 30.8066 11C26.3634 11 22.748 14.616 22.748 19.0611C22.748 23.5056 26.364 27.1221 30.8066 27.1221ZM38.6529 33.5193L24.8572 37.216C23.9147 37.4684 22.9935 37.3444 22.036 36.8378L17.5514 34.4624C16.1186 33.7028 14.7364 33.6051 13.1495 34.1662V25.8076L16.3309 24.4925C17.2615 24.1086 18.2008 24.1055 19.1314 24.4825L26.833 28.9696C27.3059 29.2451 27.6453 29.6916 27.7875 30.2271C27.9265 30.7619 27.8526 31.3174 27.5777 31.7902C27.0046 32.7728 25.7402 33.1059 24.7564 32.5336L20.6263 30.1275C20.3871 29.9879 20.0796 30.0686 19.9412 30.3079C19.8022 30.5471 19.8823 30.854 20.1215 30.993L24.2542 33.3997C24.7389 33.6815 25.2674 33.8155 25.7903 33.8155C26.7566 33.8155 27.696 33.3589 28.2834 32.5361L37.7129 30.0104C38.1794 29.8851 38.6673 29.9509 39.0894 30.1939C39.5089 30.4375 39.8102 30.8283 39.9373 31.2942C40.1947 32.2624 39.6192 33.2606 38.6529 33.5193ZM12.1369 35.7456H10.0101C10.007 35.7456 10.0014 35.7399 10.0014 35.7362V24.227C10.0014 24.2232 10.007 24.2176 10.0101 24.2176H12.1369C12.14 24.2176 12.1456 24.2226 12.1456 24.227V35.7356C12.1456 35.7399 12.14 35.7456 12.1369 35.7456ZM40.9036 31.0362C40.7113 30.311 40.2448 29.7042 39.5891 29.3272C38.9366 28.9495 38.1769 28.8487 37.4536 29.0428L28.7982 31.3618C28.8896 30.9084 28.8778 30.435 28.7538 29.9722C28.5471 29.1781 28.0417 28.5149 27.3384 28.1047L19.6049 23.5995C19.5874 23.5882 19.5667 23.5782 19.546 23.5694C18.3524 23.0741 17.1412 23.0734 15.9507 23.5663L13.1501 24.7236V24.227C13.1501 23.6696 12.6955 23.2156 12.1369 23.2156H10.0101C9.45153 23.2156 9 23.6696 9 24.227V35.7356C9 36.2929 9.45215 36.747 10.0101 36.747H12.1369C12.6955 36.747 13.1501 36.2929 13.1501 35.7356V35.2377C14.6181 34.6352 15.8061 34.6709 17.0817 35.3473L21.5663 37.7226C22.3547 38.1391 23.1263 38.3464 23.9091 38.3464C24.308 38.3464 24.7094 38.2919 25.1171 38.1829L38.9128 34.4868C40.4132 34.0854 41.3057 32.5367 40.9036 31.0362Z" fill="#9D85DF" />
                      </svg>
                    </div>
                  </div>
                  <div className="dashboard_inner">
                    <div className="">
                      <div className="dashboard_icon">
                        <p>
                          {providerGGR.length > 0 ? Number(providerGGR.find(data => data.provider_id == "15").ggr).toLocaleString() : 0}
                          <span>{selectedLang.Common_Invest}</span>
                        </p>
                      </div>
                      <h3>{selectedLang.TOTAL_GGR_BALANCE}</h3>
                    </div>
                  </div>
                </div>

              </div>
              <div className="flex justify-start justify-items-center bg-gray p-10 list_title w-100">
                <span className="list-title">
                  {selectedLang.agent_distribution_statistics}{" "}
                  {/* {month} {curresntdata.getFullYear()}{" "}{userDetails.id} */}
                </span>
              </div>

              <Typography className="tracking-tight leading-8 sub_main_title">

                {selectedLang.Invest_Agent_GGR_Balance}
              </Typography>

              <div className="flex flex-wrap">
                <div
                  className="flex threebox agentblock"
                  style={{
                    alignItems: "center",
                    gap: "10px",
                    flexWrap: "wrap",
                  }}
                >
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
                                    column.id == "aagentbalance"||
                                    column.id == "agentBalance"
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
                                  {
                                    column.id == "aagentbalance"
                                    ? getSortIconhAmount(sortOrder_hAmount)
                                    : column.id == "agentBalance"
                                    ? getSortIconPayment(sortOrder_payment)
                                    :""
                                  }
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
              </div>
            </Card>
          }
        />
      )}
    </>
  );
}

export default GGRApp;
