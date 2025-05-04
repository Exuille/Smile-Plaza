import React, {useState, useRef} from 'react';
import "../../static/announcementAdmin.css"

const Announcement = () => {
  const [popupOpen, setPopupOpen] = useState(false);
  const [popupAdd, setPopupAdd] = useState(true);
  const [selectedTag, setSelectedTag] = useState("promo");

  const [appointmentId, setAppointmentId] = useState(null);
  const [title, setTitle] = useState(null);
  const [date, setDate] = useState(null);
  const [content, setContent] = useState(null);

  const titleInpRef = useRef();
  const dateInpRef = useRef();
  const contentInpRef = useRef();

  const appointments = {
    "1" : {
      "title": "title1",
      "tag": "promo",
      "date": "2025-05-31",
      "content": "can anybody find me somebody to love"
    }, "2" : {
      "title": "title2",
      "tag": "holiday",
      "date": "2025-05-12",
      "content": "can anybody find me somebody to love"
    }, "3" : {
      "title": "title3",
      "tag": "holiday",
      "date": "2025-05-19",
      "content": "can anybody find me somebody to love"
    }
  }

  const edit = (e, appointmentId) => {
    if (appointmentId) {
      setAppointmentId(appointmentId)
      setTitle(appointments[appointmentId]["title"])
      setSelectedTag(appointments[appointmentId]["tag"])
      setDate(appointments[appointmentId]["date"])
      setContent(appointments[appointmentId]["content"])
    } else {
      setAppointmentId(null)
      setTitle(null)
      setSelectedTag("promo");
      setDate(null)
      setContent(null)
    }
    setPopupOpen(true)
  }

  const selectTag = (e) => {
    setSelectedTag(e.target.value)
  }

  const save = () => {
    if (appointmentId) {
      // update announcement
      console.log(
        titleInpRef.current.value,
        selectedTag,
        dateInpRef.current.value, 
        contentInpRef.current.value, 
      );
      if (new Date(dateInpRef.current.value) < new Date()) {
        alert("Can't book past date")
        return;
      }
    } else {
      // add new announcement
      console.log(
        selectedTag,
        title,
        content,
        date,
      );
      if (new Date(date) < new Date()) {
        alert("Can't book past date")
        return;
      }
    }
    alert("saved");
    setSelectedTag("promo");
    setAppointmentId(null);
    setPopupOpen(false);
  }

  const cancel = () => {
    setPopupOpen(false)
  }

  const changeValue = (e) => {
    if (e.target.id == "title") {
      setTitle(e.target.value)
    } else if (e.target.id == "date") {
      setDate(e.target.value)
    } else if (e.target.id == "content") {
      setContent(e.target.value)
    }
  }

  return (
    <div className="announcement-container-admin">
      {popupOpen ? 
        <div className="popup">
          <div className="popup-content">
            {appointmentId ? 
              <h2>Announcement ID: {appointmentId}</h2>
              : 
              <h2>New Announcement</h2>
            }
            <div>
              <label>Announcement: </label>
              <input value={title} id="title" ref={titleInpRef} onChange={changeValue} />
            </div>
            <div>
              <label>Tag: </label>
              <select onChange={selectTag} value={selectedTag}>
                <option onChange={selectTag} value="promo">Promo</option>
                <option onChange={selectTag} value="holiday">Holiday</option>
                <option onChange={selectTag} value="others">Others</option>
              </select>
            </div>
            <div>
              <label>Date: </label>
              <input type="date" value={date} id="date" ref={dateInpRef} onChange={changeValue} />
            </div>
            <div>
              <label>Content: </label>
              <input value={content} id="content" ref={contentInpRef} onChange={changeValue} />
            </div>
            <div className="popup-btns">
              <button className="red-btn" onClick={cancel}>Cancel</button>
              <button className="green-btn" onClick={save}>Save</button>
            </div>
          </div>
        </div> 
        :
        <div className="announcement-content-main">  
          <h1>Announcements</h1>
          <div className="announcement-btn-container">
            <button id="add" onClick={edit}>Add New Announcement</button>
          </div>
          {appointments ? 
            Object.keys(appointments).map((appointmentId, idx) => {
              return (
                <div key={appointmentId} className="announcement-content-container">
                  <div className="announcement-title-container">
                    <h2 className="announcement-title">{appointments[appointmentId]["title"]} | {appointments[appointmentId]["tag"]}</h2>
                    <div className="update-btn-container">
                      <button id="edit" onClick={(e) => edit(e, appointmentId)} className="green-btn">Edit</button>
                      <button className="red-btn">Delete</button>
                    </div>
                  </div>
                  <div className="announcement-content">
                    <h3>{appointments[appointmentId]['date']}</h3>
                    <p>{appointments[appointmentId]['content']}</p>
                  </div>
                </div>
              )
            })
          : 
            null
          }
        </div> 
      }
    </div>
  );
};

export default Announcement;