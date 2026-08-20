import { DataSource } from "typeorm";
import dotenv  from "dotenv";
import "reflect-metadata";
import { User } from "../database/entities/user.entities.js";
import { Booking } from "../database/entities/booking.entities.js";
import { BookingStatusLog } from "../database/entities/booking_status_logs.entities.js";
import { Payment } from "../database/entities/payment.entities.js";
import { Subscription } from "../database/entities/subscription.entities.js";

dotenv.config();

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.PGHOST,
  port: parseInt(process.env.PGPORT),
  username: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  database: process.env.PGDATABASE,
  url: process.env.DATABASE_URL,
  // ssl: {
  //   rejectUnauthorized: false,
  // },

  synchronize: false,
  logging: false,
  entities: [ User, Booking, BookingStatusLog, Payment, Subscription ],
  migrations: [
    "src/migration/**/*.js"
  ],
  
});

