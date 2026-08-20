import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ShieldCheck, Lock, ArrowLeft, AlertCircle, ShoppingBag, Loader2 } from "lucide-react";

import { useCart } from "../hooks/useCart";
import { useCreateOrder } from "../hooks/useOrders";
import { useCreatePaymentSession } from "../hooks/usePayment";
import useNotification from "../hooks/useNotification";
import {
  disableBrowserScrollRestoration,
  focusPageTop,
} from "../lib/scrollToTop";

import CheckoutForm from "../components/checkout/CheckoutForm";
import CheckoutSummary from "../components/checkout/CheckoutSummary";

function CheckoutPage() {
  const navigate = useNavigate();
  const { notify } = useNotification();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
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
  const [orderSucceeded, setOrderSucceeded] = useState(false);

  const items = cart?.items || [];

  const subtotal = items.reduce(
    (total, item) => total + Number(item.product.price) * item.quantity,
    0
  );

  const shipping = subtotal > 100 ? 0 : 10;
  const total = subtotal + shipping;

  const handleSubmit = async (shippingData) => {
    setError("");

    disableBrowserScrollRestoration();
    focusPageTop();

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
          setOrderSucceeded(true);
          disableBrowserScrollRestoration();
          focusPageTop();
          window.location.href = session.paymentUrl;
          return;
        }

        throw new Error("Payment session could not be created");
      }

      setOrderSucceeded(true);
      disableBrowserScrollRestoration();
      focusPageTop();
      notify.success("Order placed successfully!");
      navigate(`/orders/${order.id}`);
    } catch (err) {
      const message =
        (err && typeof err === "object" && err.response && typeof err.response === "object" && err.response.data && typeof err.response.data === "object" && err.response.data.message) ||
        (err && typeof err === "object" && err.message) ||
        "Checkout failed";
      setError(message);
    }
  };

  const isSubmitting = createOrder.isPending || createPaymentSession.isPending;

  if (cartLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-3">
        <Loader2 className="w-10 h-10 text-orange-600 animate-spin" />
        <p className="text-base font-medium text-slate-500">Preparing your checkout...</p>
      </div>
    );
  }

  if (!orderSucceeded && (cartError || !cart || items.length === 0)) {
    return (
      <div className="mx-auto max-w-lg px-4 py-24 text-center space-y-6">
        <div className="w-20 h-20 rounded-3xl bg-orange-50 text-orange-600 flex items-center justify-center mx-auto shadow-inner">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <h1 className="text-3xl font-medium text-slate-900 tracking-tight font-serif">Your cart is empty</h1>
          <p className="text-base text-slate-500">Add some items to your cart before proceeding to checkout.</p>
        </div>
        <Link
          to="/products"
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-900 hover:bg-orange-600 px-8 py-4 text-base font-semibold text-white shadow-xl transition-all duration-300"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    // Expanded max-w-5xl for a larger, wider container layout
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-6">
        <div className="space-y-1">
          <Link
            to="/cart"
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-orange-600 transition-colors mb-2"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Cart
          </Link>
           <h1 className="text-2xl sm:text-3xl font-medium text-slate-900 tracking-tight font-serif">Checkout</h1>
        </div>
        <div className="flex items-center gap-2.5 px-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-sm font-semibold text-slate-700 shadow-sm">
          <Lock className="w-4 h-4 text-orange-600" /> Secure 256-Bit Encryption
        </div>
      </div>

      {/* Error Banners */}
      {error && (
        <div className="flex items-start gap-3 rounded-2xl bg-rose-50 border border-rose-100 p-4 text-rose-700 shadow-sm">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-rose-600" />
          <p className="text-sm sm:text-base font-medium">{error}</p>
        </div>
      )}

      {createPaymentSession.isError && (
        <div className="flex items-start gap-3 rounded-2xl bg-rose-50 border border-rose-100 p-4 text-rose-700 shadow-sm">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-rose-600" />
          <p className="text-sm sm:text-base font-medium">
            {createPaymentSession.error?.response?.data?.message ||
              createPaymentSession.error?.message ||
              "Failed to start online payment"}
          </p>
        </div>
      )}

      {/* Main Grid Layout */}
      <div className="grid gap-8 lg:grid-cols-12 lg:items-start">
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
          <div className="sticky top-24 rounded-2xl border border-slate-200/80 bg-slate-50/60 p-5 sm:p-6 shadow-sm backdrop-blur-sm">
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
      <div className="flex items-center justify-center gap-2 pt-4 text-sm text-slate-400 font-medium text-center">
        <ShieldCheck className="w-5 h-5 text-orange-600" />
        <span>Prices are verified server-side. You will only be charged the confirmed order total.</span>
      </div>
    </div>
  );
}

export default CheckoutPage;