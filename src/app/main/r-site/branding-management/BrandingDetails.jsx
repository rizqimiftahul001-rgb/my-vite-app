import React, { useEffect, useState } from "react";
import UploadIcon from "@mui/icons-material/Upload";
import { useDispatch, useSelector } from "react-redux";
import { showMessage } from "app/store/fuse/messageSlice";
import axios from "axios";
import { Paper, Box, Table, TableBody, TableCell, TextField, TableContainer, TableHead, TableRow, Typography, Button } from "@mui/material";

const ImageDetails = ({ label, imageUrl, imageName }) => (
  <Box sx={{ display: "flex", alignItems: "center", gap: 2, margin: '10px 0' }}>
    <img src={imageUrl} alt={imageName} style={{ width: '80px' }} />
    <Box>
      <Typography style={{ fontWeight: 400, fontSize: "13px" }} variant="subtitle1">{label}</Typography>
    </Box>
  </Box>
);

const BrandingDetails = ({ selectedLang, brandDeatils }) => {

  const dispatch = useDispatch();
  const [isEdit, setIsEdit] = useState(false)
  const [logoImage, setLogoImage] = useState(null);
  const [faviconImage, setFaviconImage] = useState(null);
  const [backimageSignup, setBackimageSignup] = useState(null);
  const [logoImageName, setLogoImageName] = useState("");
  const [faviconImageName, setFaviconImageName] = useState("");
  const [backimageSignupName, setBackimageSignupName] = useState("");
  const [footerValue, setFooterValue] = useState("")
  const [titleValue, setTitleValue] = useState("")

  const handleEdit = () => {
    setFooterValue(brandDeatils.footer)
    setTitleValue(brandDeatils.title)
    setIsEdit(true)
  }

  const handleCancel = () => {
    setIsEdit(false)
  }


  function extractTimestamp(url) {
    const regex = /(\d+)\.jpg$/;
    const match = url.match(regex);
    return match ? match[1] : null;
  }


  const urls = [`${brandDeatils.logo_image}`, `${brandDeatils.favicon_image}`, `${brandDeatils.backimage_signup}`];

  const timestamps = urls.map(extractTimestamp);

  let logoKey = timestamps[0];
  let faviKey = timestamps[1];
  let backImgKey = timestamps[2];

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("footer", footerValue);
    data.append("title", titleValue);
    data.append("branding_unique_name", brandDeatils.branding_unique_name);
    // data.append("update","update");
    // data.append("ID",brandDeatils._id)
    data.append("logoKey", logoKey)
    data.append("faviKey", faviKey)
    data.append("backImgKey", backImgKey)
    data.append("logo_image", logoImage);
    data.append("favicon_image", faviconImage);
    data.append("backimage_signup", backimageSignup);

    try {
      const response = await axios.put(
        `${process.env.REACT_APP_R_SITE_API}/edit/branding`,
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setLogoImage(null);
      setFaviconImage(null)
      setBackimageSignup(null)
      setLogoImageName("")
      setFaviconImageName("")
      setBackimageSignupName("")
      setIsEdit(false)
      dispatch(
        showMessage({
          variant: "success",
          message: `${selectedLang.update_success}`,
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
  }

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

  return (
    <Paper
      sx={{
        width: "100%",
        overflow: "hidden",
        borderRadius: "4px",
        padding: "16px",
      }}
    >
      <Box sx={{ mb: 2 }}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <Typography
            id="modal-modal-title"
            variant="h6"
            component="h2"
            sx={{ fontWeight: 700, fontSize: "23px" }}
          >
            {selectedLang.UPLOADEDBRANDINGDETAILS}
          </Typography>
          {
            isEdit === false ? <>
              <Button
                className="flex item-center buttonbox"
                variant="contained"
                color="secondary"
                size="small"
                sx={{
                  borderRadius: "4px",
                  float: "right"
                }}
                onClick={handleEdit}
              >
                {selectedLang.edit}
              </Button>
            </> : <>
              <div style={{ display: "flex", flexDirection: "row", gap: "5px" }}>
                <Button
                  className="flex item-center buttonbox"
                  variant="contained"
                  color="secondary"
                  size="small"
                  sx={{
                    borderRadius: "4px",
                    marginBottom: "2%",
                    marginRight: "2%",
                    float: "right"
                  }}
                  onClick={handleSubmit}
                >
                  {selectedLang.submit}
                </Button>
                <Button
                  className="flex item-center buttonbox"
                  variant="contained"
                  color="secondary"
                  size="small"
                  sx={{
                    borderRadius: "4px",
                    marginBottom: "2%",
                    float: "right"
                  }}
                  onClick={handleCancel}
                >
                  {selectedLang.cancel_n}
                </Button>
              </div>
            </>
          }

        </div>
      </Box>
      {
        isEdit === false ? <>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>{selectedLang.Property}</TableCell>
                  <TableCell>{selectedLang.Value}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>{selectedLang.Footer}</TableCell>
                  <TableCell>{brandDeatils.footer}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>{selectedLang.title}</TableCell>
                  <TableCell>{brandDeatils.title}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>{selectedLang.Branding_Unique_Name}</TableCell>
                  <TableCell>{brandDeatils.branding_unique_name}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>{selectedLang.LOGOIMGUPLOADED}</TableCell>
                  <TableCell>
                    <ImageDetails
                      imageUrl={brandDeatils.logo_image}
                    />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>{selectedLang.FAVIIMGUPLOADED}</TableCell>
                  <TableCell>
                    <ImageDetails
                      imageUrl={brandDeatils.favicon_image}
                    />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>{selectedLang.SIGNUPBACKGROUNDIMGUPLOADED}</TableCell>
                  <TableCell>
                    <ImageDetails
                      imageUrl={brandDeatils.backimage_signup}
                    />
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </> :
          <form onSubmit={handleSubmit}>
            <Box className="create_bet_modal" sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <div className="table-responsive">
                <table className="table">
                  <tbody>
                    <tr>
                      <td style={{ width: "200px" }}>{selectedLang.Footer}</td>
                      <td>
                        <TextField
                          label={selectedLang.Footer}
                          name="footer"
                          size="small"
                          value={footerValue === "" ? brandDeatils.footer : footerValue}
                          onChange={(e) => { setFooterValue(e.target.value) }}
                        />
                      </td>
                    </tr>
                    <tr>
                      <td style={{ width: "200px" }}>{selectedLang.title}</td>
                      <td>
                        <TextField
                          label={selectedLang.title}
                          name="title"
                          size="small"
                          value={titleValue === "" ? brandDeatils.title : titleValue}
                          onChange={(e) => { setTitleValue(e.target.value) }}
                        />
                      </td>
                    </tr>
                    <tr>
                      <td style={{ width: "200px" }}>{selectedLang.LOGOIMG}</td>
                      <td>
                        <div style={{ display: "flex", gap: '10px' }}>
                          <Button
                            variant="contained"
                            style={{ color: "#000" }}
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
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td style={{ width: "200px" }}>{selectedLang.FAVIIMG}</td>
                      <td>
                        <div style={{ display: "flex", gap: '10px' }}>
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
                      <td style={{ width: "200px" }}>{selectedLang.SIGNUPBACKGROUNDIMG}</td>
                      <td>
                        <div style={{ display: "flex", gap: '10px' }}>
                          <Button
                            variant="contained"
                            style={{ color: "#000" }}
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
                value={footerValue === "" ? brandDeatils.footer : footerValue}
                onChange={(e) => { setFooterValue(e.target.value) }}
              />
              <TextField
                label={selectedLang.title}
                name="title"
                size="small"
                value={titleValue === "" ? brandDeatils.title : titleValue}
                onChange={(e) => { setTitleValue(e.target.value) }}
              /> */}
              {/* <TextField
            label={selectedLang.Branding_Unique_Name}
            name="branding_unique_name"
            size="small"
            value={bradUnNameValue === "" ? brandDeatils.branding_unique_name:bradUnNameValue}
            onChange={(e)=>{setBradUnNameValue(e.target.value)}}
            InputProps={{
              readOnly: true,
            }}
          /> */}
              {/* <div style={{ display: "flex", gap: '10px' }}>
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
              </div>
              <div style={{ display: "flex", gap: '10px' }}>
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
              <div style={{ display: "flex", gap: '10px' }}>
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
            </Box>
          </form>
      }
    </Paper>
  );
};

export default BrandingDetails;
