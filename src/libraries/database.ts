import mariadb from 'mariadb';

/**
 * Database driver setup class
 */
class Database {
    private static instance: Database;
    private pool: mariadb.Pool;

    // Initialize the database connection pool
    private constructor() {
        this.pool = mariadb.createPool({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            connectionLimit: 5
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