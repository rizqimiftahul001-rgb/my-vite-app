import IconButton from '@mui/material/IconButton';
import { useDispatch, useSelector } from 'react-redux';
import { selectFuseCurrentSettings, setDefaultSettings } from 'app/store/fuse/settingsSlice';
import _ from '@lodash';
import useThemeMediaQuery from '@fuse/hooks/useThemeMediaQuery';
import { navbarToggle, navbarToggleMobile } from 'app/store/fuse/navbarSlice';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';

function NavbarToggleButton(props) {
  const dispatch = useDispatch();
  const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));
  const settings = useSelector(selectFuseCurrentSettings);
  const { config } = settings.layout;

  return (
    <IconButton
      className={props.className}
      id="toggle_btn"
      color="inherit"
      size="small"
      onClick={(ev) => {
        document.body.classList.toggle('toggle_menu');
        if (isMobile) {
          dispatch(navbarToggleMobile());
        } else if (config.navbar.style === 'style-2') {
          dispatch(
            setDefaultSettings(
              _.set({}, 'layout.config.navbar.folded', !settings.layout.config.navbar.folded)
            )
          );
        } else {
          dispatch(navbarToggle());
        }
      }}
    >
      {/* {props.children} */}
      <svg width="18" height="14" viewBox="0 0 18 14" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fill="#fff" d="M17.8125 7C17.8125 7.14918 17.7532 7.29226 17.6477 7.39775C17.5423 7.50324 17.3992 7.5625 17.25 7.5625H0.75C0.600816 7.5625 0.457742 7.50324 0.352252 7.39775C0.246763 7.29226 0.1875 7.14918 0.1875 7C0.1875 6.85082 0.246763 6.70774 0.352252 6.60225C0.457742 6.49676 0.600816 6.4375 0.75 6.4375H17.25C17.3992 6.4375 17.5423 6.49676 17.6477 6.60225C17.7532 6.70774 17.8125 6.85082 17.8125 7ZM0.75 1.5625H17.25C17.3992 1.5625 17.5423 1.50324 17.6477 1.39775C17.7532 1.29226 17.8125 1.14918 17.8125 1C17.8125 0.850816 17.7532 0.707742 17.6477 0.602252C17.5423 0.496763 17.3992 0.4375 17.25 0.4375H0.75C0.600816 0.4375 0.457742 0.496763 0.352252 0.602252C0.246763 0.707742 0.1875 0.850816 0.1875 1C0.1875 1.14918 0.246763 1.29226 0.352252 1.39775C0.457742 1.50324 0.600816 1.5625 0.75 1.5625ZM17.25 12.4375H0.75C0.600816 12.4375 0.457742 12.4968 0.352252 12.6023C0.246763 12.7077 0.1875 12.8508 0.1875 13C0.1875 13.1492 0.246763 13.2923 0.352252 13.3977C0.457742 13.5032 0.600816 13.5625 0.75 13.5625H17.25C17.3992 13.5625 17.5423 13.5032 17.6477 13.3977C17.7532 13.2923 17.8125 13.1492 17.8125 13C17.8125 12.8508 17.7532 12.7077 17.6477 12.6023C17.5423 12.4968 17.3992 12.4375 17.25 12.4375Z" />
      </svg>
    </IconButton>
  );
}

NavbarToggleButton.defaultProps = {
  children: (
    <FuseSvgIcon size={20} color="action">
      heroicons-outline:view-list
    </FuseSvgIcon>
  ),
};

export default NavbarToggleButton;
