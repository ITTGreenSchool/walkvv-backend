import express from 'express';
import api_router from './apis/apis';

const router = express.Router();

router.use('/api', api_router);

export default router;