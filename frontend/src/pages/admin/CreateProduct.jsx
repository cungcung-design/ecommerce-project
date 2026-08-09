import { useState } from "react";
import { Link } from "react-router-dom";

import { useCreateProduct } from "../../hooks/useCreateProduct";
import { useUploadImage } from "../../hooks/useUploadImage";
import { useCategories } from "../../hooks/useCategories";

function CreateProduct() {
  const createProduct = useCreateProduct();
  const uploadImage = useUploadImage();
  const { data: categories } = useCategories();

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    categoryId: "",
  });

  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (event) => {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
  };

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      const productData = {
        ...form,
        price: Number(form.price),
        stock: Number(form.stock),
        categoryId: Number(form.categoryId),
      };

      if (imageFile) {
        const uploadResult = await uploadImage.mutateAsync(imageFile);
        productData.imageUrl = uploadResult.url;
        productData.imagePublicId = uploadResult.publicId;
      }

      await createProduct.mutateAsync(productData);

      setForm({
        name: "",
        description: "",
        price: "",
        stock: "",
        categoryId: "",
      });

      setImageFile(null);
      setPreview("");
    } catch (error) {
      setError(error.response?.data?.message || "Failed to create product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-3xl font-bold">Create Product</h1>

      {error && (
        <div className="mt-6 rounded-lg bg-red-50 p-4 text-red-600">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        <input
          name="name"
          placeholder="Product name"
          value={form.name}
          onChange={handleChange}
          required
          className="w-full rounded-lg border p-3"
        />

        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          rows="5"
          className="w-full rounded-lg border p-3"
        />

        <input
          name="price"
          type="number"
          step="0.01"
          placeholder="Price"
          value={form.price}
          onChange={handleChange}
          required
          className="w-full rounded-lg border p-3"
        />

        <input
          name="stock"
          type="number"
          placeholder="Stock"
          value={form.stock}
          onChange={handleChange}
          required
          min="0"
          className="w-full rounded-lg border p-3"
        />

        <select
          name="categoryId"
          value={form.categoryId}
          onChange={handleChange}
          required
          className="w-full rounded-lg border p-3"
        >
          <option value="">Select Category</option>
          {categories?.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>

        <div>
          <label className="block font-medium">Product Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="mt-2"
          />
        </div>

        {preview && (
          <img
            src={preview}
            alt="Preview"
            className="h-64 w-full rounded-xl object-cover"
          />
        )}

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading || uploadImage.isPending}
            className="rounded-lg bg-black px-6 py-3 text-white disabled:opacity-40"
          >
            {loading || uploadImage.isPending ? "Creating..." : "Create Product"}
          </button>

          <Link to="/admin/products" className="rounded-lg border px-6 py-3">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}

export default CreateProduct;
