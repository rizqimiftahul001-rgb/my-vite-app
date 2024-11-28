/** @format */

import React from 'react';
import FusePageSimple from '@fuse/core/FusePageSimple';
import RpointRequestedListHeader from './rpointRequestedListHeader';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { locale } from '../../../../configs/navigation-i18n';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { Button, CardActionArea, CardActions } from '@mui/material';
import './rpointRequestedList.css';
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
import APIService from 'src/app/services/APIService';
import DataHandler from 'src/app/handlers/DataHandler';
import FuseLoading from '@fuse/core/FuseLoading';
import Grid from '@mui/material/Grid';
import { showMessage } from 'app/store/fuse/messageSlice';
import moment from 'moment';
import { formatLocalDateTime, formatSentence } from 'src/app/services/Utility';
import { headerLoadChanged } from 'app/store/headerLoadSlice';

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

function rpointRequestedListApp() {
	const dispatch = useDispatch();
	const user_id = DataHandler.getFromSession('user_id');
	const [requestList, setRequestList] = useState([]);
	const [provider, setProvider] = useState(1);
	const [selectedprovider] = useSelector((state) => [
		state.provider.selectedprovider,
	]);
	const [selectLocale] = useSelector((state) => [state.locale.selectLocale]);
	const [selectedLang, setSelectedLang] = useState(locale.en);
	const [headerLoad] = useSelector((state) => [state.headerLoad.headerLoad]);
	//   const [loaded, setLoaded] = useState(true)
	//    useEffect(() => {
	//        const timeoutId = setTimeout(() => {
	//      setLoaded(false)
	//     }, 500);
	//  return () => clearTimeout(timeoutId);
	//   }, []);

	const [loaded, setLoaded] = useState(true);
	const [loading1, setLoading1] = useState(true);
	const [subLoader, setSubLoader] = useState(true);

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
		getRequestList();
	}, [page, rowsPerPage]);

	const columns = [
		{ id: 'req', label: `${selectedLang.Req_ID}`, minWidth: 50 },
		// { id: "user", label: `${selectedLang.user_id}`, minWidth: 50 },
		{ id: 'user', label: `${selectedLang.requester}`, minWidth: 50 },
		{ id: 'provider', label: `${selectedLang.currency}`, minWidth: 50 },
		{ id: 'parent', label: `${selectedLang.parent_id}`, minWidth: 50 },
		{ id: 'point', label: `${selectedLang.amount}`, minWidth: 100 },

		{
			id: 'status',
			label: `${selectedLang.status}`,
			minWidth: 100,
			format: (value) => value.toLocaleString('en-US'),
		},
		// {
		//   id: "statusd",
		//   label: `${selectedLang.user_deposit}`,
		//   minWidth: 100,
		//   format: (value) => value.toLocaleString("en-US"),
		// },
		{
			id: 'action',
			label: `${selectedLang.action}`,
			minWidth: 100,
			format: (value) => value.toLocaleString('en-US'),
		},
		{ id: 'created_at', label: `${selectedLang.date}`, minWidth: 50 },
	];
	const [requestDataCount, setrequestDataCount] = useState(0);
	const getRequestList = () => {
		setSubLoader(true);
		APIService({
			url: `${
				process.env.REACT_APP_R_SITE_API
			}/user/request-list-for-list?user_id=${user_id}&isChargeList=false&&limit=${rowsPerPage}&pageNumber=${
				page + 1
			}`,
			method: 'GET',
		})
			.then((res) => {
				setrequestDataCount(res.data.tableCount);
				setRequestList(res.data.data);
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
				setLoading1(false);
				setSubLoader(false);
			});
	};

	const renderPointRequestlist = () => {
		if (!requestList) {
			return <FuseLoading />;
		} else {
			return (
				<TableBody>
					{requestList
						// .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
						.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
						.map((data, index) => {
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
										{data?.userDetails[0]?.id}
									</TableCell>
									<TableCell
										sx={{
											textAlign: 'center',
										}}>
										{data?.userDetails[0]?.currency}
									</TableCell>
									<TableCell
										sx={{
											textAlign: 'center',
										}}>
										{data?.parentDetails[0].id}
									</TableCell>
									<TableCell
										sx={{
											textAlign: 'center',
										}}>
										{Number(data?.point_amount)?.toLocaleString()}
									</TableCell>
									<TableCell
										sx={{
											textAlign: 'center',
											color: data?.status ? 'green' : 'red',
										}}>
										{data?.status ? selectedLang.approved : selectedLang.reject}
									</TableCell>
									{/* <TableCell
                    sx={{
                      textAlign: "center",
                      color:
                        data?.deposit_status == "pending" ? "#EEBB05" : "blue",
                    }}>
                    {selectedLang[`${data?.deposit_status}`]}
                   
                  </TableCell> */}
									<TableCell
										sx={{
											textAlign: 'center',
										}}>
										<Button
											color='success'
											variant='outlined'
											type='submit'
											style={{ margin: '5px' }}
											onClick={(e) => approveRpoints(e, data?.request_id)}>
											{selectedLang.approved}
										</Button>
										<Button
											color='error'
											variant='outlined'
											style={{ margin: '5px' }}
											type='submit'
											onClick={(e) => rejectRpoints(e, data?.request_id)}>
											{selectedLang.reject}
										</Button>
									</TableCell>
									<TableCell
										sx={{
											textAlign: 'center',
										}}>
										{formatLocalDateTime(data.created_at)}
										{/* {moment(data.created_at).format("YYYY/MM/DD HH:mm:ss")} */}
										{/* {dateFormat(data.created_at)} */}
									</TableCell>
								</StyledTableRow>
							);
						})}
				</TableBody>
			);
		}
	};

	function dateFormat(date) {
		var d = new Date(date);
		var date = d.getDate();
		var month = d.getMonth() + 1; // Since getMonth() returns month from 0-11 not 1-12
		var year = d.getFullYear();
		var newDate = year + '-' + month + '-' + date;
		return newDate;
	}

	const rejectRpoints = (e, req_id) => {
		e.preventDefault();
		const payload = {
			req_id: req_id,
			provider_id: selectedprovider,
		};

		APIService({
			url: `${process.env.REACT_APP_R_SITE_API}/user/reject-rpoints`,
			method: 'PUT',
			data: payload,
		})
			.then((res) => {
				getRequestList();
				dispatch(
					showMessage({
						variant: 'info',
						message: `${selectedLang.pot_request_rejected}`,
					})
				);
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

	const approveRpoints = (e, req_id) => {
		e.preventDefault();
		const payload = {
			req_id: req_id,
			provider_id: selectedprovider,
		};

		APIService({
			url: `${process.env.REACT_APP_R_SITE_API}/user/approve-rpoints`,
			method: 'PUT',
			data: payload,
		})
			.then((res) => {
				dispatch(
					headerLoadChanged({
						headerLoad: !headerLoad,
					})
				);
				getRequestList();
				dispatch(
					showMessage({
						variant: 'success',
						message: `${selectedLang.pot_request_accepted}`,
					})
				);
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

	return (
		<>
			{' '}
			{loaded ? (
				<FuseLoading />
			) : (
				<FusePageSimple
					header={<RpointRequestedListHeader selectedLang={selectedLang} />}
					content={
						<>
							<Card
								sx={{ width: '100%', marginTop: '20px', borderRadius: '4px' }}
								className='main_card'>
								<div className='flex justify-start justify-items-center bg-gray p-10 list_title w-100'>
									<span className='list-title'>
										{selectedLang.sub_agent_rpoint_request_list}
									</span>
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
													{renderPointRequestlist()}
												</Table>
												{subLoader && <FuseLoading />}

												{!requestList.length > 0 && !subLoader && (
													<div
														style={{
															textAlign: 'center',color:'#fff',
															padding: '0.95rem',
														}}>
														{selectedLang.no_data_available_in_table}
													</div>
												)}
											</TableContainer>
											<TablePagination
												rowsPerPageOptions={[1, 10, 25, 100]}
												component='div'
												count={requestDataCount ? requestDataCount : 0}
												rowsPerPage={rowsPerPage}
												page={page}
												labelRowsPerPage={selectedLang.rows_per_page}
												onPageChange={handleChangePage}
												onRowsPerPageChange={handleChangeRowsPerPage}
											/>
										</Paper>
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

export default rpointRequestedListApp;
