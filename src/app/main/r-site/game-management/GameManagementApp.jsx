/** @format */

import React from "react";
import FusePageSimple from "@fuse/core/FusePageSimple";
import ProviderManagementHeader from "./GameManagementHeader";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { locale } from "../../../configs/navigation-i18n";
import Modal from "@mui/material/Modal";
import PropTypes from 'prop-types';
import { gameTypes } from "src/app/services/gameTypes";
import Autocomplete, { autocompleteClasses } from '@mui/material/Autocomplete';
import useMediaQuery from '@mui/material/useMediaQuery';
import ListSubheader from '@mui/material/ListSubheader';
import Popper from '@mui/material/Popper';
import { useTheme } from '@mui/material/styles';
import { VariableSizeList } from 'react-window';
import { Button } from "@mui/material";
import "./provider.css";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import APIService from "src/app/services/APIService";
import { showMessage } from "app/store/fuse/messageSlice";
import jwtDecode from "jwt-decode";
import DataHandler from "src/app/handlers/DataHandler";
import FuseLoading from "@fuse/core/FuseLoading/FuseLoading";
import queryString from "query-string";
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
  const [selectedValueVendorFG, setSelectedValueVendorFG] = useState("");
  const [selectLocale] = useSelector((state) => [state.locale.selectLocale]);
  const [selectedLang, setSelectedLang] = useState(locale.en);
  const [loaded, setLoaded] = useState(true);
  const [selectedValueTypeVendor, setSelectedValueTypeVendor] = useState("");
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

 

  const dispatch = useDispatch();

  const [provider_id] = useSelector((state) => [
    state.provider.selectedprovider,
  ]);
  
  const [betlimit, setBetLimit] = useState([]);
  const [allProviders, setAllProviders] = useState([]);
  const [allGameVendor, setAllGameVendor] = useState([]);


  const role = jwtDecode(DataHandler.getFromSession("accessToken"))["data"];
  const [numPages, setNumPages] = useState(null);

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

  useEffect(() => {
    getProviderList();
    getGameVendorListData();
    // getBetLimit();
    // getGameList();
    getGameVendorType();
  }, []);

  const optionsGameType = gameTypes.map((game_type) => ({
    label: game_type,
    value: game_type,
  }));

  useEffect(() => {
    // getBetLimit();
    // getGameList();
  }, [provider_id]);

  const [open, setOpen] = React.useState(false);
  const handleOpenClick = () => setOpen(true);
  const handleCloseClick = () => {
    setOpen(false);
  };

  const getBetLimit = () => {
    APIService({
      url: `${process.env.REACT_APP_R_SITE_API}/betlimit/get-bet-limit?provider_id=${provider_id}`,
      method: "GET",
    })
      .then((res) => {
        // setBetLimit(res.data.data);
      })
      .catch((err) => { })
      .finally(() => { });
  };


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


  const newgameListWithId = [];

  gameListWithId.forEach((data) => {
    newgameListWithId.push(data.vendor +
      " - " +
      data.title +
      " - " + (data &&
        data.langs &&
        Array.isArray(data.langs)
        ? data.langs.find(
          (langObject) =>
            langObject.lang === "ko"
        )?.name || ""
        : ""))
  })

  const gameListWithIdFiltered = []

  newgameListWithId.forEach((data) => {
    if (!gameListWithIdFiltered.includes(data)) {
      gameListWithIdFiltered.push(data)
    }
  })


  const LISTBOX_PADDING = 8; // px

  function renderRow(props) {
    const { data, index, style } = props;
    const dataSet = data[index];
    const inlineStyle = {
      ...style,
      top: style.top + LISTBOX_PADDING,
    };

    if (dataSet.hasOwnProperty('group')) {
      return (
        <ListSubheader key={dataSet.key} component="div" style={inlineStyle}>
          {dataSet.group}
        </ListSubheader>
      );
    }

    return (
      <Typography component="li" {...dataSet[0]} noWrap style={inlineStyle}>
        {`#${dataSet[2] + 1} - ${dataSet[1]}`}
      </Typography>
    );
  }

  const OuterElementContext = React.createContext({});

  const OuterElementType = React.forwardRef((props, ref) => {
    const outerProps = React.useContext(OuterElementContext);
    return <div ref={ref} {...props} {...outerProps} />;
  });

  function useResetCache(data) {
    const ref = React.useRef(null);
    React.useEffect(() => {
      if (ref.current != null) {
        ref.current.resetAfterIndex(0, true);
      }
    }, [data]);
    return ref;
  }

  const saveAndUpdate = () => {


    let flag = false;

    resultBets.forEach((data) => {
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
        selectedValueType != ""
      ) {
        _gameTypeStore = {
          unique_id: `${Date.now().toString(36)}4`,
          game_type: selectedValueType,
        };
      }



      const existingLimitByVendor = typeLimitArr.find(
        (item) => item.game_type === selectedValueTypeVendor
      );

      // Type by vendor

      if (
        selectedValueTypeVendor != ""
      ) {
        _gametypebyVendor = {
          unique_id: `${Date.now().toString(36)}5`,
          game_type: selectedValueTypeVendor,
          vendor: selectedValueVendor,
        };
      }

      // Vendor
      const existingVendor = vendorLimitArr.find(
        (item) => item.vendor === selectedValueVendor
      );


      if (
        selectedValueVendor != "" &&
        maxAmtGameVendor != undefined &&
        maxAmtGameVendor != ""
      ) {
        _vendorStore = {
          unique_id: `${Date.now().toString(36)}6`,
          vendor: selectedValueVendor,
        };
      }
      // End Vendor

      // Spec game
   

      if (
        selectedValueGameSpec != ""
      ) {
        _gamesLimitStore = {
          unique_id: `${Date.now().toString(36)}7`,
          game_id: gameListWithId.find(
            (item) => item.id == selectedValueGameSpec.value
          )?.id,
          title: gameListWithId.find(
            (item) => item.id == selectedValueGameSpec.value
          )?.title,
        };
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
          url: `${process.env.REACT_APP_R_SITE_API}/betlimit/game-disabled`,
          method: "POST",
          data: payload,
        })
          .then((data) => {
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
                message: `${selectedLang.game_disabled}`,
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
            getDisabledGames();
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

  const ListboxComponent = React.forwardRef(function ListboxComponent(props, ref) {
    const { children, ...other } = props;
    const itemData = [];
    children.forEach((item) => {
      itemData.push(item);
      itemData.push(...(item.children || []));
    });

    const theme = useTheme();
    const smUp = useMediaQuery(theme.breakpoints.up('sm'), {
      noSsr: true,
    });
    const itemCount = itemData.length;
    const itemSize = smUp ? 36 : 48;

    const getChildSize = (child) => {
      if (child.hasOwnProperty('group')) {
        return 48;
      }

      return itemSize;
    };

    const getHeight = () => {
      if (itemCount > 8) {
        return 8 * itemSize;
      }
      return itemData.map(getChildSize).reduce((a, b) => a + b, 0);
    };

    const gridRef = useResetCache(itemCount);

    return (
      <div ref={ref}>
        <OuterElementContext.Provider value={other}>
          <VariableSizeList
            itemData={itemData}
            height={getHeight() + 2 * LISTBOX_PADDING}
            width="100%"
            ref={gridRef}
            outerElementType={OuterElementType}
            innerElementType="ul"
            itemSize={(index) => getChildSize(itemData[index])}
            overscanCount={5}
            itemCount={itemCount}
          >
            {renderRow}
          </VariableSizeList>
        </OuterElementContext.Provider>
      </div>
    );
  });

  ListboxComponent.propTypes = {
    children: PropTypes.node,
  };

  function random(length) {
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';

    for (let i = 0; i < length; i += 1) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }

    return result;
  }

  const StyledPopper = styled(Popper)({
    [`& .${autocompleteClasses.listbox}`]: {
      boxSizing: 'border-box',
      '& ul': {
        padding: 0,
        margin: 0,
      },
    },
  });


  let freshArr = gameListWithIdFiltered.map((item, index) => ({ provider_id: index, provider_name: item }))

  const OPTIONS = freshArr.map(({ provider_name }) => provider_name)
    .sort((a, b) => a.toUpperCase().localeCompare(b.toUpperCase()));

  // const OPTIONS = freshArr.map(({ provider_name }) => provider_name).sort((a, b) => a.toUpperCase().localeCompare(b.toUpperCase()));

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

  const columnsResult = [
    // { id: 'GS', label: `${selectedLang.global_settings}`, minWidth: 50 },
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
    // { id: 'maxAm', label: `${selectedLang.action}`, minWidth: 50 },
    { id: "action", label: `${selectedLang.action}`, minWidth: 50 },
  ];

  const [orbData, _orbData] = useState();
  const [gameLimitArr, _gameLimitArr] = useState([]);
  const [typeLimitArr, _typeLimitArr] = useState([]);
  const [vendorLimitArr, _vendorLimitArr] = useState([]);
  const [globleLimit, setGlobalLimit] = useState();

  const { search } = window.location;
  const { agent_id } = queryString.parse(search);

  const [resultBets, setResultBets] = useState([]);

  // Game Spec
  const [selectedValueGameSpec, setSelectedValueGameSpec] = useState("");
  const [selectedValueGameSpecName, setSelectedValueGameSpecName] =
    useState("");

  const [maxAmtGameSpec, setmaxAmtGameSpec] = useState();

  const [showGameSpec, setShowgameSpec] = useState();
  const handleSelectChangeGameSpec = (event, newValue) => {
    setSelectedValueGameSpec(newValue || "");
    setSelectedValueGameSpecName(newValue || "")
    setShowgameSpec(newValue);
    // const selectedGame = gameListWithIdFiltered.find(
    //   (item) => item.value === newValue?.value
    // );
    // if (selectedGame) {
    //   setSelectedValueGameSpecName(selectedGame.value);
    // }
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

  // Vendor
  const [selectedValueVendor, setSelectedValueVendor] = useState("");

  const [maxAmtGameVendor, setmaxAmtGameVendor] = useState();

  // Global
  const handleSelectChangeGameTypeVendor = (event, newValue) => {
    // const newValue = event.target.value;
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

  const [showGameSpecList, setShowGemeSpecList] = useState(false);

  const handlGameLimitRemove = (unique_idToRemove) => {
    _gameLimitArr((prevArr) =>
      prevArr.filter((item) => item.unique_id !== unique_idToRemove)
    );
  };

 

  const [showTypList, setShowTypeList] = useState(false);

 
  

  // Vendor
  const [showVendorList, setShowVendorList] = useState(false);

  

  const [betList, _betList] = useState([]);


  const initialDefaultValues = {};

  // Populate the initialDefaultValues object with default values based on resultBets
  resultBets.forEach((data) => {
    initialDefaultValues[data?.unique_id] = Number(
      data?.limit
    )?.toLocaleString();
  });

  // Game Disabled

  const [saving, _saving] = useState(false);
  // const handleGameStatusChange = () => {
  //   const selectedGame = gameListWithId?.find(
  //     (item) => item.id === selectedValueGameSpec
  //   );

  //   const existingLimit = disabledGameList?.find(
  //     (item) => item.game_id === selectedGame?.id
  //   );
  //   if (existingLimit && selectedGame != undefined) {
  //     return dispatch(
  //       showMessage({
  //         variant: "error",
  //         message: `${selectedLang.already_registered_on_list}`,
  //       })
  //     );
  //   }

  //   const existingLimitVendor = disabledGameList?.find(
  //     (item) => item.vendor === selectedValueVendor
  //   );

  //   if (existingLimitVendor !== undefined && existingLimitVendor.game_id === selectedValueGameSpec) {
  //     dispatch(
  //       showMessage({
  //         variant: "error",
  //         message: `${selectedLang.already_registered_on_list}`,
  //       })
  //     );

  //   }
  //     const existingType = disabledGameList?.find(
  //       (item) => item.game_type == selectedValueType
  //     );

  //     if (existingType !== undefined) {
  //       return dispatch(
  //         showMessage({
  //           variant: "error",
  //           message: `${selectedLang.already_registered_on_list}`,
  //         })
  //       );
  //     }

  //     let by_spec_game = {
  //       game_id: selectedValueGameSpec,
  //       game_title: selectedValueGameSpecName,
  //       game_type: selectedGame?.type,
  //       game_vendor: selectedGame?.vendor,
  //       disabled_by: "Game",
  //     };

  //     let by_game_type = {
  //       game_type: selectedValueType,
  //       disabled_by: "Type",
  //     };

  //     let by_game_vendor = {
  //       vendor: selectedValueVendor,
  //       disabled_by: "Vendor",
  //     };

  //     const payload = {
  //       user_id: !agent_id ? user_id : agent_id,
  //       spec_game: by_spec_game?.game_id != "" ? by_spec_game : undefined,
  //       game_type: by_game_type?.game_type != "" ? by_game_type : undefined,
  //       game_vendor: by_game_vendor?.vendor != "" ? by_game_vendor : undefined,
  //     };


  //     if (
  //       payload?.game_type == undefined &&
  //       payload?.game_vendor == undefined &&
  //       payload?.spec_game == undefined
  //     ) {
  //       _saving(false);
  //       return dispatch(
  //         showMessage({
  //           variant: "error",
  //           message: `${selectedLang.please_enter_valid_data}`,
  //         })
  //       );
  //     }

  //     _saving(true);
  //     APIService({
  //       url: `${process.env.REACT_APP_R_SITE_API}/betlimit/game-disabled`,
  //       method: "POST",
  //       data: payload,
  //     })
  //       .then((data) => {
  //         dispatch(
  //           showMessage({
  //             variant: "success",
  //             message: `${selectedLang.game_disabled}`,
  //           })
  //         );
  //       })
  //       .catch((err) => {
  //         dispatch(
  //           showMessage({
  //             variant: "error",
  //             message: `${selectedLang.something_went_wrong_please_try_again}`,
  //           })
  //         );
  //       })
  //       .finally(() => {
  //         _saving(false);
  //         setSelectedValueGameSpecName("");
  //         setSelectedValueGameSpec("");
  //         setSelectedValueType("");
  //         setSelectedValueVendor("");
  //         getDisabledGames();
  //       });
  //   };

  // Game Disabled

  const [disabledGameList, _disabledGameList] = useState();
  const getDisabledGames = () => {
    APIService({
      url: `${process.env.REACT_APP_R_SITE_API
        }/betlimit/get-disabled-games?user_id=${!agent_id ? user_id : agent_id}`,
      method: "GET",
    })
      .then((data) => {
        _disabledGameList(data?.data.data);
      })
      .catch((err) => { })
      .finally(() => {
        // getDisabledGames()
      });
  };

  useEffect(() => {
    getDisabledGames();
  }, []);

  const enableGame = (unique_id, type) => {
    APIService({
      url: `${process.env.REACT_APP_R_SITE_API}/betlimit/game-enable?user_id=${!agent_id ? user_id : agent_id}&unique_id=${unique_id}&type=${type}`,
      method: "PUT",
    })
      .then((data) => {
        
        dispatch(
          showMessage({
            variant: "success",
            message: `${selectedLang.enabled}`,
          })
        );
      })
      .catch((err) => { })
      .finally(() => {
        getDisabledGames();
      });
  };

  // const addTableData = () => {
  //   if (resultBets) {
  //     return (
  //       <tbody>
  //         {disabledGameList
  //           ?.slice()
  //           ?.reverse()
  //           // .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
  //           ?.map((data, index) => {
  //             return (
  //               <StyledTableRow hover role="checkbox" tabIndex={-1} key={index}>
  //                 <td
  //                   style={{
  //                     textAlign: "center",
  //                   }}
  //                 >
  //                   {/* {data?.disabled_by == 'Vendor' && data?.game_type}
  // 								{data?.disabled_by == 'Game' && data?.game_type} */}
  //                   {data?.disabled_by != "Type" && selectLocale == "ko"
  //                     ? allProviders.filter(
  //                       (pro) => pro.type == data?.game_type
  //                     )[0]?.type_kr || data?.game_type
  //                     : data?.disabled_by != "Type" && data?.game_type}
  //                   <span style={{ fontWeight: "bold" }}>
  //                     {/* {data?.disabled_by == 'Type' && data?.game_type} */}
  //                     {data?.disabled_by == "Type" && selectLocale == "ko"
  //                       ? allProviders.filter(
  //                         (pro) => pro.type == data?.game_type
  //                       )[0]?.type_kr || data?.game_type
  //                       : data?.disabled_by == "Type" && data?.game_type}
  //                   </span>
  //                 </td>
  //                 <td
  //                   style={{
  //                     textAlign: "center",
  //                   }}
  //                 >
  //                   {/* {data?.disabled_by == 'Game' && data?.vendor} */}
  //                   {data?.disabled_by == "Game" && selectLocale == "ko"
  //                     ? vendorList.filter(
  //                       (pro) => pro.vendor_name == data?.vendor
  //                     )[0]?.vendor_name_kr || data?.vendor
  //                     : data?.disabled_by == "Game" && data?.vendor}
  //                   <span style={{ fontWeight: "bold" }}>
  //                     {/* {data?.disabled_by == 'Vendor' && data?.vendor} */}
  //                     {data?.disabled_by == "Vendor" && selectLocale == "ko"
  //                       ? vendorList.filter(
  //                         (pro) => pro.vendor_name == data?.vendor
  //                       )[0]?.vendor_name_kr || data?.vendor
  //                       : data?.disabled_by == "Vendor" && data?.vendor}
  //                   </span>
  //                 </td>
  //                 <td
  //                   style={{
  //                     textAlign: "center",
  //                   }}
  //                 >
  //                   <span style={{ fontWeight: "bold" }}>
  //                     {/* {data?.disabled_by == 'Game' && data?.game_title} */}

  //                     {data?.disabled_by == "Game" && selectLocale == "ko"
  //                       ? gameListWithId
  //                         .filter((pro) => pro.title == data?.title)[0]
  //                         ?.langs.find(
  //                           (langObject) => langObject.lang === "ko"
  //                         )?.name || data?.game_title
  //                       : data?.disabled_by == "Game" && data?.game_title}
  //                   </span>
  //                 </td>

  //                 <td
  //                   style={{
  //                     textAlign: "center",
  //                   }}
  //                 >
  //                   <Button
  //                     className="buttonbox"
  //                     variant="contained"
  //                     color="success"
  //                     size="small"
  //                     sx={{
  //                       borderRadius: "4px",
  //                     }}
  //                     onClick={() => enableGame(data?.unique_id)}
  //                   >
  //                     {`${selectedLang.enable}`}
  //                   </Button>

  //                   {/* </div> */}
  //                 </td>
  //               </StyledTableRow>
  //             );
  //           })}
  //       </tbody>
  //     );
  //   }
  // };

  const addTableData = () => {
    if (disabledGameList) {
      return (
        <TableBody>
          {disabledGameList?.games_disabled
            ?.map((data, index) => {
              return (
                <StyledTableRow hover role="checkbox" tabIndex={-1} key={index}>
                  <TableCell
                    sx={{
                      textAlign: "center",
                    }}
                  ></TableCell>
                  <TableCell
                    sx={{
                      textAlign: "center",
                    }}
                  ></TableCell>
                  <TableCell
                    sx={{
                      textAlign: "center",
                    }}
                  >
                    <span style={{ fontWeight: "bold" }}>
                      {data?.title && data?.title}
                    </span>
                  </TableCell>
                  <TableCell
                    sx={{
                      textAlign: "center",
                    }}
                  >
                    <Button
                      className="buttonbox"
                      variant="contained"
                      color="success"
                      size="small"
                      sx={{
                        borderRadius: "4px",
                      }}
                      onClick={() => enableGame(data?.unique_id, "games_disabled")}
                    >
                      {`${selectedLang.enable}`}
                    </Button>
                  </TableCell>
                </StyledTableRow>
              );
            })}
          {disabledGameList?.types_disabled
            ?.map((data, index) => {
              return (
                <StyledTableRow hover role="checkbox" tabIndex={-1} key={index}>
                  <TableCell
                    sx={{
                      textAlign: "center",
                    }}
                  >
                    <span style={{ fontWeight: "bold" }}>
                      {data?.game_type && data?.game_type}
                    </span>
                  </TableCell>
                  <TableCell
                    sx={{
                      textAlign: "center",
                    }}
                  >
                    <span style={{ fontWeight: data?.game_type == "all" ? "bold" : "" }}>
                      {data?.vendor && data?.vendor}
                    </span>
                  </TableCell>
                  <TableCell
                    sx={{
                      textAlign: "center",
                    }}
                  >
                  </TableCell>
                  <TableCell
                    sx={{
                      textAlign: "center",
                    }}
                  >
                    <Button
                      className="buttonbox"
                      variant="contained"
                      color="success"
                      size="small"
                      sx={{
                        borderRadius: "4px",
                      }}
                      onClick={() => enableGame(data?.unique_id, "types_disabled")}
                    >
                      {`${selectedLang.enable}`}
                    </Button>
                  </TableCell>
                </StyledTableRow>
              );
            })}
          {disabledGameList?.vendors_disabled
            ?.map((data, index) => {
              return (
                <StyledTableRow hover role="checkbox" tabIndex={-1} key={index}>
                  <TableCell
                    sx={{
                      textAlign: "center",
                    }}
                  >
                  </TableCell>
                  <TableCell
                    sx={{
                      textAlign: "center",
                    }}
                  >
                    <span style={{ fontWeight: "bold" }}>
                      {data?.vendor && data?.vendor}
                    </span>


                  </TableCell>
                  <TableCell
                    sx={{
                      textAlign: "center",
                    }}
                  >
                  </TableCell>
                  <TableCell
                    sx={{
                      textAlign: "center",
                    }}
                  >
                    <Button
                      className="buttonbox"
                      variant="contained"
                      color="success"
                      size="small"
                      sx={{
                        borderRadius: "4px",
                      }}
                      onClick={() => enableGame(data?.unique_id, "vendors_disabled")}
                    >
                      {`${selectedLang.enable}`}
                    </Button>
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
                    <b>{selectedLang.how_to_set_game_disable}</b>
                  </Typography>
                  <Typography
                    id="modal-modal-title"
                    className="title_modal"
                  >
                    <b>
                      {
                        // selectedLang.the_maximum_bet_limit_is_applied_following_order
                        selectedLang.the_game_enable_disable_applied_following_order
                      }
                    </b>
                  </Typography>
                </div>

                <code className="code_block">
                  {" "}
                  {selectedLang.by_type} &gt; {selectedLang.by_vendor} &gt;
                  {selectedLang.by_game}{" "}
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
                        src="/assets/images/tut/Game_management.jpg"
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
                  style={{ color: '#fff' }}
                  id="modal-modal-title"
                  variant="h6"
                  component="h2"
                >
                  <b> {selectedLang.GAMEMANAGEMENT} </b>
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
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>
                            <b>{selectedLang.settings_by_type}</b>
                          </td>
                          <td>
                            {/* <Autocomplete
                              onChange={handleSelectChangeGameType}
                              // className="w-full h-40 my-8"
                              className="datatextbox"
                              variant="outlined"
                              disablePortal
                              size="small"
                              id="combo-box-demo"
                              noOptionsText={selectedLang.no_option}
                              value={
                                selectedValueType != "" ? showValuetoDrop : null
                              }
                              // 	options={
                              // 		[
                              // 		...[
                              // 			...new Set(
                              // 				allProviders
                              // 					.filter(
                              // 						(data) =>
                              // 							data &&
                              // 							data.type &&
                              // 							data.type.trim() !== ''
                              // 					)
                              // 					.sort((a, b) =>
                              // 						a?.type.localeCompare(
                              // 							b?.type.toLowerCase()
                              // 						)
                              // 					)
                              // 					.map((data) => data.type)
                              // 			),
                              // 		].map((type, key) => ({
                              // 			label: type,
                              // 			value: type,
                              // 		})),
                              // 	]
                              // }
                              options={
                                loading
                                  ? [{ label: "loading...", value: null }]
                                  :
                                  [
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
                                  }))


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
                        </tr>
                        {showTypList &&
                          typeLimitArr?.map((data, key) => (
                            <tr key={key}>
                              <td>{selectedLang.settings_by_type}</td>

                              <td>{data?.game_type}</td>
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
                                options={
                                  (vendorList || []) 
                                    ?.filter(
                                      (data) =>
                                        data && data.vendor_name && data.vendor_name.trim() !== ""
                                    )
                                    .sort((a, b) =>
                                      a.vendor_name?.toLowerCase().localeCompare(
                                        b?.vendor_name?.toLowerCase()
                                      )
                                    )
                                    .map((data) => ({
                                      label: data?.vendor_name + " - " + data?.vendor_name_kr,
                                      value: data?.vendor_name,
                                    }))
                                }
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
                                onChange={handleSelectChangeGameTypeVendor}
                                // className="w-full h-40 my-8"
                                className="datatextbox"
                                variant="outlined"
                                disablePortal
                                size="small"
                                id="combo-box-demo"
                                noOptionsText={allProviders.length === 0 ? "loading..." : selectedLang.no_option}
                                value={selectedValueTypeVendor || null}
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
                        </tr>
                        {showVendorList &&
                          vendorLimitArr?.map((data, key) => (
                            <tr key={key}>
                              <td>
                                {selectedLang.vendor_specific_settings}{" "}
                              </td>
                              <td>{data?.vendor}</td>
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
                                onChange={handleSelectChangeGameVendorFG }
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
                        </tr>
                        {showGameSpecList &&
                          gameLimitArr?.map((data, key) => (
                            <tr key={key}>
                              <td> {selectedLang.game_specific_settings}</td>
                              <td>{data?.title}</td>
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
                <Typography
                  id="modal-modal-title"
                  variant="h6"
                  style={{ color: '#fff' }}
                  component="h2"
                >
                  <b> {selectedLang.DisableGames} </b>
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
                              style={{
                                minWidth: column.minWidth,
                                fontWeight: "bold",
                              }}
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
                <br />
                <br />
                {/* <Paper
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
									</Paper> */}
              </Box>
            </div>
          }
        />
      )}
    </>
  );
}

export default providermanagement;
