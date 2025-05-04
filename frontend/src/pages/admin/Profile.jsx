import React, {useRef, useState} from 'react';
import '../../static/profile.css'
import * as images from '../../assets/img/img.js'

const Profile = () => {
  const [name, setName] = useState("Shrek")
  const [email, setEmail] = useState("shrekmapagmahal@gmail.com")
  const [contact, setContact] = useState("092121212121")

  const infoBtns = useRef();
  const nameInp = useRef();
  const emailInp = useRef();
  const contactInp = useRef();

  const editProfile = () => {
    infoBtns.current.style.display = "flex";
    nameInp.current.disabled = false;
    emailInp.current.disabled = false;
    contactInp.current.disabled = false;
  }

  const cancel = () => {
    infoBtns.current.style.display = "none";
  }

  const save = () => {
    infoBtns.current.style.display = "none";
    alert("information saved");
  }

  const logout = () => {
    alert("logout");
  }

  const deleteAcc = () => {
    alert("Acc deleted")
  }

  const changeValue = (e) => {
    if (e.target.id == "name") {
      setName(e.target.value)
    } else if (e.target.id == "email") {
      setEmail(e.target.value)
    } else if (e.target.id == "contact") {
      console.log(e.target.value)
      setContact(e.target.value)
    }
  }

  return (
    <div className="profile-container">
      <div className="profile-wrapper">
        <div className="profile-top-container">
          <img className="profile-top-pic" src={images.logo} />
          <div className="profile-top-info">
            <p className="name"><strong>{name}</strong></p>
            <p className="email">{email}</p>
            <p style={{color: "red"}}>Admin</p>
          </div>
        </div>
        
        <div className="profile-info-container">
          <div className="profile-info">
            <label htmlFor="" className="profile-label">Name</label>
            <input ref={nameInp} className="profile-input" id="name" onChange={changeValue} value={name} disabled />
          </div>
          <div className="profile-info">
            <label htmlFor="" className="profile-label">Email</label>
            <input ref={emailInp} className="profile-input" type="email" id="email" onChange={changeValue} value={email} disabled />
          </div>
          <div className="profile-info">
            <label htmlFor="" className="profile-label">Contact Number</label>
            <input ref={contactInp} className="profile-input" type="number" id="contact" onChange={changeValue} value={contact} disabled />
          </div>
          <div ref={infoBtns} className="profile-info-btns">
            <button className="btn deleteBtn" onClick={cancel}>Cancel</button>
            <button className="btn saveBtn" onClick={save}>Save</button>
          </div>
        </div>

        <div className="profile-btns-container">
            <div className="profile-top-btns">
              <button className="btn defaultBtn" onClick={logout}>Logout</button>
              <button onClick={editProfile} className="btn defaultBtn">Edit Profile</button>
              <button className="btn defaultBtn">Reset Password</button>
            </div>
          <button className="btn deleteBtn" onClick={deleteAcc}>Delete Profile</button>
        </div>
      </div>
    </div>
  );
};

export default Profile;