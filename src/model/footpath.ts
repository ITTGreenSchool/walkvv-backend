import database from "../libraries/database";
import FootpathRequest from "../types/footpath_request";
import TotemModel from "./totem";

class FootpathModel {
    private id: number;
    private name: string;
    private description: string;
    private difficulty: number;
    private length: number;
    private images: string[];
    private totems: TotemModel[];

    /******************************************
     * Constructors
     ******************************************/

    public static async createFromRequest(footpath: FootpathRequest): Promise<FootpathModel> {
        return new FootpathModel(footpath);
    }

    public static async createFromDatabase(footpath: FootpathRequest) {
        
    }

    constructor(footpath: FootpathRequest) {
        this.id = footpath.id;
        this.name = footpath.name;
        this.description = footpath.description;
        this.difficulty = footpath.difficulty;
        this.length = footpath.length;
        this.images = footpath.images;
    }

    /******************************************
     * Getters and setters
     ******************************************/

    public getId(): number {
        return this.id;
    }

    public getName(): string {
        return this.name;
    }

    public getDescription(): string {
        return this.description;
    }

    public getDifficulty(): number {
        return this.difficulty;
    }

    public getLength(): number {
        return this.length;
    }

    public getImages(): string[] {
        return this.images;
    }

    public setId(id: number): void {
        this.id = id;
    }

    public setName(name: string): void {
        this.name = name;
    }

    public setDescription(description: string): void {
        this.description = description;
    }

    public setDifficulty(difficulty: number): void {
        this.difficulty = difficulty;
    }

    public setLength(length: number): void {
        this.length = length;
    }

    public setImages(images: string[]): void {
        this.images = images;
    }

    /******************************************
     * CRUD actions
     *****************************************/
    
    /**
     * Retrieves all the foothpath from the database
     * @returns An array of UserModel objects
     */
    public static async selectAll(): Promise<FootpathModel[]> {
        let connection = await database.getInstance().getConnection();
        let result = await connection.query(
            "SELECT * FROM footpath"
        );
        connection.release();
        return result;
    }

    /**
     * Inserts a footpath into the database
     * @param footpath The user to insert into the database
     */
    public static async insert(footpath: FootpathModel) {
        let connection = await database.getInstance().getConnection();
        let result = await connection.query(
            "INSERT INTO footpath (name, description, difficulty, length, images) VALUES (?, ?, ?, ?, ?)",
            [footpath.getName(), footpath.getDescription(), footpath.getDifficulty(), footpath.getLength(), footpath.getImages()]
        );
    }

    /**
     * Updates a footpath in the database
     * @param footpath The user to update in the database
     */
    public static async update(footpath: FootpathModel) {
        let connection = await database.getInstance().getConnection();
        // Do not insert empty values
        let result = await connection.query(
            "UPDATE footpath SET name = ?, description = ?, difficulty = ?, length = ?, images = ? WHERE id = ?",
            [footpath.getName(), footpath.getDescription(), footpath.getDifficulty(), footpath.getLength(), footpath.getImages(), footpath.getId()]
        );
    }

    /**
     * Deletes a footpath from the database
     * @param footpath The user to delete from the database
     */
    public static async delete(footpath: FootpathModel) {
        let connection = await database.getInstance().getConnection();
        let result = await connection.query(
            "DELETE FROM footpath WHERE id = ?",
            [footpath.getId()]
        );
    }
}

export default FootpathModel;