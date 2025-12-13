import express from 'express';
import { authMiddleware, validateRequest } from '@/middlewares';
import { loginSchema, registerSchema } from '@/schemas/auth.schema';
import authController from '@/controllers/auth';
import sessionsRouter from './sessions.routes';

const route = express.Router();

route.post('/login', validateRequest(loginSchema), authController.login); // Login Account
route.post('/register', validateRequest(registerSchema), authController.register); // Register Account

route.post('/register/phone', authController.registerByPhone); // Register Account with Phone Number
route.post('/password/validate', authController.validatePasswordStrength); // Get Password Strength

route.post('/logout', authMiddleware, authController.logout); // Logout
route.post('/forgot', authMiddleware, authController.forgotPassword); // Forgot Password
route.post('/reset', authMiddleware, authController.resetPassword); // Reset Password

route.post('/revert', authController.revertAccount); // Revert Account

route.use('/sessions', sessionsRouter);


export default route;
