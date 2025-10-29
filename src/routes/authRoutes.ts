import express from 'express';
import {

} from '@/controllers/authController';

const route = express.Router();

route.get('/sessions'); // Get Auth Sessions
route.post('/sessions/logout'); // Logout Auth Sessions

route.post('/login'); // Login Account
route.post('/register'); // Register Account

route.post('/register/phone'); // Register Account with Phone Number
route.post('/password/validate'); // Get Password Strength

route.post('/logout'); // Logout
route.post('/forgot'); // Forgot Password
route.post('/reset'); // Reset Password

route.post('/revert'); // Revert Account

export default route;
