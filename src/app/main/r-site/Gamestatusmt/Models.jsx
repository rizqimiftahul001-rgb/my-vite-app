/** @format */
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Unstable_Grid2";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";

const EditModel = (
  openWithdraw,
  handleCloseWithdraw,
  selectedLang,
  style,
  selectedData,
  props // Include props in the argument
) => {
  const handleChange = (field, value) => {
    // Use props.setSelectedData instead of setSelectedData
    props.setSelectedData((prevSelectedData) => ({
      ...prevSelectedData,
      [field]: value,
    }));
  };
  const Language =localStorage.getItem("selectedLanguage");



  // const changeLanguage = (field, value) => {
  // 	setSelectedData((prevSelectedData) => ({
  // 		...prevSelectedData,
  // 		langs: {
  // 			...prevSelectedData.langs,
  // 			[field]: value,
  // 		},
  // 	}));
  // };
  const changeLanguage = (field, value, lang) => {
    // Check if selectedData is defined and has the property 'langs'
    if (selectedData && selectedData.langs) {
      const fieldIndex = selectedData.langs.findIndex(
        (langObject) => langObject.lang === lang
      );

      if (fieldIndex === -1) {
        // Make sure that selectedData.langs is an array before accessing it
        props.setSelectedData((prevSelectedData) => ({
          ...prevSelectedData,
          langs: [
            ...(prevSelectedData.langs || []), // Use empty array if langs is undefined
            { name: value, lang },
          ],
        }));
      } else {
        // Make sure that selectedData.langs is an array before accessing it
        props.setSelectedData((prevSelectedData) => ({
          ...prevSelectedData,
          langs: (prevSelectedData.langs || []).map((langObject, index) =>
            index === fieldIndex ? { ...langObject, name: value } : langObject
          ),
        }));
      }
    }
  };

  return (
    <Modal
      open={openWithdraw}
      className="small_modal"
      onClose={handleCloseWithdraw}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description">
      <Box sx={style} className="Mymodal">
        <button className="modalclosebtn" onClick={handleCloseWithdraw}>
          <svg
            className="svg-icon"
            viewBox="0 0 1024 1024"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg">
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
          columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
          <Grid xs={12} md={12} key={"grid-sub"}>
            <Grid key={"grid1"} container spacing={3}>
              <Grid xs={12} md={12} key={"grid3"}>
                <Typography
                  id="modal-modal-title"
                  variant="h6"
                  component="h2"
                  style={{ fontWeight: "700", fontSize: "23px" }}>
                  {selectedLang.Edit_Game}: {selectedData?.langs?.find(lang => lang.lang === Language)?.name}
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
              label={selectedLang.title}
              value={selectedData?.title}
              onChange={(e) => handleChange("title", e.target.value)}
            />
          </div>
          <div className="edit_textfield">
            <TextField
              fullWidth
              size="small"
              label={selectedLang.Game_image_url}
              value={selectedData?.thumbnail || ''}
              onChange={(e) => handleChange("thumbnail", e.target.value)}
            />
          </div>
          <div className="edit_textfield">
            <TextField
              fullWidth
              size="small"
              label={selectedLang.platform}
              value={selectedData?.platform}
              onChange={(e) => handleChange("platform", e.target.value)}
            />
          </div>
          <div className="edit_textfield">
            <TextField
              fullWidth
              size="small"
              label={selectedLang.vendor}
              value={selectedData?.vendor}
              onChange={(e) => handleChange("vendor", e.target.value)}
            />
          </div>
          <div className="edit_textfield">
            <TextField
              fullWidth
              size="small"
              label={selectedLang.type}
              value={selectedData?.type}
              onChange={(e) => handleChange("type", e.target.value)}
            />
          </div>
          <div className="edit_textfield">
            <TextField
              fullWidth
              size="small"
              label={selectedLang.GameType}
              value={selectedData?.game_type}
              onChange={(e) => handleChange("game_type", e.target.value)}
            />
          </div>
          <div className="edit_textfield">
            <TextField
              fullWidth
              size="small"
              label={selectedLang.game_code}
              value={selectedData?.real_id}
              onChange={(e) => handleChange("real_id", e.target.value)}
            />
          </div>
          <div className="edit_textfield">
        <TextField
          fullWidth
          size="small"
          label="ko"
          value={
            selectedData &&
            selectedData.langs &&
            selectedData.langs.find(
              (langObject) => langObject.lang === "ko"
            )?.name
          }
          onChange={(e) => changeLanguage("ko", e.target.value, "ko")}
        />
      </div>
      <div className="edit_textfield">
        <TextField
          fullWidth
          size="small"
          label="en"
          value={
            selectedData &&
            selectedData.langs &&
            selectedData.langs.find(
              (langObject) => langObject.lang === "en"
            )?.name
          }
          onChange={(e) => changeLanguage("en", e.target.value, "en")}
        />
      </div>
      <div className="edit_textfield">
        <TextField
          fullWidth
          size="small"
          label="created at"
          value={
            selectedData &&
            selectedData.created_at
          }
          onChange={(e) => handleChange("created_at", e.target.value, "created_at")}
        />
      </div>
      {/* <div className="edit_textfield">
        <TextField
          fullWidth
          size="small"
          label="updated at"
          value={
            selectedData &&
            selectedData.updated_at
          }
          onChange={(e) => handleChange("updated_at", e.target.value, "updated_at")}
        />
      </div> */}
          <div className="bottom_btns">
            <FormControlLabel
             style={{ color: "#fff" }}
              control={
                <Checkbox
                  checked={selectedData?.game_enabled}
                  onChange={(e) =>
                    handleChange("game_enabled", e.target.checked)
                  }
                />
              }
              label={selectedLang.game_enabled}
            />
            <Button
              variant="contained"
              // color='primary'
              className="flex item-center"
              color="secondary"
              onClick={props.updateGameList}
              sx={{
                borderRadius: "4px",
              }}>
              {selectedLang.submit}
            </Button>
          </div>
        </form>
      </Box>
    </Modal>
  );
};

export default EditModel;
