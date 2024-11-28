/** @format */

import React from "react";
import FusePageSimple from "@fuse/core/FusePageSimple";
import MyRpointHistoryHeader from "./myRpointHistoryHeader";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { locale } from "../../../../configs/navigation-i18n";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import {
  Button,
  CardActionArea,
  CardActions,
  FormControl,
  Tooltip,
} from "@mui/material";
import "./myRpointHistory.css";
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
import APIService from "src/app/services/APIService";
import DataHandler from "src/app/handlers/DataHandler";
import FuseLoading from "@fuse/core/FuseLoading";
import Grid from "@mui/material/Grid";
import { showMessage } from "app/store/fuse/messageSlice";
import moment from "moment";
import { formatLocalDateTime } from "src/app/services/Utility";
import "../../dashboard/dashboard.css";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import TextField from "@mui/material/TextField";
import SearchIcon from "@mui/icons-material/Search";
import { Autocomplete } from "@mui/material";
import InputBase from "@mui/material/InputBase";

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
threeDaysAgo.setDate(todayDate.getDate() - 3);

function MyRpointHistoryApp() {
  const dispatch = useDispatch();
  const user_id = DataHandler.getFromSession("user_id");
  const [provider, setProvider] = useState(1);
  const [myrequestList, setMyRequestList] = useState([]);
  const [selectLocale] = useSelector((state) => [state.locale.selectLocale]);
  const [selectedLang, setSelectedLang] = useState(locale.en);
  // const [loaded, setLoaded] = useState(true)
  //    useEffect(() => {
  //        const timeoutId = setTimeout(() => {
  //      setLoaded(false)
  //     }, 500);
  //  return () => clearTimeout(timeoutId);
  //   }, []);

  const [loaded, setLoaded] = useState(true);
  const [loading1, setLoading1] = useState(true);
  const [subLoader, setSubLoader] = useState(true);

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

  const [TodayAmount, setAmount] = useState([]);
  const [AmountMonthly, setAmountMonthly] = useState([]);

  const [startDate, setStartDate] = useState(threeDaysAgo);
  const [endDate, setEndDate] = useState(todayDate);

  const [status, setStatus] = useState("");

  const [agentName, setAgentName] = useState("");

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

  useEffect(() => {
    getMyRequestList();
  }, [page, rowsPerPage]);

  const [myRequestTableCount, _myRequestTableCount] = useState(0);
  const getMyRequestList = () => {
    setSubLoader(true);
    APIService({
      url: `${
        process.env.REACT_APP_R_SITE_API
      }/user/my-request-list?user_id=${user_id}&agent=${agentName}&startDate=${startDate}&endDate=${endDate}&pageNumber=${
        page + 1
      }&limit=${rowsPerPage}&status=${status}`,
      method: "GET",
    })
      .then((res) => {
        setMyRequestList(res.data.data);
        _myRequestTableCount(res.data.rpointList_table_count);
        setAmount(res.data.todayChargeAmount);
        setAmountMonthly(res.data.MonthlyChargeAmount);
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
      id: "req",
      label: `${selectedLang.Req_ID}`,
      minWidth: 50,
    },
    { id: "user", label: `${selectedLang.requester}`, minWidth: 50 },
    { id: "parent", label: `${selectedLang.parent_id}`, minWidth: 50 },
    { id: "point", label: `${selectedLang.amount}`, minWidth: 100 },

    {
      id: "status",
      label: `${selectedLang.status}`,
      minWidth: 100,
      format: (value) => value.toLocaleString("en-US"),
    },
    // {
    //   id: "statusd",
    //   label: `${selectedLang.user_deposit}`,
    //   minWidth: 100,
    //   format: (value) => value.toLocaleString("en-US"),
    // },
    { id: "created_at", label: `${selectedLang.date}`, minWidth: 50 },
  ];

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

  const handleSelectChangeStatus = (event, newValue) => {
    setStatus(newValue?.value || "");
  };

  const renderMyRequestlist = () => {
    if (!myrequestList) {
      return <FuseLoading />;
    } else {
      return (
        <TableBody>
          {myrequestList
            // .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
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
                    {data.userDetails[0]?.id}
                  </TableCell>
                  <TableCell
                    sx={{
                      textAlign: "center",
                    }}>
                    {data.parentDetails[0].id}
                  </TableCell>
                  <TableCell
                    sx={{
                      textAlign: "center",
                    }}>
                    {Number(data.point_amount)?.toLocaleString()}
                  </TableCell>
                  <TableCell
                    sx={{
                      textAlign: "center",
                    }}>
                    {data.status
                      ? selectedLang.approved
                      : selectedLang.not_approved}
                  </TableCell>
                  {/* <TableCell
                    sx={{
                      textAlign: "center",
                    }}>
                    {selectedLang[`${data?.deposit_status}`]}
                    
                  </TableCell> */}
                  <TableCell
                    sx={{
                      textAlign: "center",
                    }}>
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
  return (
    <>
      {" "}
      {loaded ? (
        <FuseLoading />
      ) : (
        <FusePageSimple
          header={<MyRpointHistoryHeader selectedLang={selectedLang} />}
          content={
              <div className="flex flex-col container">
                <div className="dashboard_card_wrapper">
                  <div className="dashboard_card" id="blue_card_border">
                    <div className="dashboard_inner">
                      <div className="dashboard_icon">
                        <p>
                          {Number(TodayAmount)?.toLocaleString()}
                          <span>Pots</span>
                        </p>
                      </div>
                      <h3>{selectedLang.today_recharge}</h3>
                    </div>
                  </div>
                  <div className="dashboard_card" id="green_card_border">
                    <div className="dashboard_inner">
                      <div className="dashboard_icon">
                        <p>
                          {Number(AmountMonthly)?.toLocaleString()}
                          <span>Pots</span>
                        </p>
                      </div>
                      <h3>{selectedLang.monthly_recharge}</h3>
                    </div>
                  </div>
                </div>
                <div className="flex"></div>
                <Card
                  sx={{ width: "100%", marginTop: "20px", borderRadius: "4px" }}
                  className="main_card">
                  <div className="flex justify-start justify-items-center bg-gray p-10 list_title w-100">
                    <span className="list-title">{selectedLang.MTRPOINT}</span>
                  </div>
                  <div>
                    <div
                      className="row flex justify-end justify-items-center flex-wrap z-index-10"
                      style={{ flexWrap: "wrap" }}>
                      <div
                        className="col-lg-2 col-md-4 col-sm-4 flex fap"
                        style={{
                          gap: "10px",
                          width: "100%",
                          padding: "10px 0",
                        }}>
                        <div className="flex item-center width_100">
                          <InputBase
                            sx={{
                              flex: 1,
                              marginLeft: "0",
                              border: "1px solid #cdcfd3",
                              borderRadius: "4px",
                              padding: "4px 10px",
                              marginRight: "0px",
                            }}
                            placeholder={selectedLang.agent}
                            value={agentName}
                            onChange={(e) => setAgentName(e.target.value)}
                            inputProps={{ "aria-label": "Agent Name" }}
                          />
                        </div>

                        <div className="datepikers width_100">
                          <DateTimePicker
                            className="datetimePiker"
                            placeholder={"Start Date"}
                            size="small"
                            value={startDate}
                            inputFormat="yyyy/MM/dd HH:mm:ss"
                            onChange={(date) => setStartDate(date)}
                            renderInput={(params) => <TextField {...params} />}
                          />
                          <div className="px-5 text-white"> - </div>
                          <DateTimePicker
                            className="datetimePiker"
                            placeholder={"Start Date"}
                            size="small"
                            value={endDate}
                            inputFormat="yyyy/MM/dd HH:mm:ss"
                            onChange={(date) => setEndDate(date)}
                            renderInput={(params) => <TextField {...params} />}
                          />
                        </div>
                        <Autocomplete
                          onChange={handleSelectChangeStatus}
                          className="width_100 maxwidth"
                          variant="outlined"
                          disablePortal
                          size="small"
                          id="combo-box-demo"
                          options={[
                            {
                              label: `${selectedLang.approved}`,
                              value: "true",
                            },
                            {
                              label: `${selectedLang.not_approved}`,
                              value: "false",
                            },
                          ]}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              className="textSearch"
                              label={selectedLang.status}
                            />
                          )}
                        />
                        <Tooltip
                          title={selectedLang.today}
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
                        <div
                          className="flex"
                          style={{ alignItems: "center", gap: "10px" }}>
                          <div className="flex item-center">
                            <Button
                              className="flex item-center"
                              variant="contained"
                              color="secondary"
                              endIcon={<SearchIcon size={20}></SearchIcon>}
                              sx={{
                                borderRadius: "4px",
                              }}
                              onClick={getMyRequestList}>
                              {selectedLang.search}
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>

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
                                    style={{ minWidth: column.minWidth }}>
                                    {column.label}
                                  </StyledTableCell>
                                ))}
                              </TableRow>
                            </TableHead>
                            {renderMyRequestlist()}
                          </Table>
                          {subLoader && <FuseLoading />}

                          {!myrequestList.length > 0 && !subLoader && (
                            <div
                              style={{
                                textAlign: "center",color:'#fff',
                                padding: "0.95rem",
                              }}>
                              {selectedLang.no_data_available_in_table}
                            </div>
                          )}
                        </TableContainer>
                        <TablePagination
                          rowsPerPageOptions={[5, 10, 25, 100]}
                          component="div"
                          count={myRequestTableCount}
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
              </div>
          }
        />
      )}
    </>
  );
}

export default MyRpointHistoryApp;
