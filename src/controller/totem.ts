import express from 'express';
import logger from '../libraries/logger';
import TotemModel from '../model/totem';
import { TotemRequest, TotemUpdateRequest } from '../types/totem_request';

class TotemController {

    /**
     * This request handler is used to get the totems that are
     * currently registered in the database.
     * @api GET /totems
     * @apiSuccess [200] {Object[]} [totems] The totems that are currently registered in the database
     */
    public static async get_totems(req: express.Request, res: express.Response, next: express.NextFunction) {
        logger.verbose('Get totems request received');
        try {
            // Attempting to get the totems
            const totems = await TotemModel.selectAll();
            res.status(200).json({
                totems: totems
            });
        } catch (err: any) {
            next(err);
        }
    }

    /**
     * This request handler is used to create a new totem in the database.
     * @api POST /totems
     * @apiParam {number} [points] The number of points that the totem is worth
     * @apiParam {number} [latitute] The latitude of the totem
     * @apiParam {number} [longitude] The longitude of the totem
     * @apiSuccess [201] {string} [message] Success Message
     */
    public static async create_totem(req: express.Request, res: express.Response, next: express.NextFunction) {
        logger.verbose('Create totem request received');
        try {
            let totem = new TotemModel(req.body);
            
            // Attempting to create the totem
            await TotemModel.insert(totem);
            res.status(201).json({
                message: 'totem_created'
            });
        } catch (err: any) {
            next(err);
        }
    }

    /**
     * This request handler is used to update a totem in the database.
     * @api POST /totems
     * @apiParam {number} [id] The id of the totem to update
     * @apiParam {Object} [updated_data] The updated data of the totem
     * @apiSuccess [201] {string} [message] Success Message
     */
    public static async update_totem(req: express.Request, res: express.Response, next: express.NextFunction) {
        logger.verbose('Update totem request received');
        try {
            let data = req.body as TotemUpdateRequest;
            let updated = data.updated_data;
            let totem = await TotemModel.selectById(data.id);

            if (updated.points) totem.setPoints(updated.points);
            if (updated.latitude) totem.setLatitude(updated.latitude);
            if (updated.longitude) totem.setLongitude(updated.longitude);
            
            // Attempting to update the totem
            await TotemModel.update(totem);
            res.status(200).json({
                message: 'totem_updated'
            });
        } catch (err) {
            next(err);
        }
    }

    /**
     * This request handler is used to delete a totem in the database.
     * @api POST /totems
     * @apiParam {number} [id] The id of the totem to delete
     * @apiSuccess [201] {string} [message] Success Message
     */
    public static async delete_totem(req: express.Request, res: express.Response, next: express.NextFunction) {
        logger.verbose('Delete totem request received');
        try {
            // Attempting to delete the totem
            await TotemModel.delete(req.body.id);
            res.status(200).json({
                message: 'totem_deleted'
            });
        } catch (err) {
            next(err);
        }
    }
    
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