/** @format */

import { lazy } from 'react';


const AggregatorManagement = lazy(() => import('./AggregatorManagementApp'));

const AggregatorManagementConfigs = {
	settings: {
		layout: {
			config: {},
		},
	},
	routes: [
		{
			path: '/aggregatormanagement',
			element: <AggregatorManagement />,
		},
	],
};

export default AggregatorManagementConfigs;
