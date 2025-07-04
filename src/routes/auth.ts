import express from 'express';
import authenticate from '../middlewares/authenticate';
import { checkUser, loginUser, registerUser } from '../controllers/auth';

const auth = express.Router();

auth.get('/', authenticate, checkUser);
auth.post('/register', registerUser);
auth.post('/login', loginUser);

export default auth;
