import express from 'express';
import api_v1_router from './v1/apis_v1';

const api_router = express.Router();

api_router.use('/v1', api_v1_router);


export default api_router;

