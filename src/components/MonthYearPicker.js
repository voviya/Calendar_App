import React, { useRef, useEffect } from "react";
import "./MonthYearPicker.css";

const MonthYearPicker = ({
  pickerMode,
  setPickerMode,
  tempYear,
  setTempYear,
  monthYear,
  setMonthYear,
  setShowMonthYearPicker,
  yearRangeStart,
  setYearRangeStart,
  YEAR_RANGE_SIZE,
  today,
  monthNames
}) => {
  const years = [];
  for (let y = yearRangeStart; y < yearRangeStart + YEAR_RANGE_SIZE; y++) years.push(y);

  const handleMonthYearSelect = (month, year) => {
    setMonthYear({ month, year });
    setShowMonthYearPicker(false);
    setPickerMode("month"); 
  };

  const ArrowButton = ({ direction, onClick, disabled }) => (
    <button
      className="month-nav"
      onClick={onClick}
      disabled={disabled}
      aria-label={direction === "left" ? "Previous" : "Next"}
    >
      {direction === "left" ? "‹" : "›"}
    </button>
  );

  const popupRef = useRef(null);
  useEffect(() => {
    function handleClickOutside(event) {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setShowMonthYearPicker(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [setShowMonthYearPicker]);

  return (
    <div
      className="month-year-select-popup"
      style={{ maxWidth: 320, zIndex: 10 }}
      ref={popupRef}
    >
      <div className="picker-header">
        {pickerMode === "month" ? (
          <button
            className="header-btn"
            onClick={() => setPickerMode("year")}
          >
            {tempYear}
          </button>
        ) : (
          <div className="year-range-nav">
            <ArrowButton
              direction="left"
              onClick={() => setYearRangeStart(yearRangeStart - YEAR_RANGE_SIZE)}
              disabled={yearRangeStart <= today.getFullYear() - 50}
            />
            <span className="year-range-label">
              {years[0]} - {years[years.length - 1]}
            </span>
            <ArrowButton
              direction="right"
              onClick={() => setYearRangeStart(yearRangeStart + YEAR_RANGE_SIZE)}
              disabled={yearRangeStart + YEAR_RANGE_SIZE > today.getFullYear() + 20}
            />
          </div>
        )}
      </div>
      {pickerMode === "year" ? (
        <div className="year-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
          {years.map((y) => (
            <div
              key={y}
              className={`year-option${y === tempYear ? " selected" : ""}`}
              onClick={() => {
                setTempYear(y);
                setPickerMode("month");
              }}
              style={{ cursor: "pointer", padding: 6 }}
            >
              {y}
            </div>
          ))}
        </div>
      ) : (
        <div className="month-grid">
          {monthNames.map((m, idx) => (
            <div
              key={m}
              className={`month-option${
                idx === monthYear.month && tempYear === monthYear.year
                  ? " selected"
                  : ""
              }${idx === today.getMonth() && tempYear === today.getFullYear()
                  ? " current"
                  : ""}`}
              onClick={() => {
                handleMonthYearSelect(idx, tempYear);
              }}
            >
              {m}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MonthYearPicker;
             
