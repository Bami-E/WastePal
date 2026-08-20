import { Router } from "express";
import { authverification, authorize } from "../../middleware/auth.middleware.js";
import { UserRole } from "../../types/user.js";
import * as paymentController from "./payment.controller.js";
import { validate } from "../../middleware/validate.middleware.js";
import { createPaymentSchema } from "./payment.validate.js";


const router = Router();

router.get( "/callback", paymentController.paymentCallback);

router.use(authverification);

router.post( "/bookings/:bookingId", authorize(UserRole.HOUSEHOLD, UserRole.BUSINESS_OWNER), validate(createPaymentSchema), paymentController.createPickupPayment);

export default router;