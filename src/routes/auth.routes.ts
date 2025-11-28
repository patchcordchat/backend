import express from 'express';
import { authMiddleware } from '@/middlewares';
import authController from '@/controllers/auth';

const route = express.Router();

route.post('/login', authController.login); // Login Account
route.post('/register', authController.register); // Register Account

route.post('/register/phone', authController.registerByPhone); // Register Account with Phone Number
route.post('/password/validate', authController.validatePasswordStrength); // Get Password Strength

route.post('/logout', authMiddleware, authController.logout); // Logout
route.post('/forgot', authMiddleware, authController.forgotPassword); // Forgot Password
route.post('/reset', authMiddleware, authController.resetPassword); // Reset Password

route.post('/revert', authController.revertAccount); // Revert Account

export default route;
