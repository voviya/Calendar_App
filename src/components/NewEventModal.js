import React from "react";
import "./NewEventModal.css";

const NewEventModal = ({
  newEvent,
  setNewEvent,
  newEventAmPm,
  setNewEventAmPm,
  handleAddEvent,
  onClose
}) => (
  <div
    className="modal-overlay blur-bg"
    onClick={onClose}
  >
    <form
      className="new-event-modal"
      onClick={e => e.stopPropagation()}
      onSubmit={handleAddEvent}
    >
      <h3>Add New Event</h3>
      <input
        type="text"
        placeholder="Event title"
        value={newEvent.title}
        onChange={e => setNewEvent(ev => ({ ...ev, title: e.target.value }))}
        required
      />
      <div className="new-event-time-row">
        <input
          type="text"
          pattern="^(0?[1-9]|1[0-2]):[0-5][0-9]$"
          placeholder="hh:mm"
          value={newEvent.time}
          onChange={e => setNewEvent(ev => ({ ...ev, time: e.target.value }))}
          className="new-event-time-input"
          required={false}
          maxLength={5}
          title="Enter time in hh:mm format"
        />
        <select
          value={newEventAmPm}
          onChange={e => setNewEventAmPm(e.target.value)}
          className="new-event-ampm-select"
        >
          <option value="AM">AM</option>
          <option value="PM">PM</option>
        </select>
      </div>
      <input
        type="text"
        placeholder="Duration(in hours)"
        value={newEvent.duration}
        onChange={e => setNewEvent(ev => ({ ...ev, duration: e.target.value }))}
      />
      <div className="new-event-modal-actions">
        <button type="submit" className="add-btn">Add</button>
        <button type="button" className="cancel-btn" onClick={onClose}>Cancel</button>
      </div>
    </form>
  </div>
);

export default NewEventModal;

