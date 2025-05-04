import mongoose from 'mongoose';

const AppointmentSchema = new mongoose.Schema({
    patient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    dateTime: {
        type: Date,
        required: true
    },
    service: {
        type: String,
        enum: ['Dental Consultation', 'Orthodontics','Oral Prophylaxis','Tooth Restoration' ,'Tooth Extraction','Odontectomy','Dentures'],
        default: 'Dental Consultation'
    },
    status: {
        type: String,
        enum: ['pending', 'completed', 'cancelled'],
        default: 'pending'   
    },
}, { timestamps: true });

const Appointment = mongoose.model("Appointment", AppointmentSchema);
export default Appointment; 