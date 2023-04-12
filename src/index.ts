// Loading environment variables
import dotenv from "dotenv";
dotenv.config();

// Importing vendor Libraries
import express from 'express';
import helmet from 'helmet';
import passport from 'passport';
import router from './router/router';

class App {

    public static app: express.Application;

    public static async run() {
        
        // Initializing server
        this.app = express();

        // Express Settings

        // Express Middlewares
        this.app.use(express.json());
        this.app.use(helmet());
        this.app.use(passport.initialize());
        this.app.use(passport.session());

        // Express Routes
        this.app.use(router);
        // Listening for connections
        this.app.listen(process.env.PORT, () => {
            console.log(`Server is running on port ${process.env.PORT}`);
        });
    }
}

App.run();