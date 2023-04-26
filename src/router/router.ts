import express from 'express';
import logger from '../libraries/logger';
import api_router from './apis/apis';

const router = express.Router();

router.use('/api', api_router);

// Error Handling
router.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    if (err) {
        logger.error(err.message)
        logger.verbose('Error occured\n' + err.stack)
        res.status(500).json({
            error: 'internal_server_error'
        });
    }
});

// Error 404
router.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
    res.status(404).json({
        error: 'resource_not_found'
    });
});


export default router;