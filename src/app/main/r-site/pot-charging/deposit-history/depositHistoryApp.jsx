/** @format */

import React from "react";
import FusePageSimple from "@fuse/core/FusePageSimple";
import DepositHistoryHeader from "./depositHistoryHeader";
import TextField from "@mui/material/TextField";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { locale } from "../../../../configs/navigation-i18n";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import {
  Box,
  Button,
  CardActionArea,
  CardActions,
  Typography,
} from "@mui/material";
import "./depositHistory.css";
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

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import APIService from "src/app/services/APIService";
import DataHandler from "src/app/handlers/DataHandler";
import { showMessage } from "app/store/fuse/messageSlice";
import FuseLoading from "@fuse/core/FuseLoading";
import { CSVLink } from "react-csv";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import moment from "moment";
import { formatLocalDateTime, formatSentence } from "src/app/services/Utility";

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
threeDaysAgo.setDate(todayDate.getDate() - 3);

function depositHistoryApp() {
  const dispatch = useDispatch();
  const [depositRequest, setDepositRequest] = useState([]);
  const [selectLocale] = useSelector((state) => [state.locale.selectLocale]);
  const [selectedLang, setSelectedLang] = useState(locale.en);
  // const [loaded, setLoaded] = useState(true)
  // useEffect(() => {
  //   const timeoutId = setTimeout(() => {
  //     setLoaded(false)
  //   }, 500);
  //   return () => clearTimeout(timeoutId);
  // }, []);

  const [loaded, setLoaded] = useState(true);
  const [loading1, setLoading1] = useState(true);
  const [subLoader, setSubLoader] = useState(true);

  const [receivingName, setreceivingAgentName] = useState("");

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
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

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
  const [value, setValue] = React.useState(null);
  const [startDate, setStartDate] = useState(threeDaysAgo);
  const [endDate, setEndDate] = useState(todayDate);

  useEffect(() => {
    getDepositRequest();
  }, [page, rowsPerPage]);

  const [depositeTableCount, setDepositeCount] = useState(0);
  const getDepositRequest = () => {
    setSubLoader(true);
    APIService({
      url: `${
        process.env.REACT_APP_R_SITE_API
      }/request-withdraw/get-withdraw-request?startDate=${startDate}&endDate=${endDate}&limit=${rowsPerPage}&pageNumber=${
        page + 1
      }&receivingName=${receivingName}`,
      method: "GET",
    })
      .then((res) => {
        setDepositRequest(res.data.data);
        setDepositeCount(res.data.tableCount || 1);
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
        setSubLoader(false);
      });
  };

  const columns = [
    {
      id: "number",
      label: `${selectedLang.number}`,
      minWidth: 50,
      numeric: true,
      disablePadding: false,
    },
    { id: "type", label: `${selectedLang.receiving_agent}`, minWidth: 50 },
    { id: "pytype", label: `${selectedLang.type}`, minWidth: 50 },
    { id: "amount", label: `${selectedLang.amount}`, minWidth: 50 },
    { id: "agent", label: `${selectedLang.agent_name}`, minWidth: 50 },
    { id: "after", label: `${selectedLang.status}`, minWidth: 50 },

    {
      id: "time",
      label: `${selectedLang.application_date}`,
      minWidth: 50,
    },
  ];

  const csvHeader = [
    { label: "Receiving Agent", key: "username" },
    { label: "Type", key: "type" },
    { label: "Amount", key: "withdraw_amount" },
    { label: "Agent UID", key: "withdrawer_agent_name" },
    { label: "Status", key: "status" },
    { label: "Request Time", key: "created_at" },
  ];

  const getdepositRequest = () => {
    if (depositRequest.length > 0) {
      return (
        <TableBody>
          {depositRequest
            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            .map((data, index) => {
              return (
                <StyledTableRow hover role="checkbox" tabIndex={-1} key={index}>
                  <TableCell
                    sx={{
                      textAlign: "center",
                    }}>
                    {page * rowsPerPage + index + 1}
                  </TableCell>
                  <TableCell
                    sx={{
                      textAlign: "center",
                    }}>
                    {data?.username}
                  </TableCell>
                  <TableCell
                    sx={{
                      textAlign: "center",
                    }}>
                    {selectedLang[`${formatSentence(data?.type)}`]
                      ? selectedLang[`${formatSentence(data?.type)}`]
                      : data?.type}
                    {/* {data?.type} */}
                  </TableCell>
                  <TableCell
                    sx={{
                      textAlign: "center",
                    }}>
                    {data?.withdraw_amount?.toLocaleString()}
                  </TableCell>
                  <TableCell
                    sx={{
                      textAlign: "center",
                    }}>
                    {data?.withdrawer_agent_name
                      ? data?.withdrawer_agent_name
                      : "-"}
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: "600",
                      textAlign: "center",
                      color: data?.status ? "green" : "red",
                    }}>
                    {data?.status
                      ? `${selectedLang.approved}`
                      : `${selectedLang.not_approved}`}
                  </TableCell>
                  <TableCell
                    sx={{
                      textAlign: "center",
                    }}>
                    {formatLocalDateTime(data?.created_at)}
                    {/* {moment(data?.created_at).format("YYYY/MM/DD HH:mm:ss")} */}
                    {/* {dateFormat(data?.created_at)} */}
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

  const csvData =
    depositRequest.length > 0
      ? depositRequest.map((item) => ({
          ...item,
          status: item.status
            ? selectedLang.approved
            : selectedLang.not_approved,
          created_at: formatLocalDateTime(item.created_at),
        }))
      : [];

  return (
    <>
      {" "}
      {loaded ? (
        <FuseLoading />
      ) : (
        <FusePageSimple
          header={
            <DepositHistoryHeader
              selectedLang={selectedLang}
              csv_data={csvData}
              csv_header={csvHeader}
              csv_filename={"withdraw_history.csv"}
            />
          }
          content={
            <>
              <Card
                sx={{ width: "100%", marginTop: "20px", borderRadius: "4px" }}
                className="main_card">
                <div className="flex justify-start justify-items-center flex-col bg-gray p-16 w-100">
                  <div>
                    <span className="list-title">
                      {selectedLang.agent_deposit_history_list}
                    </span>{" "}
                  </div>
                  {/* <div>
                <span className="small-text">
                  Total Amount Paid Recharged For March Month:{" "}
                  <strong>0 Pot</strong>
                </span>
              </div> */}
                </div>

                <div className="row flex justify-end justify-items-center flex-wrap">
                  <div className="col-lg-2 col-md-4 col-sm-4 p-10 flex item-center">
                    <div className="datepikers">
                      <DateTimePicker
                        views={["year", "month", "day"]}
                        className="datetimePiker"
                        placeholder={"Start Date"}
                        size="small"
                        value={startDate}
                        onChange={(date) => setStartDate(date)}
                        // inputFormat="MMMM d, yyyy h:mm"
                        inputFormat="yyyy/MM/dd"
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            placeholder={selectedLang.start_date}
                          />
                        )}
                      />
                      <div className="px-5 text-white"> - </div>
                      <DateTimePicker
                        views={["year", "month", "day"]}
                        className="datetimePiker"
                        placeholder={"Start Date"}
                        size="small"
                        value={endDate}
                        onChange={(date) => setEndDate(date)}
                        // inputFormat="MMMM d, yyyy h:mm"
                        inputFormat="yyyy/MM/dd"
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            placeholder={selectedLang.end_date}
                          />
                        )}
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
                          marginRight: "0px",
                        }}
                        placeholder={selectedLang.receiving_agent}
                        value={receivingName}
                        onChange={(e) => setreceivingAgentName(e.target.value)}
                        inputProps={{ "aria-label": selectedLang.agent_id }}
                      />
                    </div>
                    {/* <DatePicker
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
                /> */}
                  </div>
                  <div className="col-lg-2 col-md-4 col-sm-4 p-10 pl-0 flex item-center">
                    <Button
                      className="flex item-center"
                      variant="contained"
                      color="secondary"
                      endIcon={<SearchIcon size={20}></SearchIcon>}
                      sx={{
                        borderRadius: "4px",
                      }}
                      onClick={() => {
                        getDepositRequest();
                      }}>
                      {selectedLang.date_search}
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
                      }}>
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
                                  style={{ minWidth: column.minWidth }}>
                                  {column.label}
                                </StyledTableCell>
                              ))}
                            </TableRow>
                          </TableHead>
                          {getdepositRequest()}
                        </Table>

                        {subLoader && <FuseLoading />}

                        {!depositRequest.length > 0 && !subLoader && (
                          <div                            
                            style={{ textAlign: "center",color:'#fff', padding: "0.95rem" }}>
                            {selectedLang.no_data_available_in_table}
                          </div>
                        )}
                      </TableContainer>
                      <TablePagination
                        rowsPerPageOptions={[2, 10, 25, 100]}
                        component="div"
                        count={
                          depositRequest?.length ? depositRequest?.length : 0
                        }
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                        labelRowsPerPage={selectedLang.rows_per_page}
                      />
                    </Paper>
                  </CardContent>
                </div>
              </Card>
            </>
          }
        />
      )}
    </>
  );
}

export default depositHistoryApp;
