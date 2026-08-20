import express from "express";
import morgan from "morgan";
import authRoutes from "./modules/auth/auth.route.js";
import { errorHandler } from "./middleware/error.middleware.js";
import userRoutes  from "./modules/user/profile.route.js";
import bookingRoutes  from "./modules/booking/booking.routes.js"
import paymentRoutes from "./modules/payment/payment.routes.js";
import subscriptionRoutes from "./modules/subscription/subscription.routes.js"

const app = express();

app.use(express.json());
app.use(morgan("dev"));


app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/booking", bookingRoutes)
app.use("/api/payments", paymentRoutes);
app.use("/api/subscriptions", subscriptionRoutes);



app.use(errorHandler)


export default app;