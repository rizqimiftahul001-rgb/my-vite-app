import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import { useEffect,useState } from "react";
import JwtService from "../../auth/services/jwtService";
import APIService from "src/app/services/APIService";
import { useDispatch } from "react-redux";
import { formatSentence } from "src/app/services/Utility";
import { showMessage } from "app/store/fuse/messageSlice";
import {locale} from "app/configs/navigation-i18n";


function SignOutPage() {

  // let logoImg = localStorage.getItem("logoImg");
  const dispatch = useDispatch();
  const [selectedLang, setSelectedLang] = useState(locale.ko);



  useEffect(() => {
    APIService({
      url: `${process.env.REACT_APP_R_SITE_API}/user/logout`,
      method: "POST",
    })
      .then(async(res) => {
        let response = await res.data
      })
      .catch((err) => {
        dispatch(
          showMessage({
            variant: "error",
            message: `${
              selectedLang[`${formatSentence(err?.message)}`] ||
              selectedLang.something_went_wrong
            }`,
          })
        );
      })
      .finally(() => {
      });
    setTimeout(() => {
      JwtService.logout();
    }, 1000);
  }, []);

  return (
    <div className="flex flex-col flex-auto items-center sm:justify-center min-w-0">
      <div className="w-full max-w-320 sm:w-320 mx-auto sm:mx-0" style={{padding:"20px 30px",border:"1px solid #202020",borderRadius:"20px",boxShadow:"-5px 6px 0 0 #342c2c"}}>
        <img
          className="mx-auto" 
          style={{maxWidth: "180px"}}
          src="/assets/images/aslan_logo.png"
          alt="logo"
        />
        <Typography className="text-center" style={{fontSize:"20px",marginTop:'20px',color:"#fff"}}>
          You have signed out!
        </Typography>
      </div>
    </div>
  );
}

export default SignOutPage;
