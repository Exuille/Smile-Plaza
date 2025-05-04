import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true 
    },
    email: { 
        type: String, 
        required: true, 
        unique: true 
    },
    password: { 
        type: String, 
        required: true,
        min: 8
    },
    role: { 
        type: String, 
        enum: ['admin', 'patient'], 
        default: 'patient' 
    },
    service: {
        type: String,
        enum: ['Dental Consultation', 'Orthodontics','Oral Prophylaxis','Tooth Restoration' ,'Tooth Extraction','Odontectomy','Dentures'],
        default: 'Dental Consultation'
    },
    contactInfo: { 
        type: String 
    },
  }, { timestamps: true });

userSchema.methods.correctPassword = async function(candidatePassword, userPassword) {
    return await bcrypt.compare(candidatePassword, userPassword);
};

const User = mongoose.model("User", userSchema);
export default User;