import express from 'express';
import {
  getSessions,
  logoutSessions,
  login,
  register,
  registerByPhone,
  validatePasswordStrength,
  logout,
  forgotPassword,
  resetPassword,
  revertAccount,
} from '@/controllers/authController';

const route = express.Router();

route.get('/sessions', getSessions); // Get Auth Sessions
route.post('/sessions/logout', logoutSessions); // Logout Auth Sessions

route.post('/login', login); // Login Account
route.post('/register', register); // Register Account

route.post('/register/phone', registerByPhone); // Register Account with Phone Number
route.post('/password/validate', validatePasswordStrength); // Get Password Strength

route.post('/logout', logout); // Logout
route.post('/forgot', forgotPassword); // Forgot Password
route.post('/reset', resetPassword); // Reset Password

route.post('/revert', revertAccount); // Revert Account

export default route;
