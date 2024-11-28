/** @format */

import React from 'react';
import FusePageSimple from '@fuse/core/FusePageSimple';
import NativeApiHeader from './nativeApiHeader';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { locale } from '../../../../configs/navigation-i18n';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import SwaggerUI from 'swagger-ui-react';
import { makeStyles } from '@mui/styles';
import description from './description.json';
import description_ko from './description_ko.json';
import FuseLoading from '@fuse/core/FuseLoading/FuseLoading';
import 'swagger-ui-react/swagger-ui.css';
import './native.css';

const useStyles = makeStyles((theme) => ({
	root: {
		padding: theme.spacing(3),
		margin: 'auto',
		maxWidth: 600,
	},
	title: {
		marginBottom: theme.spacing(2),
	},
	divider: {
		margin: theme.spacing(2, 0),
	},
}));

function NativeApiApp() {
	const [translation, setTranslation] = useState(description);

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

	const classes = useStyles();

	const [selectLocale] = useSelector((state) => [state.locale.selectLocale]);
	const [selectedLang, setSelectedLang] = useState(locale.en);
	const [load, setLoad] = useState(true);
	useEffect(() => {
		if (selectLocale == 'ko') {
			setSelectedLang(locale.ko);
			setTranslation(description_ko);
		} else {
			setSelectedLang(locale.en);
			setTranslation(description);
		}
		setLoad(true);
	}, [selectLocale]);
	useEffect(() => {
		setLoad(false);
	}, [translation]);


	useEffect(() => {

	const serverName = process.env.REACT_APP_SERVER_NAME;
	const serverDescription = process.env.REACT_APP_SERVER_DESCRIPTION;

    const updatedSwaggerDoc = { ...description };
    if (updatedSwaggerDoc.servers && updatedSwaggerDoc.servers.length > 0) {
      updatedSwaggerDoc.servers[0].url = serverName;
	  updatedSwaggerDoc.servers[0].description = serverDescription;
    } else {
      updatedSwaggerDoc.servers = [{ url: serverName,description:serverDescription }];
    }

    setTranslation(updatedSwaggerDoc);
  }, []);

	const [age, setAge] = React.useState('');

	const handleChange = (event) => {
		setAge(event.target.value);
	};
	const [selectedValue, setSelectedValue] = useState('provider1');
	const apiEndpoints = [
		{
			title: `${selectedLang.Agent_Information_Query_API_api_users}`,
			description: `${selectedLang.Get_list_of_all_users}`,
			example: 'curl -X GET http://api.example.com/api/users',
		},
		{
			title: `${selectedLang.POST_api_users}`,
			description: `${selectedLang.Createanewuser}`,
			example:
				'curl -X POST -H "Content-Type: application/json" -d \'{"name":"John Doe"}\' http://api.example.com/api/users',
		},
		// Add more API endpoints as needed
	];
	return (
		<>
			{load ? (
				<FuseLoading />
			) : (
				<FusePageSimple
					header={<NativeApiHeader selectedLang={selectedLang} />}
					content={
						<>
							<Card
								sx={{ width: '100%', marginTop: '20px', borderRadius: '4px' }}
								className='main_card'>
								<div className='flex justify-between items-center bg-gray p-16 w-100'>
									<span className='list-title'>{selectedLang.API_GUIDE}</span>
									{/* <div className='flex item-center'>
										<FormControl sx={{ m: 1, minWidth: 220 }} size="small">
											<InputLabel id="demo-select-small">Providers</InputLabel>
											<Select
												labelId="demo-select-small"
												id="demo-select-small"
												value={age}
												label="SELECT PROVIDER"
												onChange={handleChange}
											>
												<MenuItem value={10}>Provider 1</MenuItem>
												<MenuItem value={20}>Provider 2</MenuItem>
											</Select>
										</FormControl>
									</div> */}
								</div>

								<div>
									<CardContent>
										<div className='containerr'>
											<SwaggerUI
												spec={translation}
												plugins={DisableTryItOutPlugin}
											/>
										</div>
										{/* <div className="containerr">
											<SwaggerUI spec={nativeApi} />
										</div>
										<Accordion key={1}>
											<AccordionSummary expandIcon={<ExpandMoreIcon />}>
												<Typography sx={{ fontSize: "18px", fontWeight: "600" }}>Agent</Typography>
											</AccordionSummary>
											<AccordionDetails>
												<div>
													<SwaggerUI spec={agentAPI} />
												</div>
											</AccordionDetails>
										</Accordion>
										<Accordion key={2}>
											<AccordionSummary expandIcon={<ExpandMoreIcon />}>
												<Typography sx={{ fontSize: "18px", fontWeight: "600" }}>User</Typography>
											</AccordionSummary>
											<AccordionDetails>
												<div>
													<SwaggerUI spec={userAPI} />
												</div>
											</AccordionDetails>
										</Accordion>
										<Accordion key={3}>
											<AccordionSummary expandIcon={<ExpandMoreIcon />}>
												<Typography sx={{ fontSize: "18px", fontWeight: "600" }}>
													Game information inquiry
												</Typography>
											</AccordionSummary>
											<AccordionDetails>
												<div>
													<SwaggerUI spec={gameInforAPI} />
												</div>
											</AccordionDetails>
										</Accordion>
										<Accordion key={4}>
											<AccordionSummary expandIcon={<ExpandMoreIcon />}>
												<Typography sx={{ fontSize: "18px", fontWeight: "600" }}>Game Access API</Typography>
											</AccordionSummary>
											<AccordionDetails>
												<div>
													<SwaggerUI spec={gameAccessAPI} />
												</div>
											</AccordionDetails>
										</Accordion>
										<Accordion key={4}>
											<AccordionSummary expandIcon={<ExpandMoreIcon />}>
												<Typography sx={{ fontSize: "18px", fontWeight: "600" }}>Money Conversion API</Typography>
											</AccordionSummary>
											<AccordionDetails>
												<div>
													<SwaggerUI spec={moneyConverAPI} />
												</div>
											</AccordionDetails>
										</Accordion>
										<Accordion key={5}>
											<AccordionSummary expandIcon={<ExpandMoreIcon />}>
												<Typography sx={{ fontSize: "18px", fontWeight: "600" }}>Transaction</Typography>
											</AccordionSummary>
											<AccordionDetails>
												<div>
													<SwaggerUI spec={transactionAPI} />
												</div>
											</AccordionDetails>
										</Accordion> */}
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

export default NativeApiApp;
