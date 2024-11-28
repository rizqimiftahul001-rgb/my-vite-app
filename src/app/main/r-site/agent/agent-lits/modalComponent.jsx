// ModalComponent.js
import React from "react";
import Modal from "@mui/material/Modal";
import FusePageSimple from "@fuse/core/FusePageSimple";
import { useDispatch, useSelector } from "react-redux";
import { showMessage } from "app/store/fuse/messageSlice";
import { useEffect, useState } from "react";
import { locale } from "../../../../configs/navigation-i18n";
import "./agentList.css";
import Grid from "@mui/material/Unstable_Grid2";
import TreeView from "@mui/lab/TreeView";
import TreeItem from "@mui/lab/TreeItem";
import TextField from "@mui/material/TextField";
import CloseIcon from "@mui/icons-material/Close";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import OutlinedInput from "@mui/material/OutlinedInput";
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
import { Autocomplete, CardActionArea, CardActions } from "@mui/material";
import FormHelperText from "@mui/material/FormHelperText";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import FuseLoading from "@fuse/core/FuseLoading/FuseLoading";
import { formatSentence } from "src/app/services/Utility";
import queryString from "query-string";

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

const ModalComponent = ({ isModalOpen, closeModal,setIsModalOpen }) => {
  const dispatch = useDispatch();
  const user_id = DataHandler.getFromSession("user_id");
  const [id, setId] = useState("");
  const [idError, setIdError] = useState(false);
  const [nickname, setNickname] = useState("");
  const [password, setPassword] = useState("");
  const [agentTreeList, setAgentTreeList] = useState([]);
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
  const { search } = window.location;
  const { q_agent } = queryString.parse(search);
  const [isValidNickname, setIsValidNickname] = useState(true);
  const [selectedUserId, setSelectedUserId] = useState(user_id);

  const [agentDetails, setAgentDetails] = useState();

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
    getAgentTreeList();
    getAgentDetails();
    getProviderLanguage();
    if (role["role"] == "admin" || role["role"] == "cs") {
      getAgentHoldingSummary();
      //getProviderDetails();
    }
  }, []);

  useEffect(() => {
    getAgentDetails();
  }, [selectedUserId, selectedprovider]);

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

  const getAgentTreeList = () => {
    APIService({
      url: `${process.env.REACT_APP_R_SITE_API}/user/agent-list-tree?user_id=${q_agent ? q_agent : user_id}`,
      method: "GET",
    })
      .then((data) => {
        setAgentTreeList(data.data.data);
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
  };

  const getAgentDetails = () => {
    APIService({
      url: `${process.env.REACT_APP_R_SITE_API}/user/agent-details?user_id=${q_agent ? q_agent : selectedUserId}&provider=${selectedprovider}`,
      method: "GET",
    })
      .then((data) => {
        setAgentDetails(data.data.data);
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
  };

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
    closeModal();
  };

  const submitUserDetails = (e) => {
    e.preventDefault();
    if (role["role"] == "admin" || role["role"] == "cs") {
      var payload = {
        id: id,
        nickname: nickname,
        password: password,
        parentId: agentDetails?.user_id ? agentDetails.user_id : user_id,
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
        parentId: agentDetails?.user_id ? agentDetails.user_id : user_id,
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
      setIsModalOpen(false);
      dispatch(
        showMessage({
          variant: "error",
          message: `${selectedLang.id_is_required}`,
        })
      );
    } else if (nickname == undefined || nickname == null || nickname == "") {
      setIsModalOpen(false);
      dispatch(
        showMessage({
          variant: "error",
          message: `${selectedLang.nick_name_is_required}`,
        })
      );
    } else if (password == undefined || password == null || password == "") {
      setIsModalOpen(false);
      dispatch(
        showMessage({
          variant: "error",
          message: `${selectedLang.password_is_required}`,
        })
      );
    } else if (rate == undefined || rate == null || rate == "") {
      setIsModalOpen(false);
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
      setIsModalOpen(false);
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
      setIsModalOpen(false);
      dispatch(
        showMessage({
          variant: "error",
          message: `${selectedLang.time_zone_is_requried}`,
        })
      );
    } else if (fields.length <= 0 && role["role"] != "admin") {
      setIsModalOpen(false);
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
        // setBtnVisible(false);
        APIService({
          url: `${process.env.REACT_APP_R_SITE_API}/user/register`,
          method: "POST",
          data: payload,
        })
          .then((data) => {
            console.log("see this data-->>",data)
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
            setIsModalOpen(false);
            createSuccess();
            console.log("msg there")
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
            closeModal();
          })
          .catch((err) => {
            console.log("see this error--->>",err)
            setLoaderVisible(false);
            setBtnVisible(true);
            setIsModalOpen(false);
            dispatch(
              showMessage({
                variant: "error",
                message: `${selectedLang[`${formatSentence(err?.error?.message)}`] ||
                  err?.error?.message || selectedLang.error_alert
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

    const isValid = /^[a-zA-Z0-9ㄱ-힣]{1,30}$/.test(newNickname);

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
    const maxLength = 20; // Set your desired maximum length

    if (newId.length <= maxLength) {
      setId(newId);
      setIdError(false);
    } else {
      setIdError(true);
    }
  };
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


  const renderTree = (nodes) => (
    <TreeItem
      key={nodes.user_id}
      nodeId={nodes.id}
      label={nodes.id}
      onClick={(e) => {
        setSelectedUserId(nodes.user_id);
      }}
    >
      {Array.isArray(nodes.child)
        ? nodes.child.map((node) => renderTree(node))
        : null}
    </TreeItem>
  );


  function MinusSquare() {
    return (
      <svg
        width="21"
        height="20"
        viewBox="0 0 21 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M18.1356 16.6406C16.9004 14.5062 14.9613 13.0086 12.7082 12.3734C13.8036 11.8166 14.6796 10.9071 15.1949 9.79147C15.7101 8.67588 15.8346 7.41927 15.5484 6.22426C15.2621 5.02924 14.5816 3.96548 13.6168 3.20449C12.6519 2.44349 11.4589 2.02963 10.2301 2.02963C9.00127 2.02963 7.80825 2.44349 6.84341 3.20449C5.87857 3.96548 5.19814 5.02924 4.91184 6.22426C4.62555 7.41927 4.75007 8.67588 5.26532 9.79147C5.78058 10.9071 6.65655 11.8166 7.75197 12.3734C5.49885 13.0078 3.55979 14.5055 2.32463 16.6406C2.29071 16.694 2.26794 16.7536 2.25768 16.816C2.24742 16.8784 2.24988 16.9422 2.26492 17.0036C2.27996 17.065 2.30727 17.1227 2.3452 17.1733C2.38313 17.2239 2.4309 17.2663 2.48563 17.2979C2.54037 17.3296 2.60093 17.3498 2.66369 17.3574C2.72645 17.365 2.7901 17.3599 2.85082 17.3423C2.91153 17.3247 2.96806 17.295 3.017 17.2549C3.06593 17.2149 3.10626 17.1654 3.13557 17.1094C4.63635 14.5164 7.28791 12.9687 10.2301 12.9687C13.1723 12.9687 15.8238 14.5164 17.3246 17.1094C17.3539 17.1654 17.3943 17.2149 17.4432 17.2549C17.4921 17.295 17.5487 17.3247 17.6094 17.3423C17.6701 17.3599 17.7337 17.365 17.7965 17.3574C17.8593 17.3498 17.9198 17.3296 17.9746 17.2979C18.0293 17.2663 18.0771 17.2239 18.115 17.1733C18.1529 17.1227 18.1802 17.065 18.1953 17.0036C18.2103 16.9422 18.2128 16.8784 18.2025 16.816C18.1923 16.7536 18.1695 16.694 18.1356 16.6406ZM5.69885 7.5C5.69885 6.6038 5.9646 5.72773 6.4625 4.98257C6.9604 4.23741 7.66809 3.65663 8.49606 3.31367C9.32404 2.97071 10.2351 2.88097 11.1141 3.05581C11.9931 3.23065 12.8005 3.66221 13.4342 4.29592C14.0679 4.92963 14.4994 5.73702 14.6743 6.61599C14.8491 7.49497 14.7594 8.40605 14.4164 9.23403C14.0735 10.062 13.4927 10.7697 12.7475 11.2676C12.0024 11.7655 11.1263 12.0312 10.2301 12.0312C9.02878 12.0298 7.87708 11.5519 7.02762 10.7025C6.17816 9.85301 5.7003 8.70131 5.69885 7.5Z"
          fill="#fff"
        />
      </svg>
    );
  }

  function PlusSquare() {
    return (
      <svg
        width="21"
        height="20"
        viewBox="0 0 21 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M18.1356 16.6406C16.9004 14.5062 14.9613 13.0086 12.7082 12.3734C13.8036 11.8166 14.6796 10.9071 15.1949 9.79147C15.7101 8.67588 15.8346 7.41927 15.5484 6.22426C15.2621 5.02924 14.5816 3.96548 13.6168 3.20449C12.6519 2.44349 11.4589 2.02963 10.2301 2.02963C9.00127 2.02963 7.80825 2.44349 6.84341 3.20449C5.87857 3.96548 5.19814 5.02924 4.91184 6.22426C4.62555 7.41927 4.75007 8.67588 5.26532 9.79147C5.78058 10.9071 6.65655 11.8166 7.75197 12.3734C5.49885 13.0078 3.55979 14.5055 2.32463 16.6406C2.29071 16.694 2.26794 16.7536 2.25768 16.816C2.24742 16.8784 2.24988 16.9422 2.26492 17.0036C2.27996 17.065 2.30727 17.1227 2.3452 17.1733C2.38313 17.2239 2.4309 17.2663 2.48563 17.2979C2.54037 17.3296 2.60093 17.3498 2.66369 17.3574C2.72645 17.365 2.7901 17.3599 2.85082 17.3423C2.91153 17.3247 2.96806 17.295 3.017 17.2549C3.06593 17.2149 3.10626 17.1654 3.13557 17.1094C4.63635 14.5164 7.28791 12.9687 10.2301 12.9687C13.1723 12.9687 15.8238 14.5164 17.3246 17.1094C17.3539 17.1654 17.3943 17.2149 17.4432 17.2549C17.4921 17.295 17.5487 17.3247 17.6094 17.3423C17.6701 17.3599 17.7337 17.365 17.7965 17.3574C17.8593 17.3498 17.9198 17.3296 17.9746 17.2979C18.0293 17.2663 18.0771 17.2239 18.115 17.1733C18.1529 17.1227 18.1802 17.065 18.1953 17.0036C18.2103 16.9422 18.2128 16.8784 18.2025 16.816C18.1923 16.7536 18.1695 16.694 18.1356 16.6406ZM5.69885 7.5C5.69885 6.6038 5.9646 5.72773 6.4625 4.98257C6.9604 4.23741 7.66809 3.65663 8.49606 3.31367C9.32404 2.97071 10.2351 2.88097 11.1141 3.05581C11.9931 3.23065 12.8005 3.66221 13.4342 4.29592C14.0679 4.92963 14.4994 5.73702 14.6743 6.61599C14.8491 7.49497 14.7594 8.40605 14.4164 9.23403C14.0735 10.062 13.4927 10.7697 12.7475 11.2676C12.0024 11.7655 11.1263 12.0312 10.2301 12.0312C9.02878 12.0298 7.87708 11.5519 7.02762 10.7025C6.17816 9.85301 5.7003 8.70131 5.69885 7.5Z"
          fill="#fff"
        />
      </svg>
    );
  }

  function CloseSquare() {
    return (
      <svg
        width="8"
        height="8"
        viewBox="0 0 8 8"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle
          cx="4.22998"
          cy="4"
          r="3"
          stroke="#646570"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    );
  }

  const CustomTreeItem = React.forwardRef((props, ref) => (
    <TreeItem {...props} ref={ref} />
  ));








  return (
    <Modal
      open={isModalOpen}
      onClose={closeModal}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box
        sx={style}
        className="create_operater_modal Mymodal"
        style={{ fontWeight: "700", fontSize: "23px" }}
      >
        <button className="modalclosebtn" onClick={closeModal}>
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
        <div>
          {/* <IconButton
            aria-label="close"
            onClick={closeModal}
            sx={{
              position: "absolute",
              right: 0,
              top: 0,
              color: "white",
              zIndex: 1,
            }}
          >
            <CloseIcon />
          </IconButton> */}
          <div
            style={{
              width: "100%",
              height: "100px",
              backgroundImage: "url('/assets/images/casinocards.png')",
              backgroundSize: "cover",
              backgroundPosition: "center",
              borderRight: "1px solid #000",
              borderRadius: "15px 15px 0px 0px",
              position: "relative",
            }}
          >
            <h2 id="modal-modal-title" className="Modal_title">
              {selectedLang?.CREATEAGENT}
            </h2>
          </div>
          <div className="modal-content">
            <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
              <Grid xs={12} md={6} className="pb-0 pt-0">
                <Box
                  className="tree_block"
                  sx={{
                    height: 370,
                    flexGrow: 1,
                    maxWidth: "100%",
                    overflowY: "auto",
                    backgroundColor: "#0E1B2B",
                    padding: "10px",
                    border: "1px solid #dddd",
                    borderRadius: "4px",
                  }}
                >
                  {/* <TreeView
                          aria-label="customized"
                          defaultExpanded={['1']}
                          defaultCollapseIcon={<MinusSquare />}
                          defaultExpandIcon={<PlusSquare />}
                          defaultEndIcon={<CloseSquare />}
                          sx={{ height: 264, flexGrow: 1, maxWidth: 400, overflowY: 'auto' }}
                        >
                          <StyledTreeItem nodeId="1" label="Main">
                            <StyledTreeItem nodeId="2" label="Hello" />
                            <StyledTreeItem nodeId="3" label="Subtree with children">
                              <StyledTreeItem nodeId="6" label="Hello" />
                              <StyledTreeItem nodeId="7" label="Sub-subtree with children">
                                <StyledTreeItem nodeId="9" label="Child 1" />
                                <StyledTreeItem nodeId="10" label="Child 2" />
                                <StyledTreeItem nodeId="11" label="Child 3" />
                              </StyledTreeItem>
                              <StyledTreeItem nodeId="8" label="Hello" />
                            </StyledTreeItem>
                            <StyledTreeItem nodeId="4" label="World" />
                            <StyledTreeItem nodeId="5" label="Something something" />
                          </StyledTreeItem>
                        </TreeView> */}

                  <TreeView
                    className="treeblock"
                    defaultCollapseIcon={<MinusSquare />}
                    defaultExpanded={["root"]}
                    defaultEndIcon={<CloseSquare />}
                    defaultExpandIcon={<PlusSquare />}
                    sx={{
                      maxHeight: "100%",
                      flexGrow: 1,
                      maxWidth: "100%",
                      color: "#fff",
                      overflowY: "auto",
                    }}
                  >
                    {agentTreeList.user_id
                      ? renderTree(agentTreeList)
                      : null}
                  </TreeView>
                </Box>
              </Grid>
              <Grid
                container
                spacing={3}
                sx={{
                  marginTop: "0px",
                }}
              >
                <Grid xs={12} md={6} className="pb-0 pt-0">
                  {" "}
                  <span className="modal_form_Lable" style={{ marginLeft: "4px" }}>
                    {selectedLang.agent_name} :-
                  </span>
                  <TextField
                    fullWidth
                    //   label={selectedLang.agent_name}
                    color="primary"
                    size="small"
                    value={agentDetails?.id ? agentDetails.id : ""}
                    sx={{
                      marginBottom: "05px",
                    }}
                  />
                </Grid>
                <Grid xs={12} md={6} className="pb-0 pt-0">
                  <span className="modal_form_Lable">
                    <span
                      style={{
                        color: "red",
                        marginRight: "4px",
                        marginLeft: "4px",
                      }}
                    >
                      *
                    </span>
                    {selectedLang.id} :-
                  </span>
                  <TextField
                    size="small"
                    fullWidth
                    //   label={
                    //     <span>
                    //       {`${selectedLang.id}`}
                    //       <span style={{ color: "red" }}>*</span>
                    //     </span>
                    //   }
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
                <Grid xs={12} md={6} className="pb-0 pt-0">
                  <span className="modal_form_Lable">
                    <span
                      style={{
                        color: "red",
                        marginRight: "4px",
                        marginLeft: "4px",
                      }}
                    >
                      *
                    </span>
                    {selectedLang.nick_name} :-
                  </span>
                  <TextField
                    id="nick-name-input"
                    size="small"
                    autoComplete="off"
                    fullWidth
                    //   label={
                    //     <span>
                    //       {`${selectedLang.nick_name}`}
                    //       <span style={{ color: "red" }}>*</span>
                    //     </span>
                    //   }
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
                    helperText={!isValidNickname && selectedLang.Invalid_nickname}
                  />
                </Grid>
                <Grid xs={12} md={6} className="pb-0 pt-0">
                  <span className="modal_form_Lable">
                    <span
                      style={{
                        color: "red",
                        marginRight: "4px",
                        marginLeft: "4px",
                      }}
                    >
                      *
                    </span>{" "}
                    {selectedLang.password} :-
                  </span>
                  <FormControl
                    size="small"
                    autoComplete="off"
                    sx={{ width: "100%" }}
                    variant="outlined"
                  >
                    {/* <InputLabel
                        htmlFor="outlined-adornment-password"
                        shrink={true}
                        style={{ color: passwordError ? "red" : "inherit" }}
                      >
                        {passwordError
                          ? selectedLang.Invalid_Password
                          : `${selectedLang.password}`}{" "}
                        <span style={{ color: "red" }}>*</span>
                      </InputLabel> */}
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
                            {showPassword ? <VisibilityOff /> : <Visibility />}
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
                <Grid xs={12} md={6} className="pb-0 pt-0">
                  <span className="modal_form_Lable">
                    <span
                      style={{
                        color: "red",
                        marginRight: "4px",
                        marginLeft: "4px",
                      }}
                    >
                      *
                    </span>
                    {selectedLang.rate} :-
                  </span>
                  <TextField
                    fullWidth
                    size="small"
                    //   label={
                    //     isInvalidInput ? (
                    //       <span style={{ color: "red" }}>
                    //         {isInvalidInput && selectedLang.Invalid_input}
                    //       </span>
                    //     ) : (
                    //       selectedLang.rate || "Rate"
                    //     )
                    //   }
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
                        borderBottomColor: isInvalidInput ? "red" : "inherit",
                      },
                    }}
                    error={isInvalidInput}
                    value={rate}
                    onChange={handleInputChange}
                  />
                </Grid>
                <Grid
                  xs={12}
                  md={6}
                  className="pb-0 pt-0"
                  style={{ marginTop: "10px" }}
                >
                  <FormControl size="small" sx={{ width: "100%" }}>
                    <span
                      className="modal_form_Lable"
                      style={{ marginBottom: "4px" }}
                    >
                      <span
                        style={{
                          color: "red",
                          marginRight: "4px",
                          marginLeft: "4px",
                        }}
                      >
                        *
                      </span>{" "}
                      {selectedLang.category} :-
                    </span>
                    {/* <InputLabel id="type">
                        {`${selectedLang.type}`}{" "}
                        <span style={{ color: "red" }}>*</span>
                      </InputLabel> */}
                    <Select
                      labelId="type"
                      id="dAffiliated-Agent"
                      // label={selectedLang.type}
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
                {role["role"] != "admin" ? (
                  <Grid xs={12} md={6} className="pb-0 pt-0">
                    <div className="flex items-center flex-wrap">
                      <div className="flex">
                        <div className="flex justify-start items-center">

                          <span
                            className="modal_form_Lable"
                            style={{ marginTop: "4px" }}
                          >
                            <span
                              style={{
                                color: "red",
                                marginRight: "4px",
                                marginLeft: "4px",
                              }}
                            >
                              *
                            </span>
                            {selectedLang.rpoint_for_provider} :-
                          </span>


                        </div>
                      </div>
                      <div
                        className="w-100"
                        style={{ width: "100%", marginTop: "10px" }}
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
                                // label={
                                //   selectedprovider == 1
                                //     ? `${selectedLang.rpoint_for_provider}`
                                //     : `${selectedLang.rpoint_for_provider}`
                                // }
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
                                  handleChange4(rpointIndex, numericValue);
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
                    <FormControl sx={{ width: "100%" }}>
                      <span
                        className="modal_form_Lable"
                        style={{ marginBottom: "4px" }}
                      >
                        <span
                          style={{
                            color: "red",
                            marginRight: "4px",
                            marginLeft: "4px",
                          }}
                        >
                          *
                        </span>
                        {selectedLang.currency} :-
                      </span>
                      <TextField
                        id="outlined-select-currency"
                        size="small"
                        select
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
                    </FormControl>
                  </Grid>
                )}

                <Grid
                  xs={12}
                  md={6}
                  className="pb-0 pt-0"
                  style={{ marginTop: "10px" }}
                >
                  <FormControl sx={{ width: "100%" }}>
                    <span
                      className="modal_form_Lable"
                      style={{ marginBottom: "4px" }}
                    >
                      <span
                        style={{
                          color: "red",
                          marginRight: "4px",
                          marginLeft: "4px",
                        }}
                      >
                        *
                      </span>{" "}
                      {selectedLang.time_zone} :-
                    </span>
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
                          // label={
                          //   <span>
                          //     {`${selectedLang.time_zone}`}
                          //     <span style={{ color: "red" }}>*</span>
                          //   </span>
                          // }
                          InputLabelProps={{ shrink: true }}
                        />
                      )}
                    />
                  </FormControl>
                </Grid>

                {role["role"] === "admin" && (
                  <Grid xs={12} md={6}>
                    <FormControl sx={{ width: "100%" }}>
                      <span
                        className="modal_form_Lable"
                        style={{ marginBottom: "4px" }}
                      >
                        <span
                          style={{
                            color: "red",
                            marginRight: "4px",
                            marginLeft: "4px",
                          }}
                        >
                          *
                        </span>
                        {selectedLang.POT} :-
                      </span>
                      <TextField
                        size="small"
                        sx={{
                          width: "100%",
                        }}
                        type="text"
                        fullWidth
                        className="flex-auto grow"
                        value={formatAmount(fields[agentProvider - 1])}
                        onChange={(e) => {
                          const inputValue = e.target.value;
                          const numericValue = inputValue.replace(/[^0-9.]/g, "");
                          handleChange4(agentProvider - 1, numericValue);
                        }}
                      />
                    </FormControl>
                  </Grid>
                )}

                <Grid
                  xs={12}
                  md={6}
                  className="pb-0 pt-0"
                  style={{ marginTop: "10px" }}
                >
                  {(role["role"] == "admin" || role["role"] == "cs") && (
                    <>
                      <FormControl sx={{ width: "100%" }}>
                        <span
                          className="modal_form_Lable"
                          style={{ marginBottom: "4px" }}
                        >
                          <span
                            style={{
                              color: "red",
                              marginRight: "4px",
                              marginLeft: "4px",
                            }}
                          >
                            *
                          </span>{" "}
                          {selectedLang.language} :-
                        </span>
                        <TextField
                          InputLabelProps={{
                            shrink: true,
                          }}
                          size="small"
                          id="outlined-select-currency"
                          select
                          // label={
                          //   <span>
                          //     {`${selectedLang.language}`}
                          //     <span style={{ color: "red" }}>*</span>
                          //   </span>
                          // }
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
                      </FormControl>
                    </>
                  )}
                  <Grid xs={12} md={6}>
                    <FormControl sx={{ width: "100%" }}>
                      <span className="modal_form_Lable" style={{ marginLeft: "4px" }}>

                        {selectedLang.memo} :-
                      </span>
                      <TextField
                        fullWidth
                        size="small"
                        variant="outlined"
                        className="memo_input"
                        //   label={selectedLang.memo}
                        // placeholder={selectedLang.memo}
                        multiline
                        rows={5}
                        maxRows={10}
                        value={memo}
                        onChange={(e) => {
                          setMemo(e.target.value);
                        }}
                      />
                    </FormControl>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>


            <div
              className="flex justify-center items-center"
              style={{ marginTop: "30px" }}
            >
              {BtnVisible && (
                <Button
                  className="flex item-center"
                  variant="outlined"
                  color="secondary"
                  startIcon={<CancelIcon size={20}></CancelIcon>}
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
                  sx={
                    {
                      //   borderRadius: "4px",
                    }
                  }
                  onClick={(e) => submitUserDetails(e)}
                >
                  {selectedLang.produce}
                </Button>
              )}
            </div>
          </div>
        </div>
      </Box>
    </Modal>
  );
};

export default ModalComponent;
