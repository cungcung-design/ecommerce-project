import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import {
  checkoutSchema,
  paymentMethodOptions,
} from "../../validators/checkoutValidator";

function CheckoutForm({ onSubmit, onPaymentMethodChange, isSubmitting = false }) {
  const [paymentMethod, setPaymentMethod] = useState("COD");

  const {
    register,
    handleSubmit,
    formState: {
      errors,
    },
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
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4"
    >

      <div>
        <label className="mb-2 block font-medium">
          Full Name
        </label>

        <input
          {...register("fullName")}
          className="w-full rounded-lg border px-3 py-2.5 text-sm"
          placeholder="Enter your full name"
        />

        {errors.fullName && (
          <p className="mt-1 text-sm text-red-600">
            {errors.fullName.message}
          </p>
        )}
      </div>


      <div>
        <label className="mb-2 block font-medium">
          Phone
        </label>

        <input
          {...register("phone")}
          className="w-full rounded-lg border px-3 py-2.5 text-sm"
          placeholder="Enter your phone number"
        />

        {errors.phone && (
          <p className="mt-1 text-sm text-red-600">
            {errors.phone.message}
          </p>
        )}
      </div>


      <div>
        <label className="mb-2 block font-medium">
          Address
        </label>

        <input
          {...register("address")}
          className="w-full rounded-lg border px-3 py-2.5 text-sm"
          placeholder="Enter your address"
        />

        {errors.address && (
          <p className="mt-1 text-sm text-red-600">
            {errors.address.message}
          </p>
        )}
      </div>


      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-2 block font-medium">
            City
          </label>

          <input
            {...register("city")}
            className="w-full rounded-lg border px-3 py-2.5 text-sm"
            placeholder="City"
          />

          {errors.city && (
            <p className="mt-1 text-sm text-red-600">
              {errors.city.message}
            </p>
          )}
        </div>

        <div>
          <label className="mb-2 block font-medium">
            Postal Code
          </label>

          <input
            {...register("postalCode")}
            className="w-full rounded-lg border px-3 py-2.5 text-sm"
            placeholder="Postal Code"
          />

          {errors.postalCode && (
            <p className="mt-1 text-sm text-red-600">
              {errors.postalCode.message}
            </p>
          )}
        </div>
      </div>

      <fieldset className="space-y-2 pt-1">
        <legend className="mb-1.5 block text-sm font-medium">
          Payment Method
        </legend>

        {paymentMethodOptions.map((option) => {
          const { onChange, ...rest } = register("paymentMethod");
          return (
            <label
              key={option.value}
              className="flex w-full cursor-pointer items-center gap-3 rounded-lg border p-2.5 has-[:checked]:border-black has-[:checked]:bg-gray-50"
            >
              <input
                type="radio"
                value={option.value}
                {...rest}
                onChange={handleMethodChange(onChange)}
                className="h-5 w-5 accent-black"
              />

              <span className="text-sm font-medium">
                {option.label}
              </span>
            </label>
          );
        })}

        {errors.paymentMethod && (
          <p className="mt-1 text-sm text-red-600">
            {errors.paymentMethod.message}
          </p>
        )}
      </fieldset>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-lg bg-black px-6 py-2.5 text-sm text-white disabled:opacity-50"
      >
        {isSubmitting ? "Placing Order..." : "Place Order"}
      </button>

    </form>
  );
}

export default CheckoutForm;
