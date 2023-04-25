import express from 'express';
import UserController from '../../../controller/user';

const api_v1_user_router = express.Router();

/**
 * @api {get} /api/v1/user Get session user
 */
api_v1_user_router.get('/', UserController.get_session_user);

/**
 * @api {get} /api/v1/user/:email Get user by email
 * @apiParam {String} email User email
 */
//api_v1_user_router.get('/:email', UserController.get_user_by_email);

/**
 * @api {put} /api/v1/user Update user
 */
api_v1_user_router.put('/', UserController.update_user);

/**
 * @api {delete} /api/v1/user Delete user
 */
//api_v1_user_router.delete('/', UserController.delete_user);

export default api_v1_user_router;