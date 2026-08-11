export const paymentPaidEmail = ({ order, payment, user }) => {
  return {
    subject: `Payment Confirmed - Order #${order.id}`,
    html: `
      <h1>Payment Confirmed</h1>

      <p>Your payment has been successfully confirmed, ${user?.name || "Customer"}.</p>

      <p><strong>Order:</strong> #${order.id}</p>

      <p><strong>Amount:</strong> $${Number(payment.amount).toFixed(2)}</p>

      <p>We will notify you when your order ships.</p>
    `,
  };
};
