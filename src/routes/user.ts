import express from 'express';
import authenticate from '../middlewares/authenticate';
import { isAdmin, isAdminOrVerificator } from '../middlewares/role';
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
  .patch(isAdminOrVerificator, updateUser)
  .delete(isAdmin, deleteUser);

export default user;
