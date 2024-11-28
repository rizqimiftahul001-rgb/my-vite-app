import NavLinkAdapter from "@fuse/core/NavLinkAdapter";
import { alpha, styled } from "@mui/material/styles";
import clsx from "clsx";
import PropTypes from "prop-types";
import { useEffect, useMemo, useState } from "react";
import ListItem from "@mui/material/ListItem";
import { ListItemText } from "@mui/material";
import FuseNavItem from "../../FuseNavItem";
import FuseSvgIcon from "../../../FuseSvgIcon";
import jwtDecode from "jwt-decode";
import DataHandler from "src/app/handlers/DataHandler";
import { NavLink } from "react-router-dom";

try {
  var role = jwtDecode(DataHandler.getFromSession("accessToken"))["data"];
} catch (e) {
  var role = "";
}


const Root = styled(ListItem)(({ theme, itempadding, ...props }) => ({
  minminHeight: 44,
  width: "100%",
  borderRadius: "6px",
  margin: "0 0 0 0",
  paddingRight: 16,
  paddingLeft: props.itempadding > 80 ? 80 : props.itempadding,
  paddingTop: 10,
  paddingBottom: 10,
  color: alpha(theme.palette.text.primary, 0.7),
  fontWeight: 600,
  letterSpacing: "0.025em",
}));

const AddStyle = styled(ListItem)(({ theme, itempadding, ...props }) => ({
  minminHeight: 44,
  width: "100%",
  borderRadius: "6px",
  margin: "0 0 0 0",
  paddingRight: 16,
  paddingLeft: props.itempadding > 80 ? 80 : props.itempadding,
  paddingTop: 10,
  paddingBottom: 10,
  color: alpha(theme.palette.text.primary, 0.7),
  fontWeight: 600,
  letterSpacing: "0.025em",
  cursor: "pointer",
  textDecoration: "none!important",
  "&:hover": {
    color: theme.palette.text.primary,
    backgroundColor:
      theme.palette.mode === "light"
        ? "#FE9219 !important"
        : "#FE9219 !important",
  },
  "&:active": {
    color: theme.palette.text.primary,
    backgroundColor:
      theme.palette.mode === "light"
        ? "#FE9219 !important"
        : "#FE9219 !important",
    transition: "border-radius .15s cubic-bezier(0.4,0.0,0.2,1)",
    "& > .fuse-list-item-text-primary": {
      color: "inherit",
    },
    "& > .fuse-list-item-icon": {
      color: "inherit",
    },
  },
  "& >.fuse-list-item-icon": {
    marginRight: 16,
    color: "inherit",
  },
  "& > .fuse-list-item-text": {},
}));

function FuseNavVerticalGroup(props) {
  const { item, nestedLevel, onItemClick } = props;

  const itempadding = nestedLevel > 0 ? 38 + nestedLevel * 16 : 16;

  const [location, setLocation] = useState(null);

  useEffect(() => {
    let currentlocation = window.location.pathname
    setLocation(currentlocation.slice(1))
  }, [])

  return useMemo(
    () => (
      <>
        {item.access && item.access.indexOf(role["role"]) > -1 && (
          <>
            <>
              {item.url ? (
                <NavLink
                  key={item?.id}
                  // component={item.url ? NavLinkAdapter : "li"}
                  itempadding={itempadding}
                  className={clsx(
                    "fuse-list-subheader flex items-center py-10",
                    !item.url && "cursor-default"
                  )}
                  onClick={() => onItemClick && onItemClick(item)}
                  to={item.url}
                  end={item.end}
                  role="button"
                  sx={item.sx}
                  disabled={item.disabled}
                >
                  {/* {item.icon && <FuseSvgIcon>{item.icon}</FuseSvgIcon>} */}
                  {item.icon && <div className="sidebar_menu_icon" key={item?.id}>{item.icon}</div>}
                  <ListItemText
                    className="fuse-list-subheader-text"
                    sx={{
                      paddingLeft: 2,
                      margin: 0,
                      "& > .MuiListItemText-primary": {
                        fontSize: 12,
                        color: "secondary.light",
                        fontWeight: 600,
                        textTransform: "uppercase",
                        letterSpacing: ".05em",
                        lineHeight: "20px",
                      },

                      "& > .MuiListItemText-secondary": {
                        fontSize: 11,
                        color: "text.disabled",
                        letterSpacing: ".06px",
                        fontWeight: 500,
                        lineHeight: "1.5",
                      },
                    }}
                    primary={item.title}
                    secondary={item.subtitle}
                  />
                </NavLink>
              ) : (
                <Root
                  component={item.url ? NavLinkAdapter : "li"}
                  itempadding={itempadding}
                  className={clsx(
                    "fuse-list-subheader flex items-center  py-10",
                    !item.url && "cursor-default"
                  )}
                  onClick={() => onItemClick && onItemClick(item)}
                  to={item.url}
                  end={item.end}
                  role="button"
                  sx={item.sx}
                  disabled={item.disabled}
                >
                  {item.icon && <FuseSvgIcon>{item.icon}</FuseSvgIcon>}
                  <ListItemText
                    className="fuse-list-subheader-text"
                    sx={{
                      paddingLeft: 2,
                      margin: 0,
                      "& > .MuiListItemText-primary": {
                        fontSize: 12,
                        color: "secondary.light",
                        fontWeight: 600,
                        textTransform: "uppercase",
                        letterSpacing: ".05em",
                        lineHeight: "20px",
                      },

                      "& > .MuiListItemText-secondary": {
                        fontSize: 11,
                        color: "text.disabled",
                        letterSpacing: ".06px",
                        fontWeight: 500,
                        lineHeight: "1.5",
                      },
                    }}
                    primary={item.title}
                    secondary={item.subtitle}
                  />
                </Root>
              )}
            </>
            {item.children && (
              <div style={{ marginLeft: "20px" }}>
                {item.children.map((_item) => (
                  <FuseNavItem
                    key={_item.id}
                    type={`vertical-${_item.type}`}
                    item={_item}
                    nestedLevel={nestedLevel}
                    onItemClick={onItemClick}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </>
    ),
    [item, itempadding, nestedLevel, onItemClick]
  );
}

FuseNavVerticalGroup.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string,
    children: PropTypes.array,
  }),
};

FuseNavVerticalGroup.defaultProps = {};

const NavVerticalGroup = FuseNavVerticalGroup;

export default NavVerticalGroup;
