import express from 'express';
import auth from './auth';
import permission from './permission';
import user from './user';

const routes = express.Router();

routes.use('/auth', auth);
routes.use('/permission', permission);
routes.use('/user', user);

export default routes;
