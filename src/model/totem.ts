import database from "../libraries/database";

class TotemModel {
    private id: number;
    private points: number;
    private latitude: number;
    private longitude: number;


    public constructor(id: number, points: number, latitude: number, longitude: number) {
        this.id = id;
        this.points = points;
        this.latitude = latitude;
        this.longitude = longitude;
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
            "SELECT * FROM totem"
        );
        connection.release();
        return result;
    }

    /**
     * Inserts a totem into the database
     * @param totem The user to insert into the database
     */
    public static async insert(totem: TotemModel) {
        let connection = await database.getInstance().getConnection();
        await connection.query(
            "INSERT INTO totem (codice, punteggio, latitudine, longitudine) VALUES (?, ?, ?, ?)",
            [totem.getId(), totem.getPoints(), totem.getLatitude(), totem.getLongitude()]
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
            "UPDATE totem SET punteggio = ? WHERE codice = ?",
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
            "DELETE FROM totem WHERE codice = ?",
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
    public static async scan_totem(totem: number, user_email: string) {
        let connection = await database.getInstance().getConnection();

        // Check if the user has already scanned the totem
        let result = await connection.query(
            "SELECT * FROM scansione WHERE utente = ? AND totem = ? ORDER BY data DESC LIMIT 1",
            [user_email, totem]
        );

    }
}

export default TotemModel;
