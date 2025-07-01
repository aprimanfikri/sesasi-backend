import express from 'express';
import { register, login, check } from '../controllers/auth';
import authenticate from '../middlewares/authenticate';

const auth = express.Router();

auth.get('/', authenticate, check);
auth.post('/register', register);
auth.post('/login', login);

export default auth;
