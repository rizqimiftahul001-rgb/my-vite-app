/** @format */

import React from "react";
import FusePageSimple from "@fuse/core/FusePageSimple";
import ProviderManagementHeader from "./providerManagementHeader";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { locale } from "../../../configs/navigation-i18n";

import CardContent from "@mui/material/CardContent";
import {
  Button,
  CardActionArea,
  CardActions,
  Autocomplete,
} from "@mui/material";
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
import InputBase from "@mui/material/InputBase";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

import Typography from "@mui/material/Typography";
import { gameTypes } from "src/app/services/gameTypes";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import APIService from "src/app/services/APIService";
import { showMessage } from "app/store/fuse/messageSlice";
import jwtDecode from "jwt-decode";
import DataHandler from "src/app/handlers/DataHandler";
import FuseLoading from "@fuse/core/FuseLoading/FuseLoading";
import queryString from "query-string";
import BettingInput from "./BettingInput";
import { formatSentence } from "src/app/services/Utility";
// import { Document, Page } from "react-pdf";


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

const columns = [
  { id: "number", label: "Number", minWidth: 50 },
  { id: "vendor_id", label: "Category", minWidth: 50 },
  { id: "min_limit_amount", label: "Min Bet", minWidth: 50 },
  { id: "limit_amount", label: "Max Bet", minWidth: 100 },

  // {
  //   id: "isEnabled",
  //   label: "Enabled",
  //   minWidth: 100,
  // },
  // {
  //   id: "updated_at",
  //   label: "Date",
  //   minWidth: 100,
  //   format: (value) => {
  //     const date = new Date(value);
  //     const day = date.getDate().toString().padStart(2, "0");
  //     const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Note: month is zero-indexed, so we need to add 1
  //     const year = date.getFullYear().toString();

  //     const formattedDate = `${day}-${month}-${year}`;
  //     return formattedDate;
  //   },
  // },
  {
    id: "action",
    label: "Action",
    minWidth: 100,
  },
];

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
function providermanagement() {
  const [selectLocale] = useSelector((state) => [state.locale.selectLocale]);
  const [selectedLang, setSelectedLang] = useState(locale.en);
  const [loaded, setLoaded] = useState(true);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const dispatch = useDispatch();
  const [game, setGame] = React.useState("");
  const [enable, setEnable] = React.useState(false);
  const [provider_id] = useSelector((state) => [
    state.provider.selectedprovider,
  ]);
  const [gameId, setGameId] = useState("");
  const [minBet, setMinBet] = useState("");
  const [maxBet, setMaxBet] = useState("");
  const [betlimit, setBetLimit] = useState([]);
  const [betlimitId, setbetlimitId] = useState("");
  const role = jwtDecode(DataHandler.getFromSession("accessToken"))["data"];
  const [open, setOpen] = React.useState(false);
  const [vendorList, setVendorList] = useState([]);
  const [editValueTarget, setEditValueTarget] = useState();
  const [allProviders, setAllProviders] = useState([]);
  const [allGameVendor, setAllGameVendor] = useState([]);
  const [gameListWithId, setGameListwithId] = useState([]);
  const [loading, setLoading] = useState(false);
  const [orbData, _orbData] = useState();
  const [gameLimitArr, _gameLimitArr] = useState([]);
  const [typeLimitArr, _typeLimitArr] = useState([]);
  const [vendorLimitArr, _vendorLimitArr] = useState([]);
  const [globleLimit, setGlobalLimit] = useState();
  const [resultBets, setResultBets] = useState([]);
  const [maxAmtGameSpec, setmaxAmtGameSpec] = useState();
  const [showGameSpec, setShowgameSpec] = useState();
  const [selectedValueGameSpec, setSelectedValueGameSpec] = useState("");
  const [selectedValueGameSpecName, setSelectedValueGameSpecName] =
    useState("");
  const [selectedValueType, setSelectedValueType] = useState("");
  const [maxAmtGameType, setmaxAmtGameType] = useState();
  const [showValuetoDrop, _showvaluetoDrop] = useState();
  const [selectedValueTypeVendor, setSelectedValueTypeVendor] = useState("");
  const [selectedValueVendor, setSelectedValueVendor] = useState("");
  const [maxAmtGameVendor, setmaxAmtGameVendor] = useState();
  const [selectedValueVendorFG, setSelectedValueVendorFG] = useState("");
  const [showGameSpecList, setShowGemeSpecList] = useState(false);
  const [showTypList, setShowTypeList] = useState(false);
  const [showVendorList, setShowVendorList] = useState(false);
  const [saving, _saving] = useState(false);
  const [inputValues, setInputValues] = useState({});
  const [numPages, setNumPages] = useState(null);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setLoaded(false);
    }, 500);
    return () => clearTimeout(timeoutId);
  }, []);

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

  const getGameVendorList = () => {
    APIService({
      url: `${process.env.REACT_APP_R_SITE_API}/betlimit/vendor-list`,
      method: "GET",
    })
      .then((data) => {
        setVendorList(data.data.data);
      })
      .catch((err) => {})
      .finally(() => {});
  };

  useEffect(() => {
    getGameVendorList();
  }, []);

  // const handleChangeProvider = (event) => {
  //   setProviderId(event.target.value);
  //   setActiveProviders(event.target.value);
  // };
 
  

 

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setEdit(false);
  };

  const handleOpenClick = () => setOpen(false);
  const handleCloseClick = () => {
    setOpen(false);
  };

  const handleEdit = (key) => {
    setOpen(true);
    setEdit(true);
    setEditValueTarget(betlimit[key]);
    setbetlimitId(betlimit[key].betlimit_id);
    setMinBet(betlimit[key].min_limit_amount);
    setMaxBet(betlimit[key].limit_amount);
    setEnable(betlimit[key].isEnabled);
  };

  useEffect(() => {
    getProviderList();
    getGameVendorListData();
    getBetLimit();
    // getGameList();
    getGameVendorType();
  }, []);

  const optionsGameType = gameTypes.map((game_type) => ({
    label: game_type,
    value: game_type,
  }));

  useEffect(() => {
    getBetLimit();
    // getGameList();
  }, [provider_id]);

  const getBetLimit = () => {
    APIService({
      url: `${process.env.REACT_APP_R_SITE_API}/betlimit/get-bet-limit?provider_id=${provider_id}`,
      method: "GET",
    })
      .then((res) => {
        // setBetLimit(res.data.data);
      })
      .catch((err) => {})
      .finally(() => {});
  };

  const [loadingGametype, _loadingGameType] = useState(false);
  const getProviderList = () => {
    APIService({
      url: `${process.env.REACT_APP_R_SITE_API}/game/get-provider-list`,
      method: "GET",
    })
      .then((res) => {
        _loadingGameType(true);
        // setProviderList(res.data.data);

        setAllProviders(res.data.allProvGameList);
      })
      .catch((err) => {})
      .finally(() => {
        _loadingGameType(false);
      });
  };

  const getGameVendorListData = () => {
    APIService({
      url: `${process.env.REACT_APP_R_SITE_API}/game/get-game-vendor-list`,
      method: "GET",
    })
      .then((res) => {
        setAllGameVendor(res.data.data);
      })
      .catch((err) => {})
      .finally(() => {});
  };

  const getGameVendorType = () => {
    setLoading(true);
    APIService({
      url: `${process.env.REACT_APP_R_SITE_API}/game/get_game_vendor_type`,
      method: "GET",
    })
      .then((res) => {
        setGameListwithId(res?.data?.data);
      })
      .catch((err) => {})
      .finally(() => {
        setLoading(false);
      });
  };

  // const getGameList = () => {
  //   APIService({
  //     url: `${process.env.REACT_APP_R_SITE_API}/game/get-game-list?provider_id=${provider_id}`,
  //     method: "GET",
  //   })
  //     .then((res) => {
  //       setGameList(res.data.data[0]);
  //     })
  //     .catch((err) => {})
  //     .finally(() => {});
  // };

  const submitBetLimit = (e) => {
    e.preventDefault();

    if (enable == false) {
      dispatch(
        showMessage({
          variant: "error",
          message: `${selectedLang.please_change_enable_yes}`,
        })
      );
    }

    const payload = {
      min_limit_amount: minBet,
      limit_amount: maxBet,
      provider_id: provider_id,
      isEnabled: enable,
      vendor_id: game,
    };

    if (payload !== undefined) {
      APIService({
        url: `${process.env.REACT_APP_R_SITE_API}/betlimit/create-bet-limit`,
        method: "POST",
        data: payload,
      })
        .then((data) => {
          setOpen(false);
          getBetLimit();
          dispatch(
            showMessage({
              variant: "success",
              message: `${selectedLang.bet_limit_created}`,
            })
          );
        })
        .catch((err) => {})
        .finally(() => {
          setEnable(false);
          setGame("");
          setMaxBet("");
          setMinBet("");
          setEdit(false);
          setbetlimitId("");
        });
    }
  };

  const editBetLimit = (e) => {
    e.preventDefault();
    const payload = {
      min_limit_amount: minBet,
      limit_amount: maxBet,
      provider_id: provider_id,
      isEnabled: enable,
      vendor_id: gameId,
      betlimit_id: betlimitId,
    };

    if (payload !== undefined) {
      APIService({
        url: `${process.env.REACT_APP_R_SITE_API}/betlimit/modify-bet-amount`,
        method: "PUT",
        data: payload,
      })
        .then((data) => {
          setOpen(false);
          getBetLimit();
          dispatch(
            showMessage({
              variant: "success",
              message: `${selectedLang.bet_limit_created}`,
            })
          );
        })
        .catch((err) => {})
        .finally(() => {});
    }
  };
  function checkBetAmountLimt(e) {
    let inputValue = e.target.value;
    inputValue = inputValue.replace(/[^0-9.]/g, "");
    const dotCount = inputValue.split(".").length - 1;
    if (dotCount > 1) {
      return null;
    }
    const numericValue = parseFloat(inputValue) || 0;
    const maxLimit = 100000000;
    if (!isNaN(numericValue) && numericValue <= maxLimit) {
      // setGlobalLimit(numericValue.toFixed(2));
      return numericValue.toFixed(2);
    }
  }
  const columns = [
    { id: "number", label: `Title`, minWidth: 50 },
    { id: "vendor_id", label: `${selectedLang.category}`, minWidth: 50 },
    // { id: "min_limit_amount", label: `${selectedLang.min_bet}`, minWidth: 50 },
    { id: "limit_amount", label: `${selectedLang.max_bet}`, minWidth: 100 },

    // {
    //   id: "isEnabled",
    //   label: `${selectedLang.enabled}`,
    //   minWidth: 100,
    // },
    // {
    //   id: "updated_at",
    //   label: `${selectedLang.date}`,
    //   minWidth: 100,
    //   format: (value) => {
    //     const date = new Date(value);
    //     const day = date.getDate().toString().padStart(2, "0");
    //     const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Note: month is zero-indexed, so we need to add 1
    //     const year = date.getFullYear().toString();

    //     const formattedDate = `${day}-${month}-${year}`;
    //     return formattedDate;
    //   },
    // },
    {
      id: "action",
      label: `${selectedLang.action}`,
      minWidth: 100,
    },
  ];

  const columnsResult = [
    { id: "GS", label: `${selectedLang.global_settings}`, minWidth: 50 },
    { id: "SBT", label: `${selectedLang.settings_by_type}`, minWidth: 50 },
    {
      id: "VSS",
      label: `${selectedLang.vendor_specific_settings}`,
      minWidth: 50,
    },
    {
      id: "GSS",
      label: `${selectedLang.game_specific_settings}`,
      minWidth: 50,
    },
    { id: "maxAm", label: `${selectedLang.maximum_bet_amount}`, minWidth: 50 },
    { id: "action", label: `${selectedLang.action}`, minWidth: 50 },
  ];

  const { search } = window.location;
  const { agent_id } = queryString.parse(search);

  const getAllBetList = () => {
    APIService({
      url: `${process.env.REACT_APP_R_SITE_API}/betlimit/get-bet-lists/${
        !agent_id ? user_id : agent_id
      }`,
      method: "GET",
    }).then((data) => {
      if (
        data &&
        data.data &&
        data.data.ordata &&
        data.data.ordata.length > 0
      ) {
        setResultBets(data?.data?.data);
        _gameLimitArr(data.data.ordata[0].games_limit);
        _typeLimitArr(data?.data?.ordata[0]?.types_limit);
        _vendorLimitArr(data?.data?.ordata[0]?.vendors_limit);
        setBetLimit(data?.data?.data);
        // setGlobalLimit(data?.data?.ordata[0]?.globle_limit);
        _orbData(data?.data?.ordata[0]);
      }
    });
  };
  const handleSelectChangeGameSpec = (event, newValue) => {
    setSelectedValueGameSpec(newValue?.value || "");
    setShowgameSpec(newValue?.label);
    const selectedGame = gameListWithId.find(
      (item) => item.id === newValue?.value
    );
    if (selectedGame) {
      setSelectedValueGameSpecName(selectedGame.title);
    }
  };

  const handleSelectChangeGameType = (event, newValue) => {
    // const newValue = event.target.value;
    setSelectedValueType(newValue?.value || "");
    _showvaluetoDrop(newValue?.label);
  };

  const handleSelectChangeGameTypeVendor = (newValue) => {
    setSelectedValueTypeVendor(newValue?.value || "");
  };
  

  const handleSelectChangeGameVendor = (event, newValue) => {
    // const newValue = event.target.value;
    setSelectedValueVendor(newValue?.value || "");
  };

  const handleSelectChangeGameVendorFG = (event, newValue) => {
    // const newValue = event.target.value;
    setSelectedValueVendorFG(newValue?.value || "");
  };

  const user_id = DataHandler.getFromSession("user_id");

  // Specific Game

  const handleGameLimitAdd = () => {
    // Check if the game limit already exists in the list
    const existingLimit = gameLimitArr.find(
      (item) =>
        item.game_id ===
        allProviders.find((provider) => provider.id === selectedValueGameSpec)
          ?.id
    );

    // Already registered on the list.
    if (
      selectedValueGameSpec != "" &&
      maxAmtGameSpec != "" &&
      maxAmtGameSpec != undefined
    ) {
      if (existingLimit) {
        dispatch(
          showMessage({
            variant: "error",
            message: `${selectedLang.already_registered_on_list}`,
          })
        );
      } else {
        setShowGemeSpecList(true);
        let pushIngameLimitArr = {
          unique_id: `${Date.now().toString(36)}1`,
          game_id: gameListWithId.find(
            (item) => item.id == selectedValueGameSpec
          )?.id,
          limit: maxAmtGameSpec,
          title: gameListWithId.find((item) => item.id == selectedValueGameSpec)
            ?.title,
        };
        _gameLimitArr((prevArr) => [...prevArr, pushIngameLimitArr]);
      }
    } else {
      dispatch(
        showMessage({
          variant: "error",
          message: `${selectedLang.please_enter_valid_data}`,
        })
      );
    }
  };

  const handlGameLimitRemove = (unique_idToRemove) => {
    _gameLimitArr((prevArr) =>
      prevArr.filter((item) => item.unique_id !== unique_idToRemove)
    );
  };

  const handleLimitChange = (unique_id, newLimit) => {
    _gameLimitArr((prevArr) =>
      prevArr.map((item) =>
        item.unique_id === unique_id ? { ...item, limit: newLimit } : item
      )
    );
  };

  const handleTypeLimitAdd = () => {
    const existingLimit = typeLimitArr.find(
      (item) => item.game_type === selectedValueType
    );

    if (
      selectedValueType != "" &&
      maxAmtGameType != undefined &&
      maxAmtGameType != ""
    ) {
      if (existingLimit) {
        dispatch(
          showMessage({
            variant: "error",
            message: `${selectedLang.already_registered_on_list}`,
          })
        );
      } else {
        setShowTypeList(true);
        let pushIngameLimitArr = {
          unique_id: `${Date.now().toString(36)}2`,
          game_type: selectedValueType,
          limit: maxAmtGameType,
        };
        _typeLimitArr((prevArr) => [...prevArr, pushIngameLimitArr]);
      }
    } else {
      dispatch(
        showMessage({
          variant: "error",
          message: `${selectedLang.please_enter_valid_data}`,
        })
      );
    }
  };

  const handlTypeLimitRemove = (unique_idToRemove) => {
    _typeLimitArr((prevArr) =>
      prevArr.filter((item) => item.unique_id !== unique_idToRemove)
    );
  };

  const handleTypeLimitChange = (unique_id, newLimit) => {
    _typeLimitArr((prevArr) =>
      prevArr.map((item) =>
        item.unique_id === unique_id ? { ...item, limit: newLimit } : item
      )
    );
  };

  const handleVendorLimitAdd = () => {
    const existingLimit = vendorLimitArr.find(
      (item) => item.vendor === selectedValueVendor
    );

    if (
      selectedValueVendor == "" ||
      maxAmtGameVendor == undefined ||
      maxAmtGameVendor == ""
    ) {
      dispatch(
        showMessage({
          variant: "error",
          message: `${selectedLang.please_enter_valid_data}`,
        })
      );
    } else {
      if (existingLimit) {
        dispatch(
          showMessage({
            variant: "error",
            message: `${selectedLang.already_registered_on_list}`,
          })
        );
      } else {
        setShowVendorList(true);
        let pushIngameLimitArr = {
          unique_id: `${Date.now().toString(36)}3`,
          vendor: selectedValueVendor,
          limit: maxAmtGameVendor,
        };
        _vendorLimitArr((prevArr) => [...prevArr, pushIngameLimitArr]);
      }
    }
  };

  const handlVendorLimitRemove = (unique_idToRemove) => {
    _vendorLimitArr((prevArr) =>
      prevArr.filter((item) => item.unique_id !== unique_idToRemove)
    );
  };

  const handleVendorLimitChange = (unique_id, newLimit) => {
    _vendorLimitArr((prevArr) =>
      prevArr.map((item) =>
        item.unique_id === unique_id ? { ...item, limit: newLimit } : item
      )
    );
  };

  const updateMaxLimitSubmit = () => {
    setShowVendorList(false);
    setShowGemeSpecList(false);
    setShowTypeList(false);

    const payload = {
      user_id: !agent_id ? user_id : agent_id,
      globleLimit: globleLimit,
      gamesLimit: gameLimitArr,
      typeLimit: typeLimitArr,
      vendorLimit: vendorLimitArr,
    };
    APIService({
      url: `${process.env.REACT_APP_R_SITE_API}/betlimit/update-bet-details`,
      method: "PUT",
      data: payload,
    })
      .then((data) => {
        setOpen(false);
        dispatch(
          showMessage({
            variant: "success",
            message: `${selectedLang.bet_limit_updated}`,
          })
        );
        getAllBetList();
        // setGlobalLimit("")
        setSelectedValueGameSpec("");
        setSelectedValueGameSpecName("");
        setmaxAmtGameType("");
        setmaxAmtGameVendor("");
        setmaxAmtGameSpec("");
        setSelectedValueType("");
        setSelectedValueVendor("");
      })
      .catch((err) => {
        dispatch(
          showMessage({
            variant: "error",
            message: `${selectedLang.error_alert}`,
          })
        );
      })
      .finally(() => {});
  };

  const saveAndUpdate = () => {
    let flag = false;

    resultBets.forEach((data) => {
      if (
        data.ga_vendor === selectedValueVendor &&
        data.game_type === selectedValueTypeVendor
      ) {
        flag = true;
      }
    });

    if (flag === false) {
      let error_f_alre_exist = false;

      let _gameTypeStore = undefined;

      let _vendorStore = undefined;

      let _gamesLimitStore = undefined;

      let _gametypebyVendor = undefined;

      const existingLimit = typeLimitArr.find(
        (item) => item.game_type === selectedValueType
      );
      /// add this to show error message when user not input data
      // if (!selectedValueType) {
      // 	return dispatch(
      // 		showMessage({
      // 			variant: 'error',
      // 			message: `${selectedLang.please_enter_valid_data} ${selectedLang.for_game_type}!`,
      // 		})
      // 	);
      // }
      if (
        selectedValueType != "" &&
        (maxAmtGameType == undefined || maxAmtGameType == "")
      ) {
        error_f_alre_exist = true;
        return dispatch(
          showMessage({
            variant: "error",
            message: `${selectedLang.please_enter_valid_data_for_game_type} `,
          })
        );
      } else {
        if (existingLimit && selectedValueType != "") {
          error_f_alre_exist = true;
          return dispatch(
            showMessage({
              variant: "error",
              message: `${selectedLang.Selected_game_type} ${selectedLang.already_registered_on_list}`,
            })
          );
        } else {
          if (
            selectedValueType != "" &&
            maxAmtGameType != undefined &&
            maxAmtGameType != ""
          ) {
            _gameTypeStore = {
              unique_id: `${Date.now().toString(36)}4`,
              game_type: selectedValueType,
              limit: maxAmtGameType,
            };
          }
        }
      }

      const existingLimitByVendor = typeLimitArr.find(
        (item) => item.game_type === selectedValueTypeVendor
      );

      // Type by vendor
      if (
        selectedValueTypeVendor != "" &&
        (maxAmtGameVendor == undefined || maxAmtGameVendor == "")
      ) {
        error_f_alre_exist = true;
        return dispatch(
          showMessage({
            variant: "error",
            message: `${selectedLang.please_enter_valid_vendor}`,
          })
        );
      } else {
        if (
          existingLimitByVendor &&
          selectedValueTypeVendor != "" &&
          existingLimitByVendor.vendor === selectedValueVendor
        ) {
          error_f_alre_exist = true;
          return dispatch(
            showMessage({
              variant: "error",
              message: `${selectedLang.Selected_game_type} ${selectedLang.already_registered_on_list}`,
            })
          );
        } else {
          if (
            selectedValueTypeVendor != "" &&
            maxAmtGameVendor != undefined &&
            maxAmtGameVendor != ""
          ) {
            _gametypebyVendor = {
              unique_id: `${Date.now().toString(36)}5`,
              game_type: selectedValueTypeVendor,
              limit: maxAmtGameVendor,
              vendor: selectedValueVendor,
            };
          }
        }
      }

      // Vendor
      const existingVendor = vendorLimitArr.find(
        (item) => item.vendor === selectedValueVendor
      );

      if (
        selectedValueVendor != "" &&
        (maxAmtGameVendor == undefined || maxAmtGameVendor == "")
      ) {
        error_f_alre_exist = true;
        dispatch(
          showMessage({
            variant: "error",
            message: `${selectedLang.please_enter_valid_data} ${selectedLang.for_vendor}!`,
          })
        );
      } else {
        if (existingVendor && selectedValueVendor != "") {
          error_f_alre_exist = true;
          dispatch(
            showMessage({
              variant: "error",
              message: `${selectedLang.Selected_vendor} ${selectedLang.already_registered_on_list}`,
            })
          );
        } else {
          if (
            selectedValueVendor != "" &&
            maxAmtGameVendor != undefined &&
            maxAmtGameVendor != ""
          ) {
            _vendorStore = {
              unique_id: `${Date.now().toString(36)}6`,
              vendor: selectedValueVendor,
              limit: maxAmtGameVendor,
            };
          }
        }
      }
      // End Vendor

      // Spec game
      const existingLimitSpecGame = gameLimitArr.find(
        (item) =>
          item.game_id ===
          allProviders.find((provider) => provider.id === selectedValueGameSpec)
            ?.id
      );

      if (
        selectedValueGameSpec != "" &&
        (maxAmtGameSpec == "" || maxAmtGameSpec == undefined)
      ) {
        error_f_alre_exist = true;
        dispatch(
          showMessage({
            variant: "error",
            message: `${selectedLang.please_enter_valid_data} ${selectedLang.for_game}!`,
          })
        );
      } else {
        // Already registered on the list.
        if (existingLimitSpecGame && existingLimitSpecGame != "") {
          error_f_alre_exist = true;
          dispatch(
            showMessage({
              variant: "error",
              message: `${selectedLang.Selected_game} ${selectedLang.already_registered_on_list}`,
            })
          );
        } else {
          if (
            selectedValueGameSpec != "" &&
            maxAmtGameSpec != undefined &&
            maxAmtGameSpec != ""
          ) {
            _gamesLimitStore = {
              unique_id: `${Date.now().toString(36)}7`,
              game_id: gameListWithId.find(
                (item) => item.id == selectedValueGameSpec
              )?.id,
              limit: maxAmtGameSpec,
              title: gameListWithId.find(
                (item) => item.id == selectedValueGameSpec
              )?.title,
            };
          }
        }
      }

      const payload = {
        user_id: !agent_id ? user_id : agent_id,
        globleLimit: globleLimit,
        gamesLimit: _gamesLimitStore,
        typeLimit: _gameTypeStore,
        // vendorLimit: _vendorStore,
        gameTypeVendor: _gametypebyVendor,
      };
      if (
        payload?.gamesLimit == undefined &&
        payload?.globleLimit == undefined &&
        payload?.typeLimit == undefined &&
        payload?.vendorLimit == undefined &&
        payload?.gameTypeVendor == undefined
      ) {
        return dispatch(
          showMessage({
            variant: "error",
            message: `${selectedLang.please_enter_valid_data}!`,
          })
        );
      }

      if (error_f_alre_exist == false) {
        _saving(true);
        APIService({
          url: `${process.env.REACT_APP_R_SITE_API}/betlimit/add-single-bet-all`,
          method: "POST",
          data: payload,
        })
          .then((data) => {
            // setBetLimit(data?.data?.data)
            setmaxAmtGameType("");
            setSelectedValueType("");
            setmaxAmtGameVendor("");
            setSelectedValueVendor("");
            setSelectedValueGameSpec("");
            setSelectedValueTypeVendor("");
            setmaxAmtGameSpec("");
            setSelectedValueGameSpecName("");
            setShowgameSpec("");
            _showvaluetoDrop("");
            dispatch(
              showMessage({
                variant: "success",
                message: `${selectedLang.bet_limit_updated}`,
              })
            );
          })
          .catch((err) => {
            dispatch(
              showMessage({
                variant: "error",
                message: `${
                  selectedLang[formatSentence(err?.error?.message)] ||
                  selectedLang.something_went_wrong_please_try_again
                }`,
              })
            );
          })
          .finally(() => {
            _saving(false);
            getAllBetList();
          });
      }
    } else {
      return dispatch(
        showMessage({
          variant: "error",
          message: `Selected game type ${selectedLang.already_registered_on_list}`,
        })
      );
    }
  };

  useEffect(() => {
    getAllBetList();
  }, []);

  const handleDeleteBet = (bet_object_id, type) => {
    const payload = {
      user_id: user_id,
      bet_object_id: bet_object_id,
      type: type,
    };
    APIService({
      url: `${process.env.REACT_APP_R_SITE_API}/betlimit/delete-max-bet`,
      method: "POST",
      data: payload,
    })
      .then((data) => {
        // setBetLimit(data?.data?.data)
        dispatch(
          showMessage({
            variant: "success",
            message: `${selectedLang.max_bet_deleted_successfuly}`,
          })
        );
      })
      .catch((err) => {
        dispatch(
          showMessage({
            variant: "error",
            message: `${selectedLang.something_went_wrong_please_try_again}`,
          })
        );
      })
      .finally(() => {
        getAllBetList();
      });
  };

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

  const initialDefaultValues = {};

  resultBets.forEach((data) => {
    initialDefaultValues[data?.unique_id] = Number(
      data?.limit
    )?.toLocaleString();
  });

  const handleInputChange = (unique_id, value) => {
    setInputValues((prevInputValues) => ({
      ...prevInputValues,
      [unique_id]: value,
    }));
  };

  const actionBetting = ({ unique_id, type, action }) => {
    const value = inputValues[unique_id];

    if (action == "1" && value == "") {
      return dispatch(
        showMessage({
          variant: "error",
          message: `${selectedLang.please_enter_valid_data}`,
        })
      );
    }

    if (action == "1" && value == "0") {
      return dispatch(
        showMessage({
          variant: "error",
          message: `${selectedLang.limit_should_be_more_than_0}`,
        })
      );
    }

    const payload = {
      unique_id,
      type,
      action,
      user_id: !agent_id ? user_id : agent_id,
      limit:
        parseInt(String(inputValues[unique_id]).replace(/,/g, "")) ||
        parseInt(String(initialDefaultValues[unique_id]).replace(/,/g, "")),
    };

    APIService({
      url: `${process.env.REACT_APP_R_SITE_API}/betlimit/action`,
      method: "PUT",
      data: payload,
    })
      .then((data) => {
        setOpen(false);
        getBetLimit();
        dispatch(
          showMessage({
            variant: "success",
            message: `${
              action == 1
                ? selectedLang.bet_limit_updated
                : selectedLang.bet_limit_deleted
            }`,
          })
        );
        getAllBetList();
      })
      .catch((err) => {});
  };

  const addTableData = () => {
    if (resultBets) {
      return (
        <TableBody>
          {resultBets
            // .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            .map((data, index) => {
              return (
                <StyledTableRow hover role="checkbox" tabIndex={-1} key={index}>
                  <TableCell
                    sx={{
                      textAlign: "center",
                    }}
                  >
                    {data?.game && (
                      <p style={{ fontWeight: "bold" }}>
                        {selectedLang.global_settings}
                      </p>
                    )}
                  </TableCell>

                  <TableCell
                    sx={{
                      textAlign: "center",
                    }}
                  >
                    {/* {data?.vendor && data?.ga_type} */}
                    {data?.game_id && data?.ga_type && selectLocale == "ko"
                      ? allProviders.filter(
                          (pro) => pro.type == data?.ga_type
                        )[0]?.type_kr
                      : data?.game_id && data?.ga_type}

                    <span style={{ fontWeight: "bold" }}>
                      {/* {data?.game_type && data?.game_type} */}
                      {data?.game_type && selectLocale == "ko"
                        ? allProviders.filter(
                            (pro) => pro.type == data.game_type
                          )[0]?.type_kr || data?.game_type
                        : data?.game_type}
                    </span>
                  </TableCell>
                  <TableCell
                    sx={{
                      textAlign: "center",
                    }}
                    // style={{ fontWeight: "bold" }}
                  >
                    {data?.game_id && data?.ga_vendor && selectLocale == "ko"
                      ? vendorList.filter(
                          (pro) => pro.vendor_name == data?.ga_vendor
                        )[0]?.vendor_name_kr || data?.ga_vendor
                      : data?.game_id && data?.ga_vendor}
                    <span style={{ fontWeight: "bold" }}>
                      {/* {data?.vendor && data?.vendor} */}

                      {data?.vendor && selectLocale == "ko"
                        ? vendorList.filter(
                            (pro) => pro.vendor_name == data?.vendor
                          )[0]?.vendor_name_kr || data?.vendor
                        : data?.vendor}
                    </span>
                  </TableCell>
                  <TableCell
                    sx={{
                      textAlign: "center",
                    }}
                  >
                    <span style={{ fontWeight: "bold" }}>
                      {/* {data?.game_id && data?.title} */}
                      {data?.game_id && selectLocale == "ko"
                        ? gameListWithId
                            .filter((pro) => pro.title == data?.title)[0]
                            ?.langs.find(
                              (langObject) => langObject.lang === "ko"
                            )?.name || data?.title
                        : data?.title}
                    </span>
                  </TableCell>

                  <TableCell
                    sx={{
                      textAlign: "center",
                    }}
                  >
                    {/* {data?.limit} */}
                    <div
                      className="col-lg-2 col-md-4 col-sm-4"
                      style={{ minWidth: "130px" }}
                    >
                      {/* <FormControl>
                          <InputBase
                            sx={{
                              ml: 1,
                              flex: 1,
                              border: "1px solid #cdcfd3",
                              borderRadius: "4px",
                              marginLeft: "8px",
                              padding: "4px 10px",
                              marginRight: "0px",
                              fontSize: "12px",
                            }}
							type='text'
							defaultValue={Number(data?.limit)?.toLocaleString()}
							id={data?.unique_id || "global"}
                            inputProps={{
                              "aria-label": selectedLang.casino_users,
                            }}
                          />
                        </FormControl> */}
                      <BettingInput
                        key={index}
                        data={data}
                        onInputChange={handleInputChange}
                        defaultValue={inputValues[data?.unique_id]}
                      />
                    </div>
                  </TableCell>

                  <TableCell
                    sx={{
                      textAlign: "center",
                    }}
                  >
                    <div className="row flex justify-center justify-items-center">
                      <div className="col-lg-2 col-md-4 col-sm-4 pl-10 flex item-center">
                        <Button
                          className="flex item-center buttonbox"
                          variant="contained"
                          color="success"
                          size="small"
                          sx={{
                            borderRadius: "4px",
                          }}
                          onClick={() =>
                            actionBetting({
                              unique_id: data?.unique_id,
                              type: data?.game
                                ? "Global"
                                : data?.game_type
                                ? "game_type"
                                : data?.vendor
                                ? "vendor"
                                : "Spec_game",
                              action: "1",
                            })
                          }
                        >
                          {selectedLang.update}
                        </Button>
                      </div>

                      <div className="col-lg-2 col-md-4 col-sm-4 pl-10 flex item-center">
                        <Button
                          className="flex item-center buttonbox"
                          variant="contained"
                          color="error"
                          size="small"
                          sx={{
                            borderRadius: "4px",
                          }}
                          onClick={() =>
                            actionBetting({
                              unique_id: data?.unique_id,
                              type: data?.game
                                ? "Global"
                                : data?.game_type
                                ? "game_type"
                                : data?.vendor
                                ? "vendor"
                                : "Spec_game",
                              action: "0",
                            })
                          }
                        >
                          {selectedLang.delete}
                        </Button>
                      </div>
                    </div>
                  </TableCell>
                </StyledTableRow>
              );
            })}
        </TableBody>
      );
    }
  };

  return (
    <>
      {" "}
      {loaded ? (
        <FuseLoading />
      ) : (
        <FusePageSimple
          header={<ProviderManagementHeader selectedLang={selectedLang} />}
          content={
            <div className="" style={{ width: "100%" }}>
              {/* <div className="flex justify-start justify-items-center bg-gray p-10 list_title w-100">
              <span className="list-title">{selectedLang.Maximumbetlimit}</span>
            </div> */}

              <Box className="common_card">
                <div>
                  <Typography
                    className="mb-4 titlke"
                    id="modal-modal-title"
                    variant="h5"
                    component="h2"
                  >
                    <b>{selectedLang.how_to_set_maximum_bet_amount_limit} </b>
                  </Typography>
                  <Typography id="modal-modal-title" className="title_modal">
                    <b>
                      {
                        selectedLang.the_maximum_bet_limit_is_applied_following_order
                      }
                    </b>
                  </Typography>
                </div>
                <code className="code_block">
                  {" "}
                  {selectedLang.global_settings} &gt;{selectedLang.by_type} &gt;{" "}
                  {selectedLang.by_vendor} &gt;{selectedLang.by_game}{" "}
                </code>
                <Modal
                  open={open}
                  onClose={handleCloseClick}
                  aria-labelledby="modal-modal-title"
                  aria-describedby="modal-modal-description"
                >
                  <Box
                    className="popup-box"
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      padding: "20px",
                      alignItems: "flex-end",
                    }}
                  >
                    <button className="modalclosebtn" onClick={handleClose}>
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

                    {/* Replace the PDF viewer with two images */}
                    <div
                      style={{
                        maxHeight: "800px",
                        overflowY: "auto",
                        marginTop: "20px",
                        // marginBottom: "20px",
                      }}
                    >
                      <img
                        src="/assets/images/tut/0001.jpg"
                        alt="First Image"
                        style={{
                          width: "81%",
                          height: "auto",
                          marginLeft: "260px",
                        }}
                      />
                      <img
                        src="/assets/images/tut/0002.jpg"
                        alt="Second Image"
                        style={{
                          width: "81%",
                          height: "auto",
                          marginTop: "20px",
                          marginLeft: "260px",
                        }}
                      />
                    </div>
                  </Box>
                </Modal>

                {/* <p className="paragraph">
                When the Evolution vendor setting is , if "Korean Speed
                ​​Baccarat A" in Evolution is set to &gt; Other games in
                Evolution are subject to restrictions, but "Korean Speed
                ​​Baccarat A" is limited to{" "}
              </p>
              <code className="code_block"> 100,000 </code>
              <code className="code_block"> 10,000 </code>
              <code className="code_block"> 100,000 </code>
              <code className="code_block"> 10,000 </code>
              <hr />
              <Typography id="modal-modal-title" className="title_modal mt-4">
                <b>
                  {" "}
                  If you want to use a game company in a whitelist way, you can
                  manage it in the following way.
                </b>
              </Typography>
              <code className="code_block"> 전역 설정: 1 </code>
              <code className="code_block">
                {" "}
                벤더별 설정 &gt; evolution: 100,000,000{" "}
              </code>
              <p className="mb-4 paragraph">
                (Application example) Since the global setting is 1circle, all
                bets are blocked. In the vendor-specific settings, evolution{" "}
                <code className="code_block">100,000,000</code> is set to , so
                betting is possible within the in-game limit.
              </p>

              <hr />
              <Typography
                id="modal-modal-title"
                className="title_modal mt-4 mb-2">
                <b> You cannot set more than the maximum amount in-game. </b>
              </Typography>
              <p className="mb-4 paragraph">
                If you can bet up to in-game{" "}
                <code className="code_block">1,000,000</code> , even if you set
                the maximum bet amount to ,{" "}
                <code className="code_block">10,000,000 </code> you cannot bet
                more than the amount set in-game.However, in the case of Bota,
                the amount in the game fluctuates as much as the maximum bet
                limit is set.
              </p>
              <hr />
              <Typography
                id="modal-modal-title"
                className="title_modal mt-4 mb-2">
                <b> DreamGaming Guide </b>
              </Typography>
              <p className="paragraph">
                Please note that Dream Gaming does not provide information about
                tables from game companies,{" "}
                <code className="code_block">live</code> so they are classified
                only by type.
              </p>*/}
              </Box>

              <Box
                className="create_bet_modal"
                style={{ position: "relative" }}
              >
                <Typography
                  id="modal-modal-title"
                  variant="h6"
                  component="h2"
                  style={{ color: "#fff" }}
                >
                  <b>{selectedLang.Maximumbetlimit}</b>
                </Typography>
                {/* <Button
                  variant="contained"
                  className="tut_btn mb-0"
                  onClick={handleOpenClick}
                >
                  {selectedLang.Setup_Guide}
                </Button> */}
                <div className="modal_inner" style={{ marginTop: "10px" }}>
                  <div className="table-responsive">
                    <table className="table">
                      <thead>
                        <tr>
                          <th className="text-left">
                            {selectedLang.classification_of_settings}
                          </th>
                          <th className="widthth">{selectedLang.set_target}</th>
                          <th>{selectedLang.maximum_bet_amount}</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>
                            {" "}
                            <b>{selectedLang.global_settings} </b>
                          </td>
                          <td>{selectedLang.for_all_games}</td>
                          <td>
                            <span>
                              <TextField
                                size="small"
                                fullWidth
                                placeholder={`${selectedLang.global_settings}`}
                                value={
                                  globleLimit === ""
                                    ? ""
                                    : formatAmount(globleLimit)
                                }
                                onChange={(e) => {
                                  let inputValue = e.target.value;
                                  inputValue = inputValue.replace(
                                    /[^0-9.]/g,
                                    ""
                                  );
                                  const dotCount =
                                    inputValue.split(".").length - 1;
                                  if (dotCount > 1) {
                                    return;
                                  }
                                  const numericValue = parseFloat(inputValue);
                                  const maxLimit = 100000000;
                                  if (
                                    inputValue === "" ||
                                    (numericValue <= maxLimit &&
                                      numericValue >= 0)
                                  ) {
                                    setGlobalLimit(
                                      inputValue === "" ? "" : numericValue
                                    );
                                  }
                                }}
                              />
                              <br />
                              <div style={{ marginTop: "5px" }}>
                                {
                                  selectedLang.individual_settings_take_over_global_settings
                                }
                              </div>
                            </span>
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <b>{selectedLang.settings_by_type}</b>
                          </td>
                          <td>
                            {/* <Autocomplete
                              onChange={handleSelectChangeGameType}
                              className="datatextbox"
                              variant="outlined"
                              disablePortal
                              size="small"
                              id="combo-box-demo"
                              noOptionsText={selectedLang.no_option}
                              value={selectedValueType ? showValuetoDrop : null}
                              options={
                                loading
                                  ? [{ label: "loading...", value: null }]
                                  : [
                                      ...new Set(
                                        allProviders
                                          .filter(
                                            (data) =>
                                              data &&
                                              data.type &&
                                              data.type.trim() !== ""
                                          )
                                          .sort((a, b) =>
                                            a.type.localeCompare(
                                              b.type.toLowerCase()
                                            )
                                          )
                                          .map(
                                            (data) =>
                                              `${data.type} - ${data.type_kr}`
                                          )
                                      ),
                                    ].map((label) => ({
                                      label,
                                      value: label.split(" - ")[0], // Extracting only data.type for the value
                                    }))
                              }
                              isOptionEqualToValue={(option, value) =>
                                option.value === value.value
                              }
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  className="textSearch"
                                  label={selectedLang.GameType}
                                />
                              )}
                            /> */}
                            <Autocomplete
                              onChange={handleSelectChangeGameType}
                              className="datatextbox"
                              variant="outlined"
                              disablePortal
                              size="small"
                              id="combo-box-demo"
                              options={optionsGameType}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  className="textSearch"
                                  label={selectedLang.GameType}
                                />
                              )}
                            />
                          </td>
                          <td>
                            <span className="text-buttons">
                              <TextField
                                // size="small"
                                // fullWidth
                                // type="search"
                                // placeholder={`${selectedLang.maximum_amount} 0`}
                                // value={formatAmount(maxAmtGameType)}
                                // // onChange={({target})=>{setmaxAmtGameType(target.value)}}
                                // onChange={(e) => {
                                //   const formattedValue =
                                //     checkBetAmountLimt(e);
                                //   if (!formattedValue) return;
                                //   // const inputValue = e.target.value;
                                //   // const numericValue = inputValue.replace(
                                //   // 	/[^0-9.]/g,
                                //   // 	''
                                //   // ); // Remove non-numeric characters except dot (.)
                                //   setmaxAmtGameType(formattedValue);
                                // }}
                                size="small"
                                fullWidth
                                placeholder={`${selectedLang.maximum_amount} 0`}
                                value={
                                  maxAmtGameType === ""
                                    ? ""
                                    : formatAmount(maxAmtGameType)
                                }
                                onChange={(e) => {
                                  let inputValue = e.target.value;
                                  inputValue = inputValue.replace(
                                    /[^0-9.]/g,
                                    ""
                                  );
                                  const dotCount =
                                    inputValue.split(".").length - 1;
                                  if (dotCount > 1) {
                                    return;
                                  }
                                  const numericValue = parseFloat(inputValue);
                                  const maxLimit = 100000000;
                                  if (
                                    inputValue === "" ||
                                    (numericValue <= maxLimit &&
                                      numericValue >= 0)
                                  ) {
                                    setmaxAmtGameType(
                                      inputValue === "" ? "" : numericValue
                                    );
                                  }
                                }}
                              />
                              {/* <Button
																	variant='contained'
																	className='plusbtn'
																	onClick={() => {
																		handleTypeLimitAdd();
																	}}>
																	<svg
																		width='20'
																		height='20'
																		viewBox='0 0 20 20'
																		fill='none'
																		xmlns='http://www.w3.org/2000/svg'>
																		<path
																			d='M9.95508 0.4375C8.0638 0.4375 6.21499 0.998331 4.64244 2.04907C3.0699 3.09981 1.84425 4.59327 1.12048 6.34059C0.396721 8.08791 0.207352 10.0106 0.576323 11.8656C0.945294 13.7205 1.85603 15.4244 3.19337 16.7617C4.53071 18.0991 6.23459 19.0098 8.08953 19.3788C9.94448 19.7477 11.8672 19.5584 13.6145 18.8346C15.3618 18.1108 16.8553 16.8852 17.906 15.3126C18.9568 13.7401 19.5176 11.8913 19.5176 10C19.5146 7.46478 18.5062 5.03425 16.7135 3.24158C14.9208 1.44891 12.4903 0.440477 9.95508 0.4375ZM9.95508 18.4375C8.2863 18.4375 6.655 17.9426 5.26746 17.0155C3.87992 16.0884 2.79846 14.7706 2.15985 13.2289C1.52123 11.6871 1.35414 9.99064 1.67971 8.35393C2.00527 6.71721 2.80886 5.21379 3.98887 4.03379C5.16887 2.85378 6.67229 2.05019 8.30901 1.72462C9.94572 1.39906 11.6422 1.56615 13.184 2.20477C14.7257 2.84338 16.0435 3.92484 16.9706 5.31238C17.8977 6.69992 18.3926 8.33122 18.3926 10C18.3901 12.237 17.5004 14.3817 15.9186 15.9635C14.3368 17.5453 12.1921 18.435 9.95508 18.4375ZM14.2676 10C14.2676 10.1492 14.2083 10.2923 14.1028 10.3977C13.9973 10.5032 13.8543 10.5625 13.7051 10.5625H10.5176V13.75C10.5176 13.8992 10.4583 14.0423 10.3528 14.1477C10.2473 14.2532 10.1043 14.3125 9.95508 14.3125C9.8059 14.3125 9.66282 14.2532 9.55734 14.1477C9.45185 14.0423 9.39258 13.8992 9.39258 13.75V10.5625H6.20508C6.0559 10.5625 5.91282 10.5032 5.80734 10.3977C5.70185 10.2923 5.64258 10.1492 5.64258 10C5.64258 9.85082 5.70185 9.70774 5.80734 9.60225C5.91282 9.49676 6.0559 9.4375 6.20508 9.4375H9.39258V6.25C9.39258 6.10082 9.45185 5.95774 9.55734 5.85225C9.66282 5.74676 9.8059 5.6875 9.95508 5.6875C10.1043 5.6875 10.2473 5.74676 10.3528 5.85225C10.4583 5.95774 10.5176 6.10082 10.5176 6.25V9.4375H13.7051C13.8543 9.4375 13.9973 9.49676 14.1028 9.60225C14.2083 9.70774 14.2676 9.85082 14.2676 10Z'
																			fill='black'
																		/>
																	</svg>
																</Button> */}
                            </span>
                          </td>
                        </tr>
                        {showTypList &&
                          typeLimitArr?.map((data, key) => (
                            <tr key={key}>
                              <td>{selectedLang.settings_by_type}</td>

                              <td>{data?.game_type}</td>
                              <td>
                                <span className="text-buttons">
                                  <TextField
                                    size="small"
                                    type="search"
                                    fullWidth
                                    placeholder={`${selectedLang.maximum_amount} 0`}
                                    value={formatAmount(data?.limit)}
                                    // onChange={e => handleTypeLimitChange(data?.unique_id, e.target.value)}
                                    onChange={(e) => {
                                      const formattedValue =
                                        checkBetAmountLimt(e);
                                      if (!formattedValue) return;
                                      // const inputValue = e.target.value;
                                      // const numericValue = inputValue.replace(
                                      // 	/[^0-9.]/g,
                                      // 	''
                                      // ); // Remove non-numeric characters except dot (.)
                                      handleTypeLimitChange(
                                        data?.unique_id,
                                        formattedValue
                                      );
                                    }}
                                  />
                                  <Button
                                    variant="contained"
                                    className="minusbtn"
                                    onClick={() => {
                                      handlTypeLimitRemove(data?.unique_id);
                                    }}
                                  >
                                    <svg
                                      width="25"
                                      height="24"
                                      viewBox="0 0 25 24"
                                      fill="none"
                                      xmlns="http://www.w3.org/2000/svg"
                                    >
                                      <path
                                        d="M12.9551 2.4375C11.0638 2.4375 9.21499 2.99833 7.64244 4.04907C6.0699 5.09981 4.84425 6.59327 4.12048 8.34059C3.39672 10.0879 3.20735 12.0106 3.57632 13.8656C3.94529 15.7205 4.85603 17.4244 6.19337 18.7617C7.53071 20.099 9.23459 21.0098 11.0895 21.3788C12.9445 21.7477 14.8672 21.5584 16.6145 20.8346C18.3618 20.1108 19.8553 18.8852 20.906 17.3126C21.9568 15.7401 22.5176 13.8913 22.5176 12C22.5146 9.46478 21.5062 7.03425 19.7135 5.24158C17.9208 3.44891 15.4903 2.44048 12.9551 2.4375ZM12.9551 20.4375C11.2863 20.4375 9.655 19.9426 8.26746 19.0155C6.87992 18.0884 5.79846 16.7706 5.15985 15.2289C4.52123 13.6871 4.35414 11.9906 4.67971 10.3539C5.00527 8.71721 5.80886 7.21379 6.98887 6.03379C8.16887 4.85378 9.67229 4.05019 11.309 3.72462C12.9457 3.39906 14.6422 3.56615 16.184 4.20477C17.7257 4.84338 19.0435 5.92484 19.9706 7.31238C20.8977 8.69992 21.3926 10.3312 21.3926 12C21.3901 14.237 20.5004 16.3817 18.9186 17.9635C17.3368 19.5453 15.1921 20.435 12.9551 20.4375Z"
                                        fill="black"
                                      />
                                      <path
                                        d="M17.1028 12.3977C17.2083 12.2923 17.2676 12.1492 17.2676 12C17.2676 11.8508 17.2083 11.7077 17.1028 11.6023C16.9973 11.4968 16.8543 11.4375 16.7051 11.4375H13.5176H12.3926H9.20508C9.05589 11.4375 8.91282 11.4968 8.80733 11.6023C8.70184 11.7077 8.64258 11.8508 8.64258 12C8.64258 12.1492 8.70184 12.2923 8.80733 12.3977C8.91282 12.5032 9.05589 12.5625 9.20508 12.5625H12.3926H13.5176H16.7051C16.8543 12.5625 16.9973 12.5032 17.1028 12.3977Z"
                                        fill="black"
                                      />
                                    </svg>
                                  </Button>
                                </span>
                              </td>
                            </tr>
                          ))}

                        <tr>
                          <td>
                            {" "}
                            <b>{selectedLang.vendor_specific_settings}</b>
                          </td>
                          <td>
                            <div
                              className="flexbos"
                              style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: "10px",
                              }}
                            >
                              {/* <Autocomplete
                                value={selectedValueVendor || null}
                                onChange={handleSelectChangeGameVendor}
                                // className="w-full h-40 my-8"
                                className="datatextbox"
                                variant="outlined"
                                disablePortal
                                size="small"
                                id="combo-box-demo"
                                noOptionsText={selectedLang.no_option}
                                // options={[
                                // 	...[
                                // 		...new Set(
                                // 			allProviders
                                // 				.filter(
                                // 					(data) =>
                                // 						data &&
                                // 						data.vendor &&
                                // 						data.vendor.trim() !== ''
                                // 				)
                                // 				.sort((a, b) =>
                                // 					a?.vendor.localeCompare(b?.vendor)
                                // 				)
                                // 				.map((data) => data.vendor)
                                // 		),
                                // 	].map((vendor, key) => ({
                                // 		label: vendor,
                                // 		value: vendor,
                                // 	})),
                                // ]}
                                options={vendorList
                                  ?.filter(
                                    (data) =>
                                      data &&
                                      data.vendor_name &&
                                      data.vendor_name.trim() !== ""
                                  )
                                  .sort((a, b) =>
                                    a.vendor_name?.localeCompare(
                                      b?.vendor_name.toLowerCase()
                                    )
                                  )
                                  .map((data) => ({
                                    label:
                                      data?.vendor_name +
                                      " - " +
                                      data?.vendor_name_kr,
                                    value: data?.vendor_name,
                                  }))}
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    className="textSearch"
                                    label={selectedLang.vendor_selection}
                                  />
                                )}
                              /> */}

                              <Autocomplete
                                onChange={handleSelectChangeGameVendor}
                                className=""
                                variant="outlined"
                                disablePortal
                                size="small"
                                id="combo-box-demo"
                                options={[
                                  ...[
                                    ...new Set(
                                      allGameVendor
                                        .filter(
                                          (data) =>
                                            data &&
                                            data.vendor_name &&
                                            data.vendor_name.trim() !== ""
                                        )
                                        .sort((a, b) => {
                                          const aVendor =
                                            a && a.vendor_name
                                              ? a.vendor_name.toLowerCase()
                                              : "";
                                          const bVendor =
                                            b && b.vendor_name
                                              ? b.vendor_name.toLowerCase()
                                              : "";
                                          return aVendor.localeCompare(bVendor);
                                        })
                                        .map((data) => data.vendor_name)
                                    ),
                                  ].map((vendor_name, key) => ({
                                    label: vendor_name,
                                    value: vendor_name,
                                  })),
                                ]}
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    className="textSearch"
                                    label={selectedLang.game_vendor}
                                  />
                                )}
                              />

                              {/* Vendor based type */}
                              <Autocomplete
                                onChange={(event, newValue) =>
                                  handleSelectChangeGameTypeVendor(newValue)
                                }
                                className="datatextbox"
                                variant="outlined"
                                disablePortal
                                size="small"
                                id="combo-box-demo"
                                noOptionsText={allProviders.length === 0 ? "loading..." : selectedLang.no_option}
                                value={selectedValueTypeVendor || null}
                                options={[
                                  ...(selectedValueVendor !== "" && allProviders.length !== 0
                                    ? [
                                        {
                                          label: `${selectedLang.all}`,
                                          value: "all",
                                        },
                                      ]
                                    : []),
                                  ...[
                                    ...new Set(
                                      allProviders
                                        .filter(
                                          (data) =>
                                            data &&
                                            data.type &&
                                            data.type.trim() !== "" &&
                                            data.vendor === selectedValueVendor
                                        )
                                        .sort((a, b) =>
                                          a.type.localeCompare(
                                            b.type.toLowerCase()
                                          )
                                        )
                                        .map(
                                          (data) =>
                                            `${data.type} - ${data.type_kr}`
                                        )
                                    ),
                                  ].map((type) => ({
                                    label: type,
                                    value: type.split(" - ")[0], // Extracting only data.type for the value
                                  })),
                                ]}
                                isOptionEqualToValue={(option, value) =>
                                  option.value === value.value
                                }
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    className="textSearch"
                                    label={selectedLang.GameType}
                                  />
                                )}
                              />
                            </div>
                          </td>
                          <td>
                            <span className="text-buttons">
                              <TextField
                                size="small"
                                fullWidth
                                placeholder={`${selectedLang.maximum_amount} 0`}
                                value={
                                  maxAmtGameVendor === ""
                                    ? ""
                                    : formatAmount(maxAmtGameVendor)
                                }
                                onChange={(e) => {
                                  let inputValue = e.target.value;
                                  inputValue = inputValue.replace(
                                    /[^0-9.]/g,
                                    ""
                                  );
                                  const dotCount =
                                    inputValue.split(".").length - 1;
                                  if (dotCount > 1) {
                                    return;
                                  }
                                  const numericValue = parseFloat(inputValue);
                                  const maxLimit = 100000000;
                                  if (
                                    inputValue === "" ||
                                    (numericValue <= maxLimit &&
                                      numericValue >= 0)
                                  ) {
                                    setmaxAmtGameVendor(
                                      inputValue === "" ? "" : numericValue
                                    );
                                  }
                                }}
                              />
                              {/* <Button
																	variant='contained'
																	className='plusbtn'
																	onClick={() => {
																		handleVendorLimitAdd();
																	}}>
																	<svg
																		width='20'
																		height='20'
																		viewBox='0 0 20 20'
																		fill='none'
																		xmlns='http://www.w3.org/2000/svg'>
																		<path
																			d='M9.95508 0.4375C8.0638 0.4375 6.21499 0.998331 4.64244 2.04907C3.0699 3.09981 1.84425 4.59327 1.12048 6.34059C0.396721 8.08791 0.207352 10.0106 0.576323 11.8656C0.945294 13.7205 1.85603 15.4244 3.19337 16.7617C4.53071 18.0991 6.23459 19.0098 8.08953 19.3788C9.94448 19.7477 11.8672 19.5584 13.6145 18.8346C15.3618 18.1108 16.8553 16.8852 17.906 15.3126C18.9568 13.7401 19.5176 11.8913 19.5176 10C19.5146 7.46478 18.5062 5.03425 16.7135 3.24158C14.9208 1.44891 12.4903 0.440477 9.95508 0.4375ZM9.95508 18.4375C8.2863 18.4375 6.655 17.9426 5.26746 17.0155C3.87992 16.0884 2.79846 14.7706 2.15985 13.2289C1.52123 11.6871 1.35414 9.99064 1.67971 8.35393C2.00527 6.71721 2.80886 5.21379 3.98887 4.03379C5.16887 2.85378 6.67229 2.05019 8.30901 1.72462C9.94572 1.39906 11.6422 1.56615 13.184 2.20477C14.7257 2.84338 16.0435 3.92484 16.9706 5.31238C17.8977 6.69992 18.3926 8.33122 18.3926 10C18.3901 12.237 17.5004 14.3817 15.9186 15.9635C14.3368 17.5453 12.1921 18.435 9.95508 18.4375ZM14.2676 10C14.2676 10.1492 14.2083 10.2923 14.1028 10.3977C13.9973 10.5032 13.8543 10.5625 13.7051 10.5625H10.5176V13.75C10.5176 13.8992 10.4583 14.0423 10.3528 14.1477C10.2473 14.2532 10.1043 14.3125 9.95508 14.3125C9.8059 14.3125 9.66282 14.2532 9.55734 14.1477C9.45185 14.0423 9.39258 13.8992 9.39258 13.75V10.5625H6.20508C6.0559 10.5625 5.91282 10.5032 5.80734 10.3977C5.70185 10.2923 5.64258 10.1492 5.64258 10C5.64258 9.85082 5.70185 9.70774 5.80734 9.60225C5.91282 9.49676 6.0559 9.4375 6.20508 9.4375H9.39258V6.25C9.39258 6.10082 9.45185 5.95774 9.55734 5.85225C9.66282 5.74676 9.8059 5.6875 9.95508 5.6875C10.1043 5.6875 10.2473 5.74676 10.3528 5.85225C10.4583 5.95774 10.5176 6.10082 10.5176 6.25V9.4375H13.7051C13.8543 9.4375 13.9973 9.49676 14.1028 9.60225C14.2083 9.70774 14.2676 9.85082 14.2676 10Z'
																			fill='black'
																		/>
																	</svg>
																</Button> */}
                            </span>
                          </td>
                        </tr>
                        {showVendorList &&
                          vendorLimitArr?.map((data, key) => (
                            <tr key={key}>
                              <td>{selectedLang.vendor_specific_settings} </td>
                              <td>{data?.vendor}</td>
                              <td>
                                <span className="text-buttons">
                                  <TextField
                                    size="small"
                                    fullWidth
                                    type="search"
                                    placeholder={`${selectedLang.maximum_amount} 0`}
                                    // onChange={({target})=>{setmaxAmtGameVendor(target.value)}}
                                    value={formatAmount(data?.limit)}
                                    // onChange={e => handleVendorLimitChange(data?.unique_id, e.target.value)}
                                    onChange={(e) => {
                                      const formattedValue =
                                        checkBetAmountLimt(e);
                                      if (!formattedValue) return;
                                      // const inputValue = e.target.value;
                                      // const numericValue = inputValue.replace(
                                      // 	/[^0-9.]/g,
                                      // 	''
                                      // ); // Remove non-numeric characters except dot (.)
                                      handleVendorLimitChange(
                                        data?.unique_id,
                                        formattedValue
                                      );
                                    }}
                                  />
                                  <Button
                                    variant="contained"
                                    className="minusbtn"
                                    onClick={() => {
                                      handlVendorLimitRemove(data?.unique_id);
                                    }}
                                  >
                                    <svg
                                      width="25"
                                      height="24"
                                      viewBox="0 0 25 24"
                                      fill="none"
                                      xmlns="http://www.w3.org/2000/svg"
                                    >
                                      <path
                                        d="M12.9551 2.4375C11.0638 2.4375 9.21499 2.99833 7.64244 4.04907C6.0699 5.09981 4.84425 6.59327 4.12048 8.34059C3.39672 10.0879 3.20735 12.0106 3.57632 13.8656C3.94529 15.7205 4.85603 17.4244 6.19337 18.7617C7.53071 20.099 9.23459 21.0098 11.0895 21.3788C12.9445 21.7477 14.8672 21.5584 16.6145 20.8346C18.3618 20.1108 19.8553 18.8852 20.906 17.3126C21.9568 15.7401 22.5176 13.8913 22.5176 12C22.5146 9.46478 21.5062 7.03425 19.7135 5.24158C17.9208 3.44891 15.4903 2.44048 12.9551 2.4375ZM12.9551 20.4375C11.2863 20.4375 9.655 19.9426 8.26746 19.0155C6.87992 18.0884 5.79846 16.7706 5.15985 15.2289C4.52123 13.6871 4.35414 11.9906 4.67971 10.3539C5.00527 8.71721 5.80886 7.21379 6.98887 6.03379C8.16887 4.85378 9.67229 4.05019 11.309 3.72462C12.9457 3.39906 14.6422 3.56615 16.184 4.20477C17.7257 4.84338 19.0435 5.92484 19.9706 7.31238C20.8977 8.69992 21.3926 10.3312 21.3926 12C21.3901 14.237 20.5004 16.3817 18.9186 17.9635C17.3368 19.5453 15.1921 20.435 12.9551 20.4375Z"
                                        fill="black"
                                      />
                                      <path
                                        d="M17.1028 12.3977C17.2083 12.2923 17.2676 12.1492 17.2676 12C17.2676 11.8508 17.2083 11.7077 17.1028 11.6023C16.9973 11.4968 16.8543 11.4375 16.7051 11.4375H13.5176H12.3926H9.20508C9.05589 11.4375 8.91282 11.4968 8.80733 11.6023C8.70184 11.7077 8.64258 11.8508 8.64258 12C8.64258 12.1492 8.70184 12.2923 8.80733 12.3977C8.91282 12.5032 9.05589 12.5625 9.20508 12.5625H12.3926H13.5176H16.7051C16.8543 12.5625 16.9973 12.5032 17.1028 12.3977Z"
                                        fill="black"
                                      />
                                    </svg>
                                  </Button>
                                </span>
                              </td>
                            </tr>
                          ))}

                        <tr>
                          <td>
                            {" "}
                            <b>{selectedLang.game_specific_settings}</b>
                          </td>
                          <td>
                            <div
                              className="flexbos"
                              style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: "10px",
                              }}
                            >
                              {/* <Autocomplete
                                value={selectedValueVendorFG || null}
                                onChange={handleSelectChangeGameVendorFG}
                                // className="w-full h-40 my-8"
                                className="datatextbox"
                                variant="outlined"
                                disablePortal
                                size="small"
                                id="combo-box-demo"
                                noOptionsText={selectedLang.no_option}
                                // options={[
                                // 	...[
                                // 		...new Set(
                                // 			allProviders
                                // 				.filter(
                                // 					(data) =>
                                // 						data &&
                                // 						data.vendor &&
                                // 						data.vendor.trim() !== ''
                                // 				)
                                // 				.sort((a, b) =>
                                // 					a?.vendor.localeCompare(b?.vendor)
                                // 				)
                                // 				.map((data) => data.vendor)
                                // 		),
                                // 	].map((vendor, key) => ({
                                // 		label: vendor,
                                // 		value: vendor,
                                // 	})),
                                // ]}
                                options={vendorList
                                  ?.filter(
                                    (data) =>
                                      data &&
                                      data.vendor_name &&
                                      data.vendor_name.trim() !== ""
                                  )
                                  .sort((a, b) =>
                                    a.vendor_name?.localeCompare(
                                      b?.vendor_name.toLowerCase()
                                    )
                                  )
                                  .map((data) => ({
                                    label:
                                      data?.vendor_name +
                                      " - " +
                                      data?.vendor_name_kr,
                                    value: data?.vendor_name,
                                  }))}
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    className="textSearch"
                                    label={selectedLang.vendor_selection}
                                  />
                                )}
                              /> */}
                              <Autocomplete
                                onChange={handleSelectChangeGameVendorFG}
                                className=""
                                variant="outlined"
                                disablePortal
                                size="small"
                                id="combo-box-demo"
                                options={[
                                  ...[
                                    ...new Set(
                                      allGameVendor
                                        .filter(
                                          (data) =>
                                            data &&
                                            data.vendor_name &&
                                            data.vendor_name.trim() !== ""
                                        )
                                        .sort((a, b) => {
                                          const aVendor =
                                            a && a.vendor_name
                                              ? a.vendor_name.toLowerCase()
                                              : "";
                                          const bVendor =
                                            b && b.vendor_name
                                              ? b.vendor_name.toLowerCase()
                                              : "";
                                          return aVendor.localeCompare(bVendor);
                                        })
                                        .map((data) => data.vendor_name)
                                    ),
                                  ].map((vendor_name, key) => ({
                                    label: vendor_name,
                                    value: vendor_name,
                                  })),
                                ]}
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    className="textSearch"
                                    label={selectedLang.game_vendor}
                                  />
                                )}
                              />
                              <Autocomplete
                                value={
                                  selectedValueGameSpecName != ""
                                    ? showGameSpec
                                    : null
                                }
                                onChange={handleSelectChangeGameSpec}
                                className="datatextbox"
                                variant="outlined"
                                disablePortal
                                size="small"
                                id="combo-box-demo"
                                noOptionsText={selectedLang.no_option}
                                options={
                                  loading
                                    ? [{ label: "loading...", value: null }]
                                    : gameListWithId
                                        .filter(
                                          (data) =>
                                            data &&
                                            data.title &&
                                            // data?.title?.trim() !== "" &&
                                            data.vendor == selectedValueVendorFG
                                        )
                                        .sort((a, b) =>
                                          a.vendor?.localeCompare(
                                            b?.vendor.toLowerCase()
                                          )
                                        )
                                        .map((data) => ({
                                          label:
                                            data.vendor +
                                              " - " +
                                              data.title +
                                              " - " +
                                              data?.langs?.find(
                                                (langObject) =>
                                                  langObject.lang === "ko"
                                              )?.name || "",
                                          value: data.id,
                                        }))
                                }
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    className="textSearch"
                                    label={selectedLang.select_game}
                                  />
                                )}
                              />
                            </div>
                          </td>
                          <td>
                            <span className="text-buttons">
                              <TextField
                                size="small"
                                fullWidth
                                placeholder={`${selectedLang.maximum_amount} 0`}
                                value={
                                  maxAmtGameSpec === ""
                                    ? ""
                                    : formatAmount(maxAmtGameSpec)
                                }
                                onChange={(e) => {
                                  let inputValue = e.target.value;
                                  inputValue = inputValue.replace(
                                    /[^0-9.]/g,
                                    ""
                                  );
                                  const dotCount =
                                    inputValue.split(".").length - 1;
                                  if (dotCount > 1) {
                                    return;
                                  }
                                  const numericValue = parseFloat(inputValue);
                                  const maxLimit = 100000000;
                                  if (
                                    inputValue === "" ||
                                    (numericValue <= maxLimit &&
                                      numericValue >= 0)
                                  ) {
                                    setmaxAmtGameSpec(
                                      inputValue === "" ? "" : numericValue
                                    );
                                  }
                                }}
                              />
                              {/* <Button
																	variant='contained'
																	className='plusbtn'
																	onClick={() => {
																		handleGameLimitAdd();
																	}}>
																	<svg
																		width='20'
																		height='20'
																		viewBox='0 0 20 20'
																		fill='none'
																		xmlns='http://www.w3.org/2000/svg'>
																		<path
																			d='M9.95508 0.4375C8.0638 0.4375 6.21499 0.998331 4.64244 2.04907C3.0699 3.09981 1.84425 4.59327 1.12048 6.34059C0.396721 8.08791 0.207352 10.0106 0.576323 11.8656C0.945294 13.7205 1.85603 15.4244 3.19337 16.7617C4.53071 18.0991 6.23459 19.0098 8.08953 19.3788C9.94448 19.7477 11.8672 19.5584 13.6145 18.8346C15.3618 18.1108 16.8553 16.8852 17.906 15.3126C18.9568 13.7401 19.5176 11.8913 19.5176 10C19.5146 7.46478 18.5062 5.03425 16.7135 3.24158C14.9208 1.44891 12.4903 0.440477 9.95508 0.4375ZM9.95508 18.4375C8.2863 18.4375 6.655 17.9426 5.26746 17.0155C3.87992 16.0884 2.79846 14.7706 2.15985 13.2289C1.52123 11.6871 1.35414 9.99064 1.67971 8.35393C2.00527 6.71721 2.80886 5.21379 3.98887 4.03379C5.16887 2.85378 6.67229 2.05019 8.30901 1.72462C9.94572 1.39906 11.6422 1.56615 13.184 2.20477C14.7257 2.84338 16.0435 3.92484 16.9706 5.31238C17.8977 6.69992 18.3926 8.33122 18.3926 10C18.3901 12.237 17.5004 14.3817 15.9186 15.9635C14.3368 17.5453 12.1921 18.435 9.95508 18.4375ZM14.2676 10C14.2676 10.1492 14.2083 10.2923 14.1028 10.3977C13.9973 10.5032 13.8543 10.5625 13.7051 10.5625H10.5176V13.75C10.5176 13.8992 10.4583 14.0423 10.3528 14.1477C10.2473 14.2532 10.1043 14.3125 9.95508 14.3125C9.8059 14.3125 9.66282 14.2532 9.55734 14.1477C9.45185 14.0423 9.39258 13.8992 9.39258 13.75V10.5625H6.20508C6.0559 10.5625 5.91282 10.5032 5.80734 10.3977C5.70185 10.2923 5.64258 10.1492 5.64258 10C5.64258 9.85082 5.70185 9.70774 5.80734 9.60225C5.91282 9.49676 6.0559 9.4375 6.20508 9.4375H9.39258V6.25C9.39258 6.10082 9.45185 5.95774 9.55734 5.85225C9.66282 5.74676 9.8059 5.6875 9.95508 5.6875C10.1043 5.6875 10.2473 5.74676 10.3528 5.85225C10.4583 5.95774 10.5176 6.10082 10.5176 6.25V9.4375H13.7051C13.8543 9.4375 13.9973 9.49676 14.1028 9.60225C14.2083 9.70774 14.2676 9.85082 14.2676 10Z'
																			fill='black'
																		/>
																	</svg>
																</Button> */}
                            </span>
                          </td>
                        </tr>
                        {showGameSpecList &&
                          gameLimitArr?.map((data, key) => (
                            <tr key={key}>
                              <td> {selectedLang.game_specific_settings}</td>
                              <td>{data?.title}</td>
                              <td>
                                <span className="text-buttons">
                                  <TextField
                                    size="small"
                                    fullWidth
                                    type="search"
                                    placeholder={`${selectedLang.maximum_amount} 0`}
                                    value={formatAmount(data?.limit)}
                                    onChange={(e) => {
                                      const formattedValue =
                                        checkBetAmountLimt(e);
                                      if (!formattedValue) return;
                                      // setmaxAmtGameSpec(formattedValue);
                                      // const inputValue = e.target.value;
                                      // const numericValue = inputValue.replace(
                                      // 	/[^0-9.]/g,
                                      // 	''
                                      // ); // Remove non-numeric characters except dot (.)
                                      handleLimitChange(
                                        data?.unique_id,
                                        formattedValue
                                      );
                                    }}
                                  />
                                  <Button
                                    variant="contained"
                                    className="minusbtn"
                                    onClick={() => {
                                      handlGameLimitRemove(data?.unique_id);
                                    }}
                                  >
                                    <svg
                                      width="25"
                                      height="24"
                                      viewBox="0 0 25 24"
                                      fill="none"
                                      xmlns="http://www.w3.org/2000/svg"
                                    >
                                      <path
                                        d="M12.9551 2.4375C11.0638 2.4375 9.21499 2.99833 7.64244 4.04907C6.0699 5.09981 4.84425 6.59327 4.12048 8.34059C3.39672 10.0879 3.20735 12.0106 3.57632 13.8656C3.94529 15.7205 4.85603 17.4244 6.19337 18.7617C7.53071 20.099 9.23459 21.0098 11.0895 21.3788C12.9445 21.7477 14.8672 21.5584 16.6145 20.8346C18.3618 20.1108 19.8553 18.8852 20.906 17.3126C21.9568 15.7401 22.5176 13.8913 22.5176 12C22.5146 9.46478 21.5062 7.03425 19.7135 5.24158C17.9208 3.44891 15.4903 2.44048 12.9551 2.4375ZM12.9551 20.4375C11.2863 20.4375 9.655 19.9426 8.26746 19.0155C6.87992 18.0884 5.79846 16.7706 5.15985 15.2289C4.52123 13.6871 4.35414 11.9906 4.67971 10.3539C5.00527 8.71721 5.80886 7.21379 6.98887 6.03379C8.16887 4.85378 9.67229 4.05019 11.309 3.72462C12.9457 3.39906 14.6422 3.56615 16.184 4.20477C17.7257 4.84338 19.0435 5.92484 19.9706 7.31238C20.8977 8.69992 21.3926 10.3312 21.3926 12C21.3901 14.237 20.5004 16.3817 18.9186 17.9635C17.3368 19.5453 15.1921 20.435 12.9551 20.4375Z"
                                        fill="black"
                                      />
                                      <path
                                        d="M17.1028 12.3977C17.2083 12.2923 17.2676 12.1492 17.2676 12C17.2676 11.8508 17.2083 11.7077 17.1028 11.6023C16.9973 11.4968 16.8543 11.4375 16.7051 11.4375H13.5176H12.3926H9.20508C9.05589 11.4375 8.91282 11.4968 8.80733 11.6023C8.70184 11.7077 8.64258 11.8508 8.64258 12C8.64258 12.1492 8.70184 12.2923 8.80733 12.3977C8.91282 12.5032 9.05589 12.5625 9.20508 12.5625H12.3926H13.5176H16.7051C16.8543 12.5625 16.9973 12.5032 17.1028 12.3977Z"
                                        fill="black"
                                      />
                                    </svg>
                                  </Button>
                                </span>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="savebrns">
                    <Button
                      variant="contained"
                      className="save_btn mb-0"
                      disabled={saving}
                      onClick={() => {
                        // updateMaxLimitSubmit();
                        saveAndUpdate();
                      }}
                    >
                      {selectedLang.save}
                    </Button>
                  </div>
                </div>
              </Box>

              <Box className="create_bet_modal">
                <>
                  <Typography
                    id="modal-modal-title"
                    variant="h6"
                    style={{ color: "#fff" }}
                    component="h2"
                  >
                    <b> {selectedLang.BettingLimits} </b>
                  </Typography>
                  <div className="modal_inner" style={{ marginTop: "10px" }}>
                    <div className="table-responsive">
                      <table className="table">
                        <thead>
                          <tr>
                            {columnsResult.map((column) => (
                              <th
                                key={column.id}
                                align={column.align}
                                style={{ minWidth: column.minWidth }}
                              >
                                {column.label}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        {addTableData()}
                      </table>
                    </div>
                  </div>
                  <>
                    {/* <Table stickyHeader aria-label='customized table'>
												<TableHead>
													<TableRow>
														{columnsResult.map((column) => (
															<StyledTableCell
																sx={{
																	textAlign: 'center',
																}}
																key={column.id}
																align={column.align}
																style={{ minWidth: column.minWidth }}>
																{column.label}
															</StyledTableCell>
														))}
													</TableRow>
												</TableHead>
												{addTableData()}
											</Table> */}
                    {/* {tableDataLoader && <FuseLoading />}-9
												{!agentList.length > 0 && !tableDataLoader && (
												<div
													style={{
													textAlign: "center",
													padding: "0.95rem",
													}}>
													{selectedLang.no_data_available_in_table}
												</div>
												)} */}
                  </>
                </>
              </Box>

              {/* <div className="row flex justify-end justify-items-center flex-wrap"> */}
              {/* <div className="col-lg-8 col-md-4 col-sm-4 flex item-center">
                <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
                  <InputLabel id="demo-select-small">{selectedLang.provider}</InputLabel>
                  <Select
                    labelId="demo-select-small"
                    id="demo-select-small"
                    value={provider_id}
                    label="Providers"
                    onChange={handleChangeProvider}
                  >
                    {providerList.map(provider => {
                      return <MenuItem value={provider.provider_id}>{selectedLang.provider} {provider.provider_id}</MenuItem>
                    })}
                  </Select>
                </FormControl>
              </div> */}

              {/* <div className="col-lg-2 col-md-4 col-sm-4 p-10 pl-0 flex item-center">
                {role["role"] != "admin" && (
                  <Button
                    key={"button-1"}
                    className="flex item-center"
                    variant="contained"
                    color="secondary"
                    startIcon={<AddCircleIcon size={20}></AddCircleIcon>}
                    sx={{
                      borderRadius: "4px",
                    }}
                    onClick={handleOpen}>
                    {selectedLang.create_bet_limit}
                  </Button>
                )}
                <Modal
                  open={open}
                  onClose={handleClose}
                  aria-labelledby="modal-modal-title"
                  aria-describedby="modal-modal-description">
                  <Box sx={style} className="create_bet_modal">
                    <Typography
                      id="modal-modal-title"
                      variant="h6"
                      component="h2">
                      <b> {selectedLang.create_bet_limit} </b>
                    </Typography>
                    <div className="modal_inner" style={{ marginTop: "10px" }}>
                      <div className="table-responsive">
                        <table className="table">
                          <thead>
                            <tr>
                              <th>Classification of settings</th>
                              <th>Set target</th>
                              <th>Maximum bet amount (Unit:pot)</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td>Global Settings</td>
                              <td>for all games</td>
                              <td>
                                <span>
                                  <TextField
                                    size="small"
                                    fullWidth
                                    // className="flex-auto grow"
                                    label={"Global settings"}
                                    value={globleLimit}
                                    // onChange={(target)=>{setGlobalLimit()}}
                                    // onChange={(target)=>{setGlobalLimit(target)}}
                                    // onChange={({target})=>{setGlobalLimit(target.value)}}
                                    onChange={(e) => {
                                      const inputValue = e.target.value;
                                      const numericValue = inputValue.replace(/[^0-9.]/g, ""); // Remove non-numeric characters except dot (.)
                                      setGlobalLimit(numericValue);
                                    }}
                                  // value={"Global settings"}
                                  />
                                  <br />
                                  <span>Individunt settings take precedence over global settings.</span>
                                </span>
                              </td>
                            </tr>
                            <tr>
                              <td>Game-specific settings</td>
                              <td>
                                <Select
                                  className="w-full h-40 my-8"
                                  value={selectedValueGameSpec}
                                  label="Age"
                                  variant="outlined"
                                  onChange={(e) => { handleSelectChangeGameSpec(e) }}
                                >
                                  {
                                    [...new Set(allProviders
                                      .filter(data => data && data.title && data.title.trim() !== '')
                                      .map(data => data.title)
                                    )].map((title, key) => (
                                      <MenuItem key={key} value={title}>{title}</MenuItem>
                                    ))
                                  }
                                </Select>
                              </td>
                              <td>
                                <span className="text-buttons">
                                  <TextField
                                    size="small"
                                    label={"Maximum Amount 0"}
                                    value={maxAmtGameSpec}
                                    // onChange={({target})=>{setmaxAmtGameSpec(target.value)}}
                                    onChange={(e) => {
                                      const inputValue = e.target.value;
                                      const numericValue = inputValue.replace(/[^0-9.]/g, ""); // Remove non-numeric characters except dot (.)
                                      setmaxAmtGameSpec(numericValue);
                                    }}
                                  />
                                  <Button variant="contained" onClick={() => { setmaxAmtGameSpec(Number(maxAmtGameSpec || 0) + 1) }}>+</Button>
                                </span>
                              </td>
                            </tr>
                            <tr>
                              <td>Sottings by type</td>
                              <td>
                                <Select
                                  className="w-full h-40 my-8"
                                  value={selectedValueType}
                                  label="Age"
                                  variant="outlined"
                                  onChange={handleSelectChangeGameType}
                                >
                                  {
                                    [...new Set(allProviders
                                      .filter(data => data && data.type && data.type.trim() !== '')
                                      .map(data => data.type)
                                    )].map((type, key) => (
                                      <MenuItem key={key} value={type}>{type}</MenuItem>
                                    ))
                                  }
                                </Select>
                              </td>
                              <td>
                                <span className="text-buttons">
                                  <TextField
                                    size="small"
                                    label={"Maximum Amount 0"}
                                    value={maxAmtGameType}
                                    // onChange={({target})=>{setmaxAmtGameType(target.value)}}
                                    onChange={(e) => {
                                      const inputValue = e.target.value;
                                      const numericValue = inputValue.replace(/[^0-9.]/g, ""); // Remove non-numeric characters except dot (.)
                                      setmaxAmtGameType(numericValue);
                                    }}
                                  />
                                  <Button variant="contained" onClick={() => { setmaxAmtGameType(Number(maxAmtGameType || 0) + 1) }}>+</Button>
                                </span>
                              </td>
                            </tr>
                            <tr>
                              <td>Vendor-specific settings</td>
                              <td>
                                <Select
                                  className="w-full h-40 my-8"
                                  value={selectedValueVendor}
                                  label="Age"
                                  variant="outlined"
                                  onChange={handleSelectChangeGameVendor}
                                >
                                  {
                                    [...new Set(allProviders
                                      .filter(data => data && data.vendor && data.vendor.trim() !== '')
                                      .map(data => data.vendor)
                                    )].map((vendor, key) => (
                                      <MenuItem key={key} value={vendor}>{vendor}</MenuItem>
                                    ))
                                  }
                                </Select>
                              </td>
                              <td>
                                <span className="text-buttons">
                                  <TextField
                                    size="small"
                                    label={"Maximum Amount 0"}
                                    // onChange={({target})=>{setmaxAmtGameVendor(target.value)}}
                                    onChange={(e) => {
                                      const inputValue = e.target.value;
                                      const numericValue = inputValue.replace(/[^0-9.]/g, ""); // Remove non-numeric characters except dot (.)
                                      setmaxAmtGameVendor(numericValue);
                                    }}
                                    value={maxAmtGameVendor}
                                  />
                                  <Button variant="contained" onClick={() => { setmaxAmtGameVendor(Number(maxAmtGameVendor || 0) + 1) }}>+</Button>
                                </span>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                      <div className="text-center">
                        <Button variant="contained" className="save_btn" onClick={() => { updateMaxLimitSubmit() }}>Save Settings</Button>
                      </div>
                    </div>
                  </Box>
                </Modal>

              </div> */}
              {/* </div> */}
              {/* <div>
              <CardContent>
                <Paper
                  sx={{
                    width: "100%",
                    overflow: "hidden",
                    borderRadius: "4px",
                  }}>
                  <TableContainer>
                    <Table stickyHeader aria-label="customized table">
                      <TableHead key={"table-head"}>
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
                      <TableBody key={"table-body"}>
                        {(betlimit && betlimit?.length > 0) && betlimit
                          .slice(
                            page * rowsPerPage,
                            page * rowsPerPage + rowsPerPage
                          )
                          .map((row, k) => {
                            return (
                              <TableRow key={row?._id}>
                                <TableCell>
                                  {row?.game == 'global' ? 'Global' : row?.title || row?.game_type || row?.vendor}
                                </TableCell>
                                <TableCell align="center">{row?.game == 'global' ? 'Global' : row?.title ? 'Game Specific' : row?.game_type ? 'Game Type' : 'Game Vendor'}</TableCell>
                                <TableCell align="center">{row?.limit}</TableCell>
                                <TableCell align="right">
                                  <Button
                                    className="flex"
                                    variant="contained"
                                    color="error"
                                    size="small"
                                    sx={{
                                      borderRadius: "4px",
                                    }}
                                    onClick={() => handleDeleteBet(row?._id, row?.game_id ? 'Game_specific' : row?.game_type ? 'game_type' : row?.game == 'global' ? 'Global' : 'vendor')}
                                  >
                                    Delete
                                  </Button>
                                </TableCell>
                              </TableRow>
                            );
                          })}
                      </TableBody>
                    </Table>
                  </TableContainer>
                  <TablePagination
                    rowsPerPageOptions={[10, 25, 100]}
                    component="div"
                    count={betlimit?.length || 0}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                  />
                </Paper>
              </CardContent>
            </div> */}
            </div>
          }
        />
      )}
    </>
  );
}

export default providermanagement;
