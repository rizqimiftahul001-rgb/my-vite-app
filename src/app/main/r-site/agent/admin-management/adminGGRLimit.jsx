/** @format */

import * as React from "react";
import FusePageSimple from "@fuse/core/FusePageSimple";
import TransactionHistoryHeader from "./adminGGRLimitHeader";
import { useDispatch, useSelector } from "react-redux";
import Typography from "@mui/material/Typography";
import { useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import { locale } from "../../../../configs/navigation-i18n";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { Autocomplete, Button } from "@mui/material";
import "./adminGGRLimit.css";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import Chip from "@mui/material/Chip";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import LinearProgress, {
  linearProgressClasses,
} from "@mui/material/LinearProgress";
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
import { Tooltip } from "@mui/material";
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
// import { DataGridPro } from '@mui/x-data-grid-pro';
import cloneDeep from "lodash/cloneDeep";
import axios from "axios";

import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import { useNavigate } from "react-router-dom";

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

function createData(name, calories, fat, carbs, protein, price) {
  return {
    name,
    calories,
    fat,
    carbs,
    protein,
    price,
    history: [
      {
        date: "2020-01-05",
        customerId: "11091700",
        amount: 3,
      },
      {
        date: "2020-01-02",
        customerId: "Anonymous",
        amount: 1,
      },
    ],
  };
}

function Row(props) {
  const { row } = props;
  const [open, setOpen] = React.useState(false);



  function LinearProgressWithLabel(props) {
    return (
      <Box sx={{ display: "flex", alignItems: "center" }} key={props?.key}>
        <Box sx={{ width: "100%", mr: 1 }}>
          <LinearProgress variant="determinate" {...props} />
        </Box>
        <Box sx={{ minWidth: 0 }}>
          <Typography
            variant="body2"
            sx={{ fontSize: "13px", fontWeight: "600" }}
            color="text.secondary">{`${Math.round(props.value)}%`}</Typography>
        </Box>
      </Box>
    );
  }

  const navigate = useNavigate();

  return (
    <React.Fragment>
      <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}>
            {row?.histories.length > 0 ? (
              open ? (
                <KeyboardArrowUpIcon />
              ) : (
                <KeyboardArrowDownIcon />
              )
            ) : (
              ""
            )}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          <RemoveRedEyeIcon
            onClick={() => {
              navigate(`/agent/balance-limits/${row.data?.operator}`);
            }}
            style={{ cursor: "pointer" }}
          />{" "}
          {row.data?.operator}{" "}
        </TableCell>
        <TableCell component="th" scope="row">
          {" "}
        </TableCell>
        <TableCell component="th" scope="row">
          {" "}
        </TableCell>

        <TableCell component="th" scope="row">
          {" "}
          {row.data?.available_balance}{" "}
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Table size="small" aria-label="purchases">
                <TableBody>
                  {row?.histories.map((historyRow, key) => (
                    <TableRow key={key}>
                      <TableCell
                        sx={{
                          textAlign: "center",
                        }}>
                        {historyRow?.operator}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

function AdminGGRLimitApp() {
  const todayDate = new Date();
  todayDate.setDate(todayDate.getDate() + 1);
  todayDate.setHours(0, 0, 0, 0);
  const threeDaysAgo = new Date(todayDate);
  threeDaysAgo.setDate(todayDate.getDate() - 3);
  const [status, setType] = useState("");
  const [agentFilterValue, setAgentName] = useState("");
  const [betData2, setBetData2] = useState();
  const [agentList, setAgentList] = useState([]);
  const role = jwtDecode(DataHandler.getFromSession("accessToken"))["data"];
  const user_id = DataHandler.getFromSession("user_id");
  const payment_type = "Sub Agent Deposit";
  const [selectLocale] = useSelector((state) => [state.locale.selectLocale]);
  const [selectedLang, setSelectedLang] = useState(locale.en);
  const [loaded, setLoaded] = useState(true);
  const [loading1, setLoading1] = useState(false);
  const [sumArray, setSumArray] = useState();

  useEffect(() => {
    if (loading1 == false) {
      setLoaded(false);
    }
  }, [loading1]);

  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  useEffect(() => {
    if (selectLocale == "ko") {
      setSelectedLang(locale.ko);
    } else {
      setSelectedLang(locale.en);
    }
  }, [selectLocale]);
  // GGR LIMIT

  const userColumnGGRLimit = [
    { id: "name", label: `${selectedLang.Req_ID}`, minWidth: 50 },
    {
      id: "enabled",
      label: `${selectedLang.enabled}`,
      minWidth: 170,
    },
    {
      id: "GGR usege limit",
      label: `${selectedLang.GGRUSEGELIMIT}`,
      minWidth: 100,
    },
    {
      id: "GGR usege limit left",
      label: `${selectedLang.GGRusegelimitLeft}`,
      minWidth: 100,
    },
    {
      id: "limit_exceeded",
      label: `${selectedLang.limit_exceeded}`,
      minWidth: 100,
    },
  ];

  const [operatorId, setOperatorId] = useState("");

  const handleChangeOperatorId = (event, newValue) => {
    // const newValue = event.target.value;
    setOperatorId(newValue?.value || "");
  };

  const [ggrLimitData, _ggrLimitData] = useState([]);

  const makeApiCall = async (operator) => {
    const apiUrl = `${process.env.REACT_APP_R_SITE_API}/generic/ggrLimits_balance?operator_id=${operator}`;

    const token = "a86206ed-2141-4052-94e3-f23a092d17ab";

    try {
      const response = await axios.post(
        apiUrl,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      const responseData = response.data?.data?.data;
      if (operatorId == "") {
        if (responseData) {
          const result = {
            operator: operator,
            data: {
              ...responseData,
              operator: operator,
            },
          };
          _ggrLimitData((prevData) => [...prevData, result]);
        }
      } else {
        const result = {
          operator: operator,
          data: {
            ...responseData,
            operator: operator,
          },
        };

        // Reset the existing state by passing an array containing only the new result
        _ggrLimitData([result]);
      }
    } catch (error) {
      console.error(`Error for operator ID ${operatorId}:`, error);
      // Handle errors here
    }
  };

  const fetchGGRBetLimit = () => {
    if (operatorId == "") {
      const operatorIds = [
        "sk1_evo",
        "sk2_evo",
        "sk3_evo",
        "sk4_evo",
        "sk_rest_as",
      ];
      operatorIds.forEach((operatorId) => {
        makeApiCall(operatorId);
      });
    } else {
      makeApiCall(operatorId);
    }
  };

  const [treeviewData, setTreeviewData] = useState([]);

  // useEffect(() => {
  // 	if (ggrLimitData.length === 5) {
  // 		// Create an object to store the treeviewData
  // 		const treeviewObj = {};

  // 		// Iterate through ggrLimitData to populate the treeviewData object
  // 		ggrLimitData.forEach((item) => {
  // 			const operator = item.operator;
  // 			const data = item.data;

  // 			// Extract the second part of the operator (e.g., "sk1_evo" -> "evo")
  // 			const operatorPart = operator.split('_')[1];

  // 			// If the operator part is "evo," add it to the histories array of sk1_evo
  // 			if (operatorPart === 'evo') {
  // 				const evoOperator = 'sk1_evo';
  // 				if (!treeviewObj[evoOperator]) {
  // 					treeviewObj[evoOperator] = {
  // 						data,
  // 						histories: [],
  // 					};
  // 				} else {
  // 					if (operator != 'sk1_evo') {
  // 						treeviewObj[evoOperator].histories.push(data);
  // 					}
  // 				}
  // 			} else {
  // 				// If it's not "evo," create a new entry
  // 				treeviewObj[operator] = {
  // 					data,
  // 					histories: [],
  // 				};
  // 			}
  // 		});

  // 		// Convert the object to an array and update the state
  // 		const treeviewDataArray = Object.values(treeviewObj);
  // 		setTreeviewData(treeviewDataArray);
  // 	} else if (operatorId != '') {
  // 		// Create an object to store the treeviewData
  // 		const treeviewObj = {};

  // 		// Iterate through ggrLimitData to populate the treeviewData object
  // 		ggrLimitData.forEach((item) => {
  // 			const operator = item.operator;
  // 			const data = item.data;

  // 			// Extract the second part of the operator (e.g., "sk1_evo" -> "evo")
  // 			const operatorPart = operator.split('_')[1];

  // 			// If the operator part is "evo," add it to the histories array of sk1_evo
  // 			if (operatorPart === 'evo') {
  // 				const evoOperator = 'sk1_evo';
  // 				if (!treeviewObj[evoOperator]) {
  // 					treeviewObj[evoOperator] = {
  // 						data,
  // 						histories: [],
  // 					};
  // 				} else {
  // 					if (operator != 'sk1_evo') {
  // 						treeviewObj[evoOperator].histories.push(data);
  // 					}
  // 				}
  // 			} else {
  // 				// If it's not "evo," create a new entry
  // 				treeviewObj[operator] = {
  // 					data,
  // 					histories: [],
  // 				};
  // 			}
  // 		});

  // 		// Convert the object to an array and update the state
  // 		const treeviewDataArray = Object.values(treeviewObj);
  // 		setTreeviewData(treeviewDataArray);
  // 	}
  // }, [ggrLimitData]);

  // useEffect(() => {
  // 	const operatorIds = [
  // 		'sk1_evo',
  // 		'sk2_evo',
  // 		'sk3_evo',
  // 		'sk4_evo',
  // 		'sk_rest_as',
  // 	];
  // 	operatorIds.forEach((operatorId) => {
  // 		makeApiCall(operatorId);
  // 	});

  // 	// fetchGGRBetLimit()
  // }, []);

  const getGGRAPI = () => {
    APIService({
      url: `${process.env.REACT_APP_R_SITE_API}/user/get_ggr_limit?operator_id=${operatorId}`,
      method: "GET",
    })
      .then((data) => {
        // _ggrLimitData(data?.data?.data)
        const treeviewObj = {};

        // Iterate through ggrLimitData to populate the treeviewData object
        data?.data?.data.forEach((item) => {
          const operator = item.operator_id;
          const data = item.ggr;

          // Extract the second part of the operator (e.g., "sk1_evo" -> "evo")
          const operatorPart = operator.split("_")[1];

          // If the operator part is "evo," add it to the histories array of sk1_evo
          if (operatorPart === "evo") {
            const evoOperator = "sk1_evo";
            if (!treeviewObj[evoOperator]) {
              treeviewObj[evoOperator] = {
                data,
                histories: [],
              };
            } else {
              if (operator != "sk1_evo") {
                treeviewObj[evoOperator].histories.push(data);
              }
            }
          } else {
            // If it's not "evo," create a new entry
            treeviewObj[operator] = {
              data,
              histories: [],
            };
          }
        });
        const treeviewDataArray = Object.values(treeviewObj);
        setTreeviewData(treeviewDataArray);
      })
      .catch((err) => {
        // dispatch(
        // 	showMessage({
        // 		variant: 'error',
        // 		message: `${
        // 			selectedLang.something_went_wrong
        // 		}`,
        // 	})
        // );
      })
      .finally(() => { });
  };

  useEffect(() => {
    getGGRAPI();
  }, []);

  // END GGR LIMIT

  const [filterCurr, _filterCurr] = useState("");
  const handleChangeCurrency = (value, newValue) => {
    _filterCurr(newValue?.value);
  };

  const handleClearFilter = () => {
    setOperatorId("");
    _filterCurr("");
  };

  const handleSearchGGRLimit = () => {
    _ggrLimitData([]);
    getGGRAPI();
  };

  return (
    <>
      {" "}
      {loaded ? (
        <FuseLoading />
      ) : (
        <FusePageSimple
          header={<TransactionHistoryHeader selectedLang={selectedLang} />}
          content={
            <Card
              sx={{ width: "100%", marginTop: "20px", borderRadius: "4px" }}
              className="main_card">
              <div
                className="flex justify-start justify-between bg-gray p-16 w-100"
                style={{ display: "none" }}>
                <div className="flex justify-start items-center">
                  <span className="list-title">
                    {selectedLang.Agent_listofAdmin}
                  </span>
                </div>
              </div>
              <div className="row flex justify-end justify-items-center">
                <div
                  className="flex threebox"
                  style={{
                    alignItems: "center",
                    gap: "10px",
                  }}>
                  <div className="container fixwidth">
                    <Autocomplete
                      onChange={handleChangeCurrency}
                      value={filterCurr || null}
                      sx={{
                        width: "150px",
                      }}
                      className=""
                      variant="outlined"
                      disablePortal
                      size="small"
                      id="combo-box-demo"
                      options={[
                        { label: `${selectedLang.all}`, value: "All" },
                        { label: `EUR`, value: "EUR" },
                      ]}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          className="textSearch"
                          label={`${selectedLang.currency}`}
                        />
                      )}
                    />
                  </div>

                  <div className="container fixwidth">
                    <Autocomplete
                      value={operatorId || null}
                      onChange={handleChangeOperatorId}
                      sx={{
                        width: "150px",
                      }}
                      className=""
                      variant="outlined"
                      disablePortal
                      size="small"
                      id="combo-box-demo"
                      options={[
                        { label: `${selectedLang.all}`, value: "All" },
                        { label: `sk1_evo`, value: "sk1_evo" },
                        { label: `sk2_evo`, value: "sk2_evo" },
                        { label: `sk3_evo`, value: "sk3_evo" },
                        { label: `sk4_evo`, value: "sk4_evo" },
                        { label: `sk_rest_as`, value: "sk_rest_as" },
                      ]}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          className="textSearch"
                          label={`${selectedLang.operater_id}`}
                        />
                      )}
                    />
                  </div>

                  <div className="col-lg-2 col-md-4 col-sm-4 flex item-center">
                    <Button
                      className="flex item-center"
                      variant="contained"
                      color="secondary"
                      endIcon={<SearchIcon size={20}></SearchIcon>}
                      sx={{
                        borderRadius: "4px",
                      }}
                      onClick={handleSearchGGRLimit}>
                      {selectedLang.Apply_Filter}
                    </Button>
                  </div>

                  <div className="col-lg-2 col-md-3 col-sm-4 flex item-center">
                    <Button
                      className="flex item-center"
                      variant="contained"
                      color="secondary"
                      // endIcon={}
                      sx={{
                        borderRadius: "4px",
                      }}
                      onClick={handleClearFilter}>
                      {selectedLang.Clear_Filter}
                    </Button>
                  </div>
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
                    <>
                      <TableContainer>
                        <Table className="withouthoverTable" aria-label="collapsible table">
                          <TableHead>
                            <TableRow>
                              <TableCell />
                              <TableCell>
                                {selectedLang.casino_entity}
                              </TableCell>
                              <TableCell align="right">{""}</TableCell>
                              <TableCell align="right">{""}</TableCell>
                              <TableCell align="left">
                                {selectedLang.available_balance}
                              </TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {treeviewData.map((row, key) => (
                              <Row key={key} row={row} />
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </>
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

export default AdminGGRLimitApp;
