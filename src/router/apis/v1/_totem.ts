import express from 'express';
import TotemController from '../../../controller/totem';

const api_v1_totem_router = express.Router();

api_v1_totem_router.get('/scan', TotemController.scan_totem)

api_v1_totem_router.get('/', (req: express.Request, res: express.Response) => {
    
});

api_v1_totem_router.post('/', (req: express.Request, res: express.Response) => {
    
});

api_v1_totem_router.delete('/', (req: express.Request, res: express.Response) => {
    
})

api_v1_totem_router.put('/', (req: express.Request, res: express.Response) => {
    
})

export default api_v1_totem_router;