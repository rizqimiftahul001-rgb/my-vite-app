/** @format */

import { lazy } from 'react';


const DetailsHistory = lazy(() => import('./DetailsHistoryApp'));

const DetailsHistoryConfigs = {
	settings: {
		layout: {
			config: {},
		},
	},
	routes: [
		{
			path: '/details-history/:bet_transaction_id/:result_transaction_id/:casino_user/:provider_id',
			element: <DetailsHistory/>,
		},
		{
			path: '/details-history/:casino_user',
			element: <DetailsHistory />,
		},
	],
};

export default DetailsHistoryConfigs;
