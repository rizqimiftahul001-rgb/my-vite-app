import React, { useState, useEffect } from "react";
import FusePageSimple from "@fuse/core/FusePageSimple";
import { useDispatch, useSelector } from "react-redux";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { Container } from "@mui/material";
import Paper from "@mui/material/Paper";
import FormControl from "@mui/material/FormControl";
import { locale} from '../../../configs/navigation-i18n';
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FuseLoading from "@fuse/core/FuseLoading";
import Box from "@mui/material/Box";
import jwtDecode from "jwt-decode";
import { Switch, FormControlLabel, Button } from "@mui/material";
import DataHandler from "src/app/handlers/DataHandler";
import EnvController from "./EnvControllerHeader";
import APIService from 'src/app/services/APIService';
import { showMessage } from 'app/store/fuse/messageSlice';

function EnvControllerApp() {
  const user_id = DataHandler.getFromSession("user_id");

  const [selectLocale] = useSelector((state) => [state.locale.selectLocale]);
  const [headerLoad] = useSelector((state) => [state.headerLoad.headerLoad]);
  const [selectedLang, setSelectedLang] = useState(locale.ko);
  const [interacted, setInteracted] = useState(false);
  const [loaded, setLoaded] = useState(true);
  const [selectedOptions, setSelectedOptions] = useState(["", "", ""]);
  const [toggled, setToggled] = useState([false, false, false, false]);

  const dispatch = useDispatch();

  useEffect(() => {
    if (selectLocale === "ko") {
      setSelectedLang(locale.ko);
    } else {
      setSelectedLang(locale.en);
    }
  }, [selectLocale]);

  useEffect(() => {
    setLoaded(false);
  }, []);

  const role = jwtDecode(DataHandler.getFromSession("accessToken"))["data"];

  const handleDropdownChange = (index, value) => {
    const newSelectedOptions = [...selectedOptions];
    newSelectedOptions[index] = value;
    setSelectedOptions(newSelectedOptions);
    setInteracted(true);
  };

  const handleToggleChange = (index) => (event) => {
    const newToggled = [...toggled];
    newToggled[index] = event.target.checked;
    setToggled(newToggled);
    setInteracted(true);
  };

  const handleSubmit = () => {
    let bodyData = {
        archeive_database_shift: toggled[0], 
        bet_history_api: selectedOptions[0], 
        bet_history_ui: selectedOptions[1], 
        pre_statastics_management: toggled[1], 
        error_logs: selectedOptions[2], 
      };

    APIService({
        url: `${process.env.REACT_APP_R_SITE_API}/user/env-controller-mgt`,
        method: 'PUT',
        data: bodyData
    })
    .then((data) => {
        dispatch(
            showMessage({
                variant: 'success',
                message: `${selectedLang.success}`,
            })
        );
    })
    .catch((err) => {
        dispatch(
            showMessage({
                variant: 'error',
                message: `${selectedLang.something_went_wrong}`,
            })
        );
    })
    .finally(() => {
    });

    console.log("Submitted with:", bodyData);
  };

  const getEnvDetails = ()=>{
    setLoaded(true)
    APIService({
      url: `${process.env.REACT_APP_R_SITE_API}/user/env-controller-mgt`,
      method: 'GET',
  })
  .then((response) => {
    const data = response?.data?.data || {};
    const {
      bet_history_api = "primary",
      bet_history_ui = "primary",
      error_logs = "primary",
      archeive_database_shift = false,
      pre_statastics_management = false,
    } = data;

    selectedOptions[0] = bet_history_api;
    selectedOptions[1] = bet_history_ui;
    toggled[0] = archeive_database_shift;
    toggled[1] = pre_statastics_management;
    selectedOptions[2] = error_logs;
    setLoaded(false);
  })
  .catch((err) => {
    console.log("err================>",err)
      dispatch(
          showMessage({
              variant: 'error',
              message: `${selectedLang.something_went_wrong}`,
          })
      );
  }).finally(()=>{
    setLoaded(false)
  })
  }

  useEffect(()=>{
    getEnvDetails()
  },[])

  return (
    <>
      {loaded ? (
        <FuseLoading />
      ) : (
        <FusePageSimple
          header={<EnvController selectedLang={selectedLang} />}
          content={
            <Card sx={{ width: "100%", marginTop: "10px", borderRadius: "4px" }} className="main_card">
              <div>
                <CardContent>
                  <Container maxWidth="">
                    <Paper sx={{ width: "100%", overflow: "hidden", borderRadius: "4px" }}>
                      <>
                        <Box sx={{ display: "flex", alignItems: "center", padding: 2, gap: 2 }}>
                          <Typography variant="body1" sx={{ color: "white", fontWeight: "bold" }}>
                            ARCHIVE database shift
                          </Typography>
                          <FormControlLabel
                            control={<Switch checked={toggled[0]} onChange={handleToggleChange(0)} />}
                            label="Toggle"
                            sx={{
                              "& .MuiSwitch-switchBase.Mui-checked": {
                                color: "#4caf50",
                              },
                              "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                                backgroundColor: "#4caf50",
                              },
                              "& .MuiSwitch-track": {
                                borderRadius: "20px",
                                backgroundColor: "#ccc",
                              },
                              "& .MuiSwitch-thumb": {
                                width: "20px",
                                height: "20px",
                              },
                            }}
                          />
                        </Box>
                        <Box sx={{ display: "flex", alignItems: "center", padding: 2 }}>
                          <Typography variant="body1" sx={{ color: "white", fontWeight: "bold", marginRight: 2 }}>
                            Bet history api
                          </Typography>
                          <FormControl variant="outlined" sx={{ minWidth: 20 }}>
                            <Select
                              value={selectedOptions[0]}
                              onChange={(event) => handleDropdownChange(0, event.target.value)}
                              displayEmpty
                              inputProps={{ "aria-label": "Without label" }}
                            >
                              <MenuItem value={"primary"}>Primary</MenuItem>
                              <MenuItem value={"secondary"}>Secondary</MenuItem>
                              <MenuItem value={"archive"}>Archive</MenuItem>
                            </Select>
                          </FormControl>
                        </Box>
                        <Box sx={{ display: "flex", alignItems: "center", padding: 2 }}>
                          <Typography variant="body1" sx={{ color: "white", fontWeight: "bold", marginRight: 2 }}>
                            Bet history UI
                          </Typography>
                          <FormControl variant="outlined" sx={{ minWidth: 20 }}>
                            <Select
                              value={selectedOptions[1]}
                              onChange={(event) => handleDropdownChange(1, event.target.value)}
                              displayEmpty
                              inputProps={{ "aria-label": "Without label" }}
                            >
                              <MenuItem value={"primary"}>Primary</MenuItem>
                              <MenuItem value={"secondary"}>Secondary</MenuItem>
                              <MenuItem value={"archive"}>Archive</MenuItem>
                            </Select>
                          </FormControl>
                        </Box>
                        <Box sx={{ display: "flex", alignItems: "center", padding: 2, gap: 2 }}>
                          <Typography variant="body1" sx={{ color: "white", fontWeight: "bold" }}>
                            Pre Statistics data management
                          </Typography>
                          <FormControlLabel
                            control={<Switch checked={toggled[1]} onChange={handleToggleChange(1)} />}
                            label="Toggle"
                            sx={{
                              "& .MuiSwitch-switchBase.Mui-checked": {
                                color: "#4caf50",
                              },
                              "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                                backgroundColor: "#4caf50",
                              },
                              "& .MuiSwitch-track": {
                                borderRadius: "20px",
                                backgroundColor: "#ccc",
                              },
                              "& .MuiSwitch-thumb": {
                                width: "20px",
                                height: "20px",
                              },
                            }}
                          />
                        </Box>
                        <Box sx={{ display: "flex", alignItems: "center", padding: 2 }}>
                          <Typography variant="body1" sx={{ color: "white", fontWeight: "bold", marginRight: 2 }}>
                            Error logs
                          </Typography>
                          <FormControl variant="outlined" sx={{ minWidth: 20 }}>
                            <Select
                              value={selectedOptions[2]}
                              onChange={(event) => handleDropdownChange(2, event.target.value)}
                              displayEmpty
                              inputProps={{ "aria-label": "Without label" }}
                            >
                              <MenuItem value={"primary"}>Primary</MenuItem>
                              <MenuItem value={"secondary"}>Secondary</MenuItem>
                              <MenuItem value={"archive"}>Archive</MenuItem>
                            </Select>
                          </FormControl>
                        </Box>
                        <div
                         style={ {display: "flex",alignItems: "center",padding: "16px"}}>
                          <Button
                            className="flex item-center buttonbox"
                            variant="contained"
                            color="secondary"
                            size="small"
                            sx={{ borderRadius: "4px", marginBottom: "2%", marginRight: "2%" }}
                            onClick={handleSubmit}
                          >
                            {selectedLang.submit}
                          </Button>
                        </div>
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

export default EnvControllerApp;
