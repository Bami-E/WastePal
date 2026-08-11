import Joi from "joi";
import { CompletionStatus } from "../../types/bookingstatus.js";

export const completeBookingSchema = Joi.object({
  actual_weight_or_bags: Joi.number()
    .positive()
    .required(),

  completion_status: Joi.string()
    .valid(...Object.values(CompletionStatus))
    .required(),
});