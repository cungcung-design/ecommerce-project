import Stripe from "stripe";

const stripe = new Stripe(process.env.PAYMENT_PROVIDER_KEY, {
  apiVersion: "2024-10-15.acacia",
});

const currency = (process.env.PAYMENT_CURRENCY || "usd").toLowerCase();
const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5174";

const toCents = (amount) => Math.round(Number(amount) * 100);

export const isProviderConfigured = () => {
  return Boolean(process.env.PAYMENT_PROVIDER_KEY) && Boolean(process.env.PAYMENT_WEBHOOK_SECRET);
};

export const createPaymentSession = async ({ order, payment, user }) => {
  if (!process.env.PAYMENT_PROVIDER_KEY) {
    const error = new Error("Payment provider is not configured");
    error.statusCode = 500;
    throw error;
  }

  const lineItems = order.items.map((item) => ({
    price_data: {
      currency,
      product_data: {
        name: item.product?.name || "Product",
        ...(item.product?.description
          ? { description: item.product.description }
          : {}),
      },
      unit_amount: toCents(item.price),
    },
    quantity: item.quantity,
  }));

  const shippingOptions = [];
  const shippingCostCents = toCents(Number(order.totalAmount) - order.items.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0));

  if (shippingCostCents > 0) {
    shippingOptions.push({
      shipping_rate_data: {
        type: "fixed_amount",
        currency,
        fixed_amount: { amount: shippingCostCents },
        display_label: "Standard Shipping",
      },
      selected: true,
    });
  }

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",
    line_items: lineItems,
    shipping_options: shippingOptions,
    customer_email: user.email,
    client_reference_id: String(user.id),
    metadata: {
      orderId: String(order.id),
      paymentId: String(payment.id),
      userId: String(user.id),
    },
    success_url: `${frontendUrl}/payment/result?session_id={CHECKOUT_SESSION_ID}&orderId=${order.id}`,
    cancel_url: `${frontendUrl}/checkout?canceled=1`,
  });

  return {
    paymentUrl: session.url,
    reference: session.id,
  };
};

export const verifyWebhookSignature = (req) => {
  const signature = req.headers["stripe-signature"];

  if (!signature) {
    const error = new Error("Missing Stripe signature header");
    error.statusCode = 400;
    error.code = "SIGNATURE_MISSING";
    throw error;
  }

  try {
    return stripe.webhooks.constructEvent(
      req.body,
      signature,
      process.env.PAYMENT_WEBHOOK_SECRET
    );
  } catch (error) {
    error.statusCode = 400;
    error.code = "SIGNATURE_INVALID";
    throw error;
  }
};

export const parseWebhookEvent = (event) => {
  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object;
      return {
        reference: session.id,
        amount: (session.amount_total || 0) / 100,
        providerStatus: "paid",
        orderId: session.metadata?.orderId
          ? Number(session.metadata.orderId)
          : undefined,
      };
    }

    case "checkout.session.async_payment_failed":
    case "checkout.session.expired": {
      const session = event.data.object;
      return {
        reference: session.id,
        amount: (session.amount_total || 0) / 100,
        providerStatus: "failed",
        orderId: session.metadata?.orderId
          ? Number(session.metadata.orderId)
          : undefined,
      };
    }

    default:
      return null;
  }
};

export const retrievePaymentSession = async (reference) => {
  if (!reference) {
    return null;
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(reference);
    return { paymentUrl: session.url, reference: session.id };
  } catch {
    return null;
  }
};

export const getProviderConfig = () => {
  const provider = process.env.PAYMENT_PROVIDER || "stripe";
  return {
    provider,
    currency,
    providerUrl: process.env.PAYMENT_PROVIDER_URL || null,
    isSandbox: process.env.NODE_ENV !== "production",
  };
};

export default {
  createPaymentSession,
  verifyWebhookSignature,
  parseWebhookEvent,
  isProviderConfigured,
  getProviderConfig,
};
