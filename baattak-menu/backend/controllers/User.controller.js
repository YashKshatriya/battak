import dotenv from 'dotenv';
dotenv.config();
import User from '../models/User.model.js';
import nodemailer from 'nodemailer';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Nodemailer transporter setup for SMTP (generic)
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT, 10),
    secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

// Debug SMTP transporter
transporter.verify(function(error, success) {
    if (error) {
        console.error('SMTP Transporter Error:', error);
    } else {
        console.log('SMTP Transporter is ready to send messages');
    }
});

// Helper to send OTP email using SMTP
export const sendOtpEmail = async (to, otp) => {
    const mailOptions = {
        from: process.env.SMTP_FROM || process.env.SMTP_USER,
        to,
        subject: 'Your OTP Code',
        text: `Your OTP code is: ${otp}`,
    };
    await transporter.sendMail(mailOptions);
};

// Generate a 6-digit OTP
function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

// Registration Step 1: Request OTP
export const registerRequestOtp = async (req, res) => {
    try {
        const { email, password, username, phoneNumber } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already registered.' });
        }
        const otp = generateOTP();
        const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 min
        // Temporarily store user info and OTP in DB
        await User.create({ email, password: await bcrypt.hash(password, 10), username, phoneNumber, otp, otpExpires });
        await sendOtpEmail(email, otp); 
        res.status(200).json({ message: 'OTP sent to email.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Registration Step 2: Verify OTP
export const registerVerifyOtp = async (req, res) => {
  try {
    const { username, phoneNumber, email, password, otp } = req.body;

    // 1. Find user
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    // 2. Check OTP and expiry
    if (user.otp !== otp || user.otpExpires < new Date()) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    // 3. Hash password if provided
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      user.password = hashedPassword;
    }
    if (username) user.username = username;
    if (phoneNumber) user.phoneNumber = phoneNumber;
    user.otp = undefined;
    user.otpExpires = undefined;

    await user.save();

    return res.status(200).json({ message: 'User registered successfully' });

  } catch (error) {
    console.error('registerVerifyOtp Error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Add standard login endpoint
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate request
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Login failed: User not found' });
    }

    // Block login if OTP verification is not complete
    if (user.otp || user.otpExpires) {
      return res.status(400).json({ message: 'Please verify your email with the OTP before logging in.' });
    }

    // Compare passwords
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Login failed: Incorrect password' });
    }

    // Issue JWT token
    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        isAdmin: user.isAdmin
      },
      process.env.JWT_SECRET || 'default_jwt_secret',
      { expiresIn: '2h' }
    );

    // Login successful
    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
        phoneNumber: user.phoneNumber,
        isAdmin: user.isAdmin
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Controller to create a new user
export const createUser = async (req, res) => {
    try {
        const { username, phoneNumber, email, password } = req.body;

        // Check if a user already exists with the same username, phone number, or email
        const existingUser = await User.findOne({
            $or: [{ username }, { phoneNumber }, { email }]
        });

        if (existingUser) {
            return res.status(400).json({ message: 'Username, phone number, or email already in use.' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const newUser = new User({
            username,
            phoneNumber,
            email,
            password: hashedPassword
        });

        await newUser.save();
        res.status(201).json({ message: 'User created successfully!', user: newUser });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Controller to get all users (optional)
export const getUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
