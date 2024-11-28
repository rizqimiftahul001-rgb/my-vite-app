/** @format */

import { lazy } from 'react';

const GameListManagement = lazy(() => import('./GameListManagementApp'));

const GameListManagementConfigs = {
	settings: {
		layout: {
			config: {},
		},
	},
	routes: [
		{
			path: '/gamelistmanagement',
			element: <GameListManagement />,
		},
	],
};

export default GameListManagementConfigs;
