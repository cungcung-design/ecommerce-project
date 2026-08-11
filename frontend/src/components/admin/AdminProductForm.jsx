import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import { useCategories } from "../../hooks/useCategories";

import {
  adminProductSchema,
} from "../../validators/adminProductValidator";

export default function AdminProductForm({
  categories: externalCategories,
  defaultValues,
  onSubmit,
  isSubmitting = false,
  submitLabel = "Save Product",
}) {
  const { data: categoriesFromHook } =
    useCategories();

  const categories =
    externalCategories || categoriesFromHook || [];

  const {
    register,
    handleSubmit,
    formState: {
      errors,
    },
  } = useForm({
    resolver:
      zodResolver(
        adminProductSchema
      ),

    defaultValues:
      defaultValues ?? {
        name: "",
        description: "",
        price: "",
        stock: 0,
        categoryId: "",
        isActive: true,
      },
  });

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6 rounded-xl border bg-white p-6"
    >

      {/* Name */}

      <div>

        <label className="mb-2 block font-medium">
          Product Name
        </label>

        <input
          {...register("name")}
          className="w-full rounded-lg border px-4 py-3"
          placeholder="Enter product name"
        />

        {errors.name && (
          <p className="mt-1 text-sm text-red-600">
            {errors.name.message}
          </p>
        )}

      </div>


      {/* Description */}

      <div>

        <label className="mb-2 block font-medium">
          Description
        </label>

        <textarea
          {...register("description")}
          rows={5}
          className="w-full rounded-lg border px-4 py-3"
          placeholder="Enter product description"
        />

        {errors.description && (
          <p className="mt-1 text-sm text-red-600">
            {errors.description.message}
          </p>
        )}

      </div>


      {/* Price + Stock */}

      <div className="grid gap-4 md:grid-cols-2">

        <div>

          <label className="mb-2 block font-medium">
            Price
          </label>

          <input
            type="number"
            step="0.01"
            {...register("price")}
            className="w-full rounded-lg border px-4 py-3"
          />

          {errors.price && (
            <p className="mt-1 text-sm text-red-600">
              {errors.price.message}
            </p>
          )}

        </div>


        <div>

          <label className="mb-2 block font-medium">
            Stock
          </label>

          <input
            type="number"
            {...register("stock")}
            className="w-full rounded-lg border px-4 py-3"
          />

          {errors.stock && (
            <p className="mt-1 text-sm text-red-600">
              {errors.stock.message}
            </p>
          )}

        </div>

      </div>


      {/* Category */}

      <div>

        <label className="mb-2 block font-medium">
          Category
        </label>

        <select
          {...register("categoryId")}
          className="w-full rounded-lg border px-4 py-3"
        >

          <option value="">
            Select Category
          </option>

          {categories.map(
            (category) => (

              <option
                key={category.id}
                value={category.id}
              >
                {category.name}
              </option>

            )
          )}

        </select>

        {errors.categoryId && (
          <p className="mt-1 text-sm text-red-600">
            {errors.categoryId.message}
          </p>
        )}

      </div>


      {/* Active */}

      <label className="flex items-center gap-3">

        <input
          type="checkbox"
          {...register("isActive")}
        />

        <span>
          Product is active
        </span>

      </label>


      {/* Submit */}

      <button
        type="submit"
        disabled={isSubmitting}
        className="rounded-lg bg-black px-6 py-3 text-white disabled:opacity-50"
      >

        {isSubmitting
          ? "Saving..."
          : submitLabel}

      </button>

    </form>
  );
}
