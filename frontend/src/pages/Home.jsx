import React from 'react';
import '../static/home.css';
import * as images from "../assets/img/img"

const Home = () => {
	const treatments = {
		"dental_consultation": "Dental Consultation",
		"orthodontics": "Orthodontics",
		"oral_prophylaxis": "Oral Prophylaxis",
		"tooth_restoration": "Tooth Restoration",
		"tooth_extraction": "Tooth Extraction",
		"odontectomy": "Odontectomy",
		"dentures": "Dentures",
	}

	return (
	  <div>
	  	<section className="home-container">
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
		</section>

		<section className="treatments" id="treatments">
			<h1>Treatments</h1>
			<div className="treatments-container">
				{treatments ? 
					Object.keys(treatments).map((key, index) => {
						return (
							<div key={key} className="try">
								<img src={images[key]} />
								<p>{treatments[key]}</p>
							</div>
						)
					})
				:
					null
				}
			</div>
		</section>
	  </div>
	);
};

export default Home;