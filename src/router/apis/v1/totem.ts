import express from 'express';
import TotemController from '../../../controller/totem';

const api_v1_totem_router = express.Router();

api_v1_totem_router.get('/scan', TotemController.scan_totem)
api_v1_totem_router.get('/', TotemController.get_totems);
api_v1_totem_router.post('/', TotemController.create_totem);
api_v1_totem_router.delete('/', TotemController.delete_totem);
api_v1_totem_router.put('/', TotemController.update_totem);

export default api_v1_totem_router;