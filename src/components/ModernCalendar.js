import React, { useState } from "react";
import { FiSettings } from "react-icons/fi";
import eventsData from "../events.json";
import "./ModernCalendar.css";
import MonthYearPicker from "./MonthYearPicker";
import EventPopupModal from "./EventPopupModal";
import NewEventModal from "./NewEventModal";

const weekdays = ["Tue", "Wed", "Thu", "Fri", "Sat", "Sun", "Mon"];
const monthNames = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

function getMonthMatrix(year, month) {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);

  const daysInMonth = lastDay.getDate();
  const startDayOfWeek = firstDay.getDay();
  const weeks = [];
  let week = [];

  for (let i = 0; i < startDayOfWeek; i++) {
    week.push(null);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    week.push({
      date: new Date(year, month, day),
      currentMonth: true,
    });
    if (week.length === 7) {
      weeks.push(week);
      week = [];
    }
  }

  while (week.length > 0 && week.length < 7) {
    week.push(null);
  }
  if (week.length) weeks.push(week);

  return weeks;
}

const formatTime12 = (time24) => {
  if (!time24) return "";
  let [h, m] = time24.split(":");
  h = parseInt(h, 10);
  const ampm = h >= 12 ? "PM" : "AM";
  h = h % 12;
  if (h === 0) h = 12;
  return `${h}:${m.padStart(2, "0")} ${ampm}`;
};

const parseTime12To24 = (time, ampm) => {
  if (!time) return "";
  let [h, m] = time.split(":");
  h = parseInt(h, 10);
  if (ampm === "PM" && h !== 12) h += 12;
  if (ampm === "AM" && h === 12) h = 0;
  return `${h.toString().padStart(2, "0")}:${m.padStart(2, "0")}`;
};

const ModernCalendar = () => {
  const today = new Date();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [view, setView] = useState("monthly");
  const [monthYear, setMonthYear] = useState({
    year: new Date().getFullYear(),
    month: new Date().getMonth(),
  });
  const [showEventInput, setShowEventInput] = useState(false);
  const [newEvent, setNewEvent] = useState({ title: "", time: "", duration: "" });
  const [newEventAmPm, setNewEventAmPm] = useState("AM");
  const [allEvents, setAllEvents] = useState(eventsData);
  const [showMonthYearPicker, setShowMonthYearPicker] = useState(false);
  const [pickerMode, setPickerMode] = useState("year");
  const [tempYear, setTempYear] = useState(new Date().getFullYear());
 
  const YEAR_RANGE_SIZE = 12;
  const [yearRangeStart, setYearRangeStart] = useState(
    Math.floor(new Date().getFullYear() / YEAR_RANGE_SIZE) * YEAR_RANGE_SIZE
  );

  const getEventsForDate = (date) => {
    const dateStr = date.toISOString().split("T")[0];
    return allEvents.filter(e => e.date === dateStr);
  };

  const hasConflict = (date) => {
    const events = getEventsForDate(date);
    const times = {};
    for (const ev of events) {
      if (ev.time) {
        if (times[ev.time]) return true;
        times[ev.time] = true;
      }
    }
    return false;
  };

  const [selectedDayEvents, setSelectedDayEvents] = useState([]);
  const [selectedDayLabel, setSelectedDayLabel] = useState("");
  const [showEventPopup, setShowEventPopup] = useState(false);

  const handleDateSelect = (date) => {
    const events = getEventsForDate(date);
    setSelectedDate(date);
    setSelectedDayEvents(events);
    setSelectedDayLabel(date.toLocaleDateString(undefined, { month: "long", day: "numeric", year: "numeric" }));
   
    if (events.length > 0) setShowEventPopup(true);
    else setShowEventPopup(false);
  };

  const getWeekDates = () => {
    const week = [];
    const dayOfWeek = selectedDate.getDay(); 
   
    const offset = ((dayOfWeek + 6) % 7) - 1; 
    const startDay = new Date(selectedDate);
    startDay.setDate(selectedDate.getDate() - offset);

    for (let i = 0; i < 7; i++) {
      const date = new Date(startDay);
      date.setDate(startDay.getDate() + i);
      week.push(date);
    }
    return week;
  };

  const weekDates = getWeekDates();

  const handlePrevMonth = () => {
    setMonthYear(({ year, month }) => {
      if (month === 0) return { year: year - 1, month: 11 };
      return { year, month: month - 1 };
    });
  };
  const handleNextMonth = () => {
    setMonthYear(({ year, month }) => {
      if (month === 11) return { year: year + 1, month: 0 };
      return { year, month: month + 1 };
    });
  };

  const handleAddEvent = (e) => {
    e.preventDefault();
    if (!newEvent.title) return;
    let eventTime = newEvent.time;
    if (eventTime) {
      eventTime = parseTime12To24(newEvent.time, newEventAmPm);
    }
    setAllEvents([
      ...allEvents,
      {
        ...newEvent,
        time: eventTime,
        date: selectedDate.toISOString().split("T")[0],
      },
    ]);
    setNewEvent({ title: "", time: "", duration: "" });
    setNewEventAmPm("AM");
    setShowEventInput(false);
  };

  const years = [];
  for (let y = yearRangeStart; y < yearRangeStart + YEAR_RANGE_SIZE; y++) years.push(y);

  const handleMonthYearSelect = (month, year) => {
    setMonthYear({ month, year });
    setShowMonthYearPicker(false);
  };

  const ArrowButton = ({ direction, onClick, disabled }) => (
    <button
      className="month-nav"
      onClick={onClick}
      disabled={disabled}
      aria-label={direction === "left" ? "Previous" : "Next"}
    >
      {direction === "left" ? "<" : ">"}
    </button>
  );

  const goToToday = () => {
    const now = new Date();
    setMonthYear({ year: now.getFullYear(), month: now.getMonth() });
    setSelectedDate(now);
    setShowMonthYearPicker(false);
  };

  return (
    <div className="calendar-card">
    
      <h1
        className="calendar-title"
        style={{ textAlign: "center", cursor: "pointer" }}
        onClick={goToToday}
        title="Go to current month"
      >
        CALENDAR
      </h1>
  
      <div className="toggle-btn-wrap">
        <button
          className={`toggle-btn${view === "weekly" ? " active" : ""}`}
          onClick={() => setView("weekly")}
        >
          Weekly
        </button>
        <button
          className={`toggle-btn${view === "monthly" ? " active" : ""}`}
          onClick={() => setView("monthly")}
        >
          Monthly
        </button>
      </div>

    
      {view === "weekly" && (
        <>
          <div className="month-day">
            <span className="month">{selectedDate.toLocaleString("default", { month: "long" })}</span>
            <span className="day">{selectedDate.getDate()}</span>
          </div>
          <div className="week-row">
            {weekdays.map((day, i) => {
              const date = getWeekDates()[i];
              const isSelected = date.toDateString() === selectedDate.toDateString();
             
              const events = getEventsForDate(date);
              const conflict = hasConflict(date);
              return (
                <div
                  key={i}
                  className="week-day"
                  onClick={() => {
                    setSelectedDate(date);
                    handleDateSelect(date);
                  }}
                  style={{ cursor: events.length > 0 ? "pointer" : "default" }}
                >
                  <span className="day-name">{day}</span>
                  <span className={`day-number${isSelected ? " selected" : ""}`}>
                    {date.getDate()}
                  </span>
               
                  <div className="event-dots">
                    {events.length > 2 ? (
                      <span
                        className="event-dot important-symbol"
                        title="Important: Multiple events"
                      >&#33;</span>
                    ) : (
                      events.slice(0, 2).map((ev, idx) => (
                        <span
                          key={idx}
                          className={`event-dot${conflict ? " conflict" : ""}`}
                          title={ev.title}
                        ></span>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {view === "monthly" && (
        <div>
          <div className="month-header">
            <ArrowButton direction="left" onClick={handlePrevMonth} />
          
            {!showMonthYearPicker ? (
              <h2
                className="month-year-label"
                onClick={() => {
                  setPickerMode("year");
                  setTempYear(monthYear.year);
                  setShowMonthYearPicker(true);
                }}
                title="Select month and year"
              >
                {monthNames[monthYear.month]} {monthYear.year}
              </h2>
            ) : (
              <MonthYearPicker
                pickerMode={pickerMode}
                setPickerMode={setPickerMode}
                tempYear={tempYear}
                setTempYear={setTempYear}
                monthYear={monthYear}
                setMonthYear={setMonthYear}
                setShowMonthYearPicker={setShowMonthYearPicker}
                yearRangeStart={yearRangeStart}
                setYearRangeStart={setYearRangeStart}
                YEAR_RANGE_SIZE={YEAR_RANGE_SIZE}
                today={today}
                monthNames={monthNames}
              />
            )}
            <ArrowButton direction="right" onClick={handleNextMonth} />
          </div>
          <table className="calendar-table">
            <thead>
              <tr>
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
                  <th key={d}>{d}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {getMonthMatrix(monthYear.year, monthYear.month).map((week, i) => (
                <tr key={i}>
                  {week.map((dayObj, j) => {
                    if (!dayObj) {
                      return <td key={j} className="empty-cell"></td>;
                    }
                    const isToday = (() => {
                      const now = new Date();
                      return (
                        dayObj.date.getFullYear() === now.getFullYear() &&
                        dayObj.date.getMonth() === now.getMonth() &&
                        dayObj.date.getDate() === now.getDate()
                      );
                    })();
                    const events = getEventsForDate(dayObj.date);
                    const conflict = hasConflict(dayObj.date);
                    return (
                      <td
                        key={j}
                        className={[
                          "current-month",
                          isToday ? "today" : "",
                          conflict ? "conflict" : ""
                        ].join(" ")}
                        onClick={() => handleDateSelect(dayObj.date)}
                        style={{ cursor: events.length > 0 ? "pointer" : "default" }}
                      >
                        <span className="cell-day">{dayObj.date.getDate()}</span>
                       
                        <div className="event-dots">
                          {events.length > 2 ? (
                            <span
                              className="event-dot important-symbol"
                              title="Important: Multiple events"
                            >&#33;</span>
                          ) : (
                           
                            events.slice(0, 2).map((ev, idx) => (
                              <span
                                key={idx}
                                className={`event-dot${conflict ? " conflict" : ""}`}
                                title={ev.title}
                              ></span>
                            ))
                          )}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showEventPopup && (
        <EventPopupModal
          selectedDayLabel={selectedDayLabel}
          selectedDayEvents={selectedDayEvents}
          onClose={() => setShowEventPopup(false)}
        />
      )}

     
      <div className="footer">
        <button
          className="new-event"
          onClick={() => setShowEventInput(true)}
        >
          <span className="new-event-plus">+</span>
          New Event
        </button>
      </div>
<br></br>
     
      {showEventInput && (
        <NewEventModal
          newEvent={newEvent}
          setNewEvent={setNewEvent}
          newEventAmPm={newEventAmPm}
          setNewEventAmPm={setNewEventAmPm}
          handleAddEvent={handleAddEvent}
          onClose={() => setShowEventInput(false)}
        />
      )}
    </div>
  );
};

export default ModernCalendar;