import mariadb from 'mariadb';
import config from '../config';

/**
 * Database driver setup class
 */
class Database {
    private static instance: Database;
    private pool: mariadb.Pool;

    // Initialize the database connection pool
    private constructor() {
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