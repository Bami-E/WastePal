import express from "express";
import morgan from "morgan";
import authRoutes from "./modules/auth/auth.route.js";
import { errorHandler } from "./middleware/error.middleware.js";
//import userRoutes  from "./modules/user/profile.route.js";


const app = express();

app.use(express.json());
app.use(morgan("dev"));


app.use("/api/auth", authRoutes);
//app.use("/api/v1/users", userRoutes);



app.use(errorHandler)


export default app;