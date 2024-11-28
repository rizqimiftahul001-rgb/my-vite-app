/** @format */

import React, { useEffect, useState } from "react";
import "flatpickr/dist/themes/material_green.css";
import Flatpickr from "react-flatpickr";
import FusePageSimple from "@fuse/core/FusePageSimple";
import ApiErrorLogHeader from "./apiErrorLogHeader";
import { useDispatch, useSelector } from "react-redux";
import { locale } from "../../../../configs/navigation-i18n";
import { Button, InputBase, Tooltip } from "@mui/material";
import jwtDecode from "jwt-decode";
import SearchIcon from "@mui/icons-material/Search";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Unstable_Grid2";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import TableRow from "@mui/material/TableRow";
import Box from "@mui/material/Box";
import APIService from "src/app/services/APIService";
import DataHandler from "src/app/handlers/DataHandler";
import FuseLoading from "@fuse/core/FuseLoading/FuseLoading";
import { styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import queryString from "query-string";
import { showMessage } from "app/store/fuse/messageSlice";
import { formatLocalDateTime } from "src/app/services/Utility";
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

let roleName = localStorage.getItem("role");

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
// todayEndDate.setDate(todayEndDate.getDate());
todayEndDate.setHours(23, 59, 59, 999);

const todayStartDay = new Date(todayEndDate);
// todayStartDay.setDate(todayEndDate.getDate());
todayStartDay.setHours(0, 0, 0, 0);

function apiErrorLogApp() {
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
  const [rowsPerPage, setRowsPerPage] = React.useState(100);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const [loggers, setLoggers] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [round_id, setRoundId] = useState("");
  const [transaction_id, setTransactionId] = useState("");
  const [agent_name, setAgent_name] = useState("");

  const [startDate, setStartDate] = useState(todayStartDay);
  const [endDate, setEndDate] = useState(todayEndDate);
  const role = jwtDecode(DataHandler.getFromSession("accessToken"))["data"];

  const { search } = window.location;
  const { agent_id } = queryString.parse(search);

  const [loaded, setLoaded] = useState(false);
  const [loading1, setLoading1] = useState(true);
  // useEffect(() => {
  //   if (loading1 == false) {
  //     setLoaded(false);
  //   }
  // }, [loading1]);

  const getLoggers = () => {
    setLoading1(true);
    setLoggers([]);
    APIService({
      url: `${
        process.env.REACT_APP_R_SITE_API
      }/game/get-eupriover_callbackapi_log?agent_name=${agent_name}&req_agent_data=${agent_id}&startDate=${startDate}&endDate=${endDate}&page_number=${
        page + 1
      }&rows_per_page=${rowsPerPage}&round_id=${round_id}&transaction_id=${transaction_id}`,
      method: "GET",
    })
      .then((res) => {
        setLoggers(res?.data.data);
        setTotalCount(res?.data.totalCount);
        setLoading1(false);
      })
      .catch((err) => {
        dispatch(
          showMessage({
            variant: "error",
            message: err.message,
          })
        );
        setLoading1(false);
      })
      .finally(() => {
        setLoading1(false);
      });
  };

  useEffect(() => {
    getLoggers();
    setLoggers([]);
  }, [page, rowsPerPage]);

  const columns = [
    {
      id: "unique_request_id",
      label: `${selectedLang.number}`,
      minWidth: 50,
    },
    { id: "agent_name", label: `${selectedLang.agent_name}`, minWidth: 50 },
    { id: "casino_id", label: `${selectedLang.casino_id}`, minWidth: 50 },
    { id: "error_id", label: `${selectedLang.Error_ID}`, minWidth: 50 },
    { id: "error_msg", label: `${selectedLang.Error_Message}`, minWidth: 50 },
    { id: "round_id", label: `${selectedLang.round_id}`, minWidth: 50 },
    {
      id: "transaction_id",
      label: `${selectedLang.transaction_id}`,
      minWidth: 50,
    },
    // { id: 'data', label: `${selectedLang.request_data}`, minWidth: 50 },
    { id: "info", label: `${selectedLang.info}`, minWidth: 50 },
    { id: "timestamp", label: `${selectedLang.Timestamp}`, minWidth: 50 },
  ];

  const [open, setOpen] = React.useState(false);
  const [error, setError] = React.useState();
  const handleOpen = (data) => {
    setError(data);
    setOpen(true);
  };
  const handleClose = () => setOpen(false);

  const clearFilterRecallAPi = () => {
    _error_unique_code("");
    setAgent_name("");
    getLoggers("");
  };

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
    // const timeDifference = (eDate - sDate) / (1000 * 60 * 60 * 24);
    const sEpoch = sDate.getTime();
    const eEpoch = eDate.getTime();
    if (eEpoch < sEpoch) {
      dispatch(
        showMessage({
          variant: "error",
          message: "End Date should be greater than start Date",
        })
      );
    } else {
      if (
        role["role"] === "admin" ||
        role["role"] === "user" ||
        role["role"] === "cs"
      ) {
        setPage(0);
        getLoggers();
        // if (agentName.length > 0) {
        //   setBetData1([]);
        //   getLoggers();
        // } else {
        //   setBetData1([]);
        //   getBetHistory(false);
        // }
      } else {
        // Display an alert or any other desired user feedback
        dispatch(
          showMessage({
            variant: "error",
            message: "Sorry you are not allowed!!",
          })
        );
      }
    }
    // if (role["role"] === "admin" || role["role"] === "user") {
    //
    //   setPage(0);
    //   getLoggers();
    //   // if (agentName.length > 0) {
    //   //   setBetData1([]);
    //   //   getLoggers();
    //   // } else {
    //   //   setBetData1([]);
    //   //   getBetHistory(false);
    //   // }
    // } else {
    //   // Display an alert or any other desired user feedback
    //   dispatch(
    //     showMessage({
    //       variant: "error",
    //       message: selectedLang.date_should_not_more_than_one_day,
    //     })
    //   );
    // }
  };


  const handleJSONCopyClick = (json_link) => {
    if (json_link) {
      const tempValue = document.createElement("textarea");
      tempValue.value = json_link;
      document.body.appendChild(tempValue);
      tempValue.select();
      document.execCommand("copy");
      document.body.removeChild(tempValue);

      dispatch(
        showMessage({
          variant: "success",
          message: `${selectedLang.copied}`,
        })
      );
    }
  };

  const renderPaymentWithdrawal = () => {
    if (loggers.length <= 0) {
      return;
    } else {
      return (
        <TableBody>
          {loggers
            //.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            .map((payment, index) => {
              return (
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
                  {/* <TableCell
                      sx={{
                        textAlign: "center",
                      }}>
                      {payment.unique_request_id}
                    </TableCell> */}
                  <TableCell
                    sx={{
                      textAlign: "center",
                    }}
                  >
                    {payment.id}
                  </TableCell>
                  <TableCell
                    sx={{
                      textAlign: "center",
                    }}
                  >
                    {payment.casino_user_id}
                  </TableCell>
                  <TableCell
                    sx={{
                      textAlign: "center",
                    }}
                  >
                    {payment.error_code}
                  </TableCell>
                  <TableCell
                    sx={{
                      textAlign: "center",
                    }}
                  >
                    {payment.message}
                  </TableCell>
                  <TableCell
                    sx={{
                      textAlign: "center",
                    }}
                  >
                    {payment?.data?.round_id}
                  </TableCell>
                  <TableCell
                    sx={{
                      textAlign: "center",
                    }}
                  >
                    {payment?.data?.transaction_id}
                  </TableCell>
                  {/* <TableCell
											sx={{
												textAlign: 'center',
											}}>
											{JSON.stringify(payment.data, null, 2)}
										</TableCell> */}
                  <TableCell style={{ textAlign: "center" }}>
                    <button
                      type="button"
                      style={{ opacity: 0.7 }}
                      onClick={() => handleOpen(payment)}
                    >
                      <svg
                        width="25px"
                        height="25px"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z"
                        />
                      </svg>
                    </button>
                  </TableCell>
                  <TableCell
                    sx={{
                      textAlign: "center",
                    }}
                  >
                    {formatLocalDateTime(payment.created_at)}
                  </TableCell>
                </StyledTableRow>
              );
            })}
        </TableBody>
      );
    }
  };

  const onDataFilter = (startDate, endDate) => {
    // console.log(startDate, endDate);
    setEndDate(endDate);
    setStartDate(startDate);
  };

  return (
    <>
      {" "}
      {loaded ? (
        <FuseLoading />
      ) : (
        <FusePageSimple
          header={<ApiErrorLogHeader selectedLang={selectedLang} />}
          content={
            <>
              <Card
                sx={{ width: "100%", marginTop: "20px", borderRadius: "4px" }}
                className="main_card "
              >
                <div className="flex" style={{ gap: "10px", flexWrap: "wrap" }}>
                  <InputBase
                    sx={{
                      flex: 1,
                      border: "1px solid #ededed",
                      borderRadius: "4px",
                    }}
                    placeholder={selectedLang.agent_name}
                    // value={agentFilterValue}
                    onChange={(e) => {
                      setAgent_name(e.target.value);
                    }}
                    //value={agent_name}
                    inputProps={{ "aria-label": "Agent Name" }}
                  />
                  {/* <InputBase
                        className="inputwifth"
                        sx={{
                          ml: 1,
                          flex: 1,
                          border: "1px solid #ededed",
                          borderRadius: "4px",
                          marginLeft: "0",
                          marginRight: "10px",
                          padding: "4px",
                        }}
                        placeholder={selectedLang.round_id}
                        // value={agentFilterValue}
                        onChange={(e) => setRoundId(e.target.value)}
                        //value={round_id}
                        inputProps={{ "aria-label": "Agent Name" }}
                      /> */}
                  <InputBase
                    className="inputwifth"
                    sx={{
                      ml: 1,
                      flex: 1,
                      border: "1px solid #ededed",
                      borderRadius: "4px",
                      marginLeft: "0",
                      marginRight: "10px",
                      padding: "4px",
                    }}
                    placeholder={selectedLang.Round_id}
                    // value={agentFilterValue}
                    onChange={(e) => setTransactionId(e.target.value)}
                    //value={round_id}
                    inputProps={{ "aria-label": "Agent Name" }}
                  />
                  <InputBase
                    className="inputwifth"
                    sx={{
                      ml: 1,
                      flex: 1,
                      border: "1px solid #ededed",
                      borderRadius: "4px",
                      marginLeft: "0",
                      marginRight: "10px",
                      padding: "4px",
                    }}
                    placeholder={selectedLang.casino_id}
                    // value={agentFilterValue}
                    onChange={(e) => setCasinoUserID(e.target.value)}
                    //value={round_id}
                    inputProps={{ "aria-label": "Agent Name" }}
                  />

                  <div
                    className="flex"
                    style={{
                      gap: "5px",
                      flexWrap: "wrap",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {/* <Flatpickr
                      options={{
                        locale: selectedLang.calander,
                        time_24hr: true,
                      }}
                      data-enable-time
                      value={startDate}
                      onChange={(date) => setStartDate(date)}
                    />
                    <div className="text-white"> - </div>
                    <Flatpickr
                      options={{
                        locale: selectedLang.calander,
                        time_24hr: true,
                      }}
                      data-enable-time
                      value={endDate}
                      onChange={(date) => setEndDate(date)}
                    /> */}
                    <DatePicker onDataFilter={onDataFilter} />
                  </div>
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
                                }}
                                key={column.id}
                                align={column.align}
                                style={{ minWidth: column.minWidth }}
                              >
                                {column.label}
                              </StyledTableCell>
                            ))}
                          </TableRow>
                        </TableHead>
                        {renderPaymentWithdrawal()}
                      </Table>

                      {loading1 && <FuseLoading />}
                      {!loggers.length > 0 && !loading1 && (
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
                      count={totalCount ? totalCount : 0}
                      rowsPerPage={rowsPerPage}
                      page={page}
                      onPageChange={handleChangePage}
                      onRowsPerPageChange={handleChangeRowsPerPage}
                      labelRowsPerPage={selectedLang.rows_per_page}
                    />
                    {/* <TablePagination
														rowsPerPageOptions={[1, 10, 25, 100]}
														component='div'
														count={agentList_table_count}
														rowsPerPage={rowsPerPage}
														page={page}
														labelRowsPerPage={selectedLang.rows_per_page}
														onPageChange={handleChangePage}
														onRowsPerPageChange={handleChangeRowsPerPage}
													/> */}
                  </Paper>
                </CardContent>
              </Card>

              <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
              >
                <Box sx={style} className="Mymodal">
                  <IconButton
                    aria-label="close"
                    onClick={handleClose}
                    sx={{
                      position: "absolute",
                      right: 0,
                      top: 0,
                      color: "white",
                      zIndex: 1,
                    }}
                  >
                    <CloseIcon />
                  </IconButton>
                  <Typography
                    id="modal-modal-title"
                    variant="h6"
                    component="h2"
                    style={{
                      fontWeight: "700",
                      fontSize: "23px",
                      marginBottom: "20px",
                    }}
                  >
                    API Error Log
                  </Typography>
                  {/* <p className="infotext">{selectedLang.status_desc}</p> */}
                  <TableContainer>
                    <Table aria-label="customized table">
                      <TableBody>
                        <StyledTableRow>
                          <StyledTableCell align="right">
                            <p style={{ color: "white" }}>
                              <b>Agent</b>
                            </p>
                          </StyledTableCell>
                          <StyledTableCell align="center">
                            {error?.id}
                          </StyledTableCell>
                        </StyledTableRow>
                        {error?.user_id && (
                          <StyledTableRow>
                            <StyledTableCell align="right">
                              <p style={{ color: "white" }}>
                                <b>Casino User</b>
                              </p>
                            </StyledTableCell>
                            <StyledTableCell align="center">
                              {error?.user_id}
                            </StyledTableCell>
                          </StyledTableRow>
                        )}
                        {error?.data?.status_code &&
                        error?.data?.response_time ? (
                          <>
                            <StyledTableRow>
                              <StyledTableCell align="right">
                                <p style={{ color: "white" }}>
                                  <b>Status code</b>
                                </p>
                              </StyledTableCell>
                              <StyledTableCell align="center">
                                {error.data.status_code}
                              </StyledTableCell>
                            </StyledTableRow>
                            <StyledTableRow>
                              <StyledTableCell align="right">
                                <p style={{ color: "white" }}>
                                  <b>Response time</b>
                                </p>
                              </StyledTableCell>
                              <StyledTableCell align="center">
                                {error.data.response_time
                                  ? `${error.data.response_time} ms`
                                  : null}
                              </StyledTableCell>
                            </StyledTableRow>
                          </>
                        ) : null}

                        {error?.url && (
                          <StyledTableRow>
                            <StyledTableCell align="right">
                              <p style={{ color: "black" }}>
                                <b>URL</b>
                              </p>
                            </StyledTableCell>
                            <StyledTableCell align="center">
                              {error?.url}
                            </StyledTableCell>
                          </StyledTableRow>
                        )}
                        <StyledTableRow>
                          <StyledTableCell align="right">
                            <p style={{ color: "white" }}>
                              <b>Error Message</b>
                            </p>
                          </StyledTableCell>
                          <StyledTableCell align="center">
                            {error?.message}
                          </StyledTableCell>
                        </StyledTableRow>
                        <StyledTableRow>
                          <StyledTableCell align="right">
                            <p style={{ color: "white" }}>
                              <b>Error Code</b>
                            </p>
                          </StyledTableCell>
                          <StyledTableCell align="center">
                            {error?.error_code}
                          </StyledTableCell>
                        </StyledTableRow>
                        {error?.data && (
                          <StyledTableRow>
                            <StyledTableCell align="right">
                              <p style={{ color: "white" }}>
                                <b>Data</b>
                              </p>
                            </StyledTableCell>
                            <StyledTableCell align="center">
                              <div className="json_link_wrapper">
                                <Tooltip placement="top" title={JSON.stringify(error?.data, 2, null)}>
                                  <span className="json_link">
                                    {JSON.stringify(error?.data, 2, null)}
                                  </span>
                                </Tooltip>
                                <button type="button" onClick={() => handleJSONCopyClick(JSON.stringify(error?.data, 2, null))}>
                                  <svg width={20} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z" />
                                  </svg>
                                </button>
                              </div>
                              {/* {JSON.stringify(error?.data, 2, null)} */}
                            </StyledTableCell>
                          </StyledTableRow>
                        )}
                        <StyledTableRow>
                          <StyledTableCell align="right">
                            <p style={{ color: "white" }}>
                              <b>Description</b>
                            </p>
                          </StyledTableCell>
                          <StyledTableCell align="center">
                            {error?.description}
                          </StyledTableCell>
                        </StyledTableRow>
                        <StyledTableRow>
                          <StyledTableCell align="right">
                            <p style={{ color: "white" }}>
                              <b>Create at</b>
                            </p>
                          </StyledTableCell>
                          <StyledTableCell align="center">
                            {formatLocalDateTime(error?.created_at)}
                          </StyledTableCell>
                        </StyledTableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>
              </Modal>
            </>
          }
        />
      )}
    </>
  );
}

function convertToCustomFormat(isoDate) {
  const year = isoDate?.slice(0, 4);
  const month = isoDate?.slice(5, 7);
  const day = isoDate?.slice(8, 10);
  const time = isoDate?.slice(11, 19);

  return `${year}/${month}/${day} ${time}`;
}
export default apiErrorLogApp;
