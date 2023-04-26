import express from 'express';
import logger from '../libraries/logger';
import TotemModel from '../model/totem';

class TotemController {
    
    /**
     * This request handler is used to register the scannarization
     * of a totem by the user that is currently logged in.
     */
    public static async scan_totem(req: express.Request, res: express.Response, next: express.NextFunction) {
        logger.verbose('Scan totem request received');
        try {
            // Attempting to scan the user
            await TotemModel.scan_totem(req.body.totem_id, req.user.email);
            res.status(200).json({
                message: 'totem_scanned'
            });
        } catch (err: any) {
            switch (err.message) {
                case 'totem_scan_delay_error':
                    logger.verbose("User tried to scan a totem too soon");
                    res.status(400).json({
                        error: 'totem_scan_delay_error'
                    });
                    break;
                default:
                    next(err);
            }
        }
    }
}

export default TotemController;