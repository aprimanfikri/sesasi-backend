import express from 'express';
import authenticate from '../middlewares/authenticate';
import {
  checkUser,
  loginUser,
  registerUser,
  updateAccount,
  updatePassword,
} from '../controllers/auth';

const auth = express.Router();

auth.route('/').get(authenticate, checkUser).patch(authenticate, updateAccount);
auth.patch('/password', authenticate, updatePassword);
auth.post('/register', registerUser);
auth.post('/login', loginUser);

export default auth;
