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

    // setName(default)
    // setEmail(default)
    // setContact(default)
  }

  const save = () => {
    infoBtns.current.style.display = "none";

    // update profile

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
    } else if (e.target.value == "contact") {
      setContact(e.target.value)
    }
  }

  return (
    <div className="profile-container">
      <div className="profile-top-container">
        <img className="profile-top-pic" src={images.logo} />
        <div className="profile-top-info">
          <h2>Shrek</h2>
          <div className="profile-top-btns">
            <button onClick={editProfile} className="btn defaultBtn">Edit Profile</button>
            <button className="btn defaultBtn">Reset Password</button>
          </div>
        </div>
      </div>
      
      <div className="profile-info-container">
        <h1><span>Account Information</span></h1>
        <div className="profile-info">
          <h4>Name</h4>
          <input ref={nameInp} className="profile-input" id="name" onChange={changeValue} value={name} disabled />
        </div>
        <div className="profile-info">
          <h4>Email</h4>
          <input ref={emailInp} className="profile-input" id="email" onChange={changeValue} type="email" value={email} disabled />
        </div>
        <div className="profile-info">
          <h4>Contact Number</h4>
          <input ref={contactInp} className="profile-input" id="contact" onChange={changeValue} type="number" value={contact} disabled />
        </div>
        <div ref={infoBtns} className="profile-info-btns">
          <button className="btn deleteBtn" onClick={cancel}>Cancel</button>
          <button className="btn saveBtn" onClick={save}>Save</button>
        </div>
      </div>

      <div className="profile-btns-container">
        <button className="btn defaultBtn" onClick={logout}>Logout</button>
        <button className="btn deleteBtn" onClick={deleteAcc}>Delete Profile</button>
      </div>
    </div>
  );
};

export default Profile;