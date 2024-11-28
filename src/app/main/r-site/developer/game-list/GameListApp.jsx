/** @format */

import * as React from "react";
import FusePageSimple from "@fuse/core/FusePageSimple";
import GameList from "./GameListHeader";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { locale } from "../../../../configs/navigation-i18n";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { Autocomplete, CardActionArea, CardActions, Menu } from "@mui/material";
import { CardHeader } from "@mui/material";
import "./provider.css";

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

import Button from "@mui/material/Button";
import InputBase from "@mui/material/InputBase";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import SearchIcon from "@mui/icons-material/Search";
import APIService from "src/app/services/APIService";
import DataHandler from "src/app/handlers/DataHandler";
import FuseLoading from "@fuse/core/FuseLoading";

import { showMessage } from "app/store/fuse/messageSlice";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Unstable_Grid2";
import TextField from "@mui/material/TextField";

import Switch from "@mui/material/Switch";
import { headerLoadChanged } from "app/store/headerLoadSlice";
import moment from "moment";
import { formatLocalDateTime, formatSentence } from "src/app/services/Utility";
import { useNavigate } from "react-router-dom";
import jwtDecode from "jwt-decode";
import PopupState, { bindTrigger, bindMenu } from "material-ui-popup-state";

// import Box from '@mui/material/Box';
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSort } from '@fortawesome/free-solid-svg-icons';
import { faSortUp } from '@fortawesome/free-solid-svg-icons';
import { faSortDown } from '@fortawesome/free-solid-svg-icons';
import queryString from "query-string";
import cloneDeep from "lodash/cloneDeep";

import addTableData from "./tables";
import { CSVLink } from "react-csv";
const user_id = DataHandler.getFromSession("user_id");

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

// const StyledTableRow = styled(TableRow)(({ theme }) => ({
//   "&:nth-of-type(odd)": {
//     backgroundColor: theme.palette.action.hover,
//   },
//   // hide last border
//   "&:last-child td, &:last-child th": {
//     border: 0,
//   },
// }));

const todayDate = new Date();
todayDate.setDate(todayDate.getDate() + 1);
todayDate.setHours(23, 59, 59, 999);

const threeDaysAgo = new Date(todayDate);
threeDaysAgo.setMonth(todayDate.getMonth() - 1);

function GameListApp() {
  const login_person = DataHandler.getFromSession("login_person");
  const user_id = DataHandler.getFromSession("user_id");
  const [title, setTitle] = useState("");
  const [requested_amount, setrequested_amount] = useState(0);
  const [withdraw_amount, setwithdraw_amount] = useState(0);

  const [agentList, setAgentList] = useState("");
  const [type, setType] = useState("");
  const [currency, setCurrency] = useState("");

  const [selectLocale] = useSelector((state) => [state.locale.selectLocale]);
  const [selectedprovider] = useSelector((state) => [
    state.provider.selectedprovider,
  ]);
  const [headerLoad] = useSelector((state) => [state.headerLoad.headerLoad]);
  const [selectedLang, setSelectedLang] = useState(locale.ko);
  const [csvData, setCSVdata] = useState("");
  useEffect(() => {
    if (selectLocale == "ko") {
      setSelectedLang(locale.ko);
    } else {
      setSelectedLang(locale.en);
    }
  }, [selectLocale]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(20);
  const [loaded, setLoaded] = useState(true);

  const [loading2, setLoading2] = useState(true);
  const [loading4, setLoading4] = useState(true);

  useEffect(() => {
    if (loading2 == false && loading4 == false) {
      setLoaded(false);
    }
  }, [loading2, loading4]);

  useEffect(() => {
    if (selectLocale == "ko") {
      setSelectedLang(locale.ko);
    } else {
      setSelectedLang(locale.en);
    }
  }, [selectLocale]);
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const [value, setValue] = React.useState("2");

  useEffect(() => {
    getTypes();
    getGameList();
  }, [selectedprovider, page, rowsPerPage, value]);

  var date = new Date();
  var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
  var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);

  const dispatch = useDispatch();

  const [tableDataLoader, setTableDataLoader] = useState(true);

  const [editedData, setEditedData] = useState([]);

  const [agentList_table_count, setGameListRowCount] = useState(0);
  const [vendor, setVendor] = useState("");

  const [id, setId] = useState("");
  function getGameList() {
    // setPage(0);
    setAgentList(0);
    fetchGameList();
  }

  const [vendorList, setVendorList] = useState([])

  const handleChangeVendor = (event, newValue) => {
    // const newValue = event.target.value;
    setVendor(newValue?.value || "");
  }

  const getVendorList = () => {
    APIService({
      url: `${process.env.REACT_APP_R_SITE_API}/user/vendor-provider-list`,
      method: 'GET',
    }).then((res) => {
      setVendorList(res.data.vendorList)
    })
  }


  useEffect(() => {
    getVendorList()
  }, [])

  //   const fetchGameList = () => {
  //     setTableDataLoader(true);
  //     APIService({
  //       url: `${process.env.REACT_APP_R_SITE_API}/user/games-list?limit=${rowsPerPage}&page=${page}&title=${title}&vendor=${vendor}&id=${id}&value=${value}`,
  //       method: "GET",
  //     })
  //       .then((res) => {
  //        

  //         setAgentList(res.data.data);
  //         setGameListRowCount(res.data.tableCount);
  //       })
  //       .catch((err) => {
  //         setAgentList([]);
  //         dispatch(
  //           showMessage({
  //             variant: "error",
  //             message: `${
  //               selectedLang[`${formatSentence(err?.message)}`] ||
  //               selectedLang.something_went_wrong
  //             }`,
  //           })
  //         );
  //       })
  //       .finally(() => {
  //         setLoading2(false);
  //         setTableDataLoader(false);
  //       });
  //   };

  const fetchGameList = () => {
    setTableDataLoader(true);
    // Fetch data only for the "current" games (value=2)
    APIService({
      url: `${process.env.REACT_APP_R_SITE_API}/user/games-list?limit=${rowsPerPage}&page=${page}&title=${title}&vendor=${vendor}&id=${id}&value=2`,
      method: "GET",
    })
      .then((res) => {

        setAgentList(res.data.data);
        setGameListRowCount(res.data.tableCount);

        //Csv Data prepare
        const data = res?.data?.data;
        console.log(data);
        const betData1Csv =
          data.length > 0 &&
          data.map((item) => {

            const simplifiedObject = {
              id: item.id,
              title: item.title,
              vendor: item.vendor,
              platform: item.platform,
              game_type: item.game_type,
              en: item.langs.find((lang) => lang.lang === "en").name,
              ko: item.langs.find((lang) => lang.lang === "ko").name,
              game_enabled: item.game_enabled,
              created_at: moment(item.created_at).format("YYYY/MM/DD HH:mm:ss")
            }

            return simplifiedObject;


          })
        setCSVdata(betData1Csv);

      })
      .catch((err) => {
        setAgentList([]);
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
        setTableDataLoader(false);
      });
  };


  const fetchAllGameList = (flag) => {

    // Fetch data only for the "current" games (value=2)
    APIService({
      url: `${process.env.REACT_APP_R_SITE_API}/user/games-list-downlord?user=${user_id}&value=2`,
      method: "GET",
    })
      .then((res) => {

        const csvData = new Blob([res], { type: 'text/csv' });
        const csvURL = window.URL.createObjectURL(csvData);
        const tempLink = document.createElement('a');
        tempLink.href = csvURL;
        tempLink.setAttribute('download', `gamelist_${user_id}.csv`);
        tempLink.click();

      })
      .catch((err) => {
        setAgentList([]);
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
        setTableDataLoader(false);
      });
  };


  const getTypes = () => {
    APIService({
      url: `${process.env.REACT_APP_R_SITE_API}/type/get-type`,
      method: "GET",
    })
      .then((data) => {
        setType(data.data.data);
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
        setLoading4(false);
      });
  };

  const updateGameList = (gameData) => {
    // const editsMade =
    //   selectedData &&
    //   Object.keys(selectedData).some(
    //     (key) => selectedData[key] !== originalSelectedData[key]
    //   );

    // if (!editsMade) {
    //   handleCloseWithdraw();
    //   return;
    // }

    APIService({
      url: `${process.env.REACT_APP_R_SITE_API}/user/update-game-details`,
      method: "POST",
      data: selectedData,
    })
      .then((data) => {
        handleCloseWithdraw();
        dispatch(
          showMessage({
            variant: "success",
            message: `${selectedLang.update_success}`,
          })
        );
        getGameList();
      })
      .catch((err) => {
        handleCloseWithdraw();
        dispatch(
          showMessage({
            variant: "error",
            message: `${err?.message || selectedLang.something_went_wrong}`,
          })
        );
      })
      .finally(() => { });
  };

  const searchHistory = async () => {
    setTableDataLoader(true);
    setPage(0);
    getGameList();
  };

  const columns = [
    { id: "step", label: `${selectedLang.id}`, minWidth: 20 },

    { id: "type", label: `${selectedLang.title}`, minWidth: 50 },
    { id: "aagent", label: `${selectedLang.vendor}`, minWidth: 50 },

    { id: "nickName", label: `${selectedLang.platform}`, minWidth: 50 },
    { id: "currency", label: `${selectedLang.type}`, minWidth: 50 },
    {
      id: "hAmount",
      label: `${selectedLang.Game_Title} EN`,
      minWidth: 50,
      // format: (value) => value.toLocaleString('en-US'),
    },

    {
      id: "payment",
      label: `${selectedLang.Game_Title} KO`,
      minWidth: 50,
      // format: (value) => value.toLocaleString('en-US'),
    },

    {
      id: "signupTime",
      label: `${selectedLang.game_enabled} `,
      minWidth: 100,
    },

    // {
    //   id: "action",
    //   label: `${selectedLang.action} `,
    //   minWidth: 100,
    // },

    {
      id: "date",
      label: `${selectedLang.date} `,
      minWidth: 100,
    },
  ];

  const [currtAcba, _currcAcba] = useState(0);

  const [fetchingBalance, _fetchingBalance] = useState(false);

  const [openWithdraw, setOpenWithdraw] = React.useState(false);
  const [selectedData, setSelectedData] = React.useState({});
  const [originalSelectedData, setOriginalSelectedData] = useState({});

  const handleOpenWithdraw = (data) => {
    setOriginalSelectedData(data);
    setSelectedData(data);
    setOpenWithdraw(true);
  };
  const handleCloseWithdraw = () => {
    setOpenWithdraw(false);
  };

  const getSortIconhAmount = (order) => {
    return order === "asc" ? (
      <FontAwesomeIcon icon={faSortUp} className="sort-icon" />
    ) : order === "desc" ? (
      <FontAwesomeIcon icon={faSortDown} className="sort-icon" />
    ) : (
      <FontAwesomeIcon icon={faSort} className="sort-icon" />
    );
  };

  const [sortBy, setSortBy] = useState("hAmount"); // Default sorting column
  const [sortOrder, setSortOrder] = useState("desc"); // Default sorting order
  const [sortOrder_hAmount, setSortOrder_hAmount] = useState("desc");

  const handleSort = () => {
    setSortBy("hAmount");
    setSortOrder_hAmount(
      sortOrder === "asc" ? "desc" : sortOrder === "desc" ? "" : "asc"
    );
    setSortOrder(
      sortOrder === "asc" ? "desc" : sortOrder === "desc" ? "" : "asc"
    );
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

  const navigate = useNavigate();

  const role = jwtDecode(DataHandler.getFromSession("accessToken"))["data"];

  //   useEffect(() => {

  //   }, [editedData]);

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
  const changeTab = (event, newValue) => {
    setValue(newValue);
  };

  // const csvHeader = [
  //   { label: "ID", key: "id" },
  //   { label: "Title", key: "title" },
  //   { label: "Vendor", key: "vendor" },
  //   { label: "Platform", key: "platform" },
  //   { label: "Type", key: "game_type" },
  //   { label: "Game Title EN", key: "en" },
  //   { label: "Game Title KO", key: "ko" }, 
  //   { label: "Game Enabled", key: "game_enabled" },
  //   { label: "Date", key: "created_at" }

  //   ];

  const handleButtonClick = async (flag) => {
    try {

      fetchAllGameList(flag);

      // Handle the response as needed
    } catch (error) {
      console.error('Error:', error.message || error);
    }
  };

  return (
    <>
      {" "}
      {loaded ? (
        <FuseLoading />
      ) : (
        <FusePageSimple
          header={<GameList selectedLang={selectedLang} />}
          content={
            <Card
              sx={{ width: "100%", marginTop: "20px", borderRadius: "4px" }}
              className="main_card">
              <div className="flex" style={{ gap: "10px", flexWrap: "wrap" }}>
                <Autocomplete
                  onChange={handleChangeVendor}
                  sx={{
                    width: "150px",
                  }}
                  value={vendor}
                  className=""
                  variant="outlined"
                  disablePortal
                  size="small"
                  id="combo-box-demo"
                  options={
                    vendorList.map((vendor) => ({
                      label: vendor.vendor_name,
                      value: vendor.vendor_name
                    }))

                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      className="textSearch"
                      label={selectedLang.vender}
                    />
                  )}
                />
                <InputBase
                  sx={{
                    border: "1px solid #cdcfd3",
                  }}
                  placeholder={selectedLang.title}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  inputProps={{ "aria-label": "Agent Name" }}
                />
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

                {role["role"] == "admin" && (
                  // <CSVLink
                  //   data={csvData}
                  //   filename={"game_list"}
                  //   headers={csvHeader}
                  // >
                  //   <div
                  //     className="download_button"
                  //     style={{ borderRadius: "4px", width: "70px" }}
                  //   >
                  //     <img src={csv_image} alt="csv_image" />
                  //     <span>
                  //       <span></span>
                  //     </span>
                  //   </div>
                  // </CSVLink>
                  <div className="download_button" onClick={() => handleButtonClick(true)} style={{ width: "70px" }}>
                    {selectedLang.Excel}
                  </div>
                )}
              </div>
              <CardContent>
                <Paper
                  sx={{
                    width: "100%",
                    overflow: "hidden",
                    borderRadius: "4px",
                  }}>
                  <TabContext value={value}>
                    {/* <Box
                        sx={{ borderBottom: 1, borderColor: "divider" }}
                        className="common-tab">
                        <TabList
                          onChange={changeTab}
                          aria-label="lab API tabs example">
                          <Tab
                              label={selectedLang.new}
                              value="1"
                              className="tab_btn"
                            />
                          <Tab
                              label={selectedLang.current}
                              value="2"
                              className="tab_btn"
                            />
                          <Tab
                              label={selectedLang.deleted}
                              value="3"
                              className="tab_btn"
                            />
                        </TabList>
                      </Box> */}
                    {/* <TabPanel value="1" className="common_tab_content">
                          <TableContainer>
                            <Table stickyHeader aria-label="customized table">
                              <TableHead>
                                <TableRow>
                                  {columns.map((column) => (
                                    <StyledTableCell
                                      sx={{
                                        textAlign: "center",
                                        cursor:
                                          column.id == "hAmount"
                                            ? "pointer"
                                            : "default",
                                      }}
                                      key={column.id}
                                      align={column.align}
                                      style={{
                                        minWidth: column.minWidth,
                                      }}
                                      onClick={() => handleSort(column.id)}>
                                      {column.label}
                                      {column.id == 'hAmount'
																				? getSortIconhAmount(sortOrder_hAmount)
																				: ''}
                                    </StyledTableCell>
                                  ))}
                                </TableRow>
                              </TableHead>
                              {addTableData(
                                agentList,
                                page,
                                rowsPerPage,
                                handleOpenWithdraw,
                                selectedLang,
                                role
                              )}
                            </Table>
                            {tableDataLoader && <FuseLoading />}

                            {!agentList.length > 0 && !tableDataLoader && (
                              <div
                                style={{
                                  textAlign: "center",
                                  padding: "0.95rem",
                                }}>
                                {selectedLang.no_data_available_in_table}
                              </div>
                            )}
                          </TableContainer>
                          <TablePagination
                            rowsPerPageOptions={[20, 50, 100, 200, 500]}
                            component="div"
                            count={agentList_table_count}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            labelRowsPerPage={selectedLang.rows_per_page}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                          />
                        </TabPanel> */}

                    {/* <TabPanel value="2" className="common_tab_content"> */}
                    <TableContainer>
                      <Table stickyHeader aria-label="customized table">
                        <TableHead>
                          <TableRow>
                            {columns.map((column) => (
                              <StyledTableCell
                                sx={{
                                  textAlign: "center",
                                  cursor:
                                    column.id == "hAmount"
                                      ? "pointer"
                                      : "default",
                                }}
                                key={column.id}
                                align={column.align}
                                style={{ minWidth: column.minWidth }}
                                onClick={() => handleSort(column.id)}>
                                {column.label}
                                {column.id == "hAmount"
                                  ? getSortIconhAmount(sortOrder_hAmount)
                                  : ""}
                              </StyledTableCell>
                            ))}
                          </TableRow>
                        </TableHead>
                        {addTableData(
                          agentList,
                          page,
                          rowsPerPage,
                          handleOpenWithdraw,
                          selectedLang,
                          role
                        )}
                      </Table>
                      {tableDataLoader && <FuseLoading />}

                      {!agentList.length > 0 && !tableDataLoader && (
                        <div
                          style={{
                            textAlign: "center", color: '#fff',
                            padding: "0.95rem",
                          }}>
                          {selectedLang.no_data_available_in_table}
                        </div>
                      )}
                    </TableContainer>
                    <TablePagination
                      rowsPerPageOptions={[20, 50, 100, 200, 500]}
                      component="div"
                      count={agentList_table_count}
                      rowsPerPage={rowsPerPage}
                      page={page}
                      labelRowsPerPage={selectedLang.rows_per_page}
                      onPageChange={handleChangePage}
                      onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                    {/* </TabPanel> */}

                    {/* <TabPanel value="3" className="common_tab_content">
                          <TableContainer>
                            <Table stickyHeader aria-label="customized table">
                              <TableHead>
                                <TableRow>
                                  {columns.map((column) => (
                                    <StyledTableCell
                                      sx={{
                                        textAlign: "center",
                                        cursor:
                                          column.id == "hAmount"
                                            ? "pointer"
                                            : "default",
                                      }}
                                      key={column.id}
                                      align={column.align}
                                      style={{ minWidth: column.minWidth }}
                                      onClick={() => handleSort(column.id)}>
                                      {column.label}
                                      {column.id == "hAmount"
                                        ? getSortIconhAmount(sortOrder_hAmount)
                                        : ""}
                                    </StyledTableCell>
                                  ))}
                                </TableRow>
                              </TableHead>
                              {addTableData(
                                agentList,
                                page,
                                rowsPerPage,
                                handleOpenWithdraw,
                                selectedLang,
                                role
                              )}
                            </Table>
                            {tableDataLoader && <FuseLoading />}

                            {!agentList.length > 0 && !tableDataLoader && (
                              <div
                                style={{
                                  textAlign: "center",
                                  padding: "0.95rem",
                                }}>
                                {selectedLang.no_data_available_in_table}
                              </div>
                            )}
                          </TableContainer>
                          <TablePagination
                            rowsPerPageOptions={[20, 50, 100, 200, 500]}
                            component="div"
                            count={agentList_table_count}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            labelRowsPerPage={selectedLang.rows_per_page}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                          />
                        </TabPanel> */}
                  </TabContext>
                </Paper>
              </CardContent>
            </Card>
          }
        />
      )}
    </>
  );
}

export default GameListApp;
