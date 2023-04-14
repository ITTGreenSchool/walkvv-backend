import database from "../libraries/database";

class UserModel {
    private email: string;
    private username: string;
    private password: string;
    private points: number;

    constructor(email: string, username: string, password: string, points: number = 0) {
        this.email = email;
        this.username = username;
        this.password = password;
        this.points = points;
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

    public getPoints(): number {
        return this.points;
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

    public setPoints(points: number): void {
        this.points = points;
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
     * Retrieves a user from the database
     * based on his email
     * @param email The email of the user to retrieve
     */
    public static async selectByEmail(email: string): Promise<UserModel> {
        let connection = await database.getInstance().getConnection();
        let result = await connection.query(
            "SELECT * FROM users WHERE email = ?",
            [email]
        );
        connection.release();
        return result[0];
    }

    /**
     * Retrieves a user from his username
     * @param username The username of the user to retrieve
     */
    public static async selectByUsername(username: string): Promise<UserModel> {
        let connection = await database.getInstance().getConnection();
        let result = await connection.query(
            "SELECT * FROM users WHERE username = ?",
            [username]
        );
        connection.release();
        return result[0];
    }

    /**
     * Inserts a user into the database
     * @param user The user to insert into the database
     */
    public static async insert(user: UserModel) {
        let connection = await database.getInstance().getConnection();
        await connection.query(
            "INSERT INTO users (email, username, password, points) VALUES (?, ?, ?, ?)",
            [user.getEmail(), user.getUsername(), user.getPassword(), user.getPoints()]
        );
        connection.release();
    }

    /**
     * Updates a user in the database
     ** NOTE: since fields are shown in the form
     ** it isn't necessary to check if they are
     ** undefined or not
     * @param user The user to update in the database
     */
    public static async update(user: UserModel) {
        let connection = await database.getInstance().getConnection();
        await connection.query(
            "UPDATE users SET username = ?, password = ?, points = ? WHERE email = ?",
            [user.getUsername(), user.getPassword(), user.getPoints(), user.getEmail()]
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

export default UserModel;