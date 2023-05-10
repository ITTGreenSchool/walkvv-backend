import express from 'express';
import FootpathModel from '../model/footpath';

class FootpathController {
    public static async get_footpath(req: express.Request, res: express.Response, next: express.NextFunction) {
        if (!req.params.id) {
            return res.status(200).json(await FootpathModel.selectAll())
        }
    }

    public static async create_footpath(req: express.Request, res: express.Response, next: express.NextFunction) {
        res.status(200).json({
            message: 'create_footpath'
        });
    }

    public static async delete_footpath(req: express.Request, res: express.Response, next: express.NextFunction) {
        res.status(200).json({
            message: 'delete_footpath'
        });
    }

    public static async update_footpath(req: express.Request, res: express.Response, next: express.NextFunction) {
        res.status(200).json({
            message: 'update_footpath'
        });
    }

}

export default FootpathController;