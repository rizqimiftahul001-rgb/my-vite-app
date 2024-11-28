/** @format */

import React, { useEffect, useState } from "react";
import FusePageSimple from "@fuse/core/FusePageSimple";
import TextField from "@mui/material/TextField";
import BetHistoryHeader from "./betHistoryHeader";
import { useDispatch, useSelector } from "react-redux";
import { locale } from "../../../../configs/navigation-i18n";
import Grid from "@mui/material/Unstable_Grid2";
import "../../dashboard/dashboard.css";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";
import { Autocomplete, Button, Menu } from "@mui/material";
import "./betHistory.css";
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
import InputBase from "@mui/material/InputBase";
import SearchIcon from "@mui/icons-material/Search";
import Box from "@mui/material/Box";
import { IconButton } from "@mui/material";
import APIService from "src/app/services/APIService";
import DataHandler from "src/app/handlers/DataHandler";
import { showMessage } from "app/store/fuse/messageSlice";
import FuseLoading from "@fuse/core/FuseLoading";
import jwtDecode from "jwt-decode";
import Modal from "@mui/material/Modal";
import "react-datepicker/dist/react-datepicker.css";
import { gameTypes } from "src/app/services/gameTypes";
import moment from "moment";
import { formatLocalDateTime, formatSentence } from "src/app/services/Utility";
import CasinoCard from "./casinoCard";
import { useLocation } from "react-router-dom";
import queryString from "query-string";
import { useNavigate } from "react-router-dom";
import "flatpickr/dist/themes/material_green.css";
import Flatpickr from "react-flatpickr";
import PopupState, { bindTrigger, bindMenu } from "material-ui-popup-state";
import Typography from "@mui/material/Typography";
import { CSVLink } from "react-csv";
import CasinoDise from "./CasinoDise";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSort } from "@fortawesome/free-solid-svg-icons";
import { faSortUp } from "@fortawesome/free-solid-svg-icons";
import { faSortDown } from "@fortawesome/free-solid-svg-icons";
import DatePicker from "src/app/main/apps/calendar/DatePicker";
import CloseIcon from "@mui/icons-material/Close";
import CustomTable from "./customTable";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 800,
  height: 700,
  bgcolor: "background.paper",
  border: "2px solid #eaecf4",
  boxShadow: 24,
  borderRadius: 4,
  p: 4,
};

const style2 = {
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

const HtmlTooltip = styled(({ className, ...props }) => (
  <Tooltip arrow {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: "#07092E",
    color: "#fff",
    maxWidth: 320,
    fontSize: theme.typography.pxToRem(12),
    border: "1px solid #172941",
  },
}));

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

const threeDaysAgo = new Date(todayDate);
threeDaysAgo.setDate(todayDate.getDate());
threeDaysAgo.setHours(0, 0, 0, 0);

function betHistoryApp() {
  const location = useLocation();
  const { search } = window.location;
  const { agent } = queryString.parse(search);
  const { q_casino_user } = queryString.parse(search);
  const [agentName, setAgentName] = useState(agent || "");
  const [winTotCount, setWinTotCount] = useState(0);
  const [betTotCount, setBetTotCount] = useState(0);
  const [cancelTotCount, setCancelTotCount] = useState(0);
  const [refundTotCount, setRefundTotCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState(threeDaysAgo);
  const [endDate, setEndDate] = useState(todayDate);
  const role = jwtDecode(DataHandler.getFromSession("accessToken"))["data"];
  const dispatch = useDispatch();
  const user_id = DataHandler.getFromSession("user_id");
  const [selectedprovider] = useSelector((state) => [
    state.provider.selectedprovider,
  ]);
  const [casino_user, setCasinoUser] = useState(q_casino_user || "");
  const [moneySync, setMoneySync] = useState("");
  const [betData1, setBetData1] = useState([]);
  const [tableCount, setTableCont] = useState(0);
  const [oneBet, setOneBet] = useState([]);
  const [selectLocale] = useSelector((state) => [state.locale.selectLocale]);
  const [selectedLang, setSelectedLang] = useState(locale.ko);
  const [loaded, setLoaded] = useState(true);
  const [loading3, setLoading3] = useState(true);
  const [sumRowData, setSumRowData] = useState("");
  const [csvData, setCSVdata] = useState("");
  const [page, setPage] = useState(0);
  const [showTransactionTooltip, setShowTransactionTooltip] = useState(false);
  const [showRoundTooltip, setShowRoundTooltip] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [allProviders, setAllProviders] = useState([]);
  const [allGameVendor, setAllGameVendor] = useState([]);
  const [gameTypeValue, setGameTypeValue] = useState("");
  const [transactionId, setTransactionId] = useState("");
  const [sround_id, setRound_id] = useState("");
  const [gameVendorValue, setGameVendorValue] = useState("");
  const [betType, setBetType] = useState("");
  const [open, setOpen] = useState("");
  const [openWithdraw2, setOpenWithdraw2] = React.useState(false);
  const [openBetObject, setOpenBetObject] = React.useState(false);
  const [roundId, setRoundId] = useState("");
  const [jsonData, setJsonData] = useState();
  const [isHistory, setIsHistory] = useState(false);
  const [isAstro, setIsAstro] = useState(false);

  const handleChange = (e) => {
    setJsonData(e.target.value);
  };

  let userRole = localStorage.getItem("role");

  const handleCloseWithdraw2 = () => {
    setOpenWithdraw2(false);
  };

  const handleCloseBetObject = () => {
    setOpenBetObject(false);
    setIsAstro(false);
    setIsHistory(false);
    setJsonData([]);
  };

  useEffect(() => {
    if (loading3 == false) {
      setLoaded(false);
    }
  }, [loading3]);

  useEffect(() => {
    if (selectLocale == "ko") {
      setSelectedLang(locale.ko);
    } else {
      setSelectedLang(locale.en);
    }
  }, [selectLocale]);
  useEffect(() => {
    setAgentName(agent);
  }, [location]);

  useEffect(() => {
    if (agentName) {
      getBetHistory();
    }
  }, [location]);

  useEffect(() => {
    getProviderList();
    getGameVendorList();
  }, []);

  const optionsGameType = gameTypes.map((game_type) => ({
    label: game_type,
    value: game_type,
  }));

  useEffect(() => {
    if (rowsPerPage != 0) {
      getBetHistory();
    }
  }, [rowsPerPage, page]);

  useEffect(() => {
    if (q_casino_user && q_casino_user != "") {
      setCasinoUser(q_casino_user);
    }
  }, [q_casino_user]);

  // useEffect(() => {
  //   getBetHistoryCSVdata();
  // }, [tableCount]);

  // function UpIcon() {
  //   return (
  //     <>
  //       <svg
  //         width="14"
  //         height="14"
  //         viewBox="0 0 14 14"
  //         fill="none"
  //         xmlns="http://www.w3.org/2000/svg"
  //       >
  //         <mask
  //           id="mask0_568_565"
  //           maskUnits="userSpaceOnUse"
  //           x="0"
  //           y="0"
  //           width="14"
  //           height="14"
  //         >
  //           <path d="M0 0H14V14H0V0Z" fill="white" />
  //         </mask>
  //         <g>
  //           <path
  //             fillRule="evenodd"
  //             clipRule="evenodd"
  //             d="M13.8292 3.0873C13.9385 3.19669 14 3.34503 14 3.49971C14 3.65439 13.9385 3.80274 13.8292 3.91213L8.28751 9.4538C8.17812 9.56316 8.02977 9.62459 7.87509 9.62459C7.72042 9.62459 7.57207 9.56316 7.46268 9.4538L4.95843 6.94955L0.995845 10.9121C0.885827 11.0184 0.738476 11.0772 0.585528 11.0759C0.43258 11.0745 0.286272 11.0132 0.178118 10.905C0.0699629 10.7969 0.00861431 10.6506 0.00728524 10.4976C0.00595616 10.3447 0.0647529 10.1973 0.171012 10.0873L4.54601 5.7123C4.6554 5.60294 4.80375 5.5415 4.95843 5.5415C5.11311 5.5415 5.26145 5.60294 5.37084 5.7123L7.87509 8.21655L13.0043 3.0873C13.1137 2.97794 13.2621 2.9165 13.4168 2.9165C13.5714 2.9165 13.7198 2.97794 13.8292 3.0873Z"
  //             fill="#1AB700"
  //           />
  //           <path
  //             fillRule="evenodd"
  //             clipRule="evenodd"
  //             d="M9.33337 3.49984C9.33337 3.34513 9.39483 3.19675 9.50423 3.08736C9.61362 2.97796 9.762 2.9165 9.91671 2.9165H13.4167C13.5714 2.9165 13.7198 2.97796 13.8292 3.08736C13.9386 3.19675 14 3.34513 14 3.49984V6.99984C14 7.15455 13.9386 7.30292 13.8292 7.41232C13.7198 7.52171 13.5714 7.58317 13.4167 7.58317C13.262 7.58317 13.1136 7.52171 13.0042 7.41232C12.8948 7.30292 12.8334 7.15455 12.8334 6.99984V4.08317H9.91671C9.762 4.08317 9.61362 4.02171 9.50423 3.91232C9.39483 3.80292 9.33337 3.65455 9.33337 3.49984Z"
  //             fill="#1AB700"
  //           />
  //         </g>
  //       </svg>
  //     </>
  //   );
  // }

  // function DownIcon() {
  //   return (
  //     <>
  //       <svg
  //         width="14"
  //         height="14"
  //         viewBox="0 0 14 14"
  //         fill="none"
  //         xmlns="http://www.w3.org/2000/svg"
  //       >
  //         <mask
  //           id="mask0_568_579"
  //           maskUnits="userSpaceOnUse"
  //           x="0"
  //           y="0"
  //           width="14"
  //           height="14"
  //         >
  //           <path d="M14 14H0V0H14V14Z" fill="white" />
  //         </mask>
  //         <g>
  //           <path
  //             fillRule="evenodd"
  //             clipRule="evenodd"
  //             d="M0.170761 10.9127C0.0614033 10.8033 -3.05176e-05 10.655 -3.05176e-05 10.5003C-3.05176e-05 10.3456 0.0614033 10.1973 0.170761 10.0879L5.71243 4.5462C5.82182 4.43684 5.97017 4.37541 6.12484 4.37541C6.27952 4.37541 6.42787 4.43684 6.53726 4.5462L9.04151 7.05045L13.0041 3.08787C13.1141 2.98161 13.2615 2.92281 13.4144 2.92414C13.5674 2.92547 13.7137 2.98682 13.8218 3.09498C13.93 3.20313 13.9913 3.34944 13.9927 3.50239C13.994 3.65533 13.9352 3.80269 13.8289 3.9127L9.45393 8.2877C9.34454 8.39706 9.19619 8.4585 9.04151 8.4585C8.88683 8.4585 8.73849 8.39706 8.62909 8.2877L6.12484 5.78345L0.995595 10.9127C0.886204 11.0221 0.737857 11.0835 0.583179 11.0835C0.428499 11.0835 0.280152 11.0221 0.170761 10.9127Z"
  //             fill="#D50000"
  //           />
  //           <path
  //             fillRule="evenodd"
  //             clipRule="evenodd"
  //             d="M4.6665 10.5002C4.6665 10.6549 4.60505 10.8032 4.49565 10.9126C4.38625 11.022 4.23788 11.0835 4.08317 11.0835H0.58317C0.428461 11.0835 0.280087 11.022 0.170691 10.9126C0.0612946 10.8032 -0.000163078 10.6549 -0.000163078 10.5002V7.00016C-0.000163078 6.84545 0.0612946 6.69708 0.170691 6.58768C0.280087 6.47829 0.428461 6.41683 0.58317 6.41683C0.73788 6.41683 0.886254 6.47829 0.99565 6.58768C1.10505 6.69708 1.1665 6.84545 1.1665 7.00016V9.91683H4.08317C4.23788 9.91683 4.38625 9.97829 4.49565 10.0877C4.60505 10.1971 4.6665 10.3455 4.6665 10.5002Z"
  //             fill="#D50000"
  //           />
  //         </g>
  //       </svg>
  //     </>
  //   );
  // }

  const viewBetClick2 = async (roundId, key) => {
    APIService({
      url: `${process.env.REACT_APP_R_SITE_API}/user/get-history-obj?round_id=${roundId}`,
      method: "GET",
    })
      .then(async (res) => {
        if (key === "WIN/LOSS") {
          let arraydata = res.data.data.history;
          let filteredArray = await arraydata.filter(
            (data) =>
              data.transaction_type === "WIN" ||
              data.transaction_type === "LOSS"
          );
          setJsonData(JSON.stringify(filteredArray, null, 2));
        } else if (key === "BET") {
          let arraydata = res.data.data.history;
          let filteredArray = await arraydata.filter(
            (data) => data.transaction_type === key
          );
          setJsonData(JSON.stringify(filteredArray, null, 2));
        } else if (key === "ASTRO") {
          let arraydata = res.data.data.astro_history;
          setJsonData(JSON.stringify(arraydata, null, 2));
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
        // setOpen(true);
      });
  };

  const viewBetClick = (bet_transaction_id, result_transaction_id) => {
    APIService({
      url: `${process.env.REACT_APP_R_SITE_API}/get-one-history?bet_transaction_id=${bet_transaction_id}&result_transaction_id=${result_transaction_id}`,
      method: "GET",
    })
      .then((res) => {
        setOneBet(res.data.data);
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
        setOpen(true);
      });
  };

  const storeForCsv = (searchOK, casinoFilter) => {
    // APIService({
    //   url: `${
    //     process.env.REACT_APP_R_SITE_API
    //   }/get-history-with-log?user_id=${user_id}&search=${searchOK}&agent_name=${agentName}&startDate=${startDate}&endDate=${endDate}&page_number=${
    //     page + 1
    //   }&row_pre_page=${rowsPerPage}&bet_type=${betType}&vendor=${
    //     gameVendorValue || ""
    //   }&game_type=${gameTypeValue}&casino_user=${
    //     casinoFilter || casino_user
    //   }&round_id=${sround_id}&transaction_id=${transactionId}`,
    //   method: "GET",
    // })
    //   .then((res) => {
    //     const data = res?.data?.data;
    //     const betData1Csv =
    //       data.length > 0 &&
    //       data.map((item) => ({
    //         ...item,
    //         status: item.result_status ? "Success" : "Fail",
    //         dateFormat: moment(item.date).format("YYYY/MM/DD HH:mm:ss"),
    //         round_id_format: String(item.round_id),
    //         description: item?.apiLogDetails?.description,
    //       }));
    //     setCSVdata(betData1Csv);
    //   })
    //   .catch((err) => {});
  };

  const getProviderList = () => {
    APIService({
      url: `${process.env.REACT_APP_R_SITE_API}/game/get-provider-list`,
      method: "GET",
    })
      .then((res) => {
        setAllProviders(res.data.allProvGameList);
      })
      .catch((err) => {})
      .finally(() => {});
  };

  const getGameVendorList = () => {
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

  const [isChecked5min, _isChecked5min] = useState(false);
  const hanldeChange5Min = (e) => {
    const isChecked = e.target.checked;
    _isChecked5min(isChecked);
  };

  const getBetHistory = (searchOK, casinoFilter) => {
    if (Number(rowsPerPage) != 0) {
      setLoading(true);
      setBetData1([]);

      if (role["role"] == "admin") {
        storeForCsv(searchOK, casinoFilter);
      }

      let agentNameNew = agentName;
      if (agentName === undefined) {
        agentNameNew = "";
      }

      APIService({
        url: `${
          process.env.REACT_APP_R_SITE_API
        }/get-history?user_id=${user_id}&search=${searchOK}&agent_name=${agentNameNew}&startDate=${startDate}&endDate=${endDate}&page_number=${
          page + 1
        }&row_pre_page=${rowsPerPage}&bet_type=${betType}&moneySync=${moneySync}&vendor=${
          gameVendorValue || ""
        }&game_type=${gameTypeValue}&casino_user=${
          casinoFilter || casino_user
        }&round_id=${sround_id}&transaction_id=${transactionId}&is5min=${String(
          isChecked5min
        )}`,
        method: "GET",
      })
        .then((res) => {
          setSumRowData(res.data?.total);
          setWinTotCount(res.data?.count?.WIN);
          setBetTotCount(res.data?.count?.BET);
          setRefundTotCount(res.data?.count?.REFUND);
          setCancelTotCount(res.data?.count?.CANCEL);
          setBetData1(res.data.data);
          setTableCont(res.data.table_count);
          if (res["data"]) {
            setLoading(false);
          }

          // Csv Data prepare
          const data = res?.data?.data;
          const betData1Csv =
            data.length > 0 &&
            data.map((item) => ({
              ...item,
              status: item.result_status ? "Success" : "Fail",
              dateFormat: moment(item.date).format("YYYY/MM/DD HH:mm:ss"),
              round_id_format: String(item.round_id),
              description: item?.description?.description_short_en,
            }));
          // setCSVdata(betData1Csv);
          if (
            Array.isArray(betData1Csv) &&
            betData1Csv.every((item) => typeof item === "object")
          ) {
            setCSVdata(betData1Csv);
          } else {
            console.error("Invalid data format for CSV export");
          }
        })
        .catch((err) => {
          if (searchOK == true) {
            setBetData1([]);
          }
          setLoading(false);
        })
        .finally(() => {
          setLoading3(false);
        });
    }
  };

  const getBetHistoryCSVdata = (searchOK) => {
    APIService({
      url: `${
        process.env.REACT_APP_R_SITE_API
      }/get-history?user_id=${user_id}&search=${searchOK}&agent_name=${agentName}&startDate=${startDate}&endDate=${endDate}&page_number=${
        page + 1
      }&row_pre_page=${tableCount}&bet_type=${betType}&vendor=${
        gameVendorValue || ""
      }&game_type=${gameTypeValue}&casino_user=${casino_user}&round_id=${sround_id}&transaction_id=${transactionId}`,
      method: "GET",
    })
      .then((res) => {
        const betData1Csv =
          res.data.data.length > 0 &&
          res.data.data.map((item) => ({
            ...item,
            status: item.result_status ? "Success" : "Fail",
            dateFormat: moment(item.date).format("YYYY/MM/DD HH:mm:ss"),
            round_id_format: String(item.round_id),
          }));

        setCSVdata(betData1Csv);
      })
      .catch((err) => {})
      .finally(() => {});
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleClose = () => {
    setOneBet([]);
    setOpen(false);
  };

  const handleSelectChangeGameType = (event, newValue) => {
    setGameTypeValue(newValue?.value || "");
  };

  const handleSelectChangeGameVendor = (event, newValue) => {
    setGameVendorValue(newValue?.value);
  };

  const handleSelectChangeBetType = (event, newValue) => {
    setBetType(newValue?.value || "");
  };

  const searchHistory = async () => {
    const sDate = new Date(startDate);
    const eDate = new Date(endDate);

    // Calculate the difference in days
    const timeDifference = (sDate - eDate) / (1000 * 60 * 60 * 24);

    if (Math.abs(timeDifference) > 1 && role["role"] != "admin") {
      // Display an alert or any other desired user feedback
      dispatch(
        showMessage({
          variant: "error",
          message: selectedLang.date_should_not_more_than_one_day,
        })
      );
    } else {
      setPage(0);
      if (agentName?.length > 0) {
        setBetData1([]);
        getBetHistory(true);
      } else {
        setBetData1([]);
        getBetHistory(false);
      }
    }
  };

  const handleClick = (url) => {
    window.open(url, "_blank");
  };

  const convertToTimeZone = (date, timeZone) => {
    return new Date(date.toLocaleString("en-US", { timeZone }));
  };
  const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const onDataFilter = (startDate, endDate) => {

    const adjustedStartDate = convertToTimeZone(new Date(startDate), userTimeZone);
    const adjustedEndDate = convertToTimeZone(new Date(endDate), userTimeZone);

    setStartDate(adjustedStartDate);
    setEndDate(adjustedEndDate);

    // setEndDate(endDate);
    // setStartDate(startDate);
  };

  const columns = [
    { id: "name", label: `${selectedLang.number}`, minWidth: 50 },
    { id: "code", label: `${selectedLang.type}`, minWidth: 50 },
    { id: "code", label: `${selectedLang.game_name}`, minWidth: 50 },
    { id: "code", label: `${selectedLang.vendor}`, minWidth: 50 },
    { id: "code", label: `${selectedLang.round_id}`, minWidth: 50 },
    { id: "code", label: `${selectedLang.transaction_id}`, minWidth: 50 },
    { id: "code", label: `${selectedLang.before_money}`, minWidth: 50 },
    { id: "code", label: `${selectedLang.amount}`, minWidth: 50 },
    { id: "code", label: `${selectedLang.after_money}`, minWidth: 50 },
  ];

  const columns11 = [
    // {
    //   id: "transaction_id",
    //   label: `${selectedLang.transaction_id}`,
    //   minWidth: 30,
    // },
    { id: "agent", label: `${selectedLang.agent_name}`, minWidth: 50 },
    { id: "casinoUserID", label: `${selectedLang.casino_id}`, minWidth: 50 },
    // { id: "currency", label: `${selectedLang.currency}`, minWidth: 50 },
    { id: "game_name", label: `${selectedLang.game_name}`, minWidth: 50 },
    { id: "game_vendor", label: `${selectedLang.game_vendor}`, minWidth: 50 },
    { id: "beforeMoney", label: selectLocale ==="en" ?( <>
      {selectedLang.before}
      <br />
      {selectedLang.money}
    </>):(
        selectedLang.before_money
      ), minWidth: 50 },
    { id: "bet", label:selectLocale ==="en" ?( <>
      {selectedLang.bet}
      <br />
      {selectedLang.money}
    </>):selectedLang.bet_money, minWidth: 50 },
    { id: "gameID", label: `${selectedLang.type}`, minWidth: 50 },
    { id: "beforeMoney_1", label: `${selectedLang.amount}`, minWidth: 50 },
    { id: "afterMoney", label: selectLocale ==="en" ?(<>
      {selectedLang.after}
      <br />
      {selectedLang.money}
    </>):selectedLang.after_money, minWidth: 50 },
    { id: "afterMoney_1", label: `${selectedLang.result}`, minWidth: 50 },
    { id: "status", label: `${selectedLang.status}`, minWidth: 50 },
    { id: "round_id", label: <>
      {selectedLang.Round_id}
      <br />
      {selectedLang.transaction_id}
    </>, minWidth: 30 },
    { id: "date", label: `${selectedLang.date}`, minWidth: 50 },
    { id: "action", label: `${selectedLang.action}`, minWidth: 50 },
  ];

  const columns12 = [
    { id: "number", label: `${selectedLang.number}`, minWidth: 30 },
    { id: "agent", label: `${selectedLang.agent_name}`, minWidth: 50 },
    { id: "casinoUserID", label: `${selectedLang.casino_id}`, minWidth: 50 },
    { id: "gameID", label: `${selectedLang.game_id}`, minWidth: 50 },
    { id: "gameName", label: `${selectedLang.game_name}`, minWidth: 50 },
    { id: "beforeMoney", label: `${selectedLang.before_money}`, minWidth: 50 },
    { id: "betMoney", label: `${selectedLang.bet_money}`, minWidth: 100 },
    { id: "winMoney", label: `${selectedLang.win_money}`, minWidth: 100 },
    { id: "afterMoney", label: `${selectedLang.after_money}`, minWidth: 100 },
    { id: "date", label: `${selectedLang.date}`, minWidth: 100 },
  ];

  // bet history total row
  const createTotalRow = () => {
    return (
      <StyledTableRow className="total-row" hover role="checkbox" tabIndex={-1}>
        <TableCell
          sx={{
            textAlign: "center",
          }}
        >
          {selectedLang.total}
        </TableCell>
        {/* <TableCell
          sx={{
            textAlign: "center",
          }}
        >
          {""}
        </TableCell>
        <TableCell
          sx={{
            textAlign: "center",
          }}
        >
          {""}
        </TableCell> */}
        <TableCell
          sx={{
            textAlign: "center",
          }}
        >
          {""}
        </TableCell>
        {/* <TableCell
          sx={{
            textAlign: "center",
          }}
        >
          {""}
        </TableCell> */}
        <TableCell
          sx={{
            textAlign: "center",
          }}
        >
          {""}
        </TableCell>
        <TableCell
          sx={{
            textAlign: "center",
          }}
        >
          {""}
        </TableCell>
        <TableCell
          sx={{
            textAlign: "center",
          }}
        ></TableCell>
        <TableCell
          sx={{
            textAlign: "center",
            fontWeight: "bold",
          }}
        >
          {sumRowData?.bet_total.toLocaleString()}
        </TableCell>
        <TableCell
          sx={{
            textAlign: "center",
          }}
        >
          {""}
        </TableCell>
        <TableCell
          sx={{
            textAlign: "center",
          }}
        >
          {Number(sumRowData?.amount_total).toLocaleString()}
        </TableCell>
        <TableCell
          sx={{
            textAlign: "center",
          }}
        >
          {""}
        </TableCell>
        <TableCell
          sx={{
            textAlign: "center",
          }}
        >
          {""}
        </TableCell>
        <TableCell
          sx={{
            textAlign: "center",
          }}
        >
          {""}
        </TableCell>
        <TableCell
          sx={{
            textAlign: "center",
          }}
        >
          {""}
        </TableCell>
        <TableCell
          sx={{
            textAlign: "center",
          }}
        >
          {""}
        </TableCell>
        <TableCell
          sx={{
            textAlign: "center",
          }}
        >
          {""}
        </TableCell>
        {/* {
          userRole === "admin" &&
          (
            <TableCell
          sx={{
            textAlign: "center",
          }}
        >
          {""}
        </TableCell>
          )
        } */}
      </StyledTableRow>
    );
  };

  const getSortIconBeMo = (order) => {
    return order === "asc" ? (
      <FontAwesomeIcon icon={faSortUp} className="sort-icon" />
    ) : order === "desc" ? (
      <FontAwesomeIcon icon={faSortDown} className="sort-icon" />
    ) : (
      <FontAwesomeIcon icon={faSort} className="sort-icon" />
    );
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

  const getSortIconBeMo1 = (order) => {
    return order === "asc" ? (
      <FontAwesomeIcon icon={faSortUp} className="sort-icon" />
    ) : order === "desc" ? (
      <FontAwesomeIcon icon={faSortDown} className="sort-icon" />
    ) : (
      <FontAwesomeIcon icon={faSort} className="sort-icon" />
    );
  };

  const getSortIconAfMo = (order) => {
    return order === "asc" ? (
      <FontAwesomeIcon icon={faSortUp} className="sort-icon" />
    ) : order === "desc" ? (
      <FontAwesomeIcon icon={faSortDown} className="sort-icon" />
    ) : (
      <FontAwesomeIcon icon={faSort} className="sort-icon" />
    );
  };

  const [sortOrder_befMo, setSortOrder_befMo] = useState("");
  const [sortOrder_bet, setSortOrder_bet] = useState("");
  const [sortOrder_befoMo_1, setSortOrder_befoMo_1] = useState("");
  const [sortOrder_afMo, setSortOrder_afMo] = useState("");
  const [sortOrder_date, setSortOrder_date] = useState("");

  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("");

  const handleSort = (column) => {
    if (
      column == "beforeMoney" ||
      column == "bet" ||
      column == "date" ||
      column == "beforeMoney_1" ||
      column == "afterMoney"
    ) {
      if (column === "beforeMoney") {
        setSortBy("beforeMoney");
        setSortOrder_befMo(
          sortOrder === "asc" ? "desc" : sortOrder === "desc" ? "" : "asc"
        );
        setSortOrder(
          sortOrder === "asc" ? "desc" : sortOrder === "desc" ? "" : "asc"
        );
      } else if (column === "bet") {
        setSortBy("bet");
        setSortOrder_bet(
          sortOrder === "asc" ? "desc" : sortOrder === "desc" ? "" : "asc"
        );
        setSortOrder(
          sortOrder === "asc" ? "desc" : sortOrder === "desc" ? "" : "asc"
        );
      } else if (column == "beforeMoney_1") {
        setSortBy("beforeMoney_1");
        setSortOrder_befoMo_1(
          sortOrder === "asc" ? "desc" : sortOrder === "desc" ? "" : "asc"
        );
        setSortOrder(
          sortOrder === "asc" ? "desc" : sortOrder === "desc" ? "" : "asc"
        );
      } else if (column == "date") {
        setSortBy("date");
        setSortOrder_date(
          sortOrder === "asc" ? "desc" : sortOrder === "desc" ? "" : "asc"
        );
        setSortOrder(
          sortOrder === "asc" ? "desc" : sortOrder === "desc" ? "" : "asc"
        );
      } else {
        setSortBy("afterMoney");
        setSortOrder_afMo(
          sortOrder === "asc" ? "desc" : sortOrder === "desc" ? "" : "asc"
        );
        setSortOrder(
          sortOrder === "asc" ? "desc" : sortOrder === "desc" ? "" : "asc"
        );
      }
    }
  };

  const handleClickTokenHistory = (round_id) => {
    APIService({
      url: `${process.env.REACT_APP_R_SITE_API}/game/result-game-token`,
      method: "POST",
      data: {
        roundid: round_id,
      },
    })
      .then((res) => {
        window.open(res?.url, "_blank");
      })
      .catch((err) => {
        console.log("err", err);
        dispatch(
          showMessage({
            variant: "error",
            message: err?.message || "Data not found!",
          })
        );
      })
      .finally(() => {
        // _loadFailLog(false);
      });
  };

  const handleSubmit = () => {
    let objType = "";
    if (isAstro === true) {
      objType = "ASTRO_HISTORY";
    }
    if (isHistory === true) {
      objType = "HISTORY";
    }

    let dataInJSON = JSON.parse(jsonData);

    let bodyData = {
      object_type: objType,
      update_object: dataInJSON,
    };

    APIService({
      url: `${process.env.REACT_APP_R_SITE_API}/user/edit-history-obj`,
      method: "PUT",
      data: bodyData,
    })
      .then((data) => {
        setOpenWithdraw2(false);
        setOpenBetObject(false);
        window.location.reload();
        dispatch(
          showMessage({
            variant: "success",
            message: `${selectedLang.update_success}`,
          })
        );
      })
      .catch((err) => {
        dispatch(
          showMessage({
            variant: "error",
            message: `${selectedLang.something_went_wrong}`,
          })
        );
      })
      .finally(() => {
        // setLoading3(false);
      });
  };

  const handleRoundClick = (round_id) => {
    if (round_id) {
      const tempTextArea = document.createElement("textarea");
      tempTextArea.value = round_id;
      document.body.appendChild(tempTextArea);
      tempTextArea.select();
      document.execCommand("copy");
      document.body.removeChild(tempTextArea);

      dispatch(
        showMessage({
          variant: "success",
          message: `${selectedLang.Round_ID_copied_successfully}`,
        })
      );
    }
  };

  const handleTransactionClick = (transaction_id) => {
    if (transaction_id) {
      const tempTextArea = document.createElement("textarea");
      tempTextArea.value = transaction_id;
      document.body.appendChild(tempTextArea);
      tempTextArea.select();
      document.execCommand("copy");
      document.body.removeChild(tempTextArea);

      dispatch(
        showMessage({
          variant: "success",
          message: `${selectedLang.Transaction_ID_copied_successfully}`,
        })
      );
    }
  };

  function truncateText(text, maxLength) {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '....';
}

  const initCopybetData1 = [...betData1];


  const sortedAndMappedDataBetData1 =
    sortOrder !== ""
      ? initCopybetData1.sort((a, b) => {
          if (a && b) {
            // Check if both 'a' and 'b' are not null
            if (sortBy == "beforeMoney") {
              return sortOrder === "asc"
                ? (a.before_money || 0) - (b.before_money || 0)
                : (b.before_money || 0) - (a.before_money || 0);
            } else if (sortBy === "bet") {
              return sortOrder === "asc"
                ? (a.bet_money || 0) - (b.bet_money || 0)
                : (b.bet_money || 0) - (a.bet_money || 0);
            } else if (sortBy == "beforeMoney_1") {
              return sortOrder === "asc"
                ? (a.amount || 0) - (b.amount || 0)
                : (b.amount || 0) - (a.amount || 0);
            } else if (sortBy == "afterMoney") {
              return sortOrder === "asc"
                ? (a.after_money || 0) - (b.after_money || 0)
                : (b.after_money || 0) - (a.after_money || 0);
            } else if (sortBy == "date") {
              return sortOrder === "asc"
                ? new Date(a.created_at || 0) - new Date(b.created_at || 0)
                : new Date(b.created_at || 0) - new Date(a.created_at || 0);
            } else {
              // Handle default sorting here, or return the array unchanged
              // For example:
              return 0; // No sorting applied
            }
          } else {
            console.error("Null value encountered during sorting:", a, b);
            return 0; // No sorting applied
          }
        })
      : initCopybetData1;

  const navigate = useNavigate();

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "80%",
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  height: "80vh",
  overflow: "auto",
};

const PaymentResultLink = ({ payment, rawHtml }) => {
  const [isModalOpen, setModalOpen] = useState(false);

  const handleLinkClick = (e) => {
    e.preventDefault();
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const shouldDisplayLink =
    (payment.vendor === "net ent" ||
      payment.vendor === "bigtimegaming" ||
      payment.vendor === "red tiger" ||
      payment.vendor === "nolimitcity") &&
    payment.bet_transaction_id !== "" &&
    payment.result_transaction_id !== "" &&
    payment.extra_history.type === "html" &&
    payment.extra_history.success !== false;

  const shouldUseIframe = /<!DOCTYPE html>|<script[\s\S]*?>/i.test(rawHtml);

  return (
    <>
      {shouldDisplayLink && (
        <div className="result-link">
          <a href="#" onClick={handleLinkClick}>
            Result
          </a>
        </div>
      )}
      <Modal open={isModalOpen} onClose={handleCloseModal}>
        <Box sx={modalStyle}>
          <IconButton
            onClick={handleCloseModal}
            sx={{
              position: "absolute",
              top: 8,
              right: 8,
              zIndex: 1,
              color: "black",
              "&:hover": {
                color: "red",
              },
            }}
          >
            <CloseIcon />
          </IconButton>

          {shouldUseIframe ? (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
                height: "100%",
                overflow: "hidden",
              }}
            >
              <iframe
                srcDoc={rawHtml}
                title="Payment Result"
                style={{
                  width: "80%",
                  height: "80%",
                  border: "none",
                }}
              ></iframe>
            </Box>
          ) : (
            <div dangerouslySetInnerHTML={{ __html: rawHtml }} />
          )}
        </Box>
      </Modal>
    </>
  );
};

  
  
  

  const renderPayment = () => {
    if (betData1.length > 0) {
      return (
        <TableBody>
          {createTotalRow()}
          {sortedAndMappedDataBetData1.map((payment, index) => {
            return (
              <StyledTableRow hover role="checkbox" tabIndex={-1} key={index}>
                {/* <TableCell
                  sx={{
                    textAlign: "center",
                  }}
                >
                  {payment?.round_id}
                </TableCell>
                <TableCell
                  sx={{
                    textAlign: "center",
                  }}
                >
                  {payment?.bet_transaction_id}
                </TableCell> */}
                <TableCell
                  sx={{
                    textAlign: "center",
                  }}
                >
                  {/* {payment?.agent_name} */}
                  <PopupState variant="popover" popupId="demo-popup-menu">
                    {(popupState) => (
                      <React.Fragment>
                        <span
                          style={{
                            textDecoration: "underline",
                            cursor: "pointer",
                          }}
                          {...bindTrigger(popupState)}
                        >
                          {payment?.agent_name}
                        </span>
                        <Menu {...bindMenu(popupState)}>
                          {/* {(role["role"] == "admin" ||
                              role["role"] == "cs" ||
                              myType == "2") && ( */}
                          <MenuItem
                            onClick={() => {
                              popupState.close;
                              navigate(
                                `/mypage?agent_id=${payment?.parent_id}`
                              );
                            }}
                          >
                            {selectedLang.MYPAGE}
                          </MenuItem>
                          {/* )} */}
                          <MenuItem
                            onClick={() => {
                              popupState.close;
                              navigate(
                                `/agent/transactionHistory?agent=${payment?.agent_name}`
                              );
                            }}
                          >
                            {selectedLang.TRANSACTIONHISTORYAGENT}
                          </MenuItem>
                          <MenuItem
                            onClick={() => {
                              popupState.close;
                              navigate(
                                `/agent/agentTreeList?q_agent=${payment?.parent_id}`
                              );
                            }}
                          >
                            {selectedLang.change_password}
                          </MenuItem>

                          <MenuItem
                            onClick={() => {
                              popupState.close;
                              navigate(
                                `/statistics/agentRevenueStatistics?agent=${payment?.agent_name}`
                              );
                            }}
                          >
                            {selectedLang.AGENTRSTATISTICS}
                          </MenuItem>
                          <MenuItem
                            onClick={() => {
                              popupState.close;
                              navigate(
                                `/statistics/statisticsByGame?agent_id=${payment?.parent_id}`
                              );
                            }}
                          >
                            {selectedLang.statisticsByGame}
                          </MenuItem>
                          {/* <MenuItem onClick={popupState.close}>Pot Distribution Statistics</MenuItem> */}
                          <hr style={{ border: "1px solid" }} />
                          <MenuItem
                            onClick={() => {
                              popupState.close;
                              navigate(
                                `/providerManagement?agent_id=${payment?.parent_id}`
                              );
                            }}
                          >
                            {selectedLang.PROVIDERMANAGEMENT}
                          </MenuItem>
                          <hr style={{ border: "1px solid" }} />
                          <MenuItem
                            onClick={() => {
                              popupState.close;
                              navigate(
                                `/gameManagement?agent_id=${payment?.parent_id}`
                              );
                            }}
                          >
                            {selectedLang.GAMEMANAGEMENT}
                          </MenuItem>
                          <hr style={{ border: "1px solid" }} />
                          <MenuItem
                            onClick={() => {
                              popupState.close;
                              navigate(
                                `/statistics/APIerror?agent_id=${payment?.parent_id}`
                              );
                            }}
                          >
                            {selectedLang.APIERRORLOG}
                          </MenuItem>
                          <hr style={{ border: "1px solid" }} />
                          <MenuItem
                            onClick={() => {
                              popupState.close;
                              navigate(
                                `/user/userList?agent=${payment?.agent_name}`
                              );
                            }}
                          >
                            {selectedLang.USERLIST}
                          </MenuItem>
                          <MenuItem
                            onClick={() => {
                              popupState.close;
                              navigate(
                                `/user/transactionHistory?agent=${payment?.agent_name}`
                              );
                            }}
                          >
                            {selectedLang.TRANSACTIONHISTORYUSER}
                          </MenuItem>
                          <MenuItem
                            onClick={() => {
                              popupState.close;
                              navigate(
                                `/user/betHistory?agent=${payment?.agent_name}`
                              );
                            }}
                          >
                            {selectedLang.BETHISTORY}
                          </MenuItem>
                        </Menu>
                      </React.Fragment>
                    )}
                  </PopupState>
                </TableCell>
                <TableCell
                  sx={{
                    textAlign: "center",
                  }}
                  style={{ fontWeight: "bold" }}
                >
                  <PopupState variant="popover" popupId="demo-popup-menu">
                    {(popupState) => (
                      <React.Fragment>
                        <span
                          style={{
                            textDecoration: "underline",
                            cursor: "pointer",
                          }}
                          {...bindTrigger(popupState)}
                        >{`${payment?.casino_user}`}</span>
                        <Menu {...bindMenu(popupState)}>
                          <MenuItem
                            onClick={() => {
                              popupState.close();
                              setCasinoUser(payment?.casino_user);
                              getBetHistory(true, payment?.casino_user);
                            }}
                          >
                            {selectedLang.BETHISTORY}
                          </MenuItem>
                          <MenuItem
                            onClick={() => {
                              popupState.close;
                              navigate(
                                `/user/userList?filter_user=${payment?.casino_user}`
                              );
                            }}
                          >
                            {selectedLang.USERLIST}
                          </MenuItem>
                          <MenuItem
                            onClick={() => {
                              popupState.close;
                              navigate(
                                `/user/transactionHistory?agent=${payment?.casino_user}`
                              );
                            }}
                          >
                            {selectedLang.TRANSACTIONHISTORYUSER}
                          </MenuItem>
                          <MenuItem
                            onClick={() => {
                              popupState.close;
                              navigate(
                                `/statistics/revenueStatisticsCasino?agent=${payment?.casino_user}`
                              );
                            }}
                          >
                            {selectedLang.USERREVENUESTAT}
                          </MenuItem>
                        </Menu>
                      </React.Fragment>
                    )}
                  </PopupState>
                </TableCell>
                {/* <TableCell
                  sx={{
                    textAlign: "center",
                  }}
                >
                  {payment?.currency}
                </TableCell> */}
                <TableCell
                  sx={{
                    textAlign: "center",
                  }}
                >
                  {payment?.game_name}
                </TableCell>
                <TableCell
                  sx={{
                    textAlign: "center",
                  }}
                >
                  {payment?.vendor}
                </TableCell>
                <TableCell
                  sx={{
                    textAlign: "center",
                  }}
                >
                  {Number(payment?.before_money)?.toLocaleString()}
                </TableCell>
                <TableCell
                  sx={{
                    textAlign: "center",
                    fontWeight: "bold",
                  }}
                >
                  {payment?.bet_money?.toLocaleString()}
                </TableCell>
                {/* {
                  userRole === "admin"?<>
                  <TableCell
                  style={{
                    textAlign: "center",
                    fontWeight: "600",
                    color: payment?.invest_money_correction === true ? "#35cdd9" : "red",
                  }}
                >
                  {payment?.invest_money_correction?.toLocaleString()==="true"? "success":payment?.invest_money_correction?.toLocaleString()==="false"?"pending":""}
                </TableCell>
                  </>:<></>
                } */}
                <TableCell
                  style={{
                    textAlign: "center",
                    fontWeight: "600",
                    color: payment?.type === "WIN" ? "#35cdd9" : "red",
                  }}
                >
                  {payment.vendor == "pragmatic" ? (
                    <>
                      {new Date() - new Date(payment.updated_at) < 5000 &&
                      payment.type != "WIN" ? (
                        <>BET</>
                      ) : (
                        <>
                          {payment.result_status == false &&
                          payment.bet_status == true
                            ? `${payment?.type} (WIN)`
                            :payment.type === "LOSS" ?
                            "BET"
                            : `${payment?.type}`}
                        </>
                      )}
                    </>
                  ) : (
                    <>
                      {new Date() - new Date(payment.updated_at) < 30000 &&
                      payment.type != "WIN" ? (
                        <>BET</>
                      ) : (
                        <>
                          {payment.result_status == false &&
                          payment.bet_status == true
                            ? `${payment?.type} (WIN)`
                            :payment.type === "LOSS" ?
                            "BET"
                            : `${payment?.type}`}
                        </>
                      )}
                    </>
                  )}
                </TableCell>
                <TableCell
                  style={{
                    textAlign: "center",
                    color: payment?.type === "WIN" ? "#35cdd9" : "",
                    fontWeight: payment?.type === "WIN" ? "bold" : "",
                  }}
                >
                  {`${payment?.amount?.toLocaleString()}${
                    payment.win_limit_exceeded_amount
                      ? `(${payment.win_limit_exceeded_amount})`
                      : ""
                  }`}
                </TableCell>

                <TableCell
                  sx={{
                    textAlign: "center",
                    fontWeight: "bold",
                  }}
                >
                  {Number(payment?.after_money)
                    ? Number(payment?.after_money).toLocaleString()
                    : 0}
                </TableCell>
                <TableCell
                  sx={{ textAlign: "center", verticalAlign: "middle" }}
                >
                  <div className="result-link">
                    {JSON.parse(process.env.REACT_APP_LIVE_HISTORY).includes(
                      payment?.vendor
                    ) && payment?.type !== "CANCEL" && payment?.vendor==="pgsoft" && payment?.extra_history?.success !== false ? (
                      <a
                        onClick={(e) => {
                          e.preventDefault();
                          if ((payment?.extra_history?.type === "url" && payment?.extra_history?.data)) {
                            window.open((payment?.extra_history?.data), '_blank');
                          } else if(payment?.extra_history?.success === false) {
                           dispatch(
                             showMessage({
                               variant: "error",
                               message: data?.data?.message || data?.message
                             })
                           );
                          }
                        }}
                      >
                        Result
                      </a>
                    ) 
                    :
                    // vinus 
                    (payment.vendor === "evolution"||payment?.vendor === "dreamgame" || payment?.vendor === "bota" 
                    || payment?.vendor === "asia-gaming-live"|| payment?.vendor === "sexybcrt") &&
                      payment?.bet_transaction_id !== "" && payment?.provider_id === "18" &&
                      payment?.result_transaction_id !== "" && payment?.extra_history?.success !== false ? (
                      <div className="result-link">
                        <a
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            const betTransactionId =
                              payment?.bet_transaction_id;
                            const resultTransactionId =
                              payment?.result_transaction_id;

                            if (betTransactionId && resultTransactionId) {
                              window.open(
                                `/details-history/${betTransactionId}/${resultTransactionId}/${payment?.casino_user}/${payment?.provider_id}`
                              );
                            } else {
                              window.open(
                                `/details-history/${payment?.casino_user}`
                              );
                            }
                          }}
                        >
                          Result
                        </a>
                      </div>
                    ) :
                    //honorlink
                    (payment.vendor === "net ent"||payment?.vendor === "bigtimegaming" || payment?.vendor === "red tiger" 
                      || payment?.vendor === "nolimitcity") && payment?.provider_id === "10" &&
                        payment?.bet_transaction_id !== "" &&
                        payment?.result_transaction_id !== "" && payment.extra_history.type === "html" && payment?.extra_history?.success !== false ? (
                          <PaymentResultLink
                          payment={{
                            vendor: payment.vendor, 
                            bet_transaction_id: payment?.bet_transaction_id, 
                            result_transaction_id: payment?.result_transaction_id, 
                            casino_user: payment?.casino_user,
                            provider_id: payment?.provider_id,
                            extra_history: {
                              type: payment?.extra_history?.type,
                              success: payment?.extra_history?.success,
                            },
                          }}
                          rawHtml={payment?.extra_history?.rawHtml}
                        />
                      )
                      :
                      //vinus
                    (payment.vendor === "taishan" || payment?.vendor === "booongo" || payment?.vendor === "play-son" ||
                      payment?.vendor === "micro-gaming" || payment?.vendor === "pragmatic-live") &&
                      payment?.bet_transaction_id !== "" && payment?.provider_id === "18"  ? (
                       <div className="result-link">
                         <a
                           href="#"
                           onClick={async (e) => {
                             e.preventDefault();
                             
                             try {
                               const response = await fetch(`${process.env.REACT_APP_API_LIVE_URL}/api/transaction/detail?transaction_id=${payment.bet_transaction_id}`);
                               const data = await response.json();
                     
                               if ((data?.data?.success && (data?.data?.url || data?.data?.data)) || (data?.success && (data?.url || data?.data))) {
                                 window.open(((data?.data?.url || data?.data?.data)||(data?.url || data?.data)), '_blank');
                               } else if(data?.data?.success===false || data?.success===false) {
                                dispatch(
                                  showMessage({
                                    variant: "error",
                                    message: data?.data?.message || data?.message
                                  })
                                );
                               }
                             } catch (error) {
                              dispatch(
                                showMessage({
                                  variant: "error",
                                  message: error.message,
                                })
                              );
                             }
                           }}
                         >
                           Result
                         </a>
                       </div>
                     )                     
                     :
                    //  timeless
                     (payment?.vendor === "skywind") &&
                      payment?.bet_transaction_id !== "" && payment?.provider_id === "11"  ? (
                       <div className="result-link">
                         <a
                           href="#"
                           onClick={async (e) => {
                             e.preventDefault();
                             
                             try {
                               const response = await fetch(`${process.env.REACT_APP_API_LIVE_URL}/api/transaction/detail?transaction_id=${payment.bet_transaction_id}`);
                               const data = await response.json();
                     
                               if ((data?.data?.success && (data?.data?.url || data?.data?.data)) || (data?.success && (data?.url || data?.data))) {
                                 window.open(((data?.data?.url || data?.data?.data)||(data?.url || data?.data)), '_blank');
                               } else if(data?.data?.success===false || data?.success===false) {
                                dispatch(
                                  showMessage({
                                    variant: "error",
                                    message: data?.data?.message || data?.message
                                  })
                                );
                               }
                             } catch (error) {
                              dispatch(
                                showMessage({
                                  variant: "error",
                                  message: error.message,
                                })
                              );
                             }
                           }}
                         >
                           Result
                         </a>
                       </div>
                     )
                     :
                    payment?.vendor === "vivo" &&
                      payment?.bet_transaction_id !== "" &&
                      payment?.result_transaction_id !== "" && payment.extra_history.type === "url" && payment?.extra_history?.success !== false ? (
                      <div className="result-link">
                        <a
                          className="result-link"
                          href={payment.extra_history.data}
                          onClick={(e) => {
                            e.preventDefault();
                            handleClick(payment.extra_history.data);
                          }}
                        >
                          Result
                        </a>
                      </div>
                    ) : 
                    (
                      payment.extra_history?.success &&
                      payment.extra_history.type === "url" &&
                      payment?.extra_history?.success !== false &&
                      payment?.type !== "CANCEL" &&  (
                        <a
                          className="result-link"
                          href={payment.extra_history.data}
                          onClick={(e) => {
                            e.preventDefault();
                            handleClick(payment.extra_history.data);
                          }}
                        >
                          Result
                        </a>
                      )
                    )}

                    {payment.extra_history?.success &&
                      payment.extra_history.type === "json" &&
                      payment?.type !== "CANCEL" && (
                        <div className="result">
                          {
                          (payment?.extra_history?.data?.bets && payment?.vendor !== "asia-gaming-live")&&
                          <div className="Datarow">
                            {                            
                            <table className="EqualWidthTable">
                                  <thead>
                                    <tr className="Datatr">
                                      <td>Pick</td>
                                      <td>Bet</td>
                                      <td>Winning</td>
                                    </tr>
                                  </thead>                             
                              <tbody>
                                {payment?.extra_history?.data?.participants ? (
                                  payment.extra_history.data.participants.map((participant, index) => (
                                    <React.Fragment key={index}>
                                      {participant?.bets?.map((bet, betIndex) => (
                                        <tr key={betIndex}>
                                          <td>{bet.code.replace(/^[^_]*_/, "")}</td>
                                          <td>{bet.stake}</td>
                                          <td
                                            style={{
                                              color: payment?.type === "WIN" ? "#35cdd9" : "White",
                                              fontWeight: payment?.type === "WIN" ? "bold" : "normal",
                                            }}
                                          >
                                            {(bet.payout).toFixed(0)}
                                          </td>
                                        </tr>
                                      ))}
                                    </React.Fragment>
                                  ))
                                ) : (
                                  payment?.extra_history?.data?.bets && payment?.extra_history?.data?.bets?.map((bet, betIndex) => (
                                    bet?.bet !== "info" && (<tr key={betIndex}>
                                      <td>{bet?.code?.replace(/^[^_]*_/, "") || bet?.bet?.replace(/^[^_]*_/, "")}</td>
                                      <td>{bet.stake}</td>
                                      <td
                                        style={{
                                          color: payment?.type === "WIN" ? "#35cdd9" : "White",
                                          fontWeight: payment?.type === "WIN" ? "bold" : "normal",
                                        }}
                                      >
                                        {(bet.payout).toFixed(0)}
                                      </td>
                                    </tr>)
                                  ))
                                )}

                              </tbody>
                            </table>  
                            }
                          </div>
                          }

                           {
                            (payment?.vendor === "WM casino" && payment?.provider_id === "10")?
                            <div className="card_data">
                                <p style={{fontSize:"12px"}}>
                                  {payment?.extra_history?.data?.result}  
                                </p>
                              </div>
                            :
                            <HtmlTooltip
                            className={"cards_tooltip"}
                            title={
                              <React.Fragment>
                                <div className="card_container">
                                {/* Tooltip Cards */}
                                  <div className="card_data">
                                    <p
                                      className={
                                        ((payment?.extra_history?.data?.result
                                          ?.outcomes?.[0] === "Player" || payment?.extra_history?.data?.result
                                          ?.outcomes === "player") || (payment?.extra_history?.data?.result?.result
                                          ?.outcomes?.[0] === "Player" || payment?.extra_history?.data?.result?.result
                                          ?.outcomes === "player"|| payment?.extra_history?.data?.result?.result
                                          ?.outcomes?.[0] === "Player Win Player Pair" || payment?.extra_history?.data?.result?.result
                                          ?.outcomes === "PLAYER" || payment?.extra_history?.data?.result?.result
                                          ?.outcomes?.[0] === "Player Win")) &&
                                          payment?.type === "WIN"
                                          ? "red":
                                          (payment?.extra_history?.data?.result?.result
                                          ?.outcomes === "Player Win" && payment?.type === "LOSS" && payment?.vendor !== "asia-gaming-live")
                                          ?
                                          "red"
                                          :
                                        ((payment?.extra_history?.data?.result
                                          ?.outcomes?.[0] !== "Player" || payment?.extra_history?.data?.result
                                          ?.outcomes !== "player") || (payment?.extra_history?.data?.result?.result
                                            ?.outcomes?.[0] !== "Player" || payment?.extra_history?.data?.result?.result
                                            ?.outcomes !== "player")) 
                                          &&
                                        (payment?.type === "WIN") 
                                        &&
                                        (( payment?.extra_history?.data?.result
                                          ?.Player?.score || payment?.extra_history?.data?.result?.result
                                          ?.Player?.score) !==
                                        ( payment?.extra_history?.data?.result
                                          ?.Banker?.score || payment?.extra_history?.data?.result?.result
                                          ?.Banker?.score)
                                          ||
                                          (payment?.extra_history?.data?.result
                                            ?.player?.score || payment?.extra_history?.data?.result?.result
                                            ?.player?.score ) !==
                                          (payment?.extra_history?.data?.result
                                            ?.banker?.score || payment?.extra_history?.data?.result?.result
                                            ?.banker?.score))
                                        ?
                                        "white"
                                        : 
                                        ((payment?.extra_history?.data?.result
                                          ?.outcomes?.[0] === "Banker" || payment?.extra_history?.data?.result?.result
                                          ?.outcomes?.[0] === "Banker" || payment?.extra_history?.data?.result?.result
                                          ?.outcomes === "BANKER" || payment?.extra_history?.data?.result?.result
                                          ?.outcomes?.[0] === "Banker Win" || payment?.extra_history?.data?.result?.result
                                          ?.outcomes === "Banker Win" || payment?.extra_history?.data?.result?.result
                                          ?.outcomes?.[0] === "Banker Win Banker Pair") &&
                                        (payment?.type === "LOSS"))
                                        ?"loss":
                                        ((payment?.extra_history?.data?.result
                                          ?.outcomes?.[0] !== "Banker" || payment?.extra_history?.data?.result?.result
                                          ?.outcomes?.[0] !== "Banker") &&
                                        (payment?.type === "LOSS"))&&
                                        (( payment?.extra_history?.data?.result
                                          ?.Player?.score || payment?.extra_history?.data?.result?.result
                                          ?.Player?.score) !==
                                        ( payment?.extra_history?.data?.result
                                          ?.Banker?.score || payment?.extra_history?.data?.result?.result
                                          ?.Banker?.score)
                                          ||
                                          (payment?.extra_history?.data?.result
                                            ?.player?.score || payment?.extra_history?.data?.result?.result
                                            ?.player?.score ) !==
                                          (payment?.extra_history?.data?.result
                                            ?.banker?.score || payment?.extra_history?.data?.result?.result
                                            ?.banker?.score)) 
                                            ?
                                            "white"
                                        :
                                        ((payment?.extra_history?.data?.result
                                          ?.outcomes === "player" || payment?.extra_history?.data?.result?.result
                                          ?.outcomes === "player") &&
                                       ( payment?.type === "LOSS" ))
                                        ? "black"
                                        : ( payment?.extra_history?.data?.result
                                          ?.Player?.score || payment?.extra_history?.data?.result
                                          ?.result?.Player?.score) ===
                                        ( payment?.extra_history?.data?.result
                                          ?.Banker?.score || payment?.extra_history?.data?.result?.result
                                          ?.Banker?.score)
                                          ||
                                          (payment?.extra_history?.data?.result
                                            ?.player?.score || payment?.extra_history?.data?.result
                                            ?.result?.player?.score ) ===
                                          (payment?.extra_history?.data?.result
                                            ?.banker?.score || payment?.extra_history?.data?.result?.result
                                            ?.banker?.score)
                                        ? "success" // Change class to "success" (green)
                                        : ((payment?.extra_history?.data?.result
                                            ?.Player?.score || payment?.extra_history?.data?.result
                                            ?.result?.Player?.score) <
                                            ( payment?.extra_history?.data?.result
                                              ?.Banker?.score || payment?.extra_history?.data?.result?.result?.Banker?.score)
                                              ||
                                              (payment?.extra_history?.data?.result
                                                ?.player?.score || payment?.extra_history?.data?.result
                                                ?.result?.player?.score) <
                                                (payment?.extra_history?.data?.result
                                                  ?.banker?.score || payment?.extra_history?.data?.result?.result
                                                  ?.banker?.score))
                                              &&
                                          payment?.type === "LOSS"
                                        ? "loss"
                                        : "black"
                                      }
                                    >
                                      <b>Player</b>{" "}
                                      {
                                        (
                                          payment?.extra_history?.data?.result?.player?.score ??
                                          payment?.extra_history?.data?.result?.Player?.score ??
                                          payment?.extra_history?.data?.result?.result?.player?.score ??
                                          payment?.extra_history?.data?.result?.result?.Player?.score
                                        )                                        
                                      }
                                    </p>
                                    <div className="all_cards">
                                      {payment?.extra_history?.data?.result?.player && payment?.extra_history?.data?.result?.player?.cards?.length < 2 ? (
                                        payment.extra_history.data.result.player.cards.map((card, index) => (
                                          <CasinoCard
                                            card={card}
                                            index={index}
                                            result="player"
                                            rotate={true}
                                            key={index}
                                          />
                                        ))
                                      ) : payment?.extra_history?.data?.result?.Player?.cards?.length < 2 ? (
                                        payment.extra_history.data.result.Player.cards.map((card, index) => (
                                          <CasinoCard
                                            card={card}
                                            index={index}
                                            result="Player"
                                            rotate={true}
                                            key={index}
                                          />
                                        ))
                                      ) :
                                      payment?.extra_history?.data?.result?.result?.player && payment?.extra_history?.data?.result?.result?.player?.cards?.length < 2 ? (
                                        payment.extra_history.data.result?.result?.player.cards.map((card, index) => (
                                          <CasinoCard
                                            card={card}
                                            index={index}
                                            result="player"
                                            rotate={true}
                                            key={index}
                                          />
                                        ))
                                      ) : payment?.extra_history?.data?.result?.result?.Player?.cards?.length < 2 ? (
                                        payment.extra_history.data.result?.result?.Player.cards.map((card, index) => (
                                          <CasinoCard
                                            card={card}
                                            index={index}
                                            result="Player"
                                            rotate={true}
                                            key={index}
                                          />
                                        ))
                                      ): 
                                      null}

                                      {payment?.extra_history?.data?.result?.player?.cards?.length >= 2 ? (
                                        <>
                                          <CasinoCard
                                            card={payment.extra_history.data.result.player.cards[2]}
                                            index={2}
                                            result="player"
                                            rotate={false}
                                          />
                                          <CasinoCard
                                            card={payment.extra_history.data.result.player.cards[0]}
                                            index={0}
                                            result="player"
                                            rotate={true}
                                          />
                                          <CasinoCard
                                            card={payment.extra_history.data.result.player.cards[1]}
                                            index={1}
                                            result="player"
                                            rotate={true}
                                          />
                                        </>
                                      ) : payment?.extra_history?.data?.result?.Player?.cards?.length >= 2 ? (
                                        <>
                                          <CasinoCard
                                            card={payment.extra_history.data.result.Player.cards[2]}
                                            index={2}
                                            result="Player"
                                            rotate={false}
                                          />
                                          <CasinoCard
                                            card={payment.extra_history.data.result.Player.cards[0]}
                                            index={0}
                                            result="Player"
                                            rotate={true}
                                          />
                                          <CasinoCard
                                            card={payment.extra_history.data.result.Player.cards[1]}
                                            index={1}
                                            result="Player"
                                            rotate={true}
                                          />
                                        </>
                                      ) 
                                      : 
                                      payment?.extra_history?.data?.result?.result?.player?.cards?.length >= 2 ? (
                                        <>
                                          <CasinoCard
                                            card={payment.extra_history.data.result?.result?.player.cards[2]}
                                            index={2}
                                            result="player"
                                            rotate={false}
                                          />
                                          <CasinoCard
                                            card={payment.extra_history.data.result.result?.player.cards[0]}
                                            index={0}
                                            result="player"
                                            rotate={true}
                                          />
                                          <CasinoCard
                                            card={payment.extra_history.data.result.result?.player.cards[1]}
                                            index={1}
                                            result="player"
                                            rotate={true}
                                          />
                                        </>
                                      ) : payment?.extra_history?.data?.result?.result?.Player?.cards?.length >= 2 ? (
                                        <>
                                          <CasinoCard
                                            card={payment.extra_history.data.result.result?.Player.cards[2]}
                                            index={2}
                                            result="Player"
                                            rotate={false}
                                          />
                                          <CasinoCard
                                            card={payment.extra_history.data.result.result?.Player.cards[0]}
                                            index={0}
                                            result="Player"
                                            rotate={true}
                                          />
                                          <CasinoCard
                                            card={payment.extra_history.data.result.result?.Player.cards[1]}
                                            index={1}
                                            result="Player"
                                            rotate={true}
                                          />
                                        </>
                                      )
                                      :
                                      null}


                                    </div>
                                  </div>
                                  <div className="card_data">
                                    <p
                                      className={
                                        ((payment?.extra_history?.data?.result
                                          ?.outcomes?.[0] === "Banker" || payment?.extra_history?.data?.result
                                          ?.outcomes === "banker") || (payment?.extra_history?.data?.result?.result
                                            ?.outcomes?.[0] === "Banker" || payment?.extra_history?.data?.result?.result
                                            ?.outcomes === "banker"|| payment?.extra_history?.data?.result?.result
                                            ?.outcomes?.[0] === "Banker Win Banker Pair" || payment?.extra_history?.data?.result?.result
                                            ?.outcomes === "BANKER" ||payment?.extra_history?.data?.result?.result
                                            ?.outcomes?.[0] === "Banker Win")) &&
                                            payment?.type === "WIN"
                                            ? "red"
                                            :
                                            ((payment?.extra_history?.data?.result?.result
                                            ?.outcomes === "Banker Win") && (payment?.type === "LOSS") && payment?.vendor !== "asia-gaming-live")
                                            ?
                                            "red"
                                            :
                                            ((payment?.extra_history?.data?.result
                                            ?.outcomes?.[0] !== "Banker" || payment?.extra_history?.data?.result
                                            ?.outcomes !== "banker") || (payment?.extra_history?.data?.result?.result
                                              ?.outcomes?.[0] !== "Banker" || payment?.extra_history?.data?.result?.result
                                              ?.outcomes !== "banker")) 
                                            &&
                                          (payment?.type === "WIN")
                                          &&
                                          (( payment?.extra_history?.data?.result
                                            ?.Banker?.score || payment?.extra_history?.data?.result?.result
                                            ?.Banker?.score)  !==
                                          ( payment?.extra_history?.data?.result
                                            ?.Player?.score || payment?.extra_history?.data?.result?.result
                                            ?.Player?.score)
                                            ||
                                            (payment?.extra_history?.data?.result
                                              ?.banker?.score || payment?.extra_history?.data?.result?.result
                                              ?.banker?.score ) !==
                                            (payment?.extra_history?.data?.result
                                              ?.player?.score || payment?.extra_history?.data?.result?.result
                                              ?.player?.score )) ?
                                              "white"
                                              :
                                          ((payment?.extra_history?.data?.result
                                            ?.outcomes?.[0] === "Player" || payment?.extra_history?.data?.result?.result
                                            ?.outcomes?.[0] === "Player" || payment?.extra_history?.data?.result?.result
                                            ?.outcomes === "PLAYER" || payment?.extra_history?.data?.result?.result
                                            ?.outcomes?.[0] === "Player Win" || payment?.extra_history?.data?.result?.result
                                            ?.outcomes === "Player Win" )  &&
                                          (payment?.type === "LOSS"))
                                          ?"loss"
                                          :
                                          ((payment?.extra_history?.data?.result
                                            ?.outcomes?.[0] !== "Player" || payment?.extra_history?.data?.result?.result
                                            ?.outcomes?.[0] !== "Player") &&
                                          (payment?.type === "LOSS"))
                                          &&
                                          (( payment?.extra_history?.data?.result
                                            ?.Banker?.score || payment?.extra_history?.data?.result?.result
                                            ?.Banker?.score)  !==
                                          ( payment?.extra_history?.data?.result
                                            ?.Player?.score || payment?.extra_history?.data?.result?.result
                                            ?.Player?.score)
                                            ||
                                            (payment?.extra_history?.data?.result
                                              ?.banker?.score || payment?.extra_history?.data?.result?.result
                                              ?.banker?.score ) !==
                                            (payment?.extra_history?.data?.result
                                              ?.player?.score || payment?.extra_history?.data?.result?.result
                                              ?.player?.score ))
                                              ?
                                              "white"
                                          :
                                          ((payment?.extra_history?.data?.result
                                            ?.outcomes === "banker" || payment?.extra_history?.data?.result?.result
                                            ?.outcomes === "banker") &&
                                          (payment?.type === "LOSS" ))
                                          ? "black"
                                          : ( payment?.extra_history?.data?.result
                                              ?.Banker?.score || payment?.extra_history?.data?.result?.result
                                              ?.Banker?.score) ===
                                            ( payment?.extra_history?.data?.result
                                              ?.Player?.score || payment?.extra_history?.data?.result?.result
                                              ?.Player?.score)
                                              ||
                                              (payment?.extra_history?.data?.result
                                                ?.banker?.score || payment?.extra_history?.data?.result?.result
                                                ?.banker?.score ) ===
                                              (payment?.extra_history?.data?.result
                                                ?.player?.score || payment?.extra_history?.data?.result?.result
                                                ?.player?.score  )
                                          ? "success" // Change class to "success" (green)
                                          : ((payment?.extra_history?.data?.result
                                              ?.Banker?.score || payment?.extra_history?.data?.result?.result
                                              ?.Banker?.score) <
                                              (payment?.extra_history?.data?.result
                                                ?.Player?.score || payment?.extra_history?.data?.result?.result
                                                ?.Player?.score)
                                                ||
                                                (payment?.extra_history?.data?.result
                                                  ?.banker?.score || payment?.extra_history?.data?.result?.result
                                                  ?.banker?.score ) <
                                                  (payment?.extra_history?.data?.result
                                                    ?.player?.score || payment?.extra_history?.data?.result?.result
                                                    ?.player?.score )
                                                  )
                                                &&
                                            payment?.type === "LOSS"
                                          ? "loss"
                                          : "black"
                                      }
                                    >
                                      <b>Banker</b>{" "}
                                      <b>
                                        {
                                          payment?.extra_history?.data?.result?.banker?.score ??
                                          payment?.extra_history?.data?.result?.Banker?.score ??
                                          payment?.extra_history?.data?.result?.result?.banker?.score ??
                                          payment?.extra_history?.data?.result?.result?.Banker?.score ??
                                          ''
                                        }
                                      </b>
                                    </p>
                                    <div className="all_cards">
                                    {payment?.extra_history?.data?.result?.banker?.cards ? (
                                        payment.extra_history.data.result.banker.cards.map((card, index) => (
                                          <CasinoCard
                                            card={card}
                                            index={index}
                                            result="banker"
                                            rotate={true}
                                            key={index} // Always include a unique `key` prop in lists
                                          />
                                        ))
                                      ) : payment?.extra_history?.data?.result?.Banker?.cards ? (
                                        payment.extra_history.data.result.Banker.cards.map((card, index) => (
                                          <CasinoCard
                                            card={card}
                                            index={index}
                                            result="Banker"
                                            rotate={true}
                                            key={index}
                                          />
                                        ))
                                      ) 
                                      : 
                                      payment?.extra_history?.data?.result?.result?.banker?.cards ? (
                                        payment.extra_history.data.result.result?.banker.cards.map((card, index) => (
                                          <CasinoCard
                                            card={card}
                                            index={index}
                                            result="banker"
                                            rotate={true}
                                            key={index} // Always include a unique `key` prop in lists
                                          />
                                        ))
                                      ) : payment?.extra_history?.data?.result?.result?.Banker?.cards ? (
                                        payment.extra_history.data.result.result?.Banker.cards.map((card, index) => (
                                          <CasinoCard
                                            card={card}
                                            index={index}
                                            result="Banker"
                                            rotate={true}
                                            key={index}
                                          />
                                        ))
                                      )
                                      :
                                      null} 
                                    </div>
                                {/* Tooltip Cards */}
                                  </div>
                                </div>
                              </React.Fragment>
                            }
                          >
                            {
                              payment?.game_type === "baccarat" || payment?.game_type === "live-casino"
                              ?
                              <div className="card_container">
                                {/* Tooltip Cards Text */}
                              <div className="card_data">
                                <p
                                  className={
                                    ((payment?.extra_history?.data?.result
                                      ?.outcomes?.[0] === "Player" || payment?.extra_history?.data?.result
                                      ?.outcomes === "player") || (payment?.extra_history?.data?.result?.result
                                      ?.outcomes?.[0] === "Player" || payment?.extra_history?.data?.result?.result
                                      ?.outcomes === "player"|| payment?.extra_history?.data?.result?.result
                                      ?.outcomes?.[0] === "Player Win Player Pair" || payment?.extra_history?.data?.result?.result
                                      ?.outcomes === "PLAYER" || payment?.extra_history?.data?.result?.result
                                      ?.outcomes?.[0] === "Player Win")) &&
                                      payment?.type === "WIN"
                                      ? "red":
                                      (payment?.extra_history?.data?.result?.result
                                      ?.outcomes === "Player Win" && payment?.type === "LOSS" && payment?.vendor !== "asia-gaming-live")
                                      ?
                                      "red"
                                      :
                                    ((payment?.extra_history?.data?.result
                                      ?.outcomes?.[0] !== "Player" || payment?.extra_history?.data?.result
                                      ?.outcomes !== "player") || (payment?.extra_history?.data?.result?.result
                                        ?.outcomes?.[0] !== "Player" || payment?.extra_history?.data?.result?.result
                                        ?.outcomes !== "player")) 
                                      &&
                                    (payment?.type === "WIN") 
                                    &&
                                    (( payment?.extra_history?.data?.result
                                      ?.Player?.score || payment?.extra_history?.data?.result?.result
                                      ?.Player?.score) !==
                                    ( payment?.extra_history?.data?.result
                                      ?.Banker?.score || payment?.extra_history?.data?.result?.result
                                      ?.Banker?.score)
                                      ||
                                      (payment?.extra_history?.data?.result
                                        ?.player?.score || payment?.extra_history?.data?.result?.result
                                        ?.player?.score ) !==
                                      (payment?.extra_history?.data?.result
                                        ?.banker?.score || payment?.extra_history?.data?.result?.result
                                        ?.banker?.score))
                                    ?
                                    "white"
                                    : 
                                    ((payment?.extra_history?.data?.result
                                      ?.outcomes?.[0] === "Banker" || payment?.extra_history?.data?.result?.result
                                      ?.outcomes?.[0] === "Banker" || payment?.extra_history?.data?.result?.result
                                      ?.outcomes === "BANKER" || payment?.extra_history?.data?.result?.result
                                      ?.outcomes?.[0] === "Banker Win" || payment?.extra_history?.data?.result?.result
                                      ?.outcomes === "Banker Win" || payment?.extra_history?.data?.result?.result
                                      ?.outcomes?.[0] === "Banker Win Banker Pair") &&
                                    (payment?.type === "LOSS"))
                                    ?"loss":
                                    ((payment?.extra_history?.data?.result
                                      ?.outcomes?.[0] !== "Banker" || payment?.extra_history?.data?.result?.result
                                      ?.outcomes?.[0] !== "Banker") &&
                                    (payment?.type === "LOSS"))&&
                                    (( payment?.extra_history?.data?.result
                                      ?.Player?.score || payment?.extra_history?.data?.result?.result
                                      ?.Player?.score) !==
                                    ( payment?.extra_history?.data?.result
                                      ?.Banker?.score || payment?.extra_history?.data?.result?.result
                                      ?.Banker?.score)
                                      ||
                                      (payment?.extra_history?.data?.result
                                        ?.player?.score || payment?.extra_history?.data?.result?.result
                                        ?.player?.score ) !==
                                      (payment?.extra_history?.data?.result
                                        ?.banker?.score || payment?.extra_history?.data?.result?.result
                                        ?.banker?.score)) 
                                        ?
                                        "white"
                                    :
                                    ((payment?.extra_history?.data?.result
                                      ?.outcomes === "player" || payment?.extra_history?.data?.result?.result
                                      ?.outcomes === "player") &&
                                   ( payment?.type === "LOSS" ))
                                    ? "black"
                                    : ( payment?.extra_history?.data?.result
                                      ?.Player?.score || payment?.extra_history?.data?.result
                                      ?.result?.Player?.score) ===
                                    ( payment?.extra_history?.data?.result
                                      ?.Banker?.score || payment?.extra_history?.data?.result?.result
                                      ?.Banker?.score)
                                      ||
                                      (payment?.extra_history?.data?.result
                                        ?.player?.score || payment?.extra_history?.data?.result
                                        ?.result?.player?.score ) ===
                                      (payment?.extra_history?.data?.result
                                        ?.banker?.score || payment?.extra_history?.data?.result?.result
                                        ?.banker?.score)
                                    ? "success" // Change class to "success" (green)
                                    : ((payment?.extra_history?.data?.result
                                        ?.Player?.score || payment?.extra_history?.data?.result
                                        ?.result?.Player?.score) <
                                        ( payment?.extra_history?.data?.result
                                          ?.Banker?.score || payment?.extra_history?.data?.result?.result?.Banker?.score)
                                          ||
                                          (payment?.extra_history?.data?.result
                                            ?.player?.score || payment?.extra_history?.data?.result
                                            ?.result?.player?.score) <
                                            (payment?.extra_history?.data?.result
                                              ?.banker?.score || payment?.extra_history?.data?.result?.result
                                              ?.banker?.score))
                                          &&
                                      payment?.type === "LOSS"
                                    ? "loss"
                                    : "black"
                                  }
                                >
                                  Player{" "}
                                  <b>{
                                    (payment?.extra_history?.data?.result?.player?.score ?? 
                                      payment?.extra_history?.data?.result?.Player?.score ??
                                      payment?.extra_history?.data?.result?.result?.player?.score ??
                                      payment?.extra_history?.data?.result?.result?.Player?.score)                                     
                                  }</b>
                                </p>
                              </div>
                              <div className="card_data">
                                <p
                                  className={
                                    ((payment?.extra_history?.data?.result
                                      ?.outcomes?.[0] === "Banker" || payment?.extra_history?.data?.result
                                      ?.outcomes === "banker") || (payment?.extra_history?.data?.result?.result
                                        ?.outcomes?.[0] === "Banker" || payment?.extra_history?.data?.result?.result
                                        ?.outcomes === "banker"|| payment?.extra_history?.data?.result?.result
                                        ?.outcomes?.[0] === "Banker Win Banker Pair" || payment?.extra_history?.data?.result?.result
                                        ?.outcomes === "BANKER" ||payment?.extra_history?.data?.result?.result
                                        ?.outcomes?.[0] === "Banker Win")) &&
                                        payment?.type === "WIN"
                                        ? "red"
                                        :
                                        ((payment?.extra_history?.data?.result?.result
                                        ?.outcomes === "Banker Win") && (payment?.type === "LOSS") && payment?.vendor !== "asia-gaming-live")
                                        ?
                                        "red"
                                        :
                                        ((payment?.extra_history?.data?.result
                                        ?.outcomes?.[0] !== "Banker" || payment?.extra_history?.data?.result
                                        ?.outcomes !== "banker") || (payment?.extra_history?.data?.result?.result
                                          ?.outcomes?.[0] !== "Banker" || payment?.extra_history?.data?.result?.result
                                          ?.outcomes !== "banker")) 
                                        &&
                                      (payment?.type === "WIN")
                                      &&
                                      (( payment?.extra_history?.data?.result
                                        ?.Banker?.score || payment?.extra_history?.data?.result?.result
                                        ?.Banker?.score)  !==
                                      ( payment?.extra_history?.data?.result
                                        ?.Player?.score || payment?.extra_history?.data?.result?.result
                                        ?.Player?.score)
                                        ||
                                        (payment?.extra_history?.data?.result
                                          ?.banker?.score || payment?.extra_history?.data?.result?.result
                                          ?.banker?.score ) !==
                                        (payment?.extra_history?.data?.result
                                          ?.player?.score || payment?.extra_history?.data?.result?.result
                                          ?.player?.score )) ?
                                          "white"
                                          :
                                      ((payment?.extra_history?.data?.result
                                        ?.outcomes?.[0] === "Player" || payment?.extra_history?.data?.result?.result
                                        ?.outcomes?.[0] === "Player" || payment?.extra_history?.data?.result?.result
                                        ?.outcomes === "PLAYER" || payment?.extra_history?.data?.result?.result
                                        ?.outcomes?.[0] === "Player Win" || payment?.extra_history?.data?.result?.result
                                        ?.outcomes === "Player Win" )  &&
                                      (payment?.type === "LOSS"))
                                      ?"loss"
                                      :
                                      ((payment?.extra_history?.data?.result
                                        ?.outcomes?.[0] !== "Player" || payment?.extra_history?.data?.result?.result
                                        ?.outcomes?.[0] !== "Player") &&
                                      (payment?.type === "LOSS"))
                                      &&
                                      (( payment?.extra_history?.data?.result
                                        ?.Banker?.score || payment?.extra_history?.data?.result?.result
                                        ?.Banker?.score)  !==
                                      ( payment?.extra_history?.data?.result
                                        ?.Player?.score || payment?.extra_history?.data?.result?.result
                                        ?.Player?.score)
                                        ||
                                        (payment?.extra_history?.data?.result
                                          ?.banker?.score || payment?.extra_history?.data?.result?.result
                                          ?.banker?.score ) !==
                                        (payment?.extra_history?.data?.result
                                          ?.player?.score || payment?.extra_history?.data?.result?.result
                                          ?.player?.score ))
                                          ?
                                          "white"
                                      :
                                      ((payment?.extra_history?.data?.result
                                        ?.outcomes === "banker" || payment?.extra_history?.data?.result?.result
                                        ?.outcomes === "banker") &&
                                      (payment?.type === "LOSS" ))
                                      ? "black"
                                      : ( payment?.extra_history?.data?.result
                                          ?.Banker?.score || payment?.extra_history?.data?.result?.result
                                          ?.Banker?.score) ===
                                        ( payment?.extra_history?.data?.result
                                          ?.Player?.score || payment?.extra_history?.data?.result?.result
                                          ?.Player?.score)
                                          ||
                                          (payment?.extra_history?.data?.result
                                            ?.banker?.score || payment?.extra_history?.data?.result?.result
                                            ?.banker?.score ) ===
                                          (payment?.extra_history?.data?.result
                                            ?.player?.score || payment?.extra_history?.data?.result?.result
                                            ?.player?.score  )
                                      ? "success" // Change class to "success" (green)
                                      : ((payment?.extra_history?.data?.result
                                          ?.Banker?.score || payment?.extra_history?.data?.result?.result
                                          ?.Banker?.score) <
                                          (payment?.extra_history?.data?.result
                                            ?.Player?.score || payment?.extra_history?.data?.result?.result
                                            ?.Player?.score)
                                            ||
                                            (payment?.extra_history?.data?.result
                                              ?.banker?.score || payment?.extra_history?.data?.result?.result
                                              ?.banker?.score ) <
                                              (payment?.extra_history?.data?.result
                                                ?.player?.score || payment?.extra_history?.data?.result?.result
                                                ?.player?.score )
                                              )
                                            &&
                                        payment?.type === "LOSS"
                                      ? "loss"
                                      : "black"
                                  }
                                >
                                  Banker{" "}
                                  <b>
                                    {
                                      payment?.extra_history?.data?.result?.banker?.score ??
                                      payment?.extra_history?.data?.result?.Banker?.score ??
                                      payment?.extra_history?.data?.result?.result?.banker?.score ??
                                      payment?.extra_history?.data?.result?.result?.Banker?.score ??
                                      ''
                                    }
                                  </b>
                                </p>
                              </div>
                                {/* Tooltip Cards Text */}
                              </div>  
                              :
                              <div>
                              <div>
                                <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</p>
                              </div>
                              <div>
                                <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</p>
                              </div>
                              </div>
                            }
                            
                            </HtmlTooltip>
                           }
                        </div>
                      )}
                  </div>
                  {/* new disc images show in column */}
                  {payment.extra_history?.success &&
                    payment.extra_history.type === "json" &&
                    payment?.extra_history.data?.game?.gameCode === "sicbo" &&
                    payment?.type !== "CANCEL" && (
                      <HtmlTooltip
                        className={"cards_tooltip"}
                        title={
                          <React.Fragment>
                            <div className="card_container">
                              <div className="card_data">
                                <p
                                  className={
                                    (payment?.extra_history?.data?.result
                                      ?.outcome === "Player" || payment?.extra_history?.data?.result
                                      ?.outcome === "player") &&
                                    payment?.type === "WIN"
                                      ? "success"
                                      : (payment?.extra_history?.data?.result
                                          ?.outcome === "Player" || payment?.extra_history?.data?.result
                                          ?.outcome === "player") &&
                                        payment?.type === "LOSS"
                                      ? "black"
                                      : (payment?.extra_history?.data?.result
                                          ?.player?.score || payment?.extra_history?.data?.result
                                          ?.Player?.score) <
                                          (payment?.extra_history?.data?.result
                                            ?.banker?.score || payment?.extra_history?.data?.result
                                            ?.Banker?.score) &&
                                        payment?.type === "LOSS"
                                      ? "loss"
                                      : "black"
                                  }
                                >
                                  {/* <b>Score</b> :{" "} */}
                                  {
                                    payment?.extra_history?.data?.result
                                      ?.outcome
                                  }
                                </p>
                                <div className="all_cards">
                                  <>
                                    <CasinoDise
                                      card={
                                        payment.extra_history.data.result.first
                                      }
                                      index={0} // or any suitable index
                                      result="player"
                                      rotate={true}
                                    />

                                    {/* Rendering for 'second' */}
                                    <CasinoDise
                                      card={
                                        payment.extra_history.data.result.second
                                      }
                                      index={1} // or any suitable index
                                      result="player"
                                      rotate={true}
                                    />

                                    {/* Rendering for 'third' */}
                                    <CasinoDise
                                      card={
                                        payment.extra_history.data.result.third
                                      }
                                      index={2} // or any suitable index
                                      result="player"
                                      rotate={true}
                                    />
                                  </>
                                </div>
                              </div>
                            </div>
                          </React.Fragment>
                        }
                      >
                        <div className="card_container">
                          <div className="card_data">
                            <p
                              className={
                                (payment?.extra_history?.data?.result
                                  ?.outcome === "Player" || payment?.extra_history?.data?.result
                                  ?.outcome === "player") &&
                                payment?.type === "WIN"
                                  ? "success"
                                  : (payment?.extra_history?.data?.result
                                      ?.outcome === "Player" || payment?.extra_history?.data?.result
                                      ?.outcome === "player")  &&
                                    payment?.type === "LOSS"
                                  ? "black"
                                  : (payment?.extra_history?.data?.result?.player
                                      ?.score || payment?.extra_history?.data?.result?.Player
                                      ?.score) <
                                      (payment?.extra_history?.data?.result
                                        ?.banker?.score || payment?.extra_history?.data?.result
                                        ?.Banker?.score) &&
                                    payment?.type === "LOSS"
                                  ? "loss"
                                  : "black"
                              }
                            >
                              {/* <b>Score</b>{" "} */}
                              {payment?.extra_history?.data?.result?.outcome}
                            </p>
                            <div className="all_cards">
                              <>
                                <CasinoDise
                                  card={payment.extra_history.data.result.first}
                                  index={0} // or any suitable index
                                  result="player"
                                  rotate={true}
                                />

                                {/* Rendering for 'second' */}
                                <CasinoDise
                                  card={
                                    payment.extra_history.data.result.second
                                  }
                                  index={1} // or any suitable index
                                  result="player"
                                  rotate={true}
                                />

                                {/* Rendering for 'third' */}
                                <CasinoDise
                                  card={payment.extra_history.data.result.third}
                                  index={2} // or any suitable index
                                  result="player"
                                  rotate={true}
                                />
                              </>
                            </div>
                          </div>
                        </div>
                      </HtmlTooltip>
                    )}
                  {/* new disc images show in column */}
                  {payment?.type == "CANCEL" && payment?.description && (
                    <TableCell
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        textAlign: "center",
                        // color: "red",
                        fontWeight: "600",
                      }}
                    >
                      {selectLocale === "ko"
                        ? payment?.description?.description_short_ko
                        : payment?.description?.description_short_en}
                    </TableCell>
                  )}
                  {payment?.type == "REFUND" && payment?.description  && (
                    <TableCell
                      style={{
                        textAlign: "center",
                        // color: "red",
                        fontWeight: "600",
                      }}
                    >
                      {selectLocale === "ko"
                        ? payment?.description?.description_short_ko
                        : payment?.description?.description_short_en}
                    </TableCell>
                  )}
                </TableCell>
                {payment?.bet_status && payment?.result_status ? (
                  <TableCell
                    style={{
                      textAlign: "center",
                      color: "#35cdd9",
                      fontWeight: "bold",
                    }}
                  >
                    {selectedLang.success}
                  </TableCell>
                ) : (
                  <TableCell
                    style={{
                      textAlign: "center",
                      color: "red",
                      fontWeight: "600",
                    }}
                  >
                    <div
                      // onClick={() => navigate(`/statistics/APIerror`)}
                      onClick={() => {
                        handleOpenFail(payment?.round_id);
                      }}
                      style={{ cursor: "pointer", textDecoration: "underline" }}
                    >
                      {selectedLang.fail}
                    </div>
                  </TableCell>
                )}

                {/* <div className="RTable"> */}
                <TableCell
                  className="roundtable"
                  sx={{ textAlign: "center", fontSize: "7px" }}
                >
                  <p className="roundHead">
                  {truncateText(payment?.round_id, 8)}
                    <span onClick={() => handleRoundClick(payment?.round_id)}>
                   
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-12 h-12"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 0 0-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 0 1-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H9.75"
                        />
                      </svg>
                    </span>
                    {showRoundTooltip && (
                      <Tooltip title="Copied!" placement="right" />
                    )}
                  </p>
                  <p className="roundHead">
                    {truncateText(payment?.bet_transaction_id,8)}
                    <span
                      onClick={() =>
                        handleTransactionClick(payment?.bet_transaction_id)
                      }
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-12 h-12"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 0 0-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 0 1-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H9.75"
                        />
                      </svg>
                    </span>
                    {showTransactionTooltip && (
                      <Tooltip title="Copied!" placement="right" />
                    )}
                  </p>
                </TableCell>
                {/* </div> */}

                <TableCell
                  sx={{
                    textAlign: "center",
                  }}
                >
                  {convertToCustomFormat(payment?.created_at)}
                </TableCell>
                <TableCell
                  sx={{
                    textAlign: "center",
                  }}
                >
                  <div className="row flex justify-items-center">
                    <div className="col-lg-8 col-md-4 col-sm-4 flex item-center">
                      <Button
                        className="flex item-center buttonbox"
                        variant="contained"
                        color="secondary"
                        size="small"
                        sx={{
                          borderRadius: "4px",
                        }}
                        onClick={(e) =>
                          viewBetClick(
                            payment?.bet_transaction_id,
                            payment?.result_transaction_id
                          )
                        }
                      >
                        {selectedLang.view_data}
                      </Button>
                    </div>
                    {userRole === "admin" || userRole === "cs" ? (
                      <div className="col-lg-8 col-md-4 col-sm-4 flex item-center">
                        <Button
                          className="flex item-center buttonbox"
                          variant="contained"
                          color="secondary"
                          size="small"
                          sx={{
                            borderRadius: "4px",
                          }}
                          onClick={() => {
                            setRoundId(payment?.round_id);
                            setOpenWithdraw2(true);
                          }}
                        >
                          {selectedLang.edit}
                        </Button>
                      </div>
                    ) : (
                      <></>
                    )}
                  </div>
                </TableCell>
              </StyledTableRow>
            );
          })}
        </TableBody>
      );
    }
  };

  function convertToCustomFormat(isoDate) {
    const year = isoDate.slice(0, 4);
    const month = isoDate.slice(5, 7);
    const day = isoDate.slice(8, 10);
    const time = isoDate.slice(11, 19);

    return `${year}/${month}/${day} ${time}`;
  }

  const csvHeader = [
    { label: "Round ID", key: "round_id_format" },
    { label: "Agent UID", key: "agent_name" },

    { label: "Casino User ID", key: "casino_user" },

    { label: "Currency", key: "currency" },
    { label: "Game Name", key: "game_name" },
    { label: "Before Money", key: "before_money" },
    { label: "Bet Money", key: "bet_money" },
    { label: "Type", key: "type" },
    { label: "Amount", key: "amount" },
    { label: "After Money", key: "after_money" },
    { label: "Status", key: "status" },
    { label: "Date", key: "dateFormat" },
    { label: "description", key: "description" },
  ];

  const [openFail, _openFail] = useState(false);
  const handleCloseFail = () => {
    _openFail(false);
  };
  const [failLog, _failLog] = useState({});
  const [loadFaillog, _loadFailLog] = useState(false);
  const handleOpenFail = (round_id) => {
    _openFail(true);
    _loadFailLog(true);
    APIService({
      url: `${
        process.env.REACT_APP_R_SITE_API
      }/game/get-eupriover_callbackapi_log_bet?&page_number=${1}&rows_per_page=${1}&round_id=${round_id}`,
      method: "GET",
    })
      .then((res) => {
        _failLog(res?.data.data[0]);
      })
      .catch((err) => {
        dispatch(
          showMessage({
            variant: "error",
            message: err.message,
          })
        );
      })
      .finally(() => {
        _loadFailLog(false);
      });
  };


  const tabPanels = [
    { value: "1", selectedprovider: selectedprovider },
    { value: "2", selectedprovider: selectedprovider },
    { value: "3", selectedprovider: selectedprovider },
  ];

  const commonTableProps = {
    columns11,
    columns12,
    handleSort,
    sortOrder_befMo,
    sortOrder_bet,
    sortOrder_date,
    sortOrder_befoMo_1,
    sortOrder_afMo,
    getSortIconBeMo,
    getSortIconBet,
    getSortIconBeMo1,
    getSortIconAfMo,
    renderPayment,
    betData1,
    loading,
    selectedLang,
    role,
    tableCount,
    rowsPerPage,
    page,
    handleChangePage,
    handleChangeRowsPerPage,
  };

  const TabContent = () => {
    return tabPanels.map((panel) => (
      <TabPanel key={panel.value} value={panel.value} className="common_tab_content">
        <CustomTable {...commonTableProps} selectedprovider={panel.selectedprovider} />
      </TabPanel>
    ));
  };


  return (
    <>
      {" "}
      {loaded ? (
        <FuseLoading />
      ) : (
        <FusePageSimple
          header={
            <BetHistoryHeader
              selectedLang={selectedLang}
              csv_data={csvData}
              csv_header={csvHeader}
              csv_filename={`bet_history.csv`}
            />
          }
          content={
            <>
              <Modal
                open={openWithdraw2}
                className="small_modal"
                onClose={handleCloseWithdraw2}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
              >
                <Box sx={style2} className="Mymodal">
                  <button
                    className="modalclosebtn"
                    onClick={handleCloseWithdraw2}
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
                            style={{
                              fontWeight: "600",
                              fontSize: "13px",
                              marginBottom: "2%",
                            }}
                          >
                            {selectedLang.ObjectData}{" "}
                          </Typography>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>{" "}
                  <form>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-evenly",
                      }}
                    >
                      <Button
                        className="flex item-center"
                        variant="contained"
                        color="secondary"
                        size="small"
                        sx={{
                          borderRadius: "4px",
                        }}
                        onClick={() => {
                          viewBetClick2(roundId, "BET");
                          setIsHistory(true);
                          setOpenBetObject(true);
                        }}
                      >
                        {selectedLang.BET}
                      </Button>
                      <Button
                        className="flex item-center"
                        variant="contained"
                        color="secondary"
                        size="small"
                        sx={{
                          borderRadius: "4px",
                        }}
                        onClick={() => {
                          viewBetClick2(roundId, "WIN/LOSS");
                          setIsHistory(true);
                          setOpenBetObject(true);
                        }}
                      >
                        {selectedLang.win + "/" + selectedLang.loss}
                      </Button>
                      <Button
                        className="flex item-center"
                        variant="contained"
                        color="secondary"
                        size="small"
                        sx={{
                          borderRadius: "4px",
                        }}
                        onClick={() => {
                          viewBetClick2(roundId, "ASTRO");
                          setIsAstro(true);
                          setOpenBetObject(true);
                        }}
                      >
                        {selectedLang.ASTRO}
                      </Button>
                    </div>
                  </form>
                </Box>
              </Modal>
              <Modal
                className="game_modal"
                open={openBetObject}
                onClose={handleCloseBetObject}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
              >
                <Box sx={style} className="game_modal_inner">
                  <button
                    className="modalclosebtn"
                    onClick={handleCloseBetObject}
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
                  <div
                    // className="rowdata"
                    style={{
                      height: "90%",
                      marginBottom: "4%",
                      marginTop: "2%",
                    }}
                  >
                    <textarea
                      className="preJson"
                      value={jsonData}
                      onChange={handleChange}
                      style={{
                        width: "100%",
                        height: "100%",
                        boxSizing: "border-box",
                        whiteSpace: "pre",
                        fontFamily: "monospace",
                        backgroundColor: "black",
                        padding: "10px",
                      }}
                    />
                  </div>
                  <div>
                    <Button
                      className="flex item-center"
                      variant="contained"
                      color="success"
                      marginTop="5px"
                      sx={{
                        borderRadius: "4px",
                      }}
                      onClick={handleSubmit}
                    >
                      {selectedLang.submit}
                    </Button>
                  </div>
                </Box>
              </Modal>
              <Modal
                className="game_modal"
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
              >
                <Box sx={style} className="game_modal_inner">
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

                  <TableContainer
                    sx={{
                      maxHeight: 240,
                      marginTop: "20px",
                    }}
                  >
                    <Table stickyHeader aria-label="sticky table">
                      <TableHead>
                        <TableRow>
                          {columns.map((column) => (
                            <TableCell
                              key={column.id}
                              align={column.align}
                              style={{
                                minWidth: column.minWidth,
                                textAlign: "center",
                                whiteSpace: "nowrap",
                                borderBottom: "1px solid #e0e0e0",
                              }}
                            >
                              {column.label}
                            </TableCell>
                          ))}
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {oneBet.map((history, index) => (
                          <StyledTableRow
                            hover
                            role="checkbox"
                            tabIndex={-1}
                            key={index}
                            sx={{
                              "&:last-child td": {
                                borderBottom: "none",
                              },
                              "& td": {
                                whiteSpace: "nowrap",
                                borderBottom: "1px solid #e0e0e0",
                              },
                            }}
                          >
                            <TableCell
                              sx={{
                                textAlign: "center",
                              }}
                            >
                              {page * rowsPerPage + index + 1}
                            </TableCell>
                            <TableCell
                              sx={{
                                textAlign: "center",
                              }}
                            >
                              {history.transaction_type}
                            </TableCell>
                            <TableCell
                              sx={{
                                textAlign: "center",
                              }}
                            >
                              {history.game_name}
                            </TableCell>
                            <TableCell
                              sx={{
                                textAlign: "center",
                              }}
                            >
                              {history.vendor}
                            </TableCell>
                            <TableCell
                              sx={{
                                textAlign: "center",
                              }}
                            >
                              {history.round_id}
                            </TableCell>
                            <TableCell
                              sx={{
                                textAlign: "center",
                              }}
                            >
                              {history.transaction_id}
                            </TableCell>
                            <TableCell
                              sx={{
                                textAlign: "center",
                              }}
                            >
                              {Number(
                                history.extra.before_money
                              )?.toLocaleString()}
                            </TableCell>
                            <TableCell
                              sx={{
                                textAlign: "center",
                              }}
                            >
                              {Number(history.amount)?.toLocaleString()}
                            </TableCell>
                            <TableCell
                              sx={{
                                textAlign: "center",
                              }}
                            >
                              {Number(
                                history.extra.after_money
                              )?.toLocaleString()}
                            </TableCell>
                          </StyledTableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                  <div
                    className="rowdata"
                    style={{
                      maxHeight: "350px ",
                      overflowY: "auto",
                    }}
                  >
                    {oneBet[0]?.extra_history?.success &&
                    oneBet[0]?.extra_history.type === "json" &&
                    oneBet[0]?.extra_history.data?.game?.gameCode ===
                      "sicbo" ? (
                      <div className="common_card mb-4">
                        <h5>Game Result:</h5>
                        <div className="card_table">
                          <div className="table-responsive">
                            <table className="table">
                              <tbody>
                                <tr>
                                  <td>
                                    <div
                                      style={{
                                        display: "flex",
                                        justifyContent: "center",
                                      }}
                                    >
                                      {/* {oneBet[1]?.extra_history?.data?.result
                                        ?.outcome &&
                                        oneBet[1]?.extra_history?.data?.result?.outcome
                                          .split(",")
                                          .map((card, index) => (
                                            <div
                                              style={{
                                                marginLeft: "20px",
                                              }}
                                              className="all_card_block"
                                              key={index}
                                            >
                                              <img
                                                src={`assets/images/flat-disc-images/${card}.png`}
                                                alt="image"
                                              />
                                            </div>
                                          ))} */}
                                      {/* <div> */}
                                      <div
                                        style={{
                                          display: "inline-flex",
                                        }}
                                      >
                                        <div
                                          style={{
                                            marginLeft: "20px",
                                          }}
                                          className="all_card_block"
                                        >
                                          <img
                                            src={`assets/images/flat-disc-images/${oneBet[0]?.extra_history?.data?.result?.first}.png`}
                                            alt="image"
                                          />
                                        </div>
                                        <div
                                          style={{
                                            marginLeft: "20px",
                                          }}
                                          className="all_card_block"
                                        >
                                          <img
                                            src={`assets/images/flat-disc-images/${oneBet[0]?.extra_history?.data?.result?.second}.png`}
                                            alt="image"
                                          />
                                        </div>
                                        <div
                                          style={{
                                            marginLeft: "20px",
                                          }}
                                          className="all_card_block"
                                        >
                                          <img
                                            src={`assets/images/flat-disc-images/${oneBet[0]?.extra_history?.data?.result?.third}.png`}
                                            alt="image"
                                          />
                                        </div>
                                      </div>
                                    </div>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="common_card mb-4">
                        <h5>Game Result :</h5>
                        <div className="card_table">
                          <div className="table-responsive">
                            <table className="table">
                              <thead>
                                <tr>
                                  <th className="text-left">
                                    Banker (Score :{" "}
                                    {
                                      (oneBet[0]?.extra_history?.data?.result
                                        ?.banker?.score || oneBet[0]?.extra_history?.data?.result
                                        ?.Banker?.score)
                                    }
                                    )
                                  </th>
                                  <th className="text-left">
                                    Player (Score :{" "}
                                    {
                                      (oneBet[0]?.extra_history?.data?.result
                                        ?.player?.score || oneBet[0]?.extra_history?.data?.result
                                        ?.Player?.score)
                                    }
                                    )
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr>
                                  <td>
                                    <div
                                      style={{
                                        display: "flex",
                                      }}
                                    >
                                      {oneBet[0]?.extra_history?.data?.result?.banker?.cards ? (
                                        oneBet[0].extra_history.data.result.banker.cards.map((card, index) => (
                                          <div
                                            style={{
                                              marginLeft: "10px",
                                            }}
                                            className="all_card_block"
                                            key={index}
                                          >
                                            <img
                                              src={`assets/images/casino-card-images/${card}.png`}
                                              alt="card image"
                                            />
                                          </div>
                                        ))
                                      ) : oneBet[0]?.extra_history?.data?.result?.Banker?.cards ? (
                                        oneBet[0].extra_history.data.result.Banker.cards.map((card, index) => (
                                          <div
                                            style={{
                                              marginLeft: "10px",
                                            }}
                                            className="all_card_block"
                                            key={index}
                                          >
                                            <img
                                              src={`assets/images/casino-card-images/${card}.png`}
                                              alt="card image"
                                            />
                                          </div>
                                        ))
                                      ) : null}

                                    </div>
                                  </td>
                                  <td>
                                    <div
                                      style={{
                                        display: "flex",
                                      }}
                                    >
                                     {(oneBet[0]?.extra_history?.data?.result?.player?.cards.length > 0 ? 
                                        oneBet[0]?.extra_history?.data?.result?.player?.cards : 
                                        oneBet[0]?.extra_history?.data?.result?.Player?.cards?.length > 0 ? 
                                        oneBet[0]?.extra_history?.data?.result?.Player?.cards : 
                                        [] 
                                    )?.map((card, index) => (
                                        <div
                                            style={{
                                                marginLeft: "10px",
                                            }}
                                            className="all_card_block"
                                            key={index}
                                        >
                                            <img
                                                src={`assets/images/casino-card-images/${card}.png`}
                                                alt="image"
                                            />
                                        </div>
                                    ))}
                                    </div>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* New logic for dics */}

                    {/* New logic for dics */}
                    <pre className="preJson">
                      {JSON.stringify(oneBet, null, 2)}
                    </pre>
                  </div>
                </Box>
              </Modal>
              <Card
                sx={{ width: "100%", marginTop: "20px", borderRadius: "4px" }}
                className="main_card"
              >
                <div className="flex justify-start justify-items-center flex-col bg-gray p-16 w-100">
                  <span className="list-title">
                    {selectedLang.Consolidated_Bet_History_List}
                  </span>
                </div>

                <div
                  className="betcards"
                  style={{
                    marginBottom: "10px",
                    fontSize: "12px",
                    fontWeight: 600,
                    color: "#Fff",
                    display: "flex",
                  }}
                >
                  <div className="dashboard_card">
                    <div className="dashboard_two_icons">
                      <div
                        className="d_icon"
                        style={{ backgroundColor: "#03B517" }}
                      >
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 20 20"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M4.03465 7.00813C4.03465 6.82703 3.8873 6.67969 3.70621 6.67969H3.1891V7.33742C3.1891 7.33742 3.63879 7.33656 3.70621 7.33656C3.8873 7.33656 4.03465 7.18922 4.03465 7.00813ZM4.31523 8.56922C4.31523 8.32078 4.11312 8.11867 3.86469 8.11867C3.86469 8.11867 3.25035 8.11914 3.18906 8.11938V9.0218C3.43977 9.02082 3.74031 9.01973 3.86469 9.01973C4.11312 9.01973 4.31523 8.81762 4.31523 8.56922ZM18.2422 11.8331V13.75C18.2422 14.0736 17.9798 14.3359 17.6562 14.3359C17.3327 14.3359 17.0703 14.0736 17.0703 13.75V11.7969H15.3125V13.75C15.3125 14.0736 15.0502 14.3359 14.7266 14.3359C14.403 14.3359 14.1406 14.0736 14.1406 13.75V8.28125C14.1406 7.63406 13.616 7.10938 12.9688 7.10938C12.3215 7.10938 11.7969 7.63402 11.7969 8.28125V15.1172C11.7969 15.4408 11.5345 15.7031 11.2109 15.7031C10.8873 15.7031 10.625 15.4408 10.625 15.1172V13.5332L10.1938 14.0363C9.71601 14.594 9.4533 15.3042 9.45312 16.0386C9.45312 16.8604 9.77316 17.633 10.3543 18.2142L12.1401 20H18.2422C18.3976 20 18.5466 19.9382 18.6565 19.8284C19.5229 18.962 20 17.8102 20 16.5849V13.9453C20 12.8941 19.2409 12.0174 18.2422 11.8331ZM8.36309 16.875H0.78125V18.2422C0.78125 19.2114 1.5698 20 2.53906 20H10.4829L9.52566 19.0428C8.92406 18.4412 8.52512 17.691 8.36309 16.875ZM12.6953 3.16406C13.028 3.16393 13.3583 3.22074 13.6719 3.33203V1.75781C13.6719 0.788555 12.8833 0 11.9141 0H2.53906C1.5698 0 0.78125 0.788555 0.78125 1.75781V3.33203C1.0948 3.22074 1.42509 3.16393 1.75781 3.16406H12.6953ZM0.78125 12.3711V15.7031H8.29527C8.36613 14.8102 8.71758 13.9579 9.30406 13.2736L9.93371 12.5391H1.75781C1.42509 12.5392 1.0948 12.4824 0.78125 12.3711Z"
                            fill="white"
                          />
                          <path
                            d="M10.625 11.3672V8.28125C10.625 6.98891 11.6764 5.9375 12.9688 5.9375C13.5316 5.9375 14.0486 6.13707 14.4531 6.46895V6.09375C14.4531 5.12449 13.6646 4.33594 12.6953 4.33594H1.75781C0.788555 4.33594 0 5.12449 0 6.09375V9.60938C0 10.5786 0.788555 11.3672 1.75781 11.3672H10.625ZM8.36637 5.89844H10.0921C10.3079 5.89844 10.4828 6.07332 10.4828 6.28906C10.4828 6.5048 10.3079 6.67969 10.0921 6.67969H9.61637V9.41406C9.61637 9.6298 9.44148 9.80469 9.22574 9.80469C9.01 9.80469 8.83512 9.6298 8.83512 9.41406V6.67969H8.36633C8.15059 6.67969 7.9757 6.5048 7.9757 6.28906C7.9757 6.07332 8.15063 5.89844 8.36637 5.89844ZM5.48711 6.28906C5.48711 6.07332 5.66199 5.89844 5.87773 5.89844H7.19449C7.41023 5.89844 7.58512 6.07332 7.58512 6.28906C7.58512 6.5048 7.41023 6.67969 7.19449 6.67969H6.26836V7.46094H7.09738C7.31312 7.46094 7.48801 7.63582 7.48801 7.85156C7.48801 8.0673 7.31312 8.24219 7.09738 8.24219H6.26836V9.02344H7.19449C7.41023 9.02344 7.58512 9.19832 7.58512 9.41406C7.58512 9.6298 7.41023 9.80469 7.19449 9.80469H5.87773C5.66199 9.80469 5.48711 9.6298 5.48711 9.41406V6.28906ZM2.40785 6.28906C2.40785 6.07332 2.58273 5.89844 2.79848 5.89844H3.70621C4.31812 5.89844 4.8159 6.39625 4.8159 7.00813C4.81608 7.22207 4.75401 7.43145 4.63727 7.61074C4.91707 7.83672 5.09652 8.1823 5.09652 8.56918C5.09652 9.2484 4.54395 9.80094 3.86473 9.80094C3.63473 9.80094 2.80023 9.80465 2.80023 9.80465H2.79852C2.74722 9.80465 2.69642 9.79455 2.64902 9.77492C2.60163 9.7553 2.55856 9.72652 2.52229 9.69025C2.48602 9.65397 2.45724 9.61091 2.43761 9.56352C2.41799 9.51612 2.40789 9.46532 2.40789 9.41402L2.40785 6.28906Z"
                            fill="white"
                          />
                        </svg>
                      </div>
                    </div>
                    <div className="dashboard_inner">
                      <div className="">
                        <div className="dashboard_icon">
                          <p>
                            {Number(betTotCount || 0).toLocaleString()}
                            <span>Pots</span>
                          </p>
                        </div>
                        <h3>{selectedLang.total_bet}</h3>
                      </div>
                    </div>
                  </div>
                  <div className="dashboard_card">
                    <div className="dashboard_two_icons">
                      <div
                        className="d_icon"
                        style={{ backgroundColor: "#E86261" }}
                      >
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 20 20"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M14.7643 0.263828C14.5355 0.035 14.1645 0.035 13.9357 0.263828L13.55 0.64957C12.4466 0.230391 11.2504 0 10 0C4.47715 0 0 4.47715 0 10C0 11.2504 0.230391 12.4466 0.64957 13.55L0.263828 13.9357C0.035 14.1645 0.035 14.5355 0.263828 14.7643C0.492656 14.9932 0.863633 14.9932 1.09246 14.7643L14.7643 1.09246C14.9932 0.863633 14.9932 0.492656 14.7643 0.263828ZM2.73438 10C2.73438 5.99371 5.99371 2.73438 10 2.73438C10.458 2.73438 10.906 2.77734 11.3407 2.85883L10.2863 3.91316C10.1914 3.90871 10.096 3.90625 10 3.90625C6.63988 3.90625 3.90625 6.63988 3.90625 10C3.90625 10.096 3.90871 10.1914 3.91316 10.2864L2.85883 11.3407C2.77596 10.8986 2.7343 10.4498 2.73438 10ZM19.3504 6.45004L19.7362 6.0643C19.965 5.83547 19.965 5.46449 19.7362 5.23566C19.5073 5.00684 19.1364 5.00684 18.9075 5.23566L5.23566 18.9075C5.00684 19.1364 5.00684 19.5073 5.23566 19.7362C5.46449 19.965 5.83547 19.965 6.0643 19.7362L6.45004 19.3504C7.55336 19.7696 8.74965 20 10 20C15.5229 20 20 15.5229 20 10C20 8.74965 19.7696 7.55336 19.3504 6.45004ZM10 17.2656C9.54203 17.2656 9.09398 17.2227 8.6593 17.1412L9.71363 16.0868C9.80855 16.0913 9.90398 16.0938 10 16.0938C13.3601 16.0938 16.0938 13.3601 16.0938 10C16.0938 9.90398 16.0913 9.80855 16.0868 9.71363L17.1412 8.6593C17.224 9.10139 17.2657 9.55021 17.2656 10C17.2656 14.0063 14.0063 17.2656 10 17.2656ZM4.71063 16.1613C4.6723 16.1647 4.63501 16.1756 4.60088 16.1933C4.56676 16.2111 4.53647 16.2354 4.51175 16.2649C4.48703 16.2944 4.46835 16.3285 4.45679 16.3652C4.44523 16.4018 4.44101 16.4405 4.44438 16.4788C4.44715 16.5105 4.4477 16.5421 4.4459 16.5729C4.43676 16.7308 4.36781 16.8752 4.24094 17.002C4.07496 17.168 3.85426 17.2594 3.61949 17.2594C3.38473 17.2594 3.16402 17.168 2.99805 17.002C2.65535 16.6593 2.65535 16.1017 2.99805 15.7591C3.12158 15.635 3.2795 15.5509 3.45137 15.5177C3.6102 15.4869 3.71406 15.3332 3.68332 15.1744C3.65258 15.0155 3.49891 14.9119 3.34 14.9424C3.05331 14.9978 2.78984 15.1379 2.58371 15.3447C2.01258 15.9158 2.01258 16.8452 2.58371 17.4163C2.86039 17.6929 3.22824 17.8453 3.61953 17.8453C4.01086 17.8453 4.37867 17.6929 4.65531 17.4163C4.88359 17.188 5.01348 16.9081 5.0309 16.6068C5.0343 16.547 5.03338 16.4871 5.02816 16.4275C5.02131 16.3502 4.98401 16.2786 4.92447 16.2287C4.86494 16.1788 4.78802 16.1546 4.71063 16.1613ZM10.6644 10.2075C10.6261 10.2109 10.5888 10.2218 10.5547 10.2396C10.5206 10.2573 10.4903 10.2816 10.4655 10.3111C10.4408 10.3406 10.4221 10.3747 10.4106 10.4114C10.399 10.4481 10.3948 10.4867 10.3982 10.525C10.4009 10.5567 10.4015 10.5884 10.3997 10.6191C10.3905 10.777 10.3216 10.9214 10.1947 11.0482C10.0287 11.2142 9.80805 11.3056 9.57328 11.3056C9.33852 11.3056 9.11781 11.2142 8.95184 11.0482C8.60918 10.7055 8.60918 10.1479 8.9518 9.80523C9.07535 9.68122 9.23328 9.59715 9.40516 9.56391C9.44293 9.55659 9.47889 9.54191 9.51099 9.5207C9.54309 9.49949 9.5707 9.47217 9.59224 9.44029C9.61378 9.40841 9.62883 9.3726 9.63653 9.3349C9.64423 9.2972 9.64442 9.25836 9.63711 9.22059C9.62982 9.1828 9.61516 9.14682 9.59395 9.11471C9.57275 9.0826 9.54542 9.05498 9.51354 9.03344C9.48165 9.01189 9.44583 8.99685 9.40812 8.98916C9.37042 8.98147 9.33156 8.98129 9.29379 8.98863C9.0071 9.04396 8.74363 9.18408 8.5375 9.39086C7.96641 9.96203 7.96641 10.8913 8.5375 11.4625C8.81418 11.7391 9.18203 11.8915 9.57332 11.8915C9.96461 11.8915 10.3325 11.7391 10.6091 11.4625C10.8374 11.2342 10.9673 10.9543 10.9847 10.6529C10.9881 10.5932 10.9872 10.5333 10.982 10.4737C10.9677 10.3127 10.8252 10.1934 10.6644 10.2075ZM12.1031 9.13984L11.612 9.63098L11.1977 9.21664L11.6373 8.77699C11.6918 8.72196 11.7224 8.64757 11.7222 8.5701C11.722 8.49262 11.6912 8.41836 11.6364 8.36358C11.5816 8.3088 11.5073 8.27795 11.4299 8.27778C11.3524 8.27762 11.278 8.30815 11.223 8.3627L10.7833 8.80234L10.369 8.38805L10.8602 7.89688C10.9147 7.84185 10.9453 7.76746 10.9451 7.68998C10.9449 7.6125 10.9141 7.53825 10.8593 7.48346C10.8045 7.42868 10.7302 7.39783 10.6527 7.39767C10.5753 7.3975 10.5009 7.42803 10.4459 7.48258L9.74754 8.1809C9.6926 8.23584 9.66174 8.31035 9.66174 8.38805C9.66174 8.46574 9.6926 8.54025 9.74754 8.5952L11.4048 10.2525C11.4598 10.3074 11.5343 10.3383 11.612 10.3383C11.6897 10.3383 11.7643 10.3074 11.8192 10.2525L12.5175 9.55418C12.5447 9.52698 12.5663 9.49468 12.581 9.45914C12.5957 9.42359 12.6033 9.3855 12.6033 9.34702C12.6033 9.30855 12.5957 9.27045 12.581 9.23491C12.5663 9.19937 12.5447 9.16708 12.5175 9.13988C12.4903 9.11267 12.458 9.09108 12.4224 9.07635C12.3869 9.06161 12.3488 9.05403 12.3103 9.05403C12.2718 9.05402 12.2337 9.0616 12.1981 9.07633C12.1626 9.09105 12.1303 9.11263 12.1031 9.13984ZM16.1082 5.13477L15.6171 5.62594L15.2027 5.2116L15.6424 4.77195C15.6703 4.7449 15.6925 4.71257 15.7077 4.67687C15.723 4.64116 15.731 4.60277 15.7312 4.56394C15.7315 4.52512 15.7241 4.48662 15.7094 4.45069C15.6946 4.41477 15.6729 4.38213 15.6454 4.35467C15.618 4.32721 15.5854 4.30549 15.5494 4.29075C15.5135 4.27602 15.475 4.26858 15.4362 4.26886C15.3974 4.26914 15.359 4.27713 15.3233 4.29237C15.2875 4.30762 15.2552 4.32981 15.2282 4.35766L14.7885 4.79734L14.3741 4.38301L14.8653 3.89188C14.9797 3.77746 14.9797 3.59199 14.8653 3.47758C14.7509 3.36316 14.5654 3.36316 14.451 3.47758L13.7526 4.17578C13.6976 4.23072 13.6668 4.30524 13.6668 4.38293C13.6668 4.46062 13.6976 4.53514 13.7526 4.59008L14.581 5.41852L14.5812 5.41871L14.5814 5.41891L15.4099 6.24738C15.4671 6.30457 15.5421 6.3332 15.6171 6.3332C15.692 6.3332 15.767 6.30461 15.8243 6.24738L16.5226 5.54906C16.5775 5.49412 16.6084 5.41961 16.6084 5.34191C16.6084 5.26422 16.5775 5.18971 16.5226 5.13477C16.4676 5.07983 16.3931 5.04896 16.3154 5.04896C16.2377 5.04896 16.1632 5.07983 16.1082 5.13477ZM7.07363 14.4374L4.82297 13.42C4.82035 13.4188 4.8177 13.4176 4.81504 13.4165C4.7517 13.3899 4.68185 13.3829 4.61447 13.3962C4.54708 13.4096 4.48523 13.4428 4.43684 13.4916C4.3882 13.5401 4.35517 13.602 4.34198 13.6694C4.32878 13.7369 4.33602 13.8067 4.36277 13.87C4.36367 13.8721 4.36461 13.8743 4.36555 13.8764L5.37715 16.1327C5.40027 16.1843 5.43783 16.2281 5.4853 16.2588C5.53276 16.2895 5.5881 16.3059 5.64465 16.3059C5.69353 16.3058 5.74164 16.2936 5.78457 16.2702C5.82751 16.2468 5.86391 16.2131 5.89047 16.172C5.91703 16.131 5.93289 16.084 5.93661 16.0352C5.94034 15.9865 5.93181 15.9376 5.9118 15.893L5.74246 15.5153L6.45637 14.8014L6.8323 14.9713C6.90311 15.0033 6.98373 15.0059 7.05642 14.9785C7.12912 14.951 7.18794 14.8958 7.21994 14.825C7.25194 14.7542 7.25451 14.6736 7.22707 14.6009C7.19963 14.5282 7.14444 14.4694 7.07363 14.4374ZM5.48598 14.9431L5.15957 14.2152L5.8857 14.5434L5.48598 14.9431ZM7.37289 10.9658C7.31734 10.9118 7.24266 10.882 7.16518 10.8829C7.08771 10.8839 7.01376 10.9154 6.95951 10.9707C6.90526 11.0261 6.87513 11.1006 6.87571 11.1781C6.87629 11.2556 6.90754 11.3296 6.96262 11.3841L7.98234 12.3843L6.07777 12.0357C6.01632 12.0245 5.9529 12.0332 5.89675 12.0606C5.84059 12.0879 5.79464 12.1325 5.76559 12.1878C5.73658 12.2431 5.72601 12.3063 5.73541 12.368C5.74481 12.4298 5.7737 12.4869 5.81785 12.5311L7.47203 14.1853C7.52926 14.2425 7.60426 14.2711 7.67922 14.2711C7.75418 14.2711 7.82918 14.2425 7.88641 14.1853C7.91361 14.1581 7.9352 14.1258 7.94992 14.0902C7.96464 14.0547 7.97222 14.0166 7.97222 13.9781C7.97222 13.9396 7.96464 13.9015 7.94992 13.866C7.9352 13.8304 7.91361 13.7981 7.88641 13.7709L6.89676 12.7813L8.71043 13.1133C8.85945 13.1402 8.9982 13.0763 9.06445 12.9499C9.13203 12.8209 9.10355 12.6655 8.98988 12.5518L7.37289 10.9658ZM13.4226 7.81754C13.2993 7.94225 13.1758 8.0667 13.052 8.1909L11.6019 6.74082C11.5469 6.68627 11.4725 6.65574 11.395 6.65591C11.3175 6.65607 11.2433 6.68692 11.1885 6.74171C11.1337 6.79649 11.1029 6.87074 11.1027 6.94822C11.1025 7.0257 11.133 7.10009 11.1876 7.15512L12.8435 8.81102C12.8707 8.83825 12.903 8.85985 12.9386 8.87458C12.9741 8.88931 13.0122 8.89687 13.0507 8.89684C13.1112 8.89686 13.1703 8.87813 13.2196 8.8432C13.2453 8.82508 13.2623 8.81309 13.8393 8.22953C13.8928 8.17405 13.9223 8.09972 13.9213 8.02266C13.9204 7.94559 13.8892 7.872 13.8344 7.81781C13.7796 7.76362 13.7056 7.73321 13.6285 7.73316C13.5515 7.73311 13.4775 7.76342 13.4226 7.81754ZM14.6932 6.54695C14.5662 6.67539 14.4299 6.81273 14.3226 6.92035L12.8725 5.47027C12.8175 5.41573 12.7431 5.3852 12.6656 5.38536C12.5881 5.38553 12.5139 5.41638 12.4591 5.47116C12.4043 5.52594 12.3734 5.6002 12.3733 5.67767C12.3731 5.75515 12.4036 5.82954 12.4582 5.88457L14.1141 7.54047C14.1413 7.56771 14.1736 7.58931 14.2091 7.60403C14.2447 7.61876 14.2828 7.62632 14.3213 7.62629C14.382 7.62631 14.4411 7.60749 14.4906 7.57242C14.5161 7.55434 14.533 7.54238 15.1099 6.95902C15.1645 6.90377 15.195 6.82908 15.1945 6.75139C15.1941 6.67369 15.1628 6.59936 15.1075 6.54473C15.0802 6.51766 15.0478 6.49625 15.0122 6.48171C14.9765 6.46717 14.9384 6.4598 14.8999 6.46001C14.8614 6.46021 14.8234 6.468 14.7879 6.48292C14.7524 6.49783 14.7203 6.5196 14.6932 6.54695ZM17.5821 2.41793C16.9625 1.79832 16.194 1.73438 15.6698 2.25852L15.2005 2.72789C15.1732 2.75513 15.1516 2.78747 15.1369 2.82307C15.1222 2.85866 15.1147 2.89681 15.1147 2.93532C15.1147 2.97384 15.1224 3.01197 15.1372 3.04753C15.152 3.0831 15.1736 3.11539 15.2009 3.14258L15.2018 3.14348L15.2022 3.14391L16.8308 4.77254C16.8447 4.78645 16.8597 4.79859 16.8755 4.80914C16.9288 4.85595 16.9973 4.88181 17.0682 4.88191H17.0693C17.1078 4.88177 17.1459 4.87405 17.1813 4.85919C17.2168 4.84433 17.2491 4.82263 17.2762 4.79531C17.2903 4.78109 17.6237 4.44512 17.7551 4.30906C18.2442 3.80266 18.1714 3.0073 17.5821 2.41793ZM17.3336 3.90211C17.245 3.99326 17.1559 4.084 17.0665 4.17434C16.8583 3.96763 16.6504 3.76069 16.4428 3.55352C16.3237 3.43449 16.0264 3.13805 15.8223 2.93469L16.0841 2.67285C16.4248 2.33211 16.8673 2.53187 17.1677 2.83227C17.4714 3.13586 17.6404 3.58441 17.3336 3.90211Z"
                            fill="white"
                          />
                        </svg>
                      </div>
                    </div>
                    <div className="dashboard_inner">
                      <div className="">
                        <div className="dashboard_icon">
                          <p>
                            {Number(cancelTotCount || 0).toLocaleString()}
                            <span>Pots</span>
                          </p>
                        </div>
                        <h3>{selectedLang.total_cancel_amount}</h3>
                      </div>
                    </div>
                  </div>
                  {/* Refund */}
                  <div className="dashboard_card">
                    <div className="dashboard_two_icons">
                      <div
                        className="d_icon"
                        style={{ backgroundColor: "#FE9219" }}
                      >
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 20 20"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M2.03125 20H0.585938C0.262344 20 0 19.7377 0 19.4141V12.3828C0 12.0592 0.262344 11.7969 0.585938 11.7969H2.03125C2.35484 11.7969 2.61719 12.0592 2.61719 12.3828V19.4141C2.61719 19.7377 2.35484 20 2.03125 20ZM19.2677 13.6255C19.0459 13.5034 18.7954 13.4431 18.5423 13.4509C18.2893 13.4586 18.0429 13.5342 17.8291 13.6697L15.6853 15.0274C15.6205 15.5805 15.377 16.0938 14.9802 16.5C14.498 16.9937 13.8531 17.2656 13.1641 17.2656H10.2509C9.93543 17.2656 9.66395 17.0232 9.6491 16.708C9.63324 16.3715 9.90137 16.0938 10.2344 16.0938H13.1641C13.9289 16.0938 14.5491 15.4624 14.5309 14.6936C14.5132 13.9472 13.885 13.3594 13.1384 13.3594H9.84375L9.46156 13.0727C8.70043 12.5019 7.7573 12.1875 6.80586 12.1875C6.00365 12.1876 5.21652 12.4056 4.52859 12.8182L3.78906 13.262V19.2188H13.6377C14.2072 19.2188 14.7644 19.0528 15.241 18.7411L19.3597 16.0481C19.5567 15.9198 19.7184 15.7443 19.8302 15.5376C19.942 15.3309 20.0004 15.0994 20 14.8644C20 14.3488 19.7194 13.8741 19.2677 13.6255ZM8.28125 0C5.58887 0 3.39844 2.19043 3.39844 4.88281C3.39844 7.5752 5.58887 9.76562 8.28125 9.76562C10.9736 9.76562 13.1641 7.5752 13.1641 4.88281C13.1641 2.19043 10.9736 0 8.28125 0ZM8.86719 7.30746V7.42188C8.86719 7.74547 8.60484 8.00781 8.28125 8.00781C7.95766 8.00781 7.69531 7.74547 7.69531 7.42188V7.30695C7.2218 7.11414 6.85641 6.69461 6.75016 6.17129C6.68578 5.85418 6.89062 5.54488 7.20777 5.48043C7.52484 5.41613 7.83422 5.62094 7.89863 5.93805C7.93531 6.11879 8.09629 6.24996 8.28129 6.24996C8.49668 6.24996 8.67191 6.07473 8.67191 5.85934C8.67191 5.64395 8.49668 5.46871 8.28129 5.46871C7.41973 5.46871 6.71879 4.76777 6.71879 3.90621C6.71879 3.25184 7.12336 2.69043 7.69535 2.45813V2.34375C7.69535 2.02016 7.9577 1.75781 8.28129 1.75781C8.60488 1.75781 8.86723 2.02016 8.86723 2.34375V2.45867C9.34074 2.65148 9.70613 3.07102 9.81238 3.59434C9.87676 3.91145 9.67187 4.22074 9.35477 4.2852C9.0377 4.34957 8.72836 4.14469 8.66391 3.82758C8.62719 3.6468 8.46625 3.51562 8.28125 3.51562C8.06586 3.51562 7.89062 3.69086 7.89062 3.90625C7.89062 4.12164 8.06586 4.29688 8.28125 4.29688C9.14281 4.29688 9.84375 4.99781 9.84375 5.85938C9.84375 6.51375 9.43918 7.07516 8.86719 7.30746Z"
                            fill="white"
                          />
                          <path
                            d="M19.9448 7.88328C19.8975 7.78242 19.8225 7.69712 19.7286 7.63736C19.6346 7.5776 19.5255 7.54586 19.4142 7.54586H18.5613C18.0434 5.50055 16.8759 3.64961 15.2387 2.29379C14.4771 1.66309 13.6287 1.15375 12.7261 0.776367C13.7247 1.85637 14.336 3.29957 14.336 4.88305C14.336 5.37008 14.2778 5.84367 14.1688 6.2977C14.4408 6.68762 14.6709 7.10625 14.8518 7.54586H14.336C14.2247 7.54586 14.1156 7.5776 14.0216 7.63736C13.9277 7.69712 13.8527 7.78242 13.8054 7.88328C13.7582 7.98413 13.7407 8.09636 13.7549 8.20681C13.7692 8.31726 13.8146 8.42136 13.8859 8.50691L16.425 11.5538C16.48 11.6198 16.5488 11.6729 16.6266 11.7093C16.7044 11.7458 16.7892 11.7646 16.8751 11.7646C16.961 11.7646 17.0458 11.7458 17.1236 11.7093C17.2014 11.6729 17.2702 11.6198 17.3252 11.5538L19.8643 8.50691C19.9356 8.42136 19.981 8.31726 19.9953 8.20681C20.0095 8.09636 19.992 7.98414 19.9448 7.88328Z"
                            fill="white"
                          />
                        </svg>
                      </div>
                    </div>
                    <div className="dashboard_inner">
                      <div className="">
                        <div className="dashboard_icon">
                          <p>
                            {Number(refundTotCount || 0).toLocaleString()}
                            <span>Pots</span>
                          </p>
                        </div>
                        <h3>{selectedLang.total_refund}</h3>
                      </div>
                    </div>
                  </div>
                  {/* End Refund */}

                  <div className="dashboard_card">
                    <div className="dashboard_two_icons">
                      <div
                        className="d_icon"
                        style={{ backgroundColor: "#03B517" }}
                      >
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 20 20"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M17.5593 10.0786H2.44098C1.79382 10.0793 1.17339 10.3368 0.715776 10.7944C0.258165 11.252 0.000750233 11.8724 0 12.5196V17.559C0.000750233 18.2062 0.258165 18.8266 0.715776 19.2842C1.17339 19.7418 1.79382 19.9993 2.44098 20H17.5593C18.2065 19.9993 18.8269 19.7418 19.2845 19.2842C19.7421 18.8266 19.9996 18.2062 20.0003 17.559V12.5196C19.9996 11.8724 19.7421 11.252 19.2845 10.7944C18.8269 10.3368 18.2065 10.0793 17.5593 10.0786ZM9.12833 12.9133L8.4984 17.3228C8.48246 17.4347 8.43249 17.539 8.35527 17.6216C8.27805 17.7042 8.17731 17.761 8.0667 17.7844C7.9561 17.8077 7.84098 17.7965 7.73695 17.7523C7.63293 17.708 7.54502 17.6329 7.48515 17.537L6.37805 15.7637L5.27063 17.5354C5.21077 17.6313 5.12286 17.7065 5.01883 17.7507C4.91481 17.795 4.79969 17.8062 4.68908 17.7828C4.57848 17.7594 4.47774 17.7026 4.40051 17.62C4.32329 17.5375 4.27333 17.4331 4.25739 17.3212L3.62746 12.9117C3.61539 12.8392 3.61793 12.7651 3.63494 12.6936C3.65194 12.6221 3.68306 12.5548 3.72646 12.4955C3.76987 12.4362 3.82468 12.3862 3.88769 12.3485C3.95069 12.3107 4.02061 12.2859 4.09334 12.2755C4.16607 12.2651 4.24014 12.2694 4.3112 12.2881C4.38225 12.3067 4.44886 12.3394 4.5071 12.3842C4.56535 12.429 4.61405 12.4849 4.65035 12.5488C4.68666 12.6127 4.70983 12.6832 4.7185 12.7561L5.1352 15.6717L5.91033 14.4317C5.95987 14.3524 6.02877 14.2871 6.11054 14.2418C6.1923 14.1964 6.28425 14.1727 6.37774 14.1727C6.47122 14.1727 6.56317 14.1964 6.64494 14.2418C6.7267 14.2871 6.7956 14.3524 6.84514 14.4317L7.62028 15.6717L8.03697 12.7561C8.04565 12.6832 8.06882 12.6127 8.10512 12.5488C8.14142 12.4849 8.19013 12.429 8.24837 12.3842C8.30661 12.3394 8.37322 12.3067 8.44427 12.2881C8.51533 12.2694 8.5894 12.2651 8.66213 12.2755C8.73486 12.2859 8.80478 12.3107 8.86779 12.3485C8.93079 12.3862 8.98561 12.4362 9.02901 12.4955C9.07242 12.5548 9.10353 12.6221 9.12054 12.6936C9.13754 12.7651 9.14008 12.8392 9.12802 12.9117L9.12833 12.9133ZM11.3388 17.2441C11.3388 17.3902 11.2807 17.5304 11.1773 17.6338C11.074 17.7372 10.9338 17.7952 10.7876 17.7952C10.6414 17.7952 10.5012 17.7372 10.3978 17.6338C10.2944 17.5304 10.2364 17.3902 10.2364 17.2441V12.8345C10.2364 12.6884 10.2944 12.5482 10.3978 12.4448C10.5012 12.3414 10.6414 12.2833 10.7876 12.2833C10.9338 12.2833 11.074 12.3414 11.1773 12.4448C11.2807 12.5482 11.3388 12.6884 11.3388 12.8345V17.2441ZM16.3782 17.2441C16.3782 17.3631 16.3396 17.479 16.2682 17.5743C16.1969 17.6696 16.0965 17.7392 15.9823 17.7728C15.868 17.8063 15.746 17.802 15.6344 17.7604C15.5229 17.7188 15.4278 17.6422 15.3634 17.542L13.5435 14.7111V17.2441C13.5435 17.3902 13.4854 17.5304 13.3821 17.6338C13.2787 17.7372 13.1385 17.7952 12.9923 17.7952C12.8461 17.7952 12.7059 17.7372 12.6026 17.6338C12.4992 17.5304 12.4411 17.3902 12.4411 17.2441V12.8345C12.4412 12.7155 12.4798 12.5996 12.5511 12.5043C12.6225 12.409 12.7228 12.3393 12.837 12.3058C12.9513 12.2723 13.0733 12.2766 13.1849 12.3182C13.2965 12.3598 13.3916 12.4364 13.456 12.5366L15.2758 15.3675V12.8345C15.2758 12.6884 15.3339 12.5482 15.4373 12.4448C15.5406 12.3414 15.6808 12.2833 15.827 12.2833C15.9732 12.2833 16.1134 12.3414 16.2168 12.4448C16.3201 12.5482 16.3782 12.6884 16.3782 12.8345V17.2441ZM13.009 2.86273C12.4301 2.66971 11.9041 2.34459 11.4726 1.9131C11.0411 1.4816 10.716 0.955593 10.523 0.376703C10.4864 0.266999 10.4162 0.171591 10.3224 0.103984C10.2285 0.0363782 10.1158 0 10.0002 0C9.8845 0 9.77178 0.0363782 9.67795 0.103984C9.58411 0.171591 9.51392 0.266999 9.47731 0.376703C9.28429 0.955593 8.95917 1.4816 8.52768 1.9131C8.09619 2.34459 7.57018 2.66971 6.99129 2.86273C6.88159 2.89934 6.78618 2.96953 6.71857 3.06336C6.65096 3.1572 6.61459 3.26992 6.61459 3.38557C6.61459 3.50122 6.65096 3.61394 6.71857 3.70778C6.78618 3.80161 6.88159 3.8718 6.99129 3.90841C7.57018 4.10143 8.09619 4.42655 8.52768 4.85804C8.95917 5.28953 9.28429 5.81554 9.47731 6.39443C9.51392 6.50414 9.58411 6.59955 9.67795 6.66715C9.77178 6.73476 9.8845 6.77114 10.0002 6.77114C10.1158 6.77114 10.2285 6.73476 10.3224 6.66715C10.4162 6.59955 10.4864 6.50414 10.523 6.39443C10.716 5.81554 11.0411 5.28953 11.4726 4.85804C11.9041 4.42655 12.4301 4.10143 13.009 3.90841C13.1187 3.8718 13.2141 3.80161 13.2817 3.70778C13.3493 3.61394 13.3857 3.50122 13.3857 3.38557C13.3857 3.26992 13.3493 3.1572 13.2817 3.06336C13.2141 2.96953 13.1187 2.89934 13.009 2.86273ZM4.85362 3.84132C4.81701 3.73162 4.74682 3.63621 4.65298 3.56861C4.55915 3.501 4.44643 3.46462 4.33078 3.46462C4.21512 3.46462 4.1024 3.501 4.00857 3.56861C3.91473 3.63621 3.84454 3.73162 3.80793 3.84132C3.66387 4.27356 3.42115 4.66631 3.09899 4.98847C2.77682 5.31063 2.38407 5.55336 1.95184 5.69742C1.84214 5.73403 1.74673 5.80422 1.67912 5.89805C1.61152 5.99188 1.57514 6.10461 1.57514 6.22026C1.57514 6.33591 1.61152 6.44863 1.67912 6.54247C1.74673 6.6363 1.84214 6.70649 1.95184 6.7431C2.38407 6.88716 2.77682 7.12989 3.09899 7.45205C3.42115 7.77421 3.66387 8.16696 3.80793 8.59919C3.84454 8.7089 3.91473 8.80431 4.00857 8.87191C4.1024 8.93952 4.21512 8.9759 4.33078 8.9759C4.44643 8.9759 4.55915 8.93952 4.65298 8.87191C4.74682 8.80431 4.81701 8.7089 4.85362 8.59919C4.99768 8.16696 5.2404 7.77421 5.56256 7.45205C5.88473 7.12989 6.27748 6.88716 6.70971 6.7431C6.81941 6.70649 6.91482 6.6363 6.98243 6.54247C7.05003 6.44863 7.08641 6.33591 7.08641 6.22026C7.08641 6.10461 7.05003 5.99188 6.98243 5.89805C6.91482 5.80422 6.81941 5.73403 6.70971 5.69742C6.27748 5.55336 5.88473 5.31063 5.56256 4.98847C5.2404 4.66631 4.99768 4.27356 4.85362 3.84132ZM18.0485 5.69742C17.6162 5.55336 17.2235 5.31063 16.9013 4.98847C16.5792 4.66631 16.3364 4.27356 16.1924 3.84132C16.1558 3.73162 16.0856 3.63621 15.9917 3.56861C15.8979 3.501 15.7852 3.46462 15.6695 3.46462C15.5539 3.46462 15.4412 3.501 15.3473 3.56861C15.2535 3.63621 15.1833 3.73162 15.1467 3.84132C15.0026 4.27356 14.7599 4.66631 14.4377 4.98847C14.1156 5.31063 13.7228 5.55336 13.2906 5.69742C13.1809 5.73403 13.0855 5.80422 13.0179 5.89805C12.9503 5.99188 12.9139 6.10461 12.9139 6.22026C12.9139 6.33591 12.9503 6.44863 13.0179 6.54247C13.0855 6.6363 13.1809 6.70649 13.2906 6.7431C13.7228 6.88716 14.1156 7.12989 14.4377 7.45205C14.7599 7.77421 15.0026 8.16696 15.1467 8.59919C15.1833 8.7089 15.2535 8.80431 15.3473 8.87191C15.4412 8.93952 15.5539 8.9759 15.6695 8.9759C15.7852 8.9759 15.8979 8.93952 15.9917 8.87191C16.0856 8.80431 16.1558 8.7089 16.1924 8.59919C16.3364 8.16696 16.5792 7.77421 16.9013 7.45205C17.2235 7.12989 17.6162 6.88716 18.0485 6.7431C18.1582 6.70649 18.2536 6.6363 18.3212 6.54247C18.3888 6.44863 18.4252 6.33591 18.4252 6.22026C18.4252 6.10461 18.3888 5.99188 18.3212 5.89805C18.2536 5.80422 18.1582 5.73403 18.0485 5.69742Z"
                            fill="white"
                          />
                        </svg>
                      </div>
                    </div>
                    <div className="dashboard_inner">
                      <div className="">
                        <div className="dashboard_icon">
                          <p>
                            {Number(winTotCount || 0).toLocaleString()}
                            <span>Pots</span>
                          </p>
                        </div>
                        <h3>{selectedLang.total_win}</h3>
                      </div>
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    marginBottom: "10px",
                    fontSize: "12px",
                    fontWeight: 600,
                    color: "#Fff",
                  }}
                >
                  <span style={{ color: "red" }}>*</span>{" "}
                  {selectedLang.warning_massage_1}
                  {selectedLang.warning_massage_2}
                </div>
                <div
                  className="row flex  justify-items-center flex-wrap z-index-10"
                  style={{ flexWrap: "wrap" }}
                >
                  <div
                    className="col-lg-2 col-md-4 col-sm-4 flex fap"
                    style={{ gap: "10px", width: "100%", flexWrap: "wrap" }}
                  >
                    <div className="datepikers newdate_picker">
                      {/* <div className="d-flex datebox_wrapper">
                      <Flatpickr
                        options={{
                          locale: selectedLang.calander,
                        }}
                        data-enable-time
                        value={startDate}
                        onChange={(date) => setStartDate(date)}
                      />
                      <div className="text-white"> - </div>
                      <Flatpickr
                        options={{
                          locale: selectedLang.calander,
                        }}
                        data-enable-time
                        value={endDate}
                        onChange={(date) => setEndDate(date)}
                      />
                    </div> */}
                      <DatePicker onDataFilter={onDataFilter} />
                    </div>
                    <div
                      className="flex threebox"
                      style={{ alignItems: "center", gap: "10px" }}
                    >
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
                      />{" "}
                      <FormControl className="datatextbox">
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
                                      data?.status !== false &&
                                      data?.vendor_name &&
                                      data?.vendor_name.trim() !== ""
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
                      </FormControl>{" "}
                      <FormControl className="datatextbox">
                        <Autocomplete
                          onChange={handleSelectChangeBetType}
                          className=""
                          variant="outlined"
                          disablePortal
                          size="small"
                          id="combo-box-demo"
                          options={[
                            // { label: `${selectedLang.loss}`, value: "LOSS" },
                            { label: `${selectedLang.win}`, value: "WIN" },
                            {
                              label: `${selectedLang.cancel}`,
                              value: "CANCEL",
                            },
                            {
                              label: `${selectedLang.Refund}`,
                              value: "REFUND",
                            },
                            {
                              label: `${selectedLang.Callback_Error}`,
                              value: "CALLBACK ERROR",
                            },
                          ]}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              className="textSearch"
                              label={selectedLang.bet_type}
                            />
                          )}
                        />
                      </FormControl>
                    </div>
                    {/* </FormControl> */}

                    <div
                      className="flex mflex"
                      style={{
                        minWidth: "130px",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      {/* <div>                
              <span style={{marginRight:"10px"}}>5 Min</span>
                <input  
                type="checkbox"
                style={{ transform: 'scale(1.5)', backgroundColor: 'grey', marginRight:'10px' }}
                checked={isChecked5min}
                onChange={hanldeChange5Min}
                />
                </div> */}

                      <FormControl
                        className="inputwrapper"
                        sx={{ minWidth: 160, margin: 0 }}
                        size="small"
                      >
                        <InputBase
                          sx={{
                            ml: 1,
                            flex: 1,
                            border: "1px solid #cdcfd3",
                            borderRadius: "4px",
                            marginLeft: "0px",
                            padding: "4px 10px",
                            marginRight: "0px",
                            fontSize: "12px",
                          }}
                          placeholder={selectedLang.agent_name}
                          value={agentName}
                          onChange={(e) => setAgentName(e.target.value)}
                          inputProps={{
                            "aria-label": selectedLang.casino_users,
                          }}
                        />
                      </FormControl>
                      <div
                        className="col-lg-2 col-md-4 col-sm-4"
                        style={{
                          minWidth: "130px",
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        <FormControl>
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
                            placeholder={selectedLang.casino_users}
                            value={casino_user}
                            onChange={(e) => setCasinoUser(e.target.value)}
                            inputProps={{
                              "aria-label": selectedLang.casino_users,
                            }}
                          />
                        </FormControl>
                      </div>
                      {/* {
                      userRole === "admin" ? 
                      <>
                    <div
                      className="col-lg-2 col-md-4 col-sm-4"
                      style={{
                        minWidth: "130px",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <FormControl>
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
                          placeholder={selectedLang.moneySync}
                          value={moneySync}
                          onChange={(e) => setMoneySync(e.target.value)}
                          inputProps={{
                            "aria-label": selectedLang.moneySync,
                          }}
                        />
                      </FormControl>
                    </div>
                      </>
                      :
                      <>
                      </>
                    } */}

                      {/* <div
                      className="col-lg-2 col-md-4 col-sm-4"
                      style={{ minWidth: "130px" }}
                    >
                      <FormControl>
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
                          placeholder={selectedLang.round_ID}
                          value={sround_id}
                          onChange={(e) => setRound_id(e.target.value)}
                          inputProps={{
                            "aria-label": selectedLang.casino_users,
                          }}
                        />
                      </FormControl>
                    </div> */}

                      <div
                        className="col-lg-2 col-md-4 col-sm-4"
                        style={{ minWidth: "130px" }}
                      >
                        <FormControl>
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
                              width: "217px",
                            }}
                            placeholder={
                              selectedLang.Round +
                              " / " +
                              selectedLang.transaction_id
                            }
                            value={transactionId}
                            onChange={(e) => setTransactionId(e.target.value)}
                            inputProps={{
                              "aria-label": selectedLang.transaction_id,
                            }}
                          />
                        </FormControl>
                      </div>
                    </div>
                    <div
                      className="flex"
                      style={{ alignItems: "center", gap: "10px" }}
                    >
                      <div className="flex item-center">
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

                      {role["role"] == "admin" && (
                        <CSVLink
                          data={csvData}
                          filename={"bet_history"}
                          headers={csvHeader}
                          className="download_tag"
                        >
                          <div
                            className="download_button"
                            style={{ width: "70px" }}
                          >
                            {selectedLang.Excel}
                          </div>
                        </CSVLink>
                      )}
                    </div>
                  </div>
                </div>
                <div>
                  <CardContent>
                    <TableContainer>
                      <Table aria-label="customized table">
                        <TableHead>
                          {selectedprovider == 1 && (
                            <TableRow>
                              {columns11.map((column) => (
                                <StyledTableCell
                                  sx={{
                                    textAlign: "center",
                                    cursor:
                                      column.id === "beforeMoney" ||
                                      column.id === "bet" ||
                                      column.id === "date" ||
                                      column.id === "beforeMoney_1" ||
                                      column.id == "afterMoney"
                                        ? "pointer"
                                        : "default",
                                  }}
                                  key={column.id}
                                  align={column.align}
                                  style={{ minWidth: column.minWidth }}
                                  onClick={() => handleSort(column.id)}
                                >
                                  {column.label}
                                  {column.id == "beforeMoney"
                                    ? getSortIconBeMo(sortOrder_befMo)
                                    : column.id == "bet"
                                    ? getSortIconBet(sortOrder_bet)
                                    : column.id == "date"
                                    ? getSortIconBet(sortOrder_date)
                                    : column.id == "beforeMoney_1"
                                    ? getSortIconBeMo1(sortOrder_befoMo_1)
                                    : column.id == "afterMoney"
                                    ? getSortIconAfMo(sortOrder_afMo)
                                    : ""}
                                </StyledTableCell>
                              ))}
                            </TableRow>
                          )}
                          {selectedprovider == 2 && (
                            <TableRow>
                              {columns12.map((column) => (
                                <StyledTableCell
                                  sx={{
                                    textAlign: "center",
                                    cursor:
                                      column.id === "beforeMoney" ||
                                      column.id === "bet" ||
                                      column.id === "date" ||
                                      column.id === "beforeMoney_1" ||
                                      column.id == "afterMoney"
                                        ? "pointer"
                                        : "default",
                                  }}
                                  key={column.id}
                                  align={column.align}
                                  style={{ minWidth: column.minWidth }}
                                  onClick={() => handleSort(column.id)}
                                >
                                  {column.label}
                                  {column.id == "beforeMoney"
                                    ? getSortIconBeMo(sortOrder_befMo)
                                    : column.id == "bet"
                                    ? getSortIconBet(sortOrder_bet)
                                    : column.id == "date"
                                    ? getSortIconBet(sortOrder_date)
                                    : column.id == "beforeMoney_1"
                                    ? getSortIconBeMo1(sortOrder_befoMo_1)
                                    : column.id == "afterMoney"
                                    ? getSortIconAfMo(sortOrder_afMo)
                                    : ""}
                                </StyledTableCell>
                              ))}
                            </TableRow>
                          )}
                        </TableHead>
                        {renderPayment()}
                      </Table>
                      {!betData1.length > 0 && !loading && (
                        <div
                          style={{
                            color: "#fff",
                            textAlign: "center",
                            padding: "1rem",
                          }}
                        >
                          {selectedLang.no_data_available_in_table}
                        </div>
                      )}
                      {loading && <FuseLoading />}
                    </TableContainer>
                    {role["role"] != "admin" ? (
                      <TablePagination
                        rowsPerPageOptions={[20, 50, 100, 200, 500]}
                        component="div"
                        count={tableCount}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                        labelRowsPerPage={selectedLang.rows_per_page}
                      />
                    ) : (
                      <TablePagination
                        rowsPerPageOptions={[20, 50, 100, 200, 500]}
                        component="div"
                        count={tableCount}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                        labelRowsPerPage={selectedLang.rows_per_page}
                      />
                    )}
                  </CardContent>
                </div>
              </Card>
              <Modal
                open={openFail}
                onClose={handleCloseFail}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
              >
                <Box sx={style} className="Mymodal">
                  <button className="modalclosebtn" onClick={handleCloseFail}>
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
                  <Typography
                    id="modal-modal-title"
                    variant="h6"
                    component="h2"
                    style={{
                      fontWeight: "700",
                      fontSize: "23px",
                      marginBottom: "20px",
                    }}
                  >
                    API Error Log
                  </Typography>
                  {loadFaillog ? (
                    <FuseLoading />
                  ) : failLog ? (
                    <TableContainer>
                      <Table aria-label="customized table">
                        <TableBody>
                          <StyledTableRow>
                            <StyledTableCell
                              align="left"
                              style={{ minWidth: "200px" }}
                            >
                              <p style={{ textAlign: "left" }}>Agent</p>
                            </StyledTableCell>
                            <StyledTableCell>
                              <p style={{ textAlign: "center" }}>{failLog?.id}</p>
                            </StyledTableCell>
                          </StyledTableRow>
                          {failLog?.user_id && (
                            <StyledTableRow>
                              <StyledTableCell
                                align="left"
                                style={{ minWidth: "200px" }}
                              >
                                <p style={{ textAlign: "left" }}>Casino User</p>
                              </StyledTableCell>
                              <StyledTableCell>
                                <p style={{ textAlign: "center" }}>
                                  {failLog?.user_id}
                                </p>
                              </StyledTableCell>
                            </StyledTableRow>
                          )}
                          {failLog?.url && (
                            <StyledTableRow>
                              <StyledTableCell
                                align="left"
                                style={{ minWidth: "200px" }}
                              >
                                <p style={{ textAlign: "left" }}>URL</p>
                              </StyledTableCell>
                              <StyledTableCell align="center">
                                <p style={{ textAlign: "center" }}>
                                  {failLog?.url}
                                </p>
                              </StyledTableCell>
                            </StyledTableRow>
                          )}
                          <StyledTableRow>
                            <StyledTableCell
                              align="left"
                              style={{ minWidth: "200px" }}
                            >
                              <p style={{ textAlign: "left" }}>Error Message</p>
                            </StyledTableCell>
                            <StyledTableCell align="center">
                              <p style={{ textAlign: "center" }}>
                                {failLog?.message}
                              </p>
                            </StyledTableCell>
                          </StyledTableRow>
                          <StyledTableRow>
                            <StyledTableCell
                              align="left"
                              style={{ minWidth: "200px" }}
                            >
                              <p style={{ textAlign: "left" }}>Error Code</p>
                            </StyledTableCell>
                            <StyledTableCell align="center">
                              <p style={{ textAlign: "center" }}>
                                {failLog?.error_code}
                              </p>
                            </StyledTableCell>
                          </StyledTableRow>
                          {failLog?.data && (
                            <StyledTableRow>
                              <StyledTableCell
                                align="left"
                                style={{ minWidth: "200px" }}
                              >
                                <p style={{ textAlign: "left" }}>Data</p>
                              </StyledTableCell>
                              <StyledTableCell align="center">
                              <div className="json_link_wrapper">
                                <Tooltip placement="top" title={JSON.stringify(failLog?.data, 2, null)}>
                                  <span className="json_link">
                                    {JSON.stringify(failLog?.data, 2, null)}
                                  </span>
                                </Tooltip>
                                <button type="button" onClick={() => handleJSONCopyClick(JSON.stringify(failLog?.data, 2, null))}>
                                  <svg width={20} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z" />
                                  </svg>
                                </button>
                              </div>
                              
                            </StyledTableCell>
                            </StyledTableRow>
                          )}
                          <StyledTableRow>
                            <StyledTableCell
                              align="left"
                              style={{ minWidth: "200px" }}
                            >
                              <p style={{ textAlign: "left" }}>Description</p>
                            </StyledTableCell>
                            <StyledTableCell align="center">
                              <p style={{ textAlign: "center" }}>
                                {failLog?.description}
                              </p>
                            </StyledTableCell>
                          </StyledTableRow>
                          <StyledTableRow>
                            <StyledTableCell
                              align="left"
                              style={{ minWidth: "200px" }}
                            >
                              <p style={{ textAlign: "left" }}>Create at</p>
                            </StyledTableCell>
                            <StyledTableCell align="center">
                              <p style={{ textAlign: "center" }}>
                                {formatLocalDateTime(failLog?.created_at)}
                              </p>
                            </StyledTableCell>
                          </StyledTableRow>
                        </TableBody>
                      </Table>
                    </TableContainer>
                  ) : (
                    <p style={{ color: "white" }}>
                      {selectedLang?.no_data_available_in_table}
                    </p>
                  )}
                </Box>
              </Modal>
            </>
          }
        />
      )}
    </>
  );
}

export default betHistoryApp;
