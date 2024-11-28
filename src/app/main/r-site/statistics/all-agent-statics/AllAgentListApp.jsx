/** @format */

import React from "react";
import FusePageSimple from "@fuse/core/FusePageSimple";
import AllAgentListHeader from "./AllAgentListHeader";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { locale } from "../../../../configs/navigation-i18n";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { Button, CardActionArea, CardActions } from "@mui/material";
import "./Agent.css";
import TextField from "@mui/material/TextField";
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
import InputBase from "@mui/material/InputBase";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import jwtDecode from "jwt-decode";
import DataHandler from "src/app/handlers/DataHandler";
import FuseLoading from "@fuse/core/FuseLoading/FuseLoading";
import APIService from "src/app/services/APIService";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import TabPanel from "@mui/lab/TabPanel";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import SearchIcon from "@mui/icons-material/Search";
import queryString from "query-string";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSort } from '@fortawesome/free-solid-svg-icons';
import { faSortUp } from '@fortawesome/free-solid-svg-icons';
import { faSortDown } from '@fortawesome/free-solid-svg-icons';
import "flatpickr/dist/themes/material_green.css";
import Flatpickr from "react-flatpickr";
import { customSortFunction } from "src/app/services/Utility";

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
todayDate.setDate(todayDate.getDate());
todayDate.setHours(23, 59, 59, 999);
// todayDate.setDate(1);

const threeDaysAgo = new Date(todayDate);
threeDaysAgo.setDate(todayDate.getDate() - 2);
threeDaysAgo.setHours(0, 0, 0, 0);

function AllAgentListApp() {
  // const todayDate = new Date();
  // todayDate.setDate(1);

  // const lastDate = new Date();
  // lastDate.setMonth(lastDate.getMonth() + 1, 0);
  const [selectedprovider] = useSelector((state) => [
    state.provider.selectedprovider,
  ]);
  const [filterAgent, setFilterAgent] = useState("");
  const [startDate, setStartDate] = useState(threeDaysAgo);
  const [endDate, setEndDate] = useState(todayDate);
  const [statData, setStatData] = useState([]);
  const user_id = DataHandler.getFromSession("user_id");
  const role = jwtDecode(DataHandler.getFromSession("accessToken"))["data"];

  const [selectLocale] = useSelector((state) => [state.locale.selectLocale]);
  const [selectedLang, setSelectedLang] = useState(locale.en);
  const [loaded, setLoaded] = useState(true);
  const [loading1, setLoading1] = useState(true);
  const [subLoader, setSubLoader] = useState(true);
  const [sumArray, setSumArray] = useState();
  useEffect(() => {
    handleSort("profit_loss");
  }, []);
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

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const [value, setValue] = React.useState("1");
  const handleChange2 = (event, newValue) => {
    setValue(newValue);
  };

  const columns = [
    { id: "vendor", label: `${selectedLang.vendor}`, minWidth: 50 },
    { id: "bet_money", label: `${selectedLang.bet_money}`, minWidth: 50 },
    {
      id: "winning",
      label: `${selectedLang.win_money}`,
      minWidth: 50,
    },
    {
      id: "profit_loss",
      label: `${selectedLang.profit_and_loss_only}`,
      minWidth: 50,
    },
    { id: "no_bet", label: `${selectedLang.no_of_bet}`, minWidth: 50 },
    { id: "no_win", label: `${selectedLang.no_of_wins}`, minWidth: 50 },
  ];
  useEffect(() => {
    const _sumArray = {};
    // Loop through each object in the array
    statData.forEach((obj) => {
      // Loop through each field in the object
      for (const field in obj) {
        const fieldValue = parseFloat(obj[field]);
        // If the field doesn't exist in the sumArray, initialize it with the current value
        if (!_sumArray[field]) {
          _sumArray[field] = fieldValue;
        } else {
          // If the field already exists in the sumArray, add the current value to it
          _sumArray[field] += fieldValue;
        }
      }
    });
    setSumArray(_sumArray);
  }, [statData]);
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
          {Number(sumArray?.bet_money || 0)?.toLocaleString()}
        </TableCell>
        <TableCell
          sx={{
            textAlign: "center",
          }}
        >
          {Number(sumArray?.win_money || 0)?.toLocaleString()}
        </TableCell>
        <TableCell
          sx={{
            textAlign: "center",
            fontWeight: "bold",
          }}
        >
          {Number(sumArray?.profit_or_loss || 0)?.toLocaleString()}
        </TableCell>
        <TableCell
          sx={{
            textAlign: "center",
          }}
        >
          {Number(sumArray?.no_of_bet || 0)?.toLocaleString()}
        </TableCell>
        <TableCell
          sx={{
            textAlign: "center",
          }}
        >
          {Number(sumArray?.no_of_win || 0)?.toLocaleString()}
        </TableCell>
      </StyledTableRow>
    );
  };
  const createSumRowSub = () => {
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
          {Number(sumArray?.sub_bet_money || 0)?.toLocaleString()}
        </TableCell>
        <TableCell
          sx={{
            textAlign: "center",
          }}
        >
          {Number(sumArray?.sub_win_money || 0)?.toLocaleString()}
        </TableCell>
        <TableCell
          sx={{
            textAlign: "center",
            fontWeight: "bold",
          }}
        >
          {Number(sumArray?.sub_profit_or_loss || 0)?.toLocaleString()}
        </TableCell>
        <TableCell
          sx={{
            textAlign: "center",
          }}
        >
          {Number(sumArray?.sub_no_of_bet || 0)?.toLocaleString()}
        </TableCell>
        <TableCell
          sx={{
            textAlign: "center",
          }}
        >
          {Number(sumArray?.sub_no_of_win || 0)?.toLocaleString()}
        </TableCell>
      </StyledTableRow>
    );
  };

  useEffect(() => {
    getStatData();
  }, [selectedprovider]);
  //rowsPerPage, page
  const searchData = () => {
    setPage(0);
    setStatData([]);
    getStatData();
  };
  const [tableCountStatisByGame, _tableCountStatisByGame] = useState(0);
  const { search } = window.location;
  const { agent_id } = queryString.parse(search);

  const getStatData = (date) => {
    setSubLoader(true);
    APIService({
      url: `${process.env.REACT_APP_R_SITE_API
        }/revenue/statistics-by-game?user_id=${!agent_id ? user_id : agent_id
        }&&start_date=${startDate}&end_date=${endDate}&pageNumber=${1}&limit=${5000}&req_agent_data=${agent_id ? agent_id : ""
        }&filterAgent=${filterAgent}`,
      method: "GET",
    })
      .then((res) => {
        setStatData(res.data.data);
        setRowsPerPage(res.data.data.length);
        _tableCountStatisByGame(res?.data?.tableCount || 1);
      })
      .catch((err) => { })
      .finally(() => {
        setLoading1(false);
        setSubLoader(false);
      });
  };

  const getSortIconBetMoney = (order) => {
    return order === "asc" ? (
      <FontAwesomeIcon icon={faSortUp} className="sort-icon" />
    ) : order === "desc" ? (
      <FontAwesomeIcon icon={faSortDown} className="sort-icon" />
    ) : (
      <FontAwesomeIcon icon={faSort} className="sort-icon" />
    );
  };

  const [sortBy, setSortBy] = useState("profit_loss"); // Default sorting column
  const [sortOrder, setSortOrder] = useState("asc"); // Default sorting order
  const [sortColoumns, setSortColoumns] = useState({});
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

  // const handleSort = (column) => {
  //   if (
  //     column == "bet_money" ||
  //     column == "winning" ||
  //     column == "profit_loss" ||
  //     column == "no_bet" ||
  //     column == "no_win"
  //   ) {
  //     if (column === "bet_money") {
  //       setSortBy("bet_money");
  //       setSortOrder_bet_money(
  //         sortOrder === "asc" ? "desc" : sortOrder === "desc" ? "" : "asc"
  //       );
  //       setSortOrder(
  //         sortOrder === "asc" ? "desc" : sortOrder === "desc" ? "" : "asc"
  //       );
  //     } else if (column === "winning") {
  //       setSortBy("winning");
  //       setSortOrder_winning(
  //         sortOrder === "asc" ? "desc" : sortOrder === "desc" ? "" : "asc"
  //       );
  //       setSortOrder(
  //         sortOrder === "asc" ? "desc" : sortOrder === "desc" ? "" : "asc"
  //       );
  //     } else if (column == "profit_loss") {
  //       setSortBy("profit_loss");
  //       setSortOrder_profit_loss(
  //         sortOrder === "asc" ? "desc" : sortOrder === "desc" ? "" : "asc"
  //       );
  //       setSortOrder(
  //         sortOrder === "asc" ? "desc" : sortOrder === "desc" ? "" : "asc"
  //       );
  //     } else if (column == "no_bet") {
  //       setSortBy("no_bet");
  //       setSortedOrder_no_bet(
  //         sortOrder === "asc" ? "desc" : sortOrder === "desc" ? "" : "asc"
  //       );
  //       setSortOrder(
  //         sortOrder === "asc" ? "desc" : sortOrder === "desc" ? "" : "asc"
  //       );
  //     } else if (column == "no_win") {
  //       setSortBy("no_win");
  //       setSortedOrder_no_win(
  //         sortOrder === "asc" ? "desc" : sortOrder === "desc" ? "" : "asc"
  //       );
  //       setSortOrder(
  //         sortOrder === "asc" ? "desc" : sortOrder === "desc" ? "" : "asc"
  //       );
  //     }
  //   }
  // };

  const initCopystatDataa = [...statData].slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );
  // const sortedAndMappedstatData =
  //   sortOrder !== ""
  //     ? initCopystatDataa.sort((a, b) => {
  //         if (sortBy == "bet_money") {
  //           return sortOrder === "asc"
  //             ? Math.abs(a?.sub_bet_money) - Math.abs(b?.sub_bet_money)
  //             : Math.abs(b?.sub_bet_money) - Math.abs(a?.sub_bet_money);
  //         } else if (sortBy === "winning") {
  //           return sortOrder === "asc"
  //             ? Math.abs(a?.sub_win_money) - Math.abs(b?.sub_win_money)
  //             : Math.abs(b?.sub_win_money) - Math.abs(a?.sub_win_money);
  //         } else if (sortBy == "profit_loss") {
  //           return sortOrder === "asc"
  //             ? Math.abs(a?.sub_profit_or_loss) -
  //                 Math.abs(b?.sub_profit_or_loss)
  //             : Math.abs(b?.sub_profit_or_loss) -
  //                 Math.abs(a?.sub_profit_or_loss);
  //         } else if (sortBy == "no_bet") {
  //           return sortOrder === "asc"
  //             ? Math.abs(a?.sub_no_of_bet) - Math.abs(b?.sub_no_of_bet)
  //             : Math.abs(b?.sub_no_of_bet) - Math.abs(a?.sub_no_of_bet);
  //         } else if (sortBy == "no_win") {
  //           return sortOrder === "asc"
  //             ? Math.abs(a?.sub_no_of_win) - Math.abs(b?.sub_no_of_win)
  //             : Math.abs(b?.sub_no_of_win) - Math.abs(a?.sub_no_of_win);
  //         } else if (sortBy == "vendor") {
  //           return sortOrder === "asc"
  //             ? a?.vendor.localeCompare(b?.vendor)
  //             : b?.vendor.localeCompare(a?.vendor);
  //         }
  //       })
  //     : initCopystatDataa;

  const sortedAndMappedstatData =
    sortOrder !== ""
      ? initCopystatDataa.sort((a, b) => {
        if (sortBy == "bet_money") {
          return sortOrder === "asc"
            ? a?.sub_bet_money - b?.sub_bet_money
            : b?.sub_bet_money - a?.sub_bet_money;
        } else if (sortBy === "winning") {
          return sortOrder === "asc"
            ? a?.sub_win_money - b?.sub_win_money
            : b?.sub_win_money - a?.sub_win_money;
        } else if (sortBy == "profit_loss") {
          const val1 = a?.sub_profit_or_loss;
          const val2 = b?.sub_profit_or_loss;
          return customSortFunction(val1, val2, sortOrder);
          // if (sortOrder === "asc") {
          //   if (val1 > 0 && val2 == 0) return 1;
          //   if (val1 < 0 && val2 == 0) return 1;

          //   if (val2 > 0 && val1 == 0) return -1;
          //   if (val2 < 0 && val1 == 0) return -1;
          // }

          // if (val1 > 0 && val2 > 0) return val1 - val2;
          // if (val1 > 0 && val2 == 0) return -1;
          // if (val1 < 0 && val2 == 0) return -1;

          // if (val2 > 0 && val1 == 0) return 1;
          // if (val2 < 0 && val1 == 0) return 1;

          // if (val1 < 0 && val2 > 0) return -1;
          // if (val1 > 0 && val2 < 0) return 1;
          // if (val1 < 0 && val2 < 0) return val1 - val2;
        } else if (sortBy == "no_bet") {
          return sortOrder === "asc"
            ? a?.sub_no_of_bet - b?.sub_no_of_bet
            : b?.sub_no_of_bet - a?.sub_no_of_bet;
        } else if (sortBy == "no_win") {
          return sortOrder === "asc"
            ? a?.sub_no_of_win - b?.sub_no_of_win
            : b?.sub_no_of_win - a?.sub_no_of_win;
        } else if (sortBy == "vendor") {
          return sortOrder === "asc"
            ? a?.vendor.localeCompare(b?.vendor)
            : b?.vendor.localeCompare(a?.vendor);
        }
      })
      : initCopystatDataa;

  const displaySub = () => {
    if (statData.length > 0) {
      return (
        <TableBody>
          {createSumRowSub()}
          {sortedAndMappedstatData
            //	.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            .map((stat, index) => (
              <StyledTableRow hover role="checkbox" tabIndex={-1} key={index}>
                <TableCell
                  sx={{
                    textAlign: "center",
                  }}
                >
                  {stat.vendor}
                </TableCell>
                <TableCell
                  sx={{
                    textAlign: "center",
                  }}
                >
                  {Number(stat.sub_bet_money)?.toLocaleString()}
                </TableCell>
                <TableCell
                  sx={{
                    textAlign: "center",
                  }}
                >
                  {Number(stat.sub_win_money)?.toLocaleString()}
                </TableCell>
                <TableCell
                  sx={{
                    textAlign: "center",
                    fontWeight: "bold",
                  }}
                >
                  {Number(stat.sub_profit_or_loss)?.toLocaleString()}
                </TableCell>
                <TableCell
                  sx={{
                    textAlign: "center",
                  }}
                >
                  {Number(stat.sub_no_of_bet)?.toLocaleString()}
                </TableCell>
                <TableCell
                  sx={{
                    textAlign: "center",
                  }}
                >
                  {Number(stat.sub_no_of_win)?.toLocaleString()}
                </TableCell>
              </StyledTableRow>
            ))}
        </TableBody>
      );
    }
  };

  // const displayMy = () => {
  //   if (statData.length > 0) {
  //     return (
  //       <TableBody>
  //         {createSumRow()}
  //         {statData.map((stat, index) => (
  //           <StyledTableRow hover role="checkbox" tabIndex={-1} key={index}>
  //             <TableCell
  //               sx={{
  //                 textAlign: "center",
  //               }}>
  //               {stat.vendor}
  //             </TableCell>
  //             <TableCell
  //               sx={{
  //                 textAlign: "center",
  //               }}>
  //               {Number(stat.bet_money)?.toLocaleString()}
  //             </TableCell>
  //             <TableCell
  //               sx={{
  //                 textAlign: "center",
  //               }}>
  //               {Number(stat.win_money)?.toLocaleString()}
  //             </TableCell>
  //             <TableCell
  //               sx={{
  //                 textAlign: "center",
  //               }}>
  //               {Number(stat.profit_or_loss)?.toLocaleString()}
  //             </TableCell>
  //             <TableCell
  //               sx={{
  //                 textAlign: "center",
  //               }}>
  //               {Number(stat.no_of_bet)?.toLocaleString()}
  //             </TableCell>
  //             <TableCell
  //               sx={{
  //                 textAlign: "center",
  //               }}>
  //               {Number(stat.no_of_win)?.toLocaleString()}
  //             </TableCell>
  //           </StyledTableRow>
  //         ))}
  //       </TableBody>
  //     );
  //   }
  // };

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

  const handleThreedayClick = () => {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - 2);
    setStartDate(startDate);
    setEndDate(endDate);
  };

  const handleWeekClick = () => {
    const endDate = new Date();

    const startDate = new Date();
    startDate.setDate(endDate.getDate() - 6);
    startDate.setHours(0, 0, 0, 0); // Set time to 00:00:00:00

    endDate.setHours(23, 59, 59, 999); // Set time to 23:59:59:999

    setStartDate(startDate);
    setEndDate(endDate);
  };

  const handleMonthClick = () => {
    const endDate = new Date();

    const startDate = new Date();
    startDate.setMonth(endDate.getMonth());

    startDate.setDate(1);
    startDate.setHours(0, 0, 0, 0); // Set time to 00:00:00:00

    endDate.setMonth(endDate.getMonth() + 1);
    endDate.setDate(0);
    endDate.setHours(23, 59, 59, 999); // Set time to 23:59:59:999

    setStartDate(startDate);
    setEndDate(endDate);
  };

  const [date, setDate] = useState(new Date());

  const handleDateChange = (selectedDates) => {
    setDate(selectedDates[0]);
  };

  return (
    <>
      {" "}
      {loaded ? (
        <FuseLoading />
      ) : (
        <FusePageSimple
          header={<AllAgentListHeader selectedLang={selectedLang} />}
          content={
            <Card
              sx={{ width: "100%", marginTop: "20px", borderRadius: "4px" }}
              className="main_card"
            >
              <div className="flex justify-start justify-items-center bg-gray p-10 list_title w-100">
                <span className="list-title">
                  {selectedLang.statisticsByGame}
                </span>
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
                    <>
                      <TabContext value={value}>
                        <div
                          className="row flex flex-wrap"
                          style={{
                            flexWrap: "wrap",
                            justifyContent: "space-between",
                          }}
                        >
                          {/* {role["role"] != "admin" && (
                              <div
                                className="flex item-center"
                                style={{ marginRight: "auto" }}>
                                <Box
                                  sx={{
                                    borderBottom: 1,
                                    borderColor: "divider",
                                  }}
                                  className="common-tab">
                                  <TabList
                                    onChange={handleChange2}
                                    aria-label="lab API tabs example">
                                    <Tab
                                      label={selectedLang.sub_agent_statistics}
                                      value="1"
                                      className="tab_btn"
                                    />

                                    <Tab
                                      label={selectedLang.my_statistics}
                                      value="2"
                                      className="tab_btn"
                                    />
                                  </TabList>
                                </Box>
                              </div>
                            )} */}
                          <div className="col-lg-2 col-md-4 col-sm-4 p-10 flex item-center">
                            <InputBase
                              sx={{
                                ml: 1,
                                flex: 1,
                                border: "1px solid #cdcfd3",
                                borderRadius: "4px",
                                padding: "4px 10px",
                                marginRight: "10px",
                              }}
                              placeholder={selectedLang.agent_name}
                              value={filterAgent}
                              onChange={(e) => setFilterAgent(e.target.value)}
                              inputProps={{ "aria-label": "Agent Name" }}
                            />
                          </div>


                          <div className="d-flex flex">
                            <Button
                              className="flex item-center"
                              variant="contained"
                              color="secondary"
                              endIcon={
                                <SearchIcon size={20}></SearchIcon>
                              }
                              sx={{
                                borderRadius: "4px",
                              }}
                              onClick={() => {
                                setPage(0), searchData();
                              }}
                            >
                              {selectedLang.search}
                            </Button>
                          </div>
                        </div>



                        {/* <TabPanel value="2" className="common_tab_content">
                            <TableContainer>
                              <Table aria-label="customized table">
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
                                {displayMy()}
                              </Table>
                              {subLoader && <FuseLoading />}
                              {!statData.length > 0 && !subLoader && (
                                <div
                                  style={{
                                    textAlign: "center",
                                    padding: "0.95rem",
                                  }}>
                                  {selectedLang.no_data_available_in_table}
                                </div>
                              )}
                            </TableContainer>
                          </TabPanel> */}
                      </TabContext>
                    </>
                    {/* <TablePagination
                        rowsPerPageOptions={[20, 50, 100, 200, 500]}
                        component="div"
                        count={tableCountStatisByGame}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                        labelRowsPerPage={selectedLang.rows_per_page}
                      /> */}
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

export default AllAgentListApp;
