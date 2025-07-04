import express from 'express';
import { create, getAll, getById, remove, update } from '../controllers/user';
import authenticate from '../middlewares/authenticate';
import { isAdmin } from '../middlewares/role';

const user = express.Router();

user.use(authenticate);

user.route('/').get(getAll).post(isAdmin, create);
user.route('/:id').get(getById).patch(isAdmin, update).delete(isAdmin, remove);

export default user;
