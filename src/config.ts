import dotenv from "dotenv";
dotenv.config({path: __dirname + "/../.env"});

if (!process.env.JWT_SECRET) throw new Error("JWT_SECRET is not defined");
if (!process.env.DB_HOST) throw new Error("DB_HOST is not defined");
if (!process.env.DB_USER) throw new Error("DB_USER is not defined");
if (!process.env.DB_PASSWORD) throw new Error("DB_PASSWORD is not defined");
if (!process.env.DB_NAME) throw new Error("DB_NAME is not defined");

export default {
    JWT_SECRET: process.env.JWT_SECRET,
    DB_NAME: process.env.DB_NAME,
    DB_HOST: process.env.DB_HOST,
    DB_PORT: parseInt(process.env.DB_PORT || "3306"),
    DB_USER: process.env.DB_USER,
    DB_PASSWORD: process.env.DB_PASSWORD,
    SERVER_PORT: parseInt(process.env.SERVER_PORT || "80"),
}