/** @format */

import React from 'react';
import FusePageSimple from '@fuse/core/FusePageSimple';
import ExtendedApiHeader from './extendedApiHeader';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState, useContext } from 'react';
import { locale } from '../../../../configs/navigation-i18n';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { Button, CardActionArea, CardActions } from '@mui/material';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import SwaggerUI from 'swagger-ui-react';
import 'swagger-ui-react/swagger-ui.css';
import extendApi from './extendApi.json';
import extendApi_Ko from './extendApi_Ko.json';
import './extended.css';
import FuseLoading from '@fuse/core/FuseLoading/FuseLoading';

function ExtendedApiApp() {
	const DisableTryItOutPlugin = function () {
		return {
			statePlugins: {
				spec: {
					wrapSelectors: {
						allowTryItOutFor: () => () => false,
					},
				},
			},
		};
	};

	const [selectLocale] = useSelector((state) => [state.locale.selectLocale]);
	const [selectedLang, setSelectedLang] = useState(locale.en);
	const [translation, setTranslation] = useState(extendApi);
	const [load, setLoad] = useState(true);
	useEffect(() => {
		if (selectLocale == 'ko') {
			setSelectedLang(locale.ko);
			setTranslation(extendApi_Ko);
		} else {
			setSelectedLang(locale.en);
			setTranslation(extendApi);
		}
		setLoad(true);
	}, [selectLocale]);
	useEffect(() => {
		setLoad(false);
	}, [translation]);

	const [age, setAge] = React.useState('');

	const handleChange = (event) => {
		setAge(event.target.value);
	};

	useEffect(() => {

		const serverName = process.env.REACT_APP_SERVER_NAME;
		const serverDescription = process.env.REACT_APP_SERVER_DESCRIPTION;
	
		const updatedSwaggerDoc = { ...extendApi };
		if (updatedSwaggerDoc.servers && updatedSwaggerDoc.servers.length > 0) {
		  updatedSwaggerDoc.servers[0].url = serverName;
		  updatedSwaggerDoc.servers[0].description = serverDescription;
		} else {
		  updatedSwaggerDoc.servers = [{ url: serverName,description:serverDescription }];
		}
	
		setTranslation(updatedSwaggerDoc);
	  }, []);

	return (
		<>
			{load ? (
				<FuseLoading />
			) : (
				<FusePageSimple
					header={<ExtendedApiHeader selectedLang={selectedLang} />}
					content={
						<>
							<Card
								sx={{ width: '100%', marginTop: '20px', borderRadius: '4px' }}
								className='main_card'>
								<div className='flex justify-between items-center bg-gray p-16 w-100'>
									<span className='list-title'>{selectedLang.API_GUIDE}</span>
								</div>

								<div>
									<CardContent>
										<div className='containerr'>
											<SwaggerUI
												spec={translation}
												plugins={DisableTryItOutPlugin}
											/>
										</div>
									</CardContent>
								</div>
							</Card>
						</>
					}
				/>
			)}
		</>
	);
}

export default ExtendedApiApp;
