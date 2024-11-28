/** @format */

import React from 'react';
import FusePageSimple from '@fuse/core/FusePageSimple';
import ProviderManagementHeader from './GGRReportHeader';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { locale } from '../../../../../configs/navigation-i18n';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import {
	Button,
	CardActionArea,
	CardActions,
	Autocomplete,
} from '@mui/material';
import './provider.css';
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
import InputBase from '@mui/material/InputBase';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Unstable_Grid2';
import TextField from '@mui/material/TextField';
import DoneIcon from '@mui/icons-material/Done';
import APIService from 'src/app/services/APIService';
import { showMessage } from 'app/store/fuse/messageSlice';
import jwtDecode from 'jwt-decode';
import DataHandler from 'src/app/handlers/DataHandler';
import { stubFalse } from 'lodash';
import FuseLoading from '@fuse/core/FuseLoading/FuseLoading';
import queryString from 'query-string';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import Tooltip from '@mui/material/Tooltip';
import InfoIcon from '@mui/icons-material/Info';
import { useParams } from 'react-router-dom';

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

const columns = [
	{ id: 'number', label: 'Number', minWidth: 50 },
	{ id: 'vendor_id', label: 'Category', minWidth: 50 },
	{ id: 'min_limit_amount', label: 'Min Bet', minWidth: 50 },
	{ id: 'limit_amount', label: 'Max Bet', minWidth: 100 },

	// {
	//   id: "isEnabled",
	//   label: "Enabled",
	//   minWidth: 100,
	// },
	// {
	//   id: "updated_at",
	//   label: "Date",
	//   minWidth: 100,
	//   format: (value) => {
	//     const date = new Date(value);
	//     const day = date.getDate().toString().padStart(2, "0");
	//     const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Note: month is zero-indexed, so we need to add 1
	//     const year = date.getFullYear().toString();

	//     const formattedDate = `${day}-${month}-${year}`;
	//     return formattedDate;
	//   },
	// },
	{
		id: 'action',
		label: 'Action',
		minWidth: 100,
	},
];

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
function GGRReport() {
	const [selectLocale] = useSelector((state) => [state.locale.selectLocale]);
	const [selectedLang, setSelectedLang] = useState(locale.en);
	const [loaded, setLoaded] = useState(true);
	useEffect(() => {
		const timeoutId = setTimeout(() => {
			setLoaded(false);
		}, 500);
		return () => clearTimeout(timeoutId);
	}, []);

	useEffect(() => {
		if (selectLocale == 'ko') {
			setSelectedLang(locale.ko);
		} else {
			setSelectedLang(locale.en);
		}
	}, [selectLocale]);

	const columns = [
		{
			id: 'number',
			label: `#`,
			minWidth: 20,
			numeric: true,
			disablePadding: false,
		},
		{ id: 'action', label: `${selectedLang.action}`, minWidth: 50 },
		{ id: 'amount', label: `${selectedLang.amount}`, minWidth: 50 },
		{ id: 'from', label: `${selectedLang.from}`, minWidth: 50 },
		{ id: 'to', label: `${selectedLang.to}`, minWidth: 50 },
		{ id: 'win', label: `${selectedLang.comment}`, minWidth: 100 },

		{
			id: 'Date',
			label: `${selectedLang.date}`,
			minWidth: 100,
			format: (value) => value.toLocaleString('en-US'),
		},
	];

	const [balancefLimits, setBalanceLimits] = useState([]);

	const [loading, setLoading] = useState(false);

	const getBalanceLimit = (pageNumber) => {
		setLoading(true);
		APIService({
			url: `${process.env.REACT_APP_R_SITE_API}/user/get-balance-limits?operator=${params?.id}`,
			method: 'GET',
		})
			.then((res) => {
				setBalanceLimits(res?.data?.data);
			})
			.catch((err) => {
				dispatch(
					showMessage({
						variant: 'error',
						message: `${
							selectedLang[`${formatSentence(err?.message)}`] ||
							selectedLang.something_went_wrong
						}`,
					})
				);
			})
			.finally(() => {
				setLoading(false);
			});
	};

	useEffect(() => {
		getBalanceLimit();
	}, []);

	const renderUserlist = () => {
		return (
			<TableBody>
				{loading ? (
					<div className='text-center'>
						<FuseLoading />
					</div>
				) : (
					balancefLimits?.map((balanceL, key) => (
						<StyledTableRow
							className='custom-table'
							hover
							role='checkbox'
							tabIndex={-1}
							key={'12'}>
							<TableCell
								sx={{
									textAlign: 'center',
								}}>
								{balanceL?.id}
							</TableCell>
							<TableCell
								sx={{
									textAlign: 'center',
								}}>
								{balanceL?.action == 'fas fa-long-arrow-alt-up green-icon' ? (
									<ArrowUpwardIcon style={{ color: 'green' }} />
								) : (
									<ArrowDownwardIcon style={{ color: 'red' }} />
								)}
							</TableCell>
							<TableCell
								sx={{
									textAlign: 'center',
								}}>
								{balanceL?.amount}
							</TableCell>
							<TableCell
								sx={{
									textAlign: 'center',
								}}>
								<span
									style={{
										display: 'flex',
										alignItems: 'center',
										justifyContent: 'center',
									}}>
									<span style={{ marginRight: '5px' }}>{balanceL?.from}</span>
									<Tooltip
										arrow
										title={'Currency exchange rate from EUR -> USD: 1.0000'}
										placement='bottom'>
										<InfoIcon style={{ width: '15' }} />
									</Tooltip>
								</span>
							</TableCell>
							<TableCell
								sx={{
									textAlign: 'center',
								}}>
								{balanceL?.to}
							</TableCell>
							<TableCell
								sx={{
									textAlign: 'center',
								}}>
								<span className='font-16'>
									{balanceL?.comment != 'fas fa-long-arrow-alt-up green-icon' &&
									balanceL?.comment != 'fas fa-long-arrow-alt-down red-icon'
										? balanceL?.comment
										: ''}
								</span>
							</TableCell>
							{/* {
					userDetails?.canPayment == true &&
					userDetails?.wallet_type == "transfer" ? ( */}
							<TableCell
								sx={{
									textAlign: 'center',
								}}>
								{balanceL?.date}
							</TableCell>
						</StyledTableRow>
					))
				)}
			</TableBody>
		);
	};

	const params = useParams();

	return (
		<>
			{' '}
			{loaded ? (
				<FuseLoading />
			) : (
				<FusePageSimple
					header={
						<ProviderManagementHeader
							selectedLang={selectedLang}
							id={params?.id}
						/>
					}
					content={
						<>
							<div className='' style={{ width: '100%' }}>
								{/* 
								<Box className='common_card first'>
									<Typography
										className='mb-4 titlke'
										id='modal-modal-title'
										variant='h5'
										component='h2'>
										<b>{"Preffered currency"}</b> : USD
									</Typography>
									<Typography
										id='modal-modal-title'
										className='title_modal mt-4'>
										<b>
										Available balance in preferred currency
										</b> : 48.89 USD
									</Typography>

									<code className='code_block'>
										{' '}
									</code>

								</Box> */}

								<Card
									sx={{ width: '100%', marginTop: '20px', borderRadius: '4px' }}
									className='main_card'>
									<CardContent>
										<Paper
											sx={{
												width: '100%',
												overflow: 'hidden',
												borderRadius: '4px',
											}}>
											<Typography
												id='modal-modal-title'
												variant='h6'
												component='h2'>
												<b> {selectedLang.balance_limit_transactions} </b>
											</Typography>

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
																	style={{ minWidth: column.minWidth }}
																	// onClick={() => handleSort(column.id)}
																>
																	{column.label}
																</StyledTableCell>
															))}
														</TableRow>
													</TableHead>
													{renderUserlist()}
												</Table>
											</TableContainer>

											{/* </Box> */}
										</Paper>
									</CardContent>
								</Card>
							</div>
						</>
					}
				/>
			)}
		</>
	);
}

export default GGRReport;
