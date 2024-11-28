import AppBar from "@mui/material/AppBar";
import { ThemeProvider } from "@mui/material/styles";
import Toolbar from "@mui/material/Toolbar";
import { memo, useState } from "react";
import { useSelector } from "react-redux";
import { selectFooterTheme } from "app/store/fuse/settingsSlice";
import clsx from "clsx";
import ListItemText from "@mui/material/ListItemText";
import PoweredByLinks from "../../shared-components/PoweredByLinks";
import DocumentationButton from "../../shared-components/DocumentationButton";
import PurchaseButton from "../../shared-components/PurchaseButton";

function FooterLayout1(props) {
  const footerTheme = useSelector(selectFooterTheme);
  // const dynamicImg = useSelector((state) => state.provider.dynamicImg);

  // let footerTitle = ''

  // if(dynamicImg !== null){
  //     footerTitle = dynamicImg.data.footer
  // }

  const [curresntdata, setCurrentData] = useState(new Date());

  return (
    <ThemeProvider theme={footerTheme}>
      {/* <AppBar
        //id="fuse-footer"
        className={clsx("relative z-20 copyright_header", props.className)}
        color="default"
        sx={{
          backgroundColor: (theme) =>
            theme.palette.mode === "light"
              ? footerTheme.palette.background.paper
              : footerTheme.palette.background.default,
        }}
        >
      </AppBar> */}

        <Toolbar
          className="copyright_block min-h-48 md:min-h-64 px-8 sm:px-12 py-0 flex items-center overflow-x-auto">
          <ListItemText
            className="fuse-list-item-text flex grow text-white shrink-0 justify-center"
            secondary={"Copyright © 2024 ASLAN GAMING"}
            classes={{
              secondary:
                "text-13 font-medium fuse-list-item-text-secondary leading-normal truncate",
            }}
          />
        </Toolbar>
    </ThemeProvider>
  );
}

export default memo(FooterLayout1);
