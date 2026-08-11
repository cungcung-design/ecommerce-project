import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useCart } from "../hooks/useCart";
import { useCreateOrder } from "../hooks/useOrders";
import { useCreatePaymentSession } from "../hooks/usePayment";

import CheckoutForm from "../components/checkout/CheckoutForm";
import CheckoutSummary from "../components/checkout/CheckoutSummary";

function CheckoutPage() {
  const navigate = useNavigate();

  const {
    data: cart,
    isLoading: cartLoading,
    isError: cartError,
  } = useCart();

  const createOrder = useCreateOrder();
  const createPaymentSession = useCreatePaymentSession();

  const [error, setError] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("COD");

  const items = cart?.items || [];

  const subtotal = items.reduce(
    (total, item) => total + Number(item.product.price) * item.quantity,
    0
  );

  const shipping = subtotal > 100 ? 0 : 10;
  const total = subtotal + shipping;

  const handleSubmit = async (shippingData) => {
    setError("");

    try {
      const order = await createOrder.mutateAsync({
        items: items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
        })),
        shipping: {
          name: shippingData.fullName,
          phone: shippingData.phone,
          address: shippingData.address,
          city: shippingData.city,
          postalCode: shippingData.postalCode,
        },
        paymentMethod: shippingData.paymentMethod,
      });

      if (shippingData.paymentMethod === "ONLINE") {
        const session = await createPaymentSession.mutateAsync(order.id);

        if (session?.paymentUrl) {
          window.location.href = session.paymentUrl;
          return;
        }

        throw new Error("Payment session could not be created");
      }

      navigate(`/orders/${order.id}`);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Checkout failed"
      );
    }
  };

  const isSubmitting = createOrder.isPending || createPaymentSession.isPending;

  if (cartLoading) {
    return (
      <div className="p-4 sm:p-8">
        <p className="text-gray-600">Loading checkout...</p>
      </div>
    );
  }

  if (cartError || !cart || items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-12 text-center">
        <h1 className="text-3xl font-bold">Checkout</h1>

        <p className="mt-6 text-gray-600">Your cart is empty.</p>

        <a
          href="/products"
          className="mt-6 inline-block rounded-lg bg-black px-6 py-3 text-white"
        >
          Continue Shopping
        </a>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:py-12">
      <h1 className="text-2xl font-bold sm:text-3xl">Checkout</h1>

      {error && (
        <div className="mt-6 rounded-lg bg-red-50 p-4 text-red-600">
          {error}
        </div>
      )}

      {createPaymentSession.isError && (
        <div className="mt-6 rounded-lg bg-red-50 p-4 text-red-600">
          {createPaymentSession.error?.response?.data?.message ||
            createPaymentSession.error?.message ||
            "Failed to start online payment"}
        </div>
      )}

      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        <CheckoutForm
          onSubmit={handleSubmit}
          onPaymentMethodChange={setPaymentMethod}
          isSubmitting={isSubmitting}
        />

        <CheckoutSummary
          items={items}
          subtotal={subtotal}
          shipping={shipping}
          total={total}
          paymentMethod={paymentMethod}
        />
      </div>

      <p className="mt-6 text-xs text-gray-500">
        Prices are verified server-side. You will only be charged the
        confirmed order total.
      </p>
    </div>
  );
}

export default CheckoutPage;
