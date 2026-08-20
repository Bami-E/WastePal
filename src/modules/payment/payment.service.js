import { AppDataSource } from "../../config/db.js";
import { AppError } from "../../utils/AppError.js";
import { PaymentType, PaymentStatus } from "../../types/paymentstatus.js";
import { getPickupPrice } from "./payment.pricing.js";
import { SubscriptionStatus } from "../../types/subscriptionStatus.js";
import { getActiveSubscription } from "../subscription/subscription.service.js";
import { initializePayment } from "./paystack.service.js";


const paymentRepository = AppDataSource.getRepository("Payment");
const bookingRepository = AppDataSource.getRepository("Booking");

export const createPayment = async (userId, bookingId, paymentType) => {
  const booking = await bookingRepository.findOne({
    where: {
      booking_id: bookingId,
    },
    relations: ["requester"],
  });
  
  if (!booking) {
    throw new AppError( "Booking not found", 404, "BOOKING_NOT_FOUND" );}
    
  if (booking.requester?.id !== userId) {
    throw new AppError( "You are not the requester of this booking", 403, "NOT_BOOKING_REQUESTER"  );}


  const activeSubscription = await getActiveSubscription(userId);

  if (paymentType === PaymentType.PER_PICKUP && !booking.quantity) {
    throw new AppError( "Bag quantity is required", 400, "QUANTITY_REQUIRED");}


    let amount;

    if (paymentType === PaymentType.PER_PICKUP) {
        if (activeSubscription) {
        throw new AppError( "Your active subscription covers this pickup", 409, "PICKUP_COVERED_BY_SUBSCRIPTION");
}
    amount = getPickupPrice(booking.quantity);

    } else if (paymentType === PaymentType.SUBSCRIPTION) {
    if (activeSubscription) {
    throw new AppError( "You already have an active subscription", 409, "ACTIVE_SUBSCRIPTION_EXISTS");}

  amount = 3182;
    } else {
    throw new AppError( "Invalid payment type", 400, "INVALID_PAYMENT_TYPE");
    }

  const reference = `PAY-${Date.now()}-${bookingId}`;

  const paystackData = await initializePayment({
    email: booking.requester.email,
    amount,
    reference,
    callback_url: process.env.PAYSTACK_CALLBACK_URL,
  });


  const payment = paymentRepository.create({
    amount,
    payment_type: paymentType,
    payment_method: "paystack",
    payment_status: PaymentStatus.PENDING,
    transaction_reference: reference,
    payer: { id: userId },
    booking: { booking_id: bookingId },
  });

  return await paymentRepository.save(payment);
};

