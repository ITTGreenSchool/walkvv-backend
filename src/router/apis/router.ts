import express from 'express';
import authenticate_jwt from '../../middlewares/authenticate_jwt';

import api_v1_router from './v1/router';
import api_auth_router from './auth';

const api_router = express.Router();

api_router.use('/auth', api_auth_router);
api_router.use('/v1', authenticate_jwt, api_v1_router);


export default api_router;

