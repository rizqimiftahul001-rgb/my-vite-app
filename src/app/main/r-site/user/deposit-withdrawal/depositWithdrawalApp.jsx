import * as React from "react";
import FusePageSimple from "@fuse/core/FusePageSimple";
import DepositWithdrawalHeader from "./depositWithdrawalHeader";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { locale } from "../../../../configs/navigation-i18n";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { Button, CardActionArea, CardActions } from "@mui/material";
import "./depositWithdrawal.css";
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
import moment from "moment";
import { formatSentence } from "src/app/services/Utility";

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

function DepositWithdrawalApp() {
  const dispatch = useDispatch();
  const user_id = DataHandler.getFromSession("user_id");
  const [userId, setUserId] = useState("");
  const payment_type = "Casino User Deposit";
  const [paymentDataCount, setPaymentDataCount] = useState(0);
  const [paymentData, setPaymentData] = useState();
  const [selectLocale] = useSelector((state) => [state.locale.selectLocale]);
  const [selectedLang, setSelectedLang] = useState(locale.en);

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
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    getPaymentHistory();
  }, [page, rowsPerPage]);

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
  const getPaymentHistory = (pageNumber) => {
    APIService({
      url: `${process.env.REACT_APP_R_SITE_API
        }/payment/get-payment/status?agentName=${userId}&start_date=${startDate}&end_date=${endDate}&user_id=${user_id}&payment_type=${payment_type}&pageNumber=${page + 1
        }&limit=${rowsPerPage}`,
      method: "GET",
    })
      .then((res) => {
        setPaymentDataCount(res.data.tableCount);
        setPaymentData(res.data.data);
      })
      .catch((err) => {
        dispatch(
          showMessage({
            variant: 'error',
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

  const columns = [
    {
      id: "number",
      label: `${selectedLang.number}`,
      minWidth: 50,
      numeric: true,
      disablePadding: false,
    },
    { id: "agent", label: `${selectedLang.agent_name}`, minWidth: 50 },
    { id: "user", label: `${selectedLang.receving_user_name}`, minWidth: 50 },
    { id: "type", label: `${selectedLang.type}`, minWidth: 50 },
    { id: "amount", label: `${selectedLang.payment_amount}`, minWidth: 50 },
    {
      id: "balance_before_payment",
      label: `${selectedLang.balance_before_payment}`,
      minWidth: 100,
    },

    {
      id: "balance_after_payment",
      label: `${selectedLang.balance_after_payment}`,
      minWidth: 100,
      format: (value) => value.toLocaleString("en-US"),
    },
    { id: "date", label: `${selectedLang.date}`, minWidth: 100 },
  ];

  const renderPayment = () => {
    if (paymentData) {
      return (
        <TableBody>
          {paymentData
            // .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            .map((payment, index) => {
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
                    {payment.userDetails[0].id}
                  </TableCell>
                  <TableCell
                    sx={{
                      textAlign: "center",
                    }}>
                    {payment.buyer_id}
                  </TableCell>
                  <TableCell
                    sx={{
                      textAlign: "center",
                    }}>
                    {selectedLang[`${formatSentence(payment.type)}`]
                      ? selectedLang[`${formatSentence(payment.type)}`]
                      : payment.type}
                  </TableCell>
                  <TableCell
                    sx={{
                      textAlign: "center",
                    }}>
                    <span className="font-16">
                      {payment.amount?.toLocaleString()}
                    </span>
                  </TableCell>
                  <TableCell
                    sx={{
                      textAlign: "center",
                    }}>
                    {payment.balanceBeforePayment?.toLocaleString()}
                  </TableCell>
                  <TableCell
                    sx={{
                      textAlign: "center",
                    }}>
                    {payment.balanceAfterPayment?.toLocaleString()}
                  </TableCell>
                  <TableCell
                    sx={{
                      textAlign: "center",
                    }}>
                    {moment(payment.created_at)?.format("YYYY/MM/DD HH:mm:ss")}
                    {/* {dateFormat(payment.created_at)} */}
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

  return (
    <>
      {" "}
      {loaded ? (
        <FuseLoading />
      ) : (
        <FusePageSimple
          header={<DepositWithdrawalHeader selectedLang={selectedLang} />}
          content={
            <Card
              sx={{ width: "100%", marginTop: "20px", borderRadius: "4px" }}
              className="main_card">
              <div className="flex justify-start justify-items-center flex-col bg-gray p-16 w-100">
                <div>
                  <span className="list-title">
                    {selectedLang.user_depo_withdra_details}
                  </span>{" "}
                </div>
              </div>

              {/* <div className="row flex justify-end justify-items-center flex-wrap">
              <div className="col-lg-8 col-md-4 col-sm-4 flex item-center">
                <InputBase
                  sx={{
                    ml: 1,
                    flex: 1,
                    border: "1px solid #cdcfd3",
                    borderRadius: "4px",
                    padding: "4px 10px",
                  }}
                  placeholder={selectedLang.user_id}
                  inputProps={{ "aria-label": "User ID" }}
                />
              </div>
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
                  className="text-center"
                />
              </div>
              <div className="col-lg-2 col-md-4 col-sm-4 p-16 flex item-center">
                <Button
                  className="flex item-center"
                  variant="contained"
                  color="secondary"
                  endIcon={<SearchIcon size={20}></SearchIcon>}
                  sx={{
                    borderRadius: "4px",
                  }}>
                  {selectedLang.search}
                </Button>
              </div>
            </div> */}
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
                        {renderPayment()}
                      </Table>
                      {!paymentData && <FuseLoading />}
                    </TableContainer>
                    <TablePagination
                      rowsPerPageOptions={[5, 10, 11, 25, 100]}
                      component="div"
                      count={paymentDataCount ? paymentDataCount : 0}
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

export default DepositWithdrawalApp;
