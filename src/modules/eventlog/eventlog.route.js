import express from "express";
import { validate } from "../../utils/validate.js";
import { Router } from "express";
import * as eventController from "./eventlog.controller.js";
import { bookingCreatedSchema, bookingMatchedSchema, pickupCompletedSchema, paymentSaleSchema, pickerActivitySchema } from "./eventlog.validate.js";


const router = Router();


router.post("/booking-created", validate(bookingCreatedSchema), eventController.bookingCreated);
router.post("/booking-matched", validate(bookingMatchedSchema), eventController.bookingMatched);
router.post("/pickup-completed", validate(pickupCompletedSchema), eventController.pickupCompleted);
router.post("/payment-sale", validate(paymentSaleSchema), eventController.paymentSale);
router.post("/picker-activity", validate(pickerActivitySchema), eventController.pickerActivity);
router.get("/", eventController.list);

export default router