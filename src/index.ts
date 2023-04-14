// Loading environment variables
import dotenv from "dotenv";
dotenv.config({path: __dirname + "/../.env"});

// Importing vendor Libraries
import express from 'express';
import helmet from 'helmet';
import session from "express-session";
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
        this.app.use(session({
            secret: process.env.SESSION_SECRET || "secret",
            resave: false,
            saveUninitialized: false
        }));
        this.app.use

        // Express Routes
        this.app.use(router);
        // Listening for connections
        this.app.listen(process.env.SERVER_PORT, () => {
            console.log(`Server is running on port ${process.env.SERVER_PORT}`);
        });
    }
}

// Is this coorect?

App.run();