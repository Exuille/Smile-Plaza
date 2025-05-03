import React, {useRef} from 'react';
import '../../static/profile.css'
import * as images from '../../assets/img/img.js'

const Profile = () => {
  const infoBtns = useRef();
  const nameInp = useRef();
  const emailInp = useRef();
  const contactInp = useRef();

  const editProfile = () => {
    infoBtns.current.style.display = "flex";
    console.log(nameInp)
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

  return (
    <div className="profile-container">
      <div className="profile-top-container">
        <img className="profile-top-pic" src={images.logo} />
        <div className="profile-top-info">
          <p className="name"><strong>Juan Dela Cruz</strong></p>
          <p className="email">email@gmail.com</p>
        </div>
      </div>
      
      <div className="profile-info-container">
        <div className="profile-info">
          <label htmlFor="" className="profile-label">Name</label>
          <input ref={nameInp} className="profile-input" value="Shrek" disabled />
        </div>
        <div className="profile-info">
          <label htmlFor="" className="profile-label">Email</label>
          <input ref={emailInp} className="profile-input" value="shrek@gmail.com" disabled />
        </div>
        <div className="profile-info">
          <label htmlFor="" className="profile-label">Contact Number</label>
          <input ref={contactInp} className="profile-input" value="092132435476" disabled />
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
  );
};

export default Profile;