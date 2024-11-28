/** @format */

import React from "react";
import FusePageSimple from "@fuse/core/FusePageSimple";
import ProviderManagementHeader from "./winManagementHeader";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { locale } from "../../../configs/navigation-i18n";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import {
  Button,
  CardActionArea,
  CardActions,
  Autocomplete,
} from "@mui/material";
import "./provider.css";
import Chip from "@mui/material/Chip";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import { gameTypes } from "src/app/services/gameTypes";
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
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Unstable_Grid2";
import TextField from "@mui/material/TextField";
import DoneIcon from "@mui/icons-material/Done";
import APIService from "src/app/services/APIService";
import { showMessage } from "app/store/fuse/messageSlice";
import jwtDecode from "jwt-decode";
import DataHandler from "src/app/handlers/DataHandler";
import { stubFalse } from "lodash";
import FuseLoading from "@fuse/core/FuseLoading/FuseLoading";
import queryString from "query-string";
import WintingInput from "./WinningInput";
// import { Document, Page } from "react-pdf";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

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
  { id: "min_limit_amount", label: "Min Win", minWidth: 50 },
  { id: "limit_amount", label: "Max Win", minWidth: 100 },
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
function winmanagement() {
  const [selectLocale] = useSelector((state) => [state.locale.selectLocale]);
  const [selectedLang, setSelectedLang] = useState(locale.en);
  const [loaded, setLoaded] = useState(true);
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

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  const dispatch = useDispatch();
  const [age, setAge] = React.useState("");
  const [game, setGame] = React.useState("");
  const [enable, setEnable] = React.useState(false);
  const [provider_id] = useSelector((state) => [
    state.provider.selectedprovider,
  ]);
  const [gameList, setGameList] = useState();
  const [gameId, setGameId] = useState("");
  const [minWin, setMinWin] = useState("");
  const [maxWin, setMaxWin] = useState("");
  const [winlimit, setWinLimit] = useState([]);
  const [edit, setEdit] = useState(false);
  const [editValues, setEditValues] = useState("");
  const [allProviders, setAllProviders] = useState([]);
  const [allGameVendor, setAllGameVendor] = useState([]);
  const [winlimitId, setwinlimitId] = useState("");
  const role = jwtDecode(DataHandler.getFromSession("accessToken"))["data"];
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  const [vendorList, setVendorList] = useState([]);

  const getGameVendorList = () => {
    APIService({
      url: `${process.env.REACT_APP_R_SITE_API}/betlimit/vendor-list`,
      method: "GET",
    })
      .then((data) => {
        setVendorList(data.data.data);
      })
      .catch((err) => { })
      .finally(() => { });
  };

  useEffect(() => {
    getGameVendorList();
  }, []);

  const handleChangeGame = (event) => {
    setGame(event.target.value);
  };
  const handleChangeEnable = (event) => {
    if (event.target.value == "Yes") {
      setEnable(true);
    } else {
      setEnable(false);
    }
  };

  useEffect(() => {
    getProviderList();
    getGameVendorListData();
    getAllWinList();
    // getGameList();
    getGameVendorType();
  }, []);

  const optionsGameType = gameTypes.map((game_type) => ({
    label: game_type,
    value: game_type,
  }));

  useEffect(() => {
    getAllWinList();
    // getGameList();
  }, [provider_id]);

  const getProviderList = () => {
    APIService({
      url: `${process.env.REACT_APP_R_SITE_API}/game/get-provider-list`,
      method: "GET",
    })
      .then((res) => {
        setAllProviders(res.data.allProvGameList);
      })
      .catch((err) => { })
      .finally(() => { });
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

  const [gameListWithId, setGameListwithId] = useState([]);
  const [loading, setLoading] = useState(false);
  const getGameVendorType = () => {
    setLoading(true);
    APIService({
      url: `${process.env.REACT_APP_R_SITE_API}/game/get_game_vendor_type`,
      method: "GET",
    })
      .then((res) => {

        setGameListwithId(res?.data?.data);
      })
      .catch((err) => { })
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

  function checkWinAmountLimt(e) {
    let inputValue = e.target.value;
    inputValue = inputValue.replace(/[^0-9.]/g, "");
    const dotCount = inputValue.split(".").length - 1;
    if (dotCount > 1) {
      return null;
    }
    const numericValue = parseFloat(inputValue) || 0;
    const maxLimit = 100000000;
    if (!isNaN(numericValue) && numericValue <= maxLimit) {
      return numericValue.toFixed(2);
    }
  }
  const columns = [
    { id: "number", label: `Title`, minWidth: 50 },
    { id: "vendor_id", label: `${selectedLang.category}`, minWidth: 50 },
    { id: "limit_amount", label: `${selectedLang.max_bet}`, minWidth: 100 },
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
    { id: "maxAm", label: `${selectedLang.maximum_win_amount}`, minWidth: 50 },
    { id: "action", label: `${selectedLang.action}`, minWidth: 50 },
  ];

  const [orbData, _orbData] = useState();
  const [gameLimitArr, _gameLimitArr] = useState([]);
  const [typeLimitArr, _typeLimitArr] = useState([]);
  const [vendorLimitArr, _vendorLimitArr] = useState([]);
  const [globleLimit, setGlobalLimit] = useState(0);

  const { search } = window.location;
  const { agent_id } = queryString.parse(search);

  const [resultWins, setResultWins] = useState([]);

  const getAllWinList = () => {
    APIService({
      url: `${process.env.REACT_APP_R_SITE_API}/betlimit/get-win-lists/${!agent_id ? user_id : agent_id
        }`,
      method: "GET",
    }).then((data) => {
      if (
        data &&
        data.data &&
        data.data.ordata &&
        data.data.ordata.length > 0
      ) {
        setResultWins(data?.data?.data);
        _gameLimitArr(data.data.ordata[0].games_limit);
        _typeLimitArr(data?.data?.ordata[0]?.types_limit);
        _vendorLimitArr(data?.data?.ordata[0]?.vendors_limit);
        setWinLimit(data?.data?.data);
        setGlobalLimit(data?.data?.ordata[0]?.globle_limit);
        _orbData(data?.data?.ordata[0]);
      }
    });
  };

  // Game Spec
  const [selectedValueGameSpec, setSelectedValueGameSpec] = useState("");
  const [selectedValueGameSpecName, setSelectedValueGameSpecName] =
    useState("");

  const [maxAmtGameSpec, setmaxAmtGameSpec] = useState();

  const [showGameSpec, setShowgameSpec] = useState();
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

  const [open, setOpen] = React.useState(false);
  const handleOpenClick = () => setOpen(true);
  const handleCloseClick = () => {
    setOpen(false);
  };

  // Type
  const [selectedValueType, setSelectedValueType] = useState("");

  const [maxAmtGameType, setmaxAmtGameType] = useState();

  const [showValuetoDrop, _showvaluetoDrop] = useState();
  const handleSelectChangeGameType = (event, newValue) => {
    // const newValue = event.target.value;
    setSelectedValueType(newValue?.value || "");
    _showvaluetoDrop(newValue?.label);
  };

  const [selectedValueTypeVendor, setSelectedValueTypeVendor] = useState("");
  const handleSelectChangeGameTypeVendor = (event, newValue) => {
    // const newValue = event.target.value;
    setSelectedValueTypeVendor(newValue?.value || "");
  };

  // Vendor
  const [selectedValueVendor, setSelectedValueVendor] = useState("");

  const [maxAmtGameVendor, setmaxAmtGameVendor] = useState();

  const handleSelectChangeGameVendor = (event, newValue) => {
    // const newValue = event.target.value;
    setSelectedValueVendor(newValue?.value || "");
  };

  // Venor for game
  const [selectedValueVendorFG, setSelectedValueVendorFG] = useState("");
  const handleSelectChangeGameVendorFG = (event, newValue) => {
    // const newValue = event.target.value;
    setSelectedValueVendorFG(newValue?.value || "");
  };

  // Global

  const user_id = DataHandler.getFromSession("user_id");


  // Specific Game

  const [showGameSpecList, setShowGemeSpecList] = useState(false);
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

  const [showTypList, setShowTypeList] = useState(false);
  // Type
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

  // Vendor
  const [showVendorList, setShowVendorList] = useState(false);
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

  const [saving, _saving] = useState(false);
  const saveAndUpdate = () => {
    // if (globleLimit == 0) {
    // 	return dispatch(
    // 		showMessage({
    // 			variant: 'error',
    // 			message: `${selectedLang.please_enter_valid_data}`,
    // 		})
    // 	);
    // }
    let flag = false;
    resultWins.forEach((data) => {
      if (data.ga_vendor === selectedValueVendor && data.game_type === selectedValueTypeVendor) {
        flag = true
      }
    })

    if (flag === false) {

      let error_f_alre_exist = false;

      let _gameTypeStore = undefined;

      let _vendorStore = undefined;

      let _gamesLimitStore = undefined;

      let _gametypebyVendor = undefined;

      const existingLimit = typeLimitArr.find(
        (item) => item?.game_type === selectedValueType
      );

      if (
        selectedValueType != "" &&
        (maxAmtGameType == undefined ||
          maxAmtGameType == "" ||
          maxAmtGameType == 0)
      ) {
        error_f_alre_exist = true;
        return dispatch(
          showMessage({
            variant: "error",
            message: `${selectedLang.please_enter_valid_data} for game type!`,
          })
        );
      } else {
        if (existingLimit) {
          error_f_alre_exist = true;
          return dispatch(
            showMessage({
              variant: "error",
              message: `Selected game type ${selectedLang.already_registered_on_list}`,
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
        (item) => item?.game_type === selectedValueTypeVendor
      );
      // Type by vendor
      if (
        selectedValueTypeVendor != "" &&
        (maxAmtGameVendor == undefined ||
          maxAmtGameVendor == "" ||
          maxAmtGameVendor == 0)
      ) {
        error_f_alre_exist = true;
        return dispatch(
          showMessage({
            variant: "error",
            message: `${selectedLang.please_enter_valid_data} ${selectedLang.vender}!`,
          })
        );
      } else {
        if (existingLimitByVendor && existingLimitByVendor.vendor === selectedValueVendor) {
          error_f_alre_exist = true;
          return dispatch(
            showMessage({
              variant: "error",
              message: `${selectedLang.Selected_game_type} ${selectedLang.already_registered_on_list}`,
            })
          );
        } else {
          if (selectedValueTypeVendor != "" &&
            maxAmtGameVendor != undefined &&
            maxAmtGameVendor != "") {
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
            message: `${selectedLang.please_enter_valid_data} for vendor!`,
          })
        );
      } else {
        if (existingVendor) {
          error_f_alre_exist = true;
          dispatch(
            showMessage({
              variant: "error",
              message: `Selected vendor ${selectedLang.already_registered_on_list}`,
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
        (maxAmtGameSpec == "" ||
          maxAmtGameSpec == undefined ||
          maxAmtGameSpec == 0)
      ) {
        error_f_alre_exist = true;
        dispatch(
          showMessage({
            variant: "error",
            message: `${selectedLang.please_enter_valid_data} for game!`,
          })
        );
      } else {
        if (existingLimitSpecGame) {
          error_f_alre_exist = true;
          dispatch(
            showMessage({
              variant: "error",
              message: `Selected game ${selectedLang.already_registered_on_list}`,
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
          url: `${process.env.REACT_APP_R_SITE_API}/betlimit/add-win-max`,
          method: "POST",
          data: payload,
        })
          .then((data) => {
            setmaxAmtGameType("");
            setSelectedValueType("");
            setmaxAmtGameVendor("");
            setSelectedValueVendor("");
            setSelectedValueTypeVendor("");
            setSelectedValueGameSpec("");
            setmaxAmtGameSpec("");
            setSelectedValueGameSpecName("");
            setGlobalLimit();
            setShowgameSpec("");
            _showvaluetoDrop("");
            setGlobalLimit("");
            dispatch(
              showMessage({
                variant: "success",
                message: `${selectedLang.win_limit_updated}`,
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
            _saving(false);
            getAllWinList();
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

  const [winList, _winList] = useState([]);

  useEffect(() => {
    getAllWinList();
  }, []);

  const formatAmount = (amount) => {
    const numericAmount = Number(amount);
    if (!isNaN(numericAmount)) {
      return numericAmount.toLocaleString();
    } else {
      return amount;
    }
  };

  const initialDefaultValues = {};

  resultWins.forEach((data) => {
    initialDefaultValues[data?.unique_id] = Number(
      data?.limit
    )?.toLocaleString();
  });

  const [inputValues, setInputValues] = useState({});

  const handleInputChange = (unique_id, value) => {
    setInputValues((prevInputValues) => ({
      ...prevInputValues,
      [unique_id]: value,
    }));
  };

  const actionWinting = ({ unique_id, type, action }) => {
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
      user_id,
      limit:
        parseInt(String(inputValues[unique_id]).replace(/,/g, "")) ||
        parseInt(String(initialDefaultValues[unique_id]).replace(/,/g, "")),
    };

    APIService({
      url: `${process.env.REACT_APP_R_SITE_API}/betlimit/action-win`,
      method: "PUT",
      data: payload,
    })
      .then((data) => {
        dispatch(
          showMessage({
            variant: "success",
            message: `${action == 1
              ? selectedLang.win_limit_updated
              : selectedLang.win_limit_deleted
              }`,
          })
        );
      })
      .catch((err) => { })
      .finally(() => {
        getAllWinList();
      });
  };

  const addTableData = () => {
    if (resultWins) {
      return (
        <TableBody>
          {resultWins.map((data, index) => {
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
                    ? allProviders.filter((pro) => pro.type == data?.ga_type)[0]
                      ?.type_kr || data?.ga_type
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
                  {/* {data?.game_id && data?.ga_vendor} */}
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
                    {data?.game_id && selectLocale == "ko"
                      ? gameListWithId
                        .filter((pro) => pro.title == data?.title)[0]
                        ?.langs.find((langObject) => langObject.lang === "ko")
                        ?.name || data?.title
                      : data?.title}
                  </span>
                </TableCell>

                <TableCell
                  sx={{
                    textAlign: "center",
                  }}
                >
                  <div
                    className="col-lg-2 col-md-4 col-sm-4"
                    style={{ minWidth: "130px" }}
                  >
                    <WintingInput
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
                  <div className="row flex justify-center">
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
                          actionWinting({
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
                        {selectedLang.save}
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
                          actionWinting({
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
              <Box className="common_card">
                <div>
                  <Typography
                    className="mb-4 titlke"
                    id="modal-modal-title"
                    variant="h5"
                    component="h2"
                  >
                    <b>{selectedLang.how_to_set_maximum_win_amount_limit} </b>
                  </Typography>
                  <Typography
                    id="modal-modal-title"
                    className="title_modal"
                  >
                    <b>
                      {selectedLang.the_maximum_win_limit_is_applied_following_order}
                    </b>
                  </Typography>
                </div>
                <code className="code_block">
                  {" "}
                  {selectedLang.global_settings} &gt;{selectedLang.by_type}{" "}
                  &gt; {selectedLang.by_vendor} &gt;{selectedLang.by_game}{" "}
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
                    {/* Close icon on the top right */}
                    <button className="modalclosebtn" onClick={handleCloseClick}>
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
                        // marginBottom: "30px",
                      }}
                    >
                      <img
                        src="/assets/images/tut/winning _management.jpg"
                        alt="First Image"
                        style={{
                          width: "81%",
                          height: "auto",
                          marginLeft: "260px",
                        }}
                      />
                    </div>
                  </Box>
                </Modal>
              </Box>

              <Box
                className="create_bet_modal"
                style={{ position: "relative" }}
              >
                <Typography
                  id="modal-modal-title"
                  style={{ color: '#fff' }}
                  variant="h6"
                  component="h2"
                >
                  <b> {selectedLang.Maximumwinlimit} </b>
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
                          <th className="text-left">{selectedLang.classification_of_settings}</th>
                          <th className="widthth">
                            {selectedLang.set_target}
                          </th>
                          <th>{selectedLang.maximum_win_amount}</th>
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
                              <div style={{ marginTop: '5px' }}>
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
                              value={selectedValueType !== "" ? showValuetoDrop : null} 
                              // options={[
                              // 	...[
                              // 		...new Set(
                              // 			allProviders
                              // 				.filter(
                              // 					(data) =>
                              // 						data &&
                              // 						data.type &&
                              // 						data.type.trim() !== ''
                              // 				)
                              // 				.sort((a, b) =>
                              // 					a?.type.localeCompare(
                              // 						b?.type.toLowerCase()
                              // 					)
                              // 				)
                              // 				.map((data) => data.type)
                              // 		),
                              // 	].map((type, key) => ({
                              // 		label: type,
                              // 		value: type,
                              // 	})),
                              // ]}
                              options={[
                                ...new Set(
                                  allProviders
                                    .filter(
                                      (data) =>
                                        data &&
                                        data?.type &&
                                        data?.type.trim() !== ""
                                    )
                                    .sort((a, b) =>
                                      a?.type.localeCompare(
                                        b?.type.toLowerCase()
                                      )
                                    )
                                    .map(
                                      (data) =>
                                        `${data?.type} - ${data?.type_kr}`
                                    )
                                ),
                              ].map((label) => ({
                                label,
                                value: label.split(" - ")[0], // Extracting only data.type for the value
                              }))}
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
                                // onChange={(e) => {
                                //   const formattedValue =
                                //     checkWinAmountLimt(e);
                                //   if (!formattedValue) return;
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
                                    onChange={(e) => {
                                      const formattedValue =
                                        checkWinAmountLimt(e);
                                      if (!formattedValue) return;
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
                                flexDirection: "row",
                                gap: "10px",
                              }}
                            >
                              {/* <Autocomplete
                                value={selectedValueVendor || null}
                                onChange={handleSelectChangeGameVendor}
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
                                className="datatextbox"
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
                                onChange={handleSelectChangeGameTypeVendor}
                                // className="w-full h-40 my-8"
                                className="datatextbox"
                                variant="outlined"
                                disablePortal
                                size="small"
                                id="combo-box-demo"
                                value={
                                  selectedValueTypeVendor == "all"
                                    ? selectedLang.all
                                    : selectedValueTypeVendor
                                }
                                noOptionsText={allProviders.length === 0 ? "loading..." : selectedLang.no_option}
                                options={[
                                  ...(selectedValueVendor != "" && allProviders.length !== 0
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
                                            data.vendor == selectedValueVendor
                                        )
                                        .sort((a, b) =>
                                          a?.type.localeCompare(
                                            b?.type.toLowerCase()
                                          )
                                        )
                                        .map(
                                          (data) =>
                                            `${data?.type} - ${data?.type_kr}`
                                        )
                                    ),
                                  ].map((type, key) => ({
                                    label: type,
                                    value: type.split(" - ")[0],
                                  })),
                                ]}
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
                                // size="small"
                                // type="search"
                                // fullWidth
                                // placeholder={`${selectedLang.maximum_amount} 0`}
                                // onChange={(e) => {
                                //   const formattedValue =
                                //     checkWinAmountLimt(e);
                                //   if (!formattedValue) return;
                                //   setmaxAmtGameVendor(formattedValue);
                                // }}
                                // value={formatAmount(maxAmtGameVendor)}
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
                            </span>
                          </td>
                        </tr>
                        {showVendorList &&
                          vendorLimitArr?.map((data, key) => (
                            <tr key={key}>
                              <td>
                                {selectedLang.vendor_specific_settings}{" "}
                              </td>
                              <td>{data?.vendor}</td>
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
                                        checkWinAmountLimt(e);
                                      if (!formattedValue) return;
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
                                flexDirection: "row",
                                gap: "10px",
                                flexWrap: "wrap"
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
                                className="datatextbox"
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
                                          data.title !== "" &&
                                          data.vendor ==
                                          selectedValueVendorFG
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
                                // size="small"
                                // fullWidth
                                // type="search"
                                // placeholder={`${selectedLang.maximum_amount} 0`}
                                // value={formatAmount(maxAmtGameSpec)}
                                // onChange={(e) => {
                                //   const formattedValue =
                                //     checkWinAmountLimt(e);
                                //   if (!formattedValue) return;
                                //   setmaxAmtGameSpec(formattedValue);
                                // }}
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
                                        checkWinAmountLimt(e);
                                      if (!formattedValue) return;
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
                        saveAndUpdate();
                      }}
                    >
                      {selectedLang.save}
                    </Button>
                  </div>
                </div>
              </Box>

              <Box className="create_bet_modal">
                <Typography
                  id="modal-modal-title"
                  style={{ color: '#fff' }}
                  variant="h6"
                  component="h2"
                >
                  <b> {selectedLang.MaxWining} </b>
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
              </Box>
              {/* <CardContent>
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
											</Table>
										</TableContainer>
									</Paper>
								</CardContent> */}
            </div>
          }
        />
      )}
    </>
  );
}

export default winmanagement;
