import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import MenuItem from "@mui/material/MenuItem";
import Popover from "@mui/material/Popover";
import Typography from "@mui/material/Typography";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Link, NavLink } from "react-router-dom";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import { selectUser } from "app/store/userSlice";
import APIService from "/src/app/services/APIService";
import DataHandler from "/src/app/handlers/DataHandler";
import { locale } from "/app/configs/navigation-i18n";

function UserMenu(props) {
  const user = useSelector(selectUser);
  const [selectedLang, setSelectedLang] = useState(locale.en);
  const [selectLocale] = useSelector((state) => [state.locale.selectLocale]);
  const [userMenu, setUserMenu] = useState(null);
  const [userDetails, setUserDetails] = useState();

  useEffect(() => {
    if (selectLocale == "ko") {
      setSelectedLang(locale.ko);
    } else {
      setSelectedLang(locale.en);
    }
  }, [selectLocale]);

  const userMenuClick = (event) => {
    setUserMenu(event.currentTarget);
  };

  const userMenuClose = () => {
    setUserMenu(null);
    APIService({
      url: `${process.env.REACT_APP_R_SITE_API}/user/update-logout-time`,
      method: "PUT",
    })
      .then((data) => { })
      .catch((err) => { })
      .finally(() => {
        // setLoading3(false);
      });
  };

  useEffect(() => {
    const user_id = DataHandler.getFromSession("user_id");
    getUserDetails(user_id);
  }, []);

  const getUserDetails = (user_id) => {
    APIService({
      url: `${process.env.REACT_APP_R_SITE_API}/user/details?user_id=${user_id}`,
      method: "GET",
    })
      .then((data) => {
        setUserDetails(data.data.data[0]);
        props.setUserData(data.data.data[0]);
      })
      .catch((e) => { })
      .finally(() => { });
  };

  return (
    <>
      <Button
        className="avtar_loginbtn"
        onClick={userMenuClick}
        color="inherit"
      >
        <div className="md:flex flex-col mx-4 items-end">
          <Typography component="span" className="font-semibold flex">
            {userDetails?.id}
          </Typography>
          {/* <Typography
            className="text-11 font-medium capitalize"
            color="text.secondary"
          >
            {user.role.toString()}
            {(!user.role ||
              (Array.isArray(user.role) && user.role.length === 0)) &&
              "Guest"}
          </Typography> */}
        </div>

        {user.data.photoURL ? (
          <Avatar
            className="md:mx-4 meavtar"
            alt="user photo"
            src={user.data.photoURL}
          />
        ) : (
          <Avatar className="md:mx-4 meavtar">
            {user.data.displayName[0]}
          </Avatar>
        )}
      </Button>

      <Popover
        open={Boolean(userMenu)}
        anchorEl={userMenu}
        onClose={userMenuClose}
        className="userlogin_popover"
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <div className="userLogout_block">
          {!user.role || user.role.length === 0 ? (
            <>
              <MenuItem component={Link} to="/sign-in" role="button">
                <ListItemIcon className="min-w-40">
                  <FuseSvgIcon>heroicons-outline:lock-closed</FuseSvgIcon>
                </ListItemIcon>
                <ListItemText primary="Sign In" />
              </MenuItem>
              <MenuItem component={Link} to="/sign-up" role="button">
                <ListItemIcon className="min-w-40">
                  <FuseSvgIcon>heroicons-outline:user-add </FuseSvgIcon>
                </ListItemIcon>
                <ListItemText primary="Sign up" />
              </MenuItem>
            </>
          ) : (
            <>
              {/* <MenuItem
              component={Link}
              to="/apps/profile"
              onClick={userMenuClose}
              role="button"
            >
              <ListItemIcon className="min-w-40">
                <FuseSvgIcon>heroicons-outline:user-circle</FuseSvgIcon>
              </ListItemIcon>
              <ListItemText primary="My Profile" />
            </MenuItem> */}
              {/* <MenuItem component={Link} to="/apps/mailbox" onClick={userMenuClose} role="button">
              <ListItemIcon className="min-w-40">
                <FuseSvgIcon>heroicons-outline:mail-open</FuseSvgIcon>
              </ListItemIcon>
              <ListItemText primary="Inbox" />
            </MenuItem> */}

              <MenuItem
                component={NavLink}
                to="/sign-out"
                onClick={() => {
                  userMenuClose();
                }}
              >
                <img
                  src="/assets/images/power.png"
                  alt="Logout"
                  className="min-w-0"
                />
              </MenuItem>
            </>
          )}
        </div>
      </Popover>
    </>
  );
}

export default UserMenu;
