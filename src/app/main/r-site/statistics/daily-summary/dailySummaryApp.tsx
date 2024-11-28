import React, { useEffect, useState } from "react";
import FusePageSimple from "@fuse/core/FusePageSimple";
import { useSelector } from "react-redux";
import { locale } from "../../../../configs/navigation-i18n";
import Card from "@mui/material/Card";
import FuseLoading from "@fuse/core/FuseLoading/FuseLoading";
import DailySummaryHeader from "./dailySummaryHeader";
import { MenuItem, Select } from "@mui/material";
import { IconButton, Button, Typography } from "@mui/material";
import { ArrowBack, ArrowForward } from "@mui/icons-material";
import { makeStyles } from "@mui/styles";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";

import "./dailySummary.css";

const useStyles = makeStyles((theme) => ({
  buttonContainer: {
    display: "flex",
    alignItems: "center",
    width: "fit-content",
  },
  button: {
    borderRadius: 0,
    backgroundColor: "gray",
    "&:hover": {
      backgroundColor: "lightgray",
    },
  },
  firstButton: {
    marginRight: 0,
  },
  secondButton: {
    marginLeft: 0,
  },
}));

function DailySummaryApp() {
  const classes = useStyles();
  const [selectLocale] = useSelector((state) => [state.locale.selectLocale]);
  const [selectedLang, setSelectedLang] = useState(locale.ko);
  const [loaded, setLoaded] = useState(false);
  const [selectedItem, setSelectedItem] = useState("");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [page, setPage] = useState(0); // Define page state
  const [rowsPerPage, setRowsPerPage] = useState(10); // Define rowsPerPage state

  useEffect(() => {
    if (selectLocale === "ko") {
      setSelectedLang(locale.ko);
    } else {
      setSelectedLang(locale.en);
    }
  }, [selectLocale]);

  const handleDropdownChange = (event) => {
    setSelectedItem(event.target.value);
  };

  const handlePrevDate = () => {
    const prevDate = new Date(currentDate);
    prevDate.setDate(prevDate.getDate() - 1);
    setCurrentDate(prevDate);
  };

  const handleNextDate = () => {
    const nextDate = new Date(currentDate);
    nextDate.setDate(nextDate.getDate() + 1);
    setCurrentDate(nextDate);
  };

  const handleChangePage = (newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  interface Column {
    id: "name" | "population" | "size" | "density";
    label: string;
    minWidth?: number;
    align?: "right";
    format?: (value: number) => string;
  }

  const columns: Column[] = [
    { id: "", label: "", minWidth: 100 },
    {
      id: "population",
      label: "",
      minWidth: 100,
      align: "right",
      format: (value: number) => value.toLocaleString("en-US"),
    },
    {
      id: "population",
      label: "",
      minWidth: 100,
      align: "right",
      format: (value: number) => value.toLocaleString("en-US"),
    },
    {
      id: "population",
      label: "",
      minWidth: 100,
      align: "right",
      format: (value: number) => value.toLocaleString("en-US"),
    },
    {
      id: "population",
      label: "",
      minWidth: 100,
      align: "right",
      format: (value: number) => value.toLocaleString("en-US"),
    },
    {
      id: "Participating users",
      label: "Participating users",
      minWidth: 100,
      align: "right",
      format: (value: number) => value.toLocaleString("en-US"),
    },
    {
      id: "Administrator->OP Payment",
      label: "Administrator->OP Payment",
      minWidth: 100,
      align: "right",
      format: (value: number) => value.toLocaleString("en-US"),
    },
    {
      id: "Administrator<-OP withdraw",
      label: "Administrator<-OP withdraw",
      minWidth: 100,
      align: "right",
      format: (value: number) => value.toFixed(2),
    },
    {
      id: "bet",
      label: "bet",
      minWidth: 100,
      align: "right",
      format: (value: number) => value.toLocaleString("en-US"),
    },
    {
      id: "size",
      label: "Bet failure/refund",
      minWidth: 100,
      align: "right",
      format: (value: number) => value.toLocaleString("en-US"),
    },
    {
      id: "dwinning",
      label: "winning",
      minWidth: 100,
      align: "right",
      format: (value: number) => value.toFixed(2),
    },
  ];

  const columns1: Column[] = [
    { id: "ranking1", label: "Ranking", minWidth: 130 },
    {
      id: "sumUpBettingMoney",
      label: "Sum up betting money",
      minWidth: 100,
      align: "right",
    },
    {
      id: "numberOfBets",
      label: "Number of bets",
      minWidth: 100,
      align: "right",
    },
    { id: "userID1", label: "User ID ", minWidth: 100, align: "right" },
  ];

  const columns2: Column[] = [
    { id: "ranking2", label: "Ranking", minWidth: 130 },
    {
      id: "rewardsSummation",
      label: "Rewards summation",
      minWidth: 100,
      align: "right",
    },
    {
      id: "numberOfRewards",
      label: "Number of Rewards",
      minWidth: 100,
      align: "right",
    },
    { id: "userID2", label: "User ID ", minWidth: 100, align: "right" },
  ];

  const columns3: Column[] = [
    { id: "ranking3", label: "Ranking", minWidth: 130 },
    { id: "amount", label: "Amount", minWidth: 100, align: "right" },
    { id: "userID3", label: "User ID ", minWidth: 100, align: "right" },
    { id: "operator", label: "Operator", minWidth: 100, align: "right" },
  ];

  const columns4: Column[] = [
    { id: "ranking4", label: "Ranking", minWidth: 170 },
    {
      id: "Gamecompanyname",
      label: "Game company name",
      minWidth: 100,
      align: "right",
    },
    {
      id: "Numberofbets",
      label: "Number of bets ",
      minWidth: 100,
      align: "right",
    },
  ];

  const columns5: Column[] = [
    { id: "ranking5", label: "Ranking", minWidth: 170 },
    { id: "Gamename", label: "Game name", minWidth: 100, align: "right" },
    {
      id: "Gamecompanyname1",
      label: "Game company name",
      minWidth: 100,
      align: "right",
    },
    {
      id: "Numberofbets1",
      label: "Number of bets ",
      minWidth: 100,
      align: "right",
    },
  ];

  const columns6: Column[] = [
    { id: "ranking4", label: "Ranking", minWidth: 170 },
    {
      id: "Gamecompanyname",
      label: "Game company name",
      minWidth: 100,
      align: "right",
    },
    {
      id: "Numberofbets",
      label: "Number of bets ",
      minWidth: 100,
      align: "right",
    },
  ];

  const columns7: Column[] = [
    { id: "ranking5", label: "Ranking", minWidth: 170 },
    { id: "Gamename", label: "Game name", minWidth: 100, align: "right" },
    {
      id: "Gamecompanyname1",
      label: "Game company name",
      minWidth: 100,
      align: "right",
    },
    {
      id: "Numberofbets1",
      label: "Number of bets ",
      minWidth: 100,
      align: "right",
    },
  ];

  interface Data {
    name: string;
    population: number;
    size: number;
    density: number;
  }

  function createData(name: string, population: number, size: number): Data {
    const density = population / size;
    return { name, population, size, density };
  }

  const rows = [
    createData("India", 1324171354, 3287263),
    createData("China", 1403500365, 9596961),
    createData("Italy", 60483973, 301340),
    createData("United States", 327167434, 9833520),
    createData("Canada", 37602103, 9984670),
    createData("Australia", 25475400, 7692024),
    createData("Germany", 83019200, 357578),
    createData("Ireland", 4857000, 70273),
    createData("Mexico", 126577691, 1972550),
    createData("Japan", 126317000, 377973),
    createData("France", 67022000, 640679),
    createData("United Kingdom", 67545757, 242495),
    createData("Russia", 146793744, 17098246),
    createData("Nigeria", 200962417, 923768),
    createData("Brazil", 210147125, 8515767),
  ];

  return (
    <>
      {loaded ? (
        <FuseLoading />
      ) : (
        <FusePageSimple
          header={<DailySummaryHeader selectedLang={selectedLang} />}
          content={
            <>
              <Card
                sx={{
                  width: "100%",
                  marginTop: "20px",
                  borderRadius: "4px",
                }}
                className="main_card"
              >
                <div className="flex flex-wrap justify-between items-center p-16">
                  <div>
                    <h3 className="bold-heading">Operator</h3>
                  </div>

                  <div className="flex-container">
                    <Select
                      value={selectedItem}
                      onChange={handleDropdownChange}
                      displayEmpty
                      inputProps={{ "aria-label": "kingpot (킹팟)" }}
                      sx={{
                        fontSize: "1.2rem", // Change font size as needed
                      }}
                    >
                      <MenuItem value="">kingpot (킹팟)</MenuItem>
                    </Select>
                    <div className="ui-action-input-container">
                      <div className={classes.buttonContainer}>
                        <Button
                          variant="contained"
                          color="primary"
                          startIcon={<ArrowBack />}
                          onClick={handlePrevDate}
                          className={classes.button}
                        ></Button>
                        <Button
                          variant="contained"
                          color="primary"
                          startIcon={<ArrowForward />}
                          onClick={handleNextDate}
                          className={classes.button}
                        ></Button>
                      </div>
                      <div className="datepick">
                        <input
                          type="date"
                          lang="en"
                          name="base_dt"
                          id="base_dt"
                          value={currentDate.toISOString().split("T")[0]}
                          onChange={(e) =>
                            setCurrentDate(new Date(e.target.value))
                          }
                        />
                        <div
                          className="ui compact selection rowCount dropdown"
                          tabindex="0"
                        >
                          <select>
                            <option value="10">10 row</option>
                            <option value="50">50 row</option>
                            <option value="100">100 row</option>
                          </select>
                          <i className="dropdown icon"></i>
                          <div className="menu transition hidden" tabindex="-1">
                            <div
                              className="item active selected"
                              data-value="10"
                            >
                              10 row
                            </div>
                            <div className="item" data-value="50">
                              50 row
                            </div>
                            <div className="item" data-value="100">
                              100 row
                            </div>
                          </div>
                        </div>
                        <button className="ui button" fdprocessedid="0c73">
                          search
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap justify-between items-center p-16">
                  <h3 className="heading-with-border">
                    Operator R-money Details Overview (last update : 2024-04-09
                    19:36:53 )
                  </h3>
                </div>
                <div className="flex flex-wrap justify-between items-center p-12">
                  <Paper sx={{ width: "100%" }}>
                    <TableContainer
                      sx={{
                        maxHeight: 440,
                        borderRadius: "4px",
                        border: "1px solid #e0e0e0",
                        overflowX: "auto",
                      }}
                    >
                      <Table stickyHeader aria-label="sticky table">
                        <TableHead>
                          <TableRow>
                            <TableCell
                              align="center"
                              rowSpan={2}
                              style={{ border: "1px solid #e0e0e0" }}
                            >
                              Date
                            </TableCell>
                            <TableCell
                              align="center"
                              rowSpan={2}
                              style={{ border: "1px solid #e0e0e0" }}
                            >
                              operator
                            </TableCell>
                            <TableCell
                              align="center"
                              rowSpan={2}
                              style={{ border: "1px solid #e0e0e0" }}
                            >
                              UseR (count)
                            </TableCell>
                            <TableCell
                              align="center"
                              rowSpan={2}
                              style={{ border: "1px solid #e0e0e0" }}
                            >
                              Start R-money
                            </TableCell>
                            <TableCell
                              align="center"
                              rowSpan={2}
                              style={{ border: "1px solid #e0e0e0" }}
                            >
                              End R-money
                            </TableCell>
                            <TableCell
                              align="center"
                              colSpan={6}
                              style={{ border: "1px solid #e0e0e0" }}
                            >
                              R-money Overview
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            {columns.slice(5).map((column, index) => (
                              <TableCell
                                key={index}
                                align={column.align}
                                className="table-cell"
                                style={{
                                  top: 57,
                                  border: "1px solid #e0e0e0",
                                  borderRadius: "4px",
                                }}
                              >
                                {column.label}
                              </TableCell>
                            ))}
                          </TableRow>
                        </TableHead>

                        <TableBody>
                          {rows
                            .slice(
                              page * rowsPerPage,
                              page * rowsPerPage + rowsPerPage
                            )
                            .map((row) => {
                              return (
                                <TableRow
                                  hover
                                  role="checkbox"
                                  tabIndex={-1}
                                  key={row.code}
                                  style={{
                                    border: "1px solid #e0e0e0",
                                    borderRadius: "4px",
                                  }}
                                >
                                  {columns.map((column) => {
                                    const value = row[column.id];
                                    return (
                                      <TableCell
                                        key={column.id}
                                        align={column.align}
                                        style={{
                                          border: "1px solid #e0e0e0",
                                          borderRadius: "4px",
                                        }}
                                      >
                                        {column.format &&
                                        typeof value === "number"
                                          ? column.format(value)
                                          : value}
                                      </TableCell>
                                    );
                                  })}
                                </TableRow>
                              );
                            })}
                        </TableBody>
                      </Table>
                    </TableContainer>

                    <div
                      className={`flex flex-wrap justify-between items-center p-16 buttonContainer`}
                    >
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleChangePage(page - 1)}
                        className={`${classes.button} ${classes.firstButton} beforeButton`}
                      >
                        Before
                      </Button>
                      <Typography variant="body1" className="blueBackground">
                        {page + 1}
                      </Typography>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleChangePage(page + 1)}
                        className={`${classes.button} ${classes.secondButton} afterButton`}
                      >
                        Next
                      </Button>
                    </div>
                  </Paper>
                  <div className="flex flex-wrap justify-between items-center p-16">
                    <div className="custom-div">
                      <ul>
                        <li>
                          The previous day's data is finalized within 01:00
                          every morning.
                        </li>
                        <li>
                          Daily data is updated at maximum intervals of 30
                          minutes.
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap justify-between items-center p-16">
                  <h3 className="heading-with-border2">TOP 10</h3>
                </div>

                <div className="table2">
                  <div className="flex flex-wrap justify-between items-center p-16">
                    <Paper sx={{ width: "100%" }}>
                      <TableContainer
                        sx={{
                          borderRadius: "4px",
                          border: "1px solid #e0e0e0",
                          OverflowX: "unset",
                        }}
                      >
                        <Table stickyHeader aria-label="sticky table">
                          <TableHead>
                            <TableRow>
                              <TableCell
                                align="center"
                                colSpan={4}
                                style={{
                                  border: "1px solid #e0e0e0",
                                  borderTop: "4px solid #F2711C",
                                  textAlign: "center",
                                }}
                              >
                                <Typography variant="body1">
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                    className="w-12 h-12 inline-flex"
                                    style={{
                                      fontWeight: "bold",
                                      color: "black",
                                      marginRight: "5px",
                                    }}
                                  >
                                    <path
                                      fillRule="evenodd"
                                      d="M4.5 5.653c0-1.427 1.529-2.33 2.779-1.643l11.54 6.347c1.295.712 1.295 2.573 0 3.286L7.28 19.99c-1.25.687-2.779-.217-2.779-1.643V5.653Z"
                                      clipRule="evenodd"
                                    />
                                  </svg>
                                  Top daily bets
                                </Typography>
                              </TableCell>
                            </TableRow>
                            <TableRow>
                              {columns1.slice(0).map((column, index) => (
                                <TableCell
                                  key={index}
                                  align={column.align}
                                  className="table-cell"
                                  style={{
                                    top: 57,
                                    border: "1px solid #e0e0e0",
                                    borderRadius: "4px",
                                    textAlign: "center",
                                  }}
                                >
                                  {column.label}
                                </TableCell>
                              ))}
                            </TableRow>
                          </TableHead>

                          <TableBody>
                            {rows
                              .slice(
                                page * rowsPerPage,
                                page * rowsPerPage + rowsPerPage
                              )
                              .map((row) => {
                                return (
                                  <TableRow
                                    hover
                                    role="checkbox"
                                    tabIndex={-1}
                                    key={row.code}
                                    style={{
                                      border: "1px solid #e0e0e0",
                                      borderRadius: "4px",
                                    }}
                                  >
                                    {columns1.map((column) => {
                                      // Changed to columns1
                                      const value = row[column.id];
                                      return (
                                        <TableCell
                                          key={column.id}
                                          align={column.align}
                                          style={{
                                            border: "1px solid #e0e0e0",
                                            borderRadius: "4px",
                                          }}
                                        >
                                          {column.format &&
                                          typeof value === "number"
                                            ? column.format(value)
                                            : value}
                                        </TableCell>
                                      );
                                    })}
                                  </TableRow>
                                );
                              })}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </Paper>
                  </div>

                  <div className="flex flex-wrap justify-between items-center p-16">
                    <Paper sx={{ width: "100%" }}>
                      <TableContainer
                        sx={{
                          borderRadius: "4px",
                          border: "1px solid #e0e0e0",
                          OverflowX: "unset",
                        }}
                      >
                        <Table stickyHeader aria-label="sticky table">
                          <TableHead>
                            <TableRow>
                              <TableCell
                                align="center"
                                colSpan={4}
                                style={{
                                  border: "1px solid #e0e0e0",
                                  borderTop: "4px solid #F2711C",
                                  textAlign: "center",
                                }}
                              >
                                <Typography variant="body1">
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                    className="w-14 h-14 inline-flex"
                                    style={{
                                      fontWeight: "bold",
                                      color: "black",
                                      marginRight: "5px",
                                    }}
                                  >
                                    <path d="M10.464 8.746c.227-.18.497-.311.786-.394v2.795a2.252 2.252 0 0 1-.786-.393c-.394-.313-.546-.681-.546-1.004 0-.323.152-.691.546-1.004ZM12.75 15.662v-2.824c.347.085.664.228.921.421.427.32.579.686.579.991 0 .305-.152.671-.579.991a2.534 2.534 0 0 1-.921.42Z" />
                                    <path
                                      fillRule="evenodd"
                                      d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 6a.75.75 0 0 0-1.5 0v.816a3.836 3.836 0 0 0-1.72.756c-.712.566-1.112 1.35-1.112 2.178 0 .829.4 1.612 1.113 2.178.502.4 1.102.647 1.719.756v2.978a2.536 2.536 0 0 1-.921-.421l-.879-.66a.75.75 0 0 0-.9 1.2l.879.66c.533.4 1.169.645 1.821.75V18a.75.75 0 0 0 1.5 0v-.81a4.124 4.124 0 0 0 1.821-.749c.745-.559 1.179-1.344 1.179-2.191 0-.847-.434-1.632-1.179-2.191a4.122 4.122 0 0 0-1.821-.75V8.354c.29.082.559.213.786.393l.415.33a.75.75 0 0 0 .933-1.175l-.415-.33a3.836 3.836 0 0 0-1.719-.755V6Z"
                                      clipRule="evenodd"
                                    />
                                  </svg>
                                  Top daily Rewards
                                </Typography>
                              </TableCell>
                            </TableRow>
                            <TableRow>
                              {columns2.slice(0).map((column, index) => (
                                <TableCell
                                  key={index}
                                  align={column.align}
                                  className="table-cell"
                                  style={{
                                    top: 57,
                                    border: "1px solid #e0e0e0",
                                    borderRadius: "4px",
                                    textAlign: "center",
                                  }}
                                >
                                  {column.label}
                                </TableCell>
                              ))}
                            </TableRow>
                          </TableHead>

                          <TableBody>
                            {rows
                              .slice(
                                page * rowsPerPage,
                                page * rowsPerPage + rowsPerPage
                              )
                              .map((row) => {
                                return (
                                  <TableRow
                                    hover
                                    role="checkbox"
                                    tabIndex={-1}
                                    key={row.code}
                                    style={{
                                      border: "1px solid #e0e0e0",
                                      borderRadius: "4px",
                                    }}
                                  >
                                    {columns2.map((column) => {
                                      // Changed to columns1
                                      const value = row[column.id];
                                      return (
                                        <TableCell
                                          key={column.id}
                                          align={column.align}
                                          style={{
                                            border: "1px solid #e0e0e0",
                                            borderRadius: "4px",
                                          }}
                                        >
                                          {column.format &&
                                          typeof value === "number"
                                            ? column.format(value)
                                            : value}
                                        </TableCell>
                                      );
                                    })}
                                  </TableRow>
                                );
                              })}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </Paper>
                  </div>

                  <div className="flex flex-wrap justify-between items-center p-16">
                    <Paper sx={{ width: "100%" }}>
                      <TableContainer
                        sx={{
                          borderRadius: "4px",
                          border: "1px solid #e0e0e0",
                          OverflowX: "unset",
                        }}
                      >
                        <Table stickyHeader aria-label="sticky table">
                          <TableHead>
                            <TableRow>
                              <TableCell
                                align="center"
                                colSpan={4}
                                style={{
                                  border: "1px solid #e0e0e0",
                                  borderTop: "4px solid #F2711C",
                                  textAlign: "center",
                                }}
                              >
                                 <Typography variant="body1">
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      viewBox="0 0 24 24"
                                      fill="currentColor"
                                      className="w-16 h-16 inline-flex"
                                      style={{
                                        color: "black",
                                        marginRight: "5px",
                                      }}
                                    >
                                      <path
                                        fillRule="evenodd"
                                        d="M15.182 15.182a4.5 4.5 0 0 1-6.364 0M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Z"
                                        clipRule="evenodd"
                                      />
                                    </svg>
                                    Highest WIN amount per session
                                  </Typography>
                                
                               
                              </TableCell>
                            </TableRow>
                            <TableRow>
                              {columns3.slice(0).map((column, index) => (
                                <TableCell
                                  key={index}
                                  align={column.align}
                                  className="table-cell"
                                  style={{
                                    top: 57,
                                    border: "1px solid #e0e0e0",
                                    borderRadius: "4px",
                                    textAlign: "center",
                                  }}
                                >
                                  {column.label}
                                </TableCell>
                              ))}
                            </TableRow>
                          </TableHead>

                          <TableBody>
                            {rows
                              .slice(
                                page * rowsPerPage,
                                page * rowsPerPage + rowsPerPage
                              )
                              .map((row) => {
                                return (
                                  <TableRow
                                    hover
                                    role="checkbox"
                                    tabIndex={-1}
                                    key={row.code}
                                    style={{
                                      border: "1px solid #e0e0e0",
                                      borderRadius: "4px",
                                    }}
                                  >
                                    {columns3.map((column) => {
                                      // Changed to columns1
                                      const value = row[column.id];
                                      return (
                                        <TableCell
                                          key={column.id}
                                          align={column.align}
                                          style={{
                                            border: "1px solid #e0e0e0",
                                            borderRadius: "4px",
                                          }}
                                        >
                                          {column.format &&
                                          typeof value === "number"
                                            ? column.format(value)
                                            : value}
                                        </TableCell>
                                      );
                                    })}
                                  </TableRow>
                                );
                              })}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </Paper>
                  </div>
                </div>

                <div className="table3">
                  <div className="table-wrapper">
                    <div className="flex flex-wrap justify-between items-center p-16">
                      <Paper sx={{ width: "100%" }}>
                        <TableContainer
                          sx={{
                            borderRadius: "4px",
                            border: "1px solid #e0e0e0",
                            OverflowX: "unset",
                          }}
                        >
                          <Table stickyHeader aria-label="sticky table">
                            <TableHead>
                              <TableRow>
                                <TableCell
                                  align="center"
                                  colSpan={3}
                                  style={{
                                    border: "1px solid #e0e0e0",
                                    borderTop: "4px solid #2185D0",
                                    textAlign: "center",
                                  }}
                                >
                                  <Typography variant="body1">
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      viewBox="0 0 24 24"
                                      fill="currentColor"
                                      className="w-12 h-12 inline-flex"
                                      style={{
                                        // fontWeight: "bold",
                                        color: "black",
                                        marginRight: "5px",
                                      }}
                                    >
                                      <path
                                        fillRule="evenodd"
                                        d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418"
                                        clipRule="evenodd"
                                      />
                                    </svg>
                                    [Slot] Daily TOP 10 game companies
                                  </Typography>
                                </TableCell>
                              </TableRow>
                              <TableRow>
                                {columns4.slice(0).map((column, index) => (
                                  <TableCell
                                    key={index}
                                    align={column.align}
                                    className="table-cell"
                                    style={{
                                      top: 57,
                                      border: "1px solid #e0e0e0",
                                      borderRadius: "4px",
                                      textAlign: "center",
                                    }}
                                  >
                                    {column.label}
                                  </TableCell>
                                ))}
                              </TableRow>
                            </TableHead>

                            <TableBody>
                              {rows
                                .slice(
                                  page * rowsPerPage,
                                  page * rowsPerPage + rowsPerPage
                                )
                                .map((row) => {
                                  return (
                                    <TableRow
                                      hover
                                      role="checkbox"
                                      tabIndex={-1}
                                      key={row.code}
                                      style={{
                                        border: "1px solid #e0e0e0",
                                        borderRadius: "4px",
                                      }}
                                    >
                                      {columns4.map((column) => {
                                        // Changed to columns1
                                        const value = row[column.id];
                                        return (
                                          <TableCell
                                            key={column.id}
                                            align={column.align}
                                            style={{
                                              border: "1px solid #e0e0e0",
                                              borderRadius: "4px",
                                            }}
                                          >
                                            {column.format &&
                                            typeof value === "number"
                                              ? column.format(value)
                                              : value}
                                          </TableCell>
                                        );
                                      })}
                                    </TableRow>
                                  );
                                })}
                            </TableBody>
                          </Table>
                        </TableContainer>
                      </Paper>
                    </div>
                  </div>

                  <div className="table-wrapper">
                    <div className="flex flex-wrap justify-between items-center p-16">
                      <Paper sx={{ width: "100%" }}>
                        <TableContainer
                          sx={{
                            borderRadius: "4px",
                            border: "1px solid #e0e0e0",
                            OverflowX: "unset",
                          }}
                        >
                          <Table stickyHeader aria-label="sticky table">
                            <TableHead>
                              <TableRow>
                                <TableCell
                                  align="center"
                                  colSpan={4}
                                  style={{
                                    border: "1px solid #e0e0e0",
                                    borderTop: "4px solid #2185D0",
                                    textAlign: "center",
                                  }}
                                >
                                  <Typography variant="body1">
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      viewBox="0 0 24 24"
                                      fill="currentColor"
                                      className="w-14 h-14 inline-flex"
                                      style={{
                                        // fontWeight: "bold",
                                        color: "black",
                                        marginRight: "5px",
                                      }}
                                    >
                                      <path d="M6.633 10.25c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 0 1 2.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 0 0 .322-1.672V2.75a.75.75 0 0 1 .75-.75 2.25 2.25 0 0 1 2.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282m0 0h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 0 1-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 0 0-1.423-.23H5.904m10.598-9.75H14.25M5.904 18.5c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 0 1-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 9.953 4.167 9.5 5 9.5h1.053c.472 0 .745.556.5.96a8.958 8.958 0 0 0-1.302 4.665c0 1.194.232 2.333.654 3.375Z"
                                        clipRule="evenodd"
                                      />
                                    </svg>
                                    [Slot] Daily TOP 10 games
                                  </Typography>
                                </TableCell>
                              </TableRow>
                              <TableRow>
                                {columns5.slice(0).map((column, index) => (
                                  <TableCell
                                    key={index}
                                    align={column.align}
                                    className="table-cell"
                                    style={{
                                      top: 57,
                                      border: "1px solid #e0e0e0",
                                      borderRadius: "4px",
                                      textAlign: "center",
                                    }}
                                  >
                                    {column.label}
                                  </TableCell>
                                ))}
                              </TableRow>
                            </TableHead>

                            <TableBody>
                              {rows
                                .slice(
                                  page * rowsPerPage,
                                  page * rowsPerPage + rowsPerPage
                                )
                                .map((row) => {
                                  return (
                                    <TableRow
                                      hover
                                      role="checkbox"
                                      tabIndex={-1}
                                      key={row.code}
                                      style={{
                                        border: "1px solid #e0e0e0",
                                        borderRadius: "4px",
                                      }}
                                    >
                                      {columns5.map((column) => {
                                        const value = row[column.id];
                                        return (
                                          <TableCell
                                            key={column.id}
                                            align={column.align}
                                            style={{
                                              border: "1px solid #e0e0e0",
                                              borderRadius: "4px",
                                            }}
                                          >
                                            {column.format &&
                                            typeof value === "number"
                                              ? column.format(value)
                                              : value}
                                          </TableCell>
                                        );
                                      })}
                                    </TableRow>
                                  );
                                })}
                            </TableBody>
                          </Table>
                        </TableContainer>
                      </Paper>
                    </div>
                  </div>
                </div>

                <div className="table3">
                  <div className="table-wrapper">
                    <div className="flex flex-wrap justify-between items-center p-16">
                      <Paper sx={{ width: "100%" }}>
                        <TableContainer
                          sx={{
                            borderRadius: "4px",
                            border: "1px solid #e0e0e0",
                            OverflowX: "unset",
                          }}
                        >
                          <Table stickyHeader aria-label="sticky table">
                            <TableHead>
                              <TableRow>
                                <TableCell
                                  align="center"
                                  colSpan={3}
                                  style={{
                                    border: "1px solid #e0e0e0",
                                    borderTop: "4px solid #2185D0",
                                    textAlign: "center",
                                  }}
                                >
                                  <Typography variant="body1">
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      viewBox="0 0 24 24"
                                      fill="currentColor"
                                      className="w-16 h-16 inline-flex"
                                      style={{
                                        // fontWeight: "bold",
                                        color: "black",
                                        marginRight: "5px",
                                      }}
                                    >
                                      <path
                                        fillRule="evenodd"
                                        d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418"
                                        clipRule="evenodd"
                                      />
                                    </svg>
                                    [Casino] Daily TOP 10 game companies
                                  </Typography>
                                </TableCell>
                              </TableRow>
                              <TableRow>
                                {columns6.slice(0).map((column, index) => (
                                  <TableCell
                                    key={index}
                                    align={column.align}
                                    className="table-cell"
                                    style={{
                                      top: 57,
                                      border: "1px solid #e0e0e0",
                                      borderRadius: "4px",
                                      textAlign: "center",
                                    }}
                                  >
                                    {column.label}
                                  </TableCell>
                                ))}
                              </TableRow>
                            </TableHead>

                            <TableBody>
                              {rows
                                .slice(
                                  page * rowsPerPage,
                                  page * rowsPerPage + rowsPerPage
                                )
                                .map((row) => {
                                  return (
                                    <TableRow
                                      hover
                                      role="checkbox"
                                      tabIndex={-1}
                                      key={row.code}
                                      style={{
                                        border: "1px solid #e0e0e0",
                                        borderRadius: "4px",
                                      }}
                                    >
                                      {columns6.map((column) => {
                                        // Changed to columns1
                                        const value = row[column.id];
                                        return (
                                          <TableCell
                                            key={column.id}
                                            align={column.align}
                                            style={{
                                              border: "1px solid #e0e0e0",
                                              borderRadius: "4px",
                                            }}
                                          >
                                            {column.format &&
                                            typeof value === "number"
                                              ? column.format(value)
                                              : value}
                                          </TableCell>
                                        );
                                      })}
                                    </TableRow>
                                  );
                                })}
                            </TableBody>
                          </Table>
                        </TableContainer>
                      </Paper>
                    </div>
                  </div>

                  <div className="table-wrapper">
                    <div className="flex flex-wrap justify-between items-center p-16">
                      <Paper sx={{ width: "100%" }}>
                        <TableContainer
                          sx={{
                            borderRadius: "4px",
                            border: "1px solid #e0e0e0",
                            OverflowX: "unset",
                          }}
                        >
                          <Table stickyHeader aria-label="sticky table">
                            <TableHead>
                              <TableRow>
                                <TableCell
                                  align="center"
                                  colSpan={4}
                                  style={{
                                    border: "1px solid #e0e0e0",
                                    borderTop: "4px solid #2185D0",
                                    textAlign: "center",
                                  }}
                                >
                                  <Typography variant="body1">
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      viewBox="0 0 24 24"
                                      fill="currentColor"
                                      className="w-14 h-14 inline-flex"
                                      style={{
                                      
                                        color: "black",
                                        marginRight: "5px",
                                      }}
                                    >
                                      <path d="M6.633 10.25c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 0 1 2.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 0 0 .322-1.672V2.75a.75.75 0 0 1 .75-.75 2.25 2.25 0 0 1 2.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282m0 0h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 0 1-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 0 0-1.423-.23H5.904m10.598-9.75H14.25M5.904 18.5c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 0 1-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 9.953 4.167 9.5 5 9.5h1.053c.472 0 .745.556.5.96a8.958 8.958 0 0 0-1.302 4.665c0 1.194.232 2.333.654 3.375Z"
                                        clipRule="evenodd"
                                      />
                                    </svg>
                                    [Casino] Daily TOP 10 games
                                  </Typography>
                                </TableCell>
                              </TableRow>
                              <TableRow>
                                {columns7.slice(0).map((column, index) => (
                                  <TableCell
                                    key={index}
                                    align={column.align}
                                    className="table-cell"
                                    style={{
                                      top: 57,
                                      border: "1px solid #e0e0e0",
                                      borderRadius: "4px",
                                      textAlign: "center",
                                    }}
                                  >
                                    {column.label}
                                  </TableCell>
                                ))}
                              </TableRow>
                            </TableHead>

                            <TableBody>
                              {rows
                                .slice(
                                  page * rowsPerPage,
                                  page * rowsPerPage + rowsPerPage
                                )
                                .map((row) => {
                                  return (
                                    <TableRow
                                      hover
                                      role="checkbox"
                                      tabIndex={-1}
                                      key={row.code}
                                      style={{
                                        border: "1px solid #e0e0e0",
                                        borderRadius: "4px",
                                      }}
                                    >
                                      {columns7.map((column) => {
                                        const value = row[column.id];
                                        return (
                                          <TableCell
                                            key={column.id}
                                            align={column.align}
                                            style={{
                                              border: "1px solid #e0e0e0",
                                              borderRadius: "4px",
                                            }}
                                          >
                                            {column.format &&
                                            typeof value === "number"
                                              ? column.format(value)
                                              : value}
                                          </TableCell>
                                        );
                                      })}
                                    </TableRow>
                                  );
                                })}
                            </TableBody>
                          </Table>
                        </TableContainer>
                      </Paper>
                    </div>
                  </div>
                </div>
              </Card>
            </>
          }
        />
      )}
    </>
  );
}

export default DailySummaryApp;
