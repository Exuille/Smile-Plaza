import React, {useState, useEffect} from 'react';
import '../../static/appointment.css'

import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from "@fullcalendar/interaction"


const Appointment = () => {
  const today = new Date();
  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const formattedDate = today.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const [selectedDate, setSelectedDate] = useState(formattedDate);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState("7:00-8:00");
  const [selectedService, setSelectedService] = useState("Dental Consultation");

  const timeSlots = [
    "8:00 AM",
    "8:30 AM",
    "9:00 AM",
    "9:30 AM",
    "10:00 AM",
    "10:30 AM",
    "11:00 AM",
    "11:30 AM",
    "12:00 PM",
    "12:30 PM",
    "1:00 PM",
    "1:30 PM",
    "2:00 PM",
    "2:30 PM",
    "3:00 PM",
    "3:30 PM",
    "4:00 PM",
    "4:30 PM",
    "5:00 PM",
  ]

  // sample
  const available = [
    "2025-05-07",
    "2025-05-13",
    "2025-05-12",
  ]

  const fewSlots = [
    "2025-05-05",
    "2025-05-20",
    "2025-05-24",
  ]

  const closed = [
    "2025-05-11",
    "2025-05-25",
    "2025-05-30",
  ]

  // available
  useEffect(() => {
    available.forEach(date => {
      const clickedCell = document.querySelector(`[data-date="${date}"]`);
      if (clickedCell) {
        clickedCell.style.backgroundColor = '#007bff';
        clickedCell.style.border = '2px solid #0c5460';
      }
    })
  }, [available])

  // few slots
  useEffect(() => {
    fewSlots.forEach(date => {
      const clickedCell = document.querySelector(`[data-date="${date}"]`);
      if (clickedCell) {
        clickedCell.style.backgroundColor = '#ffc107';
        clickedCell.style.border = '2px solid yellow';
      }
    })
  }, [fewSlots])

  //  no slot
  useEffect(() => {
    closed.forEach(date => {
      const clickedCell = document.querySelector(`[data-date="${date}"]`);
      if (clickedCell) {
        clickedCell.style.backgroundColor = '#e0e0e0';
        clickedCell.style.border = '2px solid #e0e0e0';
      }
    })
  }, [closed])

  const selectTimeSlot = (e) => {
    setSelectedTimeSlot(e.target.textContent)
  }

  const handleDateClick = (arg) => {
    today.setHours(0, 0, 0, 0);
    if (new Date(arg.dateStr) >= today) {
      document.querySelectorAll('.fc-daygrid-day').forEach(el => {
        el.style.backgroundColor = ''
        el.style.border = '';
      });

      const clickedCell = document.querySelector(`[data-date="${arg.dateStr}"]`);
      if (clickedCell) {
        clickedCell.style.backgroundColor = '#d1ecf1';
        clickedCell.style.border = '2px solid #0c5460';
      }

      const formattedDate = new Date(arg.dateStr).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
      setSelectedDate(formattedDate);
    } else {
      alert("Cant book earlier than today")
    }
  };

  const handleSelectChange = (e) => {
    setSelectedService(e.target.value);
  }

  const submit = () => {
    console.log(selectedDate, selectedTimeSlot, selectedService);
  }


  return (
    <div className="appointment-container">
      <h1>Book Appointments</h1>
      <div className="legend-container">
        <p><span className="legend-box blue"></span>Available</p>
        <p><span className="legend-box yellow"></span>Few slots left</p>
        <p><span className="legend-box gray"></span>Slot allocation exhausted/Closed</p>
      </div>
      <div className="appointment-container-main">
        <div className="appointment-calendar-container">
          <FullCalendar
            plugins={[ dayGridPlugin, interactionPlugin ]}
            dateClick={handleDateClick}
            initialView="dayGridMonth"
            validRange={{
              start: firstDayOfMonth,
            }}
          />
        </div>

        <div className="appointment-available">
          <p>Available Time Slots for: <strong style={{whiteSpace: "nowrap"}}>{selectedDate}</strong></p>
          <div className="available-time">
            {timeSlots ? 
              timeSlots.map((time, index) => {
                return (
                  <button key={index}>{time}</button>
                )
              })
              :
              null
            }
          </div>
          <div className="appointment-footer">
            <p>Selected Time Slot: <strong style={{whiteSpace: "nowrap"}}>{selectedTimeSlot}</strong></p>
            <select value={selectedService} onChange={handleSelectChange}>
              <option value="Dental Consultation">Dental Consultation</option>
              <option value="Dental Consultation1">Dental Consultation1</option>
              <option value="Dental Consultation2">Dental Consultation2</option>
              <option value="Dental Consultation3">Dental Consultation3</option>
              <option value="Dental Consultation4">Dental Consultation4</option>
            </select>
            <button onClick={submit}>Submit</button>
          </div>
        </div>
      </div>      
    </div>
  );
};

export default Appointment;
