export const orderDeliveredEmail = ({ order, user }) => {
  return {
    subject: `Order #${order.id} Delivered`,
    html: `
      <h1>Order Delivered</h1>

      <p>Your order has been delivered, ${user?.name || "Customer"}.</p>

      <p><strong>Order:</strong> #${order.id}</p>

      <p>Thank you for shopping with us.</p>
    `,
  };
};
