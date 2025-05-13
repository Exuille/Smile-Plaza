import React, {useState, useRef, useEffect} from 'react';
import "../../static/announcementAdmin.css"
import axios from "axios";

const Announcement = ({data}) => {
  const token = data.token;

  const halfDayAMstartTime = "08:00";
  const halfDayAMendTime = "13:00";
  const halfDayPMstartTime = "13:00";
  const halfDayPMendTime = "17:00";

  const [popupOpen, setPopupOpen] = useState(false);
  const [popupAdd, setPopupAdd] = useState(true);
  const [selectedTag, setSelectedTag] = useState("promo");
  const [selectedTime, setSelectedTime] = useState("fullDay");
  const [selectedPriority, setSelectedPriority] = useState("normal");

  const [filteredTag, setFilteredTag] = useState("");
  const [filteredPriority, setFilteredPriority] = useState("");

  const [announcementId, setAnnouncementId] = useState(null);
  const [title, setTitle] = useState(null);
  const [date, setDate] = useState(null);
  const [content, setContent] = useState(null);

  const [announcements, setAnnouncements] = useState(null);

  const titleInpRef = useRef();
  const dateInpRef = useRef();
  const contentInpRef = useRef();

  useEffect(() => {
    const getAllAnnouncements = async () => {
      try {
        const res = await axios.get("http://localhost:3001/announcement", {
          headers: {Authorization: `Bearer ${token}`},
          params: {priority: filteredPriority, tag: filteredTag}
        });
        if (res.data.status == "success") {
          setAnnouncements(res.data.data.announcements)
        }
      } catch (err) {
        console.log(err)
      }
    }

    getAllAnnouncements();
  }, [announcementId, filteredTag, filteredPriority])

  const to12HourFormat = (time24) => {
    const [hour, minute] = time24.split(':').map(Number);
    const period = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 === 0 ? 12 : hour % 12;
    return `${hour12}:${minute.toString().padStart(2, '0')} ${period}`;
  }

  const filterTag = (e) => {
    setFilteredTag(e.target.value)
  }

  const filterPriority = (e) => {
    setFilteredPriority(e.target.value)
  }

  const edit = (idx) => {
    if (idx) {
      // update announcement
      console.log(announcements[idx])
      const date = new Date(announcements[idx]["dateTime"]);
      const dateValue = date.toISOString().split('T')[0];

      setAnnouncementId(announcements[idx]["announcementID"])
      setTitle(announcements[idx]["title"])
      setSelectedTag(announcements[idx]["tag"])
      setSelectedPriority(announcements[idx]["priority"])
      setDate(dateValue)
      setContent(announcements[idx]["content"])
    } else {
      // create new announcement
      setAnnouncementId(null)
      setTitle(null)
      setSelectedPriority("normal")
      setSelectedTag("promo");
      setDate(null)
      setContent(null)
    }
    setPopupOpen(true)
  }

  const deleteAppointment = async (idx) => {
    const id = announcements[idx]["announcementID"]

    try {
      const res = await axios.delete(`http://localhost:3001/announcement/${id}`, {
        headers: {Authorization: `Bearer ${token}`},
        params: {id}
      })

      // TODO add popup confirmation btn
      console.log(res.data)
      setAnnouncements(prev => {
        const newData = {...prev};
        delete newData[idx];
        return newData;
      })
    } catch (err) {
      console.log(err)
    }
  }

  const selectTag = (e) => {
    setSelectedTag(e.target.value);
  }

  const selectPriority = (e) => {
    setSelectedPriority(e.target.value);
  }

  const selectTime = (e) => {
    setSelectedTime(e.target.value);
  }

  const save = async () => {
    if (announcementId) {
      // update announcement
      console.log(
        titleInpRef.current.value,
        selectedTag,
        selectedPriority,
        dateInpRef.current.value, 
        contentInpRef.current.value, 
      );
      if (new Date(dateInpRef.current.value) < new Date()) {
        alert("Can't book past date")
        return;
      }

      if (selectedTag == "holiday") {
        console.log('call holiday route')
        try {
          const res = await axios.put(`http://localhost:3001/holiday/${announcementId}`, {

          })
        } catch(err) {
          console.log(err)
        }
      } else {
        try {
          const res = await axios.put(`http://localhost:3001/announcement/${announcementId}`, {
            "title": titleInpRef.current.value, 
            "content": contentInpRef.current.value, 
            "date": dateInpRef.current.value, 
            "priority": selectedPriority, 
            "tag": selectedTag
          }, {headers: {
            Authorization: `Bearer ${token}`
          }})

          console.log(res.data)
        } catch(err) {
          console.log(err)
        }
      }

    } else {
      // add new announcement
      if (new Date(date) < new Date()) {
        alert("Can't book past date")
        return;
      }

      try {
        console.log(selectedTag)
        let res;
        let startTime, endTime, isFullDay;
        if (selectedTime == "fullDay") {
          isFullDay = true
        } else {
          isFullDay = false
          if (selectedTime == "halfDayAM") {
            startTime = halfDayAMstartTime
            endTime = halfDayAMendTime
          } else if (selectedTime == "halfDayPM") {
            startTime = halfDayPMstartTime
            endTime = halfDayPMendTime
          }
        }
        if (selectedTag == "holiday") {
          console.log(title, content, date, selectedTime, startTime, endTime);
          res = await axios.post("http://localhost:3001/holiday/create", {
            title, "description": content, date, isFullDay, startTime, endTime
          }, {headers : {
            Authorization: `Bearer ${token}`
          }})
        } else {
          res = await axios.post("http://localhost:3001/announcement/create", {
            title, content, date, "priority": selectedPriority, "tag": selectedTag
          }, {headers: {
            Authorization: `Bearer ${token}`
          }})
        }

        console.log(res)
        alert("saved");
        location.reload()
      } catch(err) {
        console.log(err)
      }
    }

    setSelectedTag("promo");
    setSelectedPriority("normal")
    setAnnouncementId(null);
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
            <div className="popup-content-heading">
              {announcementId ? 
                <h1>Announcement ID: {announcementId}</h1>
                : 
                <h1>New Announcement</h1>
              }
            </div>
            <div className="inp-container">
              <label>Title: </label>
              <input value={title ? title : ""} id="title" ref={titleInpRef} onChange={changeValue} />
            </div>
            {announcementId ? 
              <div className="inp-container">
                <h3>Tag: {selectedTag}</h3>
              </div>
            : 
              <div className="inp-container">
                <label>Tag: </label>
                <select onChange={selectTag} value={selectedTag}>
                  <option onChange={selectTag} value="promo">Promo</option>
                  <option onChange={selectTag} value="holiday">Holiday</option>
                  <option onChange={selectTag} value="others">Others</option>
                </select>
              </div>
            }
            <div className="inp-container">
              <label>Time: </label>
              <select onChange={selectTime} value={selectedTime}>
                <option onChange={selectTime} value="fullDay">Full Day</option>
                <option onChange={selectTime} value="halfDayAM">Half Day (8:00 AM - 1:00 PM)</option>
                <option onChange={selectTime} value="halfDayPM">Half Day (1:00 PM - 5:00 PM)</option>
              </select>
            </div>
            <div className="inp-container">
              <label>Date: </label>
              <input type="date" value={date ? date : ""} id="date" ref={dateInpRef} onChange={changeValue} />
            </div>
            {selectedTag && selectedTag == "holiday" ?
              null
            :
              <div className="inp-container">
                <label>Priority: </label>
                <select onChange={selectPriority} value={selectedPriority}>
                  <option onChange={selectPriority} value="normal">Normal</option>
                  <option onChange={selectPriority} value="important">Important</option>
                  <option onChange={selectPriority} value="urgent">Urgent</option>
                </select>
              </div>
            }
            <div className="inp-container">
              <label>Content: </label>
              <input value={content ? content : ""} id="content" ref={contentInpRef} onChange={changeValue} />
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
            <button id="add" onClick={() => edit()}>Add New Announcement</button>
          </div>
          <div className="filter-container">
            <div>
              <label>Tag: </label>
              <select onChange={filterTag} value={filteredTag}>
                <option onChange={filterTag} value="">All</option>
                <option onChange={filterTag} value="promo">Promo</option>
                <option onChange={filterTag} value="holiday">Holiday</option>
                <option onChange={filterTag} value="others">Others</option>
              </select>
            </div>
            <div>
            </div>
            <div>
              <label>Priority: </label>
              <select onChange={filterPriority} value={filteredPriority}>
                <option onChange={filterPriority} value="">All</option>
                <option onChange={filterPriority} value="normal">Normal</option>
                <option onChange={filterPriority} value="important">Important</option>
                <option onChange={filterPriority} value="urgent">Urgent</option>
              </select>
            </div>
          </div>
          {announcements ? 
            Object.keys(announcements).map((idx) => {
              return (
                <div key={idx} className="announcement-content-container">
                  <div className="announcement-title-container">
                    <h2>{announcements[idx]["title"]}</h2>
                    <div className="update-btn-container">
                      <button id="edit" onClick={() => edit(idx)} className="green-btn"><i className='bx bx-edit-alt'></i></button>
                      <button onClick={() => deleteAppointment(idx)} className="red-btn"><i className='bx bx-trash' ></i></button>
                    </div>
                  </div>
                  <h3>
                  {
                    new Date(announcements[idx]['dateTime']).toLocaleString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      timeZone: 'UTC'
                    }) 
                  } | {announcements[idx]['timeRange'] == "fullDay" ? (
                      `${to12HourFormat(halfDayAMstartTime)} - ${to12HourFormat(halfDayPMendTime)}`
                    ) : (
                      announcements[idx]['timeRange'] == "halfDayAM" ? (
                        `${to12HourFormat(halfDayAMstartTime)} - ${to12HourFormat(halfDayAMendTime)}`
                      ) : (
                        `${to12HourFormat(halfDayPMstartTime)} - ${to12HourFormat(halfDayPMendTime)}`
                      )
                    )
                  }
                  </h3>
                  <div className="tags-container">
                    <h3 className="filter-priority">{announcements[idx]["priority"]}</h3>
                    <h3 className="filter-tag">{announcements[idx]["tag"]}</h3>
                  </div>
                  <div className="announcement-content">
                    <p><span>{announcements[idx]['content']}</span></p>
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