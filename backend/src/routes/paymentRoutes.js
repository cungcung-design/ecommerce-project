import express from "express";

import {
  createPaymentSession,
} from "../controllers/paymentController.js";
import { handleWebhook } from "../controllers/paymentWebhookController.js";

import { protect } from "../middleware/authMiddleware.js";
import { validate } from "../middleware/validationMiddleware.js";
import { createPaymentSessionSchema } from "../validators/paymentValidator.js";

const router = express.Router();

router.post(
  "/create",
  protect,
  validate(createPaymentSessionSchema),
  createPaymentSession
);

router.post("/webhook", handleWebhook);

export default router;
