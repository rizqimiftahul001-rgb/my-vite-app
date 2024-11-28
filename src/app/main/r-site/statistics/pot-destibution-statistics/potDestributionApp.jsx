/** @format */

import React from 'react';
import FusePageSimple from '@fuse/core/FusePageSimple';
import PotDestributionHeader from './potDestributionHeader';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { locale } from '../../../../configs/navigation-i18n';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { Button, CardActionArea, CardActions, InputBase } from '@mui/material';
import './potDestribution.css';
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
import DataHandler from 'src/app/handlers/DataHandler';
import jwtDecode from 'jwt-decode';
import APIService from 'src/app/services/APIService';
import FuseLoading from '@fuse/core/FuseLoading/FuseLoading';
import { formatDate } from 'src/app/services/Utility';
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

function potDestributionApp() {
	const todayDate = new Date();
	todayDate.setDate(todayDate.getDate() + 1);
	todayDate.setHours(23, 59, 59, 999);
	todayDate.setDate(1);
	const user_id = DataHandler.getFromSession('user_id');
	const role = jwtDecode(DataHandler.getFromSession('accessToken'))['data'];
	const [agentName, setAgentName] = useState([]);
	const [agentPotDetails, setAgentPotDetails] = useState([]);
	var date = new Date();
	var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
	var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
	const [selectedprovider] = useSelector((state) => [
		state.provider.selectedprovider,
	]);
	const [monthFirstDay, setMonthFirstDay] = useState(firstDay);
	const [monthLastDay, setMonthLastDay] = useState(lastDay);
	const [lastSixMonth, setLastSixMonth] = useState([]);
	const [startDate, setStartDate] = useState(todayDate.toISOString());

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

	useEffect(() => {
		getLastSixMonths();
	}, []);

	const getLastSixMonths = () => {
		const lastSixMonths = [];
		const now = new Date();
		now.setDate(1);
		for (let i = 0; i < 7; i++) {
			lastSixMonths.unshift(now.toISOString());
			now.setMonth(now.getMonth() - 1);
		}
		setLastSixMonth(lastSixMonths);
	};

	function dateFormat(date) {
		var d = new Date(date);
		var date = d.getDate();
		var month = d.getMonth() + 1;
		var year = d.getFullYear();
		var newDate = month + '-' + year;
		return newDate;
	}

	const [page, setPage] = React.useState(0);
	const [rowsPerPage, setRowsPerPage] = React.useState(10);

	const handleChangePage = (event, newPage) => {
		setPage(newPage);
	};

	const handleChangeRowsPerPage = (event) => {
		setRowsPerPage(+event.target.value);
		setPage(0);
	};

	useEffect(() => {
		//getAgentName();
		getStatData();
	}, [selectedprovider]);

	const columns = [
		{ id: 'data', label: `${selectedLang.data}`, minWidth: 50 },
		{ id: 'reci', label: `${selectedLang.pot_total_recived}`, minWidth: 50 },
		{
			id: 'distri',
			label: `${selectedLang.total_pot_distribution}`,
			minWidth: 50,
		},
	];

	// const getAgentName = () => {
	//   APIService({
	//     url: `${process.env.REACT_APP_R_SITE_API}/user/agent-name-list?user_id=${user_id}&provider=${selectedprovider}`,
	//     method: "GET",
	//   })
	//     .then((res) => {
	//       setAgentName(res.data.data.UserDataResult.subAgentUsers);
	//     })
	//     .catch((err) => {
	//       console.log(err);
	//       setAgentName([]);
	//     })
	//     .finally(() => {});
	// };

	const getStatData = (date) => {
		APIService({
			url: `${
				process.env.REACT_APP_R_SITE_API
			}/revenue/pot-destribution-statistics?user_id=${user_id}&start_date=${
				date ? date : startDate
			}`,
			method: 'GET',
		})
			.then((res) => {
				setAgentPotDetails(res.data.data.my_result);
			})
			.catch((err) => {})
			.finally(() => {
				setLoading1(false);
			});
	};

	const clickDate = (month) => {
		setAgentPotDetails([]);
		getStatData(month);
	};

	const getLastMonthData = (e) => {
		e.preventDefault();
		const date = new Date();
		var firstDay = new Date(date.getFullYear(), date.getMonth() - 1, 1);
		var lastDay = new Date(date.getFullYear(), date.getMonth(), 0);

		setMonthFirstDay(firstDay);
		setMonthLastDay(lastDay);

		// getAgentData(firstDay,lastDay);
	};

	const getThisMonthData = (e) => {
		e.preventDefault();
		var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
		var currentDay = new Date(
			date.getFullYear(),
			date.getMonth() + 1,
			date.getDate()
		);
		setMonthFirstDay(firstDay);
		setMonthLastDay(currentDay);

		// getAgentData(firstDay,lastDay);
	};
	useEffect(() => {
		const _sumArray = {};
		// Loop through each object in the array
		agentPotDetails.forEach((obj) => {
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
	}, [agentPotDetails]);
	const createSumRow = () => {
		return (
			<StyledTableRow className='total-row' hover role='checkbox' tabIndex={-1}>
				<TableCell
					sx={{
						textAlign: 'center',
					}}>
					{selectedLang.total}
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
					{Number(sumArray?.r_point_distri || 0)?.toLocaleString()}
				</TableCell>
			</StyledTableRow>
		);
	};

	const displayData = () => {
		if (agentPotDetails.length > 0) {
			return (
				<TableBody>
					{createSumRow()}
					{agentPotDetails.map((agent, index) => (
						<StyledTableRow hover role='checkbox' tabIndex={-1} key={index}>
							<TableCell
								sx={{
									textAlign: 'center',
								}}>
								{/* {formatDate(agent.Date)} */}
								{agent.date}
							</TableCell>
							<TableCell
								sx={{
									textAlign: 'center',
								}}>
								{Number(agent.r_point || 0)?.toLocaleString()}
							</TableCell>
							<TableCell
								sx={{
									textAlign: 'center',
								}}>
								{Number(agent.r_point_distri || 0)?.toLocaleString()}
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
					header={<PotDestributionHeader selectedLang={selectedLang} />}
					content={
						<>
							<Card
								sx={{ width: '100%', marginTop: '20px', borderRadius: '4px' }}
								className='main_card'>
								<div className='flex justify-start justify-items-center bg-gray p-10 list_title w-100'>
									<span className='list-title'>
										{selectedLang.POTDESTRIBUTION} 2023{' '}
										{/* {selectedLang.distribution_statistics} */}
									</span>
								</div>
								<div>
									<div
										className='row flex justify-end justify-items-center'
										style={{ flexWrap: 'wrap' }}>
										<div
											className='flex item-center'
											style={{ flexWrap: 'wrap' }}>
											<InputBase
												sx={{
													ml: 1,
													flex: 1,
													border: '1px solid #cdcfd3',
													borderRadius: '4px',
													padding: '4px 10px',
													marginRight: '10px',
													marginLeft: '0',
												}}
												// value={filterUser}
												// onChange={(e) => _filterUser(e.target.value)}
												placeholder={selectedLang.agent_id}
												inputProps={{
													'aria-label': `${selectedLang.USER}`,
												}}
											/>
										</div>
										<div
											className='flex item-center'
											style={{ padding: '18px', paddingLeft: '0' }}>
											<Button
												className='flex item-center'
												variant='contained'
												color='secondary'
												endIcon={<SearchIcon size={20}></SearchIcon>}
												sx={{
													borderRadius: '4px',
												}}
												// onClick={getAgentName}
											>
												{selectedLang.search}
											</Button>
										</div>
									</div>
									<CardContent className='cardcontent'>
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
															{columns.map((column) => (
																<StyledTableCell
																	sx={{
																		textAlign: 'center',
																	}}
																	key={column.id}
																	align={column.align}
																	style={{ minWidth: column.minWidth }}>
																	{column.label}
																</StyledTableCell>
															))}
														</TableRow>
													</TableHead>
													{displayData()}
												</Table>
												{agentPotDetails.length <= 0 && <FuseLoading />}
											</TableContainer>
											{/* <TablePagination
                    rowsPerPageOptions={[10, 25, 100]}
                    component="div"
                    count={0}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                  /> */}
										</Paper>
									</CardContent>
									<div className='flex justify-center items-center mt-3 mb-5'>
										{lastSixMonth.map((month, index) => (
											<Button
												key={index}
												className='flex item-center ml-4'
												variant='contained'
												color='secondary'
												sx={{
													borderRadius: '4px',
												}}
												onClick={(e) => {
													clickDate(month);
												}}>
												{dateFormat(month)}
											</Button>
										))}
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

export default potDestributionApp;
