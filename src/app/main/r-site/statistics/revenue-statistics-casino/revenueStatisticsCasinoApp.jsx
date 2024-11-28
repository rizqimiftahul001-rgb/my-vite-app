/** @format */

import React from "react";
import FusePageSimple from "@fuse/core/FusePageSimple";
import RevenueStatisticsCasinoHeader from "./revenueStatisticsCasinoHeader";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { locale } from "../../../../configs/navigation-i18n";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { Button, CardActionArea, CardActions } from "@mui/material";
import "./revenueStatisticsCasino.css";
import Chip from "@mui/material/Chip";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TextField from "@mui/material/TextField";
// import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import TableRow from "@mui/material/TableRow";
import { styled } from "@mui/material/styles";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import { selectUser } from "app/store/userSlice";
import Select from "@mui/material/Select";
import InputBase from "@mui/material/InputBase";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import DataHandler from "src/app/handlers/DataHandler";
import jwtDecode from "jwt-decode";
import APIService from "src/app/services/APIService";
import FuseLoading from "@fuse/core/FuseLoading/FuseLoading";
// import "react-datepicker/dist/react-datepicker.css";
import SearchIcon from "@mui/icons-material/Search";
import "flatpickr/dist/themes/material_green.css";
import "flatpickr/dist/flatpickr.css";
import Flatpickr from "react-flatpickr";
import queryString from "query-string";
import { useNavigate } from "react-router-dom";
import { casinoUserMenu } from "src/app/services/Utility";
import PopupState, { bindTrigger, bindMenu } from "material-ui-popup-state";
import { Menu } from "@mui/material";
import addTableData from "./tableData";
import sortData from "./functions/extraFunctions";
import { useLocation } from "react-router-dom";
import agentListApp from "../../agent/agent-lits/agentListApp";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSort } from "@fortawesome/free-solid-svg-icons";
import { faSortUp } from "@fortawesome/free-solid-svg-icons";
import { faSortDown } from "@fortawesome/free-solid-svg-icons";
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

const todayDate = new Date();
todayDate.setDate(todayDate.getDate());
todayDate.setHours(23, 59, 59, 999);

const threeDaysAgo = new Date(todayDate);
threeDaysAgo.setDate(todayDate.getDate());
threeDaysAgo.setHours(0, 0, 0, 0);

const nextMonthFirstDay = new Date(todayDate);
nextMonthFirstDay.setMonth(nextMonthFirstDay.getMonth(), 1);

nextMonthFirstDay.setDate(0);
nextMonthFirstDay.setHours(23, 59, 59);

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

function revenueStatisticsCasinoApp() {
  const location = useLocation();
  const user = useSelector(selectUser);
  const user_id = DataHandler.getFromSession("user_id");
  const role = jwtDecode(DataHandler.getFromSession("accessToken"))["data"];
  const [casinoUsers, setCasinoUsers] = useState([]);
  const [tablecount, setTableCount] = useState(0);
  const [monthFirstDay, setMonthFirstDay] = useState(firstDay);
  const [monthLastDay, setMonthLastDay] = useState(nextMonthFirstDay);
  const [curresntdata, setCurrentData] = useState(new Date());
  const [month, setMonth] = useState("");
  const [total, setTotal] = useState({
    bet_total: 0,
    win_total: 0,
    profit: 0,
    no_of_bet: 0,
    no_of_win: 0,
  });
  const [selectedprovider] = useSelector((state) => [
    state.provider.selectedprovider,
  ]);
  const [selectLocale] = useSelector((state) => [state.locale.selectLocale]);
  const [selectedLang, setSelectedLang] = useState(locale.ko);
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

  const currentDate = new Date();
  const currentMonth = currentDate.toLocaleString("default", { month: "long" });
  const previousMonthDate = new Date(currentDate);
  previousMonthDate.setMonth(currentDate.getMonth() - 1);
  const previousMonthName = previousMonthDate.toLocaleString("default", {
    month: "long",
  });

  const { search } = window.location;
  const { agent } = queryString.parse(search);

  const [filterUser, _filterUser] = useState(agent || "");

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const [age, setAge] = React.useState("");
  const [userDetails, setUserDetails] = useState();

  const handleChange = (event) => {
    setAge(event.target.value);
  };

  const columns = [
    { id: "number", label: `${selectedLang.number}`, minWidth: 20 },
    { id: "casino", label: `${selectedLang.casino_users}`, minWidth: 50 },
    { id: "agent", label: `${selectedLang.agent_name}`, minWidth: 50 },
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
    _filterUser(agent);
  }, [location]);

  useEffect(() => {
    if (filterUser) {
      getAgentName(firstDay, lastDay);
    }
  }, [location, firstDay, lastDay]);

  useEffect(() => {
    const user_id = DataHandler.getFromSession("user_id");
    getUserDetails(user_id);
    getAgentName(firstDay, lastDay);
  }, [selectedprovider, page, rowsPerPage]);

  const getUserDetails = (user_id) => {
    APIService({
      url: `${process.env.REACT_APP_R_SITE_API}/user/details?user_id=${user_id}`,
      method: "GET",
    })
      .then((data) => {
        // console.log(data)
        setUserDetails(data.data.data[0]);
        // props.setUserData(data.data.data[0]);
      })
      .catch((e) => {})
      .finally(() => {
        setLoading1(false);
      });
  };

  const [loading, setLoading] = useState(false);

  const getAgentName = (firstDay, lastDay) => {
    // setPage(0);
    setLoading(true);
    APIService({
      url: `${
        process.env.REACT_APP_R_SITE_API
      }/revenue/casino-user-revenue?user_id=${user_id}&provider_id=${selectedprovider}&start_date=${startDate}&end_date=${endDate}&filterUser=${filterUser}&sort=${sortOrder_profit_loss}&limit=${rowsPerPage}&pageNumber=${
        page + 1
      }`,
      method: "GET",
    })
      .then((res) => {
        // console.log(res);
        setMonth(res.data.month);
        setTotal(res.data.total);

        setCasinoUsers(res.data.data);
        setTableCount(res.data.table_count);
      })
      .catch((err) => {
        setCasinoUsers([]);
      })
      .finally(() => {
        setLoading(false);
        setLoading1(false);
      });
  };

  var date = new Date();
  var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
  var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  lastDay.setHours(23, 59, 59, 999);

  const getThisMonthData = (e) => {
    setCasinoUsers([]);
    e.preventDefault();
    var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    var currentDay = new Date(
      date.getFullYear(),
      date.getMonth() + 1,
      date.getDate()
    );
    setMonthFirstDay(firstDay);
    setMonthLastDay(currentDay);
    getAgentName(firstDay, lastDay);
  };

  const getLastMonthData = (e) => {
    setCasinoUsers([]);
    e.preventDefault();
    const date = new Date();
    var firstDay = new Date(date.getFullYear(), date.getMonth() - 1, 1);
    var lastDay = new Date(date.getFullYear(), date.getMonth(), 0);
    lastDay.setHours(23, 59, 59, 999);

    setMonthFirstDay(firstDay);
    setMonthLastDay(lastDay);

    getAgentName(firstDay, lastDay);
  };

  const [startDate, setStartDate] = useState(threeDaysAgo);
  const [endDate, setEndDate] = useState(todayDate);

  const onDataFilter = (startDate, endDate) => {
    // console.log(startDate, endDate);
    setEndDate(endDate);
    setStartDate(startDate);
  };

  // useEffect(() => {
  //   const _sumArray = {};
  //   const _casinoUsers = casinoUsers;
  //   // const _casinoUsers = casinoUsers.slice(
  //   // 	page * rowsPerPage,
  //   // 	page * rowsPerPage + rowsPerPage
  //   // );
  //   // Loop through each object in the array
  //   _casinoUsers.forEach((obj) => {
  //     // Loop through each field in the object
  //     for (const field in obj) {
  //       const fieldValue = parseFloat(obj[field]);
  //       // If the field doesn't exist in the sumArray, initialize it with the current value
  //       if (!_sumArray[field]) {
  //         _sumArray[field] = fieldValue;
  //       } else {
  //         // If the field already exists in the sumArray, add the current value to it
  //         _sumArray[field] += fieldValue;
  //       }
  //     }
  //   });
  //   setSumArray(_sumArray);
  // }, [casinoUsers]);
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
          {Number(total?.bet_total || 0)?.toLocaleString()}
        </TableCell>
        <TableCell
          sx={{
            textAlign: "center",
          }}
        >
          {Number(total?.refund_total_sum || 0)?.toLocaleString()}
        </TableCell>
        <TableCell
          sx={{
            textAlign: "center",
          }}
        >
          {Number(total?.cancel_total_sum || 0)?.toLocaleString()}
        </TableCell>
        <TableCell
          sx={{
            textAlign: "center",
          }}
        >
          {Number(total?.win_total || 0)?.toLocaleString()}
        </TableCell>
        
        <TableCell
          style={{
            textAlign: "center",
            fontWeight: "bold",
          }}
        >
          {Number(total?.profit || 0)?.toLocaleString()}
        </TableCell>
        <TableCell
          sx={{
            textAlign: "center",
          }}
        >
          {Number(total?.no_of_bet || 0)?.toLocaleString()}
        </TableCell>
        <TableCell
          sx={{
            textAlign: "center",
          }}
        >
          {Number(total?.no_of_win || 0)?.toLocaleString()}
        </TableCell>
      </StyledTableRow>
    );
  };

  const getSortIcon = (order) => {
    return order === "asc" ? (
      <FontAwesomeIcon icon={faSortUp} className="sort-icon" />
    ) : order === "desc" ? (
      <FontAwesomeIcon icon={faSortDown} className="sort-icon" />
    ) : (
      <FontAwesomeIcon icon={faSort} className="sort-icon" />
    );
  };

  const [sortOrder_profit_loss, setSortOrder_profit_loss] = useState("");

  const [sortBy, setSortBy] = useState("profit_loss"); // Default sorting column
  const [sortOrder, setSortOrder] = useState("desc"); // Default sorting order

  const [sortColoumns, setSortColoumns] = useState({
    bet_money: "",
    winning: "",
    profit_loss: "desc",
    casino_user: "",
    no_bet: "",
    no_win: "",
    agent_name: "",
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

  const initCopystatCasinoUser = [...casinoUsers];

  const sortedAndMappedCasinoUser =
    sortOrder !== ""
      ? sortData(initCopystatCasinoUser, sortBy, sortOrder)
      : initCopystatCasinoUser;

  useEffect(() => {
    const handlePopstate = () => {
      // Reload the page when the user navigates back
      window.location.reload(true);
    };

    // Add the event listener when the component mounts
    window.addEventListener("popstate", handlePopstate);

    // Remove the event listener when the component unmounts
    return () => {
      window.removeEventListener("popstate", handlePopstate);
    };
  }, []);

  return (
    <>
      {" "}
      {loaded ? (
        <FuseLoading />
      ) : (
        <FusePageSimple
          header={<RevenueStatisticsCasinoHeader selectedLang={selectedLang} />}
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

              <div className="flex" style={{ flexWrap: "wrap", gap: "10px" }}>
                <div
                  className="flex item-center"
                  style={{ gap: "5px", flexWrap: "wrap" }}
                >
                  {/* <DatePicker
													className='datetimePiker'
													placeholder={'Start Date'}
													size='small'
													value={startDate}
													inputFormat='yyyy/MM/dd'
													onChange={(date) => setStartDate(date)}
													renderInput={(params) => <TextField {...params} />}
												/> */}
                  {/* <Flatpickr
                    data-enable-time
                    value={startDate}
                    onChange={(date) => setStartDate(date)}
                    options={{
                      dateFormat: "Y/m/d",
                      locale: selectedLang.calander,
                    }}
                  /> */}
                  {/* <div className="px-5 text-white"> </div> */}
                  {/* <DatePicker
													className='datetimePiker'
													placeholder={'Start Date'}
													size='small'
													value={endDate}
													inputFormat='yyyy/MM/dd'
													onChange={(date) => setEndDate(date)}
													renderInput={(params) => <TextField {...params} />}
												/> */}
                  {/* <Flatpickr
                    data-enable-time
                    value={endDate}
                    onChange={(date) => setEndDate(date)}
                    options={{
                      dateFormat: "Y/m/d",
                      locale: selectedLang.calander,
                    }}
                  /> */}

                  <DatePicker onDataFilter={onDataFilter} />
                </div>
                <InputBase
                  sx={{
                    flex: 1,
                    border: "1px solid #cdcfd3",
                    borderRadius: "4px",
                    padding: "4px 10px",
                  }}
                  value={filterUser}
                  onChange={(e) => _filterUser(e.target.value)}
                  placeholder={selectedLang.casino_users + " ID"}
                  inputProps={{
                    "aria-label": `${selectedLang.USER}`,
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
                  onClick={getAgentName}
                >
                  {selectedLang.search}
                </Button>
              </div>
              {/* <div className="row flex justify-end justify-items-center flex-wrap">
              <div className="col-lg-2 col-md-4 col-sm-4 p-10 flex item-center">
                <DatePicker
                  showIcon
                  selected={startDate}
                  onChange={(date) => setStartDate(date)}
                  showTimeSelect
                  timeFormat="HH:mm"
                  timeIntervals={15}
                  timeCaption="time"
                  dateFormat="MMMM d, yyyy h:mm aa"
                  className="text-center right-margin"
                  placeholderText={selectedLang.period_start_date_time}
                />
                <div className="px-5"> - </div>

                <DatePicker
                  showIcon
                  selected={endDate}
                  onChange={(date) => setEndDate(date)}
                  placeholderText={selectedLang.period_end_date_time}
                  showTimeSelect
                  timeFormat="HH:mm"
                  timeIntervals={15}
                  timeCaption="time"
                  dateFormat="MMMM d, yyyy h:mm aa"
                  className="text-center "
                />
              </div>
              <div className="col-lg-2 col-md-4 col-sm-4 p-16 flex item-center">
                <Button
                  className="flex item-center"
                  variant="contained"
                  color="secondary"
                  // onClick={getpaymentRequest}
                  endIcon={<SearchIcon size={20}></SearchIcon>}
                  sx={{
                    borderRadius: "4px",
                  }}>
                  {selectedLang.search}
                </Button>
              </div>
            </div> */}

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
                              {column.id !== "number"
                                ? getSortIcon(sortColoumns?.[column.id])
                                : ""}
                            </StyledTableCell>
                          ))}
                        </TableRow>
                      </TableHead>
                      {addTableData({
                        casinoUsers: casinoUsers,
                        loading: loading,
                        sortedAndMappedCasinoUser: sortedAndMappedCasinoUser,
                        createSumRow: createSumRow,
                        page: page,
                        rowsPerPage: rowsPerPage,
                        selectedLang: selectedLang,
                        navigate: navigate,
                      })}
                    </Table>
                    {!casinoUsers.length > 0 && !loading && (
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
                    {loading && <FuseLoading />}
                  </TableContainer>
                  <TablePagination
                    rowsPerPageOptions={[1, 20, 50, 100, 200, 500]}
                    component="div"
                    count={null}
                    rowsPerPage={null}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    labelRowsPerPage={selectedLang.rows_per_page}
                  />
                </Paper>
              </CardContent>
              {/* <div className="flex justify-center items-center mt-3 mb-5">
                {month != previousMonthName && (
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
                )}
                {month != currentMonth && (
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
                )}
              </div> */}
            </Card>
          }
        />
      )}
    </>
  );
}

export default revenueStatisticsCasinoApp;
