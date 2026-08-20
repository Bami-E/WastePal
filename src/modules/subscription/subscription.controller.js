import {asyncHandler} from "../../utils/asyncHandler.js";
import { sendSuccess } from "../../utils/response.js";
import * as subscriptionService from "./subscription.service.js";

export const checkSubscription = asyncHandler(async (req, res) => {
  const subscription = await subscriptionService.getActiveSubscription(
    req.user.id
  );

  return sendSuccess(res, 200, "Subscription status retrieved", {
    subscribed: subscription ? true : false,
    subscription,
  });
});