import "reflect-metadata";
import { DataSource } from "typeorm";

export const AppDataSource = new DataSource({
  type: "mysql",
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3306,
  host: process.env.DB_HOST,
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  synchronize: process.env.DB_SYNC == "true",
  logging: false,
  entities: [],
  migrations: [],
  subscribers: [],
});
