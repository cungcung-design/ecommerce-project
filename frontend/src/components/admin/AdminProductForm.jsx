import { useState } from "react";

import { useCategories } from "../../hooks/useCategories";

export default function AdminProductForm({
  initialData = {},
  onSubmit,
  submitLabel = "Save",
  isLoading = false,
}) {
  const { data: categories } = useCategories();

  const [form, setForm] = useState({
    name: initialData.name || "",
    description: initialData.description || "",
    price: initialData.price || "",
    stock: initialData.stock || "",
    categoryId: initialData.categoryId?.toString() || "",
    isActive: initialData.isActive ?? true,
  });

  const handleChange = (event) => {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    onSubmit({
      ...form,
      price: Number(form.price),
      stock: Number(form.stock),
      categoryId: Number(form.categoryId),
      isActive: form.isActive,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="block font-medium">
          Product Name
        </label>

        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          required
          className="mt-2 w-full rounded-lg border p-3"
        />
      </div>

      <div>
        <label className="block font-medium">
          Description
        </label>

        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          rows="5"
          className="mt-2 w-full rounded-lg border p-3"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="block font-medium">
            Price
          </label>

          <input
            type="number"
            name="price"
            step="0.01"
            value={form.price}
            onChange={handleChange}
            required
            className="mt-2 w-full rounded-lg border p-3"
          />
        </div>

        <div>
          <label className="block font-medium">
            Stock
          </label>

          <input
            type="number"
            name="stock"
            value={form.stock}
            onChange={handleChange}
            required
            min="0"
            className="mt-2 w-full rounded-lg border p-3"
          />
        </div>
      </div>

      <div>
        <label className="block font-medium">
          Category
        </label>

        <select
          name="categoryId"
          value={form.categoryId}
          onChange={handleChange}
          required
          className="mt-2 w-full rounded-lg border p-3"
        >
          <option value="">
            Select Category
          </option>

          {categories?.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          name="isActive"
          checked={form.isActive}
          onChange={(event) =>
            setForm({
              ...form,
              isActive: event.target.checked,
            })
          }
        />

        <span>Active</span>
      </label>

      <button
        type="submit"
        disabled={isLoading}
        className="rounded-lg bg-black px-6 py-3 text-white disabled:opacity-40"
      >
        {isLoading ? "Saving..." : submitLabel}
      </button>
    </form>
  );
}
