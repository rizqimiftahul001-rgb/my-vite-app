/** @format */

import * as React from "react";
import FusePageSimple from "@fuse/core/FusePageSimple";
import AgentTreeListHeader from "./agentTreeListHeader";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { locale } from "../../../../configs/navigation-i18n";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ExpandMoreOutlinedIcon from "@mui/icons-material/ExpandMoreOutlined";
import TreeView from "@mui/lab/TreeView";
import TreeItem from "@mui/lab/TreeItem";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { CardActionArea, CardActions } from "@mui/material";
import "./agentTree.css";
import Grid from "@mui/material/Unstable_Grid2";
import TextField from "@mui/material/TextField";
import DataHandler from "src/app/handlers/DataHandler";
import APIService from "src/app/services/APIService";
import FuseLoading from "@fuse/core/FuseLoading";
import { showMessage } from "app/store/fuse/messageSlice";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import OutlinedInput from "@mui/material/OutlinedInput";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import APISupport from "src/app/services/APISupport";

import SvgIcon from "@mui/material/SvgIcon";
import { alpha, styled } from "@mui/material/styles";
import { formatSentence } from "src/app/services/Utility";

import queryString from "query-string";

function agentTreeListApp() {
  const dispatch = useDispatch();
  const user_id = DataHandler.getFromSession("user_id");
  const [agentTreeList, setAgentTreeList] = useState([]);
  const [agentDetails, setAgentDetails] = useState();
  const { search } = window.location;
  const { q_agent } = queryString.parse(search);
  const [selectedUserId, setSelectedUserId] = useState(q_agent !== undefined ? q_agent: user_id);
  const [type, setType] = useState("");
  const [selectLocale] = useSelector((state) => [state.locale.selectLocale]);
  const [selectedprovider] = useSelector((state) => [
    state.provider.selectedprovider,
  ]);
  const [selectedLang, setSelectedLang] = useState(locale.en);
  const [loaded, setLoaded] = useState(true);
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

  useEffect(() => {
    getTypes();
    getAgentTreeList();
    getAgentDetails();
  }, []);

  useEffect(() => {
    getAgentDetails();
  }, [selectedUserId, selectedprovider]);






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

  const getTypes = () => {
    APIService({
      url: `${process.env.REACT_APP_R_SITE_API}/type/get-type`,
      method: "GET",
    })
      .then((data) => {
        setType(data.data.data);
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

  const getUserType = (val) => {
    switch (val) {
      case "0":
        return type[0].type_name;
      case "1":
        return type[1].type_name;
      case "2":
        return type[2].type_name;
    }
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

  const [rate, _rate] = useState("");
  const [currency, _currency] = useState("");
  const [nickname, _nickname] = useState("");
  const [changePassword, _changePassword] = useState("");

  useEffect(() => {
    _rate(agentDetails?.userHolding?.rate || 0);
    _currency(agentDetails?.currency);
    _nickname(agentDetails?.nickname);
  }, [agentDetails]);

  const handleEditDetails = () => {
    APIService({
      url: `${process.env.REACT_APP_R_SITE_API}/user/edit-user-details`,
      method: "PUT",
      data: {
        user_id: user_id,
        agent_id: agentDetails?.user_id,
        changePassword: changePassword,
        rate: rate,
        nickname: nickname,
      },
    })
      .then((data) => {
        if (changePassword != "") {
          APISupport({
            url: process.env.REACT_APP_CS_SITE_RESET_PW,
            method: "POST",
            data: {
              userId: agentDetails?.id,
              password: changePassword,
            },
          })
            .then((data) => { })
            .catch((err) => { })
            .finally(() => { });
        }
        dispatch(
          showMessage({
            variant: "success",
            message: `${selectedLang.user_details_update_successfull}`,
          })
        );
      })
      .catch((err) => {
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
  };

  const [showNewPassword, setShowNewPassword] = React.useState(false);
  const handleClickShowNewPassword = () => setShowNewPassword((show) => !show);
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
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

  // const StyledTreeItem = styled(CustomTreeItem)(({ theme }) => ({

  // }));

  return (
    <>
      {" "}
      {loaded ? (
        <FuseLoading />
      ) : (
        <FusePageSimple
          header={<AgentTreeListHeader selectedLang={selectedLang} />}
          content={
            <Card
              sx={{ width: "100%", marginTop: "20px", borderRadius: "4px" }}
              className="main_card"
            >
              <div>
                {agentTreeList ? (
                  <CardContent>
                    <Grid
                      container
                      rowSpacing={1}
                      columnSpacing={{ xs: 1, sm: 2, md: 3 }}
                    >
                      <Grid xs={12} md={4}>
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
                              color:"#fff",
                              overflowY: "auto",
                            }}
                          >
                            {agentTreeList.user_id
                              ? renderTree(agentTreeList)
                              : null}
                          </TreeView>
                        </Box>
                      </Grid>
                      <Grid xs={12} md={8} className="width_full">
                        <Grid
                          container
                          spacing={3}
                          sx={{ paddingTop: "10px" }}
                        >
                          <Grid
                            xs={12}
                            md={6}
                            className="allinpout"
                            sx={{ paddingBottom: "10px" }}
                          >
                            <TextField
                              fullWidth
                              label={selectedLang.agent_name}
                              id="fullWidth"
                              size="small"
                              color="primary"
                              value={agentDetails?.id ? agentDetails.id : ""}
                              InputProps={{
                                readOnly: true,
                              }}
                            />
                          </Grid>
                          <Grid
                            xs={12}
                            md={6}
                            className="allinpout"
                            sx={{ paddingBottom: "10px" }}
                          >
                            <TextField
                              fullWidth
                              label={selectedLang.balance}
                              size="small"
                              id="fullWidth"
                              color="primary"
                              value={
                                formatAmount(
                                  agentDetails?.userHolding?.balance_amount
                                )
                                  ? formatAmount(
                                    agentDetails.userHolding.balance_amount
                                  )
                                  : ""
                              }
                              InputProps={{
                                readOnly: true,
                              }}
                            />
                          </Grid>
                          <Grid
                            xs={12}
                            md={6}
                            className="allinpout"
                            sx={{ paddingBottom: "10px" }}
                          >
                            <TextField
                              fullWidth
                              label={selectedLang.type}
                              size="small"
                              id="fullWidth"
                              color="primary"
                              value={
                                type.length > 0 && agentDetails?.type
                                  ? selectedLang[
                                  `${getUserType(agentDetails?.type)}`
                                  ]
                                  : ""
                              }
                              InputProps={{
                                readOnly: true,
                              }}
                            />
                          </Grid>
                          <Grid
                            xs={12}
                            md={6}
                            className="allinpout"
                            sx={{ paddingBottom: "10px" }}
                          >
                            <TextField
                              fullWidth
                              label={selectedLang.tot_amount_paid}
                              id="fullWidth"
                              size="small"
                              color="primary"
                              value={
                                formatAmount(
                                  agentDetails?.userHolding?.total_payment
                                )
                                  ? formatAmount(
                                    agentDetails.userHolding.total_payment
                                  )
                                  : ""
                              }
                              inputProps={{
                                inputMode: "numeric",
                                readOnly: true,
                              }}
                            />
                          </Grid>
                          <Grid
                            xs={12}
                            md={6}
                            className="allinpout"
                            sx={{ paddingBottom: "10px" }}
                          >
                            <TextField
                              fullWidth
                              label={selectedLang.rate}
                              size="small"
                              id="fullWidth"
                              InputLabelProps={{ shrink: true }}
                              // defaultValue={rate}
                              color="primary"
                              // InputProps={{
                              //   readOnly: true,
                              // }}
                              onChange={({ target }) => {
                                _rate(target.value);
                              }}
                              value={rate}
                            />
                          </Grid>
                          <Grid
                            xs={12}
                            md={6}
                            className="allinpout"
                            sx={{ paddingBottom: "10px" }}
                          >
                            <TextField
                              fullWidth
                              label={selectedLang.tot_amount_charge}
                              size="small"
                              id="fullWidth"
                              color="primary"
                              value={
                                formatAmount(
                                  agentDetails?.userHolding
                                    ?.total_charged_amount
                                )
                                  ? formatAmount(
                                    agentDetails.userHolding
                                      .total_charged_amount
                                  )
                                  : ""
                              }
                              InputProps={{
                                readOnly: true,
                              }}
                            />
                          </Grid>
                          <Grid
                            xs={12}
                            md={6}
                            className="allinpout"
                            sx={{ paddingBottom: "10px" }}
                          >
                            <TextField
                              fullWidth
                              label={selectedLang.currency}
                              InputLabelProps={{ shrink: true }}
                              id="fullWidth"
                              size="small"
                              color="primary"
                              value={currency}
                              InputProps={{
                                readOnly: true,
                              }}
                            // onChange={({target})=>{_currency(target.value)}}
                            />
                          </Grid>
                          <Grid
                            xs={12}
                            md={12}
                            className="allinpout"
                            sx={{ paddingBottom: "10px" }}
                          >
                            <TextField
                              fullWidth
                              label={selectedLang.nickname}
                              size="small"
                              id="fullWidth"
                              color="primary"
                              value={nickname}
                              inputProps={{ maxLength: 10 }}
                              InputLabelProps={{ shrink: true }}
                              // InputProps={{
                              //   readOnly: true,
                              // }}
                              onChange={({ target }) => {
                                _nickname(target.value);
                              }}
                            />
                          </Grid>
                          {/* <Grid xs={12} md={12} sx={{paddingBottom:"5px"}}>
                          <TextField
                            fullWidth
                            label={selectedLang.password}
                            id="fullWidth"
                            color="primary"
                            onChange={({target})=>{_changePassword(target.value)}}
                          />
                        </Grid> */}
                          <Grid item xs={12} md={12} className="allinpout">
                            <FormControl
                              size="small"
                              sx={{ width: "100%" }}
                              variant="outlined"
                            >
                              <InputLabel htmlFor="outlined-adornment-password">
                                {selectedLang.new_password}
                                {/* <span style={{ color: "red" }}>*</span> */}
                              </InputLabel>
                              <OutlinedInput
                                size="small"
                                id="outlined-adornment-password"
                                autoComplete="off"
                                inputProps={{ maxLength: 16 }}
                                type={showNewPassword ? "text" : "password"}
                                onChange={({ target }) => {
                                  _changePassword(target.value);
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
                        </Grid>
                        <Button
                          className="flex item-center mt-20 btns"
                          variant="contained"
                          color="secondary"
                          endIcon={
                            <CheckCircleIcon size={20}></CheckCircleIcon>
                          }
                          sx={{
                            borderRadius: "4px",
                          }}
                          onClick={() => handleEditDetails()}
                        >
                          {selectedLang.save}
                        </Button>
                      </Grid>
                    </Grid>
                  </CardContent>
                ) : (
                  <FuseLoading />
                )}
              </div>
            </Card>
          }
        />
      )}
    </>
  );
}

export default agentTreeListApp;
