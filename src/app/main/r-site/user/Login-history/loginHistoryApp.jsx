/** @format */

import React from "react";
import FusePageSimple from "@fuse/core/FusePageSimple";
import LoginHistoryHeader from "./loginHistoryHeader";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { locale } from "../../../../configs/navigation-i18n";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { Button, CardActionArea, CardActions, Tooltip } from "@mui/material";
import "./transactionHistory.css";
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
import DataHandler from "src/app/handlers/DataHandler";
import jwtDecode from "jwt-decode";
import APIService from "src/app/services/APIService";
import { showMessage } from "app/store/fuse/messageSlice";
import FuseLoading from "@fuse/core/FuseLoading";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Unstable_Grid2";
import TextField from "@mui/material/TextField";
import DoneIcon from "@mui/icons-material/Done";
import Typography from "@mui/material/Typography";
import { headerLoadChanged } from "app/store/headerLoadSlice";
import moment from "moment";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { formatSentence } from "src/app/services/Utility";
import queryString from "query-string";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSort } from '@fortawesome/free-solid-svg-icons';
import { faSortUp } from '@fortawesome/free-solid-svg-icons';
import { faSortDown } from '@fortawesome/free-solid-svg-icons';
import "flatpickr/dist/themes/material_green.css";
import DatePicker from "src/app/main/apps/calendar/DatePicker";
import Flatpickr from "react-flatpickr";

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
threeDaysAgo.setDate(todayDate.getDate() - 2);
threeDaysAgo.setHours(0, 0, 0, 0);

function UserListApp() {
  const dispatch = useDispatch();
  const user_id = DataHandler.getFromSession("user_id");
  const role = jwtDecode(DataHandler.getFromSession("accessToken"))["data"];
  const [userList, setUserList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uid, setUid] = useState("");
  const [uidName, setUidName] = useState("");
  const [requested_amount, setrequested_amount] = useState(0);
  const [withdraw_amount, setwithdraw_amount] = useState(0);
  const [userListCount, setUserListCount] = useState(0);

  const { search } = window.location;

  const { agent } = queryString.parse(search);
  const [affiliateAgent, setAffiliateAgent] = useState(agent || "");

  const [agentt, setagent] = useState("");
  const [selectLocale] = useSelector((state) => [state.locale.selectLocale]);
  const [headerLoad] = useSelector((state) => [state.headerLoad.headerLoad]);
  const [selectedLang, setSelectedLang] = useState(locale.ko);

  const [startDate, setStartDate] = useState(threeDaysAgo);
  const [endDate, setEndDate] = useState(todayDate);

  const [sumArray, setSumArray] = useState("");

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
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const [age, setAge] = React.useState("");

  const handleChange = (event) => {
    setAge(event.target.value);
  };

  useEffect(() => {
    getUserList();
  }, [page, rowsPerPage]);

  const [loaded, setLoaded] = useState(false);
  const [loading1, setLoading1] = useState(true);
  const [loading2, setLoading2] = useState(true);

  useEffect(() => {
    if (role["role"] == "admin" || role["role"] == "cs") {
      if (loading1 == false) {
        setLoaded(false);
      }
    } else {
      if (loading2 == false) {
        setLoaded(false);
      }
    }
  }, [loading1, loading2]);

  useEffect(() => {
    if (selectLocale == "ko") {
      setSelectedLang(locale.ko);
    } else {
      setSelectedLang(locale.en);
    }
  }, [selectLocale]);

  const [casino_user, setCasinoUser] = useState("");

  const [user, setUser] = useState("");

  const [userDetails, setUserDetails] = useState("");

  const getUserDetails = () => {
    APIService({
      url: `${process.env.REACT_APP_R_SITE_API}/user/details?user_id=${user_id}`,
      method: "GET",
    })
      .then((data) => {
        setUserDetails(data.data.data[0]);
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
        // setLoading3(false);
      });
  };

  useEffect(() => {
    getUserDetails();
  }, []);

  const [loadingHis, _loadingHis] = useState(false);

  const getUserList = (pageNumber) => {
    _loadingHis(true);
    APIService({
      url: `${
        process.env.REACT_APP_R_SITE_API
      }/user/login-history?agent=${affiliateAgent}&pageNumber=${
        page + 1
      }&limit=${rowsPerPage}&startDate=${startDate}&endDate=${endDate}`,
      method: "GET",
    })
      .then((res) => {
        setUserListCount(res.data.tableCount);
        setUserList(res?.data?.data);
        setSumArray(res?.data?.sumRowData);
        if (res["data"]) {
          setLoading(false);
        }
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
        _loadingHis(false);
      });
  };

  const searchUserList = () => {
    setPage(0);
    getUserList();
  };

  function dateFormat(date) {
    var d = new Date(date);
    var date = d.getDate();
    var month = d.getMonth() + 1; // Since getMonth() returns month from 0-11 not 1-12
    var year = d.getFullYear();
    var newDate = year + "-" + month + "-" + date;
    return newDate;
  }

  function timeFormat(dateTime) {
    const regex = /([0-9]{4}-[0-9]{2}-[0-9]{2})?.([:0-9]+)/;
    const result = dateTime.match(regex);
    const resultTime = result[2];
    return resultTime;
  }

  const [open, setOpen] = React.useState(false);
  const handleOpen = (username, name) => {
    setUid(username);
    setUidName(name);
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
    setrequested_amount(0);
  };

  const [openWithdraw, setOpenWithdraw] = React.useState(false);
  const handleOpenWithdraw = (username, name) => {
    setUid(username);
    setUidName(name);
    setOpenWithdraw(true);
  };
  const handleCloseWithdraw = () => {
    setOpenWithdraw(false);
    setwithdraw_amount(0);
  };

  const createPayment = (e) => {
    e.preventDefault();

    if (requested_amount <= 0) {
      dispatch(
        showMessage({
          variant: "info",
          message: `${selectedLang.amount_must_be_more_than}`,
        })
      );
    }

    if (uid == "") {
      dispatch(
        showMessage({
          variant: "error",
          message: `${
            selectedLang.uuid_is_required || selectedLang.something_went_wrong
          }`,
        })
      );
    }

    if (requested_amount > 0 && uid != "") {
      APIService({
        //url: `${process.env.REACT_APP_R_SITE_API}/request-payment/create-casino-payment-by-rsite?uid=${uid}&amount=${requested_amount}`,
        url: `${
          process.env.REACT_APP_R_SITE_API
        }/transaction/create?amount=${requested_amount}&transaction_type=deposit&transaction_relation=${
          role["role"] == "admin" || role["role"] == "cs"
            ? "admin_casino"
            : "agent_casino"
        }&to_user_id=${uid}`,
        method: "POST",
      })
        .then((data) => {
          setwithdraw_amount(0);
          setrequested_amount(0);
          dispatch(
            headerLoadChanged({
              headerLoad: !headerLoad,
            })
          );
          getUserList();
          setOpen(false);
          dispatch(
            showMessage({
              variant: "success",
              message: `${selectedLang.payment_success}`,
            })
          );
        })
        .catch((err) => {
          setOpen(false);
          setwithdraw_amount(0);
          setrequested_amount(0);
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
        .finally(() => {});
    }
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

    if (uid == "") {
      dispatch(
        showMessage({
          variant: "error",
          message: `${
            selectedLang.uuid_is_required || selectedLang.something_went_wrong
          }`,
        })
      );
    }

    if (withdraw_amount > 0 && uid != "") {
      APIService({
        //url: `${process.env.REACT_APP_R_SITE_API}/request-withdraw/create-casino-withdraw-by-rsite?uid=${uid}&amount=${withdraw_amount}`,
        url: `${
          process.env.REACT_APP_R_SITE_API
        }/transaction/create?amount=${withdraw_amount}&transaction_type=withdraw&transaction_relation=${
          role["role"] == "admin" || role["role"] == "cs"
            ? "admin_casino"
            : "agent_casino"
        }&to_user_id=${uid}`,
        method: "POST",
      })
        .then((data) => {
          setwithdraw_amount(0);
          setrequested_amount(0);
          dispatch(
            headerLoadChanged({
              headerLoad: !headerLoad,
            })
          );
          getUserList();
          setOpenWithdraw(false);
          dispatch(
            showMessage({
              variant: "success",
              message: `${selectedLang.payment_success}`,
            })
          );
        })
        .catch((err) => {
          setOpenWithdraw(false);
          setwithdraw_amount(0);
          setrequested_amount(0);
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
        .finally(() => {});
    }
  };

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

  const columns = [
    {
      id: "number",
      label: `${selectedLang.number}`,
      minWidth: 50,
      numeric: true,
      disablePadding: false,
    },
    { id: "loginIp", label: `${selectedLang.user_id}`, minWidth: 50 },
    { id: "loginPer", label: `${selectedLang.login_person}`, minWidth: 50 },
    { id: "lp", label: `${selectedLang.login_ip}`, minWidth: 50 },
    { id: "lb", label: `${selectedLang.login_browser}`, minWidth: 50 },
    {
      id: "lbv",
      label: `${selectedLang.login_browser_version}`,
      minWidth: 100,
    },
    {
      id: "ls",
      label: `${selectedLang.login_system}`,
      minWidth: 100,
      format: (value) => value.toLocaleString("en-US"),
    },
    {
      id: "ld",
      label: `${selectedLang.login_date}`,
      minWidth: 100,
      format: (value) => value.toLocaleString("en-US"),
    },
    {
      id: "lod",
      label: `${selectedLang.logout_date}`,
      minWidth: 100,
      format: (value) => value.toLocaleString("en-US"),
    },
    {
      id: "log_status",
      label: `${selectedLang.login_status}`,
      minWidth: 100,
      format: (value) => value.toLocaleString("en-US"),
    },
    {
      id: "rg",
      label: `${selectedLang.reg_date} `,
      minWidth: 100,
      format: (value) => value.toLocaleString("en-US"),
    },
  ];

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
  const getSortIconBet = (order) => {
    return order === "asc" ? (
      <FontAwesomeIcon icon={faSortUp} className="sort-icon" />
    ) : order === "desc" ? (
      <FontAwesomeIcon icon={faSortDown} className="sort-icon" />
    ) : (
      <FontAwesomeIcon icon={faSort} className="sort-icon" />
    );
  };

  const getSortIconWin = (order) => {
    return order === "asc" ? (
      <FontAwesomeIcon icon={faSortUp} className="sort-icon" />
    ) : order === "desc" ? (
      <FontAwesomeIcon icon={faSortDown} className="sort-icon" />
    ) : (
      <FontAwesomeIcon icon={faSort} className="sort-icon" />
    );
  };

  const getSortIconProfit = (order) => {
    return order === "asc" ? (
      <FontAwesomeIcon icon={faSortUp} className="sort-icon" />
    ) : order === "desc" ? (
      <FontAwesomeIcon icon={faSortDown} className="sort-icon" />
    ) : (
      <FontAwesomeIcon icon={faSort} className="sort-icon" />
    );
  };

  const getSortIconCurrent = (order) => {
    return order === "asc" ? (
      <FontAwesomeIcon icon={faSortUp} className="sort-icon" />
    ) : order === "desc" ? (
      <FontAwesomeIcon icon={faSortDown} className="sort-icon" />
    ) : (
      <FontAwesomeIcon icon={faSort} className="sort-icon" />
    );
  };

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

  const [sortOrder_bet, setSortOrder_bet] = useState("");
  const [sortOrder_win, setSortOrder_win] = useState("");
  const [sortOrder_profit, setSortOrder_profit] = useState("");
  const [sortOrder_current, setSortOrder_current] = useState("");

  const [sortBy, setSortBy] = useState("name"); // Default sorting column
  const [sortOrder, setSortOrder] = useState(""); // Default sorting order

  const handleSort = (column) => {
    if (
      column == "bet" ||
      column == "win" ||
      column == "profit" ||
      column == "current"
    ) {
      if (column === "bet") {
        setSortBy("bet");
        setSortOrder_bet(
          sortOrder === "asc" ? "desc" : sortOrder === "desc" ? "" : "asc"
        );
        setSortOrder(
          sortOrder === "asc" ? "desc" : sortOrder === "desc" ? "" : "asc"
        );
      } else if (column === "win") {
        setSortBy("win");
        setSortOrder_win(
          sortOrder === "asc" ? "desc" : sortOrder === "desc" ? "" : "asc"
        );
        setSortOrder(
          sortOrder === "asc" ? "desc" : sortOrder === "desc" ? "" : "asc"
        );
      } else if (column == "profit") {
        setSortBy("profit");
        setSortOrder_profit(
          sortOrder === "asc" ? "desc" : sortOrder === "desc" ? "" : "asc"
        );
        setSortOrder(
          sortOrder === "asc" ? "desc" : sortOrder === "desc" ? "" : "asc"
        );
      } else {
        setSortBy("current");
        setSortOrder_current(
          sortOrder === "asc" ? "desc" : sortOrder === "desc" ? "" : "asc"
        );
        setSortOrder(
          sortOrder === "asc" ? "desc" : sortOrder === "desc" ? "" : "asc"
        );
      }
    }
  };

  const searchHistory = () => {
    setPage(0);
    getUserList();
  };

  const initCopyUserData = [...userList];

  const sortedAndMappedDataUserList =
    sortOrder !== ""
      ? initCopyUserData.sort((a, b) => {
          if (sortBy === "bet") {
            return sortOrder === "asc"
              ? a?.CasinoUserData["month_bet"] - b?.CasinoUserData["month_bet"]
              : b.CasinoUserData["month_bet"] - a.CasinoUserData["month_bet"];
          } else if (sortBy == "win") {
            return sortOrder === "asc"
              ? a.CasinoUserData["month_win"] - b.CasinoUserData["month_win"]
              : b.CasinoUserData["month_win"] - a.CasinoUserData["month_win"];
          } else if (sortBy == "profit") {
            return sortOrder === "asc"
              ? a.CasinoUserData["month_profit_amount"] -
                  b.CasinoUserData["month_profit_amount"]
              : b.CasinoUserData["month_profit_amount"] -
                  a.CasinoUserData["month_profit_amount"];
          } else {
            return sortOrder === "asc"
              ? a.CasinoUserData.balance_amount -
                  b.CasinoUserData.balance_amount
              : b.CasinoUserData.balance_amount -
                  a.CasinoUserData.balance_amount;
          }
        })
      : initCopyUserData;

  const renderUserlist = () => {
    return (
      <TableBody>
        {userList
          // .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
          .map((user, index) => (
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
                {user?.username}
              </TableCell>
              <TableCell
                sx={{
                  textAlign: "center",
                }}>
                {user?.login_person}
              </TableCell>
              <TableCell
                sx={{
                  textAlign: "center",
                }}>
                {user?.login_ip}
              </TableCell>
              <TableCell
                sx={{
                  textAlign: "center",
                }}>
                {user?.login_browser}
              </TableCell>
              <TableCell
                sx={{
                  textAlign: "center",
                }}>
                {user?.login_browser_version}
              </TableCell>
              <TableCell
                sx={{
                  textAlign: "center",
                }}>
                {user?.login_system}
              </TableCell>
              <TableCell
                sx={{
                  textAlign: "center",
                }}>
                {moment(user?.login_date).format("YYYY/MM/DD HH:mm:ss")}
              </TableCell>

              <TableCell
                sx={{
                  textAlign: "center",
                }}>
                {user?.logout_date != null
                  ? moment(user?.logout_date).format("YYYY/MM/DD HH:mm:ss")
                  : "--"}
              </TableCell>

              <TableCell
                sx={{
                  textAlign: "center",
                }}>
                {user?.login_status == false ? (
                  <span style={{ color: "red" }}>{selectedLang.fail}</span>
                ) : (
                  <span style={{ color: "green" }}>{selectedLang.success}</span>
                )}
              </TableCell>
              <TableCell
                sx={{
                  textAlign: "center",
                }}>
                {moment(user?.reg_date).format("YYYY/MM/DD HH:mm:ss")}
              </TableCell>
            </StyledTableRow>
          ))}
      </TableBody>
    );
  };


  const onDataFilter = (startDate, endDate) => {
    // console.log(startDate, endDate);
    setEndDate(endDate);
    setStartDate(startDate);
  };


  return (
		<>
			{' '}
			{loaded ? (
				<FuseLoading />
			) : (
				<FusePageSimple
					header={<LoginHistoryHeader selectedLang={selectedLang} />}
					content={
						<>
							<Card
								sx={{ width: '100%', marginTop: '20px', borderRadius: '4px' }}
								className='main_card'>
								<Modal
									open={open}
									onClose={handleClose}
									className='small_modal'
									aria-labelledby='modal-modal-title'
									aria-describedby='modal-modal-description'>
									<Box sx={style} className='Mymodal'>
										<Typography
											id='modal-modal-title'
											variant='h5'
											component='h2'
											style={{ fontWeight: '700' }}>
											{selectedLang.create_payment}
										</Typography>
										<div>
											<Grid
												key={'grid-main'}
												container
												rowSpacing={1}
												columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
												<Grid xs={12} md={12} key={'grid-sub'}>
													<Grid
														key={'grid1'}
														container
														spacing={3}
														sx={{
															marginTop: '0px',
															justifyContent: 'flex-end',
														}}>
														<Grid
															xs={12}
															md={12}
															key={'grid3'}
															style={{
																display: 'flex',
																alignItems: 'center',
																width: '100%',
																paddingTop: '0',
															}}>
															<Typography
																id='modal-modal-title'
																style={{ fontSize: '16px' }}>
																{selectedLang.casino_users} : {uidName}
															</Typography>
														</Grid>

														<Grid
															xs={12}
															md={12}
															key={'grid4'}
															style={{ width: '100%' }}>
															<TextField
																type='text'
																fullWidth
																size='small'
																label={selectedLang.amount}
																value={formatAmount(requested_amount)}
																color='primary'
																// onChange={(e) =>
																//   setrequested_amount(Number(e.target.value))
																// }
																onChange={(e) => {
																	const inputValue = e.target.value;
																	const numericValue = inputValue.replace(
																		/[^0-9.]/g,
																		''
																	);
																	setrequested_amount(numericValue);
																}}
															/>
														</Grid>
														<Grid
															key={'grid6'}
															xs={12}
															md={12}
															style={{ width: '100%', paddingTop: '0' }}>
															{' '}
															<Button
																key={'button-1'}
																className='flex justify-center'
																variant='contained'
																color='secondary'
																style={{ width: '100%' }}
																endIcon={
																	<DoneIcon
																		key={'deone-icon'}
																		size={20}></DoneIcon>
																}
																sx={{
																	borderRadius: '4px',
																}}
																onClick={(e) => createPayment(e)}>
																{selectedLang.payment}
															</Button>
														</Grid>
													</Grid>
												</Grid>
											</Grid>
										</div>
									</Box>
								</Modal>
								<Modal
									open={openWithdraw}
									onClose={handleCloseWithdraw}
									className='small_modal'
									aria-labelledby='modal-modal-title'
									aria-describedby='modal-modal-description'>
									<Box sx={style} className='Mymodal'>
										<Typography
											id='modal-modal-title'
											variant='h5'
											component='h2'
											style={{ fontWeight: '700' }}>
											{selectedLang.create_withdraw}
										</Typography>
										<div className=''>
											<Grid
												key={'grid-main'}
												container
												rowSpacing={1}
												columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
												<Grid xs={12} md={12} key={'grid-sub'}>
													<Grid
														key={'grid1'}
														container
														spacing={3}
														sx={{
															marginTop: '0px',
															justifyContent: 'flex-end',
														}}>
														<Grid
															xs={12}
															md={12}
															key={'grid3'}
															style={{
																display: 'flex',
																alignItems: 'center',
																width: '100%',
																paddingTop: '0',
															}}>
															<Typography
																id='modal-modal-title'
																style={{ fontSize: '16px' }}>
																{selectedLang.casino_users} :
																<span
																	style={{
																		fontWeight: '600',
																		paddingLeft: '6px',
																		color: '#000',
																	}}>
																	{uidName}
																</span>
															</Typography>
														</Grid>
														<Grid
															xs={12}
															md={12}
															key={'grid4'}
															style={{ width: '100%' }}>
															<TextField
																type='text'
																fullWidth
																label={selectedLang.amount}
																color='primary'
																size='small'
																// onChange={(e) =>
																//   setwithdraw_amount(Number(e.target.value))
																// }
																value={formatAmount(withdraw_amount)}
																onChange={(e) => {
																	const inputValue = e.target.value;
																	const numericValue = inputValue.replace(
																		/[^0-9.]/g,
																		''
																	);
																	setwithdraw_amount(Number(numericValue));
																}}
															/>
														</Grid>
														<Grid
															key={'grid6'}
															xs={12}
															md={12}
															style={{ width: '100%', paddingTop: '0' }}>
															{' '}
															<Button
																key={'button-1'}
																className='flex justify-cebter'
																variant='contained'
																color='secondary'
																style={{ width: '100%' }}
																endIcon={
																	<DoneIcon
																		key={'deone-icon'}
																		size={20}></DoneIcon>
																}
																sx={{
																	borderRadius: '4px',
																}}
																onClick={(e) => createWithdraw(e)}>
																{selectedLang.withdraw}
															</Button>
														</Grid>
													</Grid>
												</Grid>
											</Grid>
										</div>
									</Box>
								</Modal>
								<div className='flex justify-start justify-items-center flex-col bg-gray p-16 w-100'>
									<div className='flex justify-items-center items-center'>
										<span className='list-title'>{selectedLang.USERLIST}</span>{' '}
										<Chip
											label={userList ? userList.length : 0}
											size='small'
											color='secondary'
											sx={{ marginLeft: '10px' }}
										/>
									</div>
									{/* <div>
                <span className="small-text">
                  This month's history shows the total 07-01 00:00:00 ~ 07-19
                  23:59:59.
                </span>
              </div> */}
								</div>

								{/* <div className="row flex justify-end justify-items-center">
              <div className="col-lg-2 col-md-4 col-sm-4 p-10 flex item-center">
                <InputBase
                  sx={{
                    ml: 1,
                    flex: 1,
                    border: "1px solid #cdcfd3",
                    borderRadius: "4px",
                    padding: "4px",
                  }}
                  placeholder={selectedLang.Affiliated_Agent_ID}
                  inputProps={{ "aria-label": "Affiliated Agent ID" }}
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
                  }}
                  placeholder={selectedLang.user_id}
                  inputProps={{ "aria-label": "User ID" }}
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

								<div
									className='row flex justify-end justify-items-center flex-wrap z-index-10'
									style={{
										flexWrap: 'wrap',
										paddingBottom: '0',
										paddingTop: '0',
									}}>
									<div
										className='p-10 flex item-center calender'
										style={{ paddingLeft: '0' }}>
										<div className='datepikers newdate_picker'>
											{/* <DateTimePicker
                        className="datetimePiker"
                        placeholder={"Start Date"}
                        size="small"
                        value={startDate}
                        inputFormat="yyyy/MM/dd HH:mm:ss"
                        onChange={(date) => setStartDate(date)}
                        // onChange={handleStartDateChange }
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            placeholder={selectedLang.end_date}
                          />
                        )}
                      /> */}
											{/* <div className="px-5"> - </div> */}
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

											<div className='d-flex datebox_wrapper'>
												{/* <Flatpickr
													options={{
														locale: selectedLang.calander,
													}}
													data-enable-time
													value={startDate}
													onChange={(date) => setStartDate(date)}
												/>
												<div className='text-white'> - </div>
												<Flatpickr
													options={{
														locale: selectedLang.calander,
													}}
													data-enable-time
													value={endDate}
													onChange={(date) => setEndDate(date)}
												/> */}
                         <DatePicker onDataFilter={onDataFilter} />
											</div>
											{/* 
											<Tooltip
												title={selectedLang.yesterday}
												placement='top'
												arrow> */}
											{/* <Button
												className='flex item-center mybutton smaller'
												variant='contained'
												color='secondary'
												sx={{
													borderRadius: '4px',
													margin: '0 3px', // Adjust the margin value as needed
													fontSize: '70%', // Reduce font size to make the text smaller
													padding: '3px 8px', // Reduce padding to make the button smaller
													height: '24px', // Reduce height to make the button smaller
												}}
												onClick={handleCLickOneHour}>
												1 {selectedLang.hour}
											</Button> */}

											{/* <Button
												className='flex item-center mybutton smaller'
												variant='contained'
												color='secondary'
												sx={{
													borderRadius: '4px',
													margin: '0 3px', // Adjust the margin value as needed
													fontSize: '70%', // Reduce font size to make the text smaller
													padding: '3px 8px', // Reduce padding to make the button smaller
													height: '24px', // Reduce height to make the button smaller
												}}
												onClick={handleClickSixHour}>
												6 {selectedLang.hour}
											</Button> */}

											{/* <Button
												className='flex item-center mybutton smaller'
												variant='contained'
												color='secondary'
												sx={{
													borderRadius: '4px',
													margin: '0 3px', // Adjust the margin value as needed
													fontSize: '70%', // Reduce font size to make the text smaller
													padding: '3px 8px', // Reduce padding to make the button smaller
													height: '24px', // Reduce height to make the button smaller
												}}
												onClick={handleTodayClick}>
												{selectedLang.today}
											</Button> */}

											{/* <Button
												className='flex item-center mybutton smaller'
												variant='contained'
												color='secondary'
												sx={{
													borderRadius: '4px',
													margin: '0 3px', // Adjust the margin value as needed
													fontSize: '70%', // Reduce font size to make the text smaller
													padding: '3px 8px', // Reduce padding to make the button smaller
													height: '24px', // Reduce height to make the button smaller
												}}
												onClick={handleYesterdayClick}>
												{selectedLang.yesterday}
											</Button> */}
											{/* </Tooltip> */}
										</div>
									</div>

									<div className='col-lg-2 col-md-4 col-sm-4 flex item-center searchall'>
										<div className='col-lg-8 col-md-4 col-sm-4 flex item-center'>
											<InputBase
												sx={{
													ml: 1,
													flex: 1,
													border: '1px solid #cdcfd3',
													borderRadius: '4px',
													padding: '4px 10px',
													marginRight: '0px',
												}}
												placeholder={selectedLang.user_id}
												value={affiliateAgent}
												onChange={(e) => setAffiliateAgent(e.target.value)}
												inputProps={{ 'aria-label': selectedLang.user_id }}
											/>
										</div>
										<Button
											className='flex item-center'
											variant='contained'
											color='secondary'
											onClick={() => {
												// getAdminRequest();
												// getSubAgentPaymentHistory();
												// getAgentPaymentHistory();
												searchHistory();
											}}
											endIcon={<SearchIcon size={20}></SearchIcon>}
											sx={{
												borderRadius: '4px',
												marginLeft: '10px',
											}}>
											{selectedLang.date_search}
										</Button>
									</div>
								</div>

								<div>
									<CardContent>
										<Paper
											sx={{
												width: '100%',
												overflow: 'hidden',
												borderRadius: '4px',
											}}>
											<TableContainer>
												<Table stickyHeader aria-label='customized table'>
													<TableHead>
														<TableRow>
															{columns
																.filter(
																	(column) =>
																		!(
																			column.id == 'currentAction' &&
																			userDetails.canPayment != true
																		)
																)
																.map((column) => (
																	<StyledTableCell
																		sx={{
																			textAlign: 'center',
																			cursor:
																				column.id === 'bet' ||
																				column.id === 'win' ||
																				column.id === 'profit' ||
																				column.id == 'current'
																					? 'pointer'
																					: 'default',
																		}}
																		key={column.id}
																		align={column.align}
																		style={{ minWidth: column.minWidth }}
																		onClick={() => handleSort(column.id)}>
																		{column.label}
																		{column.id == 'bet'
																			? getSortIconBet(sortOrder_bet)
																			: column.id == 'win'
																			? getSortIconWin(sortOrder_win)
																			: column.id == 'profit'
																			? getSortIconCurrent(sortOrder_profit)
																			: column.id == 'current'
																			? getSortIconCurrent(sortOrder_current)
																			: ''}
																	</StyledTableCell>
																))}
														</TableRow>
													</TableHead>
													{renderUserlist()}
												</Table>

												{!userList.length > 0 && !loadingHis && (
                          <div
                          style={{
                            textAlign: 'center',
                            color:'#fff',
                            padding: '0.95rem',
                          }}>
														{selectedLang.no_data_available_in_table}
													</div>
												)}
                         {loadingHis && <FuseLoading />}
											</TableContainer>
											<TablePagination
												labelRowsPerPage={selectedLang.rows_per_page}
												rowsPerPageOptions={[20, 50, 100, 200, 500]}
												component='div'
												count={userListCount}
												rowsPerPage={rowsPerPage}
												page={page}
												onPageChange={handleChangePage}
												onRowsPerPageChange={handleChangeRowsPerPage}
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

export default UserListApp;
