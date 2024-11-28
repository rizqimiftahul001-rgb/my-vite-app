import { memo } from "react";
import Box from "@mui/material/Box";
// import loaderlogo from '../../../../public/assets/images/logo/smalllogo2.png'

function FuseSplashScreen() {
  return (
    <div id="fuse-splash-screen">
      {/* <div className="logo">
        <img width="128" src={loaderlogo} alt="logo" />
      </div> */}
      <Box
        id="spinner"
        sx={{
          "& > div": {
            backgroundColor: "palette.secondary.main",
          },
        }}>
        {/* <div className="bounce1" />
        <div className="bounce2" />
        <div className="bounce3" /> */}
      </Box>
    </div>
  );
}

export default memo(FuseSplashScreen);
