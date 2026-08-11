export const orderShippedEmail = ({ order, user }) => {
  return {
    subject: `Order #${order.id} Shipped`,
    html: `
      <h1>Your Order Has Shipped</h1>

      <p>Your order is now on the way, ${user?.name || "Customer"}.</p>

      <p><strong>Order:</strong> #${order.id}</p>

      <p>Thank you for shopping with us.</p>
    `,
  };
};
