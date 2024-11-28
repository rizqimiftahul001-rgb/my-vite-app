/** @format */

import * as React from "react";
import FusePageSimple from "@fuse/core/FusePageSimple";
import CreateAgentAppHeader from "./createAgentHeader";
import { useDispatch, useSelector } from "react-redux";
import { showMessage } from "app/store/fuse/messageSlice";
import { useEffect, useState } from "react";
import { locale } from "../../../../configs/navigation-i18n";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { Autocomplete, CardActionArea, CardActions } from "@mui/material";
import "./agentCreate.css";
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
import OutlinedInput from "@mui/material/OutlinedInput";
import FormHelperText from "@mui/material/FormHelperText";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import DataHandler from "src/app/handlers/DataHandler";
import APIService from "src/app/services/APIService";
import jwtDecode from "jwt-decode";
import APISupport from "src/app/services/APISupport";
import moment from "moment-timezone";
import { headerLoadChanged } from "app/store/headerLoadSlice";
// import Select from "react-select";
//import "react-select/dist/react-select.css";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import FuseLoading from "@fuse/core/FuseLoading/FuseLoading";
import { formatSentence } from "src/app/services/Utility";

const theme = createTheme({
  components: {
    MuiInputLabel: {
      styleOverrides: {
        asterisk: {
          color: "red", // your desired color
        },
      },
    },
  },
});

function createAgentApp() {
  const dispatch = useDispatch();
  const user_id = DataHandler.getFromSession("user_id");
  const [id, setId] = useState("");
  const [idError, setIdError] = useState(false);
  const [nickname, setNickname] = useState("");
  const [password, setPassword] = useState("");
  const [rate, setRate] = useState("");
  const [type, setType] = useState(0);
  const [fields, setFields] = useState([0, 0]);
  const [memo, setMemo] = useState("");
  const [selectItem, setSelectItem] = useState([]);
  const [selectLocale] = useSelector((state) => [state.locale.selectLocale]);
  const [selectedLang, setSelectedLang] = useState(locale.en);
  const [agentHoldingSummary, setAgentHoldingSummary] = useState([]);
  const [providerDetails, setProviderDetails] = useState([]);
  const [providerCurrency, setProviderCurrency] = useState([]);
  const [providerLanguage, setProviderLanguage] = useState([]);
  const role = jwtDecode(DataHandler.getFromSession("accessToken"))["data"];
  const [selectedprovider] = useSelector((state) => [
    state.provider.selectedprovider,
  ]);
  const [headerLoad] = useSelector((state) => [state.headerLoad.headerLoad]);
  const [rpointIndex, setRpointIndex] = useState(0);
  const [agentProvider, setAgentProvider] = useState(1);
  const [currency, setCurrency] = useState("");
  const [time, settime] = useState("");
  const [language, setLanguage] = useState("");
  const [loaderVisible, setLoaderVisible] = useState(false);
  const [BtnVisible, setBtnVisible] = useState(true);
  const [loaded, setLoaded] = useState(true);
  const [showPassword, setShowPassword] = React.useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [incorrectInput, setIncorrectInput] = useState("");
  const [isInvalid, setIsInvalid] = useState(false);
  const [isInvalidWordCount, setIsInvalidWordCount] = useState(false);
  const [isInvalidInput, setIsInvalidInput] = useState(false);
  const [age, setAge] = React.useState("");
  const [isValidNickname, setIsValidNickname] = useState(true);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setLoaded(false);
    }, 500);
    return () => clearTimeout(timeoutId);
  }, []);

  useEffect(() => {
    const indexvalue = selectedprovider - 1;
    setRpointIndex(indexvalue);
  }, [selectedprovider]);
  useEffect(() => {
    if (selectLocale == "ko") {
      setSelectedLang(locale.ko);
    } else {
      setSelectedLang(locale.en);
    }
  }, [selectLocale]);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const validatePassword = () => {
    // Check if the password length exceeds 12 characters
    const isInvalid = password.length > 12;

    // Update the error state based on the validation result
    setPasswordError(isInvalid);

    return !isInvalid; // Return true if the password is valid
  };

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);

    // Call the validatePassword function whenever the password changes
    validatePassword();
  };

  const handleChange = (event) => {
    setFields([0, 0]);
    setAgentProvider(event.target.value);
  };

  const handleCurrency = (event) => {
    setCurrency(event.target.value);
  };

  const handleLanguage = (event) => {
    setLanguage(event.target.value);
  };

  const handletime = (event, newValue) => {
    settime(newValue?.value || "");
  };

  const handleChange2 = (event) => {
    const value = event.target.value;
    if (value >= 1 && value <= 100) {
      // Update state or do something with the valid input value
    }
  };
  const handleChange3 = (event) => {
    setType(event.target.value);
  };

  const handleAddField = () => {
    if (fields.length < 2) {
      setFields([...fields, ""]);
    }
  };
  const handleRemoveField = (index) => {
    const newFields = [...fields];
    newFields.splice(index, 1);
    setFields(newFields);
  };
  const handleChange4 = (index, value) => {
    const newFields = [...fields];
    newFields[index] = value;
    setFields(newFields);
  };
  const [text, setText] = useState("");

  const handleChange5 = (event) => {
    setText(event.target.value);
  };

  useEffect(() => {
    getType();
    getProviderCurrency();
    getProviderLanguage();
    if (role["role"] == "admin" || role["role"] == "cs") {
      getAgentHoldingSummary();
      //getProviderDetails();
    }
  }, []);

  // const getProviderDetails = () => {
  //   APIService({
  //     url: `${process.env.REACT_APP_R_SITE_API}/game/get-provider-list`,
  //     method: "GET",
  //   })
  //     .then((data) => {
  //       setProviderDetails(data.data.data);
  //     })
  //     .catch((e) => console.log("Error : ", e))
  //     .finally(() => {});
  // };

  const getProviderCurrency = () => {
    APIService({
      url: `${process.env.REACT_APP_R_SITE_API}/user/get-currency`,
      method: "GET",
    })
      .then((data) => {
        setProviderCurrency(data.data.data);
      })
      .catch((e) => { })
      .finally(() => { });
  };

  const getProviderLanguage = () => {
    APIService({
      url: `${process.env.REACT_APP_R_SITE_API}/user/get-language`,
      method: "GET",
    })
      .then((data) => {
        setProviderLanguage(data.data.data);
      })
      .catch((e) => { })
      .finally(() => { });
  };

  const getAgentHoldingSummary = () => {
    APIService({
      url: `${process.env.REACT_APP_R_SITE_API}/user/get-holding_summary?user_id=${user_id}`,
      method: "GET",
    })
      .then((data) => {
        setAgentHoldingSummary(data.data.data);
      })
      .catch((err) => {
        dispatch(
          showMessage({
            variant: "error",
            message: `${selectedLang[`${formatSentence(err?.error?.message)}`] ||
              selectedLang.error_alert
              }`,
          })
        );
      })
      .finally(() => { });
  };

  const getType = (e) => {
    APIService({
      url: `/type/get-type`,
      method: "GET",
    })
      .then((data) => {
        setSelectItem(data.data.data);
      })
      .catch((error) => {
        console.error(error);
        dispatch(
          showMessage({
            variant: "error",
            message: `${selectedLang[`${formatSentence(error?.error?.message)}`] ||
              selectedLang.error_alert
              }`,
          })
        );
      })
      .finally(() => { });
  };

  const cancelCreation = (e) => {
    e.preventDefault();
    setId("");
    setNickname("");
    setMemo("");
    setRate("");
    setPassword("");
    setType(0);
    setFields([0, 0]);
    setCurrency("");
    setLanguage("");
    settime("");
  };

  const submitUserDetails = (e) => {
    e.preventDefault();
    if (role["role"] == "admin" || role["role"] == "cs") {
      var payload = {
        id: id,
        nickname: nickname,
        password: password,
        parentId: user_id,
        //providerId: agentProvider,
        providerId: 1,
        memo: memo,
        rate: rate,
        type: type,
        rpoints: fields,
        currency: currency,
        language: language,
        time: time,
      };
    } else {
      var payload = {
        id: id,
        nickname: nickname,
        password: password,
        parentId: user_id,
        // providerId: selectedprovider,
        providerId: 1,
        memo: memo,
        rate: rate,
        type: type,
        rpoints: fields,
        //currency: currency,
      };
    }

    if (id == undefined || id == null || id == "") {
      dispatch(
        showMessage({
          variant: "error",
          message: `${selectedLang.id_is_required}`,
        })
      );
    } else if (nickname == undefined || nickname == null || nickname == "") {
      dispatch(
        showMessage({
          variant: "error",
          message: `${selectedLang.nick_name_is_required}`,
        })
      );
    } else if (password == undefined || password == null || password == "") {
      dispatch(
        showMessage({
          variant: "error",
          message: `${selectedLang.password_is_required}`,
        })
      );
    } else if (rate == undefined || rate == null || rate == "") {
      dispatch(
        showMessage({
          variant: "error",
          message: `${selectedLang.rate_is_required}`,
        })
      );
    } else if (
      (currency == undefined || currency == null || currency == "") &&
      (role["role"] == "admin" || role["role"] == "cs")
    ) {
      dispatch(
        showMessage({
          variant: "error",
          message: `${selectedLang.currency_is_required}`,
        })
      );
    } else if (
      (time == undefined || time == null || time == "") &&
      (role["role"] == "admin" || role["role"] == "cs")
    ) {
      dispatch(
        showMessage({
          variant: "error",
          message: `${selectedLang.time_zone_is_requried}`,
        })
      );
    } else if (fields.length <= 0 && role["role"] != "admin") {
      dispatch(
        showMessage({
          variant: "error",
          message: `${selectedLang.pot_is_required}`,
        })
      );
    } else {
      var passworgPtn = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z]).{8,}$/;
      var idPtn = /^[a-zA-Z0-9]+$/;
      var ratePtn = /^[1-9]\d*(\.\d+)?$/;
      if (
        payload !== undefined &&
        passworgPtn.test(password) &&
        idPtn.test(id) &&
        ratePtn.test(rate)
      ) {
        setLoaderVisible(true);
        setBtnVisible(false);
        APIService({
          url: `${process.env.REACT_APP_R_SITE_API}/user/register`,
          method: "POST",
          data: payload,
        })
          .then((data) => {
            dispatch(
              headerLoadChanged({
                headerLoad: !headerLoad,
              })
            );
            APISupport({
              url: process.env.REACT_APP_CS_SITE_USER_CREATE,
              method: "POST",
              data: {
                userid: id,
                password: password,
              },
            })
              .then((data) => { })
              .catch((err) => { })
              .finally(() => { });
            createSuccess();
            setId("");
            setNickname("");
            setMemo("");
            setRate("");
            setPassword("");
            setType(0);
            setFields([0, 0]);
            setCurrency("");
            setLanguage("");
            settime("");
          })
          .catch((err) => {
            setLoaderVisible(false);
            setBtnVisible(true);
            dispatch(
              showMessage({
                variant: "error",
                message: `${selectedLang[`${formatSentence(err?.error?.message)}`] ||
                  selectedLang.error_alert
                  }`,
              })
            );
          })
          .finally();
      } else {
        setLoaderVisible(false);
        setBtnVisible(true);
        if (!idPtn.test(id)) {
          dispatch(
            showMessage({
              variant: "error",
              message: `${selectedLang.id_should_contain_leters_and_numbers}`,
            })
          );
        } else if (!ratePtn.test(rate)) {
          dispatch(
            showMessage({
              variant: "error",
              message: `${selectedLang.rate_is_required}`,
            })
          );
        } else {
          dispatch(
            showMessage({
              variant: "error",
              message: `${selectedLang.password_should_contain_at_least_one}`,
            })
          );
        }
      }
    }
  };

  const createSuccess = () => {
    setLoaderVisible(false);
    setBtnVisible(true);
    dispatch(
      showMessage({
        variant: "success",
        message: `${selectedLang.user_created_successfuly}`,
      })
    );
  };
  const createFail = (message) => {
    setLoaderVisible(false);
    setBtnVisible(true);
    dispatch(
      showMessage({
        variant: "error",
        message: `${selectedLang.user_cration_failed}`,
      })
    );
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

  const handleNicknameChange = (e) => {
    const newNickname = e.target.value;

    const isValid = /^[a-zA-Z0-9]{1,30}$/.test(newNickname);

    setNickname(newNickname);
    setIsValidNickname(isValid);
  };




  const handleInputChange = (e) => {
    const inputValue = e.target.value;


    const isValidInput = /^(\d{0,30}(\.\d{0,30})?)?$/.test(inputValue);


    if (isValidInput || inputValue === "") {
      setRate(inputValue);
      setIsInvalidInput(false);
    } else {
      setIsInvalidInput(true);
    }
  };




  const handleIdChange = (e) => {
    const newId = e.target.value;
    const maxLength = 15; // Set your desired maximum length

    if (newId.length <= maxLength) {
      setId(newId);
      setIdError(false);
    } else {
      setIdError(true);
    }
  };

  return (
    <>
      {" "}
      {loaded ? (
        <FuseLoading />
      ) : (
        <FusePageSimple
          header={<CreateAgentAppHeader selectedLang={selectedLang} />}
          content={
            <Card
              sx={{ width: "100%", marginTop: "20px", borderRadius: "4px" }}
              className="main_card"
            >
              <div
                className="MyGridContainer"
                style={{ padding: "20px 30px 0px" }}
              >
                <div>
                  {loaderVisible && <div className="loader"></div>}
                  {/* {(role["role"] == "admin" || role["role"] == "cs") && (
                      <Grid xs={12} md={12}>
                        {" "}
                        <FormControl sx={{ width: "100%" }}>
                          <InputLabel id="type">
                            {selectedLang.providers}
                          </InputLabel>
                          <Select
                            fullWidth
                            size="samll"
                            labelId="type"
                            id="dAffiliated-Agent"
                            label={selectedLang.providers}
                            value={agentProvider}
                            onChange={handleChange}>
                            {providerDetails.map((provider) => {
                              return (
                                <MenuItem
                                  key={provider.provider_id}
                                  value={provider.provider_id}>
                                  {provider.provider_name}{" "}
                                  {selectedLang.provider}
                                </MenuItem>
                              );
                            })}
                          </Select>
                        </FormControl>
                      </Grid>
                    )} */}
                  <Grid
                    container
                    spacing={3}
                    sx={{
                      marginTop: "00px",
                    }}
                  >
                    <Grid xs={12} md={6}>
                      {" "}
                      <TextField
                        fullWidth
                        label={selectedLang.agent_name}
                        color="primary"
                        size="small"
                        value={user_id}
                        sx={{
                          marginBottom: "05px",
                        }}
                      />
                    </Grid>
                    <Grid xs={12} md={6}>
                      <TextField
                        size="small"
                        fullWidth
                        label={
                          <span>
                            {`${selectedLang.id}`}
                            <span style={{ color: "red" }}>*</span>
                          </span>
                        }
                        color="primary"
                        sx={{
                          marginBottom: "05px",
                        }}
                        InputLabelProps={{
                          shrink: true,
                        }}
                        value={id}
                        onChange={handleIdChange}
                        error={idError}
                        helperText={idError ? selectedLang.valid_id : ""}
                        maxLength={10} // Set the maximum length for the TextField
                      />
                    </Grid>
                    <Grid xs={12} md={6}>
                      <TextField
                        id="nick-name-input"
                        size="small"
                        fullWidth
                        label={
                          <span>
                            {`${selectedLang.nick_name}`}
                            <span style={{ color: "red" }}>*</span>
                          </span>
                        }
                        color={isValidNickname ? "primary" : "error"}
                        sx={{
                          marginBottom: "05px",
                        }}
                        value={nickname}
                        onChange={handleNicknameChange}
                        InputLabelProps={{
                          shrink: true,
                        }}
                        error={!isValidNickname}
                        helperText={
                          !isValidNickname && selectedLang.Invalid_nickname
                        }
                      />
                    </Grid>
                    <Grid xs={12} md={6}>
                      <FormControl
                        size="small"
                        sx={{ width: "100%" }}
                        variant="outlined"
                      >
                        <InputLabel
                          htmlFor="outlined-adornment-password"
                          shrink={true}
                          style={{ color: passwordError ? "red" : "inherit" }}
                        >
                          {passwordError
                            ? selectedLang.Invalid_Password
                            : `${selectedLang.password}`}{" "}
                          <span style={{ color: "red" }}>*</span>
                        </InputLabel>
                        <OutlinedInput
                          id="outlined-adornment-password"
                          autoComplete="off"
                          type={showPassword ? "text" : "password"}
                          endAdornment={
                            <InputAdornment position="end">
                              <IconButton
                                aria-label="toggle password visibility"
                                onClick={handleClickShowPassword}
                                onMouseDown={handleMouseDownPassword}
                                edge="end"
                              >
                                {showPassword ? (
                                  <VisibilityOff />
                                ) : (
                                  <Visibility />
                                )}
                              </IconButton>
                            </InputAdornment>
                          }
                          label={
                            passwordError
                              ? "Invalid Password"
                              : `${selectedLang.password}`
                          }
                          variant="outlined"
                          margin="dense"
                          value={password}
                          placeholder=""
                          onChange={handlePasswordChange}
                          // Set the error and helperText props based on the validation result
                          error={passwordError}
                          helperText={
                            passwordError
                              ? "Password cannot exceed 12 characters"
                              : ""
                          }
                        />
                      </FormControl>
                    </Grid>
                    <Grid xs={12} md={6}>
                      <TextField
                        fullWidth
                        size="small"
                        label={
                          isInvalidInput ? (
                            <span style={{ color: "red" }}>
                              {isInvalidInput && selectedLang.Invalid_input}
                            </span>
                          ) : (
                            selectedLang.rate || "Rate"
                          )
                        }
                        id="fullWidth"
                        type="text"
                        color="primary"
                        sx={{
                          marginBottom: "05px",
                        }}
                        InputLabelProps={{
                          shrink: true,
                          style: {
                            color: isInvalidInput ? "red" : "inherit",
                          },
                        }}
                        InputProps={{
                          style: {
                            borderBottomColor: isInvalidInput
                              ? "red"
                              : "inherit",
                          },
                        }}
                        error={isInvalidInput}
                        value={rate}
                        onChange={handleInputChange}
                      />
                    </Grid>
                    {/* <Grid xs={12} md={6}>
                        <TextField
                          fullWidth
                          label="Total Charged Amount"
                          id="fullWidth"
                          color="primary"
                          type="number"
                          value="100"
                          sx={{
                            marginBottom: "05px",
                          }}
                        />
                      </Grid> */}
                    <Grid xs={12} md={6}>
                      {" "}
                      <FormControl size="small" sx={{ width: "100%" }}>
                        <InputLabel id="type">
                          {`${selectedLang.type}`}{" "}
                          <span style={{ color: "red" }}>*</span>
                        </InputLabel>
                        <Select
                          fullWidth
                          labelId="type"
                          id="dAffiliated-Agent"
                          label={selectedLang.type}
                          value={type}
                          onChange={handleChange3}
                        >
                          {selectItem.map((data, index) => (
                            <MenuItem key={index} value={data.id}>
                              {selectedLang[`${data.type_name}`]}
                              {/* {data.type_name} */}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    {/* <Grid xs={12} md={6}>
                        <TextField
                          fullWidth
                          label="Percentage"
                          type="number"
                          inputProps={{
                            min: 1,
                            max: 100,
                          }}
                          onChange={handleChange2}
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">%</InputAdornment>
                            ),
                          }}
                        />
                      </Grid> */}
                    {role["role"] != "admin" ? (
                      <Grid xs={12} md={6}>
                        <div className="flex items-center flex-wrap">
                          <div className="flex">
                            <div className="flex justify-start items-center">
                              <h3 className="mr-3">
                                <b>{selectedLang.rpoint}</b>
                              </h3>
                              {/* {fields.length < 2 && (
                                  <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={handleAddField}
                                    className="ml-5">
                                    <AddCircleIcon />{" "}
                                    <span className="ml-2">
                                      {selectedLang.add}
                                    </span>
                                  </Button>
                                )} */}
                            </div>
                          </div>
                          <div
                            className="w-100"
                            style={{ width: "100%", marginTop: "15px" }}
                          >
                            <div>
                              {/* {fields.map((field, index) => ( */}
                              <div
                                //key={index}
                                className=""
                              >
                                <div className="">
                                  {" "}
                                  <TextField
                                    type="text"
                                    fullWidth
                                    size="small"
                                    className=""
                                    label={
                                      selectedprovider == 1
                                        ? `${selectedLang.rpoint_for_provider}`
                                        : `${selectedLang.rpoint_for_provider}`
                                    }
                                    // value={fields[rpointIndex]}
                                    // onChange={(event) =>
                                    // handleChange4(
                                    //   rpointIndex,
                                    //   event.target.value
                                    // )
                                    // }
                                    value={formatAmount(fields[rpointIndex])}
                                    onChange={(e) => {
                                      const inputValue = e.target.value;
                                      const numericValue = inputValue.replace(
                                        /[^0-9.]/g,
                                        ""
                                      );
                                      handleChange4(
                                        rpointIndex,
                                        numericValue
                                      );
                                    }}
                                  />
                                </div>
                                {/* {fields.length > 1 && (
                                      <div className="flex justify-center items-center">
                                        <IconButton
                                          onClick={() =>
                                            handleRemoveField(index)
                                          }>
                                          <RemoveCircleIcon />
                                        </IconButton>
                                      </div>
                                    )} */}
                              </div>
                              {/* ))} */}
                            </div>
                          </div>
                        </div>
                      </Grid>
                    ) : (
                      <Grid xs={12} md={6}>
                        <TextField
                          size="small"
                          sx={{
                            width: "100%",
                            marginBottom: "20px",
                          }}
                          type="text"
                          fullWidth
                          className="flex-auto grow"
                          label={
                            agentProvider == 1
                              ? `${selectedLang.amount}`
                              : `${selectedLang.amount}`
                          }
                          value={formatAmount(fields[agentProvider - 1])}
                          onChange={(e) => {
                            const inputValue = e.target.value;
                            const numericValue = inputValue.replace(
                              /[^0-9.]/g,
                              ""
                            );
                            handleChange4(agentProvider - 1, numericValue);
                          }}
                        />
                        <FormControl sx={{ width: "100%" }}>
                          <TextField
                            sx={{ marginBottom: "20px" }}
                            id="outlined-select-currency"
                            size="small"
                            select
                            label={
                              <span>
                                {`${selectedLang.currency}`}
                                <span style={{ color: "red" }}>*</span>
                              </span>
                            }
                            InputLabelProps={{
                              shrink: true,
                            }}
                            value={currency}
                            onChange={handleCurrency}
                          >
                            {providerCurrency.length > 0 &&
                              providerCurrency.map((currency) => (
                                <MenuItem
                                  key={currency.currency_id}
                                  value={currency.currency_name}
                                >
                                  {currency.currency_name}
                                </MenuItem>
                              ))}
                          </TextField>
                          {/* <InputLabel id="type">
                           {`${selectedLang.currency}`} <span style={{ color: 'red' }}>*</span>
                        </InputLabel>
                        <Select
                          fullWidth
                          // labelId="type"
                          id="dAffiliated-Agent"
                          sx={{marginBottom:"20px"}}
                          label={selectedLang.currency}
                          value={currency}
                          onChange={handleCurrency}>    
                          {providerCurrency.length > 0 &&
                            providerCurrency.map((currency) => 
                             (
                                <MenuItem
                                  key={currency.currency_id}
                                  value={currency.currency_name}>
                                  {currency.currency_name}
                                </MenuItem>
                              )
                            )}
                        </Select> */}
                        </FormControl>
                        <FormControl sx={{ width: "100%" }}>
                          {/* <InputLabel id="type">
                          {`${selectedLang.time_zone}*`}
                        </InputLabel> */}
                          {/* <Select
                          fullWidth
                          labelId="type"
                          sx={{marginBottom:"20px"}}
                          id="dAffiliated-Agent"
                          label={selectedLang.time_zone}
                          value={time}
                          onChange={handletime}
                        >
                          {moment.tz.names().map((tz) => (
                            <MenuItem key={tz} value={tz}>
                              {tz}
                            </MenuItem>
                          ))}
                        </Select> */}
                          <Autocomplete
                            onChange={handletime}
                            className="datatextbox"
                            variant="outlined"
                            disablePortal
                            size="small"
                            id="combo-box-demo"
                            options={moment.tz.names().map((tz) => ({
                              label: tz,
                              value: tz,
                            }))}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                className="textSearch"
                                label={
                                  <span>
                                    {`${selectedLang.time_zone}`}
                                    <span style={{ color: "red" }}>*</span>
                                  </span>
                                }
                                InputLabelProps={{ shrink: true }}
                              />
                            )}
                          />
                        </FormControl>
                        <div>
                          {selectedprovider == 1 && (
                            <>
                              {agentHoldingSummary.length > 0 &&
                                agentHoldingSummary[0].rpoint_access.USD ? (
                                <FormHelperText id="my-helper-text">
                                  {agentHoldingSummary[0]?.give_money.USD?.toLocaleString()}{" "}
                                  USD{" "}
                                  {selectedLang.Amount_Can_given_for_Agent}
                                </FormHelperText>
                              ) : (
                                <FormHelperText id="my-helper-text">
                                  {selectedLang.Agent_Distribution_Money}{" "}
                                  {agentHoldingSummary[0]?.give_money.USD?.toLocaleString()}{" "}
                                  -{selectedLang.Cant_given_USD_for_Agent}
                                </FormHelperText>
                              )}
                              {agentHoldingSummary.length > 0 &&
                                agentHoldingSummary[0].rpoint_access.EUR ? (
                                <FormHelperText id="my-helper-text">
                                  {agentHoldingSummary[0]?.give_money.EUR?.toLocaleString()}{" "}
                                  EUR{" "}
                                  {selectedLang.Amount_Can_given_for_Agent}
                                </FormHelperText>
                              ) : (
                                <FormHelperText id="my-helper-text">
                                  {selectedLang.Agent_Distribution_Money}{" "}
                                  {agentHoldingSummary[0]?.give_money.EUR?.toLocaleString()}{" "}
                                  -{selectedLang.Cant_given_EUR_for_Agent}
                                </FormHelperText>
                              )}
                              {agentHoldingSummary.length > 0 &&
                                agentHoldingSummary[0].rpoint_access.KRW ? (
                                <FormHelperText id="my-helper-text">
                                  {agentHoldingSummary[0]?.give_money.KRW?.toLocaleString()}{" "}
                                  KRW{" "}
                                  {selectedLang.Amount_Can_given_for_Agent}
                                </FormHelperText>
                              ) : (
                                <FormHelperText id="my-helper-text">
                                  {selectedLang.Agent_Distribution_Money}{" "}
                                  {agentHoldingSummary[0]?.give_money.KRW?.toLocaleString()}{" "}
                                  -{selectedLang.Cant_given_KRW_for_Agent}
                                </FormHelperText>
                              )}
                              {agentHoldingSummary.length > 0 &&
                                agentHoldingSummary[0].rpoint_access.JPY ? (
                                <FormHelperText id="my-helper-text">
                                  {agentHoldingSummary[0]?.give_money.JPY?.toLocaleString()}{" "}
                                  JPY{" "}
                                  {selectedLang.Amount_Can_given_for_Agent}
                                </FormHelperText>
                              ) : (
                                <FormHelperText id="my-helper-text">
                                  {selectedLang.Agent_Distribution_Money}{" "}
                                  {agentHoldingSummary[0]?.give_money.JPY} -
                                  {selectedLang.Cant_given_JPY_for_Agent}
                                </FormHelperText>
                              )}
                            </>
                          )}
                          {selectedprovider == 2 && (
                            <>
                              {agentHoldingSummary.length > 0 &&
                                agentHoldingSummary[0].rpoint_access ? (
                                <FormHelperText id="my-helper-text">
                                  {agentHoldingSummary[0]?.give_money.toLocaleString()}{" "}
                                  {selectedLang.Amount_Can_given_for_Agent}
                                </FormHelperText>
                              ) : (
                                <FormHelperText id="my-helper-text">
                                  {selectedLang.Agent_Distribution_Money}{" "}
                                  {agentHoldingSummary[0]?.give_money?.toLocaleString()}{" "}
                                  - {selectedLang.Cant_given_for_Agent}
                                </FormHelperText>
                              )}
                            </>
                          )}
                        </div>
                      </Grid>
                    )}
                    <Grid xs={12} md={6}>
                      {(role["role"] == "admin" || role["role"] == "cs") && (
                        <>
                          <FormControl sx={{ width: "100%" }}>
                            <TextField
                              InputLabelProps={{
                                shrink: true,
                              }}
                              size="small"
                              id="outlined-select-currency"
                              select
                              label={
                                <span>
                                  {`${selectedLang.language}`}
                                  <span style={{ color: "red" }}>*</span>
                                </span>
                              }
                              sx={{ marginBottom: "20px" }}
                              value={language}
                              onChange={handleLanguage}
                            >
                              {providerLanguage.length > 0 &&
                                providerLanguage.map((language) => {
                                  return (
                                    <MenuItem
                                      key={language.language_id}
                                      value={language.language_name}
                                    >
                                      {language.language_name}
                                    </MenuItem>
                                  );
                                })}
                            </TextField>
                            {/* <InputLabel id="select-language">
                            {`${selectedLang.language}`} <span style={{ color: 'red' }}>*</span>
                          </InputLabel>
                          <Select
                            required                         
                            fullWidth
                            labelId="select-language"
                            id="dAffiliated-Agent"
                            label={selectedLang.language}
                            sx={{marginBottom:"20px"}}
                            value={language}
                            onChange={handleLanguage}>
                            {providerLanguage.length > 0 &&
                              providerLanguage.map((language) => {
                                return (
                                  <MenuItem
                                    key={language.language_id}
                                    value={language.language_name}>
                                    {language.language_name}
                                  </MenuItem>
                                );
                              })}
                          </Select> */}
                          </FormControl>
                          <div className="pt-5"></div>
                        </>
                      )}
                      <TextField
                        fullWidth
                        size="small"
                        variant="outlined"
                        className="memo_input"
                        label={selectedLang.memo}
                        // placeholder={selectedLang.memo}
                        multiline
                        rows={5}
                        maxRows={10}
                        value={memo}
                        onChange={(e) => {
                          setMemo(e.target.value);
                        }}
                      />
                    </Grid>
                  </Grid>
                </div>
                <div className="flex justify-end items-center mt-10 mb-8 p-16">
                  {BtnVisible && (
                    <Button
                      className="flex item-center"
                      variant="outlined"
                      color="secondary"
                      startIcon={<CancelIcon size={20}></CancelIcon>}
                      sx={{
                        borderRadius: "4px",
                      }}
                      onClick={(e) => cancelCreation(e)}
                    >
                      {selectedLang.cancellation}
                    </Button>
                  )}
                  {BtnVisible && (
                    <Button
                      className="flex item-center ml-8"
                      variant="contained"
                      color="secondary"
                      endIcon={<CheckCircleIcon size={20}></CheckCircleIcon>}
                      sx={{
                        borderRadius: "4px",
                      }}
                      onClick={(e) => submitUserDetails(e)}
                    >
                      {selectedLang.produce}
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          }
        />
      )}
    </>
  );
}

export default createAgentApp;
