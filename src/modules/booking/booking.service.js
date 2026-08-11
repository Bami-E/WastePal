import { AppDataSource } from "../../config/db.js";
import { BookingStatus, CompletionStatus} from "../../types/bookingstatus.js";
import { AppError } from "../../utils/AppError.js";


const bookingRepository = AppDataSource.getRepository("Booking");
const bookingStatusLogRepository = AppDataSource.getRepository("BookingStatusLog");

export const createBooking = async (userId, payload) => {
  const booking = bookingRepository.create({
    requester: {
      id: userId,
    },

    waste_type: payload.waste_type,
    lga: payload.lga,
    area: payload.area,
    address_text: payload.address_text,
    time_window_start: payload.time_window_start,
    time_window_end: payload.time_window_end,
  });

  const savedBooking = await bookingRepository.save(booking);

  await bookingStatusLogRepository.save({
    booking: savedBooking,
    status: BookingStatus.BOOKED,
  });

  return savedBooking;
};

export const claimBooking = async (bookingId, pickerId) => {
  const booking = await bookingRepository.findOne({
    where: {
      booking_id: bookingId,
    },
  });

  if (!booking) {
    throw new AppError(
      "Booking not found",
      404,
      "BOOKING_NOT_FOUND"
    );
  }

  if (booking.status !== BookingStatus.BOOKED) {
    throw new AppError(
      "Booking is no longer available",
      409,
      "BOOKING_NOT_AVAILABLE"
    );
  }

  booking.picker = {
    id: pickerId,
  };

  booking.status = BookingStatus.CLAIMED;

  const savedBooking = await bookingRepository.save(booking);

  await bookingStatusLogRepository.save({
    booking: savedBooking,
    status: BookingStatus.CLAIMED,
  });

  return savedBooking;
};

export const completeBooking = async ( bookingId, pickerId, payload) => {
  const booking = await bookingRepository.findOne({
    where: {
      booking_id: bookingId,
    },
  });

  if (!booking) {
    throw new AppError(
      "Booking not found",
      404,
      "BOOKING_NOT_FOUND"
    );
  }

  if (booking.picker?.id !== pickerId) {
    throw new AppError(
      "You are not assigned to this booking",
      403,
      "NOT_ASSIGNED_TO_BOOKING"
    );
  }

  if (booking.status !== BookingStatus.CLAIMED) {
    throw new AppError(
      "Booking cannot be completed",
      409,
      "BOOKING_NOT_CLAIMED"
    );
  }

  booking.actual_weight_or_bags = payload.actual_weight_or_bags;
  booking.completion_status = payload.completion_status;
  booking.completed_at = new Date();

  if (payload.completion_status === CompletionStatus.COMPLETED) {
    booking.status = BookingStatus.COMPLETED;
  }

  const savedBooking = await bookingRepository.save(booking);

  await bookingStatusLogRepository.save({
    booking: savedBooking,
    status: BookingStatus.COMPLETED,
  });

  return savedBooking;
};