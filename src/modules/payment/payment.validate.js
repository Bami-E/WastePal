import Joi from "joi";
import { PaymentType } from "../../types/paymentStatus.js";

export const createPaymentSchema = Joi.object({
  payment_type: Joi.string()
    .valid(
      PaymentType.PER_PICKUP,
      PaymentType.SUBSCRIPTION
    )
    .required()
    .messages({
      "any.only": "Invalid payment type",
      "any.required": "Payment type is required",
    }),
});