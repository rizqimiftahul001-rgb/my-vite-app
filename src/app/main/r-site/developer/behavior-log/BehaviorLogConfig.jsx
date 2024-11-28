/** @format */

import { lazy } from 'react';

const BehaviorLogApp = lazy(() => import('./BehaviorLogApp'));

const BehaviorLogConfig= {
	settings: {
		layout: {
			config: {},
		},
	},
	routes: [
		{
			path: '/behaviorlog',
			element: <BehaviorLogApp/>,
		},
	],
};

export default BehaviorLogConfig;
