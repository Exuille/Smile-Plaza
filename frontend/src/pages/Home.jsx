// import logo from "../assets/img/logo.jpg"
// import calendar from "../assets/img/calendar.jpg"
import * as images from "../assets/img/img"
import styles from "../static/home.module.css";
import Button from "../components/Button"

function Home() {
	const treatments = {
		"dental_consultation": "Dental Consultation",
		"orthodontics": "Orthodontics",
		"oral_prophylaxis": "Oral Prophylaxis",
		"tooth_restoration": "Tooth Restoration",
		"tooth_extraction": "Tooth Extraction",
		"odontectonomy": "Odontectonomy",
		"dentures": "Dentures",
	}

	const sched = {
		"Appointment Only": {
			"Tuesday": "9:00 AM - 4:00 PM",
			"Wednesday": "9:00 AM - 4:00 PM",
			"Thursday": "9:00 AM - 4:00 PM",
			"Friday": "9:00 AM - 4:00 PM",
		}, "Walk In Patient Only" : {
			"Tuesday": "9:00 AM - 4:00 PM",
			"Wednesday": "9:00 AM - 4:00 PM"
		}
	}

	const register = () => {
		console.log("register clicked!")
	}

	const login = () => {
		console.log("login clicked!")
	}

	return (
		<div className={styles.container}>
			<header>
				<div className={styles.navLogo}>
					<a href="#"><img className={styles.logo} src={images.logo}></img></a>
					<div className={styles.nameContainer}>
						<a href="#"><h2>Smile Plaza</h2></a>
						<a href="#"><h3>DENTAL CENTER</h3></a>
					</div>
				</div>

				<nav className={styles.navItems}>
					<a href="#" className={styles.active}>Home</a>
					<a href="#about">About</a>
					<a href="#treatments">Treatments</a>
					<a href="#clinicHours">Clinic Hours</a>
					<a href="#contactUs">Contact Us</a>
					<a href="#appointment">Appointment</a>
				</nav>
	      	</header>

	      	<div className={styles.mainContainer}>
				<section className={styles.home} id="home">
					<div className={styles.homeLeft}>
						<div className={styles.homeText}>
							<h1>Say Goodbye to Scheduling Hassles</h1>
							<h4>Find experienced doctors and book appointments online with ease.</h4>
						</div>
						<div className={styles.homeBtn}>
							<Button text="Login" func={login} fontSize="30px"/>
							<Button text="Register" func={register} isHollow="btnHollow" fontSize="30px"/>
						</div>
					</div>
					<div className={styles.homeImg}>
						<img src={images.calendar}></img>
					</div>
				</section>

				<section className={styles.about} id="about">
					<div className={styles.aboutImg}>
						<img src={images.calendar}></img>
					</div>

					<div className={styles.aboutText}>
						<h2>About Us</h2>
						<p>Welcome to Smile Plaza Dental Center, where your smile is our top priority. We are a leading dental practice dedicated to providing high-quality,  compassionate, and personalized dental care to our valued patients. With a commitment to excellence and a passion for improving oral health, we take pride in helping you achieve a bright and healthy smile.
						</p>
						<div>
							<Button text="More About" fontsize="18px"/>
						</div>
					</div>
				</section>

				<section className={styles.treatments} id="treatments">
					<h1>Treatments</h1>
					<div className={styles.treatments_container}>
						{treatments ? 
							Object.keys(treatments).map((key, index) => {
								return (
									<div key={key} className={styles.try}>
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

				<section className={styles.clinicHours} id="clinicHours">
					<div className={styles.clinicHoursText}>
						<h3>Clinic Hours</h3>
						{sched ? 
							Object.keys(sched).map((key, index) => {
								return (
									<div key={key} className={styles.clinicSchedule}>
										<h4>{key}</h4>
										<div className={styles.clinicDay}>
											{Object.keys(sched[key]).map((key1, index1) => {
												return (
													<div key={key1}>
														<p>{key1}</p>
														<p>{sched[key][key1]}</p>
													</div>
												)
											})}
										</div>
									</div>
								)
							})
							: null
						}
						<div className={styles.clinicHoursTextFooter}>
							<p>Contact Us</p>
							<div>
								<i className='bx bxl-facebook-square' ></i>
								<i className='bx bx-phone-call' ></i>
								<i className='bx bxs-envelope' ></i>
							</div>
						</div>
					</div>
					<div className={styles.clinicHoursMap}>
						Map ni shrek
					</div>
				</section>

				<section className={styles.contactUs} id="contactUs">
					<div>
						<h2>Contact Us</h2>
						<h3>Visit us for consultation!</h3>
						<p>Smile Plaza Dental Center is ready to cater to your dental needs. Ensuring your smile is at its best, and providing a comfortable and rewarding dental experience.</p>
						<i className='bx bxl-facebook-square' ></i>
						<i className='bx bx-phone-call' ></i>
						<i className='bx bxs-envelope' ></i>
					</div>
					<div>
						<input id="name" type="text" />
						<input id="email" type="email" />
						<input id="contact" type="number" />
						<select id="treatment">
							<option value="dental_consultation">Dental Consultation</option>
							<option value="orthodontics">Orthodontics</option>
							<option value="oral_prophylaxis">Oral Prophylaxis</option>
							<option value="tooth_restoration">Tooth Restoration</option>
							<option value="tooth_extraction">Tooth Extraction</option>
							<option value="odontectonomy">Odontectonomy</option>
							<option value="dentures">Dentures</option>
						</select>
						<textarea />
					</div>
				</section>

				<section className={styles.appointment} id="appointment">
				</section>
			</div>
      </div>
	)
}

export default Home