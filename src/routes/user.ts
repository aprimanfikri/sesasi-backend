import express from 'express';
import authenticate from '../middlewares/authenticate';
import { isAdmin } from '../middlewares/role';
import {
  createUser,
  deleteUser,
  getAllUsers,
  getUserById,
  updateUser,
} from '../controllers/user';

const user = express.Router();

user.use(authenticate);

user.route('/').get(getAllUsers).post(isAdmin, createUser);
user
  .route('/:id')
  .get(getUserById)
  .patch(isAdmin, updateUser)
  .delete(isAdmin, deleteUser);

export default user;
