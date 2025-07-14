import mongoose from 'mongoose';

// Define the user schema
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        trim: true
    },
    phoneNumber: {
        type: String,
        required: true,
    },
    email: { 
        type: String,
        required: true,
        match: [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 'Please fill a valid email address']
    },
    password: {
        type: String,
        required: true,
    },
    otp: {
        type: String,
        required: false,
    },
    otpExpires: {
        type: Date,
        required: false,
    },
    isAdmin: {
        type: Boolean,
        default: false,
    }
}, {
    timestamps: true // Automatically add createdAt and updatedAt fields
});

// Create the User model
const User = mongoose.model('User', userSchema);

export default User;
