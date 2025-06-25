import React from "react";
import "./EventPopupModal.css";

const formatTime12 = (time24) => {
  if (!time24) return "";
  let [h, m] = time24.split(":");
  h = parseInt(h, 10);
  const ampm = h >= 12 ? "PM" : "AM";
  h = h % 12;
  if (h === 0) h = 12;
  return `${h}:${m.padStart(2, "0")} ${ampm}`;
};

const EventPopupModal = ({
  selectedDayLabel,
  selectedDayEvents,
  onClose
}) => (
  <div
    className="modal-overlay blur-bg"
    onClick={onClose}
  >
    <div
      className="event-popup-modal"
      onClick={e => e.stopPropagation()}
    >
      <button
        className="modal-close"
        onClick={onClose}
        aria-label="Close"
      >×</button>
      <strong>{selectedDayLabel}</strong>
      <div className="event-popup-list">
        {selectedDayEvents.length === 0 ? (
          <span className="event-popup-empty">No events</span>
        ) : (
          selectedDayEvents.map((ev, idx) => (
            <div key={idx} className="event-popup-item">
              <div className="event-popup-title">{ev.title}</div>
              <div className="event-popup-time">
                {ev.time ? formatTime12(ev.time) : ""}
                {ev.duration && !isNaN(ev.duration) && ev.duration !== "" 
                  ? ` • ${ev.duration}h`
                  : ev.duration && ev.time
                    ? ` • ${ev.duration}`
                    : ev.duration && !ev.time
                      ? `${ev.duration}${!isNaN(ev.duration) ? "h" : ""}`
                      : ""}
              </div>
            </div>
          ))
        )}
        {selectedDayEvents.length > 1 && selectedDayEvents.some((e, i, arr) =>
          arr.findIndex(ev => ev.time === e.time && e.time) !== i
        ) && (
          <div className="event-popup-conflict">
            ⚠️ Event time conflict!
          </div>
        )}
      </div>
    </div>
  </div>
);

export default EventPopupModal;
