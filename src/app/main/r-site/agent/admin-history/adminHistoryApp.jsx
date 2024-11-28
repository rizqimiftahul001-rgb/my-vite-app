/** @format */

import * as React from 'react';
import FusePageSimple from '@fuse/core/FusePageSimple';
import TransactionHistoryHeader from './adminHistoryHeader';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import TextField from '@mui/material/TextField';
import { locale } from '../../../../configs/navigation-i18n';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { Button } from '@mui/material';
import './adminHistory.css';
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
import 'flatpickr/dist/themes/material_green.css';
import Flatpickr from 'react-flatpickr';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSort } from '@fortawesome/free-solid-svg-icons';
import { faSortUp } from '@fortawesome/free-solid-svg-icons';
import { faSortDown } from '@fortawesome/free-solid-svg-icons';
import DatePicker from "src/app/main/apps/calendar/DatePicker";

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

function transactionHistoryApp() {
	const todayDate = new Date();
	todayDate.setDate(todayDate.getDate());
	todayDate.setHours(23, 59, 59, 999);
	const threeDaysAgo = new Date(todayDate);
	threeDaysAgo.setDate(todayDate.getDate() - 1);
	threeDaysAgo.setHours(0, 0, 0, 0);
	const [status, setType] = useState('');
	const [agentFilterValue, setAgentName] = useState('');
	const [betData2, setBetData2] = useState();
	const [agentList, setAgentList] = useState([]);
	const role = jwtDecode(DataHandler.getFromSession('accessToken'))['data'];
	const user_id = DataHandler.getFromSession('user_id');
	const payment_type = 'Sub Agent Deposit';
	const [selectLocale] = useSelector((state) => [state.locale.selectLocale]);
	const [selectedLang, setSelectedLang] = useState(locale.en);
	const [agent, setAgent] = useState('');
	const [adminrequest, setAdminRequest] = useState('');
	const [startDate, setStartDate] = useState(threeDaysAgo);
	const [endDate, setEndDate] = useState(todayDate);
	// const [agentFilterValue, setAgentFilterValue] = useState("");
	// const [status, setStatus] = useState("");
	const [subAgentDepositHistoryData, setSubAgentDepositHistoryData] = useState(
		[]
	);
	const [agentDepositHistoryData, setAgentDepositHistoryData] = useState('');

	const dispatch = useDispatch();
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

	const [page1, setPage1] = React.useState(0);
	const [page2, setPage2] = React.useState(0);
	const [page3, setPage3] = React.useState(0);

	const [rowsPerPage, setRowsPerPage] = React.useState(20);

	const [value, setValue] = React.useState('1');

	const handleChange2 = (event, newValue) => {
		setValue(newValue);
	};

	const handleChangePage1 = (event, newPage) => {
		setPage1(newPage);
	};

	const handleChangePage2 = (event, newPage) => {
		setPage2(newPage);
	};

	const handleChangePage3 = (event, newPage) => {
		setPage3(newPage);
	};

	const handleChangeRowsPerPage = (event) => {
		setRowsPerPage(+event.target.value);
		setPage1(0);
		setPage2(0);
		setPage3(0);
	};

	const [age, setAge] = React.useState('');

	const handleChange = (event) => {
		setAge(event.target.value);
	};

	useEffect(() => {
		getSubAgentPaymentHistory();
	}, [page1, rowsPerPage, selectedLang]);

	const [subAgentTableCount, _subAgentTableCount] = useState(0);
	const [sortedAndMappedDataAll, setSortedAndMappedDataAll] = useState([]);
	const [originalSubDepoAll, setOriginalSubDepoAll] = useState([]);

	const getSubAgentPaymentHistory = (pageNumber) => {
		const sDate = new Date(startDate);
		const eDate = new Date(endDate);
		const timeDifference = (sDate - eDate) / (1000 * 60 * 60 * 24);

		if (Math.abs(timeDifference) > 3 && role['role'] != 'admin') {
			// Display an alert or any other desired user feedback
			return dispatch(
				showMessage({
					variant: 'error',
					message: `Selected date should not more than 3 days from today!`,
				})
			);
		}

		resetSorting();
		setLoading1(true);
		APIService({
			url: `${process.env.REACT_APP_R_SITE_API
				}/transaction/get-all?&limit=${rowsPerPage}&pageNumber=${page3 + 1
				}&transaction_relation=${role['role'] === 'admin' || role['role'] === 'cs' ? 'admin_admin' : ''
				}&startDate=${startDate}&endDate=${endDate}`,
			method: 'GET',
		})
			.then((res) => {
				setSubAgentDepositHistoryData(res.data.data);
				setSumArray(res?.data?.sum);
				_subAgentTableCount(res?.data?.tableCount);
				setSortedAndMappedDataAll(res.data.data);
				setOriginalSubDepoAll(cloneDeep(res.data.data));
			})
			.catch((err) => {
				dispatch(
					showMessage({
						variant: 'error',
						message: `${selectedLang[`${formatSentence(err?.message)}`] ||
							selectedLang.something_went_wrong
							}`,
					})
				);
			})
			.finally(() => {
				setLoading1(false);
			});
	};

	const [sortOrder_bbw, setSortOrder_bbw] = useState('');
	const [sortOrder_amt, setSortOrder_amt] = useState('');

	const resetSorting = () => {
		setSortOrder_bbw('');
		setSortOrder_amt('');
	};

	const getSortIconBBW = (order) => {
		return order === 'asc' ? (
			<FontAwesomeIcon icon={faSortUp} className="sort-icon" />
		) : order === 'desc' ? (
			<FontAwesomeIcon icon={faSortDown} className="sort-icon" />
		) : (
			<FontAwesomeIcon icon={faSort} className="sort-icon" />
		);
	};

	const getSortIconAMT = (order) => {
		return order === 'asc' ? (
			<FontAwesomeIcon icon={faSortUp} className="sort-icon" />
		) : order === 'desc' ? (
			<FontAwesomeIcon icon={faSortDown} className="sort-icon" />
		) : (
			<FontAwesomeIcon icon={faSort} className="sort-icon" />
		);
	};

	const onDataFilter = (startDate, endDate) => {
		// console.log(startDate, endDate);
		setEndDate(endDate);
		setStartDate(startDate);
	  };

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

	// useEffect(() => {
	// 	const _sumArray = {};
	// 	// Loop through each object in the array
	// 	subAgentDepositHistoryData?.forEach((obj) => {
	// 		// Loop through each field in the object
	// 		for (const field in obj) {
	// 			const fieldValue = parseFloat(obj[field]);
	// 			// If the field doesn't exist in the sumArray, initialize it with the current value
	// 			if (!_sumArray[field]) {
	// 				_sumArray[field] = fieldValue;
	// 			} else {
	// 				// If the field already exists in the sumArray, add the current value to it
	// 				_sumArray[field] += fieldValue;
	// 			}
	// 		}
	// 	});
	// 	
	// 	setSumArray(_sumArray);
	// }, [subAgentDepositHistoryData]);
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
					{''}
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
					{sumArray.length > 0 &&
						Number(sumArray[0]?.sumBeforePot)?.toLocaleString()}
				</TableCell>
				<TableCell
					sx={{
						textAlign: 'center',
					}}>
					{sumArray.length > 0 &&
						Number(sumArray[0]?.sumAmount)?.toLocaleString()}
				</TableCell>

				<TableCell
					sx={{
						textAlign: 'center',
					}}>
					{''}
				</TableCell>
			</StyledTableRow>
		);
	};

	//   const [sortBy, setSortBy] = useState(''); // Default sorting column
	//   const [sortOrder, setSortOrder] = useState(''); // Default sorting order

	//   const handleSort = (column) => {
	// 	if(column =="size" || column =='density'|| column =='Afdensity'){
	// 		if (column === 'density') {
	// 		setSortBy("density")
	// 		setSortOrder_bbw(sortOrder_bbw === 'asc' ? 'desc' : sortOrder_bbw === 'desc' ? '' : 'asc')
	// 		} else if(column=='size'){
	// 		setSortBy("size")
	// 		setSortOrder_amt(sortOrder_amt === 'asc' ? 'desc' : sortOrder_amt === 'desc' ? '' : 'asc')
	// 		}else{
	// 			setSortBy("Afdensity")
	// 			setSortOrder_bad(sortOrder_bad === 'asc' ? 'desc' : sortOrder_bad === 'desc' ? '' : 'asc')
	// 		}
	// 	}
	// };

	// function customSortAll(data, sortBy, sortOrder) {
	// 	const originalSubDepoCopy = JSON.parse(JSON.stringify(originalSubDepoAll));

	// 	const amountValues = data.map((item) => item[sortBy]);

	// 	amountValues.sort((a, b) => {
	// 	  if (sortOrder === 'asc') {
	// 		return a - b;
	// 	  } else if (sortOrder === 'desc') {
	// 		return b - a;
	// 	  }
	// 	  return 0;
	// 	});

	// 	data.forEach((item, index) => {
	// 	  if (sortOrder === 'asc' || sortOrder === 'desc') {
	// 		item[sortBy] = amountValues[index];
	// 	  } else {
	// 		const originalValue = originalSubDepoCopy[index][sortBy];
	// 		item[sortBy] = originalValue;
	// 	  }
	// 	});
	//   }
	//   if (sortBy === 'size') {
	// 	customSortAll(sortedAndMappedDataAll, 'amount', sortOrder_amt);
	//   }

	//   if (sortBy === 'density' ) {
	// 	customSortAll(sortedAndMappedDataAll, 'before_pot', sortOrder_bbw);
	//   }

	const [sortBy, setSortBy] = useState('name'); // Default sorting column
	const [sortOrder, setSortOrder] = useState(''); // Default sorting order

	const handleSort = (column) => {
		if (column == 'density' || column == 'size' || column == 'Afdensity') {
			if (column === 'density') {
				setSortBy('density');
				setSortOrder_bbw(
					sortOrder === 'asc' ? 'desc' : sortOrder === 'desc' ? '' : 'asc'
				);
				setSortOrder(
					sortOrder === 'asc' ? 'desc' : sortOrder === 'desc' ? '' : 'asc'
				);
			} else {
				setSortBy('size');
				setSortOrder_amt(
					sortOrder === 'asc' ? 'desc' : sortOrder === 'desc' ? '' : 'asc'
				);
				setSortOrder(
					sortOrder === 'asc' ? 'desc' : sortOrder === 'desc' ? '' : 'asc'
				);
			}
		}
	};

	const initCopyUsSubAgPaymentData = [...subAgentDepositHistoryData];

	const sortedAndMappedData =
		sortOrder !== ''
			? initCopyUsSubAgPaymentData.sort((a, b) => {
				if (sortBy === 'size') {
					return sortOrder === 'asc'
						? a.amount - b.amount
						: b.amount - a.amount;
				} else if (sortBy == 'density') {
					return sortOrder === 'asc'
						? a.before_pot - b.before_pot
						: b.before_pot - a.before_pot;
				} else {
					return sortOrder === 'asc'
						? a.after_pot - b.after_pot
						: b.after_pot - a.after_pot;
				}
			})
			: initCopyUsSubAgPaymentData;

	const addUserSubAgentPaymentData = () => {
		if (subAgentDepositHistoryData.length > 0) {
			return (
				<TableBody>
					{createSumRow()}
					{sortedAndMappedData
						// .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
						.map((data, index) => {
							return (
								<StyledTableRow hover role='checkbox' tabIndex={-1} key={index}>
									<TableCell
										sx={{
											textAlign: 'center',
										}}>
										{page1 * rowsPerPage + index + 1}
									</TableCell>
									<TableCell
										sx={{
											textAlign: 'center',
										}}>
										{data?.to_user_name}
									</TableCell>
									<TableCell
										sx={{
											textAlign: 'center',
										}}>
										{data?.currency}
									</TableCell>
									<TableCell
										sx={{
											textAlign: 'center',
										}}>
										{Number(data?.before_pot)?.toLocaleString()}
									</TableCell>
									<TableCell
										sx={{
											textAlign: 'center',
										}}>
										{Number(data?.amount)?.toLocaleString()}
									</TableCell>
									{/* <TableCell
                    sx={{
                      fontWeight: "600",
                      textAlign: "center",
                      color: data?.status ? "green" : "red",
                    }}>
                    {data?.status
                      ? `${selectedLang.approved}`
                      : `${selectedLang.not_approved}`}
                  </TableCell> */}
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

	const handleTodayClick = () => {
		const today = new Date();
		const startOfDay = new Date(
			today.getFullYear(),
			today.getMonth(),
			today.getDate(),
			0,
			0,
			0
		);
		const endOfDay = new Date(
			today.getFullYear(),
			today.getMonth(),
			today.getDate(),
			23,
			59,
			59
		);
		setStartDate(startOfDay);
		setEndDate(endOfDay);
	};

	const handleYesterdayClick = () => {
		const today = new Date();
		const startOfDay = new Date(
			today.getFullYear(),
			today.getMonth(),
			today.getDate() - 1, // Today
			0, // Hours
			0, // Minutes
			0 // Seconds
		);

		// Set the end date to "2023-09-27 00:00:00"
		const endOfDay = new Date();

		setStartDate(startOfDay);
		setEndDate(endOfDay);
	};

	const handleThreedayClick = () => {
		const endDate = new Date();
		const startDate = new Date(endDate);
		startDate.setDate(endDate.getDate() - 2);
		startDate.setHours(0, 0, 0, 0); // Set hours, minutes, seconds, and milliseconds to 0 for both dates
		// endDate.setHours(0, 0, 0, 0);
		setStartDate(startDate);
		setEndDate(endDate);
	};

	// 1hur, 6hur, today, yesterday
	const handleCLickOneHour = () => {
		const endDate = new Date();
		const startDate = new Date(endDate);

		// Add 1 hour to both startDate and endDate
		startDate.setHours(startDate.getHours() - 1);
		// endDate.setHours(endDate.getHours());

		setStartDate(startDate);
		setEndDate(endDate);
	};

	const handleClickSixHour = () => {
		const endDate = new Date();
		const startDate = new Date(endDate);

		// Add 1 hour to both startDate and endDate
		startDate.setHours(startDate.getHours() - 6);
		// endDate.setHours(endDate.getHours());

		setStartDate(startDate);
		setEndDate(endDate);
	};

	const handleWeekClick = () => {
		// const endDate = new Date();

		// const startDate = new Date();
		// startDate.setDate(endDate.getDate() - 6);

		// setStartDate(startDate);
		// setEndDate(endDate);

		const currentDate = new Date();
		const startDate = new Date(currentDate);
		startDate.setDate(currentDate.getDate() - 6);
		startDate.setHours(0, 0, 0, 0); // Set time to midnight (00:00:00)

		const endDate = new Date(currentDate);
		// endDate.setHours(0, 0, 0, 0); // Set time to midnight (00:00:00)

		setStartDate(startDate);
		setEndDate(endDate);
	};

	const handleMonthClick = () => {
		// const endDate = new Date();

		// const startDate = new Date();
		// startDate.setMonth(endDate.getMonth() - 1);

		// startDate.setDate(1);

		// endDate.setMonth(endDate.getMonth() + 1);
		// endDate.setDate(0);

		// setStartDate(startDate);
		// setEndDate(endDate);

		const endDate = new Date();
		// endDate.setHours(0, 0, 0, 0); // Set time to 00:00:00.000

		const startDate = new Date(endDate);
		startDate.setDate(endDate.getDate() - 31);
		startDate.setHours(0, 0, 0, 0); // Set time to 00:00:00.000

		setStartDate(startDate);
		setEndDate(endDate);
	};

	//   const csvHeadersubAgentDepositHistoryData = [
	//     { label: "User Id", key: "userId" },
	//     { label: "Parent Id", key: "parentId" },
	//     { label: "No: of Point", key: "point_amount" },
	//     { label: "Status", key: "status" },
	//     { label: "date", key: "created_at" },
	//   ];

	//   const csvHeaderUserithdrawalHistoryData = [
	//     { label: "User Id", key: "buyer_id" },
	//     { label: "Parent Id", key: "id" },
	//     { label: "Payment Amount", key: "amount" },
	//     { label: "Balance After Payment", key: "balanceAfterPayment" },
	//     { label: "Date", key: "created_at" },
	//   ];

	//   const subAgentDepositHistoryDataCSV =
	//     subAgentDepositHistoryData.length > 0 &&
	//     subAgentDepositHistoryData.map((item) => ({
	//       Status: item.status ? selectedLang.approved : selectedLang.not_approved,
	//       userId: item.childDetails[0]?.id,
	//       parentId: item?.userDetails[0]?.id,
	//       point_amount: item?.point_amount,
	//       created_at: moment(item?.created_at).format("YYYY/MM/DD HH:mm:ss"),
	//       // created_at: dateFormat(item?.created_at),
	//     }));

	//   const agentDepositHistoryDataCsv =
	//     agentDepositHistoryData.length > 0 &&
	//     agentDepositHistoryData.map((item) => ({
	//       buyer_id: item.buyer_id,
	//       id: item.id,
	//       amount: item.amount,
	//       balanceAfterPayment: item.balanceAfterPayment,
	//       created_at: moment(item?.created_at).format("YYYY/MM/DD HH:mm:ss"),
	//       // created_at: dateFormat(item?.created_at),
	//     }));

	const handleStartDateChange = (date) => {
		const currentDate = new Date(endDate);
		const selectedDate = new Date(date);

		// Calculate the difference in days
		const timeDifference = (currentDate - selectedDate) / (1000 * 60 * 60 * 24);

		if (timeDifference > 3) {
			// Display an alert or any other desired user feedback
			dispatch(
				showMessage({
					variant: 'error',
					message: `Selected date should not more than 3 days from today!`,
				})
			);
		} else {
			// Set the selected date if it's within the allowed range
			setStartDate(date);
		}
	};

	const handleEndDateChange = (date) => {
		const currentDate = new Date(startDate);
		const selectedDate = new Date(date);

		// Calculate the difference in days
		const timeDifference = (selectedDate - currentDate) / (1000 * 60 * 60 * 24);

		if (timeDifference > 3) {
			// Display an alert or any other desired user feedback
			dispatch(
				showMessage({
					variant: 'error',
					message: `Selected date should not more than 3 days from today!`,
				})
			);
		} else {
			// Set the selected date if it's within the allowed range
			setEndDate(date);
		}
	};

	return (
		loaded ? (
			<FuseLoading />
		) : (
			<FusePageSimple
				header={
					<TransactionHistoryHeader
						selectedLang={selectedLang}
					//   csv_data={
					//     value == 1
					//       ? subAgentDepositHistoryDataCSV
					//       : agentDepositHistoryDataCsv
					//   }
					//   csv_header={
					//     value == 1
					//       ? csvHeadersubAgentDepositHistoryData
					//       : csvHeaderUserithdrawalHistoryData
					//   }
					//   csv_filename={`${
					//     value == 1 ? "user_deposite.csv" : "user_withdrawal.csv"
					//   }`}
					/>
				}
				content={
					<Card
						sx={{ width: '100%', marginTop: '20px', borderRadius: '4px' }}
						className='main_card'>
						<div
							className='flex justify-start justify-between bg-gray p-16 w-100'
							style={{ display: 'none' }}>
							<div className='flex justify-start items-center'>
								<span className='list-title'>
									{selectedLang.Agent_listofAdmin}
								</span>
							</div>
						</div>
						<div
							className='row flex flex-wrap z-index-10'
							style={{ flexWrap: 'wrap', justifyContent: 'space-between',gap:"10px" }}>
							<div className='flex item-center'>
								<div className='datepikers newdate_picker'>
									{/* <DateTimePicker
                        className="datetimePiker"
                        placeholder={"Start Date"}
                        size="small"
                        value={startDate}
                        inputFormat="yyyy/MM/dd HH:mm:ss"
                        // onChange={handleStartDateChange }
                        onChange={(date) => setStartDate(date)}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            placeholder={selectedLang.end_date}
                          />
                        )}
                      /> */}
									{/* <div className='d-flex datebox_wrapper'>
										<Flatpickr
											options={{
												locale: selectedLang.calander,
											}}
											data-enable-time
											value={startDate}
											onChange={(date) => setStartDate(date)}
										/>
										<div className='text-white'> - </div>
										<Flatpickr
											options={{
												locale: selectedLang.calander,
											}}
											data-enable-time
											value={endDate}
											onChange={(date) => setEndDate(date)}
										/>
									</div> */}
									<DatePicker onDataFilter={onDataFilter} />
									{/* <DateTimePicker
										className="datetimePiker mr-4"
										placeholder={"End Date"}
										size="small"
										value={endDate}
										inputFormat="yyyy/MM/dd HH:mm:ss"
										onChange={(date) => setEndDate(date)}
										// onChange={handleEndDateChange}
										renderInput={(params) => (
										<TextField
											{...params}
											placeholder={selectedLang.end_date}
										/>
										)}
									/> */}

									<div className='flex' style={{ padding: "5px 0" }}>
										{/* 
											<Tooltip
												title={selectedLang.yesterday}
												placement='top'
												arrow> */}
										<Button
											className='flex item-center mybutton smaller'
											variant='contained'
											color='secondary'
											sx={{
												borderRadius: '4px',
												margin: '0 3px', // Adjust the margin value as needed
												fontSize: '70%', // Reduce font size to make the text smaller
												padding: '3px 8px', // Reduce padding to make the button smaller
												height: '24px', // Reduce height to make the button smaller
											}}
											onClick={handleCLickOneHour}>
											1 {selectedLang.hour}
										</Button>

										<Button
											className='flex item-center mybutton smaller'
											variant='contained'
											color='secondary'
											sx={{
												borderRadius: '4px',
												margin: '0 3px', // Adjust the margin value as needed
												fontSize: '70%', // Reduce font size to make the text smaller
												padding: '3px 8px', // Reduce padding to make the button smaller
												height: '24px', // Reduce height to make the button smaller
											}}
											onClick={handleClickSixHour}>
											6 {selectedLang.hour}
										</Button>

										<Button
											className='flex item-center mybutton smaller'
											variant='contained'
											color='secondary'
											sx={{
												borderRadius: '4px',
												margin: '0 3px', // Adjust the margin value as needed
												fontSize: '70%', // Reduce font size to make the text smaller
												padding: '3px 8px', // Reduce padding to make the button smaller
												height: '24px', // Reduce height to make the button smaller
											}}
											onClick={handleTodayClick}>
											{selectedLang.today}
										</Button>

										<Button
											className='flex item-center mybutton smaller'
											variant='contained'
											color='secondary'
											sx={{
												borderRadius: '4px',
												margin: '0 3px', // Adjust the margin value as needed
												fontSize: '70%', // Reduce font size to make the text smaller
												padding: '3px 8px', // Reduce padding to make the button smaller
												height: '24px', // Reduce height to make the button smaller
											}}
											onClick={handleYesterdayClick}>
											{selectedLang.yesterday}
										</Button>
										{/* </Tooltip> */}
									</div>
								</div>
							</div>
							<Button
								className='flex item-center'
								variant='contained'
								color='secondary'
								onClick={() => {
									getSubAgentPaymentHistory();
								}}
								endIcon={<SearchIcon size={20}></SearchIcon>}
								sx={{
									borderRadius: '4px',
								}}>
								{selectedLang.date_search}
							</Button>
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
												{userColumns0.map((column) => (
													<StyledTableCell
														sx={{
															textAlign: 'center',
															cursor:
																column.id === 'size' ||
																	column.id === 'density'
																	? 'pointer'
																	: 'default',
														}}
														key={column.id}
														align={column.align}
														style={{ minWidth: column.minWidth }}
														// active={true}
														// disable={
														//   column.id != "size" ||
														//   column.id != "density"
														// }
														onClick={() => handleSort(column.id)}>
														{column.label}
														{column.id == 'density'
															? getSortIconBBW(sortOrder_bbw)
															: column.id == 'size'
																? getSortIconAMT(sortOrder_amt)
																: ''}
													</StyledTableCell>
												))}
											</TableRow>
										</TableHead>
										{addUserSubAgentPaymentData()}
									</Table>
									{loading1 && <FuseLoading />}
									{!subAgentDepositHistoryData.length > 0 &&
										!loading1 && (
											<div
												style={{
													textAlign: 'center',
													color: "#fff",
													padding: '0.95rem',
												}}>
												{selectedLang.no_data_available_in_table}
											</div>
										)}
								</TableContainer>
								{value == 3 && (
									<TablePagination
										rowsPerPageOptions={[20, 50, 100, 200, 500]}
										component='div'
										count={adminrequestTableCount}
										rowsPerPage={rowsPerPage}
										page={page3}
										onPageChange={handleChangePage3}
										onRowsPerPageChange={handleChangeRowsPerPage}
										labelRowsPerPage={selectedLang.rows_per_page}
									/>
								)}

								{value == 1 && (
									<TablePagination
										rowsPerPageOptions={[20, 50, 100, 200, 500]}
										component='div'
										count={subAgentTableCount}
										rowsPerPage={rowsPerPage}
										page={page1}
										onPageChange={handleChangePage1}
										onRowsPerPageChange={handleChangeRowsPerPage}
										labelRowsPerPage={selectedLang.rows_per_page}
									/>
								)}

								{value == 2 && (
									<TablePagination
										rowsPerPageOptions={[20, 50, 100, 200, 500]}
										component='div'
										count={withdrawAgentTableCount}
										rowsPerPage={rowsPerPage}
										page={page2}
										onPageChange={handleChangePage2}
										onRowsPerPageChange={handleChangeRowsPerPage}
										labelRowsPerPage={selectedLang.rows_per_page}
									/>
								)}
							</Paper>
						</CardContent>
					</Card>
				}
			/>
		)
	);
}

export default transactionHistoryApp;
