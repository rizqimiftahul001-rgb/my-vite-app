/** @format */

import Button from '@mui/material/Button';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MenuItem from '@mui/material/MenuItem';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import {
	changeLanguage,
	selectCurrentLanguage,
	selectLanguages,
} from 'app/store/i18nSlice';

import { localeChanged } from 'app/store/localeSlice';

//key for the local storage
const LOCAL_STORAGE_KEY = 'selectedLanguage';

function LanguageSwitcher(props) {
	const currentLanguage = useSelector(selectCurrentLanguage);
	const languages = useSelector(selectLanguages);
	const [menu, setMenu] = useState(null);
	const dispatch = useDispatch();

	const langMenuClick = (event) => {
		setMenu(event.currentTarget);
	};

	const langMenuClose = () => {
		setMenu(null);
	};
	useEffect(() => {
		// Get the selected language from local storage
		const selectedLanguage = localStorage.getItem(LOCAL_STORAGE_KEY);

		if (selectedLanguage) {
			dispatch(changeLanguage(selectedLanguage));
		}
	}, []);

	function handleLanguageChange(lng) {
		// //save to storeage
		// localStorage.setItem('selectedLanguage', lng.id);

		dispatch(changeLanguage(lng.id));
		dispatch(localeChanged(lng.id));
		langMenuClose();
	}

	return (
		<>
			<Button className='language_btn' onClick={langMenuClick}>
				<img
					className=''
					src={`assets/images/flags/${currentLanguage.flag}.svg`}
					alt={currentLanguage.title}
				/>
				<span>
					<svg width="12" height="7" viewBox="0 0 12 7" fill="none" xmlns="http://www.w3.org/2000/svg">
						<path d="M5.99996 4.45449L10.6667 0L12 1.27272L5.99996 7L0 1.27272L1.33333 0L5.99996 4.45449Z" fill="#DDDDDD" />
					</svg>
				</span>
			</Button>

			<Popover
				className='lang_popover'
				open={Boolean(menu)}
				anchorEl={menu}
				onClose={langMenuClose}
				anchorOrigin={{
					vertical: 'bottom',
					horizontal: 'center',
				}}
				transformOrigin={{
					vertical: 'top',
					horizontal: 'center',
				}}
				classes={{
					paper: 'py-8',
				}}>
				{languages.map((lng) => (
					<MenuItem
						className='iconmenus'
						key={lng.id}
						onClick={() => handleLanguageChange(lng)}>
						<ListItemIcon style={{ justifyContent: 'center' }}>
							<img
								className=''
								src={`assets/images/flags/${lng.flag}.svg`}
								alt={lng.title}
							/>
						</ListItemIcon>
					</MenuItem>
				))}
			</Popover>
		</>
	);
}

export default LanguageSwitcher;
