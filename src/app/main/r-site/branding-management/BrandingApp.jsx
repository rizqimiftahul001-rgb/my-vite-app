import React, { useEffect, useState } from "react";
import "./provider.css";
import { useDispatch, useSelector } from "react-redux";
import { showMessage } from "app/store/fuse/messageSlice";
import axios from "axios";
import {
  Box,
  Button,
  Card,
  CardContent,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import UploadIcon from "@mui/icons-material/Upload";
import FusePageSimple from "@fuse/core/FusePageSimple";
import FuseLoading from "@fuse/core/FuseLoading/FuseLoading";
import { locale } from "../../../configs/navigation-i18n";
import APIService from "src/app/services/APIService";
import BrandingHeader from "./BrandingHeader";
import BrandingDetails from "./BrandingDetails";
import { Table } from "react-virtualized";

function BrandingApp() {
  const [loaded, setLoaded] = useState(false);
  const [selectedLang, setSelectedLang] = useState(locale.ko);
  const [showKR, setShowKR] = useState(false);
  const [formData, setFormData] = useState({
    footer: "",
    title: "",
    branding_unique_name: "",
  });
  const [logoImage, setLogoImage] = useState(null);
  const [faviconImage, setFaviconImage] = useState(null);
  const [backimageSignup, setBackimageSignup] = useState(null);

  const [brandDeatils, setBrandDetails] = useState({});
  const [logoImageName, setLogoImageName] = useState("");
  const [faviconImageName, setFaviconImageName] = useState("");
  const [backimageSignupName, setBackimageSignupName] = useState("");

  const dispatch = useDispatch();
  const selectLocale = useSelector((state) => state.locale.selectLocale);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (name === "logo_image") {
      setLogoImage(files[0]);
      setLogoImageName(files[0].name)
    } else if (name === "favicon_image") {
      setFaviconImage(files[0]);
      setFaviconImageName(files[0].name)
    } else if (name === "backimage_signup") {
      setBackimageSignup(files[0]);
      setBackimageSignupName(files[0].name)
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("footer", formData.footer);
    data.append("title", formData.title);
    data.append("branding_unique_name", formData.branding_unique_name);
    data.append("logo_image", logoImage);
    data.append("favicon_image", faviconImage);
    data.append("backimage_signup", backimageSignup);

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_R_SITE_API}/branding`,
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("Response:", response.data);
      setFormData({
        footer: "",
        title: "",
        branding_unique_name: "",
      })
      setLogoImage(null);
      setFaviconImage(null)
      setBackimageSignup(null)
      setLogoImageName("")
      setFaviconImageName("")
      setBackimageSignupName("")

      dispatch(
        showMessage({
          variant: "success",
          message: `${selectedLang.UPLOADSUCCESS}`,
        })
      );
    } catch (error) {
      dispatch(
        showMessage({
          variant: "error",
          message: `${error?.message || selectedLang.something_went_wrong}`,
        })
      );
      console.error("Error submitting the form", error);
    }
  };

  const getBrandDetails = () => {
    APIService({
      url: `${process.env.REACT_APP_R_SITE_API}/branding?branding=${process.env.REACT_APP_BRANDING_UNIQUE_NAME}`,
      method: "GET",
    })
      .then((res) => {
        setBrandDetails(res.data.data)
      })
      .catch((err) => {
        dispatch(
          showMessage({
            variant: "error",
            message: `${selectedLang.something_went_wrong
              }`,
          })
        );
      })
      .finally(() => {
        // setOpen(true);
      });
  }

  useEffect(() => {
    getBrandDetails()
  }, [])


  useEffect(() => {
    if (selectLocale === "ko") {
      setSelectedLang(locale.ko);
      setShowKR(true);
    } else {
      setSelectedLang(locale.en);
      setShowKR(false);
    }
  }, [selectLocale]);

  return (
    <>
      {loaded ? (
        <FuseLoading />
      ) : (
        <FusePageSimple
          header={<BrandingHeader selectedLang={selectedLang} />}
          content={
            <Card
              sx={{ width: "100%", marginTop: "20px", borderRadius: "4px" }}
              className="main_card"
            >
              <CardContent sx={{ paddingTop: "0" }}>
                <Paper
                  sx={{
                    width: "100%",
                    overflow: "hidden",
                    borderRadius: "4px",
                    padding: "16px",
                    paddingTop: "0",
                  }}
                >
                  <Typography
                    id="modal-modal-title"
                    variant="h6"
                    component="h2"
                    style={{ fontWeight: 700, marginBottom: "15px", fontSize: "23px" }}
                  >
                    {selectedLang.BRANDINGDETAILS}
                  </Typography>
                  <form onSubmit={handleSubmit}>
                    <Box className="create_bet_modal" sx={{ display: "flex", flexDirection: "column", gap: 2 }}>

                      <div className="table-responsive">
                        <table className="table">
                          <tbody>
                            <tr>
                              <td>{selectedLang.Footer}</td>
                              <td>
                                <TextField
                                  style={{ width: '100%' }}
                                  label={selectedLang.Footer}
                                  name="footer"
                                  size="small"
                                  value={formData.footer}
                                  onChange={handleChange}
                                  required
                                />
                              </td>
                            </tr>
                            <tr>
                              <td>{selectedLang.title}</td>
                              <td>
                                <TextField
                                  label={selectedLang.title}
                                  style={{ width: '100%' }}
                                  name="title"
                                  size="small"
                                  value={formData.title}
                                  onChange={handleChange}
                                  required
                                />
                              </td>
                            </tr>
                            <tr>
                              <td style={{ width: "200px" }}>{selectedLang.Branding_Unique_Name}</td>
                              <td>
                                <TextField
                                  label={selectedLang.Branding_Unique_Name}
                                  name="branding_unique_name"
                                  size="small"
                                  style={{ width: '100%' }}
                                  value={formData.branding_unique_name}
                                  onChange={handleChange}
                                  required
                                />
                              </td>
                            </tr>
                            <tr>
                              <td style={{ width: "200px" }}>{selectedLang.LOGOIMG}</td>
                              <td>
                                <div style={{ display: "flex", gap: "10px" }}>
                                  <Button
                                    variant="contained"
                                    component="label"
                                    style={{ color: "#000" }}
                                    startIcon={<UploadIcon />}
                                  >
                                    {selectedLang.LOGOIMG}
                                    <input
                                      type="file"
                                      name="logo_image"
                                      onChange={handleFileChange}
                                      hidden
                                      required
                                    />
                                  </Button>
                                  {
                                    logoImageName ?
                                      <TextField
                                        value={logoImageName}
                                        size="small"
                                        InputProps={{
                                          readOnly: true,
                                        }}
                                      />
                                      : ''
                                  }
                                </div>
                              </td>
                            </tr>
                            <tr>
                              <td style={{ width: "200px" }}>{selectedLang.FAVIIMG}</td>
                              <td>
                                <div style={{ display: "flex", gap: "10px" }}>
                                  <Button
                                    variant="contained"
                                    style={{ color: "#000" }}
                                    component="label"
                                    startIcon={<UploadIcon />}
                                  >
                                    {selectedLang.FAVIIMG}
                                    <input
                                      type="file"
                                      name="favicon_image"
                                      onChange={handleFileChange}
                                      hidden
                                      required
                                    />
                                  </Button>
                                  {
                                    faviconImageName ?
                                      <TextField
                                        value={faviconImageName}
                                        size="small"
                                        InputProps={{
                                          readOnly: true,
                                        }}
                                      />
                                      : ''
                                  }
                                </div>
                              </td>
                            </tr>
                            <tr>
                              <td style={{ width: "200px" }}> {selectedLang.SIGNUPBACKGROUNDIMG}</td>
                              <td>
                                <div style={{ display: "flex", gap: "10px" }}>
                                  <Button
                                    variant="contained"
                                    style={{ color: "#000" }}
                                    component="label"
                                    startIcon={<UploadIcon />}
                                  >
                                    {selectedLang.SIGNUPBACKGROUNDIMG}
                                    <input
                                      type="file"
                                      size="small"
                                      name="backimage_signup"
                                      onChange={handleFileChange}
                                      hidden
                                      required
                                    />
                                  </Button>
                                  {
                                    backimageSignupName ?
                                      <TextField
                                        value={backimageSignupName}
                                        size="small"
                                        InputProps={{
                                          readOnly: true,
                                        }}
                                      />
                                      : ''
                                  }
                                </div>
                              </td>
                            </tr>
                            <tr>
                              <td></td>
                              <td>
                                <div className="w-100" style={{ display: "flex" }}>
                                  <Button
                                    type="submit"
                                    style={{ width: "100%", maxWidth: "200px" }}
                                    variant="contained"
                                    color="secondary"
                                  >
                                    {selectedLang.submit}
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                      {/* <TextField
                        label={selectedLang.Footer}
                        name="footer"
                        size="small"
                        value={formData.footer}
                        onChange={handleChange}
                        required
                      />
                      <TextField
                        label={selectedLang.title}
                        name="title"
                        size="small"
                        value={formData.title}
                        onChange={handleChange}
                        required
                      />
                      <TextField
                        label={selectedLang.Branding_Unique_Name}
                        name="branding_unique_name"
                        size="small"
                        value={formData.branding_unique_name}
                        onChange={handleChange}
                        required
                      /> */}

                      {/* <div style={{ display: "flex", gap: "10px" }}>
                        <Button
                          variant="contained"
                          component="label"
                          startIcon={<UploadIcon />}
                        >
                          {selectedLang.LOGOIMG}
                          <input
                            type="file"
                            name="logo_image"
                            onChange={handleFileChange}
                            hidden
                            required
                          />
                        </Button>
                        {
                          logoImageName ?
                            <TextField
                              value={logoImageName}
                              size="small"
                              InputProps={{
                                readOnly: true,
                              }}
                            />
                            : ''
                        }
                      </div> */}
                      {/* <div style={{ display: "flex", gap: "10px" }}>
                        <Button
                          variant="contained"
                          component="label"
                          startIcon={<UploadIcon />}
                        >
                          {selectedLang.FAVIIMG}
                          <input
                            type="file"
                            name="favicon_image"
                            onChange={handleFileChange}
                            hidden
                            required
                          />
                        </Button>
                        {
                          faviconImageName ?
                            <TextField
                              value={faviconImageName}
                              size="small"
                              InputProps={{
                                readOnly: true,
                              }}
                            />
                            : ''
                        }
                      </div>
                      <div style={{ display: "flex", gap: "10px" }}>
                        <Button
                          variant="contained"
                          component="label"
                          startIcon={<UploadIcon />}
                        >
                          {selectedLang.SIGNUPBACKGROUNDIMG}
                          <input
                            type="file"
                            name="backimage_signup"
                            onChange={handleFileChange}
                            hidden
                            required
                          />
                        </Button>
                        {
                          backimageSignupName ?
                            <TextField
                              value={backimageSignupName}
                              size="small"
                              InputProps={{
                                readOnly: true,
                              }}
                            />
                            : ''
                        }
                      </div> */}
                      {/* <Button
                        type="submit"
                        className=""
                        variant="contained"
                        color="secondary"
                      >
                        {selectedLang.submit}
                      </Button> */}

                    </Box>
                  </form>
                </Paper>
              </CardContent>
              <hr />
              <CardContent>
                <BrandingDetails
                  selectedLang={selectedLang}
                  brandDeatils={brandDeatils}
                />
              </CardContent>
            </Card>
          }
        />
      )}
    </>
  );
}

export default BrandingApp;

