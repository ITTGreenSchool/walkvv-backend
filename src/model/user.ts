import database from "../libraries/database";

class UserModel {
    private email: string;
    private username: string;
    private password: string;

    constructor(email: string, username: string, password: string) {
        this.email = email;
        this.username = username;
        this.password = password;
    }

    /******************************************
     * Getters and setters
     ******************************************/

    public getEmail(): string {
        return this.email;
    }

    public getUsername(): string {
        return this.username;
    }

    public getPassword(): string {
        return this.password;
    }

    public setEmail(email: string): void {
        this.email = email;
    }

    public setUsername(username: string): void {
        this.username = username;
    }

    public setPassword(password: string): void {    
        this.password = password;
    }

    /******************************************
     * CRUD actions
     *****************************************/
    
    /**
     * Retrieves all the users from the database
     * @returns An array of UserModel objects
     */
    public static async selectAll(): Promise<UserModel[]> {
        let connection = await database.getInstance().getConnection();
        let result = await connection.query(
            "SELECT * FROM users"
        );
        connection.release();
        return result;
    }

    /**
     * Inserts a user into the database
     * @param user The user to insert into the database
     */
    public static async insert(user: UserModel) {
        let connection = await database.getInstance().getConnection();
        await connection.query(
            "INSERT INTO users (email, username, password) VALUES (?, ?, ?)", 
            [user.getEmail(), user.getUsername(), user.getPassword()]
        );
        connection.release();
    }

    /**
     * Updates a user in the database
     * @param user The user to update in the database
     */
    public static async update(user: UserModel) {
        let connection = await database.getInstance().getConnection();
        await connection.query(
            "UPDATE users SET email = ?, username = ?, password = ? WHERE email = ?", 
            [user.getEmail(), user.getUsername(), user.getPassword(), user.getEmail()]
        );
        connection.release();
    }

    /**
     * Deletes a user from the database
     * @param user The user to delete from the database
     */
    public static async delete(user: UserModel) {
        let connection = await database.getInstance().getConnection();
        await connection.query(
            "DELETE FROM users WHERE email = ?", 
            [user.getEmail()]
        );
        connection.release();
    }   
}