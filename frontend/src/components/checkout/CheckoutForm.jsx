import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";

import {
  checkoutSchema,
  paymentMethodOptions,
} from "../../validators/checkoutValidator";

function CheckoutForm({ onSubmit, onPaymentMethodChange, isSubmitting = false }) {
  const [paymentMethod, setPaymentMethod] = useState("COD");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      fullName: "",
      phone: "",
      address: "",
      city: "",
      postalCode: "",
      paymentMethod: "COD",
    },
  });

  useEffect(() => {
    if (onPaymentMethodChange) {
      onPaymentMethodChange(paymentMethod);
    }
  }, [paymentMethod, onPaymentMethodChange]);

  const handleMethodChange = (onChange) => (event) => {
    onChange(event);
    setPaymentMethod(event.target.value);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 pb-16 lg:pb-0">
      <h2 className="text-lg font-semibold text-slate-900 tracking-tight pb-2 border-b border-slate-100">
        Shipping Information
      </h2>

      {/* Full Name */}
      <div className="space-y-1.5 sm:space-y-2">
        <label className="block text-sm font-semibold text-slate-700">
          Full Name
        </label>
        <input
          {...register("fullName")}
          autoComplete="name"
          className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-600/20 transition-all"
          placeholder="Enter your full name"
        />
        {errors.fullName && (
          <p className="text-xs sm:text-sm font-medium text-rose-600">
            {errors.fullName.message}
          </p>
        )}
      </div>

      {/* Phone */}
      <div className="space-y-1.5 sm:space-y-2">
        <label className="block text-sm font-semibold text-slate-700">
          Phone Number
        </label>
        <input
          {...register("phone")}
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-600/20 transition-all"
          placeholder="Enter your phone number"
        />
        {errors.phone && (
          <p className="text-xs sm:text-sm font-medium text-rose-600">
            {errors.phone.message}
          </p>
        )}
      </div>

      {/* Address */}
      <div className="space-y-1.5 sm:space-y-2">
        <label className="block text-sm font-semibold text-slate-700">
          Street Address
        </label>
        <input
          {...register("address")}
          autoComplete="street-address"
          className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-600/20 transition-all"
          placeholder="Enter your street address"
        />
        {errors.address && (
          <p className="text-xs sm:text-sm font-medium text-rose-600">
            {errors.address.message}
          </p>
        )}
      </div>

      {/* City & Postal Code Grid */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
        <div className="space-y-1.5 sm:space-y-2">
          <label className="block text-sm font-semibold text-slate-700">
            City
          </label>
          <input
            {...register("city")}
            autoComplete="address-level2"
            className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-600/20 transition-all"
            placeholder="City"
          />
          {errors.city && (
            <p className="text-xs sm:text-sm font-medium text-rose-600">
              {errors.city.message}
            </p>
          )}
        </div>

        <div className="space-y-1.5 sm:space-y-2">
          <label className="block text-sm font-semibold text-slate-700">
            Postal Code
          </label>
          <input
            {...register("postalCode")}
            inputMode="numeric"
            autoComplete="postal-code"
            className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-600/20 transition-all"
            placeholder="Postal Code"
          />
          {errors.postalCode && (
            <p className="text-xs sm:text-sm font-medium text-rose-600">
              {errors.postalCode.message}
            </p>
          )}
        </div>
      </div>

      {/* Payment Method Fieldset */}
      <fieldset className="space-y-3 pt-4 border-t border-slate-100">
        <legend className="text-lg font-semibold text-slate-900 tracking-tight mb-2">
          Payment Method
        </legend>

        <div className="space-y-3">
          {paymentMethodOptions.map((option) => {
            const { onChange, ...rest } = register("paymentMethod");
            return (
              <label
                key={option.value}
                className="flex w-full cursor-pointer items-center gap-4 rounded-2xl border border-slate-200 p-4 transition-all hover:bg-slate-50/80 has-[:checked]:border-orange-600 has-[:checked]:bg-orange-50/20 has-[:checked]:ring-2 has-[:checked]:ring-orange-600/10"
              >
                <input
                  type="radio"
                  value={option.value}
                  {...rest}
                  onChange={handleMethodChange(onChange)}
                  className="h-5 w-5 accent-orange-600"
                />
                <span className="text-sm font-semibold text-slate-900">
                  {option.label}
                </span>
              </label>
            );
          })}
        </div>

        {errors.paymentMethod && (
          <p className="text-xs sm:text-sm font-medium text-rose-600">
            {errors.paymentMethod.message}
          </p>
        )}
      </fieldset>

      {/* Submit Button (Hidden on small mobile if sticky bar is used, or kept styled safely) */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full flex items-center justify-center gap-2 rounded-2xl bg-slate-900 hover:bg-orange-600 py-4 text-base font-semibold text-white shadow-lg transition-all duration-300 disabled:opacity-50 disabled:hover:bg-slate-900 mt-6 cursor-pointer"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Placing Order...
          </>
        ) : (
          "Place Order"
        )}
      </button>
    </form>
  );
}

export default CheckoutForm;