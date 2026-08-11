import { sendEmail } from "./emailService.js";
import { orderCreatedEmail } from "../templates/orderCreatedEmail.js";
import { paymentPaidEmail } from "../templates/paymentPaidEmail.js";
import { orderShippedEmail } from "../templates/orderShippedEmail.js";
import { orderDeliveredEmail } from "../templates/orderDeliveredEmail.js";

export const sendOrderCreatedEmail = async (user, order) => {
  if (!user?.email) {
    return;
  }

  const template = orderCreatedEmail({ order, user });

  await sendEmail({
    to: user.email,
    subject: template.subject,
    html: template.html,
  });
};

export const sendPaymentPaidEmail = async (user, order, payment) => {
  if (!user?.email) {
    return;
  }

  const template = paymentPaidEmail({ order, payment, user });

  await sendEmail({
    to: user.email,
    subject: template.subject,
    html: template.html,
  });
};

export const sendOrderShippedEmail = async (user, order) => {
  if (!user?.email) {
    return;
  }

  const template = orderShippedEmail({ order, user });

  await sendEmail({
    to: user.email,
    subject: template.subject,
    html: template.html,
  });
};

export const sendOrderDeliveredEmail = async (user, order) => {
  if (!user?.email) {
    return;
  }

  const template = orderDeliveredEmail({ order, user });

  await sendEmail({
    to: user.email,
    subject: template.subject,
    html: template.html,
  });
};
