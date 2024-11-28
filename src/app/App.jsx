import "@mock-api";
import BrowserRouter from "@fuse/core/BrowserRouter";
import FuseLayout from "@fuse/core/FuseLayout";
import FuseTheme from "@fuse/core/FuseTheme";
import { SnackbarProvider } from "notistack";
import { useSelector } from "react-redux";
import rtlPlugin from "stylis-plugin-rtl";
import createCache from "@emotion/cache";
import { CacheProvider } from "@emotion/react";
import { selectCurrentLanguageDirection } from "app/store/i18nSlice";
import { selectUser } from "app/store/userSlice";
import themeLayouts from "app/theme-layouts/themeLayouts";
import { selectMainTheme } from "app/store/fuse/settingsSlice";
import FuseAuthorization from "@fuse/core/FuseAuthorization";
import settingsConfig from "app/configs/settingsConfig";
import withAppProviders from "./withAppProviders";
import { AuthProvider } from "./auth/AuthContext";
import { useEffect } from "react";
import APIService from "./services/APIService";
import { useDispatch } from "react-redux";
import { providerChanged,setDynamicImg } from "./store/providerSlice";
import DataHandler from "./handlers/DataHandler";
import jwtDecode from "jwt-decode";
import { subAgentsChanged } from "./store/subAgentsSlice";

// import axios from 'axios';
/**
 * Axios HTTP Request defaults
 */
// axios.defaults.baseURL = "";
// axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
// axios.defaults.headers.common['Content-Type'] = 'application/x-www-form-urlencoded';

const emotionCacheOptions = {
  rtl: {
    key: "muirtl",
    stylisPlugins: [rtlPlugin],
    insertionPoint: document.getElementById("emotion-insertion-point"),
  },
  ltr: {
    key: "muiltr",
    stylisPlugins: [],
    insertionPoint: document.getElementById("emotion-insertion-point"),
  },
};

const App = () => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const langDirection = useSelector(selectCurrentLanguageDirection);
  const mainTheme = useSelector(selectMainTheme);
  const user_id = DataHandler.getFromSession("user_id");

  try {
    var role = jwtDecode(DataHandler.getFromSession("accessToken"))["data"];
  } catch (e) {
    var role = "";
  }

//   useEffect(()=>{
//     APIService({
//       url: `${process.env.REACT_APP_R_SITE_API}/branding?branding=${process.env.REACT_APP_BRANDING_UNIQUE_NAME}`,
//       method: "GET",
//     })
//       .then((res) => {
//         dispatch(setDynamicImg(res.data))
//         localStorage.setItem("titleName",res.data.data.title)
//         localStorage.setItem("faviconImg",res.data.data.favicon_image)
//         localStorage.setItem("logoImg", res.data.data.logo_image)
//       })
//       .catch((error) => {
//         console.error("Error fetching data:", error);
//       })
// },[])

  useEffect(() => {
    dispatch(providerChanged(1));
    // APIService({
    //   url: `${process.env.REACT_APP_R_SITE_API}/user/get-sub-agents`,
    //   method: "GET",
    // })
    //   .then((data) => {
    //     dispatch(subAgentsChanged(data.data.data));
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //   });
  }, []);

  return (
    <CacheProvider value={createCache(emotionCacheOptions[langDirection])}>
      <FuseTheme theme={mainTheme} direction={langDirection}>
        <AuthProvider>
          <BrowserRouter>
            <SnackbarProvider
              maxSnack={5}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
              }}
              classes={{
                containerRoot:
                  "bottom-0 right-0 mb-52 md:mb-68 mr-8 lg:mr-80 z-99",
              }}
            >
              <FuseLayout layouts={themeLayouts} />
            </SnackbarProvider>
          </BrowserRouter>
        </AuthProvider>
      </FuseTheme>
    </CacheProvider>
  );
};

export default withAppProviders(App)();
