import database from "../libraries/database";
import logger from "../libraries/logger";
import {UserRequest} from '../types/user_request';
import argon2 from 'argon2';

class UserModel {
    private email: string;
    private username: string;
    private password: string;


    /******************************************
     * Constructors
     *****************************************/

    /**
     * Factory method to create a new user from a JSON object
     * @param user The JSON object representing the user
     * @returns The created user
     */
    public static async createFromJSON(user: UserRequest): Promise<UserModel> {
        if (!user) throw new Error('user_not_provided');
        user.password = await argon2.hash(user.password);
        return new UserModel(user);
    }

    /**
     * Factory method to create a new user from a database result
     * @param user The database result
     * @returns The created user
     */
    public static async createFromDatabase(user: UserRequest): Promise<UserModel> {
        if (!user) throw new Error('user_not_provided');
        return new UserModel(user);
    }

    /**
     * Creates A brand new user
     * @param user The user to create
     */
    private constructor(user: UserRequest) {
        this.email = user.email;
        this.username = user.username;
        this.password = user.password;
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

    public async setPassword(password: string) {    
        this.password = await argon2.hash(password);
    }

    public async check_password(password: string) {
        return await argon2.verify(this.password, password);
    }

    /******************************************
     * CRUD actions
     *****************************************/

    /**
     * Retrieves all the users from the database
     * @returns An array of UserModel objects
     */
    public static async selectByEmail(email: string): Promise<UserModel | undefined> {
        let connection = await database.getInstance().getConnection();
        let result = await connection.query(
            "SELECT * FROM users WHERE email = ?",
            [email]
        );
        connection.release();
        if (result.length === 0) return undefined;
        return await UserModel.createFromDatabase(result[0]);
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
     ** NOTE: since fields are shown in the form
     ** it isn't necessary to check if they are
     ** undefined or not
     * @param user The user to update in the database
     */
    public static async update(user: UserModel) {
        let connection = await database.getInstance().getConnection();        
        await connection.query(
            "UPDATE users SET username = ?, password = ? WHERE email = ?",
            [user.getUsername(), user.getPassword(), user.getEmail()]
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

    /************************************************
     * Non CRUD actions
     ************************************************/

    /**
     * Retrieves the points of a user
     */
    public static async selectPoints(user: UserModel): Promise<number> {
        let connection = await database.getInstance().getConnection();
        let result = await connection.query(
            "SELECT SUM(points) AS points FROM scans INNER JOIN totems ON scans.totem_id = totems.id WHERE user_id = ?",
            [user.getEmail()]
        );
        connection.release();
        return result[0].points;
    }


}

export default UserModel;
