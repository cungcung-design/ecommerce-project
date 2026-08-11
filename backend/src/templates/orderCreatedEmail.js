export const orderCreatedEmail = ({ order, user }) => {
  return {
    subject: `Order #${order.id} Confirmed`,
    html: `
      <h1>Order Confirmed</h1>

      <p>Thank you for your order, ${user?.name || "Customer"}.</p>

      <p><strong>Order Number:</strong> #${order.id}</p>

      <p><strong>Total:</strong> $${Number(order.totalAmount).toFixed(2)}</p>

      <p>We will notify you when your order ships.</p>
    `,
  };
};
