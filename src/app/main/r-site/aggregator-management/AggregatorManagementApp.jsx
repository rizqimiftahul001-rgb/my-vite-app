import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import TableContainer from "@mui/material/TableContainer";
import Paper from "@mui/material/Paper";
import FusePageSimple from "@fuse/core/FusePageSimple";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import "./provider.css"; // Ensure this is imported
import AggregatorManagement from "./AggregatorManagementHeader";
import APIService from "src/app/services/APIService";
import { useDispatch } from "react-redux";
import { showMessage, hideMessage } from "app/store/fuse/messageSlice";
import FuseLoading from "@fuse/core/FuseLoading/FuseLoading";
import { locale } from "../../../configs/navigation-i18n";
import DataHandler from "src/app/handlers/DataHandler";
import { useSelector } from "react-redux";
import { Button, MenuItem, Select } from "@mui/material";
import FormControl from "@mui/material/FormControl";
import { Autocomplete } from "@mui/material";
import TextField from "@mui/material/TextField";
import jwtDecode from "jwt-decode";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Unstable_Grid2";
import DoneIcon from "@mui/icons-material/Done";
import { truncate } from "lodash";

function AggregatorManagementApp() {
  const navigate = useNavigate(); // Initialize useNavigate
  const [selectLocale] = useSelector((state) => [state.locale.selectLocale]);
  const user_id = DataHandler.getFromSession("user_id");
  const [role, setRole] = useState(
    jwtDecode(DataHandler.getFromSession("accessToken"))["data"]
  );
  const [selectedLang, setSelectedLang] = useState(locale.ko);
  const dispatch = useDispatch();
  const [tableData, setTableData] = useState([]);
  const [error, setError] = useState(null);
  const [providerList, setProviderList] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedCheckboxes, setSelectedCheckboxes] = useState([]);
  const [agentName, setAgentName] = useState([]);
  const [affiliateAgent, setAffiliateAgent] = useState("");
  const [agents, setAgents] = useState([]);
  const [selectedAgent, setSelectedAgent] = useState("admin");
  const [selectedprovider] = useSelector((state) => [
    state.provider.selectedprovider,
  ]);

  const [loading2, setLoading2] = useState(true);
  const [open,setOpen] =useState(false);
  const [disableButton, setButtonStats] = useState(false);
  const [checkedProvider ,SetCheckedProvider] =useState("")
  const [checkAllAgents ,SetCheckAllAgents]=useState(false)

  useEffect(() => {
    const expectedUserId = "user_id";
    if (role["role"] !== "admin" && user_id !== expectedUserId) {
      if (user_id !== expectedUserId) {
        navigate("/pages/error/404");
      }
    }
  }, [navigate, user_id, role]);

  useEffect(() => {
    if (selectLocale == "ko") {
      setSelectedLang(locale.ko);
    } else {
      setSelectedLang(locale.en);
    }
  }, [selectLocale]);

  useEffect(() => {
    getAgentName();
    fetchProvider(selectedAgent);
  }, []);

  const getAgentName = () => {
    APIService({
      url: `${process.env.REACT_APP_R_SITE_API}/user/agent-name-list?user_id=${user_id}&provider=${selectedprovider}`,
      method: "GET",
    })
      .then((res) => {
        setAgentName(res.data.data.UserDataResult.subAgentUsers);
      })
      .catch((err) => {
        setAgentName([]);
      })
      .finally(() => {
        setLoading2(false);
      });
  };

  const addDynamicSearch = (event, newValue) => {
    if (newValue) {
      setSelectedAgent(newValue);
      fetchProvider(newValue);
    }
  };

  const fetchProvider = (agentName) => {
    setLoading(true);

    APIService({
      url: `${process.env.REACT_APP_R_SITE_API}/user/get-agent-aggre?agent=${agentName}`,
      method: "GET",
    })
      .then((res) => {
        const providerListData = res.data.data.providerList  ;
        setProviderList(providerListData);

        const vendorListData = res.data.data.vendorList;

        const initialTableData = vendorListData
        .sort((a, b) => a.vendor_name.localeCompare(b.vendor_name))
        .map((vendor) => {
          const aggregatorProviderId = vendor.aggregator;

          const aggregatorStatusMap = new Map(
            providerListData.map((provider) => [
              provider.provider_id,
              aggregatorProviderId === provider.provider_id,
            ])
          );

          return {
            vendorId: vendor.vendor_id,
            vendorName: vendor.vendor_name,
            vendorNameKr:vendor.vendor_name_kr,
            providerData: providerListData.map((provider) => ({
              providerId: provider.provider_id,
              providerName: provider.provider_name,
              isChecked:
                vendor.vendor_select &&
                provider.provider_name == vendor.provider_name,
            })),
          };
        });
       
       
        setTableData(initialTableData);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setError(error.message);
        showNotification("error", `${selectedLang.something_went_wrong}`);
        setLoading(false);
      });
  };

 
const  isAlreadyChecked =(providerId) =>{
  
  let  vendorCheckedCount=0
  let  absentCheckBoxes=0
  tableData.forEach((vendor)=>{

      vendor.providerData.forEach((provider)=>{
          // ((providerId ===provider.providerId) && (provider.isChecked===true) && isCheckBoxExist ) ? vendorCheckedCount++ : null

           if(providerId ===provider.providerId )
           {
              if(provider.isChecked===true) vendorCheckedCount++

              const isCheckBoxExist =disableVendorCheackBox(provider,vendor);
              if(!isCheckBoxExist) absentCheckBoxes++ ;         
           }
      })    
  })
  if (vendorCheckedCount==(tableData.length-absentCheckBoxes) ){
      return true;
  } 
  else{
    return false;
  }
}


const enableAllVendors = (providerId, flag) => {
  let isCheckBoxExist = false;

  const updateAllAgents = tableData.map((vendor) => {
    // Check if the provider with providerId exists and set isCheckBoxExist
    for (let index = 0; index < vendor.providerData.length; index++) {
      if (vendor.providerData[index].providerId === providerId) {
        isCheckBoxExist = disableVendorCheackBox(vendor.providerData[index], vendor);
       
        break;
      }
    }
    return {
      ...vendor,
      providerData: vendor.providerData.map((provider) => ({
        ...provider,
        isChecked: disableVendorCheackBox(provider, vendor)
          ? (provider.providerId === providerId
            ? flag
            : (isCheckBoxExist ? false : provider.isChecked))
          : null
      }))
    };
  });

  SetCheckedProvider(providerId);
  SetCheckAllAgents(true);
  setTableData(updateAllAgents);
};


  useEffect(() => {
    console.log("checkAllAgents in useEffect", checkAllAgents);
  }, [checkAllAgents,checkedProvider]);


  const disableAllVendors =(providerId,flag) =>{ 

    const updateAllAgents = tableData.map((vendor) => {
      
      return {
        ...vendor,
        providerData: vendor.providerData.map((provider) => ({
          ...provider,
          isChecked: (provider.providerId ===providerId)? flag : ( disableVendorCheackBox(provider ,vendor)?provider.isChecked :null )
        }))
      };

    


    });

      SetCheckAllAgents(false);
      setTableData(updateAllAgents);
  
  }

  const disableVendorCheackBox =(provider,vendor)=>{

    if(
      (provider.providerName === "invest" &&
        vendor.vendorName !== "pragmatic") ||
        (provider.providerName === "common-invest" &&
          (vendor.vendorName != "habanero" && 
            vendor.vendorName !="dreamgame"&&
            vendor.vendorName !="relax-gaming" && 
            vendor.vendorName !="nolimitcity" && 
            vendor.vendorName!="net ent" &&
            vendor.vendorName!="pragmatic-live") &&
            vendor.vendorName!="thunderkick" &&
            vendor.vendorName!="slotmill" &&
            vendor.vendorName!="revolver" &&
            vendor.vendorName!="dreamtech" &&
            vendor.vendorName!="hacksaw" &&
            vendor.vendorName!="mobilots" &&
            vendor.vendorName!="nolimitcity" &&
            vendor.vendorName!="onetouch" &&
            vendor.vendorName!="ezugi" &&
            vendor.vendorName!="quickspin" &&
            vendor.vendorName!="realtime-gaming" &&
            vendor.vendorName!="red tiger" &&
            vendor.vendorName!="redrake" &&
            vendor.vendorName !="evolution" &&
            vendor.vendorName !="revolver" &&
            vendor.vendorName !="sexybcrt" &&
            vendor.vendorName !="Slotmill" &&
            vendor.vendorName !="spearhead-studios" &&
            vendor.vendorName !="thunderkick" &&
            vendor.vendorName !="vivo" && 
            vendor.vendorName !="woohoo-games" &&
            vendor.vendorName !="micro-gaming-live"
          ) 
            || 
            (provider.providerName === "delphi" && vendor.vendorName != "evolution") ||
            (provider.providerName === "common-invest" && vendor.vendorName === "pragmatic")
    ){
      
      return false
    }else{
      return true
    }

  }

  const handleCheckboxChange = (vendorId, providerId) => {
    const updatedTableData = tableData.map((vendor) =>
      vendor.vendorId === vendorId
        ? {
            ...vendor,
            providerData: vendor.providerData.map((provider) => ({
              ...provider,
              isChecked:
                provider.providerId === providerId
                  ? !provider.isChecked
                  : false,
            })),
          }
        : vendor
    );

    const selectedCheckbox = {
      vendor_id: vendorId,
      provider_id: providerId,
    };
    setSelectedCheckboxes((prevCheckboxes) => {
      const existingCheckboxIndex = prevCheckboxes.findIndex(
        (checkbox) =>
          checkbox.vendor_id === vendorId && checkbox.provider_id === providerId
      );

      if (existingCheckboxIndex !== -1) {
        // If checkbox already exists, remove it from the array
        prevCheckboxes.splice(existingCheckboxIndex, 1);
      }

      // If checkbox is checked, add it to the array with the original provider_id, else add with an empty string
      if (
        updatedTableData
          .find((vendor) => vendor.vendorId === vendorId)
          ?.providerData.find((provider) => provider.providerId === providerId)
          ?.isChecked
      ) {
        prevCheckboxes.push(selectedCheckbox);
      } else {
        prevCheckboxes.push({
          vendor_id: vendorId,
          provider_id: "",
        });
      }

      return [...prevCheckboxes];
    });

    setTableData(updatedTableData);
  };

  let selectedLanguage = localStorage.getItem("selectedLanguage");

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


  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen =() =>{
    setOpen(true);
  }

  const changeAllAgents=()=>{

    //need to disable the ui
    setOpen(false);
    setLoading(true)
    APIService({
      url: `${process.env.REACT_APP_R_SITE_API}/user/enable-all-agents?user_id=${user_id}`,
      method: "POST",
      data: JSON.stringify({
        agent_id: selectedAgent
      }),
    })
      .then((data) => {
        if (data.success) {
          showNotification("success", "Update successful!");
        } else {
          showNotification("success", "Update successful!");
        }
        setLoading(false);
        fetchProvider(selectedAgent)
        
      })
      .catch((error) => {
        console.error("Error calling API:", error);
        showNotification("error", `${error.message}`);
        setLoading(false);
      });

  }

  const handleSave = () => {
    const aggregate = [];
    tableData.forEach((vendor) => {
      vendor.providerData.forEach((provider) => {
        if (provider.isChecked) {
          aggregate.push({
            vendor_name: vendor.vendorName,
            provider_id: provider.providerId,
            provider_name: provider.providerName,
          });
        }
      });
    });

  
        APIService({
          url: `${process.env.REACT_APP_R_SITE_API}/user/add-agent-aggre`,
          method: "POST",
          data: JSON.stringify({
            agent_id: selectedAgent,
            aggregate: aggregate,
          }),
        })
          .then((data) => {
            if (data.success) {
              showNotification("success", "Update successful!");
            } else {
              showNotification("success", "Update successful!");
            }
          })
          .catch((error) => {
            console.error("Error calling API:", error);
            showNotification("error", `${error.message}`);
          });

  };

  // Load previously selected checkboxes from local storage on component mount
  useEffect(() => {
    const savedCheckboxes = localStorage.getItem("selectedCheckboxes");
    if (savedCheckboxes) {
      setSelectedCheckboxes(JSON.parse(savedCheckboxes));
    }
  }, []);

  const showNotification = (type, message) => {
    dispatch(showMessage({ variant: type, message }));

    setTimeout(() => {
      dispatch(hideMessage());
    }, 3000);
  };

  tableData.forEach(async (data) => {
    data.providerData = data.providerData.filter(
      (data2) =>
        data2.providerName !== "aqua" && data2.providerName !== "kingpot"
    );
  });

  const priorityOrder = ["honor", "vinus", "timeless"];

  return loading ? (
    <FuseLoading />
  ) : (
    <FusePageSimple
      header={<AggregatorManagement selectedLang={selectedLang} />}
      content={
        <Card
          sx={{ width: "100%", marginTop: "20px", borderRadius: "4px" }}
          className="main_card"
        >

               <Modal
                open={open}
                onClose={handleClose}
                className="small_modal"
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
              >
                <Box sx={style} className="Mymodal">
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

                  <div>
                    <Grid
                      key={"grid-main"}
                      container
                      rowSpacing={1}
                      columnSpacing={{ xs: 1, sm: 2, md: 3 }}
                    >
                      <Grid xs={12} md={12} key={"grid-sub"}>
                        <Grid
                          key={"grid1"}
                          container
                          spacing={3}
                          sx={{
                            marginTop: "0px",
                            justifyContent: "flex-end",
                          }}
                        >
                          <Grid
                            xs={12}
                            md={12}
                            key={"grid3"}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              width: "100%",
                              paddingTop: "0",
                            }}
                          >
                            <Typography
                              id="modal-modal-title"
                              style={{ fontSize: "16px" }}
                            >
                              {selectedLang.apply_all_agents} 
                            </Typography>
                          </Grid>

                     
                          <Grid
                            key={"grid6"}
                            xs={12}
                            md={12}
                            style={{ width: "100%", paddingTop: "0" }}
                          >
                            {" "}
                            <Button
                              disabled={disableButton}
                              key={"button-2"}
                              className="flex justify-center"
                              variant="contained"
                              color="secondary"
                              style={{ width: "100%" }}
                              endIcon={
                                <DoneIcon
                                  key={"deone-icon"}
                                  size={20}
                                ></DoneIcon>
                              }
                              sx={{
                                borderRadius: "4px",
                              }}
                              onClick={(e) => changeAllAgents(e)}
                            >
                              {selectedLang.enable}
                            </Button>
                          </Grid>

                        </Grid>
                      </Grid>
                    </Grid>
                  </div>
                </Box>
              </Modal>


          <CardContent style={{ paddingBottom: "0" }}>
            {error ? (
              <div>Error fetching data: {error}</div>
            ) : (
              <>
                <FormControl>
                  <Autocomplete
                    onChange={addDynamicSearch}
                    onInputChange={(event, newValue) => {
                      // event.preventDefault();
                      setSelectedAgent(newValue);
                    }}
                    sx={{
                      ml: 0,
                      flex: 1,
                      borderRadius: "4px",
                      padding: "6px 0px",
                      marginRight: "10px",
                      width: "240px",
                    }}
                    value={selectedAgent || null}
                    className=""
                    variant="outlined"
                    disablePortal
                    size="small"
                    id="combo-box-demo"
                    options={agentName.map((a) => a.id)}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        className="textSearch"
                        label={selectedLang.agent_id}
                      />
                    )}
                  />
                </FormControl>

                <TableContainer
                  component={Paper}
                  style={{
                    overflowX: "auto",
                    borderRadius: 0,
                    height: tableData.length > 0 ? "600px" : "auto",
                    borderTop:
                      tableData.length === 0
                        ? "1px solid var(--common_color)"
                        : "none",
                  }}
                >
                  <Table style={{ minWidth: 650, borderRadius: 0 }}>
                    <TableHead>
                      <TableRow>
                        <TableCell
                          className="sticky-header"
                          style={{ width: "10%", textAlign: "center" }}
                        >
                          {selectedLang.AGGREGATOR_PROVIDER}
                        </TableCell>
                            {providerList &&
                              providerList
                                .sort((a, b) => {
                                  // Define priority order
                                  const priorityOrder = ["honor", "vinus", "timeless"];
                                  const indexA = priorityOrder.indexOf(a.provider_name);
                                  const indexB = priorityOrder.indexOf(b.provider_name);

                                  // If a provider is in priorityOrder, it should come first
                                  if (indexA !== -1 && indexB === -1) return -1;
                                  if (indexA === -1 && indexB !== -1) return 1;
                                  if (indexA !== -1 && indexB !== -1) return indexA - indexB;

                                  // Otherwise, sort alphabetically
                                  return a.provider_name.localeCompare(b.provider_name);
                                })
                                .filter(
                                  (provider) =>
                                    provider.provider_name !== "aqua" &&
                                    provider.provider_name !== "kingpot"
                                )
                                .map((provider) => (
                                  <TableCell
                                    key={provider.provider_id}
                                    className="sticky-header"
                                    style={{ width: "10%", textAlign: "center" }}
                                  >
                                    <div style={{ display: "flex", justifyContent: "center", gap: "10px" }}>
                                      <div>{provider.provider_name}</div>

                                      <div>
                                        {role["role"] === "admin" && (
                                          <div>
                                            <input
                                              type="checkbox"
                                              style={{
                                                textAlign: "center",
                                                borderRadius: "0 !important"
                                              }}
                                              checked={isAlreadyChecked(provider.provider_id)}
                                              onChange={(e) => {
                                                if (!isAlreadyChecked(provider.provider_id)) {
                                                  enableAllVendors(provider.provider_id, true);
                                                } else {
                                                  disableAllVendors(provider.provider_id, false);
                                                }
                                              }}
                                            />
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  </TableCell>
                                ))}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {tableData.map((vendor, rowIndex) => (
                          <TableRow key={vendor.vendorId}>
                            <TableCell style={{ borderRadius: "0 !important", textAlign: "center" }}>
                              {selectedLanguage === "en" ? vendor.vendorName : vendor.vendorNameKr}
                            </TableCell>

                            {vendor.providerData
                              .sort((a, b) => {
                                const indexA = priorityOrder.indexOf(a.providerName);
                                const indexB = priorityOrder.indexOf(b.providerName);

                                // If a provider is in priorityOrder, it should come first
                                if (indexA !== -1 && indexB === -1) return -1;
                                if (indexA === -1 && indexB !== -1) return 1;
                                if (indexA !== -1 && indexB !== -1) return indexA - indexB;

                                // Otherwise, sort alphabetically
                                return a.providerName.localeCompare(b.providerName);
                              })
                              .map((provider, colIndex) => (
                                <TableCell
                                  key={provider.providerId}
                                  style={{
                                    textAlign: "center",
                                    borderRadius: "0 !important",
                                  }}
                                >
                                  <div>
                                    {disableVendorCheackBox(provider, vendor) && (
                                      <input
                                        type="checkbox"
                                        style={{
                                          transform: "scale(1.5)",
                                          backgroundColor: "grey",
                                        }}
                                        checked={provider.isChecked}
                                        onChange={() =>
                                          handleCheckboxChange(
                                            vendor.vendorId,
                                            provider.providerId
                                          )
                                        }
                                      />
                                    )}
                                  </div>
                                </TableCell>
                              ))}
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </>
            )}

        <div style={{ display:"flex",gap: "10px", justifyContent:"flex-start" }}>

            <div className="savebrns mb-0">
              <Button
                variant="contained"
                className="save_btn"
                style={{ marginBottom: "0" }}
                onClick={handleSave}
              >
                {selectedLang.save}
              </Button>
            </div>

            <div className="savebrns mb-0">
                <Button
                  variant="contained"
                  className="save_btn"
                  style={{ marginBottom: "5px" ,width: "100px"}}
                  onClick={handleOpen}
                >
                  {selectedLang.sync_admin}
                </Button>
            </div>

          </div>


          </CardContent>
        </Card>
      }
    />
  );
}

export default AggregatorManagementApp;
