import {asyncHandler} from "../../utils/asyncHandler.js";
import { sendSuccess } from "../../utils/response.js";
import * as paymentService from "./payment.service.js";
import { AppError } from "../../utils/AppError.js";
import { verifyPayment } from "./paystack.service.js";
import { AppDataSource } from "../../config/db.js";
import { PaymentStatus, PaymentType } from "../../types/paymentStatus.js";
import { createSubscription } from "../subscription/subscription.service.js";

const paymentRepository = AppDataSource.getRepository("Payment");

export const createPickupPayment = asyncHandler(async (req, res) => {
  const { bookingId } = req.params;
  const { payment_type } = req.body;

  const payment = await paymentService.createPayment(
    req.user.id,
    bookingId,
    payment_type
  );

  return sendSuccess( res, 201, "Payment created successfully", { payment } );
});

export const paymentCallback = asyncHandler(async (req, res) => {
  const { reference } = req.query;

  if (!reference) {
    throw new AppError( "Payment reference is required", 400, "PAYMENT_REFERENCE_REQUIRED" );
  }

   const transaction = await verifyPayment(reference);

  const payment = await paymentRepository.findOne({
    where: {
      transaction_reference: reference,
    },
    relations: ["payer"],
  });

  if (!payment) {
    throw new AppError( "Payment record not found", 404, "PAYMENT_NOT_FOUND");}

  if (payment.payment_status === PaymentStatus.PAID) {
   return res.json({ message: "Payment already processed", payment, });
}

  if (transaction.status === "success") {
  payment.payment_status = PaymentStatus.PAID;

  if (payment.payment_type === PaymentType.SUBSCRIPTION) {
    await createSubscription(payment.payer.id);
  }
  } else {
  payment.payment_status = PaymentStatus.FAILED;
  }
  const savedPayment = await paymentRepository.save(payment);

  return res.json({
    message: "Payment verified",
    payment: savedPayment,
  });
});
