import React, { useEffect, useState } from "react";
import "./provider.css";
import VendorGameListHeader from "./VendorGameListHeader";
import CardContent from "@mui/material/CardContent";
import Swal from 'sweetalert2';
import Table from "@mui/material/Table";
import Grid from "@mui/material/Unstable_Grid2";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Modal from "@mui/material/Modal";
import { useDispatch } from "react-redux";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import InputBase from "@mui/material/InputBase";
import SearchIcon from "@mui/icons-material/Search";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Box from "@mui/material/Box";
import TableBody from "@mui/material/TableBody";
import { showMessage } from "app/store/fuse/messageSlice";
import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import APIService from "src/app/services/APIService";
import FusePageSimple from "@fuse/core/FusePageSimple";
import FuseLoading from "@fuse/core/FuseLoading/FuseLoading";
import { locale } from "../../../configs/navigation-i18n";
import { useSelector } from "react-redux";
import DataHandler from "src/app/handlers/DataHandler";

function VendorGameListApp() {
  const [vendorList, setVendorList] = useState(null);
  const [vendorName, setVendorName] = useState("");
  const [vendorNameValue,setVendorNameValue] = useState("");
  const [vendorId, setvendorId] = useState([]);
  const [gameType, setGameType] = useState([]);
  const [detailHistory, setDetailHistory] = useState("");
  const [gameList, setgameList] = useState("");
  const [lobbyList, setlobbyList] = useState("");
  const [loaded, setLoaded] = useState(true);
  const [selectedLang, setSelectedLang] = useState(locale.ko);
  const [selectLocale] = useSelector((state) => [state.locale.selectLocale]);
  const [showkr, setShowKR] = useState(false);
  const [koreaValue, setkoreaValue] = useState(false);
  const [otherValue, setotherValue] = useState(false);
  const [koreaLangValue, setkoreaLangValue] = useState(false);
  const [otherLangValue, setotherLangValue] = useState(false);
  const [KRW, setKRW] = useState(false);
  const [USD, setUSD] = useState(false);
  const [JPY, setJPY] = useState(false);
  const [EUR, setEUR] = useState(false);
  const [addStatus ,setStatus] =useState(false)
  const [selectedData, setSelectedData] = React.useState({});
  const [addNewVendorData,setNewVendorData] =React.useState({});
  const [originalSelectedData, setOriginalSelectedData] = useState({});
  const [openWithdraw, setOpenWithdraw] = React.useState(false);
  const [openAddVendor,setOpenAddVendor] =React.useState()
  const dispatch = useDispatch();

  const role = DataHandler.getFromSession("role");
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

  const handleOpenWithdraw = (vendor) => {
    if (vendor.availability !== undefined) {
      setkoreaValue(vendor.availability.korea);
      setotherValue(vendor.availability.other);
    } else {
      setkoreaValue(false);
      setotherValue(false);
    }

    if (vendor.language !== undefined) {
      setkoreaLangValue(vendor.language.korean);
      setotherLangValue(vendor.language.other)
    } else {
      setkoreaLangValue(false);
      setotherLangValue(false)
    }

    if (vendor.currency !== undefined) {
      setKRW(vendor.currency.KRW);
      setUSD(vendor.currency.USD);
      setJPY(vendor.currency.JPY);
      setEUR(vendor.currency.EUR);
    } else {
      setKRW(false);
      setUSD(false);
      setJPY(false);
      setEUR(false);
    }

    setOriginalSelectedData(vendor);
    let newArr2 = [];
    let newData = [vendor];
    newData.forEach((data) => {
      newArr2.push(data.type);
    });
    setGameType(newArr2);
    setSelectedData(vendor);
    setOpenWithdraw(true);
  };

  const handleOpenAddVendor =()=>{
    setOpenAddVendor(true)
  }

  const handleCloseWithdraw = () => {
    setOpenWithdraw(false);
  };
  const handleCloseAddVendor=()=>{
    setOpenAddVendor(false)
  }

  const handleSubmit = () => {
    // const editsMade =
    //   selectedData &&
    //   Object.keys(selectedData).some(
    //     (key) => selectedData[key] !== originalSelectedData[key]
    //   );
    // if (!editsMade) {
    //   handleCloseWithdraw();
    //   return;
    // }
    let obj = {
      vendor_id: selectedData._id,
      vendor_name: selectedData.vendor_name,
      vendor_name_kr: selectedData.vendor_name_kr,
      game_type: selectedData.game_type,
      availability: {
        korea: koreaValue,
        other: otherValue,
      },
      language: {
        korean: koreaLangValue,
        other: otherLangValue
      },
      currency: {
        KRW: KRW,
        USD: USD,
        JPY: JPY,
        EUR: EUR
      },
      status: selectedData.status,
    };

    APIService({
      url: `${process.env.REACT_APP_R_SITE_API}/betlimit/update-vendor`,
      method: "PUT",
      data: obj,
    })
      .then((data) => {
        handleCloseWithdraw();
        dispatch(
          showMessage({
            variant: "success",
            message: `${selectedLang.update_success}`,
          })
        );
        fetchProvider();
      })
      .catch((err) => {
        handleCloseWithdraw();
        dispatch(
          showMessage({
            variant: "error",
            message: `${err?.message || selectedLang.something_went_wrong}`,
          })
        );
      })
      .finally(() => { });
  };
  
  const handleNewVendorSubmit = () => {

    let obj = {
      vendor_name: addNewVendorData.vendor_name,
      real_vendor_name:addNewVendorData.real_vendor,
      vendor_name_kr: addNewVendorData.vendor_name_kr,
      game_type: addNewVendorData.game_type,
      aggregator_provider_id:addNewVendorData.aggregator_provider_id,
      aggregator_provider_name:addNewVendorData.aggregator_provider_name, 
      availability: {
        korea: koreaValue,
        other: otherValue,
      },
      language: {
        korean: koreaLangValue,
        other: otherLangValue
      },
      currency: {
        KRW: KRW,
        USD: USD,
        JPY: JPY,
        EUR: EUR
      },
      status: addStatus,
    };


    if (
      obj?.vendor_name == undefined ||
      obj?.real_vendor_name == undefined ||
      obj?.vendor_name_kr == undefined ||
      obj?.game_type == undefined ||
      obj?.aggregator_provider_id == undefined ||
      obj?.aggregator_provider_name == undefined ||
      obj?.status == false 
      
    ) {
      return dispatch(
        showMessage({
          variant: "error",
          message: `${selectedLang.please_enter_valid_data}!`,
        })
      );
    }


    APIService({
      url: `${process.env.REACT_APP_R_SITE_API}/betlimit/create-vendor`,
      method: "POST",
      data: obj,
    })
      .then((data) => {
        handleCloseWithdraw();
        dispatch(
          showMessage({
            variant: "success",
            message: `${selectedLang.update_success}`,
          })
        );
        fetchProvider();
        setNewVendorData({});
        setKRW(false);
        setUSD(false);
        setJPY(false);
        setEUR(false);
        setkoreaValue(false);
        setotherValue(false);
        setotherLangValue(false);
        setkoreaLangValue(false);
        setStatus(false);

      })
      .catch((err) => {
        handleCloseWithdraw();
        dispatch(
          showMessage({
            variant: "error",
            message: `${err?.message || selectedLang.something_went_wrong}`,
          })
        );
      })
      .finally(() => { });
  };

  const deleteVendor = (vendor_id) => {
      Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'Cancel',
        background: '#000', // Set popup background to black
        color: '#fff', // Set text color to white
        customClass: {
          popup: 'swal-popup',
          title: 'swal-title',
          htmlContainer: 'swal-text',
        }
      }).then((result) => {
        if (result.isConfirmed) {
          APIService({
            url: `${process.env.REACT_APP_R_SITE_API}/betlimit/delete-vendor?vendor_id=${vendor_id}`,
            method: 'DELETE',
          })
            .then(() => {
              Swal.fire({
                title: 'Deleted!',
                text: 'Vendor has been deleted.',
                icon: 'success',
                background: '#000', // Black background
                color: '#fff', // White text
                customClass: {
                  popup: 'swal-popup',
                  title: 'swal-title',
                  htmlContainer: 'swal-text',
                },
              });
              fetchProvider();
            })
            .catch((err) => {
              dispatch(
                showMessage({
                  variant: 'error',
                  message: `${err?.message || selectedLang.something_went_wrong}`,
                })
              );
            })
            .finally(() => {
              
            });
        }
      });
  };

  useEffect(() => {
    if (selectLocale === "ko") {
      setSelectedLang(locale.ko);
      setShowKR(true);
    } else {
      setSelectedLang(locale.en);
      setShowKR(false);
    }
  }, [selectLocale]);

  useEffect(() => {
    fetchProvider();
  }, []);

  const fetchProvider = (vendorName) => {
    setLoaded(true);
    APIService({
      url: `${process.env.REACT_APP_R_SITE_API}/betlimit/vendor-list?vendorName=${vendorName||vendorNameValue}`,
      method: "GET",
    })
      .then((res) => {
        let newData = res.data.data;
        let newArr = [];
        newData.forEach((data) => {
          newArr.push(data.vendor_id);
        });
        setvendorId(newArr);
        setVendorList(res.data.data);
        setLoaded(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoaded(false);
      });
  };

  const searchVendorData = (vendorName)=>{
    fetchProvider(vendorName)
  }

  const handleChange = (field, value) => {
    setSelectedData((prevSelectedData) => ({
      ...prevSelectedData,
      [field]: value,
    }));
  };

  const handleVendorAdd =(field,value) =>{
    setNewVendorData( (prev) => ({
      ...prev,
      [field]:value,
    }));
  }

  return (
    <>
      {" "}
      {loaded ? (
        <FuseLoading />
      ) : (
        <FusePageSimple
          header={<VendorGameListHeader selectedLang={selectedLang} />}
          content={
            <Card
              sx={{ width: "100%", marginTop: "20px", borderRadius: "4px" }}
              className="main_card"
            >
              <Modal
                open={openWithdraw}
                className="small_modal"
                onClose={handleCloseWithdraw}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
              >
                <Box sx={style} className="Mymodal">
                  <button
                    className="modalclosebtn"
                    onClick={handleCloseWithdraw}
                  >
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
                  <Grid
                    key={"grid-main"}
                    container
                    rowSpacing={1}
                    columnSpacing={{ xs: 1, sm: 2, md: 3 }}
                  >
                    <Grid xs={12} md={12} key={"grid-sub"}>
                      <Grid key={"grid1"} container spacing={3}>
                        <Grid xs={12} md={12} key={"grid3"}>
                          <Typography
                            id="modal-modal-title"
                            variant="h6"
                            component="h2"
                            style={{ fontWeight: "700", fontSize: "23px" }}
                          >
                            {selectedLang.EditVendor}{" "}
                          </Typography>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>{" "}
                  <form className="editform">
                    {/* <div className="edit_textfield">
                        <FormControl className="flex w-full" variant="outlined">
                          <InputLabel id="category-select-label">
                            Vendor ID
                          </InputLabel>
                          <Select
                            labelId="category-select-label"
                            id="category-select"
                            label="Category"
                            value={selectedData?.vendor_name}
                            onChange={(e) =>
                              handleChange("vendorId", e.target.value)
                            }
                          >
                            {vendorId.map((data) => (
                              <MenuItem value={data} key={data}>
                                {data}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </div> */}
                    <div className="edit_textfield">
                      <TextField
                        fullWidth
                        size="small"
                        label={selectedLang.VENDORNAME}
                        value={selectedData?.vendor_name}
                        onChange={(e) =>
                          handleChange("vendor_name", e.target.value)
                        }
                      />
                    </div>
                    <div className="edit_textfield">
                      <TextField
                        fullWidth
                        size="small"
                        label={selectedLang.VendorNameKr}
                        value={selectedData?.vendor_name_kr}
                        onChange={(e) =>
                          handleChange("vendor_name_kr", e.target.value)
                        }
                      />
                    </div>
                    {/* <div className="edit_textfield">
                        <FormControl className="flex w-full" variant="outlined">
                          <InputLabel id="category-select-label">
                            Detail History
                          </InputLabel>
                          <Select
                            labelId="category-select-label"
                            id="category-select"
                            label="Category"
                            value={selectedData.detailHistory}
                            onChange={(e) =>
                              handleChange("detailHistory", e.target.value)
                            }
                          >
                            <MenuItem value={"true"}>True</MenuItem>
                            <MenuItem value={"false"}>False</MenuItem>
                          </Select>
                        </FormControl>
                      </div>
                      <div className="edit_textfield">
                        <FormControl className="flex w-full" variant="outlined">
                          <InputLabel id="category-select-label">
                            Game List
                          </InputLabel>
                          <Select
                            labelId="category-select-label"
                            id="category-select"
                            label="Category"
                            value={selectedData.game_list}
                            onChange={(e) =>
                              handleChange("gameList", e.target.value)
                            }
                          >
                            <MenuItem value={"true"}>True</MenuItem>
                            <MenuItem value={"false"}>False</MenuItem>
                          </Select>
                        </FormControl>
                      </div>
                      <div className="edit_textfield">
                        <FormControl className="flex w-full" variant="outlined">
                          <InputLabel id="category-select-label">
                            Lobby List
                          </InputLabel>
                          <Select
                            labelId="category-select-label"
                            id="category-select"
                            label="Category"
                            value={selectedData.lobby_list}
                            onChange={(e) =>
                              handleChange("lobbyList", e.target.value)
                            }
                          >
                            <MenuItem value={"true"}>True</MenuItem>
                            <MenuItem value={"false"}>False</MenuItem>
                          </Select>
                        </FormControl>
                      </div>
                      <div className="edit_textfield">
                        <FormControl className="flex w-full" variant="outlined">
                          <InputLabel id="category-select-label">
                            Game Type
                          </InputLabel>
                          <Select
                            labelId="category-select-label"
                            id="category-select"
                            label="Category"
                            value={selectedData.type}
                            onChange={(e) =>
                              handleChange("gameType", e.target.value)
                            }
                          >
                            {gameType.map((data) => (
                              <MenuItem value={data} key={data}>
                                {data}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </div> */}
                      <div>
                        <FormControlLabel
                        style={{ color: "#fff" }}
                        control={
                          <Checkbox
                            checked={selectedData?.status}
                            onChange={(e) =>
                              handleChange("status", e.target.checked)
                            }
                          />
                        }
                        label={selectedLang.status}
                      />
                      </div>
                      <div>
                      <TextField
                        fullWidth
                        size="small"
                        label={selectedLang.gameType}
                        value={selectedData?.game_type}
                        onChange={(e) =>
                          handleChange("game_type", e.target.value)
                        }
                      />
                      </div>
                    <div className="bottom_btns">
                      <Typography
                        id="modal-modal-title"
                        variant="h7"
                        style={{ fontWeight: "500", fontSize: "14px" }}
                      >
                        {selectedLang.available}{" "}
                      </Typography>
                      <FormControlLabel
                        style={{ color: "#fff" }}
                        control={
                          <Checkbox
                            checked={koreaValue}
                            onChange={() => {
                              setkoreaValue(!koreaValue);
                            }}
                          />
                        }
                        label={selectedLang.Korea}
                      />
                      <FormControlLabel
                        style={{ color: "#fff" }}
                        control={
                          <Checkbox
                            checked={otherValue}
                            onChange={() => {
                              setotherValue(!otherValue);
                            }}
                          />
                        }
                        label={selectedLang.Other}
                      />
                    </div>
                    <div className="bottom_btns">
                        <Typography
                          id="modal-modal-title"
                          variant="h7"
                          style={{ fontWeight: "500", fontSize: "14px" }}
                        >
                          {selectedLang.currency}{" "}
                        </Typography>
                        <div>
                        <FormControlLabel
                        style={{ color: "#fff" }}
                          control={
                            <Checkbox
                              checked={KRW}
                              onChange={() => {
                                setKRW(!KRW);
                              }}
                            />
                          }
                          label={selectedLang.KRW}
                        />
                        <FormControlLabel
                        style={{ color: "#fff" }}
                          control={
                            <Checkbox
                              checked={USD}
                              onChange={() => {
                                setUSD(!USD);
                              }}
                            />
                          }
                          label={selectedLang.USD}
                        />
                        <FormControlLabel
                        style={{ color: "#fff" }}
                          control={
                            <Checkbox
                              checked={JPY}
                              onChange={() => {
                                setJPY(!JPY);
                              }}
                            />
                          }
                          label={selectedLang.JPY}
                        />
                        <FormControlLabel
                        style={{ color: "#fff" }}
                          control={
                            <Checkbox
                              checked={EUR}
                              onChange={() => {
                                setEUR(!EUR);
                              }}
                            />
                          }
                          label={selectedLang.EUR}
                        />
                        </div>
                      </div>
                    <div>
                      <Button
                        variant="contained"
                        // color='primary'
                        className="flex item-center"
                        color="secondary"
                        onClick={() => {
                          handleSubmit();
                        }}
                        sx={{
                          borderRadius: "4px",
                        }}
                      >
                        {selectedLang.submit}
                      </Button>
                    </div>
                  </form>
                </Box>
              </Modal>

              <Modal
                open={openAddVendor}
                className="small_modal"
                onClose={handleCloseAddVendor}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
              >
                <Box sx={style} className="Mymodal">
                  <button
                    className="modalclosebtn"
                    onClick={handleCloseAddVendor}
                  >
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
                  <Grid
                    key={"grid-main"}
                    container
                    rowSpacing={1}
                    columnSpacing={{ xs: 1, sm: 2, md: 3 }}
                  >
                    <Grid xs={12} md={12} key={"grid-sub"}>
                      <Grid key={"grid1"} container spacing={3}>
                        <Grid xs={12} md={12} key={"grid3"}>
                          <Typography
                            id="modal-modal-title"
                            variant="h6"
                            component="h2"
                            style={{ fontWeight: "700", fontSize: "23px" }}
                          >
                            {selectedLang.AddVendor}{" "}
                          </Typography>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>{" "}
                  <form className="editform">
                   
                    <div className="edit_textfield">
                      <TextField
                        fullWidth
                        size="small"
                        label={selectedLang.VENDORNAME}
                        value={addNewVendorData?.vendor_name}
                        onChange={(e) =>
                          handleVendorAdd("vendor_name", e.target.value)
                        }
                      />
                    </div>
                    <div className="edit_textfield">
                      <TextField
                        fullWidth
                        size="small"
                        label={selectedLang.VendorNameKr}
                        value={addNewVendorData?.vendor_name_kr}
                        onChange={(e) =>
                          handleVendorAdd("vendor_name_kr", e.target.value)
                        }
                      />
                    </div>
                 
                      
                      <div>
                      <TextField
                        fullWidth
                        size="small"
                        label={selectedLang.realVendor}
                        value={addNewVendorData?.real_vendor}
                        onChange={(e) =>
                          handleVendorAdd("real_vendor", e.target.value)
                        }
                      />
                      </div>

                      <div>
                      <TextField
                        fullWidth
                        size="small"
                        label={selectedLang.gameType}
                        value={addNewVendorData?.game_type}
                        onChange={(e) =>
                          handleVendorAdd("game_type", e.target.value)
                        }
                      />
                      </div>

                      <div>
                      <TextField
                        fullWidth
                        size="small"
                        label={selectedLang.aggregator_provider_id}
                        value={addNewVendorData?.aggregator_provider_id}
                        onChange={(e) =>
                          handleVendorAdd("aggregator_provider_id", e.target.value)
                        }
                      />
                      </div>

                      <div>
                      <TextField
                        fullWidth
                        size="small"
                        label={selectedLang.aggregator_provider_name}
                        value={addNewVendorData?.aggregator_provider_name}
                        onChange={(e) =>
                          handleVendorAdd("aggregator_provider_name", e.target.value)
                        }
                      />
                      </div>


                      <div>
                        {/* <FormControlLabel
                        style={{ color: "#fff" }}
                        control={
                          <Checkbox
                            checked={addNewVendorData?.status}
                            onChange={(e) =>
                              handleVendorAdd("status", e.target.checked)
                            }
                          />
                        }
                        label={selectedLang.status}
                      /> */}
                        <FormControlLabel
                        style={{ color: "#fff" }}
                        control={
                          <Checkbox
                            checked={addStatus}
                            onChange={() => {
                              setStatus(!addStatus);
                            }}
                          />
                        }
                        label={selectedLang.status}
                      />
                      </div>


                    <div className="bottom_btns">
                      <Typography
                        id="modal-modal-title"
                        variant="h7"
                        style={{ fontWeight: "500", fontSize: "14px" }}
                      >
                        {selectedLang.available}{" "}
                      </Typography>
                      <FormControlLabel
                        style={{ color: "#fff" }}
                        control={
                          <Checkbox
                            checked={koreaValue}
                            onChange={() => {
                              setkoreaValue(!koreaValue);
                            }}
                          />
                        }
                        label={selectedLang.Korea}
                      />
                      <FormControlLabel
                        style={{ color: "#fff" }}
                        control={
                          <Checkbox
                            checked={otherValue}
                            onChange={() => {
                              setotherValue(!otherValue);
                            }}
                          />
                        }
                        label={selectedLang.Other}
                      />
                    </div>

                 

                    <div className="bottom_btns">
                      <Typography
                        id="modal-modal-title"
                        variant="h7"
                        style={{ fontWeight: "500", fontSize: "14px" }}
                      >
                        {selectedLang.language}{" "}
                      </Typography>
                      <FormControlLabel
                        style={{ color: "#fff" }}
                        control={
                          <Checkbox
                            checked={koreaLangValue}
                            onChange={() => {
                              setkoreaLangValue(!koreaLangValue);
                            }}
                          />
                        }
                        label={selectedLang.Korea}
                      />
                      <FormControlLabel
                        style={{ color: "#fff" }}
                        control={
                          <Checkbox
                            checked={otherLangValue}
                            onChange={() => {
                              setotherLangValue(!otherLangValue);
                            }}
                          />
                        }
                        label={selectedLang.Other}
                      />
                    </div>
                    <div className="bottom_btns">
                        <Typography
                          id="modal-modal-title"
                          variant="h7"
                          style={{ fontWeight: "500", fontSize: "14px" }}
                        >
                          {selectedLang.currency}{" "}
                        </Typography>
                        <div>
                        <FormControlLabel
                        style={{ color: "#fff" }}
                          control={
                            <Checkbox
                              checked={KRW}
                              onChange={() => {
                                setKRW(!KRW);
                              }}
                            />
                          }
                          label={selectedLang.KRW}
                        />
                        <FormControlLabel
                        style={{ color: "#fff" }}
                          control={
                            <Checkbox
                              checked={USD}
                              onChange={() => {
                                setUSD(!USD);
                              }}
                            />
                          }
                          label={selectedLang.USD}
                        />
                        <FormControlLabel
                        style={{ color: "#fff" }}
                          control={
                            <Checkbox
                              checked={JPY}
                              onChange={() => {
                                setJPY(!JPY);
                              }}
                            />
                          }
                          label={selectedLang.JPY}
                        />
                        <FormControlLabel
                        style={{ color: "#fff" }}
                          control={
                            <Checkbox
                              checked={EUR}
                              onChange={() => {
                                setEUR(!EUR);
                              }}
                            />
                          }
                          label={selectedLang.EUR}
                        />
                        </div>
                      </div>
                    <div>
                      <Button
                        variant="contained"
                        // color='primary'
                        className="flex item-center"
                        color="secondary"
                        onClick={() => {
                          handleNewVendorSubmit();
                        }}
                        sx={{
                          borderRadius: "4px",
                        }}
                      >
                        {selectedLang.submit}
                      </Button>
                    </div>
                  </form>
                </Box>
              </Modal>
                  <div>
               

               {
                role==="admin" ? (
                <div style={{display:"flex",justifyContent:'space-between'}}>
                <Button
                  className="flex item-center"
                  variant="contained"
                  color="secondary"
                  
                  sx={{
                    borderRadius: "4px",
                  }}
                  onClick={() => handleOpenAddVendor()}
                >
                  {selectedLang.add_vendor}
                </Button>
                  <div style={{display:"flex"}}>
                  <InputBase
                    sx={{
                      flex: 1,
                      border: "1px solid #cdcfd3",
                      borderRadius: "4px",
                      padding: "4px 10px",
                      fontSize: "12px",
                    }}
                    placeholder={selectedLang.VENDORNAME}
                    value={vendorNameValue}
                    onChange={(e) => setVendorNameValue(e.target.value)}
                    inputProps={{
                      "aria-label": selectedLang.VENDORNAME,
                    }}
                  />
                <Button
                  className="flex item-center"
                  variant="contained"
                  color="secondary"
                  endIcon={<SearchIcon size={20}></SearchIcon>}
                  sx={{
                    borderRadius: "4px",
                    marginLeft:'9px'
                  }}
                  onClick={() => {
                    searchVendorData(vendorNameValue);
                  }}
                >
                  {selectedLang.search}
                </Button>
                  </div>
                  </div>
                ) 
                :null
              }

              </div>
            
              <CardContent>
                <Paper
                  sx={{
                    width: "100%",
                    overflow: "hidden",
                    borderRadius: "4px",
                  }}
                >
                  <TableContainer
                    component={Paper}
                    style={{ overflowX: "auto", borderRadius: 0 }}
                    className="table-container"
                  >
                    <Table style={{ minWidth: 650, borderRadius: 0 }}>
                      <TableHead>
                        <TableRow>
                          {/* <TableCell>{selectedLang.VENDORID}</TableCell> */}
                          <TableCell align="center">{selectedLang.VENDORNAME}</TableCell>
                          <TableCell align="center">{selectedLang.VendorNameKr}</TableCell>
                          <TableCell align="center">{selectedLang.GAMETYPE}</TableCell>
                          <TableCell align="center">{selectedLang.TYPE}</TableCell>
                          <TableCell align="center">{selectedLang.currency}</TableCell>
                          <TableCell align="center">{selectedLang.GAMELIST}</TableCell>
                          <TableCell align="center">{selectedLang.LOBBYLIST}</TableCell>
                          <TableCell align="center">{selectedLang.available}</TableCell>
                          <TableCell align="center">{selectedLang.VENDORENABLE}</TableCell>
                          <TableCell align="center">{selectedLang.action}</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {vendorList &&
                          vendorList.map((vendor) => (
                            <TableRow key={vendor._id}>
                              {/* <TableCell>{vendor.vendor_id}</TableCell> */}
                              <TableCell
                              style={{
                                textAlign: "center",
                              }}>{vendor.vendor_name.charAt(0).toUpperCase()+vendor.vendor_name.slice(1)}</TableCell>
                              <TableCell
                              style={{
                                textAlign: "center",
                              }}>{vendor.vendor_name_kr}</TableCell>
                              <TableCell
                              style={{
                                textAlign: "center",
                              }}>
                                {vendor.game_type == null ? "" : vendor.game_type.charAt(0).toUpperCase() + vendor.game_type.slice(1) }
                              </TableCell>
                              <TableCell className='text-center max-width-500'>
                                {vendor.type &&
                                  vendor.type
                                    .map(
                                      (word) =>
                                        word.charAt(0).toUpperCase() +
                                        word.slice(1)
                                    ).join(", ")}
                              </TableCell>
                              <TableCell
                              style={{
                                textAlign: "center",
                              }}>
                                  {vendor.currency === undefined
                                  ? ""
                                  : vendor.currency.KRW === true
                                  ? "KRW"
                                  : ""}
                                  {vendor.currency === undefined
                                    ? ""
                                    : vendor.currency.KRW === true &&
                                      (vendor.currency.USD === true ||
                                      vendor.currency.JPY === true ||
                                      vendor.currency.EUR === true )
                                    ? ","
                                    : ""}
                                  {vendor.currency === undefined
                                  ? ""
                                  : vendor.currency.USD === true
                                  ? "USD"
                                  : ""}
                                  {vendor.currency === undefined
                                    ? ""
                                    : vendor.currency.USD === true &&
                                      ( vendor.currency.JPY === true ||
                                      vendor.currency.EUR === true ||
                                      vendor.currency.KRW === true )
                                    ? ","
                                    : ""}
                                  {vendor.currency === undefined
                                  ? ""
                                  : vendor.currency.JPY === true
                                  ? "JPY"
                                  : ""}
                                  {vendor.currency === undefined
                                    ? ""
                                    : vendor.currency.JPY === true &&
                                    (vendor.currency.USD === true ||
                                      vendor.currency.EUR === true ||
                                      vendor.currency.KRW === true )
                                    ? ","
                                    : ""}
                                  {vendor.currency === undefined
                                  ? ""
                                  : vendor.currency.EUR === true
                                  ? "EUR"
                                  : ""}
                                </TableCell>
                              <TableCell
                                style={{
                                  textAlign: "center",
                                  color: vendor.game_list ? "#35cdd9" : "red",
                                  fontWeight: vendor.game_list
                                    ? "bold"
                                    : "normal",
                                }}
                              >
                                {vendor.game_list.toString()}
                              </TableCell>
                              <TableCell
                                style={{
                                  textAlign: "center",
                                  color: vendor.lobby_list ? "#35cdd9" : "red",
                                  fontWeight: vendor.lobby_list
                                    ? "bold"
                                    : "normal",
                                }}
                              >
                                {vendor.lobby_list.toString()}
                              </TableCell>
                              <TableCell
                              style={{
                                textAlign: "center",
                              }}>
                              
                                {vendor.availability === undefined
                                  ? ""
                                  : vendor.availability.korea === true
                                    ? "Korea"
                                    : ""}
                                {vendor.availability === undefined
                                  ? ""
                                  : vendor.availability.korea === true &&
                                    vendor.availability.other === true
                                    ? ","
                                    : ""}
                                {vendor.availability === undefined
                                  ? ""
                                  : vendor.availability.other === true
                                    ? "Other"
                                    : ""}
                              </TableCell>
                              <TableCell
                                style={{
                                  textAlign: "center",
                                  color: vendor.status ? "#35cdd9" : "red",
                                  fontWeight: vendor.status
                                    ? "bold"
                                    : "normal",
                                }}
                              >
                                {vendor.status.toString()}
                              </TableCell>
                              <TableCell
                                style={{
                                  display: "flex",
                                  justifyContent: "center",
                                  padding: "8px",
                                }}
                              >
                                <Button
                                  className="flex item-center buttonbox"
                                  variant="contained"
                                  color="secondary"
                                  size="small"
                                  sx={{
                                    borderRadius: "4px",
                                  }}
                                  onClick={() => handleOpenWithdraw(vendor)}
                                >
                                  {selectedLang.edit}
                                </Button>
                                <Button
                                  className="flex item-center buttonbox"
                                  variant="contained"
                                  color="secondary"
                                  size="small"
                                  sx={{
                                    borderRadius: "4px"
                                  }}
                                  onClick={() => deleteVendor(vendor?.vendor_name)}
                                >
                                  {selectedLang.delete}
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Paper>
              </CardContent>
            </Card>
          }
        />
      )}
    </>
  );
}

export default VendorGameListApp;
