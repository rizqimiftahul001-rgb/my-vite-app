/** @format */

import { lazy } from 'react';


const UserBettingListApp = lazy(() => import('./UserBettingListApp'));

const UserBettingListConfigs = {
	settings: {
		layout: {
			config: {},
		},
	},
	routes: [
		{
			path: '/userBettingManagemnent',
			element: <UserBettingListApp/>,
		},
	],
};

export default UserBettingListConfigs;
