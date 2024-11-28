/** @format */

import { lazy } from 'react';

const GameList = lazy(() => import('./GameListApp'));

const GameListConfigs = {
	settings: {
		layout: {
			config: {},
		},
	},
	routes: [
		{
			path: '/statistics/Gamelist',
			element: <GameList />,
		},
	],
};

export default GameListConfigs;
