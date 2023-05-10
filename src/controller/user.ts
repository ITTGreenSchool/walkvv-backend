import express from 'express';
import passport from 'passport';
import argon2 from 'argon2';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';

import UserModel from '../model/user';
import config from '../config';
import logger from '../libraries/logger';
import { SqlError } from 'mariadb';
import { log } from 'console';
import { UserUpdateRequest } from '../types/user_request';
import TotemModel from '../model/totem';

class UserController {

    /**
     * This request handler is used to authenticate a user given
     * their email and password. If the user is authenticated,
     * JWT token is returned for further requests.
     * 
     * @api POST /api/v1/auth/login User authentication (login)
     * @apiParam {String} [email] User email
     * @apiParam {String} [password] User password
     * @apiSuccess [200] {String} [token] JWT token
     * @apiFailure [401] {String} [reason] Error reason
     */
    public static async login(req: express.Request, res: express.Response, next: express.NextFunction) {
        logger.verbose('--------------------------');
        logger.verbose('Login Request Handler');
        logger.verbose('--------------------------');
        logger.verbose('Login request received');
        passport.authenticate(
            'login',
            (err, user, info) => {
                if (err) {
                    logger.verbose('Login request encountered an error');
                    return next(err);
                }
                
                if (!user) {
                    logger.verbose('Wrong credentials provided');
                    return res.status(401).json({
                        reason: info.message
                    });
                }

                logger.verbose('User authenticated');
                req.login(
                    user,
                    { session: false },
                    async (err) => {

                        if (err) {
                            logger.verbose('Login request encountered an error');
                            return next(err);
                        }

                        // Generating JWT token with user fingerprint based on password and email
                        // Token will be invalidated if user changes password
                        logger.verbose("Generating JWT token...");
                        const fpt = crypto
                        .createHash('sha1')
                        .update(user.password)
                        .digest('hex')
                        const body = { fpt: fpt, email: user.email };
                        const token = jwt.sign({ user: body }, config.JWT_SECRET);
                        logger.verbose("JWT token generated");

                        return res.json({ token });
                    }
                );
            }
        ) (req, res, next);
    }

    /**
     * This request handler is used to register a new user.
     * If the user is registered successfully, a success message
     * is returned.
     * 
     * @api POST /api/v1/auth/register User registration
     * @apiParam {String} [email] User email
     * @apiParam {String} [password] User password
     * @apiSuccess [201] {String} [message] Success message
     * @apiFailure [409] {String} [reason] Duplicate entry
     * @apiFailure [400] {String} [reason] Missing parameters
     * @apiFailure [400] {String} [reason] Other errors
     */
    public static async register(req: express.Request, res: express.Response, next: express.NextFunction) {
        logger.verbose('--------------------------');
        logger.verbose('Register Request Handler');
        logger.verbose('--------------------------');
        logger.verbose('Register request received');
        try {
            // Create a new user and save it to the database
            const new_user = await UserModel.createFromJSON(req.body);
            logger.verbose('Inserting new user into database');
            await UserModel.insert(new_user);
            logger.verbose('New user inserted into database');

            // Return a success message
            return res.status(201).json({
                message: 'user_created'
            });

        } catch (err: any) {

            // Catching database-related errors
            if (err instanceof SqlError) {
                switch(err.code) {

                    // Catching duplicate entry
                    case 'ER_DUP_ENTRY':
                        return res.status(409).json({
                            reason: 'user_already_exists'
                        });

                    // Catching missing parameters
                    case 'ER_PARAMETER_UNDEFINED':
                        return res.status(400).json({
                            reason: 'missing_parameters',
                            missing_parameters: {
                                email: req.body.email ? false : true,
                                password: req.body.password ? false : true,
                                username: req.body.username ? false : true
                            }
                        });

                    // Catching generic error
                    default:
                        next(err);
                }

            }
            // Catching non database-related errors
            return next(err);
        }
    }

    /**
     * This request handler is used to get the user information
     * of the user that is currently logged in.
     * @api GET /api/v1/auth/user Get session user
     * @apiSuccess [200] {Object} User information
     */
    public static async get_user(req: express.Request, res: express.Response, next: express.NextFunction) {
        logger.verbose('Get session user request received');
        return res.json({
            email: req.user.email,
            username: req.user.username,
            points: await UserModel.selectPoints(req.user)
        });
    }

    /**
     * This request handler is used to update the user information
     * of the user that is currently logged in.
     * @api PUT /api/v1/auth/user Update session user
     * @apiParam {String} [email] User email
     * @apiParam {String} [password] User password
     * @apiParam {String} [updated_fields.username] User username
     * @apiSuccess [200] {Object} 
     * TODO: Add duplicate entry error handling
     */
    public static async update_user(req: express.Request, res: express.Response, next: express.NextFunction) {
        logger.verbose('User update request received');
        passport.authenticate(
            'login',
            (err, user: UserModel, info) => {
                if (err) {
                    logger.verbose('Login request encountered an error');
                    return next(err);
                }
                
                if (!user) {
                    logger.verbose('Wrong credentials provided');
                    return res.status(401).json({
                        reason: info.message
                    });
                }

                logger.verbose('User authenticated');
                req.login(
                    user,
                    { session: false },
                    async (err) => {

                        if (err) {
                            logger.verbose('Update request encountered an error');
                            return next(err);
                        }
                        try { 
                            // Updating the user in the database
                            logger.verbose('Updating user in database');
                            let updated = (req.body as UserUpdateRequest).updated_fields;

                            if (updated.email) user.setEmail(updated.email);
                            if (updated.password) await user.setPassword(updated.password);
                            if (updated.username) user.setUsername(updated.username);

                            await UserModel.update(user);

                            return res.json({ message: 'user_updated' });
                        } catch (err) {
                            next(err);
                        }
                    }
                );
            }
        ) (req, res, next);
    }

    /**
     * This request handler is used to delete the user information
     * of the user that is currently logged in.
     */
    public static async delete_user(req: express.Request, res: express.Response, next: express.NextFunction) {
        logger.verbose('User delete request received');
        passport.authenticate(
            'login',
            (err, user: UserModel, info) => {
                if (err) {
                    logger.verbose('Login request encountered an error');
                    return next(err);
                }
                
                if (!user) {
                    logger.verbose('Wrong credentials provided');
                    return res.status(401).json({
                        reason: info.message
                    });
                }

                logger.verbose('User authenticated');
                req.login(
                    user,
                    { session: false },
                    async (err) => {

                        if (err) {
                            logger.verbose('Delete request encountered an error');
                            return next(err);
                        }
                        try { 
                            // Updating the user in the database
                            logger.verbose('Deleting user in database');
                            
                            await UserModel.delete(user);

                            return res.json({ message: 'user_deleted' });
                        } catch (err) {
                            next(err);
                        }
                    }
                );
            }
        ) (req, res, next);
    }

    
}

export default UserController;