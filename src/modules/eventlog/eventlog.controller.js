import { sendSuccess } from "../../utils/response.js";
import * as eventService from "./eventlog.services.js";
import asyncHandler from "../../utils/asyncHandler.js";


export const bookingCreated = asyncHandler(async (req, res) => {
  const event = await eventService.logBookingCreated(req.body);
  return sendSuccess(res, 201, "Event logged", { event });
});

export const bookingMatched = asyncHandler(async (req, res) => {
  const event = await eventService.logBookingMatched(req.body);
  return sendSuccess(res, 201, "Event logged", { event });
});

export const pickupCompleted = asyncHandler(async (req, res) => {
  const event = await eventService.logPickupCompleted(req.body);
  return sendSuccess(res, 201, "Event logged", { event });
});

export const paymentSale = asyncHandler(async (req, res) => {
  const event = await eventService.logPaymentSale(req.body);
  return sendSuccess(res, 201, "Event logged", { event });
});

export const pickerActivity = asyncHandler(async (req, res) => {
  const event = await eventService.logPickerActivity(req.body);
  return sendSuccess(res, 201, "Event logged", { event });
});

export const list = asyncHandler(async (req, res) => {
  const events = await eventService.getEvents(req.query);
  return sendSuccess(res, 200, "Events fetched", { events });
});