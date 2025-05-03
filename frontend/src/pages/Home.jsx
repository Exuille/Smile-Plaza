import React from 'react';
import '../static/home.css';

const Home = () => {
	return (
	  <div className="home-container">
		<div className="left-panel">
			<div className="left-text-container">
				<p className="heading">Say Goodbye to Scheduling Hassles</p>
				<p className="basic-text">Find experienced doctors and book appointments online with ease.</p>
				<a href="/appointment"><button className="left-btn">Book an Appointment</button></a>
			</div>
		</div>
		<div className="right-panel">
			<img src="calendar-with-shadow.png" alt="Calendar" />
		</div>
	  </div>
	);
};

export default Home;