import express from 'express';
import passport from 'passport';

import api_v1_user_router from './user';
import api_v1_totem_router from './totem';
import api_v1_footpath_router from './footpath';

const api_v1_router = express.Router();

api_v1_router.use('/user', api_v1_user_router);
api_v1_router.use('/totem', api_v1_totem_router);
api_v1_router.use('/footpath', api_v1_footpath_router);

export default api_v1_router;