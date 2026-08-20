import { Router } from "express";
import { authverification } from "../../middleware/auth.middleware.js";
import * as subscriptionController from "./subscription.controller.js";

const router = Router();

router.use(authverification);

router.get( "/status", subscriptionController.checkSubscription);

export default router;