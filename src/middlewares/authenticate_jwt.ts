import express from 'express';
import passport from 'passport';
import logger from '../libraries/logger';

export default function (req: express.Request, res: express.Response, next: express.NextFunction) {
    logger.verbose('--------------------------');
    logger.verbose('JWT Token Authentication');
    logger.verbose('--------------------------');
    passport.authenticate('jwt', { session: false }, (err, user, info) => {
        if (err) return next(err);

        if (!user) {
            logger.verbose('JWT token is invalid');
            return res.status(401).json({
                reason: info.message.replace(/ /g, '_').toLowerCase()
            });
        }

        req.user = user;

        logger.verbose('--------------------------');
        logger.verbose('Protected Route Handler');
        logger.verbose('--------------------------');
        return next();
    })(req, res, next);
}