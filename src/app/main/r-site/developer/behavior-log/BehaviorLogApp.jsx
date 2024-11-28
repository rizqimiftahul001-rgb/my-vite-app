/** @format */
import React, { useEffect, useState } from "react";
import Flatpickr from "react-flatpickr";
import FusePageSimple from "@fuse/core/FusePageSimple";
import { useDispatch, useSelector } from "react-redux";
import { locale } from "../../../../configs/navigation-i18n";
import { Button, InputBase, FormControl } from "@mui/material";
import jwtDecode from "jwt-decode";
import { MenuItem, Select, InputLabel } from "@mui/material";
import CloseIcon from "@material-ui/icons/Close";
import SearchIcon from "@mui/icons-material/Search";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import APIService from "src/app/services/APIService";
import DataHandler from "src/app/handlers/DataHandler";
import FuseLoading from "@fuse/core/FuseLoading/FuseLoading";
import { styled } from "@mui/material/styles";
import queryString from "query-string";
import { showMessage } from "app/store/fuse/messageSlice";
import { formatLocalDateTime } from "src/app/services/Utility";
import "./behaviorlog.css";
import BehaviorLogHeader from "./BehaviorLogHeader";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import DatePicker from "src/app/main/apps/calendar/DatePicker";
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 800,
  bgcolor: "background.paper",
  border: "2px solid #eaecf4",
  boxShadow: 24,
  borderRadius: 4,
  p: 2,
};
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
const todayEndDate = new Date();
todayEndDate.setDate(todayEndDate.getDate());
todayEndDate.setHours(23, 59, 59, 999);
const todayStartDay = new Date(todayEndDate);
todayStartDay.setDate(todayEndDate.getDate());
todayStartDay.setHours(0, 0, 0, 0);
function BehaviorLogApp() {
  const dispatch = useDispatch();
  const [selectLocale] = useSelector((state) => [state.locale.selectLocale]);
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
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Reset to the first page when changing rows per page
  };
  const [loggers, setLoggers] = useState([]);
  const [agent_List, setAgentList] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [startDate, setStartDate] = useState(todayStartDay);
  const [endDate, setEndDate] = useState(todayEndDate);
  const role = jwtDecode(DataHandler.getFromSession("accessToken"))["data"];
  const { search } = window.location;
  const { agent_id } = queryString.parse(search);
  const [selectedOption, setSelectedOption] = React.useState("");
  const [loaded, setLoaded] = useState(false);
  const [loading1, setLoading1] = useState(false);
  const [selectedType, setSelectedType] = useState("");
  const [selectedSubType, setSelectedSubType] = useState("");
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  let logInPersonName = localStorage.getItem("login_person")
  const getLoggers = () => {
    setLoading1(true);
    APIService({
      url: `${process.env.REACT_APP_R_SITE_API}/get-types-subtypes`,
      method: "GET",
    })
      .then((res) => {
        setLoggers(res); // Update the state with the received data
      })
      .catch((err) => {
        dispatch(
          showMessage({
            variant: "error",
            message: err.message,
          })
        );
      })
      .finally(() => {
        setLoading1(false);
      });
  };
  const getAgentList = () => {
    setLoading1(true);
    APIService({
      url: `${
        process.env.REACT_APP_R_SITE_API
      }/getting-logs?start_date=${startDate}&end_date=${endDate}&types=${selectedType}&sub_types=${selectedSubType}&&page_number=${
        page + 1
      }&rows_per_page=${rowsPerPage}&agent_name=admin`,
      method: "GET",
    })
      .then((res) => {
        setAgentList(res?.data);
        setTotalCount(res?.totalCount);
      })
      .catch((err) => {
        dispatch(
          showMessage({
            variant: "error",
            message: err.message,
          })
        );
      })
      .finally(() => {
        setLoading1(false);
      });
  };
  useEffect(() => {
    getAgentList();
    getLoggers();
  }, [page, rowsPerPage]);

  
  const onDataFilter = (startDate, endDate) => {
    
    // console.log(startDate, endDate);
    setEndDate(endDate)
    setStartDate(startDate)
 
  };

  const columns = [
    {
      id: "unique_request_id",
      label: `${selectedLang.number}`,
      minWidth: 50,
    },
    { id: "agent_name", label: `${selectedLang.agent_name}`, minWidth: 50 },
    { id: "login_person", label: `${selectedLang.login_person}`, minWidth: 50 },
    { id: "type", label: `${selectedLang.type}`, minWidth: 50 },
    { id: "sub_type", label: `${selectedLang.sub_type}`, minWidth: 50 },
    { id: "allow_ip", label: `${selectedLang.allow_ip}`, minWidth: 50 },
    // { id: "error_msg", label: `${selectedLang.Error_Message}`, minWidth: 50 },
    // { id: "info", label: `${selectedLang.info}`, minWidth: 50 },
    { id: "timestamp", label: `${selectedLang.Timestamp}`, minWidth: 50 },
  ];
  function dateFormat(date) {
    var d = new Date(date);
    var date = d.getDate();
    var month = d.getMonth() + 1; // Since getMonth() returns month from 0-11 not 1-12
    var year = d.getFullYear();
    var newDate = year + "-" + month + "-" + date;
    return newDate;
  }
  const searchHistory = async () => {
    const sDate = new Date(startDate);
    const eDate = new Date(endDate);
    // Calculate the difference in days
    const timeDifference = (eDate - sDate) / (1000 * 60 * 60 * 24);
    // if (Math.abs(timeDifference) > 1) {
    //
    // }
    if (role["role"] === "admin" || role["role"] === "user") {
      setPage(0);
      getAgentList();
      // getLoggers();
      // if (agentName.length > 0) {
      //   setBetData1([]);
      //   getLoggers();
      // } else {
      //   setBetData1([]);
      //   getBetHistory(false);
      // }
    } else {
      // Display an alert or any other desired user feedback
      {
        setPage(0);
        getAgentList();
      }
      dispatch(
        showMessage({
          variant: "error",
          message: selectedLang.date_should_not_more_than_one_day,
        })
      );
    }
  };
  const renderPaymentWithdrawal = () => {
    if (agent_List.length <= 0) {
      return;
    } else {
      return (
        <TableBody>
          {agent_List
            //.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            .map((payment, index) => {
              return (
                <>
                  <StyledTableRow
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
                      {payment.agent_name}
                    </TableCell>
                    <TableCell
                      sx={{
                        textAlign: "center",
                      }}
                    >
                      {logInPersonName}
                    </TableCell>
                    <TableCell
                      sx={{
                        textAlign: "center",
                      }}
                    >
                      {payment.types}
                    </TableCell>
                    <TableCell
                      sx={{
                        textAlign: "center",
                      }}
                    >
                      {payment.sub_types}
                    </TableCell>
                    <TableCell
                      sx={{
                        textAlign: "center",
                      }}
                    >
                      {payment?.allowedIPs?.join(", ") || ""}
                    </TableCell>
                    {/* <TableCell
                                            sx={{
                                                textAlign: "center",
                                            }}
                                        >
                                            {formatLocalDateTime(payment.updated_at)}
                                        </TableCell> */}
                    <TableCell
                      sx={{
                        textAlign: "center",
                      }}
                    >
                      {formatLocalDateTime(payment.created_at)}{" "}
                      {/* {formatLocalDateTime(payment.updated_at)} */}
                    </TableCell>
                  </StyledTableRow>
                </>
              );
            })}
        </TableBody>
      );
    }
  };

  const handleTypeChange = (event) => {
    const value = event.target.value;
    setSelectedType(value);
    setSelectedSubType(''); 
  };

  const handleSubTypeChange = (event) => {
    setSelectedSubType(event.target.value);
  };

  const handleRemoveType = (e) => {
    e.stopPropagation();
    setSelectedType('');
    setSelectedSubType(''); 
  };

  const handleRemoveSubType = (e) => {
    e.stopPropagation();
    setSelectedSubType(''); 
  };

  return (
    <>
      {loaded ? (
        <FuseLoading />
      ) : (
        <FusePageSimple
          header={<BehaviorLogHeader selectedLang={selectedLang} />}
          content={
            <Card
              sx={{ width: "100%", marginTop: "20px", borderRadius: "4px" }}
              className="main_card"
            >
              <div
                className="flex blockpaddings"
                style={{ flexWrap: "wrap", gap: "10px" }}
              >
                <div
                  className="flex"
                  style={{
                    gap: "5px",
                    alignItems: "center",
                    justifyContent: "center",
                    flexWrap: "wrap",
                  }}
                >
                  {/* <Flatpickr
                    options={{
                      dateFormat: "Y/m/d",
                      locale: selectedLang.calander,
                    }}
                    data-enable-time
                    value={startDate}
                    onChange={(date) => setStartDate(date[0])}
                  />
                  <div className="mx-2 text-white"> - </div>
                  <Flatpickr
                    options={{
                      dateFormat: "Y/m/d",
                      locale: selectedLang.calander,
                    }}
                    data-enable-time
                    value={endDate}
                    onChange={(date) => setEndDate(date[0])}
                  /> */}
                   <DatePicker onDataFilter={onDataFilter} />
                </div>
                <FormControl size="small" className="small_screenwidth">
                <InputLabel id="demo-simple-select-label">
                  {selectedLang.type}
                </InputLabel>
                <Select
                  style={{ width: "220px" }}
                  id="types"
                  label={selectedLang.type}
                  value={selectedType}
                  onChange={handleTypeChange}
                  renderValue={(value) => (
                    <div>
                      {value}
                      {value && (
                        <CloseIcon
                          onMouseDown={handleRemoveType}
                          style={{ marginLeft: "8px", cursor: "pointer" }}
                        />
                      )}
                    </div>
                  )}
                >
                  {loggers.map((logger, index) => (
                    <MenuItem key={index} value={logger.types}>
                      {logger.types}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl size="small" className="small_screenwidth" disabled={!selectedType}>
                <InputLabel id="demo-simple-select-label">
                  {!selectedType ? selectedLang.selection_rule_msg : selectedLang.sub_type}
                </InputLabel>
                <Select
                  style={{ width: "220px" }}
                  id="subTypes"
                  value={selectedSubType}
                  onChange={handleSubTypeChange}
                  renderValue={(value) => (
                    <div>
                      {value}
                      {value && (
                        <CloseIcon
                          onMouseDown={handleRemoveSubType}
                          style={{ marginLeft: "8px", cursor: "pointer" }}
                        />
                      )}
                    </div>
                  )}
                >
                  {loggers
                    .find((logger) => logger.types === selectedType)
                    ?.sub_types.map((subType, index) => (
                      <MenuItem key={index} value={subType}>
                        {subType}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
                {/* drop down list  end ///////////////// */}
                {/* </div> */}
                <Button
                  className=""
                  variant="contained"
                  color="secondary"
                  endIcon={<SearchIcon size={20}></SearchIcon>}
                  sx={{
                    borderRadius: "4px",
                  }}
                  // onClick={() => {
                  //     // setPage(0), searchData();
                  //     // getSubAgentData();
                  // }}
                  onClick={searchHistory}
                >
                  {selectedLang.search}
                </Button>
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
                    <Table stickyHeader aria-label="customized table">
                      <TableHead>
                        <TableRow>
                          {columns.map((column, index) => (
                            <StyledTableCell
                              sx={{
                                textAlign: "center",
                              }}
                              key={index}
                              align={column.align}
                              style={{ minWidth: column.minWidth }}
                            >
                              {column.label}
                            </StyledTableCell>
                          ))}
                        </TableRow>
                      </TableHead>
                      {!loading1 && renderPaymentWithdrawal()}
                    </Table>
                    {loading1 && <FuseLoading />}
                    {!agent_List.length > 0 && !loading1 && (
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
                    rowsPerPageOptions={[20, 50, 100, 200, 500]} // Set the available options for rows per page
                    component="div"
                    count={totalCount ? totalCount : 0}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    labelRowsPerPage={selectedLang.rows_per_page}
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
export default BehaviorLogApp;
