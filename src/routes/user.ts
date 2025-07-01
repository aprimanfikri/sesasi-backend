import express from 'express';
import { create, getAll, getById, remove, update } from '../controllers/user';
import authenticate from '../middlewares/authenticate';
import { isAdmin } from '../middlewares/role';

const user = express.Router();

user.route('/').get(authenticate, getAll).post(authenticate, isAdmin, create);
user
  .route('/:id')
  .get(authenticate, getById)
  .patch(authenticate, isAdmin, update)
  .delete(authenticate, isAdmin, remove);

export default user;
