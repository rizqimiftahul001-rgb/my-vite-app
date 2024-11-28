/** @format */

import * as React from "react";
import FusePageSimple from "@fuse/core/FusePageSimple";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import GameListManagementHeader from "./GameListManagementHeader";
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

import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";

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

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSort } from "@fortawesome/free-solid-svg-icons";
import { faSortUp } from "@fortawesome/free-solid-svg-icons";
import { faSortDown } from "@fortawesome/free-solid-svg-icons";
import queryString from "query-string";
import cloneDeep from "lodash/cloneDeep";

import addTableData from "./tables";
import EditModel from "./Models";

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

const threeDaysAgo = new Date(todayDate);
threeDaysAgo.setMonth(todayDate.getMonth() - 1);

function GameListManagementApp() {
  const login_person = DataHandler.getFromSession("login_person");
  const user_id = DataHandler.getFromSession("user_id");
  const [title, setTitle] = useState("");
  const [gaameIdSearch, setGameIdsearch] = useState("");
  const [providerGameIdsearch, setProvidergameidSearch] = useState("");
  const [requested_amount, setrequested_amount] = useState(0);
  const [withdraw_amount, setwithdraw_amount] = useState(0);

  const [agentList, setAgentList] = useState("");
  const [type, setType] = useState("");
  const [currency, setCurrency] = useState("");

  const [selectedProvider, setselectedProvider] = useState([]);
  const [vendorData, setvendorData] = useState([]);

  const [showOperatorId, setShowOperatorId] = useState(false);
  const [operatorId, setOperatorId] = useState("");

  const [selectLocale] = useSelector((state) => [state.locale.selectLocale]);
  const [selectedprovider] = useSelector((state) => [
    state.provider.selectedprovider,
  ]);
  const [headerLoad] = useSelector((state) => [state.headerLoad.headerLoad]);
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

  const [value, setValue] = React.useState("1");

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

  const fetchGameList = () => {
    setTableDataLoader(true);
    APIService({
      url: `${process.env.REACT_APP_R_SITE_API}/user/games-list?limit=${rowsPerPage}&page=${page}&title=${title}&vendor=${vendor}&id=${id}&value=${value}&gameId=${gaameIdSearch}&provider_game_id=${providerGameIdsearch}&provider_name=${provider}`,
      method: "GET",
    })
      .then((res) => {
        setAgentList(res.data.data);
        setGameListRowCount(res.data.tableCount);
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

  useEffect(() => {
    APIService({
      url: `${process.env.REACT_APP_R_SITE_API}/user/provider-name`,
      method: "GET",
    })
      .then((data) => {
        setselectedProvider(data.data);
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
        // setLoading4(false);
      });

    APIService({
      url: `${process.env.REACT_APP_R_SITE_API}/user/vendor-provider-list`,
      method: "GET",
    })
      .then((data) => {
        setvendorData(data.data.vendorList);
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
        // setLoading4(false);
      });
    // console.log("hello providers");
    // getProviders();
  }, []);

  const updateGameList = () => {
    const editsMade =
      selectedData &&
      Object.keys(selectedData).some(
        (key) => selectedData[key] !== originalSelectedData[key]
      );

    if (!editsMade) {
      handleCloseWithdraw();
      return;
    }

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
    { id: "pgid", label: `${selectedLang.providerGameId}`, minWidth: 20 },
    { id: "provider_name", label: `${selectedLang.provideName}`, minWidth: 20 },

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

    {
      id: "action",
      label: `${selectedLang.action} `,
      minWidth: 100,
    },

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

  const [openWithdrawGame, setOpenWithdrawGame] = React.useState(false);
  const [selectedGameData, setSelectedGameData] = React.useState({});
  const [originalSelectedGameData, setOriginalSelectedGameData] = useState({});

  const handleOpenWithdraw = (data) => {
    setOriginalSelectedData(data);
    setSelectedData(data);
    setOpenWithdraw(true);
  };
  const handleCloseWithdraw = () => {
    setOpenWithdraw(false);
  };

  const handleOpenWithdrawGame = (data) => {
    setOriginalSelectedData(data);
    setSelectedData(data);
    setOpenWithdrawGame(true);
  };
  const handleCloseWithdrawGame = () => {
    setOpenWithdrawGame(false);
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

  useEffect(() => { }, [editedData]);

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

  const [vendorList, setVendorList] = useState([]);
  const getVendorList = () => {
    APIService({
      url: `${process.env.REACT_APP_R_SITE_API}/user/vendor-provider-list`,
      method: "GET",
    }).then((res) => {
      setVendorList(res.data.vendorList);
    });
  };
  const handleChangeVendor = (event, newValue) => {
    // const newValue = event.target.value;
    setVendor(newValue?.value || "");
  };

  const [provider, setProvider] = useState("");
  const handleChangeProvider = (event, newValue) => {
    // const newValue = event.target.value;
    setProvider(newValue?.value || "");
  };

  useEffect(() => {
    getVendorList();
  }, []);

  const [provideName, setprovideName] = useState("");
  const [realId, setrealId] = useState("");
  const [providerGameId, setproviderGameId] = useState("");
  const [realVendor, setrealVendor] = useState("");
  const [vendorValue, setvendorValue] = useState("");
  const [gameImgUrl, setgameImgUrl] = useState("");
  const [gameType, setgameType] = useState("");
  const [platform, setPlatform] = useState("");
  const [titleName, setTitleName] = useState("");
  const [typeValue, settypeValue] = useState("");
  const [ko, setko] = useState("");
  const [en, seten] = useState("");
  const [gameEnabled, setgameEnabled] = useState(false);

  let selectedDataPost = {
    provideName: provideName,
    real_id: realId,
    provider_game_id: providerGameId,
    real_vendor: realVendor,
    vendor: vendorValue,
    game_type: gameType,
    platform: platform,
    type: typeValue,
    title: titleName,
    ...(provideName === "timeless" && { operator_id: operatorId }),
    details: {
      thumbnails: {
        "300x300": gameImgUrl,
      },
    },
    langs: [
      {
        name: ko,
        lang: "ko",
      },
      {
        name: en,
        lang: "en",
      },
    ],
    game_enabled: gameEnabled,
   
  };

  const handleSubmit = () => {
    APIService({
      url: `${process.env.REACT_APP_R_SITE_API}/user/add-new-game`,
      method: "POST",
      data: selectedDataPost,
    })
      .then((data) => {
        handleCloseWithdrawGame();
        dispatch(
          showMessage({
            variant: "success",
            message: `${selectedLang.game_added}`,
          })
        );
        setvendorValue("");
        setko("");
        seten("");
        setprovideName("");
        setgameEnabled(false);
        setTitleName("");
        setgameType("");
        setPlatform("");
        settypeValue("");
        setgameImgUrl("");
        setrealId("");
        setrealVendor("");
        setproviderGameId("");
        getGameList();
      })
      .catch((err) => {
        handleCloseWithdrawGame();
        dispatch(
          showMessage({
            variant: "error",
            message: `${err.error.message
              ? "Please fill all fields"
              : selectedLang.something_went_wrong
              }`,
          })
        );
      })
      .finally(() => { });
  };

  const handleSelectedProvider = (event) => {

    setprovideName(event.target.value);

    // Show the Operator ID input field if the provider is "timeless"
    if (event.target.value=== 'timeless') {
      setShowOperatorId(true);
    } else {
      setShowOperatorId(false);
    }

  };

  const handleVendor = (event) => {
    setvendorValue(event.target.value);
  };

  const handleRealVendor = (event) => {
    setrealVendor(event.target.value);
  };

  return (
    <>
      {" "}
      {loaded ? (
        <FuseLoading />
      ) : (
        <FusePageSimple
          header={<GameListManagementHeader selectedLang={selectedLang} />}
          content={
            <Card
              sx={{ width: "100%", marginTop: "20px", borderRadius: "4px" }}
              className="main_card"
            >
              <Modal
                open={openWithdrawGame}
                className="small_modal"
                onClose={handleCloseWithdrawGame}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
              >
                <Box sx={style} className="Mymodal">
                  <button
                    className="modalclosebtn"
                    onClick={handleCloseWithdrawGame}
                  >
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
                  <Grid
                    key={"grid-main"}
                    container
                    rowSpacing={1}
                    columnSpacing={{ xs: 1, sm: 2, md: 3 }}
                  >
                    <Grid xs={12} md={12} key={"grid-sub"}>
                      <Grid key={"grid1"} container spacing={3}>
                        <Grid xs={12} md={12} key={"grid3"}>
                          <Typography
                            id="modal-modal-title"
                            variant="h6"
                            component="h2"
                            style={{ fontWeight: "700", fontSize: "23px" }}
                          >
                            {selectedLang.addNewGame}{" "}
                            {/* {
                                langs?.find((lang) => lang.lang === Language)
                                  ?.name
                              } */}
                          </Typography>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>{" "}
                  <form className="editform">
                    <div className="edit_textfield">
                      <FormControl className="flex w-full" variant="outlined">
                        <InputLabel id="category-select-label">
                          Select Provider
                        </InputLabel>
                        <Select
                          labelId="category-select-label"
                          id=""
                          size="small"
                          label="Category"
                          value={provideName}
                          onChange={(e) => {
                            handleSelectedProvider(e);
                          }}
                        >
                          {/* <MenuItem value="all">
                              <em> All </em>
                            </MenuItem> */}
                          {selectedProvider.map((data) => (
                            <MenuItem
                              value={data}
                              key={data}
                              style={{ backgroundColor: "#000" }}
                            >
                              {data}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                      {/* <TextField
                          fullWidth
                          size="small"
                          label={selectedLang.provideName}
                          value={provideName}
                          onChange={(e) => {
                            setprovideName(e.target.value);
                          }}
                        /> */}
                    </div>
                    {showOperatorId && (
                      <div className="edit_textfield">
                        <TextField
                          fullWidth
                          hiddenLabel
                          size="small"
                          placeholder="Operator ID"
                          value={operatorId}
                          onChange={(e) => setOperatorId(e.target.value)}
                        />
                      </div>
                    )}

                    <div className="edit_textfield">
                      <TextField
                        fullWidth
                        size="small"
                        hiddenLabel
                        placeholder={selectedLang.realId}
                        value={realId}
                        onChange={(e) => {
                          setrealId(e.target.value);
                        }}
                      />
                    </div>
                    <div className="edit_textfield">
                      <TextField
                        hiddenLabel
                        fullWidth
                        size="small"
                        placeholder={selectedLang.providerGameId}
                        value={providerGameId}
                        onChange={(e) => {
                          setproviderGameId(e.target.value);
                        }}
                      />
                    </div>

                    <div className="edit_textfield">
                      <TextField
                        fullWidth
                        size="small"
                        placeholder="Real Vendor"
                        value={realVendor}
                        onChange={(e) => {
                          setrealVendor(e.target.value);
                        }}
                        variant="outlined"
                      />
                    </div>

                    <div className="edit_textfield">
                      <FormControl className="flex w-full" variant="outlined">
                        <InputLabel id="category-select-label">
                          Select Vendor
                        </InputLabel>
                        <Select
                          labelId="category-select-label"
                          id=""
                          size="small"
                          label="Category"
                          value={vendorValue}
                          onChange={(e) => {
                            handleVendor(e);
                          }}
                        >
                          {/* <MenuItem value="all">
                              <em> All </em>
                            </MenuItem> */}
                          {vendorData.map((data) => (
                            <MenuItem
                              value={data.vendor_name}
                              key={data._id}
                              style={{ backgroundColor: "#000" }}
                            >
                              {data.vendor_name}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </div>
                    <div className="edit_textfield">
                      <TextField
                        fullWidth
                        hiddenLabel
                        size="small"
                        placeholder={selectedLang.Game_image_url}
                        value={gameImgUrl || ""}
                        onChange={(e) => {
                          setgameImgUrl(e.target.value);
                        }}
                      />
                    </div>
                    <div className="edit_textfield">
                      <TextField
                        fullWidth
                        hiddenLabel
                        size="small"
                        placeholder={selectedLang.gameType}
                        value={gameType}
                        onChange={(e) => {
                          setgameType(e.target.value);
                        }}
                      />
                    </div>
                    <div className="edit_textfield">
                      <TextField
                        fullWidth
                        hiddenLabel
                        size="small"
                        placeholder={selectedLang.platform}
                        value={platform}
                        onChange={(e) => {
                          setPlatform(e.target.value);
                        }}
                      />
                    </div>
                    {/* <div className="edit_textfield">
                        <TextField
                          fullWidth
                          size="small"
                          label={selectedLang.thumbnails}
                          value={thumbnails}
                          onChange={(e) => {
                            setThumbnails(e.target.value);
                          }}
                        />
                      </div> */}
                    <div className="edit_textfield">
                      <TextField
                        fullWidth
                        hiddenLabel
                        size="small"
                        placeholder={selectedLang.title}
                        value={titleName}
                        onChange={(e) => {
                          setTitleName(e.target.value);
                        }}
                      />
                    </div>
                    <div className="edit_textfield">
                      <TextField
                        hiddenLabel
                        fullWidth
                        size="small"
                        placeholder={selectedLang.type}
                        value={typeValue}
                        onChange={(e) => {
                          settypeValue(e.target.value);
                        }}
                      />
                    </div>
                    <div className="edit_textfield">
                      <TextField
                        fullWidth
                        hiddenLabel
                        size="small"
                        placeholder="ko"
                        value={ko}
                        onChange={(e) => {
                          setko(e.target.value);
                        }}
                      />
                    </div>
                    <div className="edit_textfield">
                      <TextField
                        fullWidth
                        hiddenLabel
                        size="small"
                        placeholder="en"
                        value={en}
                        onChange={(e) => {
                          seten(e.target.value);
                        }}
                      />
                    </div>
                    <div className="bottom_btns">
                      <FormControlLabel
                        style={{ color: "#fff" }}
                        control={
                          <Checkbox
                            checked={gameEnabled}
                            onChange={(e) => {
                              setgameEnabled(!gameEnabled);
                            }}
                          />
                        }
                        label={selectedLang.game_enabled}
                      />
                      <Button
                        variant="contained"
                        // color='primary'
                        className="flex item-center"
                        color="secondary"
                        onClick={() => {
                          handleSubmit();
                        }}
                        sx={{
                          borderRadius: "4px",
                        }}
                      >
                        {selectedLang.submit}
                      </Button>
                    </div>
                  </form>
                </Box>
              </Modal>
              {EditModel(
                openWithdraw,
                handleCloseWithdraw,
                selectedLang,
                style,
                selectedData,
                {
                  setSelectedData: setSelectedData,
                  updateGameList: updateGameList,
                }
              )}

              {/* {AddModel(
                  openWithdrawGame,
                  handleCloseWithdrawGame,
                  selectedLang,
                  style,
                  selectedData,
                  {
                    setSelectedData: setSelectedData,
                    updateGameList: updateGameList,
                  }
                )} */}

              <div className="flex justify-start justify-items-center bg-gray p-10 list_title w-100">
                <span className="list-title">
                  {selectedLang.agent_distribution_statistics}{" "}
                </span>
              </div>
              <div className="flex">
                {/* <div
                  className="flex threebox agentblock"
                  style={{
                    alignItems: "center",
                    gap: "10px",
                  }}
                >
                  <Autocomplete
											onChange={handleChangeAdminType}
											sx={{
												width: '150px',
											}}
											className=''
											variant='outlined'
											disablePortal
											size='small'
											id='combo-box-demo'
											options={[
												{ label: `${selectedLang.all}`, value: '' },
												{ label: `${selectedLang.new}`, value: '0' },
												{ label: `${selectedLang.current}`, value: '1' },
												{ label: `${selectedLang.deleted}`, value: '2' },
											]}
											renderInput={(params) => (
												<TextField
													{...params}
													className='textSearch'
													label={selectedLang.type}
												/>
											)}
										/>
                </div> */}

                {/* <InputBase
                      sx={{
                        ml: 1,
                        flex: 1,
                        border: "1px solid #cdcfd3",
                        borderRadius: "4px",
                        padding: "4px 10px",
                        marginRight: "0px",
                      }}
                      placeholder={selectedLang.vendor}
                      value={vendor}
                      onChange={(e) => setVendor(e.target.value)}
                      inputProps={{ "aria-label": "Agent Name" }}
                    /> */}

                <div
                  className="flex threebox agentblock"
                  style={{
                    alignItems: "center",
                    gap: "10px",
                    flexWrap: "wrap",
                  }}
                >
                  <InputBase
                    sx={{
                      ml: 1,
                      flex: 1,
                      border: "1px solid #cdcfd3",
                      borderRadius: "4px",
                      padding: "4px 10px",
                      maxWidth: "170px",
                      margin: "0px",
                    }}
                    placeholder={selectedLang.game_id}
                    value={gaameIdSearch}
                    onChange={(e) => setGameIdsearch(e.target.value)}
                    inputProps={{ "aria-label": "Agent Name" }}
                  />
                  <InputBase
                    sx={{
                      ml: 1,
                      flex: 1,
                      border: "1px solid #cdcfd3",
                      borderRadius: "4px",
                      padding: "4px 10px",
                      maxWidth: "170px",
                      margin: "0px",
                    }}
                    placeholder={selectedLang.providerGameId}
                    value={providerGameIdsearch}
                    onChange={(e) => setProvidergameidSearch(e.target.value)}
                    inputProps={{ "aria-label": "Agent Name" }}
                  />
                  <Autocomplete
                    onChange={handleChangeVendor}
                    sx={{
                      width: "150px",
                    }}
                    value={vendor || null}
                    className=""
                    variant="outlined"
                    disablePortal
                    size="small"
                    id="combo-box-demo"
                    options={vendorList.map((vendor) => ({
                      label: vendor.vendor_name,
                      value: vendor.vendor_name,
                    }))}
                    isOptionEqualToValue={(option, value) =>
                      option.value === value
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
                      ml: 1,
                      flex: 1,
                      border: "1px solid #cdcfd3",
                      borderRadius: "4px",
                      padding: "4px 10px",
                      margin: "0px",
                      maxWidth: "170px",
                    }}
                    placeholder={selectedLang.title}
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    inputProps={{ "aria-label": "Agent Name" }}
                  />

                  <Autocomplete
                    onChange={handleChangeProvider}
                    sx={{
                      width: "150px",
                    }}
                    value={provider || null}
                    className=""
                    variant="outlined"
                    disablePortal
                    size="small"
                    id="combo-box-demo"
                    options={selectedProvider.map((provider) => ({
                      label: provider,
                      value: provider,
                    }))}
                    isOptionEqualToValue={(option, value) =>
                      option.value === value
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        className="textSearch"
                        label={selectedLang.provider}
                      />
                    )}
                  />
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

                {/* <InputBase
											sx={{
												ml: 1,
												flex: 1,
												border: '1px solid #cdcfd3',
												borderRadius: '4px',
												padding: '4px 10px',
												marginRight: '0px',
											}}
											placeholder={selectedLang.id}
											value={id}
											onChange={(e) => setId(e.target.value)}
											inputProps={{ 'aria-label': 'Agent Name' }}
										/> */}
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
                    <TabContext value={value}>
                      <div className="tab_both">
                        <Box
                          sx={{ borderBottom: 1, borderColor: "divider" }}
                          className="common-tab"
                        >
                          <TabList
                            onChange={changeTab}
                            aria-label="lab API tabs example"
                          >
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
                        </Box>
                        <Button
                          className="flex item-center button-container"
                          variant="contained"
                          color="secondary"
                          size="small"
                          sx={{
                            borderRadius: "4px",
                          }}
                          onClick={() => handleOpenWithdrawGame()}
                        >
                          {selectedLang.addNew}
                        </Button>
                      </div>

                      <TabPanel value="1" className="common_tab_content">
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
                                    onClick={() => handleSort(column.id)}
                                  >
                                    {column.label}
                                    {/* {column.id == 'hAmount'
																				? getSortIconhAmount(sortOrder_hAmount)
																				: ''} */}
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
                          count={agentList_table_count}
                          rowsPerPage={rowsPerPage}
                          page={page}
                          labelRowsPerPage={selectedLang.rows_per_page}
                          onPageChange={handleChangePage}
                          onRowsPerPageChange={handleChangeRowsPerPage}
                        />
                      </TabPanel>

                      <TabPanel value="2" className="common_tab_content">
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
                                    onClick={() => handleSort(column.id)}
                                  >
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
                          count={agentList_table_count}
                          rowsPerPage={rowsPerPage}
                          page={page}
                          labelRowsPerPage={selectedLang.rows_per_page}
                          onPageChange={handleChangePage}
                          onRowsPerPageChange={handleChangeRowsPerPage}
                        />
                      </TabPanel>

                      <TabPanel value="3" className="common_tab_content">
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
                                    onClick={() => handleSort(column.id)}
                                  >
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
                          count={agentList_table_count}
                          rowsPerPage={rowsPerPage}
                          page={page}
                          labelRowsPerPage={selectedLang.rows_per_page}
                          onPageChange={handleChangePage}
                          onRowsPerPageChange={handleChangeRowsPerPage}
                        />
                      </TabPanel>
                    </TabContext>
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

export default GameListManagementApp;
