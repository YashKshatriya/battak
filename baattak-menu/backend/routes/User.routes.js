import express from 'express';
import { 
  createUser, 
  getUsers, 
  registerRequestOtp, 
  registerVerifyOtp, 
  login 
} from '../controllers/User.controller.js';
import { authenticateToken, requireAdmin } from '../authMiddleware.js';

const router = express.Router();

// Route to create a new user
router.post('/register', createUser);

// Route to get all users (optional)
router.get('/all', getUsers);

// Registration with OTP
router.post('/register/request-otp', registerRequestOtp);
router.post('/register/verify-otp', registerVerifyOtp);
// Standard login
router.post('/login', login);

// Admin test endpoint
router.get('/admin/test', authenticateToken, requireAdmin, (req, res) => {
  res.json({ message: 'Admin access granted', user: req.user });
});

export default router;
 