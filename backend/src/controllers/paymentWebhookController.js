import * as paymentService from "../services/paymentService.js";
import * as paymentProviderService from "../services/paymentProviderService.js";
import * as notificationService from "../services/notificationService.js";

export const handleWebhook = async (req, res, next) => {
  try {
    const event = paymentProviderService.verifyWebhookSignature(req);

    if (event === null || event === undefined) {
      return res.status(200).json({ received: true });
    }

    const payload = paymentProviderService.parseWebhookEvent(event);

    if (!payload) {
      return res.status(200).json({ received: true });
    }

    const result = await paymentService.processProviderWebhook(payload);

    if (result.processed && result.payment?.status === "PAID" && payload.orderId) {
      try {
        const payment = await paymentService.getPaymentByOrderId(payload.orderId);

        if (payment?.order?.user?.email) {
          await notificationService.sendPaymentPaidEmail(
            payment.order.user,
            payment.order,
            payment
          );
        }
      } catch {
        // Do not fail the webhook if email sending fails.
      }
    }

    return res.status(200).json({
      success: true,
      received: true,
      processed: result.processed,
      reason: result.reason,
    });
  } catch (error) {
    if (error.code === "SIGNATURE_INVALID" || error.code === "SIGNATURE_MISSING") {
      return res.status(400).json({
        success: false,
        message: "Webhook signature verification failed",
      });
    }

    if (error.statusCode) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message,
      });
    }

    next(error);
  }
};
