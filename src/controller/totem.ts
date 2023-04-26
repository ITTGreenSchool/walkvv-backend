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
        } catch (err: any) {
            return next(err);
        }
    }
}

export default TotemController;