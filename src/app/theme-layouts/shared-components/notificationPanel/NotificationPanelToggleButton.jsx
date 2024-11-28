/** @format */

import { useEffect, useMemo, useState } from "react";
import Badge from "@mui/material/Badge";
import IconButton from "@mui/material/IconButton";
import { useDispatch, useSelector } from "react-redux";
import withReducer from "app/store/withReducer";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import Popover from "@mui/material/Popover";
import reducer from "./store";
import APIService from "src/app/services/APIService";
import DataHandler from "src/app/handlers/DataHandler";
//import { selectNotifications } from "./store/dataSlice";
//import { toggleNotificationPanel } from "./store/stateSlice";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import { styled } from "@mui/material/styles";
import { Button, Link } from "@mui/material";
import { locale } from "app/configs/navigation-i18n";
import { useNavigate } from "react-router-dom";
const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  borderRadius: 0,
  ...theme.typography.body2,
  padding: theme.spacing(2),
  color: theme.palette.text.secondary,
}));

function NotificationPanelToggleButton(props) {
  // const notificationsAlert = useSelector(selectNotifications);
    const [headerLoad] = useSelector((state) => [state.headerLoad.headerLoad]);
  //const dispatch = useDispatch()

  const navigate = useNavigate();
  const [selectLocale] = useSelector((state) => [state.locale.selectLocale]);
  const [selectedLang, setSelectedLang] = useState(locale.en);
  const user_id = DataHandler.getFromSession("user_id");
  const [notifications, setNotification] = useState([]);
  const [menu, setMenu] = useState(null);  
  const langMenuClick = (event) => {
    setMenu(event.currentTarget);
  };
  useEffect(() => {
    if (selectLocale == "ko") {
      setSelectedLang(locale.ko);
    } else {
      setSelectedLang(locale.en);
    }
  }, [selectLocale]);

  const langMenuClose = () => {
    setMenu(null);
  };

  function handleLanguageChange() {
    langMenuClose();
  }
  function navigateToNotification() {
    getNotifications();
    navigate("/agent/transactionHistory");
  }

  const pollingInterval = 600000;

  useEffect(() => {
    getNotifications();
    setInterval(getNotifications, pollingInterval);
  }, []);

    useEffect(() => {
      console.log("headerLoad changed")
    getNotifications();
    setInterval(getNotifications, pollingInterval);
  }, [headerLoad]);



  useEffect(() => {
    if (notifications.length > 0) {
      const audio = new Audio("assets/sound/noti1.mp3");

      const playAudio = () => {
        audio.play().catch((error) => { });
      };
      playAudio();
    }
  }, [notifications]);

  const getNotifications = async () => {
    await APIService({
      url: `${process.env.REACT_APP_R_SITE_API}/request-list-not-approved?user_id=${user_id}`,
      method: "GET",
    })
      .then((res) => {
        setNotification(res.data.data);
      })
      .catch((e) => { })
      .finally(() => { });
  };

  const readNofication = async (request_id, type) => {
    await APIService({
      url: `${process.env.REACT_APP_R_SITE_API}/user/read_notification/${request_id}`,
      data: {
        type: type,
      },
      method: "PUT",
    })
      .then((res) => {
        // setNotification(res.data.data);
      })
      .catch((e) => { })
      .finally(() => { });
  };

  const readAllNofication = async () => {
    await APIService({
      url: `${process.env.REACT_APP_R_SITE_API}/user/read_all_notification/${user_id}`,
      method: "PUT",
    })
      .then((res) => {
        // setNotification(res.data.data);
        getNotifications();
      })
      .catch((e) => { })
      .finally(() => { });
  };

  return (
    <>
      <IconButton
        key={"icon-but"}
        className="Notification_btn"
        onClick={langMenuClick}
        size="large">
        <Badge
          key={"badge"}
          color="secondary"
          variant={
            notifications &&
              notifications.reduce(
                (acc, item) => acc + (item.notification_read ? 0 : 1),
                0
              ) > 0
              ? `dot`
              : ""
          }
          invisible={notifications.length === 0}>
          <svg width="17" height="20" viewBox="0 0 17 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1.81818 14.8837H14.5455V8.4013C14.5455 4.78889 11.6964 1.86047 8.18182 1.86047C4.66728 1.86047 1.81818 4.78889 1.81818 8.4013V14.8837ZM8.18182 0C12.7005 0 16.3636 3.76138 16.3636 8.4013V16.7442H0V8.4013C0 3.76138 3.66313 0 8.18182 0ZM5.90909 17.6744H10.4545C10.4545 18.9588 9.437 20 8.18182 20C6.92664 20 5.90909 18.9588 5.90909 17.6744Z" fill="#222222" />
          </svg>
        </Badge>
      </IconButton>

      {notifications.length > 0 && notifications !== "" ?
      (
        <Popover
          key={"popover"}
          className="notification_popover"
          open={Boolean(menu)}
          anchorEl={menu}
          onClose={langMenuClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}>
          <Box key={"box-1"} sx={{ width: "100%" }}>
            <Button
              style={{ width: "100%", textAlign: "left", padding: "8px 16px" }}
              onClick={() => {
                readAllNofication();
              }}>
              {selectedLang.mark_all_as_read}
            </Button>
            <Stack key={"stack-1"}>
              {notifications
                .sort((a, b) => {
                  const dateA = new Date(a.created_at);
                  const dateB = new Date(b.created_at);
                  return dateB - dateA;
                })
                .map((noti, index) => (
                  <Link
                    key={index}
                    style={{
                      textDecoration: "none",
                      underline: "none",
                      cursor: "pointer",
                      userSelect: "none",
                    }}
                    onClick={navigateToNotification}>
                    <ul key={index} className="notification_card">
                      <li>
                        <span key={index}>{index + 1}</span>
                        <p
                          key={index}
                          className={`${noti.notification_read ? "read" : "unread"
                            }-notification`}
                          onClick={() => {
                            readNofication(
                              noti?.transaction_type == "deposit" ||
                                noti?.transaction_type == "withdraw"
                                ? noti?.transaction_id
                                : noti?.request_id,
                              noti?.transaction_type == "deposit" ||
                                noti?.transaction_type == "withdraw"
                                ? "withdraw_deposite"
                                : "r_request"
                            );
                          }}>
                          {selectLocale == "ko" ? (
                            noti?.transaction_type == "deposit" ||
                              noti?.transaction_type == "withdraw" ? (
                              <>
                                {`${noti?.to_user_name}  ${noti?.transaction_type == "deposit"
                                    ? `님의 계정에 ${Number(
                                      noti?.amount || 0
                                    ).toLocaleString()} pot 출금`
                                    : `님의 계정에서 ${Number(
                                      noti?.amount || 0
                                    ).toLocaleString()} pot 입금`
                                  }`}
                              </>
                            ) : (
                              <>
                                {noti.userDetails[0]?.id}{" "}
                                {selectedLang.has_requested} {noti.point_amount}{" "}
                                {selectedLang.r_points}
                              </>
                            )
                          ) : noti?.transaction_type == "deposit" ||
                            noti?.transaction_type == "withdraw" ? (
                            <>
                              {`${Number(
                                noti?.amount || 0
                              ).toLocaleString()} pot ${noti?.transaction_type == "deposit"
                                  ? `${selectedLang.deposit_to} ${noti?.to_user_name}`
                                  : `${selectedLang.withdrawan_from} ${noti?.to_user_name}`
                                }'${selectedLang.account}`}
                            </>
                          ) : (
                            <>
                              {noti.userDetails[0]?.id}{" "}
                              {selectedLang.has_requested}{" "}
                              {Number(noti.point_amount).toLocaleString()}
                              {" pot"} {selectedLang.r_points}
                            </>
                          )}
                        </p>
                      </li>
                    </ul>
                  </Link>
                ))}
            </Stack>
          </Box>
        </Popover>
      )
      :
      (
        <Popover
          key={"popover"}
          className="notification_popover"
          open={Boolean(menu)}
          anchorEl={menu}
          onClose={langMenuClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}>
          <Box key={"box-1"} sx={{ width: "100%" }}>
            <Button
              style={{ width: "100%", textAlign: "left", padding: "8px 16px" }}
              // onClick={() => {
              //   readAllNofication();
              // }}
              >
              {selectedLang.noNotification}
            </Button>
          </Box>
        </Popover>
      )
    }
    </>
  );
}

NotificationPanelToggleButton.defaultProps = {
  children: (
    <FuseSvgIcon key={"fuse-icone"}>heroicons-outline:bell</FuseSvgIcon>
  ),
};

export default withReducer(
  "notificationPanel",
  reducer
)(NotificationPanelToggleButton);
