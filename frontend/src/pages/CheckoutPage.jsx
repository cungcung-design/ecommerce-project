import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ShieldCheck, Lock, ArrowLeft, AlertCircle, ShoppingBag, Loader2, CheckCircle2, Package, CreditCard } from "lucide-react";

import { useCart } from "../hooks/useCart";
import { useCreateOrder } from "../hooks/useOrders";
import { useCreatePaymentSession } from "../hooks/usePayment";
import useNotification from "../hooks/useNotification";

import CheckoutForm from "../components/checkout/CheckoutForm";
import CheckoutSummary from "../components/checkout/CheckoutSummary";

const CHECKOUT_STEPS = [
  { id: "cart", label: "Cart", icon: Package },
  { id: "shipping", label: "Shipping", icon: ShoppingBag },
  { id: "payment", label: "Payment", icon: CreditCard },
  { id: "confirmation", label: "Confirmation", icon: CheckCircle2 },
];

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

  const currentStepIndex = cart?.items?.length ? 1 : 0;

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

      notify.success("Order placed successfully!");
      navigate(`/orders/${order.id}`);
    } catch (err) {
      const message = err.response?.data?.message || err.message || "Checkout failed";
      setError(message);
    }
  };

  const isSubmitting = createOrder.isPending || createPaymentSession.isPending;

  if (cartLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-10 h-10 text-orange-600 animate-spin" />
        <p className="text-base font-medium text-slate-500">Preparing your checkout...</p>
      </div>
    );
  }

  if (cartError || !cart || items.length === 0) {
    return (
      <div className="mx-auto max-w-lg px-4 py-24 text-center space-y-6">
        <div className="w-20 h-20 rounded-3xl bg-orange-50 text-orange-600 flex items-center justify-center mx-auto shadow-inner">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Your cart is empty</h1>
          <p className="text-base text-slate-500">Add some items to your cart before proceeding to checkout.</p>
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            to="/cart"
            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-6 py-3 text-base font-bold text-slate-900 hover:border-orange-300 hover:text-orange-600 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            View Cart
          </Link>
          <Link
            to="/products"
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-900 hover:bg-orange-600 px-6 py-4 text-base font-bold text-white shadow-xl transition-all duration-300"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-6">
        <div className="space-y-1">
          <Link
            to="/cart"
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-orange-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Cart
          </Link>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Checkout</h1>
        </div>
        <div className="flex items-center gap-2.5 px-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold text-slate-700 shadow-sm">
          <Lock className="w-4 h-4 text-orange-600" /> Secure 256-Bit Encryption
        </div>
      </div>

      {/* Checkout Progress */}
      <div className="flex items-center justify-between">
        {CHECKOUT_STEPS.map((step, index) => {
          const isCompleted = index < currentStepIndex;
          const isCurrent = index === currentStepIndex;
          const StepIcon = step.icon;

          return (
            <div key={step.id} className="flex items-center gap-2">
              <div className="flex items-center gap-2">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full border-2 transition-all ${
                    isCompleted
                      ? "border-orange-600 bg-orange-600 text-white"
                      : isCurrent
                        ? "border-orange-600 bg-orange-50 text-orange-600"
                        : "border-slate-200 bg-slate-50 text-slate-400"
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="w-4 h-4" />
                  ) : (
                    <StepIcon className="w-4 h-4" />
                  )}
                </div>
                <span
                  className={`text-xs sm:text-sm font-bold ${
                    isCurrent ? "text-orange-600" : isCompleted ? "text-slate-900" : "text-slate-400"
                  }`}
                >
                  {step.label}
                </span>
              </div>
              {index < CHECKOUT_STEPS.length - 1 && (
                <div className={`mx-2 h-0.5 w-6 sm:w-10 transition-colors ${isCompleted ? "bg-orange-600" : "bg-slate-200"}`} />
              )}
            </div>
          );
        })}
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

      {/* Main Grid Layout - Widened columns (8 for form, 4 for summary) */}
      <div className="grid gap-8 lg:grid-cols-12 lg:items-start">
        <div className="lg:col-span-7 xl:col-span-8">
          <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-md">
            <CheckoutForm
              onSubmit={handleSubmit}
              onPaymentMethodChange={setPaymentMethod}
              isSubmitting={isSubmitting}
            />
          </div>
        </div>

        <div className="lg:col-span-5 xl:col-span-4">
          <div className="sticky top-28 rounded-3xl border border-slate-200/80 bg-slate-50/60 p-6 sm:p-8 shadow-md backdrop-blur-sm">
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