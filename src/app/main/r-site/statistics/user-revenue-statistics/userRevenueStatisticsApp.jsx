/** @format */

import React from 'react';
import FusePageSimple from '@fuse/core/FusePageSimple';
import UserRevenueStatisticsHeader from './userRevenueStatisticsHeader';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { locale } from '../../../../configs/navigation-i18n';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { Button, CardActionArea, CardActions } from '@mui/material';
import './userRevenueStatistics.css';
import Chip from '@mui/material/Chip';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import { styled } from '@mui/material/styles';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import InputBase from '@mui/material/InputBase';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import jwtDecode from 'jwt-decode';
import DataHandler from 'src/app/handlers/DataHandler';
import FuseLoading from '@fuse/core/FuseLoading/FuseLoading';
import APIService from 'src/app/services/APIService';
import SearchIcon from '@mui/icons-material/Search';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
	[`&.${tableCellClasses.head}`]: {
		backgroundColor: theme.palette.common.black,
		color: theme.palette.common.white,
	},
	[`&.${tableCellClasses.body}`]: {
		fontSize: 14,
	},
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
	'&:nth-of-type(odd)': {
		backgroundColor: theme.palette.action.hover,
	},
	// hide last border
	'&:last-child td, &:last-child th': {
		border: 0,
	},
}));

function UserRevenueStatisticsApp() {
	const [selectedprovider] = useSelector((state) => [
		state.provider.selectedprovider,
	]);
	const [agentData, setAgentData] = useState([]);
	const user_id = DataHandler.getFromSession('user_id');
	const [month, setMonth] = useState('');
	const role = jwtDecode(DataHandler.getFromSession('accessToken'))['data'];

	var date = new Date();
	var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
	var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
	const [monthFirstDay, setMonthFirstDay] = useState(firstDay);
	const [monthLastDay, setMonthLastDay] = useState(lastDay);

	const [selectLocale] = useSelector((state) => [state.locale.selectLocale]);
	const [selectedLang, setSelectedLang] = useState(locale.en);
	const [loaded, setLoaded] = useState(true);
	const [loading1, setLoading1] = useState(true);
	const [sumArray, setSumArray] = useState();

	useEffect(() => {
		if (loading1 == false) {
			setLoaded(false);
		}
	}, [loading1]);
	useEffect(() => {
		if (selectLocale == 'ko') {
			setSelectedLang(locale.ko);
		} else {
			setSelectedLang(locale.en);
		}
	}, [selectLocale]);

	const currentDate = new Date();
	const currentMonth = currentDate.toLocaleString('default', { month: 'long' });
	const previousMonthDate = new Date(currentDate);
	previousMonthDate.setMonth(currentDate.getMonth() - 1);
	const previousMonthName = previousMonthDate.toLocaleString('default', {
		month: 'long',
	});

	const [page, setPage] = React.useState(0);
	const [rowsPerPage, setRowsPerPage] = React.useState(10);

	const handleChangePage = (event, newPage) => {
		setPage(newPage);
	};

	const handleChangeRowsPerPage = (event) => {
		setRowsPerPage(+event.target.value);
		setPage(0);
	};

	const [age, setAge] = React.useState('');

	const handleChange = (event) => {
		setAge(event.target.value);
	};

	useEffect(() => {
		getAgentData();
	}, [selectedprovider]);

	const getThisMonthData = (e) => {
		setAgentData([]);
		e.preventDefault();
		var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
		var currentDay = new Date(
			date.getFullYear(),
			date.getMonth() + 1,
			date.getDate()
		);
		setMonthFirstDay(firstDay);
		setMonthLastDay(currentDay);

		getAgentData(firstDay, lastDay);
	};

	const getLastMonthData = (e) => {
		setAgentData([]);
		e.preventDefault();
		const date = new Date();
		var firstDay = new Date(date.getFullYear(), date.getMonth() - 1, 1);
		var lastDay = new Date(date.getFullYear(), date.getMonth(), 0);

		setMonthFirstDay(firstDay);
		setMonthLastDay(lastDay);

		getAgentData(firstDay, lastDay);
	};

	const columns = [
		{ id: 'no', label: `${selectedLang.number}`, minWidth: 50 },
		{ id: 'bet', label: `${selectedLang.agent_name}`, minWidth: 50 },
		{
			id: 'request_amount',
			label: `${selectedLang.REQUESTRPOINT}`,
			minWidth: 50,
		},
		{ id: 'accept', label: `${selectedLang.approved}`, minWidth: 50 },
		{ id: 'reject', label: `${selectedLang.not_approved}`, minWidth: 50 },
		{ id: 'pending', label: `${selectedLang.pending}`, minWidth: 50 },
	];

	const [filterAgent, setFilterAgent] = useState('');

	const getAgentData = (firstDay, lastDay) => {
		APIService({
			url: `${
				process.env.REACT_APP_R_SITE_API
			}/revenue/agent-recharge?user_id=${user_id}&provider_id=${selectedprovider}&}&start_date=${
				firstDay ? firstDay : monthFirstDay
			}&end_date=${lastDay ? lastDay : monthLastDay}&agent=${filterAgent}`,
			method: 'GET',
		})
			.then((res) => {
				setAgentData(res.data.data.result);
				setMonth(res.data.data.month);
			})
			.catch((err) => {})
			.finally(() => {
				setLoading1(false);
			});
	};
	useEffect(() => {
		let _agentData = agentData;
		const _sumArray = {};
		// Loop through each object in the array
		_agentData.forEach((obj) => {
			// Loop through each field in the object
			for (const field in obj) {
				const fieldValue = parseFloat(obj[field]);
				// If the field doesn't exist in the sumArray, initialize it with the current value
				if (!_sumArray[field]) {
					_sumArray[field] = fieldValue;
				} else {
					// If the field already exists in the sumArray, add the current value to it
					_sumArray[field] += fieldValue;
				}
			}
		});

		setSumArray(_sumArray);
	}, [agentData]);
	const createSumRow = () => {
		return (
			<StyledTableRow className='total-row' hover role='checkbox' tabIndex={-1}>
				<TableCell
					sx={{
						textAlign: 'center',
					}}>
					Total
				</TableCell>
				<TableCell
					sx={{
						textAlign: 'center',
					}}>
					{''}
				</TableCell>
				<TableCell
					sx={{
						textAlign: 'center',
					}}>
					{Number(sumArray?.r_point || 0)?.toLocaleString()}
				</TableCell>
				<TableCell
					sx={{
						textAlign: 'center',
					}}>
					{sumArray?.appruve}
				</TableCell>
				<TableCell
					sx={{
						textAlign: 'center',
					}}>
					{sumArray?.not_appruve}
				</TableCell>
				<TableCell
					sx={{
						textAlign: 'center',
					}}>
					{sumArray?.pending}
				</TableCell>
			</StyledTableRow>
		);
	};

	const displayData = () => {
		if (agentData.length > 0) {
			return (
				<TableBody>
					{createSumRow()}
					{agentData
						.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
						.map((agent, key) => (
							<StyledTableRow hover role='checkbox' tabIndex={-1} key={key}>
								<TableCell
									sx={{
										textAlign: 'center',
									}}>
									{page * rowsPerPage + key + 1}
								</TableCell>
								<TableCell
									sx={{
										textAlign: 'center',
									}}>
									{agent.agent}
								</TableCell>
								<TableCell
									sx={{
										textAlign: 'center',
									}}>
									{Number(agent.r_point)?.toLocaleString()}
								</TableCell>
								<TableCell
									sx={{
										textAlign: 'center',
									}}>
									{agent.appruve}
								</TableCell>
								<TableCell
									sx={{
										textAlign: 'center',
									}}>
									{agent.not_appruve}
								</TableCell>
								<TableCell
									sx={{
										textAlign: 'center',
									}}>
									{agent.pending}
								</TableCell>
							</StyledTableRow>
						))}
				</TableBody>
			);
		}
	};

	return (
		<>
			{' '}
			{loaded ? (
				<FuseLoading />
			) : (
				<FusePageSimple
					header={<UserRevenueStatisticsHeader selectedLang={selectedLang} />}
					content={
						<>
							<Card
								sx={{ width: '100%', marginTop: '20px', borderRadius: '4px' }}
								className='main_card'>
								<div className='flex justify-start justify-items-center bg-gray p-10 list_title w-100'>
									<span className='list-title'>
										{selectedLang.AGENTRECHARGESTAT} {selectedLang[month]}{' '}
										{date.getFullYear()}{' '}
										{/* {selectedLang.distribution_statistics} */}
									</span>
								</div>

								{/* <div className="row flex justify-end justify-items-center">
              <div className="col-lg-2 col-md-4 col-sm-4 p-10">
                <FormControl sx={{ m: 1, minWidth: 220 }} size="small">
                  <InputLabel id="demo-select-small">
                    {selectedLang.select_agent}
                  </InputLabel>
                  <Select
                    labelId="demo-select-small"
                    id="demo-select-small"
                    value={age}
                    label="Select Agent"
                    onChange={handleChange}>
                    <MenuItem value={10}>agent1</MenuItem>
                    <MenuItem value={20}>agent2</MenuItem>
                    <MenuItem value={30}>agent3</MenuItem>
                  </Select>
                </FormControl>
              </div>
            </div> */}

								<div>
									<div className='row flex justify-end justify-items-center'>
										<div className='col-lg-8 col-md-4 col-sm-4 flex item-center'>
											<InputBase
												sx={{
													ml: 1,
													flex: 1,
													border: '1px solid #cdcfd3',
													borderRadius: '4px',
													padding: '4px 10px',
													marginRight: '10px',
												}}
												placeholder={selectedLang.agent_name}
												value={filterAgent}
												onChange={(e) => setFilterAgent(e.target.value)}
												inputProps={{ 'aria-label': 'Agent Name' }}
											/>
										</div>
										<div className='col-lg-2 col-md-4 col-sm-4 p-10 pl-0 pr-16 flex item-center'>
											<Button
												className='flex item-center'
												variant='contained'
												color='secondary'
												endIcon={<SearchIcon size={20}></SearchIcon>}
												sx={{
													borderRadius: '4px',
												}}
												onClick={() => {
													getAgentData(firstDay, lastDay);
												}}>
												{selectedLang.search}
											</Button>
										</div>
									</div>
									<CardContent>
										<Paper
											sx={{
												width: '100%',
												overflow: 'hidden',
												borderRadius: '4px',
											}}>
											<TableContainer>
												<Table stickyHeader aria-label='customized table'>
													<TableHead>
														<TableRow>
															{columns.map((column, index) => (
																<StyledTableCell
																	sx={{
																		textAlign: 'center',
																	}}
																	key={index}
																	align={column.align}
																	style={{ minWidth: column.minWidth }}>
																	{column.label}
																</StyledTableCell>
															))}
														</TableRow>
													</TableHead>
													{displayData()}
												</Table>
												{agentData.length <= 0 && <FuseLoading />}
											</TableContainer>
											<TablePagination
												labelRowsPerPage={selectedLang.rows_per_page}
												rowsPerPageOptions={[10, 25, 100]}
												component='div'
												count={agentData?.length}
												rowsPerPage={rowsPerPage}
												page={page}
												onPageChange={handleChangePage}
												onRowsPerPageChange={handleChangeRowsPerPage}
											/>
										</Paper>
									</CardContent>
									<div className='flex justify-center items-center mt-3 mb-5'>
										{month != previousMonthName && (
											<Button
												className='flex item-center'
												variant='outlined'
												color='secondary'
												startIcon={
													<ChevronLeftIcon size={20}></ChevronLeftIcon>
												}
												sx={{
													borderRadius: '4px',
												}}
												onClick={(e) => {
													getLastMonthData(e);
												}}>
												{selectedLang.view_previous_month}
											</Button>
										)}
										{month != currentMonth && (
											<Button
												className='flex item-center ml-4'
												variant='contained'
												color='secondary'
												endIcon={
													<ChevronRightIcon size={20}></ChevronRightIcon>
												}
												sx={{
													borderRadius: '4px',
												}}
												onClick={(e) => {
													getThisMonthData(e);
												}}>
												{selectedLang.view_next_month}
											</Button>
										)}
									</div>
								</div>
							</Card>
						</>
					}
				/>
			)}
		</>
	);
}

export default UserRevenueStatisticsApp;
