import express from 'express';
import { authMiddleware } from '@/middlewares';
import {
  login,
  register,
  registerByPhone,
  validatePasswordStrength,
  logout,
  forgotPassword,
  resetPassword,
  revertAccount,
} from '@/controllers/auth/auth.controller';

const route = express.Router();

route.post('/login', login); // Login Account
route.post('/register', register); // Register Account

route.post('/register/phone', registerByPhone); // Register Account with Phone Number
route.post('/password/validate', validatePasswordStrength); // Get Password Strength

route.post('/logout', authMiddleware, logout); // Logout
route.post('/forgot', authMiddleware, forgotPassword); // Forgot Password
route.post('/reset', authMiddleware, resetPassword); // Reset Password

route.post('/revert', revertAccount); // Revert Account

export default route;
