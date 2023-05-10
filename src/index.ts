// Importing config files
import config from "./config";

// Importing vendor Libraries
import express from 'express';
import helmet from 'helmet';
import passport from 'passport';

// Importing local files
import router from './router/router';
import passport_setup from './libraries/passport';
import Database from './libraries/database';
import logger from "./libraries/logger";

class App {

    public static app: express.Application;

    /**
     * Server runner method
     */
    public static async run() {
        // Initializing server
        this.app = express();
        await Database.checkConnection();

        // Express Settings

        // Express Middlewares
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));

        this.app.use(helmet());
        this.app.use(passport.initialize());
        
        // Passport Setup
        passport_setup();

        // Express Routes
        this.app.use(router);
        // Listening for connections
        this.app.listen(config.SERVER_PORT, () => {
            logger.info(`Server is running on port ${config.SERVER_PORT}`);
        });
    }
}

App.run();
