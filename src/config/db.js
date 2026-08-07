import { DataSource } from "typeorm";
import dotenv  from "dotenv";
import "reflect-metadata";
import { User } from "../Database/entities/user.entities.js";

dotenv.config();

export const AppDataSource = new DataSource({
  type: "postgres",
  url: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
  synchronize: true,
  logging: false,
  entities: [ User ],
  migrations: [
    "src/migration/**/*.ts"
  ],
  
});