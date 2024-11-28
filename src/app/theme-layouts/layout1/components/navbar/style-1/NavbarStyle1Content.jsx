import FuseScrollbars from "@fuse/core/FuseScrollbars";
import { styled } from "@mui/material/styles";
import clsx from "clsx";
import { memo, useEffect, useState } from "react";
import Logo from "../../../../shared-components/Logo";
import NavbarToggleButton from "../../../../shared-components/NavbarToggleButton";
import Navigation from "../../../../shared-components/Navigation";
import APIService from "src/app/services/APIService";
import jwtDecode from "jwt-decode";
import DataHandler from "src/app/handlers/DataHandler";
import { useDispatch, useSelector } from 'react-redux';
import { locale } from "../../../../../configs/navigation-i18n";
import { NavLink } from "react-router-dom";
import { showMessage } from 'app/store/fuse/messageSlice';

const Root = styled("div")(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  color: theme.palette.text.primary,
  "& ::-webkit-scrollbar-thumb": {
    boxShadow: `inset 0 0 0 20px ${theme.palette.mode === "light"
        ? "rgba(0, 0, 0, 0.24)"
        : "rgba(255, 255, 255, 0.24)"
      }`,
  },
  "& ::-webkit-scrollbar-thumb:active": {
    boxShadow: `inset 0 0 0 20px ${theme.palette.mode === "light"
        ? "rgba(0, 0, 0, 0.37)"
        : "rgba(255, 255, 255, 0.37)"
      }`,
  },
}));

const StyledContent = styled(FuseScrollbars)(({ theme }) => ({
  overscrollBehavior: "contain",
  overflowX: "hidden",
  overflowY: "auto",
  WebkitOverflowScrolling: "touch",
  backgroundRepeat: "no-repeat",
  backgroundSize: "100% 40px, 100% 10px",
  backgroundAttachment: "local, scroll",
}));

function NavbarStyle1Content(props) {
  const dispatch = useDispatch()

  const [selectLocale] = useSelector((state) => [state.locale.selectLocale]);
  const [selectedLang, setSelectedLang] = useState(locale.ko);

  useEffect(() => {
    if (selectLocale == "ko") {
      setSelectedLang(locale.ko);
    } else {
      setSelectedLang(locale.en);
    }
  }, [selectLocale]);


  const [providerGGR, setProviderGGR] = useState("");
  const [timelessGGR, settimelessGGR] = useState([]);
  const [loading1, setLoading1] = useState(true);
  const userRole = jwtDecode(DataHandler.getFromSession("accessToken"))["data"];
  const getProviderGGR = () => {
    setLoading1(true);
    APIService({
      url: `${process.env.REACT_APP_R_SITE_API
        }/user/provider-ggr`,
      method: "GET",
    })
      .then((res) => {
        setProviderGGR(res.data.data);
      })
      .catch((err) => {
        setProviderGGR([]);
        // console.error("Error:", err);
        dispatch(
          showMessage({
            variant: "error",
            message: `${selectedLang[`${(err?.message)}`] ||
              selectedLang.something_went_wrong
              }`,
          })
        );
      })
      .finally(() => {
        setLoading1(false);
      });
  };

  const getTimelessGGR = () => {
    setLoading1(true);
    APIService({
      url: `${process.env.REACT_APP_R_SITE_API
        }/user/timeless-ggr`,
      method: "GET",
    })
      .then((res) => {
        settimelessGGR(res?.data?.data);
      })
      .catch((err) => {
        settimelessGGR([]);
        dispatch(
          showMessage({
            variant: "error",
            message: `${selectedLang[`${(err?.message)}`] ||
              selectedLang.something_went_wrong
              }`,
          })
        );
      })
      .finally(() => {
        setLoading1(false);
      });
  };

  useEffect(() => {
    if (userRole.role === "admin") {
      getProviderGGR();
      getTimelessGGR();
    }
  }, []);

  return (
    <Root
      className={clsx(
        "flex flex-auto flex-col overflow-hidden sidebar_wrapper",
        props.className
      )}>
      <div className="flex flex-row items-center shrink-0 h-48 md:h-72 px-20 sidebar_logo_toggle">
        <div
          className="flex flex-1 mx-4 sidelogo"
          style={{ alignItems: "center" }}>
          <Logo />
        </div>
        <NavbarToggleButton className="w-40 h-40 p-0" />
      </div>
      <StyledContent
        className="flex flex-1 flex-col min-h-0 main_menu_wrapper"
        option={{ suppressScrollX: true, wheelPropagation: false }}>
          {
             userRole.role === "admin" && 
             <>
              <NavLink className="px-12 menuCard_link">
                <div className="menuCard">
                  
                  <span>
                    <h5>{(selectedLang?.Honor_Link).toUpperCase()}</h5>
                    <p>{providerGGR.length > 0 ? (Math.round(Number(providerGGR.find(data => data.provider_id === "10")?.ggr)).toLocaleString()) : 0}</p>
                  </span>
                  <span>
                    <h5>{(selectedLang?.Vinus).toUpperCase()}</h5>
                    <p>{providerGGR.length > 0 ? (Math.round(Number(providerGGR.find(data => data.provider_id === "18")?.ggr)).toLocaleString()) : 0}</p>
                  </span>
                  {
                    timelessGGR && timelessGGR.map((data,index)=>{
                      return(<>
                          <span>
                            <h5>{data?.operator}</h5>
                            <p>{timelessGGR.length > 0 ? (Math.round(Number(data?.data?.currencies?.KRW?.available_balance))).toLocaleString() : 0}</p>
                          </span>
                      </>)
                    })
                  }
                  {/* <span>
                    <h5>Each Vendor ...</h5>
                  </span> */}
                </div>
              </NavLink>
             </>
          }

        <Navigation layout="vertical" />
      </StyledContent>
    </Root>
  );
}

export default memo(NavbarStyle1Content);
