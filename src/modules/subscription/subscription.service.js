import { AppDataSource } from "../../config/db.js";
import { SubscriptionStatus } from "../../types/subscriptionstatus.js";

const subscriptionRepository = AppDataSource.getRepository("Subscription");

export const getActiveSubscription = async (userId) => {
  const subscription = await subscriptionRepository.findOne({
    where: {
      user: { id: userId },
      status: SubscriptionStatus.ACTIVE,
    },
  });

  if (!subscription) {
    return null;
  }

  if (new Date(subscription.end_date) < new Date()) {
    subscription.status = SubscriptionStatus.EXPIRED;
    await subscriptionRepository.save(subscription);
    return null;
  }

  return subscription;
};

export const createSubscription = async (userId) => {
  const startDate = new Date();

  const endDate = new Date(startDate);
  endDate.setMonth(endDate.getMonth() + 1);

  const subscription = subscriptionRepository.create({
    status: SubscriptionStatus.ACTIVE,
    start_date: startDate,
    end_date: endDate,
    user: { id: userId },
  });

  return await subscriptionRepository.save(subscription);
};