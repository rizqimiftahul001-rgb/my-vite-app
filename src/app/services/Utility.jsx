/** @format */
import React from "react";
import moment from "moment-timezone";
import DataHandler from "../handlers/DataHandler";
import { numToKorean, FormatOptions } from "num-to-korean";
import PopupState, { bindTrigger, bindMenu } from "material-ui-popup-state";
import MenuItem from "@mui/material/MenuItem";
import { Menu } from "@mui/material";

/**
 *
 * @param {String} sentence
 * @returns
 */
const timeZone = DataHandler.getFromSession("timeZone");

function formatSentence(sentence) {
  if (!sentence) return "null";
  // Replace spaces in the middle with underscores
  const underscored = sentence?.replace(/\s+/g, "_").replace(/[!-.]/g, "");
  // Convert all characters to lowercase
  const lowercase = underscored?.toLowerCase();

  return lowercase;
}

function copyToClipBoard(text) {
  navigator.clipboard
    .writeText(text)
    .then(() => {
      console.log("Text copied to clipboard");
    })
    .catch((error) => {
      console.error("Error copying text: ", error);
    });
}
//date format function to time zone
function formatDateTimeZone(dateString) {
  const date = new Date(dateString);

  const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const options = {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  };

  if (userTimeZone.includes("Asia")) {
    // Asia timezone formatting
    options.year = "numeric";
    options.month = "2-digit";
    options.day = "2-digit";
  }

  return date.toLocaleDateString(undefined, options);
}
//date format to selected locale
// function formatDate(inputDate, selectLocale) {
//   const date = new Date(inputDate);

//   // Define format options
//   const enOptions = { day: '2-digit', month: '2-digit', year: 'numeric' };
//   const koOptions = { year: 'numeric', month: '2-digit', day: '2-digit' };

//   // Create date formatter based on selectLocale
//   const dateFormatter = new Intl.DateTimeFormat(
//     selectLocale === 'en' ? 'en-US' : 'ko-KR',
//     selectLocale === 'en' ? enOptions : koOptions
//   );

//   return dateFormatter.format(date);
// }

//time zone change according to device time
function formatLocalDateTime(inputDate) {
  
  const deviceTimeZone = timeZone ? timeZone : moment.tz.guess(); // Detect the device's time zone
  return moment.tz(inputDate, deviceTimeZone).format("YYYY/MM/DD HH:mm:ss");

  // const options = {
  //   year: "numeric",
  //   month: "2-digit",
  //   day: "2-digit",
  //   hour: "2-digit",
  //   minute: "2-digit",
  //   second: "2-digit",
  //   timeZone: "UTC",
  // };

  // const formattedDate = new Date(inputDate).toLocaleString("en-GB", options);
  // return formattedDate.replace(
  //   /(\d+)\/(\d+)\/(\d+), (\d+):(\d+):(\d+)/,
  //   "$3/$2/$1 $4:$5:$6"
  // );
}

function formatLocalDateTimeforLastLogin(inputData) {
  
  const deviceTimeZone = timeZone ? timeZone : moment.tz.guess(); // Detect the device's time zone
    if(inputData=== undefined)
    {
        return "";
    }
    else{
      return moment.tz(inputData, deviceTimeZone).format("YYYY/MM/DD HH:mm:ss");
    }

}


//date string format
function formatDate(inputDate) {
  if (!inputDate) return "";
  let formattedDate = "";
  try {
    const parts = inputDate.split("/");
    formattedDate = `${parts[2]}/${parts[0].padStart(
      2,
      "0"
    )}/${parts[1].padStart(2, "0")}`;
  } catch (error) {
    console.log(error);
    formattedDate = inputDate;
  }

  return formattedDate;
}
function convertToKorean(number, language) {
  if (number < 0) number = Math.abs(number);
  return (
    <span style={{ marginLeft: "10px" }}>
      {"("}
      {numToKorean(number, FormatOptions.LINGUAL)}
      {")"}
    </span>
  );
}
function casinoUserMenu(selectedLang, casinoUsername, navigate) {
  return (
    <PopupState variant="popover" popupId="demo-popup-menu">
      {(popupState) => (
        <React.Fragment>
          {/* <Button variant="contained" {...bindTrigger(popupState)}>
          Dashboard
        </Button> */}
          <span
            style={{
              textDecoration: "underline",
              cursor: "pointer",
            }}
            {...bindTrigger(popupState)}
          >{`${casinoUsername}`}</span>
          <Menu {...bindMenu(popupState)}>
            <MenuItem
              onClick={() => {
                popupState.close();
                navigate(`/user/betHistory?q_casino_user=${casinoUsername}`);
              }}
            >
              {selectedLang.BETHISTORY}
            
            </MenuItem>

            <MenuItem
              onClick={() => {
                popupState.close(); // Close the popup
                navigate(`/user/transactionHistory?agent=${casinoUsername}`);
              }}
            >
              {selectedLang.TRANSACTIONHISTORYUSER}
            
            </MenuItem>
            <MenuItem
              onClick={() => {

                popupState.close;
                navigate(
                  `/statistics/revenueStatisticsCasino?agent=${casinoUsername}`
                );
              }}
            >
              {selectedLang.USERREVENUESTAT}
            
            </MenuItem>
          </Menu>
        </React.Fragment>
      )}
    </PopupState>
  );
}
function customSortFunction(a, b, order) {
  let reverse = 1;

  if (order === "asc") {
    reverse = -1;
  }

  // Sort positive numbers first in descending order
  if (a > 0 && b > 0) {
    return (b - a) * reverse;
  }

  if (a > 0 && b <= 0) {
    return -1;
  }

  if (a <= 0 && b > 0) {
    return 1;
  }

  // Sort negative numbers next in descending order
  if (a < 0 && b < 0) {
    return (b - a) * reverse;
  }

  if (a < 0 && b === 0) {
    return -1;
  }

  if (a === 0 && b < 0) {
    return 1;
  }

  // Sort zero last
  return 0;
}

// function customSortFunction(a, b, order) {
//   const absA = Math.abs(a);
//   const absB = Math.abs(b);
//   let reverse = 1;
//   console.log(order);
//   if (order == "asc") {
//     reverse = -1;
//   }

//   if (a < 0 && b < 0) {
//     // Sort by absolute values for negative numbers
//     return (absB - absA) * reverse;
//   }

//   // Sort negative numbers before positive ones
//   if (a < 0 && b >= 0) {
//     return -1 * reverse;
//   }

//   // Sort positive numbers after negative ones
//   if (a >= 0 && b < 0) {
//     return 1 * reverse;
//   }

//   // Sort zeros after negative and before positive
//   if (a === 0 && b !== 0) {
//     return 1 * reverse;
//   }

//   // Sort positive numbers
//   return (b - a) * reverse;
// }

function agentMenu(selectedLang, data, navigate) {
  return (
    <PopupState variant="popover" popupId="demo-popup-menu">
      {(popupState) => (
        <React.Fragment>
          {/* <Button variant="contained" {...bindTrigger(popupState)}>
        Dashboard
      </Button> */}
          <span
            style={{
              textDecoration: "underline",
              cursor: "pointer",
            }}
            {...bindTrigger(popupState)}
          >{`${data?.parent_id}(${data?.parent_nickname || ""})`}</span>
          <Menu {...bindMenu(popupState)}>
            {/* {(role["role"] == "admin" ||
          role["role"] == "cs" ||
          myType == "2") && ( */}
            <MenuItem
              onClick={() => {
                popupState.close;
                navigate(`/mypage?agent_id=${data?.parentUsers.find(user => user.id ===(data?.parent_id))?.user_id}`);
              }}
            >
              {selectedLang.MYPAGE}
            </MenuItem>
            {/* )} */}
            <MenuItem
              onClick={() => {
                popupState.close;
                navigate(`/agent/transactionHistory?agent=${data?.id}`);
              }}
            >
              {selectedLang.TRANSACTIONHISTORYAGENT}
            </MenuItem>
            <MenuItem
              onClick={() => {
                popupState.close;
                navigate(`/agent/agentTreeList?q_agent=${data?.user_id}`);
              }}
            >
              {selectedLang.change_password}
            </MenuItem>

            <MenuItem
              onClick={() => {
                popupState.close;
                navigate(
                  `/statistics/agentRevenueStatistics?agent=${data?.id}`
                );
              }}
            >
              {selectedLang.AGENTRSTATISTICS}
            </MenuItem>
            <MenuItem
              onClick={() => {
                popupState.close;
                navigate(
                  `/statistics/statisticsByGame?agent_id=${data?.user_id}`
                );
              }}
            >
              {selectedLang.statisticsByGame}
            </MenuItem>
            {/* <MenuItem onClick={popupState.close}>Pot Distribution Statistics</MenuItem> */}
            <hr style={{ border: "1px solid" }} />
            <MenuItem
                  onClick={() => {
                    popupState.close;
                    navigate(
                      `/max-win-management?agent_id=${data?.user_id}`
                    );
                  }}
            >
              {selectedLang.WINMANAGEMENT}
            </MenuItem>
            <hr style={{ border: "1px solid" }} />
            <MenuItem
              onClick={() => {
                popupState.close;
                navigate(`/providerManagement?agent_id=${data?.user_id}`);
              }}
            >
              {selectedLang.PROVIDERMANAGEMENT}
            </MenuItem>
            <hr style={{ border: "1px solid" }} />
            <MenuItem
              onClick={() => {
                popupState.close;
                navigate(`/gameManagement?agent_id=${data?.user_id}`);
              }}
            >
              {selectedLang.GAMEMANAGEMENT}
            </MenuItem>
            <hr style={{ border: "1px solid" }} />
            <MenuItem
              onClick={() => {
                popupState.close;
                navigate(`/statistics/APIerror?agent_id=${data?.user_id}`);
              }}
            >
              {selectedLang.APIERRORLOG}
            </MenuItem>
            <hr style={{ border: "1px solid" }} />
            <MenuItem
              onClick={() => {
                popupState.close;
                navigate(`/user/userList?agent=${data?.id}`);
              }}
            >
              {selectedLang.USERLIST}
            </MenuItem>
            <MenuItem
              onClick={() => {
                popupState.close;
                navigate(`/user/transactionHistory?agent=${data?.id}`);
              }}
            >
              {selectedLang.TRANSACTIONHISTORYUSER}
            </MenuItem>
            <MenuItem
              onClick={() => {
                popupState.close;
                navigate(`/user/betHistory?agent=${data?.id}`);
              }}
            >
              {selectedLang.BETHISTORY}
            </MenuItem>
          </Menu>
        </React.Fragment>
      )}
    </PopupState>
  );
}
export {
  formatSentence,
  copyToClipBoard,
  formatDateTimeZone,
  formatDate,
  formatLocalDateTime,
  convertToKorean,
  casinoUserMenu,
  customSortFunction,
  agentMenu,
  formatLocalDateTimeforLastLogin
  
};

{
  /* <PopupState variant="popover" popupId="demo-popup-menu">
{(popupState) => (
  <React.Fragment>
 
    <span
      style={{
        textDecoration: "underline",
        cursor: "pointer",
      }}
      {...bindTrigger(popupState)}
    >{`${user?.CasinoUserData["username"]}`}</span>
    <Menu {...bindMenu(popupState)}>
      <MenuItem
        onClick={() => {
          popupState.close;
          navigate(
            `/user/betHistory?q_casino_user=${user?.CasinoUserData["username"]}`
          );
        }}
      >
        {selectedLang.BETHISTORY}
      </MenuItem>
      <MenuItem
        onClick={() => {
          popupState.close;
          navigate(
            `/user/transactionHistory?agent=${user?.CasinoUserData["username"]}`
          );
        }}
      >
        {selectedLang.TRANSACTIONHISTORYUSER}
      </MenuItem>
      <MenuItem
        onClick={() => {
          popupState.close;
          navigate(
            `/statistics/revenueStatisticsCasino?agent=${user?.CasinoUserData["username"]}`
          );
        }}
      >
        {selectedLang.USERREVENUESTAT}
      </MenuItem>
    </Menu>
  </React.Fragment>
)}
</PopupState> */
}
