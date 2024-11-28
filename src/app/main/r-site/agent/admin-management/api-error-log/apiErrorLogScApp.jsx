/** @format */

import React from 'react';
import FusePageSimple from '@fuse/core/FusePageSimple';
import ApiErrorLogHeader from './apiErrorLogHeader';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { locale } from '../../../../../configs/navigation-i18n';
import { Button, InputBase } from '@mui/material';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import APIService from 'src/app/services/APIService';
import DataHandler from 'src/app/handlers/DataHandler';
import FuseLoading from '@fuse/core/FuseLoading/FuseLoading';
import { styled } from '@mui/material/styles';
import InfoIcon from '@mui/icons-material/Info';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import moment from 'moment';
import queryString from 'query-string';
import { showMessage } from 'app/store/fuse/messageSlice';

const style = {
	position: 'absolute',
	top: '50%',
	left: '50%',
	transform: 'translate(-50%, -50%)',
	width: 400,
	bgcolor: 'background.paper',
	border: '2px solid #000',
	boxShadow: 24,
	p: 4,
};

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
	'&:last-child TableCell, &:last-child th': {
		border: 0,
	},
}));

function apiErrorLogAppSC() {
	const dispatch = useDispatch();
	const [selectLocale] = useSelector((state) => [state.locale.selectLocale]);
	const [selectedLang, setSelectedLang] = useState(locale.ko);
	useEffect(() => {
		if (selectLocale == 'ko') {
			setSelectedLang(locale.ko);
		} else {
			setSelectedLang(locale.en);
		}
	}, [selectLocale]);

	const [page, setPage] = React.useState(0);
	const [rowsPerPage, setRowsPerPage] = React.useState(20);

	const handleChangePage = (event, newPage) => {
		setPage(newPage);
	};

	const handleChangeRowsPerPage = (event) => {
		setRowsPerPage(parseInt(event.target.value, 10));
	};

	const [loggers, setLoggers] = useState([]);
	const [totalCount, setTotalCount] = useState(0);

	const [error_unique_code, _error_unique_code] = useState('');
	const [agent_name, setAgent_name] = useState('');

	const { search } = window.location;
	const { agent_id } = queryString.parse(search);

	const [loaded, setLoaded] = useState(false);
	const [loading1, setLoading1] = useState(false);
	// useEffect(() => {
	//   if (loading1 == false) {
	//     setLoaded(false);
	//   }
	// }, [loading1]);

	// const [loading,setLoading] = useState()

	const getLoggers = (_agent_name) => {
		setLoading1(true);
		APIService({
			url: `${
				process.env.REACT_APP_R_SITE_API
			}/user/api-error-logs-scr?unique_request_id=${_agent_name}&pageNumber=${
				page + 1
			}&limit=${rowsPerPage}`,
			method: 'GET',
		})
			.then((res) => {
				setLoggers(res?.data.data);
				setTotalCount(res?.data?.totalCount);
			})
			.catch((err) => {})
			.finally(() => {
				setLoading1(false);
			});
	};

	useEffect(() => {
		getLoggers(agent_name);
	}, [page, rowsPerPage]);

	const columns = [
		{
			id: 'Error Id',
			label: `${selectedLang.Error_ID}`,
			minWidth: 50,
		},
		{
			id: 'unique_request_id',
			label: `${selectedLang.Unique_Request_ID}`,
			minWidth: 50,
		},
		{ id: 'entity', label: `${selectedLang.entity}`, minWidth: 50 },
		{
			id: 'operatorPlUid',
			label: `${selectedLang.Operator_player_user_ID}`,
			minWidth: 50,
		},
		{ id: 'gameTitle', label: `${selectedLang.game_title}`, minWidth: 50 },
		{ id: 'msgCl', label: ``, minWidth: 1 },
		{
			id: 'errorMsgs',
			label: `${selectedLang.error_message}`,
			minWidth: 50,
		},
		{ id: 'info', label: <InfoIcon style={{ width: '15' }} />, minWidth: 50 },
		{ id: 'rid', label: `${selectedLang.round_ID}`, minWidth: 50 },
		{ id: 'tspaS', label: `${selectedLang.timestamp}`, minWidth: 50 },
	];

	const [open, setOpen] = React.useState(false);
	const handleOpen = () => setOpen(true);
	const handleClose = () => setOpen(false);

	const clearFilterRecallAPi = () => {
		_error_unique_code('');
		setAgent_name('');
		getLoggers('');
	};

	function dateFormat(date) {
		var d = new Date(date);
		var date = d.getDate();
		var month = d.getMonth() + 1; // Since getMonth() returns month from 0-11 not 1-12
		var year = d.getFullYear();
		var newDate = year + '-' + month + '-' + date;
		return newDate;
	}

	const getDate = (inputString) => {
		// Use a regular expression to match the desired date and time pattern
		const datePattern = /\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}/;

		// Use the exec method to find the first match in the string
		const match = datePattern.exec(inputString);

		// Check if a match was found and display it
		if (match) {
			const dateTime = match[0];
			const formattedTimeDifference = moment(dateTime).fromNow(true);
			return `${dateTime}`;
		} else {
			console.log('No date and time found in the string.');
		}
	};

	const renderPaymentWithdrawal = () => {
		if (loggers.length <= 0) {
			return;
		} else {
			return (
				<TableBody>
					{loggers
						//.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
						.map((payment, index) => {
							let displayString = moment(payment?.created_at).format(
								'YYYY/MM/DD HH:mm:ss'
							);
							return (
								<>
									<StyledTableRow
										hover
										role='checkbox'
										tabIndex={-1}
										key={index}>
										<TableCell
											sx={{
												textAlign: 'center',
											}}>
											{payment?.id}
										</TableCell>
										<TableCell
											sx={{
												textAlign: 'center',
											}}>
											{payment.unique_re_id}
										</TableCell>
										<TableCell
											sx={{
												textAlign: 'center',
											}}>
											{payment.entity}
										</TableCell>
										<TableCell
											sx={{
												textAlign: 'center',
											}}>
											{payment.ope_pl_user_id}
										</TableCell>
										<TableCell
											sx={{
												textAlign: 'center',
											}}>
											{payment.game_title}
										</TableCell>
										<TableCell
											className='p-0 pl-1'
											sx={{
												backgroundColor: 'red',
												paddingLeft: '8px',
												padding: '0',
											}}></TableCell>
										<TableCell
											sx={{
												textAlign: 'center',
											}}>
											{payment.error_message}
										</TableCell>
										<TableCell
											sx={{
												textAlign: 'center',
											}}>
											<InfoIcon style={{ width: '15' }} />
										</TableCell>
										<TableCell
											sx={{
												textAlign: 'center',
											}}>
											{payment.round_id}
										</TableCell>
										<TableCell
										//onClick={handleOpen}
										>
											{getDate(payment?.timestamps)}
										</TableCell>
									</StyledTableRow>
								</>
							);
						})}
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
					header={<ApiErrorLogHeader selectedLang={selectedLang} />}
					content={
						<>
							<Card
								sx={{ width: '100%', marginTop: '20px', borderRadius: '4px' }} className='main_card'>
								<div className='col-lg-8 col-md-4 col-sm-4 flex flex-wrap justify-end'>
									<InputBase
										className='inputwifth'
										sx={{
											ml: 1,
											flex: 1,
											border: '1px solid #ededed',
											borderRadius: '4px',
											marginLeft: '0',
											marginRight: '10px',
											padding: '4px',
										}}
										placeholder={selectedLang.enter_unique_request_Id}
										// value={agentFilterValue}
										onChange={(e) => setAgent_name(e.target.value)}
										value={agent_name}
										inputProps={{ 'aria-label': 'Agent Name' }}
									/>
									<div className='col-lg-2 col-md-4 col-sm-4 pr-10 flex item-center'>
										<Button
											className='flex item-center'
											variant='contained'
											color='success'
											// endIcon={<SearchIcon size={20}></SearchIcon>}
											sx={{
												borderRadius: '4px',
											}}
											onClick={() => {
												setPage(0), getLoggers(agent_name);
											}}>
											{selectedLang.Apply_Filter}
											{/* {selectedLang.search} */}
										</Button>
									</div>
									<div className='col-lg-2 col-md-4 col-sm-4 flex item-center'>
										<Button
											className='flex item-center'
											variant='contained'
											color='secondary'
											// endIcon={<SearchIcon size={20}></SearchIcon>}
											sx={{
												borderRadius: '4px',
											}}
											onClick={() => {
												clearFilterRecallAPi();
											}}>
											{selectedLang.Clear_Filter}
											{/* {selectedLang.search} */}
										</Button>
									</div>
								</div>
								<div>
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
													{renderPaymentWithdrawal()}
												</Table>
												{loading1 && <FuseLoading />}
											</TableContainer>
											<TablePagination
												rowsPerPageOptions={[20, 50, 100, 200, 500]}
												component='div'
												count={totalCount ? totalCount : 0}
												rowsPerPage={rowsPerPage}
												page={page}
												onPageChange={handleChangePage}
												onRowsPerPageChange={handleChangeRowsPerPage}
												labelRowsPerPage={selectedLang.rows_per_page}
											/>
											{/* <TablePagination
														rowsPerPageOptions={[1, 10, 25, 100]}
														component='div'
														count={agentList_table_count}
														rowsPerPage={rowsPerPage}
														page={page}
														labelRowsPerPage={selectedLang.rows_per_page}
														onPageChange={handleChangePage}
														onRowsPerPageChange={handleChangeRowsPerPage}
													/> */}
										</Paper>
									</CardContent>
								</div>
							</Card>

							<Modal
								open={open}
								onClose={handleClose}
								aria-labelledby='modal-modal-title'
								aria-describedby='modal-modal-description'>
								<Box sx={style}>
									<Typography
										id='modal-modal-title'
										variant='h6'
										component='h2'></Typography>
									<Typography id='modal-modal-description' sx={{ mt: 2 }}>
										url:http://localhost:8000/api/game/get-eupriover_callbackapi_log
									</Typography>
								</Box>
							</Modal>
						</>
					}
				/>
			)}
		</>
	);
}

export default apiErrorLogAppSC;
