/** @format */

import React from "react";
import FusePageSimple from "@fuse/core/FusePageSimple";
import PaymentHistoryHeader from "./paymentHistoryHeader";
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
  Tooltip,
  Typography,
} from "@mui/material";
import "./paymentHistory.css";
import DoneIcon from "@mui/icons-material/Done";
import Chip from "@mui/material/Chip";
import Paper from "@mui/material/Paper";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import { styled } from "@mui/material/styles";
import Modal from "@mui/material/Modal";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import InputBase from "@mui/material/InputBase";
import SearchIcon from "@mui/icons-material/Search";
import Grid from "@mui/material/Grid";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import APIService from "src/app/services/APIService";
import DataHandler from "src/app/handlers/DataHandler";
import { showMessage } from "app/store/fuse/messageSlice";
import FuseLoading from "@fuse/core/FuseLoading";
import { CSVLink } from "react-csv";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import { headerLoadChanged } from "app/store/headerLoadSlice";
import TextField from "@mui/material/TextField";
import moment from "moment";
import { formatLocalDateTime, formatSentence } from "src/app/services/Utility";
import queryString from "query-string";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

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

function paymentHistoryApp() {
  const dispatch = useDispatch();
  const [paymentRequest, setPaymentRequest] = useState([]);
  const [selectLocale] = useSelector((state) => [state.locale.selectLocale]);
  const [headerLoad] = useSelector((state) => [state.headerLoad.headerLoad]);
  const [selectedLang, setSelectedLang] = useState(locale.ko);
  const [subLoader, setSubLoader] = useState(true);

  // const [loaded, setLoaded] = useState(true);
  // useEffect(() => {
  //   const timeoutId = setTimeout(() => {
  //     setLoaded(false);
  //   }, 500);
  //   return () => clearTimeout(timeoutId);
  // }, []);
  const [loaded, setLoaded] = useState(true);
  const [loading1, setLoading1] = useState(true);

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
  const [requested_user_id, setrequested_user_id] = useState("");
  const [requested_name, setrequested_name] = useState("");
  const [withdraw_amount, setwithdraw_amount] = useState(0);
  const [value, setValue] = React.useState(null);
  const [startDate, setStartDate] = useState(threeDaysAgo);
  const [endDate, setEndDate] = useState(todayDate);
  const [type, setType] = useState("All");
  const [receiving_Agent, setReceivingAgent] = useState("All");
  useEffect(() => {
    getpaymentRequest();
  }, [page, rowsPerPage, selectedLang]);

  const [paymentTableCount, _tpaymentTableCount] = useState(0);

  const { search } = window.location;
  const { agent_id, agent } = queryString.parse(search);
  const [agentt, setAgent] = useState(agent || "");

  const getpaymentRequest = () => {
    setSubLoader(true);
    APIService({
      url: `${process.env.REACT_APP_R_SITE_API
        }/request-payment/get-payment-request?type=${type}&startDate=${startDate}&endDate=${endDate}&receivingAgent=${receiving_Agent}&limit=${rowsPerPage}&pageNumber=${page + 1
        }&agent=${agentt}`,
      method: "GET",
    })
      .then((res) => {
        setPaymentRequest(res.data.data);
        _tpaymentTableCount(res.data.tableCount || 1);
      })
      .catch((err) => {
        setPaymentRequest(err.data);
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
    { id: "agent", label: `${selectedLang.parent_id}`, minWidth: 50 },
    { id: "agent_id", label: `${selectedLang.agent_id}`, minWidth: 50 },
    { id: "pytype", label: `${selectedLang.type}`, minWidth: 50 },
    {
      id: "before_amount",
      label: `${selectedLang.Before_Pot}`,
      minWidth: 50,
    },
    { id: "amount", label: `${selectedLang.amount}`, minWidth: 50 },
    { id: "after", label: `${selectedLang.status}`, minWidth: 50 },

    {
      id: "time",
      label: `${selectedLang.application_date}`,
      minWidth: 50,
    },
    // {
    //   id: "action",
    //   label: `${selectedLang.action}`,
    //   minWidth: 50,
    // },
  ];

  const [openWithdraw, setOpenWithdraw] = React.useState(false);
  const handleOpenWithdraw = (data) => {
    if (data.type == "Casino Payment") {
      setrequested_user_id(data?.username);
    } else if (data.type == "R Site Payment") {
      setrequested_user_id(data?.requested_user_id);
    }
    setrequested_name(data?.username);
    setOpenWithdraw(true);
  };

  const handleCloseWithdraw = () => {
    setOpenWithdraw(false);
    setwithdraw_amount(0);
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
          message: `${selectedLang.user_id_is_required}`,
        })
      );
    }

    if (withdraw_amount > 0 && requested_user_id != "") {
      const uuidv4Pattern =
        /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-4[0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/;

      if (uuidv4Pattern.test(requested_user_id)) {
        var URL = `${process.env.REACT_APP_R_SITE_API}/request-withdraw/create-rsite-withdraw?amount=${withdraw_amount}&user_id=${requested_user_id}`;
      } else {
        var URL = `${process.env.REACT_APP_R_SITE_API}/request-withdraw/create-casino-withdraw-by-rsite?amount=${withdraw_amount}&uid=${requested_user_id}`;
      }
      APIService({
        url: URL,
        method: "POST",
      })
        .then((data) => {
          setwithdraw_amount(0);
          dispatch(
            headerLoadChanged({
              headerLoad: !headerLoad,
            })
          );
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
          dispatch(
            showMessage({
              variant: "error",
              message: `${selectedLang[`${formatSentence(err?.message)}`] ||
                selectedLang.something_went_wrong
                }`,
            })
          );
        })
        .finally(() => { });
    }
  };

  const csvHeader = [
    { label: "Receiving Agent", key: "username" },
    { label: "Type", key: "type" },
    { label: "Amount", key: "requested_amount" },
    { label: "Agent UID", key: "approved_agent_name" },
    { label: "Status", key: "status" },
    { label: "Request Time", key: "dateFormat" },
  ];
  const csvDataPaymentRequest =
    paymentRequest?.length > 0 &&
    paymentRequest.map((item) => ({
      ...item,
      dateFormat: formatLocalDateTime(item.created_at),
      // dateFormat: dateFormat(item.created_at),
    }));

  const getPaymentRequest = () => {
    if (paymentRequest?.length > 0) {
      return (
        <TableBody>
          {paymentRequest
            // .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
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
                    {data?.approved_agent_name
                      ? data?.approved_agent_name
                      : "-"}
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
                    {/* {selectedLang[`${formatSentence(data?.type)}`]} */}
                    {selectedLang[`${formatSentence(data?.type)}`]
                      ? selectedLang[`${formatSentence(data?.type)}`]
                      : data?.type}
                    {/* {data?.type} */}
                  </TableCell>
                  <TableCell
                    sx={{
                      textAlign: "center",
                    }}>
                    {(isNaN(Number(data?.before_amount))
                      ? 0
                      : Number(data?.before_amount)
                    ).toLocaleString()}
                  </TableCell>
                  <TableCell
                    sx={{
                      textAlign: "center",
                    }}>
                    {data?.requested_amount?.toLocaleString()}
                  </TableCell>
                  <TableCell
                    sx={{
                      textAlign: "center",
                      fontWeight: "600",
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
                  {/* <TableCell
                    sx={{
                      textAlign: "center",
                    }}>
                    <div className="col-lg-2 col-md-4 col-sm-4 pl-10 flex item-center">
                      <Button
                        className="flex item-center cm_btn"
                        variant="contained"
                        color="secondary"
                        size="small"
                        sx={{
                          borderRadius: "4px",
                        }}
                        onClick={() => handleOpenWithdraw(data)}>
                        {selectedLang.withdraw}
                      </Button>
                    </div>
                  </TableCell> */}
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

  return (
    <>
      {" "}
      {loaded ? (
        <FuseLoading />
      ) : (
        <FusePageSimple
          header={
            <PaymentHistoryHeader
              selectedLang={selectedLang}
              csv_data={csvDataPaymentRequest}
              csv_header={csvHeader}
              csv_filename={"payment_history.csv"}
            />
          }
          content={
            <Card
              sx={{ width: "100%", marginTop: "20px", borderRadius: "4px" }}
              className="main_card">
              <Modal
                open={openWithdraw}
                className="small_modal"
                onClose={handleCloseWithdraw}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description">
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
                  <Typography
                    id="modal-modal-title"
                    style={{ fontWeight: "700" }}
                    variant="h5"
                    component="h2">
                    {selectedLang.create_withdraw}
                  </Typography>
                  <Grid
                    key={"grid1"}
                    container
                    sx={{
                      marginTop: "0px",
                    }}>
                    <Grid xs={12} md={12} key={"grid3"}>
                      <Typography
                        id="modal-modal-title"
                        style={{
                          marginBottom: "25px",
                          paddingTop: "5px",
                          fontWeight: "500",
                        }}>
                        {selectedLang.agent_name} :
                        <span
                          style={{
                            fontWeight: "600",
                            paddingLeft: "6px",
                            color: "#000",
                          }}>
                          {requested_name}
                        </span>
                      </Typography>
                    </Grid>
                    <Grid xs={12} md={12} key={"grid4"}>
                      <TextField
                        type="text"
                        size="small"
                        fullWidth
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
                          setwithdraw_amount(numericValue);
                        }}
                      />
                    </Grid>
                    <Grid
                      key={"grid6"}
                      sx={{
                        paddingTop: "10px",
                      }}
                      xs={12}
                      md={12}
                      style={{ width: "100%" }}>
                      {" "}
                      <Button
                        key={"button-1"}
                        className="flex justify-center cm_btn"
                        variant="contained"
                        color="secondary"
                        style={{ width: "100%" }}
                        endIcon={
                          <DoneIcon key={"deone-icon"} size={20}></DoneIcon>
                        }
                        sx={{
                          borderRadius: "4px",
                        }}
                        onClick={(e) => createWithdraw(e)}>
                        {selectedLang.withdraw}
                      </Button>
                    </Grid>
                  </Grid>
                </Box>
              </Modal>
              <div className="flex justify-start justify-items-center flex-col bg-gray p-16 w-100">
                <div>
                  <span className="list-title">
                    {selectedLang.agent_payment_history_list}
                  </span>{" "}
                </div>
                {/* <div>
                <span className="small-text">
                  Total Amount Paid Recharged For March Month:{" "}
                  <strong>0 Pot</strong>
                </span>
              </div> */}
              </div>

              <div
                className="row flex justify-end justify-items-center flex-wrap z-index-10"
                style={{ flexWrap: "wrap" }}>
                <div className="p-10 flex item-center">
                  <div className="datepikers">
                    <DateTimePicker
                      views={["year", "month", "day"]}
                      s
                      className="datetimePiker"
                      placeholder={"Start Date"}
                      size="small"
                      value={startDate}
                      onChange={(date) => setStartDate(date)}
                      inputFormat="yyyy/MM/dd"
                      // inputFormat="MMMM d, yyyy h:mm"
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
                      inputFormat="yyyy/MM/dd"
                      // inputFormat="MMMM d, yyyy h:mm"
                      onChange={(date) => setEndDate(date)}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          placeholder={selectedLang.end_date}
                        />
                      )}
                    />
                    <Tooltip title={selectedLang.today} placement="top" arrow>
                      <Button
                        className="flex item-center mybutton"
                        variant="contained"
                        color="secondary"
                        // endIcon={<SearchIcon size={20}></SearchIcon>}
                        sx={{
                          borderRadius: "4px",
                        }}
                        onClick={handleTodayClick}>
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 461 480"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg">
                          <path
                            d="M459.399 177.82V103.778C459.366 74.6652 435.771 51.0709 406.658 51.0382H392.771V42.7105C392.651 19.0835 373.463 0 349.838 0C326.213 0 307.03 19.0826 306.903 42.7105V51.0373H151.791V42.7115C151.67 19.0835 132.482 0 108.858 0C85.2338 0 66.0511 19.0826 65.9222 42.7105V51.0373H52.0318C22.9219 51.0709 -0.672356 74.6652 -0.705078 103.778V427.258C-0.671394 456.371 22.9219 479.965 52.0318 479.999H406.658C435.771 479.965 459.366 456.372 459.398 427.259V185.431C460.233 182.962 460.233 180.288 459.398 177.819L459.399 177.82ZM349.839 23.7858C360.282 23.8003 368.745 32.2598 368.756 42.7105V67.9958C368.677 78.383 360.226 86.7627 349.831 86.7627C339.44 86.7627 330.993 78.383 330.911 67.9958V42.7115C330.922 32.2598 339.388 23.7974 349.839 23.7858ZM89.9284 42.7105C90.0111 32.3166 98.4591 23.936 108.849 23.936C119.244 23.936 127.688 32.3156 127.775 42.7105V67.9958C127.688 78.383 119.244 86.7627 108.85 86.7627C98.4591 86.7627 90.0111 78.383 89.9293 67.9958L89.9284 42.7105ZM52.0318 75.0483H66.5083C69.9595 95.7477 87.8659 110.921 108.851 110.921C129.839 110.921 147.746 95.7477 151.197 75.0483H307.493C310.944 95.7477 328.854 110.921 349.839 110.921C370.824 110.921 388.734 95.7477 392.181 75.0483H406.658C422.519 75.0675 435.369 87.9175 435.388 103.778V169.616H23.3059V103.782C23.3204 87.9214 36.1791 75.0675 52.0318 75.0483ZM406.658 455.987H52.0318C36.1781 455.969 23.3242 443.12 23.3059 427.259V193.626H435.388V427.259C435.369 443.12 422.519 455.97 406.658 455.989V455.987Z"
                            fill="white"
                          />
                          <path
                            d="M289.076 269.62L210.257 346.578L170.242 307.507C165.527 302.901 157.986 302.955 153.339 307.623C148.693 312.296 148.677 319.838 153.302 324.526L153.467 324.683L201.873 371.95C206.535 376.502 213.982 376.502 218.644 371.95L305.854 286.808C310.557 282.184 310.651 274.627 306.065 269.887C301.47 265.15 293.917 265.008 289.144 269.56L289.077 269.623L289.076 269.62Z"
                            fill="white"
                          />
                        </svg>

                        {/* {selectedLang.today} */}
                      </Button>
                    </Tooltip>

                    <Tooltip
                      title={selectedLang.yesterday}
                      placement="top"
                      arrow>
                      <Button
                        className="flex item-center mybutton"
                        variant="contained"
                        color="secondary"
                        // endIcon={<SearchIcon size={20}></SearchIcon>}
                        sx={{
                          borderRadius: "4px",
                        }}
                        onClick={handleYesterdayClick}>
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 480 480"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg">
                          <path
                            d="M432 32H384V16C384 11.7565 382.314 7.68687 379.314 4.68629C376.313 1.68571 372.243 0 368 0C363.757 0 359.687 1.68571 356.686 4.68629C353.686 7.68687 352 11.7565 352 16V32H128V16C128 11.7565 126.314 7.68687 123.314 4.68629C120.313 1.68571 116.243 0 112 0C107.757 0 103.687 1.68571 100.686 4.68629C97.6857 7.68687 96 11.7565 96 16V32H48C21.536 32 0 53.536 0 80V213.44C0 217.683 1.68571 221.753 4.68629 224.754C7.68687 227.754 11.7565 229.44 16 229.44C20.2435 229.44 24.3131 227.754 27.3137 224.754C30.3143 221.753 32 217.683 32 213.44V160H448V432C448 436.243 446.314 440.313 443.314 443.314C440.313 446.314 436.243 448 432 448H48C39.184 448 32 440.832 32 432V394.56C32 390.317 30.3143 386.247 27.3137 383.246C24.3131 380.246 20.2435 378.56 16 378.56C11.7565 378.56 7.68687 380.246 4.68629 383.246C1.68571 386.247 0 390.317 0 394.56V432C0 458.464 21.536 480 48 480H432C458.464 480 480 458.464 480 432V80C480 53.536 458.464 32 432 32ZM32 128V80C32 71.168 39.184 64 48 64H96C96 68.2435 97.6857 72.3131 100.686 75.3137C103.687 78.3143 107.757 80 112 80C116.243 80 120.313 78.3143 123.314 75.3137C126.314 72.3131 128 68.2435 128 64H352C352 68.2435 353.686 72.3131 356.686 75.3137C359.687 78.3143 363.757 80 368 80C372.243 80 376.313 78.3143 379.314 75.3137C382.314 72.3131 384 68.2435 384 64H432C436.243 64 440.313 65.6857 443.314 68.6863C446.314 71.6869 448 75.7565 448 80V128H32ZM107.312 235.312L54.624 288H240C244.243 288 248.313 289.686 251.314 292.686C254.314 295.687 256 299.757 256 304C256 308.243 254.314 312.313 251.314 315.314C248.313 318.314 244.243 320 240 320H54.624L107.312 372.688C108.84 374.164 110.059 375.929 110.898 377.882C111.736 379.834 112.178 381.933 112.196 384.058C112.214 386.182 111.81 388.289 111.005 390.255C110.201 392.222 109.013 394.008 107.51 395.51C106.008 397.013 104.222 398.201 102.255 399.005C100.289 399.81 98.182 400.214 96.0576 400.196C93.9331 400.178 91.8336 399.736 89.8815 398.898C87.9295 398.059 86.164 396.84 84.688 395.312L4.688 315.312C1.68846 312.312 0.00341606 308.243 0.00341606 304C0.00341606 299.757 1.68846 295.688 4.688 292.688L84.688 212.688C86.164 211.16 87.9295 209.941 89.8815 209.102C91.8336 208.264 93.9331 207.822 96.0576 207.804C98.182 207.786 100.289 208.19 102.255 208.995C104.222 209.799 106.008 210.987 107.51 212.49C109.013 213.992 110.201 215.778 111.005 217.745C111.81 219.711 112.214 221.818 112.196 223.942C112.178 226.067 111.736 228.166 110.898 230.118C110.059 232.071 108.84 233.836 107.312 235.312Z"
                            fill="white"
                          />
                        </svg>
                      </Button>
                    </Tooltip>
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
                        placeholder={selectedLang.agent_id}
                        value={agentt}
                        onChange={(e) => setAgent(e.target.value)}
                        inputProps={{ "aria-label": selectedLang.agent_id }}
                      />
                    </div>
                  </div>
                </div>
                <div
                  className="col-lg-2 col-md-4 col-sm-4 flex item-center"
                  style={{ marginRight: "18px" }}>
                  <Button
                    className="flex item-center"
                    variant="contained"
                    color="secondary"
                    onClick={getpaymentRequest}
                    endIcon={<SearchIcon size={20}></SearchIcon>}
                    sx={{
                      borderRadius: "4px",
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
                        {getPaymentRequest()}
                      </Table>
                      {subLoader && <FuseLoading />}

                      {!paymentRequest.length > 0 && !subLoader && (
                        <div
                          style={{ textAlign: "center", color: "#fff", padding: "0.95rem" }}>
                          {selectedLang.no_data_available_in_table}
                        </div>
                      )}
                    </TableContainer>
                    <TablePagination
                      rowsPerPageOptions={[5, 10, 25, 100]}
                      component="div"
                      count={paymentTableCount ? paymentTableCount : 0}
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
          }
        />
      )}
    </>
  );
}

export default paymentHistoryApp;
