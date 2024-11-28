/** @format */

import React from "react";
import FusePageSimple from "@fuse/core/FusePageSimple";
import RequestRpointHeader from "./requestRpointHeader";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { locale } from "../../../../configs/navigation-i18n";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardActionArea from "@mui/material/CardActionArea";
import "./requestRpoint.css";
import Grid from "@mui/material/Unstable_Grid2";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import CancelIcon from "@mui/icons-material/Cancel";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import APIService from "src/app/services/APIService";
import DataHandler from "src/app/handlers/DataHandler";
import { showMessage } from "app/store/fuse/messageSlice";
import axios from "axios";
import FuseLoading from "@fuse/core/FuseLoading/FuseLoading";
import { formatSentence } from "src/app/services/Utility";

function requestRpointApp() {
  const [selectLocale] = useSelector((state) => [state.locale.selectLocale]);
  const [selectedLang, setSelectedLang] = useState(locale.en);
  const [rPoints, setRPoints] = useState(0);
  const [userDetails, setUserDetails] = useState();
  const [parent, setParent] = useState("");
  const [selectedprovider] = useSelector((state) => [
    state.provider.selectedprovider,
  ]);
  const dispatch = useDispatch();

  const [live_usdt_price, _live_usdt_price] = useState(0);
  const [usdt_roint, _usdt_rpoint] = useState();
  const [loaded, setLoaded] = useState(false);
  //    useEffect(() => {
  //        const timeoutId = setTimeout(() => {
  //      setLoaded(false)
  //     }, 500);
  //  return () => clearTimeout(timeoutId);
  //   }, []);

  const getLiveUsdtPrice = async () => {
    const { data } = await axios.get(
      'http://154.19.186.89:5000/api/v1/ticker/24h/1?symbols=["BKRWUSDT"]'
    );
    _live_usdt_price(data?.data[0]?.prevClosePrice);
  };

  // useEffect(() => {
  //   getLiveUsdtPrice();
  // }, []);

  // useEffect(() => {
  //   // rPoints
  //   let usdt = (rPoints * 70 * live_usdt_price) / 100;
  //   -_usdt_rpoint(usdt);
  // }, [rPoints]);

  useEffect(() => {
    if (selectLocale == "ko") {
      setSelectedLang(locale.ko);
    } else {
      setSelectedLang(locale.en);
    }
  }, [selectLocale]);

  useEffect(() => {
    const user_id = DataHandler.getFromSession("user_id");
    getUserDetails(user_id);
  }, []);

  const getUserDetails = (user_id) => {
    APIService({
      url: `${process.env.REACT_APP_R_SITE_API}/user/details?user_id=${user_id}`,
      method: "GET",
    })
      .then((data) => {
        setUserDetails(data.data.data[0]);
        setParent(data.data.data[0].parentDetails[0]["id"]);
      })
      .catch((e) => { })
      .finally(() => { });
  };

  function call_pg(request_id) {
    var url = "http://188.40.185.118:3000";
    var apikey = "26355ab6-ed2a-4131-a61d-d9bf723a2bb9";
    var userid = "test01";
    var partner_token = "test01";
    // service_name=rpointcasino&serviceIP=192.168.0.0.1&api=api&uniqueKey=uniqueKey
    window.open(
      url +
      "/advertpopup_r_site?apikey=" +
      apikey +
      "&userid=" +
      userid +
      "&partner_token=" +
      partner_token +
      "&service_name=rpointcasino" +
      "&serviceIP=192.168.0.0.1" +
      "&api=api" +
      "&uniqueKey=" +
      userDetails["id"] +
      "&type=buy" +
      "&amount=" +
      usdt_roint +
      "&request_id=" +
      request_id,
      "_blank",
      `width=624, height=620`
    );
  }

  const cancelRpoints = () => {
    setRPoints(0);
  };

  const requestRpoints = () => {
    if (rPoints > 0) {
      APIService({
        url: `${process.env.REACT_APP_R_SITE_API}/user/request-points`,
        method: "POST",
        data: {
          user_id: userDetails["user_id"],
          parentId: userDetails?.parentDetails[0]["user_id"],
          point_amount: rPoints,
          provider_id: userDetails["selected_provider"],
        },
      })
        .then((data) => {
          setRPoints(0);
          dispatch(
            showMessage({
              variant: "success",
              message: `${selectedLang.r_point_requested_successfully}`,
            })
          );
          //call_pg(data?.data?.request_id);
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
        .finally(() => { });
    }
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

  return (
    <>
      {" "}
      {loaded ? (
        <FuseLoading />
      ) : (
        <FusePageSimple
          header={<RequestRpointHeader selectedLang={selectedLang} />}
          content={
            <Card
              sx={{ width: "100%", marginTop: "20px", borderRadius: "4px" }}
              className="main_card"
            >
              <div className="flex justify-start justify-items-center flex-col bg-gray p-16 w-100">
                <div>
                  <span className="list-title">
                    {selectedLang.request_pot_from_super_agent}
                  </span>{" "}
                </div>
              </div>
              <div>
                <CardContent>
                  <Grid
                    container
                    rowSpacing={1}
                    columnSpacing={{ xs: 1, sm: 2, md: 3 }}
                  >
                    <Grid xs={12} md={12}>
                      <Grid
                        container
                        style={{
                          display: "flex",
                          // padding: "20px 20px 0",
                          gap: "15px",
                        }}
                        sx={
                          {
                            // marginTop: "10px",
                          }
                        }
                      >
                        {" "}
                        <TextField
                          label={selectedLang.Affiliated_Agent}
                          id="fullWidth"
                          className="textbox"
                          size="small"
                          color="primary"
                          type="text"
                          value={parent}
                          sx={{
                            marginBottom: "15px",
                          }}
                        />
                        {/* <Grid xs={12} md={12}>
                        <FormControl sx={{ width: "100%" }}>
                          <InputLabel id="Providers-ID">
                            Providers ID
                          </InputLabel>
                          <Select
                            fullWidth
                            labelId="Providers-ID"
                            id="Providers-ID"
                            value={provider}
                            label="Providers ID"
                            onChange={handleChange2}
                          >
                            {providerDetails.map((provider) => {
                              return (
                                <MenuItem value={provider.provider_id}>
                                  {selectedLang.provider} {provider.provider_id}
                                </MenuItem>
                              );
                            })}
                          </Select>
                        </FormControl>
                      </Grid> */}
                        <TextField
                          size="small"
                          className="textbox"
                          label={selectedLang.R_Points}
                          id="fullWidth"
                          color="primary"
                          type="text"
                          value={formatAmount(rPoints)}
                          sx={{
                            marginBottom: "15px",
                          }}
                          // onChange={(e) => setRPoints(e.target.value)}
                          onChange={(e) => {
                            const inputValue = e.target.value;
                            const numericValue = inputValue.replace(
                              /[^0-9.]/g,
                              ""
                            );
                            setRPoints(numericValue);
                          }}
                        />
                      </Grid>
                    </Grid>
                  </Grid>
                  <div className="flex justify-end items-center pt-0 p-16">
                    <Button
                      className="flex item-center"
                      variant="outlined"
                      color="secondary"
                      startIcon={<CancelIcon size={20}></CancelIcon>}
                      sx={{
                        borderRadius: "4px",
                      }}
                      onClick={cancelRpoints}
                    >
                      {selectedLang.cancellation}
                    </Button>
                    <Button
                      className="flex item-center ml-8"
                      variant="contained"
                      color="secondary"
                      endIcon={<CheckCircleIcon size={20}></CheckCircleIcon>}
                      sx={{
                        borderRadius: "4px",
                      }}
                      onClick={requestRpoints}
                    >
                      {selectedLang.produce}
                    </Button>
                  </div>
                </CardContent>
              </div>
            </Card>
          }
        />
      )}
    </>
  );
}

export default requestRpointApp;
