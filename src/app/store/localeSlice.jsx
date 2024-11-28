/** @format */

import { createSlice } from '@reduxjs/toolkit';

//key for the local storage
const LOCAL_STORAGE_KEY = 'selectedLanguage';

const getInitialLanguage = () => {
	return localStorage.getItem(LOCAL_STORAGE_KEY) || 'ko'; // Default language 'ko'
};

export const localeSlice = createSlice({
	name: 'locale',
	initialState: {
		selectLocale: getInitialLanguage(),
	},
	reducers: {
		localeChanged: (state, action) => {
			state.selectLocale = action.payload;
			// Save in local storage
			localStorage.setItem(LOCAL_STORAGE_KEY, action.payload);
		},
	},
});

export const { localeChanged } = localeSlice.actions;
export default localeSlice.reducer;
