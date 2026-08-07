import { AppDataSource } from "./config/db.js";
import app from "./app.js";
import dotenv from "dotenv";
dotenv.config();




const port = process.env.PORT || 3000;


const startServer = async () => {

    try {

      await AppDataSource.initialize();
      console.log("Database connected successfully");
    
  } catch (error) {
      console.error("Error connecting to the database:", error);
    
  }
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
};

startServer();

