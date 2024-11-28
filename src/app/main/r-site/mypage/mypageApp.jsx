/** @format */
 
import React from "react";
import FusePageSimple from "@fuse/core/FusePageSimple";
import { FormGroup, Checkbox } from '@mui/material';
import MypageHeader from "./mypageHeader";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { locale } from "../../../configs/navigation-i18n";
import Grid from "@mui/material/Grid";
import {
  Alert,
  Button,
  CardActionArea,
  CardActions,
  MenuItem,
  Select,
  Switch,
} from "@mui/material";
import Card from "@mui/material/Card";
import Modal from "@mui/material/Modal";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import "./mypage.css";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import Box from "@mui/material/Box";
import { showMessage } from "app/store/fuse/messageSlice";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import InputAdornment from "@mui/material/InputAdornment";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import OutlinedInput from "@mui/material/OutlinedInput";
import CancelIcon from "@mui/icons-material/Cancel";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import DataHandler from "src/app/handlers/DataHandler";
import jwtDecode from "jwt-decode";
import APIService from "src/app/services/APIService";
import { v4 as uuidv4 } from "uuid";
import moment from "moment";
import APISupport from "src/app/services/APISupport";
import { copyToClipBoard, formatSentence } from "src/app/services/Utility";
import FuseLoading from "@fuse/core/FuseLoading/FuseLoading";
import queryString from "query-string";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import { Autocomplete, createFilterOptions } from "@mui/material";
 
const filter = createFilterOptions();
 
function mypageApp() {
  const dispatch = useDispatch();
  const uuid = uuidv4();
  const [selectLocale] = useSelector((state) => [state.locale.selectLocale]);
  const [selectedLang, setSelectedLang] = useState(locale.en);
  const [userParentDetails, setUserParentDetails] = useState("");
  const [userDetails, setUserDetails] = useState("");
  const [holdingDetails, setHoldingDetails] = useState([]);
  const [allowedIPs, setAllowedIPs] = useState("");
  const [changeBalanceCallbackURL, setChangeBalanceCallbackURL] = useState("");
  const [balanceCallbackURL, setBalanceCallbackURL] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [accountNum, setAccounNum] = useState("");
  const [error, setError] = useState(false);
  const [type, setType] = useState("");
  const [subAgentCount, setSubAgentCount] = useState(0);
  const [subAgentNumber,setsubAgentNumber] = useState(0);
  const [lowLevelUserCount, setLowLevelUserCount] = useState(0);
  const [time, settime] = useState("");
  const user_id = DataHandler.getFromSession("user_id");
  const [adminBalance, setAdminBalance] = useState(0);
  const [role, setRole] = useState(
    jwtDecode(DataHandler.getFromSession("accessToken"))["data"]
  );
  const [changePassword, setChangePassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [currentPassword, setCurrentPassword] = useState("");
  const [APIkeys, SetAPIKeys] = useState([]);
 
  const [openStatus, setOpenStatus] = React.useState(false);
  const [wallet, setWallet] = React.useState("");
 
  const [loading, setLoaded] = useState(true);
  const [loading1, setLoading1] = useState(true);
  const [loading3, setLoading3] = useState(true);
  const [loading4, setLoading4] = useState(true);
  const [loading5, setLoading5] = useState(true);
 
  const [names, setNames] = useState("");
 
  const [inputValue, setInputValue] = useState("");
  const [selectedNames, setSelectedNames] = useState([]);
  const [discloseAPIKEY, setdiscloseAPIKEY] = useState(false)

 
  useEffect(() => {
    if (
      loading1 == false &&
      //loading2 == false &&
      loading3 == false &&
      loading4 == false &&
      loading5 == false
    ) {
      setLoaded(false);
    }
  }, [loading1, loading3, loading4, loading5]);
 
  useEffect(() => {
    if (selectLocale == "ko") {
      setSelectedLang(locale.ko);
    } else {
      setSelectedLang(locale.en);
    }
  }, [selectLocale]);
 
  useEffect(() => {
    getUserHoldings();
    getUserDetails();
    getTypes();
  }, []);
 
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
 
  const { search } = window.location;
  const { agent_id } = queryString.parse(search);
 
  // const { passwordopen } = queryString.parse(search);
 
  const [admincasinousers, _admincasinoUsers] = useState(0);
 
  const getUserDetails = () => {
    let user_id_detailed;
    if (agent_id) {
      user_id_detailed = agent_id;
    } else {
      user_id_detailed = user_id;
    }
    APIService({
      url: `${process.env.REACT_APP_R_SITE_API}/user/details?user_id=${user_id_detailed}`,
      method: "GET",
    })
      .then((data) => {
        setUserParentDetails(data.data.data[0]?.parentDetails[0]?.id);
        setUserDetails(data.data.data[0]);
        settime(data.data.data[0]?.time);
        SetAPIKeys(data.data.data[0]?.apiKey);
        if(data.data.data[0]?.apiKey?.length!==0){
          setdiscloseAPIKEY(true)
        }
        setAccounNum(data.data.data[0]?.accountNum);
        setNames(data.data.data[0]?.allowedIPs);
        setSelectedNames(data.data.data[0]?.allowedIPs);
        setAllowedIPs(data.data.data[0]?.allowedIPs);
        setBalanceCallbackURL(data.data.data[0]?.balancecallbackURL);
        setChangeBalanceCallbackURL(
          data.data.data[0]?.changeBalancecallbackURL
        );
 
        if (data.data.data[0]?.subAgentCount > 0) {
          setSubAgentCount(data.data.data[0]?.subAgentCount);
        }
        if (data.data.data[0]?.subAgentNumber > 0) {
          setsubAgentNumber(data.data.data[0]?.subAgentNumber);
        }
        if (data.data.data[0]?.lowlevelUsersCount > 0) {
          setLowLevelUserCount(data.data.data[0]?.lowlevelUsersCount);
        }
        _admincasinoUsers(data?.data?.data[0]?.admin_casinousers);
      })
      .catch((e) => {
        console.log(e);
      })
      .finally(() => {
        setLoading1(false);
      });
  };
 
  function dateFormat(date) {
    var d = new Date(date);
    var date = d.getDate();
    var month = d.getMonth() + 1; // Since getMonth() returns month from 0-11 not 1-12
    var year = d.getFullYear();
    var newDate = year + "-" + month + "-" + date;
    return newDate;
  }
 
  
 
  const getTypes = () => {
    APIService({
      url: `${process.env.REACT_APP_R_SITE_API}/type/get-type`,
      method: "GET",
    })
      .then((data) => {
        setType(data.data.data);
      })
      .catch((e) => { })
      .finally(() => {
        setLoading3(false);
      });
  };
 
  const getUserHoldings = () => {
    let user_id_detailed;
    if (agent_id) {
      user_id_detailed = agent_id;
    } else {
      user_id_detailed = user_id;
    }
    APIService({
      url: `${process.env.REACT_APP_R_SITE_API
        }/user/user-holding-details?user_id=${user_id_detailed}&provider=${1}&provider_id=${1}`,
      method: "GET",
    })
      .then((data) => {
        setHoldingDetails(data.data.data[0]);
        setAdminBalance(data.adminBalance);
      })
      .catch((e) => { })
      .finally(() => {
        setLoading4(false);
      });
  };
 
  const handleChangeAPIKey = (index, value) => {
    const list = [...APIkeys];
    list[index] = value;
    SetAPIKeys(list);
  };
 

 
  const handleAddField = async () => {
    let user_id_detailed;
    if (agent_id) {
      user_id_detailed = agent_id;
    } else {
      user_id_detailed = user_id;
    }
    const list = [...APIkeys];
    list[APIkeys.length] = uuid;
    SetAPIKeys(list);
    setOpenStatus(true);
  };
 
  const handleWalletChange = (event) => {
    let user_id_detailed;
    if (agent_id) {
      user_id_detailed = agent_id;
    } else {
      user_id_detailed = user_id;
    }
    if (event.target.value != "") {
      setWallet(event.target.value);
    } else {
      dispatch(
        showMessage({
          variant: "success",
          message: `${selectedLang.select_wallet_wrong}`,
        })
      );
    }
  };
 
  
  const handleIPChange = () => {
    // Regular expression for IP validation
    const ipString = selectedNames
    let ipArray;

    if(typeof ipString === "string"){
      ipArray = ipString.split(",");
    }else{
      ipArray=selectedNames
    }

    
    const ipCheckBtn =
    /^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    
    // Validating each selected IP
    const invalidIPs = ipArray.filter(
      (ip) => !ipCheckBtn.test(ip.trim())
    );
   

    if (invalidIPs.length > 0 && ipArray[0] !== "") {
      return dispatch(
        showMessage({
          variant: "error",
          message: `${selectedLang.enter_valid_ip}`,
        })
      );
    }
 
    let user_id_detailed;
    if (agent_id) {
      user_id_detailed = agent_id;
    } else {
      user_id_detailed = user_id;
    }

 
      APIService({
      url: `${process.env.REACT_APP_R_SITE_API}/user/change-allow-ips`,
      method: "PUT",
      data: {
        user_id: user_id_detailed,
        allow_ips: selectedNames.toString(),
      },
    })
      .then((data) => {
          dispatch(
          showMessage({
            variant: "success",
            message: `${selectedLang.ip_changed}`,
          })
        );
      })
      .catch((e) => {
        dispatch(
          showMessage({
            variant: "error",
            message: `${selectedLang[`${formatSentence(e?.error?.message)}`] ||
              e?.error?.message
              }`,
          })
        );
      })
      .finally(() => { });
    
  };
 
  function isValidUrl(url) {
    try {
      new URL(url);
      return true;
    } catch (error) {
      return false;
    }
  }
 
  const handletime = (event, newValue) => {
    settime(newValue?.value || "");
  };
 
  const handleCloseStatus = () => {
    setOpenStatus(false);
    SetAPIKeys([]);
  };

  const handleSaveStatus = () => {
    let user_id_detailed;
    if (agent_id) {
      user_id_detailed = agent_id;
    } else {
      user_id_detailed = user_id;
    }
    APIService({
      url: `${process.env.REACT_APP_R_SITE_API}/user/change-api-key`,
      method: "PUT",
      data: {
        api_key: APIkeys,
        wallet_type: wallet,
        user_id: user_id_detailed,
      },
    })
      .then((data) => {
        dispatch(
          showMessage({
            variant: "success",
            message: `${selectedLang.api_key_changed}`,
          })
        );

        setdiscloseAPIKEY(true)
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
      .finally(() => {
        getUserDetails();
        setOpenStatus(false);
        setWallet("");
      });
  };
 
  const handleURLChange = () => {
    let user_id_detailed;
    if (agent_id) {
      user_id_detailed = agent_id;
    } else {
      user_id_detailed = user_id;
    }
    if (
      isValidUrl(changeBalanceCallbackURL) ||
      isValidUrl(balanceCallbackURL)
    ) {
      APIService({
        url: `${process.env.REACT_APP_R_SITE_API}/user/change-callback-url`,
        method: "PUT",
        data: {
          user_id: user_id_detailed,
          callback_url: {
            changeBalancecallbackURL: changeBalanceCallbackURL,
            balancecallbackURL: balanceCallbackURL,
          },
        },
      })
        .then((data) => {
          getUserDetails();
          dispatch(
            showMessage({
              variant: "success",
              message: `${selectedLang.callback_URL_changed}`,
            })
          );
        })
        .catch((e) => {
          dispatch(
            showMessage({
              variant: "error",
              message: `${selectedLang[`${formatSentence(e?.error?.message)}`] ||
                e?.error?.message
                }`,
            })
          );
        })
        .finally(() => { });
    } else {
      dispatch(
        showMessage({
          variant: "error",
          message: `${selectedLang.url_is_wrong}`,
        })
      );
    }
  };
 
  function isValidNumber(number) {
    return !isNaN(number) && isFinite(number);
  }
 
  const handleTimeZoneChange = () => {
    let user_id_detailed;
    if (agent_id) {
      user_id_detailed = agent_id;
    } else {
      user_id_detailed = user_id;
    }
    if (time == "") {
      dispatch(
        showMessage({
          variant: "error",
          message: `${selectedLang.time_zone_is_requried}`,
        })
      );
    } else {
      APIService({
        url: `${process.env.REACT_APP_R_SITE_API}/user/change-time-zone`,
        method: "PUT",
        data: {
          user_id: user_id_detailed,
          time_zone: time,
        },
      })
        .then((data) => {
          dispatch(
            showMessage({
              variant: "success",
              message: `Time zone changed success`,
            })
          );
        })
        .catch((e) => { })
        .finally(() => { });
    }
  };
 
  const handleAccountNumChange = () => {
    let user_id_detailed;
    if (agent_id) {
      user_id_detailed = agent_id;
    } else {
      user_id_detailed = user_id;
    }
    if (accountNum == "") {
      dispatch(
        showMessage({
          variant: "error",
          message: `${selectedLang.account_number_required}`,
        })
      );
    } else {
      if (isValidNumber(accountNum)) {
        APIService({
          url: `${process.env.REACT_APP_R_SITE_API}/user/change-account-no`,
          method: "PUT",
          data: {
            user_id: user_id_detailed,
            account_no: accountNum,
          },
        })
          .then((data) => {
            dispatch(
              showMessage({
                variant: "success",
                message: `${selectedLang.account_number_changed}`,
              })
            );
          })
          .catch((e) => { })
          .finally(() => { });
      } else {
        dispatch(
          showMessage({
            variant: "error",
            message: `${selectedLang.account_number_is_wrong}`,
          })
        );
      }
    }
  };
 
  const handleRemoveField = (index) => {
    const newFields = [...APIkeys];
    newFields.splice(index, 1);
    SetAPIKeys(newFields);
  };

  const ipRegex = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])$/;
  const validateInput = (value) => {
    const values = value.split(',').map((ip) => ip.trim());
    return values.every((ip) => ip === '' || ipRegex.test(ip));
  };
 
  const [value, setValue] = React.useState("1");
 
  const handleChange2 = (event, newValue) => {
    setValue(newValue);
  };
  const [showPassword, setShowPassword] = React.useState(false);
 
  const [showNewPassword, setShowNewPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmpassword] = React.useState(false);
 
  const handleClickShowPassword = () => setShowPassword((show) => !show);
 
  const handleClickShowNewPassword = () => setShowNewPassword((show) => !show);
 
  const handleClickShowConfirmPassword = () =>
    setShowConfirmpassword((show) => !show);
 
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };
  const handleChangePassword = () => {
    if (!changePassword || !confirmPassword || !currentPassword) {
      dispatch(
        showMessage({
          variant: "error",
          message: `${selectedLang.please_enter_valid_password}`,
        })
      );
    } else {
      if (changePassword === confirmPassword) {
        let user_id_detailed;
        if (agent_id) {
          user_id_detailed = agent_id;
        } else {
          user_id_detailed = user_id;
        }
        // /change-password
        APIService({
          url: `${process.env.REACT_APP_R_SITE_API}/user/change-password`,
          method: "POST",
          data: {
            user_id: user_id_detailed,
            password: currentPassword,
            changePassword: confirmPassword,
          },
        })
          .then((data) => {
            APISupport({
              url: process.env.REACT_APP_CS_SITE_RESET_PW,
              method: "POST",
              data: {
                userId: userDetails?.id,
                password: confirmPassword,
              },
            })
              .then((data) => { })
              .catch((err) => { })
              .finally(() => { });
            setChangePassword("");
            setConfirmPassword("");
            setCurrentPassword("");
            dispatch(
              showMessage({
                variant: "success",
                message: `${selectedLang.password_changed_successfully}`,
              })
            );
          })
          .catch((err) => {
            setChangePassword("");
            setConfirmPassword("");
            setCurrentPassword("");
            dispatch(
              showMessage({
                variant: "error",
                message: `${selectedLang[`${formatSentence(err?.error?.message)}`] ||
                  selectedLang.something_went_wrong
                  }`,
              })
            );
          })
          .finally(() => { });
      } else {
        dispatch(
          showMessage({
            variant: "error",
            message: `${selectedLang.new_password_comfirm_pass_not_matched}`,
          })
        );
      }
    }
  };
  const [agentNames, setAgentName] = useState([]);
  const [selectedprovider] = useSelector((state) => [
    state.provider.selectedprovider,
  ]);
  const getAgentName = () => {
    let user_id_detailed;
    if (agent_id) {
      user_id_detailed = agent_id;
    } else {
      user_id_detailed = user_id;
    }
    APIService({
      url: `${process.env.REACT_APP_R_SITE_API}/user/agent-name-list?user_id=${user_id_detailed}&provider=${selectedprovider}`,
      method: "GET",
    })
      .then((res) => {
        setAgentName(res.data.data.UserDataResult.subAgentUsers);
      })
      .catch((err) => {
        setAgentName([]);
      })
      .finally(() => {
        setLoading5(false);
      });
  };
 
  useEffect(() => {
    getAgentName();
  }, []);
 
  const [changethisAgentPsw, _changethisAgentPsw] = useState("");
 
  const handleSelectAgent = ({ target }) => {
    _changethisAgentPsw(target.value);
  };
 
  const handleChangeAgentPassword = () => {
    let user_id_detailed;
    if (agent_id) {
      user_id_detailed = agent_id;
    } else {
      user_id_detailed = user_id;
    }
    if (
      changePassword == "" ||
      confirmPassword == "" ||
      changethisAgentPsw == ""
    ) {
      return dispatch(
        showMessage({
          variant: "error",
          message: `${selectedLang.please_enter_valid_data}`,
        })
      );
    }
 
    if (changePassword === confirmPassword) {
      // /change-password
      APIService({
        url: `${process.env.REACT_APP_R_SITE_API}/user/change-sub-agent-password`,
        method: "PUT",
        data: {
          user_id: changethisAgentPsw,
          agent_id: user_id_detailed,
          changePassword: confirmPassword,
        },
      })
        .then((data) => {
          dispatch(
            showMessage({
              variant: "success",
              message: `${selectedLang.password_changed_successfully}`,
            })
          );
        })
        .catch((err) => {
          dispatch(
            showMessage({
              variant: "error",
              message: "error",
              message: `${selectedLang[`${formatSentence(err?.message)}`] ||
                selectedLang.something_went_wrong
                }`,
            })
          );
        })
        .finally(() => { });
    } else {
      dispatch(
        showMessage({
          variant: "error",
          message: `${selectedLang.new_password_comfirm_pass_not_matched}`,
        })
      );
    }
  };
 
  const CancelFunction = () => {
    setCurrentPassword("");
    setChangePassword("");
    setConfirmPassword("");
  };
 
  const changePaymentStatus = (checked) => {
    let user_id_detailed;
    if (agent_id) {
      user_id_detailed = agent_id;
    } else {
      user_id_detailed = user_id;
    }
 
    APIService({
      url: `${process.env.REACT_APP_R_SITE_API}/user/change-can-payment`,
      method: "PUT",
      data: {
        user_id: user_id_detailed,
        status: checked,
      },
    })
      .then((data) => {
        getUserDetails();
        dispatch(
          showMessage({
            variant: "success",
            message: `${checked
              ? selectedLang.user_payment_function_enabled
              : selectedLang.user_payment_function_disable
              }`,
          })
        );
      })
      .catch((err) => {
        dispatch(
          showMessage({
            variant: "error",
            message: `${
              // selectedLang[`${formatSentence(err?.message)}`] ||
              selectedLang.something_went_wrong
              }`,
          })
        );
      })
      .finally(() => { });
  };
 
  const [username, setUsername] = useState("");
  const [old_secret_key, _old_secret_key] = useState("");
  const [new_secret_key, _new_secret_key] = useState("");
 
  const [secret_key, _secret_key] = useState("");
  const [isInvalidInput, setIsInvalidInput] = useState(false);
 
  const [filterCurr, _filterCurr] = useState("Update key");
  const handleChangeCurrency = (value, newValue) => {
    _filterCurr(newValue?.value);
  };
 
  const handleUpdateSecret = () => {
    if (
      filterCurr == "Update key" &&
      (!username || !new_secret_key || !old_secret_key)
    ) {
      return dispatch(
        showMessage({
          variant: "error",
          message: `${selectedLang.please_enter_valid_data}`,
        })
      );
    }
 
    if (filterCurr != "Update key" && (!username || !secret_key)) {
      return dispatch(
        showMessage({
          variant: "error",
          message: `${selectedLang.please_enter_valid_data}`,
        })
      );
    }
 
    APIService({
      url: `${process.env.REACT_APP_R_SITE_API}/user/add-update-login-secret`,
      method: "POST",
      data: {
        user_name: username,
        secret_key: secret_key,
        old_secret_key: old_secret_key,
        new_secret_key: new_secret_key,
        action: filterCurr == "Update key" ? 1 : 0,
      },
    })
      .then((data) => {
        getUserDetails();
        dispatch(
          showMessage({
            variant: "success",
            message:
              filterCurr == "Update key"
                ? `${selectedLang.secret_key_updated}`
                : `${selectedLang.secret_key_added}`,
          })
        );
      })
      .catch((err) => {
        dispatch(
          showMessage({
            variant: "error",
            message: `${`${selectedLang[`${formatSentence(err?.error?.message)}`] ||
              selectedLang[`${formatSentence(err?.data?.message)}`] ||
              err?.data?.message
              }`
              // selectedLang.something_went_wrong
              }`,
          })
        );
      })
      .finally(() => {
        setUsername("");
        _old_secret_key("");
        _new_secret_key("");
        _secret_key("");
      });
  };
 
  const CancelFunctionSecret = () => {
    setUsername("");
    _old_secret_key("");
    _new_secret_key("");
    _secret_key("");
  };

   const handleInputChange2 = (event) => {
    setSelectedNames(event.target.value)
  }
 
  const handleInputChange = (e) => {
    const inputText = e.target.value;
    const isValid = !/[^0-9]/.test(inputText);
    setError(!isValid);
    setAccounNum(inputText);
 
    // If the input is invalid, you can choose to show the invalid value in red
    if (!isValid) {
      e.target.style.color = "red";
    } else {
      e.target.style.color = ""; // Reset the color to default
    }
  };

 
  return (
    <>
      {loading ? (
        <FuseLoading />
      ) : (
        <FusePageSimple
          header={<MypageHeader selectedLang={selectedLang} />}
          content={
            <Card
              sx={{ width: "100%", marginTop: "20px", borderRadius: "4px" }}
              className="main_card"
            >
              <div className="flex justify-start justify-items-center bg-gray p-10 list_title w-100">
                <span className="list-title">
                  {selectedLang.Setting_and_Information}
                </span>
              </div>
 
              <div>
                <Modal
                  open={openStatus}
                  onClose={handleCloseStatus}
                  className="small_modal"
                  aria-labelledby="modal-modal-title"
                  aria-describedby="modal-modal-description"
                >
                  <Box sx={style} className="Mymodal">
                    <button className="modalclosebtn" onClick={handleCloseStatus}>
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
                      style={{ fontWeight: "700", fontSize: "23px" }}
                    >
                      {selectedLang.select_wallet}
                    </Typography>
                    <div style={{ paddingTop: "15px" }}>
                    <RadioGroup
                        row
                        aria-labelledby="demo-row-radio-buttons-group-label"
                        name="row-radio-buttons-group"
                        className="radioBtn"
                        value={wallet}
                        onChange={handleWalletChange}
                      >
                        <FormControlLabel
                          value="transfer"
                          control={<Radio />}
                          label={selectedLang.transfer_wallet}
                        />
                          <FormControlLabel
                          value="seamless"
                          control={<Radio />}
                          label={selectedLang.seamless_wallet}
                        />
                    </RadioGroup>
                      {/* <FormGroup row className="checkboxGroup">
                        <div style={{color:"#fff"}}>
                          <FormControlLabel
                          control={
                            <Checkbox
                              checked={checked}
                              // onChange={handleWalletChange}
                              name="transfer"
                            />
                          }
                          label={selectedLang.transfer_wallet}
                        />
                        </div>
                      </FormGroup> */}
                      <div style={{ paddingTop: "15px" }}>
                        <Button
                          className="buttonbox"
                          variant="contained"
                          color="secondary"
                          size="small"
                          sx={{
                            borderRadius: "4px",
                            display: "inline-block",
                            marginRight: "10px",
                          }}
                          onClick={() => {
                            handleSaveStatus();
                          }}
                        >
                          {selectedLang.save}
                        </Button>
                        <Button
                          className="buttonbox"
                          variant="contained"
                          color="secondary"
                          size="small"
                          sx={{
                            borderRadius: "4px",
                            display: "inline-block",
                          }}
                          onClick={() => {
                            handleCloseStatus();
                          }}
                        >
                          {selectedLang.cancel_n}
                        </Button>
                      </div>
                    </div>
                  </Box>
                </Modal>
                <CardContent>
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
                          label={selectedLang.basic}
                          value="1"
                          className="tab_btn"
                        />
                        {role["role"] != "cs" && (
                          <Tab
                            label={selectedLang.change_password}
                            value="2"
                            className="tab_btn"
                          />
                        )}
                        {role?.role == "admin" && (
                          <Tab
                            label={selectedLang.manage_login_secret}
                            value="4"
                            className="tab_btn"
                          />
                        )}
                        {/* <Tab label={selectedLang.Change_agent_password} value="3" className="tab_btn" /> */}
                      </TabList>
                    </Box>
                    <TabPanel value="1" className="common_tab_content">
                      <div className="mypage_basic_wrapper">
                        <div className="mypage_box">
                          <div className="mypage_row">
                            <Typography className="mypage_row_lable">
                              {selectedLang.classification}
                            </Typography>
                            <span>:-</span>
                            <Typography
                              sx={{
                                fontSize: 14,
                                color: "#fff",
                              }}
                            >
                              {selectedLang.Sales} 1
                            </Typography>
                          </div>
 
                          {role["role"] != "admin" && (
                            <>
                              <div className="mypage_row">
                                <Typography className="mypage_row_lable">
                                  {selectedLang.type}
                                </Typography>
                                <span>:-</span>
                                <Typography
                                  sx={{
                                    fontSize: 14,
                                    color: "#fff",
                                  }}
                                >
                                  {
                                    selectedLang[
                                      `${type[userDetails["type"]]?.type_name}`
                                    ]?.split(" ")[0]
                                  }
                                </Typography>
                              </div>
                              <div className="mypage_row">
                                <Typography className="mypage_row_lable">
                                  {selectedLang.affiliate_agent}
                                </Typography>
                                <span>:-</span>
                                {userDetails?.parentDetails?.map((parent, index) => {
                                  return (
                                    <Typography
                                      key={index}
                                      sx={{
                                        fontSize: 14,
                                        color: "#fff",
                                      }}
                                    >
                                      {parent?.id}
                                    </Typography>
                                  );
                                })}
                              </div>
                            </>
                          )}
 
                          <div className="mypage_row">
                            <Typography className="mypage_row_lable">
                              {selectedLang.id}
                            </Typography>
                            <span>:-</span>
                            <Typography
                              sx={{
                                fontSize: 14,
                                color: "#fff",
                              }}
                            >
                              {userDetails?.id}
                            </Typography>
                          </div>
 
                          {role["role"] != "admin" && (
                            <div className="mypage_row">
                              <Typography className="mypage_row_lable">
                                {selectedLang.nick_name}
                              </Typography>
                              <span>:-</span>
                              <Typography
                                sx={{
                                  fontSize: 14,
                                  color: "#fff",
                                }}
                              >
                                {" "}
                                {userDetails?.nickname}
                              </Typography>
                            </div>
                          )}
 
                          <div className="mypage_row">
                            <Typography className="mypage_row_lable">
                              {selectedLang.currency}
                            </Typography>
                            <span>:-</span>
                            <Typography
                              sx={{
                                fontSize: 14,
                                color: "#fff",
                              }}
                            >
                              {" "}
                              {userDetails?.currency}
                            </Typography>
                          </div>
 
                          {role["role"] != "admin" && (
                            <>
                              {/* <div className='box-gray'>
															<Grid item container spacing={0}>
																<Grid
																	item
																	xs={12}
																	sm={12}
																	md={6}
																	lg={4}
																	sx={{
																		border: '1px solid #1a3d68 !important',
																		padding: '10px',
																	}}>
																	<div
																		className='flex justify-between justify-items-center align-items-center flex-wrap'
																		style={{
																			alignItems: 'center',
																		}}>
																		<div className='flex justify-items-start align-items-center'>
																			{' '}
																			<Typography
																				sx={{ fontSize: 14, color: '#fff' }}>
																				{selectedLang.language}
																			</Typography>
																		</div>
																	</div>
																</Grid>
																<Grid
																	item
																	xs={12}
																	sm={12}
																	md={6}
																	lg={8}
																	sx={{
																		border: '1px solid #1a3d68 !important',
																		padding: '10px',
																	}}>
																	<div
																		className='flex justify-between justify-items-center align-items-center flex-wrap'
																		style={{
																			alignItems: 'center',
																		}}>
																		<div className='flex justify-items-start align-items-center'>
																			{' '}
																			<Typography
																				sx={{
																					fontSize: 14,
																					color: '#fff',
																					fontWeight: '600',
																				}}>
																				{' '}
																				{userDetails?.language == 'ko'
																					? 'KR'
																					: 'EN'}
																			</Typography>
																		</div>
																	</div>
																</Grid>
															</Grid>
														</div> */}
                              {role["role"] == "admin" && (
                                <div>
                                  <div>
                                    <Typography
                                      sx={{ fontSize: 14, color: "#fff" }}
                                    >
                                      {selectedLang.time_zone}
                                    </Typography>
                                  </div>
                                  <div>
                                    <Typography
                                      sx={{
                                        fontSize: 14,
                                        color: "#fff",
                                      }}
                                    >
                                      {" "}
                                      {userDetails?.time}
                                    </Typography>
                                  </div>
                                </div>
                              )}
                              {role["role"] != "cs" && (
                                <>
                                  {role["role"] == "admin" && (
                                    <div>
                                      <div>
                                        <Typography
                                          sx={{
                                            fontSize: 14,
                                            color: "#fff",
                                          }}
                                        >
                                          {selectedLang.change_time_zone}
                                        </Typography>
                                      </div>
                                      <div>
                                        <Autocomplete
                                          onChange={handletime}
                                          value={time}
                                          className="datatextbox"
                                          variant="outlined"
                                          disablePortal
                                          size="small"
                                          id="combo-box-demo"
                                          options={moment.tz
                                            .names()
                                            .map((tz,index) => ({
                                              label: tz,
                                              value: tz,
                                              key: index,
                                            }))}
                                          renderInput={(params) => (
                                            <TextField
                                              {...params}
                                              className="textSearch"
                                              label={
                                                <span>
                                                  {`${selectedLang.time_zone}`}
                                                  <span
                                                    style={{
                                                      color: "red",
                                                    }}
                                                  >
                                                    *
                                                  </span>
                                                </span>
                                              }
                                              InputLabelProps={{
                                                shrink: true,
                                              }}
                                            />
                                          )}
                                        />
                                        {role["role"] != "cs" && (
                                          <div className="cmbtn">
                                            <Button
                                              variant="contained"
                                              onClick={handleTimeZoneChange}
                                              className="m-5 cm_btn"
                                            >
                                              {selectedLang.change}
                                            </Button>
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  )}
 
                                  {role["role"] == "admin" && (
                                    <div>
                                      <div>
                                        <Typography
                                          sx={{
                                            fontSize: 14,
                                            color: "#fff",
                                          }}
                                        >
                                          {selectedLang.wallet_type}
                                        </Typography>
                                      </div>
                                      <div>
                                        <Typography
                                          sx={{
                                            fontSize: 14,
                                            color: "#fff",
                                          }}
                                        >
                                          {" "}
                                          {userDetails?.wallet_type}
                                        </Typography>
                                      </div>
                                    </div>
                                  )}
                                </>
                              )}
                            </>
                          )}
 
                          {role["role"] != "user" && agent_id && (
                            <div className="mypage_row">
                              <Typography className="mypage_row_lable">
                                {selectedLang.wallet_type}
                              </Typography>
                              <span>:-</span>
                              <Typography
                                sx={{
                                  fontSize: 14,
                                  color: "#fff",
                                }}
                              >
                                {" "}
                                {userDetails?.wallet_type}
                              </Typography>
                            </div>
                          )}
 
                          {role["role"] != "admin" && (
                            <>
                              <div className="mypage_row">
                                <Typography className="mypage_row_lable">
                                  {selectedLang.language}
                                </Typography>
                                <span>:-</span>
                                <Typography
                                  sx={{
                                    fontSize: 14,
                                    color: "#fff",
                                  }}
                                >
                                  {userDetails && userDetails.language
                                    ? userDetails.language.toUpperCase()
                                    : ""}
                                </Typography>
                              </div>
 
                              <div className="mypage_row">
                                <Typography className="mypage_row_lable">
                                  {selectedLang.time_zone}
                                </Typography>
                                <span>:-</span>
                                <Typography
                                  sx={{
                                    fontSize: 14,
                                    color: "#fff",
                                  }}
                                >
                                  {" "}
                                  {userDetails?.time}
                                </Typography>
                              </div>
                              {role["role"] != "cs" && (
                                <>
                                  <div className="mypage_row">
                                    <Typography className="mypage_row_lable">
                                      {selectedLang.change_time_zone}
                                    </Typography>
                                    <span>:-</span>
                                    <div className="IP_vlock">
                                      <Autocomplete
                                        onChange={handletime}
                                        value={time}
                                        className="datatextbox"
                                        variant="outlined"
                                        disablePortal
                                        size="small"
                                        id="combo-box-demo"
                                        options={moment.tz
                                          .names()
                                          .map((tz,index) => ({
                                            label: tz,
                                            value: tz,
                                            key: index,
                                          }))}
                                        renderInput={(params) => (
                                          <TextField
                                            {...params}
                                            className="textSearch"
                                            label={
                                              <span>
                                                {`${selectedLang.time_zone}`}
                                                <span
                                                  style={{
                                                    color: "red",
                                                  }}
                                                >
                                                  *
                                                </span>
                                              </span>
                                            }
                                            InputLabelProps={{
                                              shrink: true,
                                            }}
                                          />
                                        )}
                                      />
                                      {role["role"] != "cs" && (
                                        <Button
                                          variant="contained"
                                          onClick={handleTimeZoneChange}
                                          className="cm_btn"
                                        >
                                          {selectedLang.change}
                                        </Button>
                                      )}
                                    </div>
                                  </div>
 
                                  <div className="mypage_row">
                                    <Typography className="mypage_row_lable">
                                      {selectedLang.wallet_type}
                                    </Typography>
                                    <span>:-</span>
                                    <div className="flex justify-items-start align-items-center">
                                      {" "}
                                      <Typography
                                        sx={{
                                          fontSize: 14,
                                          color: "#fff",
                                        }}
                                      >
                                        {" "}
                                        {userDetails?.wallet_type}
                                      </Typography>
                                    </div>
                                  </div>
                                </>
                              )}
                            </>
                          )}
                          <div className="mypage_row">
                            <Typography className="mypage_row_lable">
                              {selectedLang.api_key}
                            </Typography>
                            <span>:-</span>
                            <div className="flex justify-items-start align-items-center flex-col">
                              <div className="flex justify-between items-center flex-wrap">
                                {APIkeys && APIkeys.length == 0 &&
                                  role["role"] != "cs" && (
                                    <Button
                                      variant="contained"
                                      color="primary"
                                      onClick={handleAddField}
                                      className="ml-5"
                                    >
                                      <AddCircleIcon />{" "}
                                      <span className="ml-2">
                                        {selectedLang.add}
                                      </span>
                                    </Button>
                                  )}
                                
                                {
                                  discloseAPIKEY===true?
                                  <div className="flex items-stretch IP_vlock">
                                  {APIkeys && APIkeys.map((field, index) => (
                                    <>
                                      <div
                                        key={index}
                                        className=""
                                        style={{
                                          maxWidth: "700px",
                                          width: "100%",
                                        }}
                                      >
                                        <TextField
                                          size="small"
                                          fullWidth
                                          hiddenLabel
                                          placeholder={selectedLang.api_key}
                                          // label={`${selectedLang.api_key
                                          //   } ${index + 1}`}
                                          value={APIkeys[index]}
                                          disabled
                                          // onChange={(event) =>
                                          //   handleChangeAPIKey(
                                          //     index,
                                          //     event.target.value
                                          //   )
                                          // }
                                        />
                                      </div>
                                      {/* <div className="flex justify-center items-center">
                                            <IconButton
                                              onClick={() =>
                                                handleRemoveField(index)
                                              }>
                                              <RemoveCircleIcon />
                                            </IconButton>
                                          </div> */}
                                    </>
                                  ))
                                  }
                                  {APIkeys &&
                                    APIkeys.length > 0 && (
                                      <Button
                                        variant="contained"
                                        onClick={() => {
                                          copyToClipBoard(APIkeys[0]);
                                          dispatch(
                                            showMessage({
                                              variant: "success",
                                              message: `${selectedLang.api_coppied}`,
                                            })
                                          );
                                        }}
                                        className="cm_btn"
                                      >
                                        {selectedLang.copy}
                                      </Button>
                                    )
                                  }
                                </div >:
                                <></>
                                }
                                
                              </div >
                              <Typography
                                sx={{
                                  fontSize: 14,
                                  color: "#fff",
                                }}
                              >
                                {" "}
                                {selectedLang.setting_para_1}
                              </Typography>
                            </div >
                          </div >
                        </div >
                        <div className="mypage_box">
                          <div className="mypage_row">
                            <Typography className="mypage_row_lable">
                              {selectedLang.set_IP_allowed_for_API_calls}
                            </Typography>
                            <span>:-</span>
                            <div className="flex justify-items-start set_ip_box_wrapper align-items-centr flex-col"
                            style={{ width: "100%", maxWidth: "700px" }}>
                              <Typography
                                sx={{
                                  fontSize: 14,
                                  color: "#fff",
                                }}
                              >
                                {selectedLang.setting_para_2}
                              </Typography>
                              <div className="IP_vlock">
                                <TextField
                                    fullWidth
                                    hiddenLabel
                                    variant="outlined"
                                    size="small"
                                    value={selectedNames}
                                    disabled={role["role"] === "cs"}
                                    className={`flex w-100 seletiveIP ${isInvalidInput ? 'invalid-input' : ''}`}
                                    placeholder={selectedLang.set_ip}
                                    InputLabelProps={{
                                      style: { marginLeft: '8px' },
                                    }}
                                    // value={inputValue}
                                    onChange={handleInputChange2}
                                    onKeyDown={(event) => {
                                      if (event.key === 'Enter') {
                                        if (!validateInput(inputValue)) {
                                          event.preventDefault();
                                        }
                                      }
                                    }}
                                  />
                                {role["role"] != "cs" && (
                                  <Button
                                    variant="contained"
                                    onClick={handleIPChange}
                                    className="cm_btn"
                                  >
                                    {selectedLang.change}
                                  </Button>
                                )}
                              </div>
                              <Typography
                                sx={{
                                  fontSize: 14,
                                  color: "#fff",
                                }}
                              >
                                {" "}
                                {selectedLang.setting_para_5}
                              </Typography>
                            </div>
                          </div>
                          {userDetails?.wallet_type &&
                            userDetails.wallet_type == "seamless" && (
                              <div
                                className="mypage_row"
                                style={{ paddingTop: "15px" }}
                              >
                                <Typography className="mypage_row_lable">
                                  {selectedLang.callback_URL}
                                </Typography>
                                <span>:-</span>
                                <div className=""
                                style={{ width: "100%", maxWidth: "700px" }}>
                                  <Typography
                                    sx={{
                                      fontSize: 14,
                                      color: "#fff",
                                    }}
                                  >
                                    {selectedLang.setting_para_6}
                                  </Typography>
                                  <Typography
                                    sx={{
                                      fontSize: 12,
                                      maxWidth: "940px",
                                      paddingTop: "10px",
                                      color: "#fff",
                                    }}
                                  >
                                    {selectedLang.setting_para_dis}
                                  </Typography>
                                  <div
                                    className="flex items-center"
                                    style={{ paddingTop: "15px" }}
                                  >
                                    <div className="widthclass">
                                      <TextField
                                        label={`${selectedLang.change_balance_callback_URL}`}
                                        size="small"
                                        className="flex w-100"
                                        disabled={role["role"] === "cs"}
                                        value={
                                          changeBalanceCallbackURL
                                            ? changeBalanceCallbackURL
                                            : ""
                                        }
                                        onChange={(e) =>
                                          setChangeBalanceCallbackURL(
                                            e.target.value
                                          )
                                        }
                                      />
                                    </div>
                                    {/* <div className="flex cmbtn">
                                  <Button
                                    variant="contained"
                                    onClick={handleURLChange}
                                    className="m-5 cm_btn">
                                    {selectedLang.change}
                                  </Button>
                                </div> */}
                                  </div>
                                  <div
                                    className="flex items-center IP_vlock"
                                    style={{ paddingTop: "15px" }}
                                  >
                                    <div
                                      className=""
                                      style={{
                                        width: "100%",
                                     
                                      }}
                                    >
                                      <TextField
                                        label={`${selectedLang.balance_callback_URL}`}
                                        size="small"
                                        className="flex w-100"
                                        disabled={role["role"] === "cs"}
                                        value={
                                          balanceCallbackURL
                                            ? balanceCallbackURL
                                            : ""
                                        }
                                        onChange={(e) =>
                                          setBalanceCallbackURL(e.target.value)
                                        }
                                      />
                                    </div>
                                    {role["role"] != "cs" && (
                                      <Button
                                        variant="contained"
                                        onClick={handleURLChange}
                                        className="cm_btn"
                                      >
                                        {selectedLang.change}
                                      </Button>
                                    )}
                                  </div>
                                  <Typography
                                    sx={{
                                      fontSize: 14,
                                      color: "#fff",
                                    }}
                                  >
                                    {selectedLang.setting_para_8}
                                  </Typography>
                                </div>
                              </div>
                            )}
                          <div
                            className="mypage_row"
                            style={{ paddingTop: "10px" }}
                          >
                            <Typography className="mypage_row_lable">
                              {selectedLang.account_number}
                            </Typography>
                            <span>:-</span>
                            <div className="IP_vlock">
                              <div
                                className=""
                                style={{ width: "100%", maxWidth: "500px" }}
                              >
                                <TextField
                                  fullWidth
                                  label={
                                    error
                                      ? "Invalid account number"
                                      : selectedLang.account_number
                                  }
                                  className={`flex ${error ? "error-border" : ""
                                    }`}
                                  size="small"
                                  value={accountNum}
                                  disabled={role["role"] === "cs"}
                                  onChange={handleInputChange}
                                  error={error} // This prop is used by Material-UI to show the error state
                                  helperText={
                                    error ? "Invalid account number" : ""
                                  }
                                />
                              </div>
                              {role["role"] != "cs" && (
                                <Button
                                  variant="contained"
                                  onClick={handleAccountNumChange}
                                  className="cm_btn"
                                >
                                  {selectedLang.change}
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="mypage_box">
                          {role["role"] != "admin" ? (
                            <div className="mypage_row">
                              <Typography className="mypage_row_lable">
                                {selectedLang.current_holding_amount}
                                {/* {isNaN(
                                      Number(
                                        selectedLang.current_holding_amount
                                      )
                                    )
                                      ? 0
                                      : Number(
                                          selectedLang.current_holding_amount
                                        )} */}
                              </Typography>
                              <span>:-</span>
                              <Typography
                                sx={{
                                  fontSize: 14,
                                  color: "#fff",
                                }}
                              >
                                {isNaN(Number(holdingDetails.balance_amount))
                                  ? 0
                                  : Number(
                                    holdingDetails.balance_amount
                                  ).toLocaleString()}{" "}
                                Pot
                              </Typography>
                            </div>
                          ) : (
                            <>
                              {agent_id != null && (
                                <div className="mypage_row">
                                  <Typography className="mypage_row_lable">
                                    {selectedLang.current_holding_amount}
                                    {/* {isNaN(
                                      Number(
                                        selectedLang.current_holding_amount
                                      )
                                    )
                                      ? 0
                                      : Number(
                                          selectedLang.current_holding_amount
                                        )} */}
                                  </Typography>
                                  <span>:-</span>
                                  <Typography
                                    sx={{
                                      fontSize: 14,
                                      color: "#fff",
                                    }}
                                  >
                                    {isNaN(
                                      Number(holdingDetails.balance_amount)
                                    )
                                      ? 0
                                      : Number(
                                        holdingDetails.balance_amount
                                      ).toLocaleString()}{" "}
                                    Pot
                                  </Typography>
                                </div>
                              )}
                            </>
                          )}
 
                          <div className="mypage_row">
                            <Typography className="mypage_row_lable">
                              {
                                selectedLang.sub_agent_current_total_holding_amount
                              }
                            </Typography>
                            <span>:-</span>
                            <Typography
                              sx={{
                                fontSize: 14,
                                color: "#fff",
                              }}
                            >
                              {Number(
                                holdingDetails.subAgent_total_holdings_sum
                              )?.toLocaleString()}{" "}
                              Pot
                            </Typography>
                          </div>
 
                          <div className="mypage_row">
                            <Typography className="mypage_row_lable">
                              {
                                selectedLang.current_total_holding_of_lower_users
                              }
                            </Typography>
                            <span>:-</span>
                            <Typography
                              sx={{
                                fontSize: 14,
                                color: "#fff",
                              }}
                            >
                              {Number(
                                holdingDetails.lowUsers_total_holdings_sum
                              )?.toLocaleString()}{" "}
                              Pot
                            </Typography>
                          </div>
 
                          {role["role"] != "admin" && (
                            <>
                              <div className="mypage_row">
                                <Typography className="mypage_row_lable">
                                  {selectedLang.rate}
                                </Typography>
                                <span>:-</span>
                                <Typography
                                  sx={{
                                    fontSize: 14,
                                    color: "#fff",
                                  }}
                                >
                                  {holdingDetails.rate} %
                                </Typography>
                              </div>
 
                              <div className="mypage_row">
                                <Typography className="mypage_row_lable">
                                  {selectedLang.total_amount_paid}
                                </Typography>
                                <span>:-</span>
                                <Typography
                                  sx={{
                                    fontSize: 14,
                                    color: "#fff",
                                  }}
                                >
                                  {Number(
                                    holdingDetails.total_payment
                                  )?.toLocaleString()}{" "}
                                  Pot
                                </Typography>
                              </div>
 
                              <div className="mypage_row">
                                <Typography className="mypage_row_lable">
                                  {selectedLang.total_amount_charged}
                                </Typography>
                                <span>:-</span>
                                <Typography
                                  sx={{
                                    fontSize: 14,
                                    color: "#fff",
                                  }}
                                >
                                  {Number(
                                    holdingDetails.total_charged_amount
                                  )?.toLocaleString()}{" "}
                                  pot
                                </Typography>
                              </div>
                            </>
                          )}
 
                          <div className="mypage_row">
                            <Typography className="mypage_row_lable">
                              {selectedLang.number_of_sub_agents}
                            </Typography>
                            <span>:-</span>
                            <div>
                              <div className="flex justify-items-start align-items-center">
                                <div className="flex justify-items-start align-items-center flex-col">
                                  <div className="flex justify-between align-items-center">
                                    <Typography
                                      sx={{
                                        fontSize: 14,
                                        color: "#fff",
                                      }}
                                      className="me-3"
                                    >
                                      {selectedLang.all}
                                    </Typography>
                                    <Typography
                                      sx={{
                                        fontSize: 14,
                                        color: "#fff",
                                        marginLeft: 10,
                                      }}
                                    >
                                      {role["role"] === "user" ? (lowLevelUserCount+ subAgentNumber):(admincasinousers + subAgentNumber)}{" "}
                                      {selectedLang.people}
                                    </Typography>
                                  </div>
                                  <div className="flex justify-between align-items-center">
                                    <Typography
                                      sx={{
                                        fontSize: 14,
                                        color: "#fff",
                                      }}
                                      className="me-3"
                                    >
                                      {selectedLang.sub_agent}
                                    </Typography>
                                    <Typography
                                      sx={{
                                        fontSize: 14,
                                        color: "#fff",
                                        marginLeft: 10,
                                      }}
                                    >
                                      {subAgentNumber} {selectedLang.people}
                                    </Typography>
                                  </div>
                                  {
                                    role["role"] === "user" ? <>
                                  <div className="flex justify-between align-items-center">
                                    <Typography
                                      sx={{
                                        fontSize: 14,
                                        color: "#fff",
                                      }}
                                      className="me-3"
                                    >
                                      {selectedLang.casino_users}
                                    </Typography>
                                    <Typography
                                      sx={{
                                        fontSize: 14,
                                        color: "#fff",
                                        marginLeft: 10,
                                      }}
                                    >
                                      {lowLevelUserCount} {selectedLang.people}
                                    </Typography>
                                  </div>
                                    </> : <></>
                                  }
                                  {role["role"] === "admin" && (
                                    <div className="flex justify-between align-items-center">
                                      <Typography
                                        sx={{
                                          fontSize: 14,
                                          color: "#fff",
                                        }}
                                        className="me-3"
                                      >
                                        {selectedLang.admin_casino_users}
                                      </Typography>
                                      <Typography
                                        sx={{
                                          fontSize: 14,
                                          color: "#fff",
                                          marginLeft: 10,
                                        }}
                                      >
                                        {admincasinousers} {selectedLang.people}{" "}
                                        {/* {selectedLang.people} */}
                                      </Typography>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
 
                          <div className="mypage_row">
                            <Typography className="mypage_row_lable">
                              {selectedLang.number_of_lower_users}
                            </Typography>
                            <span>:-</span>
                            <Typography
                              sx={{
                                fontSize: 14,
                                color: "#fff",
                              }}
                            >
                              {role["role"] === "admin" ? admincasinousers: lowLevelUserCount} {selectedLang.people}
                            </Typography>
                          </div>
 
                          <div className="mypage_row">
                            <Typography className="mypage_row_lable">
                              {selectedLang.signup_time}
                            </Typography>
                            <span>:-</span>
                            <Typography
                              sx={{
                                fontSize: 14,
                                color: "#fff",
                              }}
                            >
                              {moment(userDetails?.created_at)
                                .utcOffset(0)
                                .format("YYYY-MM-DD HH:mm")}
                              {/* {dateFormat(userDetails?.created_at)} */}
                            </Typography>
                          </div>
 
                          <div className="mypage_row">
                            <Typography className="mypage_row_lable">
                              {selectedLang.user_payment_function_on_user_list}
                            </Typography>
                            <span>:-</span>
                            <Typography
                              sx={{
                                fontSize: 14,
                                color: "#fff",
                              }}
                            >
                              <Switch
                                disabled={role["role"] === "cs"}
                                checked={userDetails?.canPayment}
                                onChange={(event) =>
                                  changePaymentStatus(event.target.checked)
                                }
                                color="secondary"
                              />
                            </Typography>
                          </div>
                        </div>
                      </div >
                    </TabPanel >
 
                    <TabPanel value="2" className="common_tab_content">
                      <Grid item className="passwordform">
                        <Grid item xs={12} md={12}>
                          <Grid item container spacing={1}>
                            <Grid
                              item
                              xs={12}
                              md={12}
                              style={{ paddingTop: "15px" }}
                            >
                              <FormControl
                                className="mb-3"
                                size="small"
                                sx={{ width: "100%", marginBottom: 3 }}
                                variant="outlined"
                              >
                                <InputLabel htmlFor="outlined-adornment-password">
                                  {selectedLang.current_password}
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
                                  label=" Current Password"
                                  variant="outlined"
                                  margin="dense"
                                  value={currentPassword}
                                  onChange={(e) => {
                                    setCurrentPassword(e.target.value);
                                  }}
                                />
                              </FormControl>
                            </Grid>
                            <Grid
                              item
                              xs={12}
                              md={12}
                              style={{ paddingTop: "15px" }}
                            >
                              <FormControl
                                size="small"
                                className="mb-3"
                                sx={{ width: "100%", marginBottom: 3 }}
                                variant="outlined"
                              >
                                <InputLabel htmlFor="outlined-adornment-password">
                                  {selectedLang.new_password}
                                </InputLabel>
                                <OutlinedInput
                                  id="outlined-adornment-password"
                                  autoComplete="off"
                                  type={showNewPassword ? "text" : "password"}
                                  value={changePassword}
                                  onChange={({ target }) => {
                                    setChangePassword(target.value);
                                  }}
                                  endAdornment={
                                    <InputAdornment position="end">
                                      <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={handleClickShowNewPassword}
                                        onMouseDown={handleMouseDownPassword}
                                        edge="end"
                                      >
                                        {showNewPassword ? (
                                          <VisibilityOff />
                                        ) : (
                                          <Visibility />
                                        )}
                                      </IconButton>
                                    </InputAdornment>
                                  }
                                  label=" New Password"
                                  variant="outlined"
                                  margin="dense"
                                />
                              </FormControl>
                            </Grid>
                            <Grid
                              item
                              xs={12}
                              md={12}
                              style={{
                                paddingTop: "15px",
                                paddingBottom: "15px",
                              }}
                            >
                              <FormControl
                                size="small"
                                className="mb-3"
                                sx={{ width: "100%", marginBottom: 3 }}
                                variant="outlined"
                              >
                                <InputLabel htmlFor="outlined-adornment-password">
                                  {selectedLang.confirm_new_password}
                                </InputLabel>
                                <OutlinedInput
                                  id="outlined-adornment-password"
                                  autoComplete="off"
                                  type={
                                    showConfirmPassword ? "text" : "password"
                                  }
                                  value={confirmPassword}
                                  onChange={(e) => {
                                    setConfirmPassword(e.target.value);
                                  }}
                                  endAdornment={
                                    <InputAdornment position="end">
                                      <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={handleClickShowConfirmPassword}
                                        onMouseDown={handleMouseDownPassword}
                                        edge="end"
                                      >
                                        {showConfirmPassword ? (
                                          <VisibilityOff />
                                        ) : (
                                          <Visibility />
                                        )}
                                      </IconButton>
                                    </InputAdornment>
                                  }
                                  label=" Confirm New Password"
                                  variant="outlined"
                                  margin="dense"
                                />
                              </FormControl>
                            </Grid>
                          </Grid>
                        </Grid>
                      </Grid>
                      <div className="flex items-center mt-4">
                        <Button
                          onClick={() => {
                            CancelFunction();
                          }}
                          className="flex item-center"
                          variant="outlined"
                          color="secondary"
                          startIcon={<CancelIcon size={20}></CancelIcon>}
                          sx={{
                            borderRadius: "4px",
                          }}
                        >
                          {selectedLang.reset}
                        </Button>
                        <Button
                          className="flex item-center ml-8"
                          variant="contained"
                          color="secondary"
                          endIcon={
                            <CheckCircleIcon size={20}></CheckCircleIcon>
                          }
                          sx={{
                            borderRadius: "4px",
                          }}
                          onClick={() => handleChangePassword()}
                        >
                          {selectedLang.save}
                        </Button>
                      </div>
                    </TabPanel>
                    <TabPanel value="3" className="common_tab_content">
                      <Grid item>
                        <Grid item xs={12} md={12}>
                          <Grid
                            item
                            container
                            spacing={1}
                            sx={{
                              marginTop: "20px",
                            }}
                          >
                            <Grid item xs={12} md={12}>
                              <FormControl
                                sx={{ width: "100%", marginBottom: 3 }}
                                size="small"
                              >
                                <InputLabel id="demo-select-small">
                                  {selectedLang.select_an_agent}
                                </InputLabel>
                                <Select
                                  labelId="demo-select-small"
                                  id="demo-select-small"
                                  // value={age}
                                  label={"Select An Agent"}
                                  onChange={handleSelectAgent}
                                >
                                  {agentNames?.map((data, key) => (
                                    <MenuItem value={data?.user_id} key={key}>
                                      {data?.id}
                                    </MenuItem>
                                  ))}
                                </Select>
                              </FormControl>
                              {/* <FormControl
                                sx={{ width: "100%", marginBottom: 3 }}
                                variant="outlined">
                                <InputLabel htmlFor="outlined-adornment-password">
                                  {selectedLang.current_password}
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
                                        edge="end">
                                        {showPassword ? (
                                          <VisibilityOff />
                                        ) : (
                                          <Visibility />
                                        )}
                                      </IconButton>
                                    </InputAdornment>
                                  }
                                  label=" Current Password"
                                  variant="outlined"
                                  margin="dense"
 
 
                                  onChange={(e)=>{setCurrentPassword(e.target.value)}}
                                />
                              </FormControl> */}
                            </Grid>
                            <Grid item xs={12} md={12}>
                              <FormControl
                                sx={{ width: "100%", marginBottom: 3 }}
                                variant="outlined"
                              >
                                <InputLabel htmlFor="outlined-adornment-password">
                                  {selectedLang.new_password}
                                </InputLabel>
                                <OutlinedInput
                                  id="outlined-adornment-password"
                                  autoComplete="off"
                                  type={showNewPassword ? "text" : "password"}
                                  onChange={({ target }) => {
                                    setChangePassword(target.value);
                                  }}
                                  endAdornment={
                                    <InputAdornment position="end">
                                      <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={handleClickShowNewPassword}
                                        onMouseDown={handleMouseDownPassword}
                                        edge="end"
                                      >
                                        {showNewPassword ? (
                                          <VisibilityOff />
                                        ) : (
                                          <Visibility />
                                        )}
                                      </IconButton>
                                    </InputAdornment>
                                  }
                                  label=" New Password"
                                  variant="outlined"
                                  margin="dense"
                                />
                              </FormControl>
                            </Grid>
                            <Grid item xs={12} md={12}>
                              <FormControl
                                sx={{ width: "100%", marginBottom: 3 }}
                                variant="outlined"
                              >
                                <InputLabel htmlFor="outlined-adornment-password">
                                  {selectedLang.confirm_new_password}
                                </InputLabel>
                                <OutlinedInput
                                  id="outlined-adornment-password"
                                  autoComplete="off"
                                  type={
                                    showConfirmPassword ? "text" : "password"
                                  }
                                  onChange={(e) => {
                                    setConfirmPassword(e.target.value);
                                  }}
                                  endAdornment={
                                    <InputAdornment position="end">
                                      <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={handleClickShowConfirmPassword}
                                        onMouseDown={handleMouseDownPassword}
                                        edge="end"
                                      >
                                        {showConfirmPassword ? (
                                          <VisibilityOff />
                                        ) : (
                                          <Visibility />
                                        )}
                                      </IconButton>
                                    </InputAdornment>
                                  }
                                  label={selectedLang.confirm_new_password}
                                  variant="outlined"
                                  margin="dense"
                                />
                              </FormControl>
                            </Grid>
                          </Grid>
                        </Grid>
                      </Grid>
                      <div className="flex justify-end items-center mt-10 mb-8 p-16">
                        <Button
                          className="flex item-center"
                          variant="outlined"
                          color="secondary"
                          startIcon={<CancelIcon size={20}></CancelIcon>}
                          sx={{
                            borderRadius: "4px",
                          }}
                        >
                          {selectedLang.cancel_n}
                        </Button>
                        <Button
                          className="flex item-center ml-8"
                          variant="contained"
                          color="secondary"
                          endIcon={
                            <CheckCircleIcon size={20}></CheckCircleIcon>
                          }
                          sx={{
                            borderRadius: "4px",
                          }}
                          onClick={() => handleChangeAgentPassword()}
                        >
                          {selectedLang.save}
                        </Button>
                      </div>
                    </TabPanel>
 
                    {
                      role?.role == "admin" && (
                        <TabPanel value="4" className="common_tab_content">
                          <Grid item className="passwordform">
                            <Grid item xs={12} md={12}>
                              <Grid item container spacing={1}>
                                <Grid
                                  item
                                  xs={12}
                                  md={12}
                                  style={{ paddingTop: "15px" }}
                                >
                                  <Autocomplete
                                    onChange={handleChangeCurrency}
                                    // value={filterCurr}
                                    sx={{
                                      width: "100%",
                                    }}
                                    className=""
                                    variant="outlined"
                                    disablePortal
                                    size="small"
                                    id="combo-box-demo"
                                    options={[
                                      {
                                        label: `${selectedLang.add_new}`,
                                        value: "Add new",
                                      },
                                      {
                                        label: `${selectedLang.update_key}`,
                                        value: "Update key",
                                      },
                                    ]}
                                    // getOptionLabel={(option) => option}
                                    renderInput={(params) => (
                                      <TextField
                                        {...params}
                                        className="textSearch"
                                        // label={selectedLang.action}
                                        placeholder={`${selectedLang.update_key}`}
                                      />
                                    )}
                                  />
                                </Grid>
 
                                <Grid
                                  item
                                  xs={12}
                                  md={12}
                                  style={{ paddingTop: "15px" }}
                                >
                                  <FormControl
                                    className="mb-3"
                                    size="small"
                                    sx={{ width: "100%", marginBottom: 3 }}
                                    variant="outlined"
                                  >
                                    <InputLabel htmlFor="outlined-adornment-password">
                                      {selectedLang.username}
                                    </InputLabel>
                                    <OutlinedInput
                                      id="outlined-adornment-password"
                                      autoComplete="off"
                                      type={"text"}
                                      label={selectedLang.username}
                                      variant="outlined"
                                      margin="dense"
                                      value={username}
                                      onChange={(e) => {
                                        setUsername(e.target.value);
                                      }}
                                    />
                                  </FormControl>
                                </Grid>
                                {filterCurr == "Update key" ? (
                                  <>
                                    <Grid
                                      item
                                      xs={12}
                                      md={12}
                                      style={{ paddingTop: "15px" }}
                                    >
                                      <FormControl
                                        size="small"
                                        className="mb-3"
                                        sx={{ width: "100%", marginBottom: 3 }}
                                        variant="outlined"
                                      >
                                        <InputLabel htmlFor="outlined-adornment-password">
                                          {selectedLang.current_secret_key}
                                        </InputLabel>
                                        <OutlinedInput
                                          id="outlined-adornment-password"
                                          autoComplete="off"
                                          type={
                                            showNewPassword ? "text" : "password"
                                          }
                                          value={old_secret_key}
                                          onChange={({ target }) => {
                                            _old_secret_key(target.value);
                                          }}
                                          endAdornment={
                                            <InputAdornment position="end">
                                              <IconButton
                                                aria-label="toggle password visibility"
                                                onClick={
                                                  handleClickShowNewPassword
                                                }
                                                onMouseDown={
                                                  handleMouseDownPassword
                                                }
                                                edge="end"
                                              >
                                                {showNewPassword ? (
                                                  <VisibilityOff />
                                                ) : (
                                                  <Visibility />
                                                )}
                                              </IconButton>
                                            </InputAdornment>
                                          }
                                          label=" New Password"
                                          variant="outlined"
                                          margin="dense"
                                        />
                                      </FormControl>
                                    </Grid>
                                    <Grid
                                      item
                                      xs={12}
                                      md={12}
                                      style={{
                                        paddingTop: "15px",
                                        paddingBottom: "15px",
                                      }}
                                    >
                                      <FormControl
                                        size="small"
                                        className="mb-3"
                                        sx={{ width: "100%", marginBottom: 3 }}
                                        variant="outlined"
                                      >
                                        <InputLabel htmlFor="outlined-adornment-password">
                                          {selectedLang.new_secret_key}
                                        </InputLabel>
                                        <OutlinedInput
                                          id="outlined-adornment-password"
                                          autoComplete="off"
                                          type={
                                            showConfirmPassword
                                              ? "text"
                                              : "password"
                                          }
                                          value={new_secret_key}
                                          onChange={(e) => {
                                            _new_secret_key(e.target.value);
                                          }}
                                          endAdornment={
                                            <InputAdornment position="end">
                                              <IconButton
                                                aria-label="toggle password visibility"
                                                onClick={
                                                  handleClickShowConfirmPassword
                                                }
                                                onMouseDown={
                                                  handleMouseDownPassword
                                                }
                                                edge="end"
                                              >
                                                {showConfirmPassword ? (
                                                  <VisibilityOff />
                                                ) : (
                                                  <Visibility />
                                                )}
                                              </IconButton>
                                            </InputAdornment>
                                          }
                                          label={selectedLang.new_secret_key}
                                          variant="outlined"
                                          margin="dense"
                                        />
                                      </FormControl>
                                    </Grid>
                                  </>
                                ) : (
                                  <>
                                    <Grid
                                      item
                                      xs={12}
                                      md={12}
                                      style={{
                                        paddingTop: "15px",
                                        paddingBottom: "15px",
                                      }}
                                    >
                                      <FormControl
                                        size="small"
                                        className="mb-3"
                                        sx={{ width: "100%", marginBottom: 3 }}
                                        variant="outlined"
                                      >
                                        <InputLabel htmlFor="outlined-adornment-password">
                                          {selectedLang.secret_key}
                                        </InputLabel>
                                        <OutlinedInput
                                          id="outlined-adornment-password"
                                          autoComplete="off"
                                          type={
                                            showConfirmPassword
                                              ? "text"
                                              : "password"
                                          }
                                          value={secret_key}
                                          onChange={(e) => {
                                            _secret_key(e.target.value);
                                          }}
                                          endAdornment={
                                            <InputAdornment position="end">
                                              <IconButton
                                                aria-label="toggle password visibility"
                                                onClick={
                                                  handleClickShowConfirmPassword
                                                }
                                                onMouseDown={
                                                  handleMouseDownPassword
                                                }
                                                edge="end"
                                              >
                                                {showConfirmPassword ? (
                                                  <VisibilityOff />
                                                ) : (
                                                  <Visibility />
                                                )}
                                              </IconButton>
                                            </InputAdornment>
                                          }
                                          label={selectedLang.secret_key}
                                          variant="outlined"
                                          margin="dense"
                                        />
                                      </FormControl>
                                    </Grid>
                                  </>
                                )}
                              </Grid>
                            </Grid>
                          </Grid>
                          <div className="flex items-center mt-4">
                            <Button
                              onClick={() => {
                                CancelFunctionSecret();
                              }}
                              className="flex item-center"
                              variant="outlined"
                              color="secondary"
                              startIcon={<CancelIcon size={20}></CancelIcon>}
                              sx={{
                                borderRadius: "4px",
                              }}
                            >
                              {selectedLang.reset}
                            </Button>
                            <Button
                              className="flex item-center ml-8"
                              variant="contained"
                              color="secondary"
                              endIcon={
                                <CheckCircleIcon size={20}></CheckCircleIcon>
                              }
                              sx={{
                                borderRadius: "4px",
                              }}
                              onClick={() => handleUpdateSecret()}
                            >
                              {selectedLang.save}
                            </Button>
                          </div>
                        </TabPanel>
                      )
                    }
                  </TabContext >
                </CardContent >
              </div >
            </Card >
          }
        />
      )}
    </>
  );
}

export default mypageApp;
