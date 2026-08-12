import { useState, useEffect } from "react";
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
  initialImageUrl = "",
}) {
  const { data: categoriesFromHook } =
    useCategories();

  const categories =
    externalCategories || categoriesFromHook || [];

  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(initialImageUrl || "");

  useEffect(() => {
    setPreview(initialImageUrl || "");
  }, [initialImageUrl]);

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setPreview("");
  };

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

  const handleFormSubmit = (data) => {
    onSubmit(data, imageFile);
  };

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      className="space-y-6 rounded-xl border border-slate-200 bg-white p-6"
    >
      {/* Product Image */}
      <div>
        <label className="mb-2 block font-medium text-slate-900">
          Product Image
        </label>

        {preview && (
          <img
            src={preview}
            alt="Product preview"
            className="mb-3 h-48 w-full rounded-lg border border-slate-200 object-cover"
          />
        )}

        <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 px-4 py-8 text-center text-sm text-slate-500 transition hover:border-blue-500 hover:bg-slate-100">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />
          <span className="text-2xl">📷</span>
          <span>{imageFile ? "Change image" : "Click to upload image"}</span>
          <span className="text-xs text-slate-400">
            PNG, JPG or GIF (max 5MB)
          </span>
        </label>

        {imageFile && (
          <button
            type="button"
            onClick={handleRemoveImage}
            className="mt-2 text-sm font-medium text-red-600 hover:text-red-500"
          >
            Remove image
          </button>
        )}
      </div>

      {/* Name */}
      <div>
        <label className="mb-2 block font-medium text-slate-900">
          Product Name
        </label>

        <input
          {...register("name")}
          className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
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
        <label className="mb-2 block font-medium text-slate-900">
          Description
        </label>

        <textarea
          {...register("description")}
          rows={5}
          className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
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
          <label className="mb-2 block font-medium text-slate-900">
            Price
          </label>

          <input
            type="number"
            step="0.01"
            {...register("price")}
            className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
          />

          {errors.price && (
            <p className="mt-1 text-sm text-red-600">
              {errors.price.message}
            </p>
          )}
        </div>

        <div>
          <label className="mb-2 block font-medium text-slate-900">
            Stock
          </label>

          <input
            type="number"
            {...register("stock")}
            className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
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
        <label className="mb-2 block font-medium text-slate-900">
          Category
        </label>

        <select
          {...register("categoryId")}
          className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
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
      <label className="flex items-center gap-3 text-slate-900">
        <input
          type="checkbox"
          {...register("isActive")}
          className="h-4 w-4 rounded border-slate-300 bg-white accent-blue-500"
        />

        <span>
          Product is active
        </span>
      </label>

      {/* Submit */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="rounded-lg bg-blue-500 px-6 py-3 font-medium text-white shadow-lg shadow-blue-500/25 transition hover:bg-blue-400 disabled:opacity-50"
      >
        {isSubmitting
          ? "Saving..."
          : submitLabel}
      </button>
    </form>
  );
}