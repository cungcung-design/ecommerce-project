import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ShieldCheck, Lock, ArrowLeft, AlertCircle, ShoppingBag, Loader2 } from "lucide-react";

import { useCart } from "../hooks/useCart";
import { useCreateOrder } from "../hooks/useOrders";
import { useCreatePaymentSession } from "../hooks/usePayment";
import useNotification from "../hooks/useNotification";

import CheckoutForm from "../components/checkout/CheckoutForm";
import CheckoutSummary from "../components/checkout/CheckoutSummary";

function CheckoutPage() {
  const navigate = useNavigate();
  const { notify } = useNotification();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

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
          notify.success("Payment session created. Redirecting...");
          window.location.href = session.paymentUrl;
          return;
        }

        throw new Error("Payment session could not be created");
      }

      notify.success("Order placed successfully!");
      navigate(`/orders/${order.id}`);
    } catch (err) {
      const message = err.response?.data?.message || err.message || "Checkout failed";
      setError(message);
      notify.error(message);
    }
  };

  const isSubmitting = createOrder.isPending || createPaymentSession.isPending;

  if (cartLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-3">
        <Loader2 className="w-8 h-8 text-orange-600 animate-spin" />
        <p className="text-sm font-medium text-slate-500">Preparing your checkout...</p>
      </div>
    );
  }

  if (cartError || !cart || items.length === 0) {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center mx-auto shadow-inner">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Your cart is empty</h1>
          <p className="text-sm text-slate-500">Add some items to your cart before proceeding to checkout.</p>
        </div>
        <Link
          to="/products"
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-900 hover:bg-orange-600 px-7 py-3.5 text-sm font-bold text-white shadow-lg transition-all duration-300"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-6 py-6 sm:py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-100 pb-4">
        <div className="space-y-1">
          <Link
            to="/cart"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-orange-600 transition-colors mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Cart
          </Link>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Checkout</h1>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200/80 text-xs font-bold text-slate-600">
          <Lock className="w-3.5 h-3.5 text-orange-600" /> Secure 256-Bit Encryption
        </div>
      </div>

      {/* Error Banners */}
      {error && (
        <div className="flex items-start gap-3 rounded-xl bg-rose-50 border border-rose-100 p-3.5 text-rose-700 shadow-sm">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}

      {createPaymentSession.isError && (
        <div className="flex items-start gap-3 rounded-xl bg-rose-50 border border-rose-100 p-3.5 text-rose-700 shadow-sm">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
          <p className="text-sm font-medium">
            {createPaymentSession.error?.response?.data?.message ||
              createPaymentSession.error?.message ||
              "Failed to start online payment"}
          </p>
        </div>
      )}

      {/* Main Grid Layout */}
      <div className="grid gap-6 lg:grid-cols-12 lg:items-start">
        <div className="lg:col-span-7">
          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 sm:p-6 shadow-sm">
            <CheckoutForm
              onSubmit={handleSubmit}
              onPaymentMethodChange={setPaymentMethod}
              isSubmitting={isSubmitting}
            />
          </div>
        </div>

        <div className="lg:col-span-5">
          <div className="sticky top-24 rounded-2xl border border-slate-200/80 bg-slate-50/50 p-5 sm:p-6 shadow-sm">
            <CheckoutSummary
              items={items}
              subtotal={subtotal}
              shipping={shipping}
              total={total}
              paymentMethod={paymentMethod}
            />
          </div>
        </div>
      </div>

      {/* Footer Security Note */}
      <div className="flex items-center justify-center gap-2 pt-3 text-xs text-slate-400 font-medium text-center">
        <ShieldCheck className="w-4 h-4 text-orange-600" />
        <span>Prices are verified server-side. You will only be charged the confirmed order total.</span>
      </div>
    </div>
  );
}

export default CheckoutPage;