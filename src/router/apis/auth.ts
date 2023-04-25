import express from 'express';
import passport from 'passport';
import UserController from '../../controller/user';

const api_auth_router = express.Router();

api_auth_router.post('/login', UserController.login);
api_auth_router.post('/register', UserController.register);

export default api_auth_router;