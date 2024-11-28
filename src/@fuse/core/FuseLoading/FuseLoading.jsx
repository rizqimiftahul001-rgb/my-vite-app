/** @format */

import * as React from 'react';
import { useEffect, useState } from 'react';
import { useTimeout } from '@fuse/hooks';
import { useSelector } from 'react-redux';
import { locale } from '../../../../src/app/configs/navigation-i18n';
import PropTypes from 'prop-types';

function FuseLoading(props) {
	const [showLoading, setShowLoading] = useState(!props.delay);

	useTimeout(() => {
		setShowLoading(true);
	}, props.delay);

	const [selectLocale] = useSelector((state) => [state.locale.selectLocale]);
	const [selectedLang, setSelectedLang] = useState(locale.en);
	useEffect(() => {
		if (selectLocale == 'ko') {
			setSelectedLang(locale.ko);
		} else {
			setSelectedLang(locale.en);
		}
	}, [selectLocale]);

	return (
		<div className='flex flex-1 flex-col items-center justify-center data_loader_wrapper'>
			{/* <div className="data-loader">
				<div>
					<div></div>
					<div></div>
					<div></div>
					<div></div>
				</div>
			</div> */}
			<div className="loader">
				<svg>
					<defs>
						<filter id="goo">
							<feGaussianBlur in="SourceGraphic" stdDeviation="2" result="blur" />
							<feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 5 -2"
								result="gooey" />
							<feComposite in="SourceGraphic" in2="gooey" operator="atop" />
						</filter>
					</defs>
				</svg>
			</div>
		</div>
	);
}

FuseLoading.propTypes = {
	delay: PropTypes.oneOfType([PropTypes.number, PropTypes.bool]),
};

FuseLoading.defaultProps = {
	delay: false,
};

export default FuseLoading;
