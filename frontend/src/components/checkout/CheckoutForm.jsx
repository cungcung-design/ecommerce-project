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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-7">
      <h2 className="text-2xl font-black text-slate-900 tracking-tight pb-3 border-b border-slate-100">
        Shipping Information
      </h2>

      {/* Full Name */}
      <div className="space-y-3">
        <label className="block text-base font-bold text-slate-700">
          Full Name
        </label>
        <input
          {...register("fullName")}
          className="w-full rounded-2xl border border-slate-300 px-5 py-4 text-lg text-slate-900 placeholder:text-slate-400 focus:border-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-600/20 transition-all"
          placeholder="Enter your full name"
        />
        {errors.fullName && (
          <p className="text-base font-medium text-rose-600">
            {errors.fullName.message}
          </p>
        )}
      </div>

      {/* Phone */}
      <div className="space-y-3">
        <label className="block text-base font-bold text-slate-700">
          Phone Number
        </label>
        <input
          {...register("phone")}
          className="w-full rounded-2xl border border-slate-300 px-5 py-4 text-lg text-slate-900 placeholder:text-slate-400 focus:border-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-600/20 transition-all"
          placeholder="Enter your phone number"
        />
        {errors.phone && (
          <p className="text-base font-medium text-rose-600">
            {errors.phone.message}
          </p>
        )}
      </div>

      {/* Address */}
      <div className="space-y-3">
        <label className="block text-base font-bold text-slate-700">
          Street Address
        </label>
        <input
          {...register("address")}
          className="w-full rounded-2xl border border-slate-300 px-5 py-4 text-lg text-slate-900 placeholder:text-slate-400 focus:border-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-600/20 transition-all"
          placeholder="Enter your street address"
        />
        {errors.address && (
          <p className="text-base font-medium text-rose-600">
            {errors.address.message}
          </p>
        )}
      </div>

      {/* City & Postal Code Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-3">
          <label className="block text-base font-bold text-slate-700">
            City
          </label>
          <input
            {...register("city")}
            className="w-full rounded-2xl border border-slate-300 px-5 py-4 text-lg text-slate-900 placeholder:text-slate-400 focus:border-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-600/20 transition-all"
            placeholder="City"
          />
          {errors.city && (
            <p className="text-base font-medium text-rose-600">
              {errors.city.message}
            </p>
          )}
        </div>

        <div className="space-y-3">
          <label className="block text-base font-bold text-slate-700">
            Postal Code
          </label>
          <input
            {...register("postalCode")}
            className="w-full rounded-2xl border border-slate-300 px-5 py-4 text-lg text-slate-900 placeholder:text-slate-400 focus:border-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-600/20 transition-all"
            placeholder="Postal Code"
          />
          {errors.postalCode && (
            <p className="text-base font-medium text-rose-600">
              {errors.postalCode.message}
            </p>
          )}
        </div>
      </div>

      {/* Payment Method Fieldset */}
      <fieldset className="space-y-4 pt-4 border-t border-slate-100">
        <legend className="text-2xl font-black text-slate-900 tracking-tight mb-3">
          Payment Method
        </legend>

        <div className="space-y-3">
          {paymentMethodOptions.map((option) => {
            const { onChange, ...rest } = register("paymentMethod");
            return (
              <label
                key={option.value}
                className="flex w-full cursor-pointer items-center gap-4 rounded-2xl border border-slate-200 p-5 transition-all hover:bg-slate-50/80 has-[:checked]:border-orange-600 has-[:checked]:bg-orange-50/20 has-[:checked]:ring-2 has-[:checked]:ring-orange-600/10"
              >
                <input
                  type="radio"
                  value={option.value}
                  {...rest}
                  onChange={handleMethodChange(onChange)}
                  className="h-6 w-6 accent-orange-600"
                />
                <span className="text-lg font-bold text-slate-900">
                  {option.label}
                </span>
              </label>
            );
          })}
        </div>

        {errors.paymentMethod && (
          <p className="text-base font-medium text-rose-600">
            {errors.paymentMethod.message}
          </p>
        )}
      </fieldset>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full flex items-center justify-center gap-3 rounded-2xl bg-slate-900 hover:bg-orange-600 py-4 text-lg font-bold text-white shadow-xl transition-all duration-300 disabled:opacity-50 disabled:hover:bg-slate-900 mt-6"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-6 h-6 animate-spin" />
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