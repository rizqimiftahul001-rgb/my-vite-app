import DataHandler from "../handlers/DataHandler";
// import jwt_decode from "jwt-decode";
import axios from "axios";

const APISupport = async ({
  url,
  data = {},
  method = "POST",
  isFormdata = false,
  passToken = true,
}) => {
  const user = DataHandler.getFromSession("user_id");
  const accessToken = DataHandler.getFromSession("accessToken");

  //   let decodedToken = jwt_decode(accessToken);

  let headers = {
    "Content-Type": "application/json",
    "Cache-Control": "No-Cache",
  };

  if (accessToken) {
    headers = { ...headers, Authorization: `Bearer ${accessToken}` };
  }

  return new Promise((resolve, reject) => {
    axios({
      url,
      method,
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
            DataHandler.clearSession();
            setTimeout(() => {
              window.location.replace("/");
            }, 2000);
          }
          reject(error.response.data.error);
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

export default APISupport;
