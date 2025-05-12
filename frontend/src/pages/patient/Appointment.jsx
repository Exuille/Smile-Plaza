import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../static/appointment.css';

import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';

const Appointment = () => {
  const navigate = useNavigate();
  const today = new Date();
  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

  const [selectedDate, setSelectedDate] = useState(null); // store as Date object
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('');
  const [selectedService, setSelectedService] = useState('Dental Consultation');
  const [availableTimes, setAvailableTimes] = useState([]);


  const fetchAvailableTimes = async (dateStr) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3001/appointment/availableTime?date=${dateStr}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Fetched data:', data);

        setAvailableTimes(data.availableTimes || []);
      } else {
        console.error('Failed to fetch available times');
        setAvailableTimes([]);
      }
    } catch (error) {
      console.error('Error fetching available times:', error);
      setAvailableTimes([]);
    }
  };

  const handleDateClick = (arg) => {
    const clickedDate = new Date(arg.dateStr);
    today.setHours(0, 0, 0, 0);

    if (clickedDate >= today) {
      document.querySelectorAll('.fc-daygrid-day').forEach(el => {
        el.style.backgroundColor = '';
        el.style.border = '';
      });

      const clickedCell = document.querySelector(`[data-date="${arg.dateStr}"]`);
      if (clickedCell) {
        clickedCell.style.backgroundColor = '#d1ecf1';
        clickedCell.style.border = '2px solid #0c5460';
      }

      setSelectedDate(clickedDate);
      fetchAvailableTimes(arg.dateStr);
    } else {
      alert('Cannot book earlier than today');
    }
  };

  const handleSelectChange = (e) => {
    setSelectedService(e.target.value);
  };

  const submit = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('User not authenticated');
      }
  
      if (!selectedDate || !selectedTimeSlot) {
        alert("Please select both date and time");
        return;
      }
  
      const response = await fetch('http://localhost:3001/appointment/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          selectedDate: selectedDate.toISOString().split('T')[0],
          selectedTimeSlot: selectedTimeSlot,                     
          service: selectedService,
        }),
      });
  
      if (response.ok) {
        const data = await response.json();
        console.log('Appointment created:', data);
        alert('Appointment booked successfully!');
        navigate('/dashboard');
      } else {
        const errorData = await response.json();
        console.error('Failed to create appointment:', errorData);
        alert(errorData.message || 'Failed to create appointment');
      }
    } catch (error) {
      console.error('Error creating appointment:', error);
      alert('Error creating appointment');
    }
  };  

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
            plugins={[dayGridPlugin, interactionPlugin]}
            dateClick={handleDateClick}
            initialView="dayGridMonth"
            validRange={{
              start: firstDayOfMonth,
            }}
          />
        </div>

        <div className="appointment-available">
          <p>
            Available Time Slots for:{" "}
            <strong style={{ whiteSpace: "nowrap" }}>
              {selectedDate
                ? selectedDate.toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })
                : 'None'}
            </strong>
          </p>
          <div className="available-time">
            {availableTimes.length > 0 ? (
              availableTimes.map((time, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedTimeSlot(time)}
                  className={selectedTimeSlot === time ? 'selected-time' : ''}
                >
                  {time}
                </button>
              ))
            ) : (
              <p>No available time slots.</p>
            )}
          </div>
          <div className="appointment-footer">
            <p>
              Selected Time Slot:{" "}
              <strong style={{ whiteSpace: "nowrap" }}>{selectedTimeSlot || 'None'}</strong>
            </p>
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
