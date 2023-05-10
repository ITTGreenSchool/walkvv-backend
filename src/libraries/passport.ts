import passport from 'passport';
import crypto from 'crypto';

import {Strategy as JWTStrategy, ExtractJwt} from 'passport-jwt';
import {Strategy as LocalStrategy} from 'passport-local';

import UserModel from "../model/user";
import logger from "./logger";
import config from "../config";

export default function () {
    passport.use(
        'login',
        new LocalStrategy({
            usernameField: 'email',
            passwordField: 'password'
        },
        async function (email, password, done) {
            try {
                
                // Testing if error occurs during user retrieval
                if (process.env.TEST_AUTH_USER_RETRIVAL_ERROR === 'true') {
                    logger.verbose('Authentication error test [user retrieval]');
                    throw new Error('test_auth_user_retrieval_error');
                }
                
                // Checking if user exists and password is correct
                logger.verbose(`Checking if user ${email} exists and password is correct`);
                let user = await UserModel.selectByEmail(email);
                if (!user) {
                    return done(null, false, { message: 'bad_user' });
                }
                if (!(await user.check_password(password))) {
                    return done(null, false, { message: 'bad_password' });
                }
                logger.verbose(`User ${email} exists and password is correct`);

                // User is authenticated
                return done(null, user, { message: 'login_success' } )

            } catch (err: any) {
                return done(err);
            }
        }
    ));

    /**
     * This strategy is used to authenticate a user given a JWT token.
     * If the token is valid, the user is authenticated.
     * @callback done Callback function
     * @param {Error} err Error object
     * @param {User} user User object
     * @param {Object} info Additional information
     * - {String} message Error message
     *  - bad_token: Token is invalid
     *  - password_changed: User password has changed
     */
    passport.use(
        new JWTStrategy(
            {
                jwtFromRequest: ExtractJwt.fromBodyField('token'),
                secretOrKey: config.JWT_SECRET
            },
            async (token, done) => {
                try {
                    // Checking if user exists
                    logger.verbose(`Checking if user ${token.user.email} exists`);
                    let user = await UserModel.selectByEmail(token.user.email);
                    logger.verbose(`Does user ${token.user.email} exist? ${user ? "yes" : "no"}`);
                    if (!user) return done(null, false, { message: 'bad_token' });

                    // Checking if user password has changed
                    logger.verbose(`Checking if user ${token.user.email} password has changed`)
                    let fpt = crypto
                    .createHash('sha1')
                    .update(user.getPassword())
                    .digest('hex');
                    if (fpt !== token.user.fpt) return done(null, false, { message: 'password_changed' });
                    logger.verbose(`User ${token.user.email} password has not changed`);

                    logger.verbose(`Authenticating user ${token.user.email}`);
                    return done(null, user);
                } catch (err) {
                    logger.error(err);
                    return done(err, false);
                }
            }
        )
    )
}