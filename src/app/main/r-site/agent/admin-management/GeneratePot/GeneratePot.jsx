/** @format */

// Import React and necessary components from Material-UI
import * as React from 'react';
import FusePageSimple from '@fuse/core/FusePageSimple';
import GeneratePotHeader from './GeneratePotHeader';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import TextField from '@mui/material/TextField';
import { locale } from '../../../../../configs/navigation-i18n';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { Autocomplete, Button, Modal, Typography } from '@mui/material';
import '../adminGGRLimit.css';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
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

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { Tooltip } from '@mui/material';
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';
import APIService from 'src/app/services/APIService';
import DataHandler from 'src/app/handlers/DataHandler';
import jwtDecode from 'jwt-decode';
import FuseLoading from '@fuse/core/FuseLoading';
import { showMessage } from 'app/store/fuse/messageSlice';
import { CSVLink } from 'react-csv';
import moment from 'moment';
import { formatLocalDateTime, formatSentence } from 'src/app/services/Utility';
import cloneDeep from 'lodash/cloneDeep';
import axios from 'axios';
import { headerLoadChanged } from 'app/store/headerLoadSlice';

// StyledTableCell and StyledTableRow for custom styling
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

// Modal style
const style = {
	position: 'absolute',
	top: '50%',
	left: '50%',
	transform: 'translate(-50%, -50%)',
	maxWidth: 600,
	bgcolor: 'background.paper',
	border: '2px solid #eaecf4',
	boxShadow: 24,
	borderRadius: 4,
	p: 4,
};

// Main functional component
function GeneratePotApp() {
	// Retrieve user information from token and locale from Redux store
	const role = jwtDecode(DataHandler.getFromSession('accessToken'))['data'];
	const user_id = DataHandler.getFromSession('user_id');
	const payment_type = 'Sub Agent Deposit';
	const [selectLocale] = useSelector((state) => [state.locale.selectLocale]);
	const [selectedLang, setSelectedLang] = useState(locale.en);

	// Redux state for headerLoad
	const [headerLoad] = useSelector((state) => [state.headerLoad.headerLoad]);

	// States for component loading
	const [loaded, setLoaded] = useState(true);
	const [loading1, setLoading1] = useState(false);

	// Effect to handle loading state changes
	useEffect(() => {
		if (loading1 == false) {
			setLoaded(false);
		}
	}, [loading1]);

	// Effect to handle locale changes
	useEffect(() => {
		if (selectLocale == 'ko') {
			setSelectedLang(locale.ko);
		} else {
			setSelectedLang(locale.en);
		}
	}, [selectLocale]);

	// Redux dispatch function
	const dispatch = useDispatch();

	const AdminColumns = [
		{ id: 'name', label: `${selectedLang.number}`, minWidth: 50 },
		{ id: 'code', label: `${selectedLang.agent_name}`, minWidth: 100 },
		{
			id: 'population',
			label: `${selectedLang.receving_user_name}`,
			minWidth: 170,
		},
		{
			id: 'size',
			label: `${selectedLang.point_amount}`,
			minWidth: 170,
			format: (value) => value.toLocaleString('en-US'),
		},
		{
			id: 'density',
			label: `${selectedLang.status}`,
			minWidth: 170,
		},
		{
			id: 'date',
			label: `${selectedLang.date}`,
			minWidth: 100,
		},
	];

	const userColumns0 = [
		{ id: 'name', label: `${selectedLang.Req_ID}`, minWidth: 50 },
		{ id: 'code', label: `${selectedLang.user_id}`, minWidth: 100 },
		{
			id: 'population',
			label: `${selectedLang.currency}`,
			minWidth: 170,
		},
		{
			id: 'density',
			label: `${selectedLang.balance_before_deposit}`,
			minWidth: 170,
		},
		{
			id: 'size',
			label: `${selectedLang.amount}`,
			minWidth: 170,
			format: (value) => value.toLocaleString('en-US'),
		},
		{
			id: 'date',
			label: `${selectedLang.date}`,
			minWidth: 100,
		},
	];

	// GGR LIMIT

	const userColumnGGRLimit = [
		{ id: 'name', label: `${selectedLang.Req_ID}`, minWidth: 50 },
		{
			id: 'enabled',
			label: `Enabled`,
			minWidth: 170,
		},
		{
			id: 'currency',
			label: `currency`,
			minWidth: 170,
		},
		{ id: 'limit', label: `Limit`, minWidth: 100 },
		{
			id: 'current_usage',
			label: `current usage`,
			minWidth: 170,
		},
		{
			id: 'percentage_usage',
			label: `percentag _usage`,
			minWidth: 100,
		},
		{
			id: 'limit_exceeded',
			label: `limit exceeded`,
			minWidth: 100,
		},
	];

	// States for amount, currency, modal open, and OTP
	const [amount, setAmount] = useState();
	const [selectedCurrency, setSelectedCurrency] = useState('KRW');
	const [open, setOpen] = useState(false);
	const [otp, setOtp] = useState('');

	// Format amount function to add thousands separators
	const formatAmount = (amount) => {
		const numericAmount = Number(amount);
		if (!isNaN(numericAmount)) {
			return numericAmount.toLocaleString();
		} else {
			return amount;
		}
	};

	// Close modal function
	const handleClose = () => {
		setOpen(false);
	};

	// Handle OTP input change
	const handleOtpChange = (e) => {
		setOtp(e.target.value);
	};

	// Handle form submission
	const handleSubmit = () => {
		handleClose();
		_generating(true);
		APIService({
			url: `${process.env.REACT_APP_R_SITE_API}/transaction/create?transaction_type=generate&amount=${amount}&currency=${selectedCurrency}&token=${otp}`,
			method: 'POST',
		})
			.then((data) => {
				dispatch(
					headerLoadChanged({
						headerLoad: !headerLoad,
					})
				);
				dispatch(
					showMessage({
						variant: 'success',
						message: `${selectedLang.success}`,
					})
				);
				setOtp('');
			})
			.catch((err) => {
				dispatch(
					showMessage({
						variant: 'error',
						message: `${selectedLang.invalid_verification_code}`,
					})
				);
				setOtp('');
			})
			.finally(() => {
				setAmount('');
				_generating(false);
			});
	};

	// State for generating flag
	const [generating, _generating] = useState(false);

	// Open modal function
	const generatePotMet = () => {
		setOpen(true);
	};

	// Return JSX for the component
	return (
		<>
			{' '}
			{loaded ? (
				<FuseLoading />
			) : (
				<FusePageSimple
					header={<GeneratePotHeader selectedLang={selectedLang} />}
					content={
						<>
							{/* Card for the main content */}
							<Card
								sx={{ width: '100%', marginTop: '20px', borderRadius: '4px' }}
								className='main_card'>
								{/* <div className='flex justify-start justify-between bg-gray p-16 w-100'>
									<div className='flex justify-start items-center'>
										<span className='list-title'>
											{selectedLang.Agent_listofAdmin}
										</span>
									</div>
								</div> */}
								<div className='flex' style={{ gap: "10px", flexWrap: "wrap" }}>
									<InputBase
										className="input-base"
										sx={{
											flex: 1,
											border: '1px solid #cdcfd3',
											borderRadius: '4px',
											padding: '8px 7px',
											fontSize: '16px',
										}}
										placeholder={selectedLang.amount}
										inputProps={{ 'aria-label': 'Agent Name' }}
										value={formatAmount(amount)}
										onChange={(e) => {
											let inputValue = e.target.value;
											inputValue = inputValue.replace(/[^0-9.]/g, '');
											setAmount(inputValue);
										}}
									/>
									<FormControl sx={{ minWidth: 120 }} size="small">
										<InputLabel id='currency-label'>
											{selectedLang.currency}
										</InputLabel>
										<Select
											labelId='currency-label'
											id='currency'
											value={selectedCurrency}
											onChange={(e) =>
												setSelectedCurrency(e.target.value)
											}>
											<MenuItem value='JPY'>JPY</MenuItem>
											<MenuItem value='EUR'>EUR</MenuItem>
											<MenuItem value='KRW'>KRW</MenuItem>
											<MenuItem value='USD'>USD</MenuItem>
										</Select>
									</FormControl>
									<Button
										className='flex item-center'
										variant='contained'
										color='secondary'
										sx={{
											borderRadius: '4px',
										}}
										onClick={() => {
											if (!amount) {
												dispatch(
													showMessage({
														variant: 'error',
														message: `${selectedLang.invalid_value}`,
													})
												);
											} else {
												generatePotMet();
											}
										}}
										disabled={generating}>
										{generating
											? 'Generating...'
											: selectedLang.GENERATEPOT}
									</Button>
								</div>
							</Card>
							{/* Modal for OTP input */}
							<Modal
								open={open}
								onClose={handleClose}
								aria-labelledby='modal-modal-title'
								aria-describedby='modal-modal-description'>
								<Box
									className="Mymodal"
									sx={style}
									style={{
										display: "flex",
										width: "20%",
										flexDirection: "column",
									}}>
									<button className="modalclosebtn" onClick={handleClose}>
										<svg
											className="svg-icon"
											viewBox="0 0 1024 1024"
											version="1.1"
											xmlns="http://www.w3.org/2000/svg"
										>
											<path
												d="M 590.265 511.987 l 305.521 -305.468 c 21.617 -21.589 21.617 -56.636 0.027 -78.252 c -21.616 -21.617 -56.663 -21.617 -78.279 0 L 512.012 433.735 L 206.544 128.213 c -21.617 -21.617 -56.635 -21.617 -78.252 0 c -21.616 21.589 -21.616 56.635 -0.027 78.252 L 433.76 511.987 L 128.211 817.482 c -21.617 21.59 -21.617 56.635 0 78.251 c 10.808 10.81 24.967 16.213 39.125 16.213 c 14.159 0 28.318 -5.403 39.126 -16.213 l 305.522 -305.468 L 817.48 895.788 C 828.289 906.597 842.447 912 856.606 912 s 28.317 -5.403 39.125 -16.212 c 21.618 -21.59 21.618 -56.636 0.028 -78.252 L 590.265 511.987 Z"
												fill="#333333"
											/>
										</svg>
									</button>
									<Typography
										id="modal-modal-title"
										variant="h6"
										component="h2"
										style={{
											fontWeight: "700",
											fontSize: "23px",
										}}
									>
										Enter Code
									</Typography>
									{/* Input field for OTP */}
									<TextField
										fullWidth
										className="mt-10"
										color="primary"
										size="small"
										type='number'
										placeholder={`${selectedLang.enter_code}`}
										value={otp}
										onChange={handleOtpChange}
									/>
									{/* Button for submitting OTP */}
									<Button
										variant='contained'
										className="mt-10"
										color='secondary'
										onClick={handleSubmit}>
										{selectedLang.submit}
									</Button>
								</Box>
							</Modal>
						</>
					}
				/>
			)}
		</>
	);
}

// Export the component
export default GeneratePotApp;
