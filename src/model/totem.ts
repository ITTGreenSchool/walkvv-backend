import database from "../libraries/database";
import {TotemRequest} from "../types/totem_request";

class TotemModel {
    private id: number;
    private points: number;
    private latitude: number;
    private longitude: number;

    /******************************************
     * Constructors
     ******************************************/

    public static async createFromRequest(totem: TotemRequest): Promise<TotemModel> {
        return new TotemModel(totem);
    }

    public static async createFromDatabase(totem: TotemRequest) {
        return new TotemModel(totem);
    }

    public constructor(totem: TotemRequest) {
        this.id = totem.id;
        this.points = totem.points;
        this.latitude = totem.latitude;
        this.longitude = totem.longitude;
    }


    /******************************************
     * Getters and setters
     ******************************************/

    public getId(): number {
        return this.id;
    }

    public getPoints(): number{
        return this.points;
    }

    public getLatitude(): number {
        return this.latitude;
    }

    public getLongitude(): number {
        return this.longitude;
    }    

    public setId(id: number): void {
        this.id = id;
    }

    public setPoints(points: number): void { 
        this.points = points;
    }

    public setLongitude(longitude: number): void {
        this.longitude = longitude;
    }

    public setLatitude(latitude: number): void {
        this.latitude = latitude;
    }

    /******************************************
     * CRUD actions
     *****************************************/
    
    /**
     * Retrieves all the totem from the database
     * @returns An array of UserModel objects
     */
    public static async selectAll(): Promise<TotemModel[]> {
        let connection = await database.getInstance().getConnection();
        let result = await connection.query(
            "SELECT * FROM totems"
        );
        connection.release();
        return result;
    }

    /**
     * Retrieves a totem from the database by its id
     * @param id The id of the totem to retrieve
     * @returns A TotemModel object
     */
    public static async selectById(id: number): Promise<TotemModel> {
        let connection = await database.getInstance().getConnection();
        let result = await connection.query(
            "SELECT * FROM totems WHERE id = ?",
            [id]
        );
        connection.release();
        return result[0];
    }

    /**
     * Inserts a totem into the database
     * @param totem The user to insert into the database
     */
    public static async insert(totem: TotemModel) {
        let connection = await database.getInstance().getConnection();
        await connection.query(
            "INSERT INTO totems (points, latitude, longitude) VALUES (?, ?, ?)",
            [totem.getPoints(), totem.getLatitude(), totem.getLongitude()]
        );
        connection.release();
    }

    /**
     * Updates a totem in the database
     * @param totem The user to update in the database
     */
    public static async update(totem: TotemModel) {
        let connection = await database.getInstance().getConnection();
        await connection.query(
            "UPDATE totems SET points = ? WHERE id = ?",
            [totem.getPoints(), totem.getId()]
        );
        connection.release();
    }

    /**
     * Deletes a totem from the database
     * @param totem The user to delete from the database
     */
    public static async delete(totem: TotemModel) {
        let connection = await database.getInstance().getConnection();
        await connection.query(
            "DELETE FROM totems WHERE codice = ?",
            [totem.getId()]
        );
        connection.release();
    }

    /******************************************
     * Non CRUD actions
     *****************************************/

    /**
     * Registers the scan of a totem by a user in the database
     * @param totem The scanned totem id
     */
    public static async scan_totem(totem_id: number, user_id: string) {
        let connection = await database.getInstance().getConnection();

        // Check if the user has already scanned the totem in the last 24 hours
        let result = await connection.query(
            "SELECT * FROM scans WHERE user_id = ? AND totem_id = ? AND datetime > DATE_SUB(NOW(), INTERVAL 1 DAY)",
            [user_id, totem_id]
        );

        // If the user scanned the totem in the last 24 hours, throw an error
        if (result[0]) {
            // The user has already scanned the totem in the last 24 hours
            connection.release();
            throw new Error("totem_scan_delay_error");
        }

        // The user hasn't scanned the totem in the last 24 hours, register the scan
        await connection.query( 
            "INSERT INTO scans (user_id, totem_id, datetime) VALUES (?, ?, NOW())",
            [user_id, totem_id]
        );

    }
}

export default TotemModel;
