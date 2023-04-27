import express from 'express';
import UserController from '../../../controller/user';

const api_v1_user_router = express.Router();


api_v1_user_router.get('/', UserController.get_user);
api_v1_user_router.put('/', UserController.update_user);
api_v1_user_router.delete('/', UserController.delete_user);
//api_v1_user_router.get('/:email', UserController.get_user_by_email);

export default api_v1_user_router;