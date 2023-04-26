import mariadb from 'mariadb';
import config from '../config';
import logger from './logger';

/**
 * Database driver setup class
 */
class Database {
    private static instance: Database;
    private pool: mariadb.Pool;

    // Initialize the database connection pool
    private constructor() {
        logger.verbose(`-------------------------------------`);
        logger.verbose('Initializing database connection pool');
        logger.verbose(`-------------------------------------`);

        logger.verbose(`Database host: ${config.DB_HOST}`);
        logger.verbose(`Database port: ${config.DB_PORT}`);
        logger.verbose(`Database user: ${config.DB_USER}`);
        logger.verbose(`Database password: ${config.DB_PASSWORD}`);
        logger.verbose(`Database name: ${config.DB_NAME}`);

        logger.verbose(`-------------------------------------`);
        logger.verbose(`Database connection pool initialized`);
        logger.verbose(`-------------------------------------`);

        this.pool = mariadb.createPool({
            host: config.DB_HOST,
            port: config.DB_PORT,
            user: config.DB_USER,
            password: config.DB_PASSWORD,
            database: config.DB_NAME,
        });
    }
    
    // Singleton pattern
    public static getInstance(): Database {
        if (!Database.instance) {
            Database.instance = new Database();
        }
        return Database.instance;
    }

    // Get a connection
    public async getConnection(): Promise<mariadb.PoolConnection> {
        return await this.pool.getConnection();
    }
}

export default Database;