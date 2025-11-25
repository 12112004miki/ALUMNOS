import "reflect-metadata";
import { DataSource } from "typeorm";
import { Alumno } from "../entities/Alumno";
import { Materia } from "../entities/Materia";
import { Tarea } from "../entities/Tarea";
import dotenv from "dotenv";

dotenv.config();

// Elegir la base de datos según el entorno
const dbName = process.env.NODE_ENV === "test" ? "InstitutoDB_Test" : process.env.DB_DATABASE;

export const AppDataSource = new DataSource({
  type: "mssql",
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT || 1433),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: dbName, // <-- aquí usamos dbName dinámico
  options: {
    encrypt: process.env.DB_ENCRYPT === "true" ? true : false,
  },
  synchronize: true, // false en producción
  logging: false,
  entities: [Alumno, Materia, Tarea],
});
