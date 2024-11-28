import DataHandler from "../handlers/DataHandler";
// import jwt_decode from "jwt-decode";
import axios from "axios";

const APIService = async ({
  url,
  data = {},
  method = "POST",
  isFormdata = false,
  passToken = true,
}) => {
  const user = DataHandler.getFromSession("user_id");
  const accessToken = DataHandler.getFromSession("accessToken");
  const login_person = DataHandler.getFromSession("login_person");
  //   let decodedToken = jwt_decode(accessToken);

  let headers = {
    "Content-Type": "application/json",
    "Cache-Control": "No-Cache",
    login_person: login_person,
  };

  if (accessToken) {
    headers = { ...headers, Authorization: `Bearer ${accessToken}` };
  }

  return new Promise((resolve, reject) => {
    axios({
      url,
      method,
      baseURL: process.env.REACT_APP_R_SITE_API,
      data,
      headers,
    })
      .then((res) => {
        if (res && res.data) resolve(res.data);
        else resolve(res);
      })
      .catch((error) => {
        if (error.response) {
          if ([401, 410].includes(error?.response?.status)) {
            window.location.replace("/sign-in");
            // DataHandler.clearSession();
            // setTimeout(() => {
            // }, 2000);
          }
          reject(error.response.data);
        } else if (error.request) {
          // The request was made but no response was received
          reject(error.request);
        } else {
          // Something happened in setting up the request that triggered an Error
          reject(error);
        }
      });
  });
};

export default APIService;
