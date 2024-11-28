/** @format */

import React from 'react';
import FusePageSimple from '@fuse/core/FusePageSimple';
import GameHistoryHeader from './gameHistoryHeader';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { locale } from '../../../../configs/navigation-i18n';

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { Button, CardActionArea, CardActions } from '@mui/material';
import './gameHistory.css';
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
import SearchIcon from '@mui/icons-material/Search';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import APIService from 'src/app/services/APIService';
import DataHandler from 'src/app/handlers/DataHandler';
import { showMessage } from 'app/store/fuse/messageSlice';
import FuseLoading from '@fuse/core/FuseLoading';
import { formatSentence } from 'src/app/services/Utility';

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

function gameHistoryApp() {
	const dispatch = useDispatch();
	const user_id = DataHandler.getFromSession('user_id');
	const [gameHistory, setGameHistory] = useState();
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

	const [page, setPage] = React.useState(0);
	const [rowsPerPage, setRowsPerPage] = React.useState(10);

	const handleChangePage = (event, newPage) => {
		setPage(newPage);
	};

	const handleChangeRowsPerPage = (event) => {
		setRowsPerPage(+event.target.value);
		setPage(0);
	};

	const columns11 = [
		{ id: 'number', label: `${selectedLang.number}`, minWidth: 50 },
		{ id: 'casinoUserID', label: `Casino User ID`, minWidth: 50 },
		{ id: 'gameID', label: `Game ID`, minWidth: 50 },
		{ id: 'beforeMoney', label: `Before Money`, minWidth: 50 },
		{ id: 'betMoney', label: `Bet Money`, minWidth: 100 },
		{ id: 'afterMoney', label: `After Money`, minWidth: 100 },
	];

	useEffect(() => {
		getGameHistory();
		setInterval(() => {
			getGameHistory();
		}, 2000);
	}, []);

	const getGameHistory = () => {
		APIService({
			url: `${process.env.REACT_APP_R_SITE_API}/v1/get-history`,
			method: 'GET',
		})
			.then((res) => {
				setGameHistory(res.data.data);
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
			.finally(() => {});
	};

	const renderGameHistory = () => {
		if (gameHistory) {
			return (
				<TableBody>
					{gameHistory
						.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
						.map((gamehistory, index) => {
							return (
								<StyledTableRow hover role='checkbox' tabIndex={-1} key={index}>
									<TableCell
										sx={{
											textAlign: 'center',
										}}>
										{page * rowsPerPage + index + 1}
									</TableCell>
									<TableCell
										sx={{
											textAlign: 'center',
										}}>
										{gamehistory.uid}
									</TableCell>
									<TableCell
										sx={{
											textAlign: 'center',
										}}>
										{gamehistory.gid}
									</TableCell>
									<TableCell
										sx={{
											textAlign: 'center',
										}}>
										{gamehistory.extra.before_money}
									</TableCell>
									<TableCell
										sx={{
											textAlign: 'center',
										}}>
										{gamehistory.bet_money}
									</TableCell>
									<TableCell
										sx={{
											textAlign: 'center',
										}}>
										{gamehistory.extra.after_money}
									</TableCell>
								</StyledTableRow>
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
					header={<GameHistoryHeader selectedLang={selectedLang} />}
					content={
						<>
							<Card
								sx={{ width: '100%', marginTop: '20px', borderRadius: '4px' }}
								className='main_card'>
								<div className='flex justify-start justify-items-center bg-gray p-10 list_title w-100'>
									<span className='list-title'>
										{selectedLang.Consolidated_Bet_History_List}
									</span>
								</div>

								<div>
									<CardContent>
										<div className='row flex justify-end justify-items-center'>
											<div className='col-lg-8 col-md-4 col-sm-4 flex item-center'>
												<InputBase
													sx={{
														ml: 1,
														flex: 1,
														border: '1px solid #cdcfd3',
														borderRadius: '4px',
														padding: '4px 10px',
													}}
													placeholder={selectedLang.user_name}
													inputProps={{ 'aria-label': 'Agent Name' }}
												/>
											</div>
											<div className='col-lg-2 col-md-4 col-sm-4 p-10 pl-0 flex item-center'>
												<Button
													className='flex item-center'
													variant='contained'
													color='secondary'
													endIcon={<SearchIcon size={20}></SearchIcon>}
													sx={{
														borderRadius: '4px',
													}}>
													{selectedLang.search}
												</Button>
											</div>
										</div>
										<TableContainer>
											<Table stickyHeader aria-label='customized table'>
												<TableHead>
													<TableRow>
														{columns11.map((column) => (
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
												{renderGameHistory()}
											</Table>
										</TableContainer>
										<TablePagination
											rowsPerPageOptions={[10, 25, 100]}
											component='div'
											count={gameHistory?.length ? gameHistory?.length : 0}
											rowsPerPage={rowsPerPage}
											page={page}
											onPageChange={handleChangePage}
											onRowsPerPageChange={handleChangeRowsPerPage}
											labelRowsPerPage={selectedLang.rows_per_page}
										/>
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

export default gameHistoryApp;
