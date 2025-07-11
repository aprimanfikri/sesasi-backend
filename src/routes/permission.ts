import express from 'express';
import authenticate from '../middlewares/authenticate';
import {
  cancelPermission,
  createPermission,
  deletePermission,
  getAllPermissions,
  getAllPermissionsByUser,
  getPermissionById,
  updatePermission,
  updatePermissionStatus,
} from '../controllers/permission';
import { isAdminOrVerificator } from '../middlewares/role';

const permission = express.Router();

permission.use(authenticate);

permission.route('/user').get(getAllPermissionsByUser);
permission
  .route('/')
  .get(isAdminOrVerificator, getAllPermissions)
  .post(createPermission);
permission.route('/:id/cancel').patch(cancelPermission);
permission
  .route('/:id/status')
  .patch(isAdminOrVerificator, updatePermissionStatus);
permission
  .route('/:id')
  .get(getPermissionById)
  .patch(updatePermission)
  .delete(deletePermission);

export default permission;
