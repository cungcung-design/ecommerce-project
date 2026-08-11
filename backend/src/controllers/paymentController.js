import * as paymentService from "../services/paymentService.js";
import * as paymentProviderService from "../services/paymentProviderService.js";

export const createPaymentSession = async (req, res, next) => {
  try {
    const orderId = Number(req.body.orderId);

    if (!Number.isInteger(orderId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order ID",
      });
    }

    const session = await paymentService.prepareOnlinePaymentSession(
      req.user.id,
      orderId
    );

    res.json({
      success: true,
      paymentUrl: session.paymentUrl,
      reference: session.reference,
    });
  } catch (error) {
    next(error);
  }
};
