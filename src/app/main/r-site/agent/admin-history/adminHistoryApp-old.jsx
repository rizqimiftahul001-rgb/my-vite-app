/** @format */

import * as React from "react";
import FusePageSimple from "@fuse/core/FusePageSimple";
import TransactionHistoryHeader from "./adminHistoryHeader";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { locale } from "../../../../configs/navigation-i18n";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { Button } from "@mui/material";
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
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";

import InputBase from "@mui/material/InputBase";
import SearchIcon from "@mui/icons-material/Search";
import APIService from "src/app/services/APIService";
import DataHandler from "src/app/handlers/DataHandler";
import jwtDecode from "jwt-decode";
import FuseLoading from "@fuse/core/FuseLoading";
import { showMessage } from "app/store/fuse/messageSlice";
import { CSVLink } from "react-csv";
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
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

function transactionHistoryApp() {
  const [status, setType] = useState("");
  const [agentFilterValue, setAgentName] = useState("");
  const [betData2, setBetData2] = useState();
  const [agentList, setAgentList] = useState([]);
  const role = jwtDecode(DataHandler.getFromSession("accessToken"))["data"];
  const user_id = DataHandler.getFromSession("user_id");
  const payment_type = "Sub Agent Deposit";
  const [selectLocale] = useSelector((state) => [state.locale.selectLocale]);
  const [selectedLang, setSelectedLang] = useState(locale.en);
  const [adminrequest, setAdminRequest] = useState("");
  // const [agentFilterValue, setAgentFilterValue] = useState("");
  // const [status, setStatus] = useState("");
  const [subAgentDepositHistoryData, setSubAgentDepositHistoryData] =
    useState("");
  const [agentDepositHistoryData, setAgentDepositHistoryData] = useState("");

  const dispatch = useDispatch();
  const [loaded, setLoaded] = useState(true);
  const [loading1, setLoading1] = useState(true);
  const [loading2, setLoading2] = useState(true);
  const [loading3, setLoading3] = useState(true);

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

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const [value, setValue] = React.useState("1");

  const handleChange2 = (event, newValue) => {
    setValue(newValue);
  };

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
    if (role["role"] != "admin") {
      setSubAgentDepositHistoryData("");
      getAgentPaymentHistory();
      setAgentDepositHistoryData("");
      getSubAgentPaymentHistory();
    }
    if (role["role"] == "admin" || role["role"] == "cs") {
      getAdminRequest();
    }
  }, [page, rowsPerPage, selectedLang]);

  const [adminrequestTableCount, _adminrequestTableCount] = useState(0);
  const getAdminRequest = (pageNumber) => {
    APIService({
      url: `${process.env.REACT_APP_R_SITE_API
        }/user/all-request-list?user_id=${user_id}&agent=${agentFilterValue}&status=${status}&limit=${rowsPerPage}&pageNumber=${page + 1
        }`,
      method: "GET",
    })
      .then((res) => {
        setAdminRequest(res.data.data);
        _adminrequestTableCount(res.data.tableCount);
      })
      .catch((err) => {
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
        setLoading3(false);
      });
  };

  const [subAgentTableCount, _subAgentTableCount] = useState(0);
  const getSubAgentPaymentHistory = (pageNumber) => {
    APIService({
      url: `${process.env.REACT_APP_R_SITE_API
        }/user/childrpoints-list?user_id=${user_id}&agent_name=${agentFilterValue}&status=${status}&limit=${rowsPerPage}&pageNumber=${page + 1
        }`,
      method: "GET",
    })
      .then((res) => {
        setSubAgentDepositHistoryData(res.data.data);
        _subAgentTableCount(res?.data?.tableCount);
      })
      .catch((err) => {
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

  const getAgentPaymentHistory = (pageNumber) => {
    APIService({
      url: `${process.env.REACT_APP_R_SITE_API
        }/payment/get-payment?user_id=${user_id}&payment_type=${payment_type}&agent_name=${agentFilterValue}&limit=${rowsPerPage}&pageNumber=${page + 1
        }`,
      method: "GET",
    })
      .then((res) => {
        setAgentDepositHistoryData(res.data.data);
      })
      .catch((err) => {
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
      });
  };

  const AdminColumns = [
    { id: "name", label: `${selectedLang.number}`, minWidth: 50 },
    { id: "code", label: `${selectedLang.agent_name}`, minWidth: 100 },
    {
      id: "population",
      label: `${selectedLang.receving_user_name}`,
      minWidth: 170,
    },
    {
      id: "size",
      label: `${selectedLang.point_amount}`,
      minWidth: 170,
      format: (value) => value.toLocaleString("en-US"),
    },
    {
      id: "density",
      label: `${selectedLang.status}`,
      minWidth: 170,
    },
    {
      id: "date",
      label: `${selectedLang.date}`,
      minWidth: 100,
    },
  ];

  const userColumns0 = [
    { id: "name", label: `${selectedLang.Req_ID}`, minWidth: 50 },
    { id: "code", label: `${selectedLang.user_id}`, minWidth: 100 },
    {
      id: "population",
      label: `${selectedLang.parent_id}`,
      minWidth: 170,
    },
    {
      id: "size",
      label: `${selectedLang.noOfpoint}`,
      minWidth: 170,
      format: (value) => value.toLocaleString("en-US"),
    },
    {
      id: "density",
      label: `${selectedLang.status}`,
      minWidth: 170,
    },
    {
      id: "date",
      label: `${selectedLang.date}`,
      minWidth: 100,
    },
  ];

  const userColumns1 = [
    { id: "name", label: `${selectedLang.Req_ID}`, minWidth: 50 },
    { id: "code", label: `${selectedLang.user_id}`, minWidth: 100 },
    {
      id: "population",
      label: `${selectedLang.parent_id}`,
      minWidth: 170,
    },
    {
      id: "size",
      label: `${selectedLang.payment_amount}`,
      minWidth: 170,
      format: (value) => value.toLocaleString("en-US"),
    },
    {
      id: "density",
      label: `${selectedLang.balance_after_payment}`,
      minWidth: 170,
    },
    {
      id: "date",
      label: `${selectedLang.date}`,
      minWidth: 100,
    },
  ];

  const searchHistory = async () => {
    if (role["role"] == "admin" || role["role"] == "cs") {
      if (agentFilterValue.length > 0 || status.length > 0) {
        getAdminRequest(true);
      } else {
        getAdminRequest(false);
      }
    } else {
      if (agentFilterValue.length > 0 || status.length > 0) {
        getSubAgentPaymentHistory(true);
        getAgentPaymentHistory(true);
      } else {
        getSubAgentPaymentHistory(false);
        getAgentPaymentHistory(true);
      }
    }
  };

  const addAdminData = () => {
    if (adminrequest) {
      return (
        <TableBody>
          {adminrequest
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
                    {data?.parentDetails[0]?.id}
                  </TableCell>
                  <TableCell
                    sx={{
                      textAlign: "center",
                    }}>
                    {data?.userDetails[0]?.id}
                  </TableCell>
                  <TableCell
                    sx={{
                      textAlign: "center",
                    }}>
                    <span className="font-16">
                      {Number(data?.point_amount)?.toLocaleString()}
                    </span>
                  </TableCell>
                  <TableCell
                    sx={{
                      textAlign: "center",
                      fontWeight: "600",
                      color: data?.status ? "green" : "red",
                    }}>
                    {data.status
                      ? `${selectedLang.approved}`
                      : `${selectedLang.not_approved}`}
                  </TableCell>
                  <TableCell
                    sx={{
                      textAlign: "center",
                    }}>
                    {formatLocalDateTime(data.created_at)}
                    {/* {moment(data.created_at)?.format("YYYY/MM/DD HH:mm:ss")} */}
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

  const addUserSubAgentPaymentData = () => {
    if (subAgentDepositHistoryData) {
      return (
        <TableBody>
          {subAgentDepositHistoryData
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
                    {data?.childDetails[0]?.id}
                  </TableCell>
                  <TableCell
                    sx={{
                      textAlign: "center",
                    }}>
                    {data?.userDetails[0]?.id}
                  </TableCell>
                  <TableCell
                    sx={{
                      textAlign: "center",
                    }}>
                    {Number(data?.point_amount)?.toLocaleString()}
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

  const addUserCreationPaymentData = () => {
    if (agentDepositHistoryData) {
      return (
        <TableBody>
          {agentDepositHistoryData
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
                    {data?.buyer_id}
                  </TableCell>
                  <TableCell
                    sx={{
                      textAlign: "center",
                    }}>
                    {data?.id}
                  </TableCell>
                  <TableCell
                    sx={{
                      textAlign: "center",
                    }}>
                    {Number(data?.amount)?.toLocaleString()}
                  </TableCell>
                  <TableCell
                    sx={{
                      textAlign: "center",
                    }}>
                    {data.balanceAfterPayment}
                  </TableCell>
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

  const csvHeadersubAgentDepositHistoryData = [
    { label: "User Id", key: "userId" },
    { label: "Parent Id", key: "parentId" },
    { label: "No: of Point", key: "point_amount" },
    { label: "Status", key: "status" },
    { label: "date", key: "created_at" },
  ];

  const csvHeaderUserithdrawalHistoryData = [
    { label: "User Id", key: "buyer_id" },
    { label: "Parent Id", key: "id" },
    { label: "Payment Amount", key: "amount" },
    { label: "Balance After Payment", key: "balanceAfterPayment" },
    { label: "Date", key: "created_at" },
  ];

  const subAgentDepositHistoryDataCSV =
    subAgentDepositHistoryData.length > 0 &&
    subAgentDepositHistoryData.map((item) => ({
      Status: item.status ? selectedLang.approved : selectedLang.not_approved,
      userId: item.childDetails[0]?.id,
      parentId: item?.userDetails[0]?.id,
      point_amount: item?.point_amount,
      created_at: moment(item?.created_at).format("YYYY/MM/DD HH:mm:ss"),
      // created_at: dateFormat(item?.created_at),
    }));

  const agentDepositHistoryDataCsv =
    agentDepositHistoryData.length > 0 &&
    agentDepositHistoryData.map((item) => ({
      buyer_id: item.buyer_id,
      id: item.id,
      amount: item.amount,
      balanceAfterPayment: item.balanceAfterPayment,
      created_at: moment(item?.created_at).format("YYYY/MM/DD HH:mm:ss"),
      // created_at: dateFormat(item?.created_at),
    }));

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
              csv_data={
                value == 1
                  ? subAgentDepositHistoryDataCSV
                  : agentDepositHistoryDataCsv
              }
              csv_header={
                value == 1
                  ? csvHeadersubAgentDepositHistoryData
                  : csvHeaderUserithdrawalHistoryData
              }
              csv_filename={`${value == 1 ? "user_deposite.csv" : "user_withdrawal.csv"
                }`}
            />
          }
          content={
            <Card
              sx={{ width: "100%", marginTop: "20px", borderRadius: "4px" }}
              className="main_card">
              {/* <CardHeader
              title="List of Admin Transaction Details"
              className="list-title"
              action={
                <Chip
                  label="14"
                  size="small"
                  color="primary"
                  sx={{ position: "absolute", left: "290px", top: "34px" }}
                />
              }
            ></CardHeader> */}
              <div
                className="flex justify-start justify-between bg-gray p-16 w-100"
                style={{ display: "none" }}>
                <div className="flex justify-start items-center">
                  <span className="list-title">
                    {selectedLang.Agent_listofAdmin}
                  </span>
                  {(role["role"] == "admin" || role["role"] == "cs") && (
                    <Chip
                      label={adminrequest.length}
                      size="small"
                      color="secondary"
                      sx={{ marginLeft: "10px" }}
                    />
                  )}
                  {role["role"] != "admin" &&
                    subAgentDepositHistoryData &&
                    value == 1 && (
                      <Chip
                        label={subAgentDepositHistoryData.length}
                        size="small"
                        color="secondary"
                        sx={{ marginLeft: "10px" }}
                      />
                    )}
                  {role["role"] != "admin" &&
                    agentDepositHistoryData &&
                    value == 2 && (
                      <Chip
                        label={agentDepositHistoryData.length}
                        size="small"
                        color="secondary"
                        sx={{ marginLeft: "10px" }}
                      />
                    )}
                </div>
              </div>
              <div
                className="row flex justify-end justify-items-center"
                style={{ padding: "18px 18px 0", gap: "10px" }}>
                {/* <div className="col-lg-2 col-md-4 col-sm-4 p-10"></div> */}
                {value == 1 && (
                  <div className="">
                    <FormControl sx={{ minWidth: 120 }} size="small">
                      <InputLabel id="demo-select-small">
                        {selectedLang.type}
                      </InputLabel>
                      <Select
                        labelId="demo-select-small"
                        id="demo-select-small"
                        value={status}
                        label="Type"
                        onChange={(e) => setType(e.target.value)}>
                        <MenuItem value={"All"}>{selectedLang.all}</MenuItem>
                        <MenuItem value={"Approved"}>
                          {selectedLang.approved}
                        </MenuItem>
                        <MenuItem value={"Declined"}>
                          {selectedLang.not_approved}
                        </MenuItem>
                      </Select>
                    </FormControl>
                  </div>
                )}
                <div className="">
                  <InputBase
                    sx={{
                      flex: 1,
                      border: "1px solid #cdcfd3",
                      borderRadius: "4px",
                      padding: "4px 10px",
                      width: "100%",
                    }}
                    placeholder={selectedLang.parent_id}
                    value={agentFilterValue}
                    onChange={(e) => setAgentName(e.target.value)}
                    inputProps={{ "aria-label": "Agent Name" }}
                  />
                </div>
                <div className="">
                  <Button
                    className="flex item-center"
                    variant="contained"
                    color="secondary"
                    endIcon={<SearchIcon size={20}></SearchIcon>}
                    sx={{
                      borderRadius: "4px",
                    }}
                    onClick={searchHistory}>
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
                    }}>
                    {role["role"] != "admin" && (
                      <>
                        <TabContext value={value}>
                          <Box
                            sx={{ borderBottom: 1, borderColor: "divider" }}
                            className="common-tab">
                            <TabList
                              onChange={handleChange2}
                              aria-label="lab API tabs example">
                              <Tab
                                label={selectedLang.user_deposit}
                                value="1"
                                className="tab_btn"
                              />
                              <Tab
                                label={selectedLang.user_withdrawal}
                                value="2"
                                className="tab_btn"
                              />
                            </TabList>
                          </Box>
                          <TabPanel value="1" className="common_tab_content">
                            <TableContainer>
                              <Table
                                stickyHeader
                                aria-label="customized table">
                                <TableHead>
                                  <TableRow>
                                    {userColumns0.map((column) => (
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
                                {addUserSubAgentPaymentData()}
                              </Table>
                              {!subAgentDepositHistoryData && <FuseLoading />}
                            </TableContainer>
                          </TabPanel>
                          <TabPanel value="2" className="common_tab_content">
                            <TableContainer>
                              <Table
                                stickyHeader
                                aria-label="customized table">
                                <TableHead>
                                  <TableRow>
                                    {userColumns1.map((column) => (
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
                                {addUserCreationPaymentData()}
                              </Table>
                              {!agentDepositHistoryData && <FuseLoading />}
                            </TableContainer>
                          </TabPanel>
                        </TabContext>
                      </>
                    )}
                    {(role["role"] == "admin" || role["role"] == "cs") && (
                      <TableContainer>
                        <Table stickyHeader aria-label="customized table">
                          <TableHead>
                            <TableRow>
                              {AdminColumns.map((column) => (
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
                          {addAdminData()}
                        </Table>
                        {!adminrequest && <FuseLoading />}
                      </TableContainer>
                    )}
                    {role["role"] == "admin" || role["role"] == "cs" ? (
                      <TablePagination
                        rowsPerPageOptions={[5, 10, 25, 100]}
                        component="div"
                        count={adminrequestTableCount}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                        labelRowsPerPage={selectedLang.rows_per_page}
                      />
                    ) : (
                      <TablePagination
                        rowsPerPageOptions={[5, 10, 25, 100]}
                        component="div"
                        count={
                          value == 1
                            ? subAgentTableCount
                            : agentDepositHistoryData.length
                        }
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
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

export default transactionHistoryApp;
