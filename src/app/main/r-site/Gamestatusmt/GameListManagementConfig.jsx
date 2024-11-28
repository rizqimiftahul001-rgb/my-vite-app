/** @format */

import { lazy } from 'react';

const GameStatusManagement = lazy(() => import('./GameStatusMtApp'));

const GameStatusManagementConfigs = {
	settings: {
		layout: {
			config: {},
		},
	},
	routes: [
		{
			path: '/game-status-management',
			element: <GameStatusManagement />,
		},
	],
};

export default GameStatusManagementConfigs;
