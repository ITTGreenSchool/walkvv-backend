import express from 'express';
import FootpathController from '../../../controller/footpath';

const api_v1_footpath_router = express.Router();

api_v1_footpath_router.get('/:id', FootpathController.get_footpath);

api_v1_footpath_router.post('/', FootpathController.create_footpath);

api_v1_footpath_router.delete('/', FootpathController.delete_footpath);

api_v1_footpath_router.put('/', FootpathController.update_footpath);

export default api_v1_footpath_router;