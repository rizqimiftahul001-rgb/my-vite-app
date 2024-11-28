import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import Flatpickr from "react-flatpickr";
import {
  format,
  startOfDay,
  endOfDay,
  subDays,
  startOfMonth,
  endOfMonth,
  subMonths,
  setHours,
  setMinutes,
  setSeconds,
} from "date-fns";
import { locale } from "../../../configs/navigation-i18n";
import "./DateFilter.css";

const threeDaysAgo = new Date();
threeDaysAgo.setDate(threeDaysAgo.getDate() - 0);
threeDaysAgo.setHours(0, 0, 0, 0);

const DatePicker = ({ onDataFilter }) => {
  const [selectLocale] = useSelector((state) => [state.locale.selectLocale]);
  const [selectedLang, setSelectedLang] = useState(locale.ko);
  const [selectedOption, setSelectedOption] = useState();
  const [startDate, setStartDate] = useState(threeDaysAgo);
  const [endDate, setEndDate] = useState(new Date());
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (selectLocale === "ko") {
      setSelectedLang(locale.ko);
    } else {
      setSelectedLang(locale.en);
    }
  }, [selectLocale]);

  const setEndOfDayTime = (date) => {
    return setSeconds(setMinutes(setHours(date, 23), 59), 59);
  };

  const handleDateChange = (
    option,
    startDateValue = null,
    endDateValue = null
  ) => {
    switch (option) {
      case "Today":
        startDateValue = startOfDay(new Date());
        endDateValue = endOfDay(new Date());
        setSelectedOption(
          `${selectedLang.today}: ${format(
            startDateValue,
            "yyyy/MM/dd"
          )} 00:00:00 - ${format(endDateValue, "yyyy/MM/dd")} 23:59:59`
        );
        break;
      case "Yesterday":
        startDateValue = startOfDay(subDays(new Date(), 1));
        endDateValue = endOfDay(subDays(new Date(), 1));
        setSelectedOption(
          `${selectedLang.yesterday}: ${format(
            startDateValue,
            "yyyy/MM/dd"
          )} 00:00:00 - ${format(endDateValue, "yyyy/MM/dd")} 23:59:59`
        );
        break;
      case "This Month":
        startDateValue = startOfMonth(new Date());
        endDateValue = endOfMonth(new Date());
        setSelectedOption(
          `${selectedLang.This_Month}: ${format(
            startDateValue,
            "yyyy/MM/dd"
          )} 00:00:00 - ${format(endDateValue, "yyyy/MM/dd")} 23:59:59`
        );
        break;
      case "Past Month":
        const today = new Date();
        endDateValue = endOfMonth(subMonths(today, 1));
        startDateValue = startOfMonth(subMonths(today, 1));
        setSelectedOption(
          `${selectedLang.Past_Month}: ${format(
            startDateValue,
            "yyyy/MM/dd"
          )} 00:00:00 - ${format(endDateValue, "yyyy/MM/dd")} 23:59:59`
        );
        break;
      case "Past 3 Months":
        const pastThreeMonthsEndDate = new Date();
        endDateValue = endOfMonth(pastThreeMonthsEndDate);
        startDateValue = startOfMonth(subMonths(pastThreeMonthsEndDate, 2));
        setSelectedOption(
          `${selectedLang.Past_3_months}: ${format(
            startDateValue,
            "yyyy/MM/dd"
          )} 00:00:00 - ${format(endDateValue, "yyyy/MM/dd")} 23:59:59`
        );
        break;
      default:
        setSelectedOption(selectedLang.any_date);
    }

    setStartDate(startDateValue);
    setEndDate(endDateValue);

    if (onDataFilter) {
      if (startDateValue && endDateValue) {
        onDataFilter(startDateValue, endDateValue);
      }
    }
  };

  const handleFlatpickrChange = (date, isStart) => {
    if (isStart) {
      setStartDate(date[0]);
    } else {
      const endDateWithTime = setEndOfDayTime(date[0]);
      setEndDate(endDateWithTime);
    }

    const newStartDate = isStart ? date[0] : startDate;
    const newEndDate = isStart ? endDate : setEndOfDayTime(date[0]);

    setSelectedOption(
      `${format(newStartDate, "yyyy/MM/dd HH:mm:ss")} - ${format(newEndDate, "yyyy/MM/dd HH:mm:ss")}`
    );

    if (onDataFilter) {
      onDataFilter(newStartDate, newEndDate);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      let node = event.target;
      let isCalendarClick = false;
      while (node && node !== document.body) {
        if (node.classList && node.classList.contains("flatpickr-calendar")) {
          isCalendarClick = true;
          break;
        }
        node = node.parentNode;
      }
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        !isCalendarClick
      ) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  return (
    <div className="datepikers newdate_picker">
      <div ref={dropdownRef} className="dropdown">
        <button
          className="btn btn-secondary dropdown-toggle"
          type="button"
          onClick={() => setDropdownOpen(!dropdownOpen)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="calendar-icon"
            width="30"
            height="30"
          >
            <path
              fillRule="evenodd"
              d="M6.75 2.25A.75.75 0 0 1 7.5 3v1.5h9V3A.75.75 0 0 1 18 3v1.5h.75a3 3 0 0 1 3 3v11.25a3 3 0 0 1-3 3H5.25a3 3 0 0 1-3-3V7.5a3 3 0 0 1 3-3H6V3a.75.75 0 0 1 .75-.75Zm13.5 9a1.5 1.5 0 0 0-1.5-1.5H5.25a1.5 1.5 0 0 0-1.5 1.5v7.5a1.5 1.5 0 0 0 1.5 1.5h13.5a1.5 1.5 0 0 0 1.5-1.5v-7.5Z"
              clipRule="evenodd"
            />
          </svg>

          <div className="date-wrapper" style={{ marginTop: "6px", color: "#fff" }}>
            {selectedOption || (
              <span className="dropdown-option-name">
                {selectedLang.any_date}
              </span>
            )}
          </div>

          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="dropdown-icon"
          >
            <path
              fillRule="evenodd"
              d="M12.53 16.28a.75.75 0 0 1-1.06 0l-7.5-7.5a.75.75 0 0 1 1.06-1.06L12 14.69l6.97-6.97a.75.75 0 1 1 1.06 1.06l-7.5 7.5Z"
              clipRule="evenodd"
            />
          </svg>
        </button>
        {dropdownOpen && (
          <div className="dropdown-menu show">
            <div className="date-picker-wrapper">
              <div className="datebox-wrapper">
                <Flatpickr
                  options={{
                    enableTime: true,
                    enableSeconds: true,
                  }}
                  value={startDate}
                  onChange={(date) => handleFlatpickrChange(date, true)}
                />

                <div className="divider"></div>
                <Flatpickr
                  options={{
                    enableTime: true,
                    enableSeconds: true,
                  }}
                  value={endDate}
                  onChange={(date) => handleFlatpickrChange(date, false)}
                />
              </div>
              <div className="dropdown-divider"></div>
              <div className="dropdown-options">
                <option onClick={() => handleDateChange("Today")}>
                  {selectedLang.today}
                </option>
                <option onClick={() => handleDateChange("Yesterday")}>
                  {selectedLang.yesterday}
                </option>
                <option onClick={() => handleDateChange("This Month")}>
                  {selectedLang.This_Month}
                </option>
                <option onClick={() => handleDateChange("Past Month")}>
                  {selectedLang.Past_Month}
                </option>
                <option onClick={() => handleDateChange("Past 3 Months")}>
                  {selectedLang.Past_3_months}
                </option>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DatePicker;
