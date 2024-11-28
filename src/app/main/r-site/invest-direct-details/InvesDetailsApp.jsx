/** @format */

import * as React from "react";
import FusePageSimple from "@fuse/core/FusePageSimple";
import InvestDetailsHeader from "./InvestDetailsHeader";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { locale } from "../../../configs/navigation-i18n";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import {Container } from "@mui/material";
import Paper from "@mui/material/Paper";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Button from "@mui/material/Button";
import APIService from "src/app/services/APIService";
import DataHandler from "src/app/handlers/DataHandler";
import FuseLoading from "@fuse/core/FuseLoading";
import { showMessage } from "app/store/fuse/messageSlice";
import axios from "axios";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { headerLoadChanged } from "app/store/headerLoadSlice";
import { useNavigate } from "react-router-dom";
import jwtDecode from "jwt-decode";

import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";



function InvestDetailsApp() {
  const user_id = DataHandler.getFromSession("user_id");

  const [selectLocale] = useSelector((state) => [state.locale.selectLocale]);
  const [headerLoad] = useSelector((state) => [state.headerLoad.headerLoad]);
  const [selectedLang, setSelectedLang] = useState(locale.ko);
  useEffect(() => {
    if (selectLocale == "ko") {
      setSelectedLang(locale.ko);
    } else {
      setSelectedLang(locale.en);
    }
  }, [selectLocale]);
  const [loaded, setLoaded] = useState(true);

  useEffect(() => {
    setLoaded(false);
  }, []);

  useEffect(() => {
    if (selectLocale == "ko") {
      setSelectedLang(locale.ko);
    } else {
      setSelectedLang(locale.en);
    }
  }, [selectLocale]);




  const role = jwtDecode(DataHandler.getFromSession("accessToken"))["data"];

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

  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);

  const [value, setValue] = useState("1");

  const handleChange2 = (event, newValue) => {
    setValue(newValue);
  };

  const getMethodValue = (value) => {
    if (value === "2" || value === "3") {
      return 'GET';
    }
    return 'PATCH';
  };

  const getInvestUrl = (value) => {
    switch (value) {
      case "2":
        return "https://api.invest-ho.com/api/game/history";
      case "3":
        return "https://api.invest-ho.com/api/info";
      default:
        return "https://api.invest-ho.com/api/account/balance";
    }
  };

  const getInvestBody = (value) => {
    let jsonString;
    
    switch (value) {
      case "2":
        jsonString = JSON.stringify({
          "opcode": "neolab",
          "start_at": "2021-08-10 00:00:00",
          "end_at": "2021-08-10 23:59:59",
          "offset": 0,
          "limit": 1000,
          "secret_key": "95642ef3fd2aaa48a840b3788960396e"
        }, null, 2);
        break;
      case "3":
        jsonString = JSON.stringify({
          "opcode": "lvu2753",
          "secret_key": "So4Dz8lzsuULe4qaaqeBhVKxFnjFa1td"
        }, null, 2);
        break;
      default:
        jsonString = JSON.stringify({
          "opcode": "lvu2753",
          "secret_key": "So4Dz8lzsuULe4qaaqeBhVKxFnjFa1td"
        }, null, 2);
    }
  
    return jsonString.split('\n').join('\n\n');
  };
  

  const [method, setMethod] = useState(getMethodValue(value));
  const [url, setUrl] = useState(getInvestUrl(value));
  const [body, setBody] = useState(getInvestBody(value));

  useEffect(() => {
    setMethod(getMethodValue(value));
    setUrl(getInvestUrl(value));
    setBody(getInvestBody(value));
  }, [value]);


  const handleSubmit = async (e) => {
    e.preventDefault();
    setResponse(null);
    setError(null);
    try {
      let postdata = {
        url:url,
        body:body,
        method:method
      }
      APIService({
        url: `${process.env.REACT_APP_R_SITE_API}/user/direct-invest-data`,
        method: "POST",
        data:postdata
      })
        .then((data) => {
          setResponse(data.data)
        })
        .catch((err) => {
        })
        .finally(() => {
          
        });
    } catch (err) {
      setError(err.message);
    }
  };


  return (
    <>
      {" "}
      {loaded ? (
        <FuseLoading />
      ) : (
        <FusePageSimple
          header={<InvestDetailsHeader selectedLang={selectedLang} />}
          content={
            <Card
              sx={{ width: "100%", marginTop: "10px", borderRadius: "4px" }}
              className="main_card"
            >
              <div>
                <CardContent>
                <Container maxWidth="">
                <Paper
                  sx={{
                    width: "100%",
                    overflow: "hidden",
                    borderRadius: "4px",
                  }}
                >
                  <>
                      <TabContext value={value}>
                        <Box
                          sx={{ borderBottom: 1, borderColor: "divider" }}
                          className="common-tab"
                        >
                          <TabList
                            onChange={handleChange2}
                            aria-label="lab API tabs example"
                          >
                            <Tab
                              label={"All Balance"}
                              value="1"
                              className="tab_btn"
                            />
                            <Tab
                              label={`Game record (by inquiry period)`}
                              value="2"
                              className="tab_btn"
                            />
                            <Tab
                              label={`View Information`}
                              value="3"
                              className="tab_btn"
                            />
                            
                          </TabList>
                        </Box>
                        <TabPanel value="1" className="common_tab_content">
                        <form onSubmit={handleSubmit}>
                         <Box mb={2}>
                        <FormControl variant="outlined"
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            border: '1px solid',
                            borderColor: '#cdcfd3',
                            borderRadius: '5px',
                            padding: '4px 10px',
                          },
                        }}
                        >
                          <Select
                            value={method}
                            onChange={(e) => setMethod(e.target.value)}
                            placeholder="Method"
                          >
                            <MenuItem value="GET" style={{fontWeight:'bolder'}}>{selectedLang.GET}</MenuItem>
                            <MenuItem value="POST" style={{fontWeight:'bolder'}}>{selectedLang.POST}</MenuItem>
                            <MenuItem value="PUT" style={{fontWeight:'bolder'}}>{selectedLang.PUT}</MenuItem>
                            <MenuItem value="PATCH" style={{fontWeight:'bolder'}}>{selectedLang.PATCH}</MenuItem>
                            <MenuItem value="DELETE" style={{fontWeight:'bolder'}}>{selectedLang.DELETE}</MenuItem>
                          </Select>
                        </FormControl>
                      </Box>
                        <Box mb={2}>
                          <TextField
                            sx={{
                              '& .MuiOutlinedInput-root': {
                                border: '1px solid',
                                borderColor: '#cdcfd3',
                                borderRadius: '5px',
                                padding: '4px 10px',
                                fontWeight:'bolder'
                              },
                            }}
                            placeholder="URL"
                            variant="outlined"
                            fullWidth
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            required
                          />
                        </Box>
                        <Box mb={2}>
                          <TextField
                            sx={{
                              '& .MuiOutlinedInput-root': {
                                border: '1px solid',
                                borderColor: '#cdcfd3',
                                borderRadius: '5px',
                                padding: '4px 10px',
                                fontWeight:'bolder'
                              },
                            }}
                            placeholder="Body"
                            variant="outlined"
                            fullWidth
                            multiline
                            rows={15}
                            value={body}
                            onChange={(e) => setBody(e.target.value)}
                          />
                        </Box>
                        <Button type="submit" variant="contained" color="secondary">
                          {selectedLang.SEND}
                        </Button>
                      </form>
                      {response && (
                        <Box mt={4}>
                          <Typography variant="h6" component="h2" color={"white"}>
                          {selectedLang.Response}
                          </Typography>
                          <Paper elevation={2} sx={{
                              width: "100%",
                              overflow: "hidden",
                              borderRadius: "4px",
                            }}>
                            <textarea
                              className="preJson"
                              style={{
                                width: "100%",
                                minHeight:'900px',
                                boxSizing: "border-box",
                                whiteSpace: "pre",
                                fontFamily: "monospace",
                                backgroundColor:"black",
                                padding: "10px",
                              }}
                              placeholder="Response"
                              readOnly={true}
                              value={JSON.stringify(response, null, 2)}
                            />
                          </Paper>
                        </Box>
                      )}
                      {error && (
                        <Box mt={4} color="red">
                          <Typography variant="h6" component="h2" color={"white"}>
                          {selectedLang.Error}
                          </Typography>
                          <Paper sx={{
                              width: "100%",
                              overflow: "hidden",
                              borderRadius: "4px",
                            }}>
                             <textarea
                              className="preJson"
                              style={{
                                width: "100%",
                                minHeight:'500px',
                                boxSizing: "border-box",
                                whiteSpace: "pre",
                                fontFamily: "monospace",
                                backgroundColor:"black",
                                padding: "10px",
                              }}
                              placeholder="Response"
                              value={error}
                            />
                          </Paper>
                        </Box>
                      )}
                        </TabPanel>
                        <TabPanel value="2" className="common_tab_content">
                        <form onSubmit={handleSubmit}>
                      <Box mb={2}>
                        <FormControl variant="outlined"
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            border: '1px solid',
                            borderColor: '#cdcfd3',
                            borderRadius: '5px',
                            padding: '4px 10px',
                          },
                        }}
                        >
                          <Select
                            value={method}
                            onChange={(e) => setMethod(e.target.value)}
                            placeholder="Method"
                          >
                            <MenuItem value="GET" style={{fontWeight:'bolder'}}>{selectedLang.GET}</MenuItem>
                            <MenuItem value="POST" style={{fontWeight:'bolder'}}>{selectedLang.POST}</MenuItem>
                            <MenuItem value="PUT" style={{fontWeight:'bolder'}}>{selectedLang.PUT}</MenuItem>
                            <MenuItem value="PATCH" style={{fontWeight:'bolder'}}>{selectedLang.PATCH}</MenuItem>
                            <MenuItem value="DELETE" style={{fontWeight:'bolder'}}>{selectedLang.DELETE}</MenuItem>
                          </Select>
                        </FormControl>
                      </Box>
                        <Box mb={2}>
                          <TextField
                            sx={{
                              '& .MuiOutlinedInput-root': {
                                border: '1px solid',
                                borderColor: '#cdcfd3',
                                borderRadius: '5px',
                                padding: '4px 10px',
                                fontWeight:'bolder'
                              },
                            }}
                            placeholder="URL"
                            variant="outlined"
                            fullWidth
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            required
                          />
                        </Box>
                        <Box mb={2}>
                          <TextField
                            sx={{
                              '& .MuiOutlinedInput-root': {
                                border: '1px solid',
                                borderColor: '#cdcfd3',
                                borderRadius: '5px',
                                padding: '4px 10px',
                                fontWeight:'bolder'
                              },
                            }}
                            placeholder="Body"
                            variant="outlined"
                            fullWidth
                            multiline
                            rows={15}
                            value={body}
                            onChange={(e) => setBody(e.target.value)}
                          />
                        </Box>
                        <Button type="submit" variant="contained" color="secondary">
                          {selectedLang.SEND}
                        </Button>
                      </form>
                      {response && (
                        <Box mt={4}>
                          <Typography variant="h6" component="h2" color={"white"}>
                            {selectedLang.Response}
                          </Typography>
                          <Paper elevation={2} sx={{
                              width: "100%",
                              overflow: "hidden",
                              borderRadius: "4px",
                            }}>
                            <textarea
                              className="preJson"
                              style={{
                                width: "100%",
                                minHeight:'900px',
                                boxSizing: "border-box",
                                whiteSpace: "pre",
                                fontFamily: "monospace",
                                backgroundColor:"black",
                                padding: "10px",
                              }}
                              placeholder="Response"
                              readOnly={true}
                              value={JSON.stringify(response, null, 2)}
                            />
                          </Paper>
                        </Box>
                      )}
                      {error && (
                        <Box mt={4} color="red">
                          <Typography variant="h6" component="h2" color={"white"}>
                          {selectedLang.Error}
                          </Typography>
                          <Paper sx={{
                              width: "100%",
                              overflow: "hidden",
                              borderRadius: "4px",
                            }}>
                             <textarea
                              className="preJson"
                              style={{
                                width: "100%",
                                minHeight:'500px',
                                boxSizing: "border-box",
                                whiteSpace: "pre",
                                fontFamily: "monospace",
                                backgroundColor:"black",
                                padding: "10px",
                              }}
                              placeholder="Response"
                              value={error}
                            />
                          </Paper>
                        </Box>
                      )}
                        </TabPanel>
                        <TabPanel value="3" className="common_tab_content">
                        <form onSubmit={handleSubmit}>
                      <Box mb={2}>
                        <FormControl variant="outlined"
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            border: '1px solid',
                            borderColor: '#cdcfd3',
                            borderRadius: '5px',
                            padding: '4px 10px',
                          },
                        }}
                        >
                          <Select
                            value={method}
                            onChange={(e) => setMethod(e.target.value)}
                            placeholder="Method"
                          >
                            <MenuItem value="GET" style={{fontWeight:'bolder'}}>{selectedLang.GET}</MenuItem>
                            <MenuItem value="POST" style={{fontWeight:'bolder'}}>{selectedLang.POST}</MenuItem>
                            <MenuItem value="PUT" style={{fontWeight:'bolder'}}>{selectedLang.PUT}</MenuItem>
                            <MenuItem value="PATCH" style={{fontWeight:'bolder'}}>{selectedLang.PATCH}</MenuItem>
                            <MenuItem value="DELETE" style={{fontWeight:'bolder'}}>{selectedLang.DELETE}</MenuItem>
                          </Select>
                        </FormControl>
                      </Box>
                        <Box mb={2}>
                          <TextField
                            sx={{
                              '& .MuiOutlinedInput-root': {
                                border: '1px solid',
                                borderColor: '#cdcfd3',
                                borderRadius: '5px',
                                padding: '4px 10px',
                                fontWeight:'bolder'
                              },
                            }}
                            placeholder="URL"
                            variant="outlined"
                            fullWidth
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            required
                          />
                        </Box>
                        <Box mb={2}>
                          <TextField
                            sx={{
                              '& .MuiOutlinedInput-root': {
                                border: '1px solid',
                                borderColor: '#cdcfd3',
                                borderRadius: '5px',
                                padding: '4px 10px',
                                fontWeight:'bolder'
                              },
                            }}
                            placeholder="Body"
                            variant="outlined"
                            fullWidth
                            multiline
                            rows={15}
                            value={body}
                            onChange={(e) => setBody(e.target.value)}
                          />
                        </Box>
                        <Button type="submit" variant="contained" color="secondary">
                          {selectedLang.SEND}
                        </Button>
                      </form>
                      {response && (
                        <Box mt={4}>
                          <Typography variant="h6" component="h2" color={"white"}>
                          {selectedLang.Response}
                          </Typography>
                          <Paper elevation={2} sx={{
                              width: "100%",
                              overflow: "hidden",
                              borderRadius: "4px",
                            }}>
                            <textarea
                              className="preJson"
                              style={{
                                width: "100%",
                                minHeight:'900px',
                                boxSizing: "border-box",
                                whiteSpace: "pre",
                                fontFamily: "monospace",
                                backgroundColor:"black",
                                padding: "10px",
                              }}
                              placeholder="Response"
                              readOnly={true}
                              value={JSON.stringify(response, null, 2)}
                            />
                          </Paper>
                        </Box>
                      )}
                      {error && (
                        <Box mt={4} color="red">
                          <Typography variant="h6" component="h2" color={"white"}>
                            {selectedLang.Error}
                          </Typography>
                          <Paper sx={{
                              width: "100%",
                              overflow: "hidden",
                              borderRadius: "4px",
                            }}>
                             <textarea
                              className="preJson"
                              style={{
                                width: "100%",
                                minHeight:'500px',
                                boxSizing: "border-box",
                                whiteSpace: "pre",
                                fontFamily: "monospace",
                                backgroundColor:"black",
                                padding: "10px",
                              }}
                              placeholder="Response"
                              value={error}
                            />
                          </Paper>
                        </Box>
                      )}
                        </TabPanel>
                      </TabContext>
                    </>
                    </Paper>
                  </Container>
                </CardContent>
              </div>
            </Card>
          }
        />
      )}
    </>
  );
}

export default InvestDetailsApp;
