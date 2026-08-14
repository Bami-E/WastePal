// src/validations/event.validation.js
import Joi from "joi";

export const bookingCreatedSchema = Joi.object({
  zone: Joi.string().trim().required().messages({
    "string.empty": "Zone is required",
    "any.required": "Zone is required",
  }),

  userType: Joi.string().valid("Household", "Business - Shop", "Business - Restaurant").required().messages({
    "any.only": "userType must be Household, Business - Shop, or Business - Restaurant",
    "any.required": "userType is required",
  }),

  userId: Joi.string().uuid().required().messages({
    "string.guid": "userId must be a valid UUID",
    "any.required": "userId is required",
  }),

  wasteType: Joi.string().trim().optional(),

  requestedPickupDate: Joi.date().iso().required().messages({
    "date.base": "requestedPickupDate must be a valid date",
    "any.required": "requestedPickupDate is required",
  }),

  priceQuoted: Joi.number().positive().required().messages({
    "number.base": "priceQuoted must be a number",
    "number.positive": "priceQuoted must be greater than 0",
    "any.required": "priceQuoted is required",
  }),

  paymentMethodIntent: Joi.string().trim().required().messages({
    "any.required": "paymentMethodIntent is required",
  }),
});

export const bookingMatchedSchema = Joi.object({
  bookingId: Joi.string().uuid().required().messages({
    "string.guid": "bookingId must be a valid UUID",
    "any.required": "bookingId is required",
  }),

  pickerId: Joi.string().uuid().required().messages({
    "string.guid": "pickerId must be a valid UUID",
    "any.required": "pickerId is required",
  }),

  zone: Joi.string().trim().required(),
});

export const pickupCompletedSchema = Joi.object({
  bookingId: Joi.string().uuid().required().messages({
    "any.required": "bookingId is required",
  }),

  pickerId: Joi.string().uuid().required().messages({
    "any.required": "pickerId is required",
  }),

  actualWeightOrBags: Joi.number().positive().required().messages({
    "number.positive": "actualWeightOrBags must be greater than 0",
    "any.required": "actualWeightOrBags is required",
  }),

  completionStatus: Joi.string().valid("Completed", "No-show", "Cancelled").required().messages({
    "any.only": "completionStatus must be Completed, No-show, or Cancelled",
    "any.required": "completionStatus is required",
  }),
});

export const paymentSaleSchema = Joi.object({
  bookingId: Joi.string().uuid().required().messages({
    "any.required": "bookingId is required",
  }),

  amount: Joi.number().positive().required().messages({
    "number.positive": "amount must be greater than 0",
    "any.required": "amount is required",
  }),

  paymentStatus: Joi.string().valid("Paid", "Pending", "Failed").required().messages({
    "any.only": "paymentStatus must be Paid, Pending, or Failed",
    "any.required": "paymentStatus is required",
  }),
});

export const pickerActivitySchema = Joi.object({
  pickerId: Joi.string().uuid().required().messages({
    "any.required": "pickerId is required",
  }),

  zone: Joi.string().trim().required(),

  activeStatus: Joi.boolean().required().messages({
    "boolean.base": "activeStatus must be true or false",
    "any.required": "activeStatus is required",
  }),

  jobsCompletedToDate: Joi.number().integer().min(0).required().messages({
    "number.integer": "jobsCompletedToDate must be a whole number",
    "number.min": "jobsCompletedToDate cannot be negative",
    "any.required": "jobsCompletedToDate is required",
  }),
});