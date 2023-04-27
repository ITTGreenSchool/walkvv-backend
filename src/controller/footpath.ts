import express from 'express';

class FootpathController {
    public static get_footpath(req: express.Request, res: express.Response, next: express.NextFunction) {
        res.status(200).json({
            message: 'get_footpath'
        });
    }

    public static create_footpath(req: express.Request, res: express.Response, next: express.NextFunction) {
        res.status(200).json({
            message: 'create_footpath'
        });
    }

    public static delete_footpath(req: express.Request, res: express.Response, next: express.NextFunction) {
        res.status(200).json({
            message: 'delete_footpath'
        });
    }

    public static update_footpath(req: express.Request, res: express.Response, next: express.NextFunction) {
        res.status(200).json({
            message: 'update_footpath'
        });
    }

}

export default FootpathController;