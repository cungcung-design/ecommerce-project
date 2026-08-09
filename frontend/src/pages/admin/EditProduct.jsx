import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";

import { useProduct } from "../../hooks/useProduct";
import { useUpdateProduct } from "../../hooks/useUpdateProduct";
import { useUploadImage } from "../../hooks/useUploadImage";
import { useCategories } from "../../hooks/useCategories";

function EditProduct() {
  const { id } = useParams();
  const { data: product, isLoading } = useProduct(id);
  const updateProduct = useUpdateProduct();
  const uploadImage = useUploadImage();
  const { data: categories } = useCategories();

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    categoryId: "",
    isActive: true,
  });

  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState("");

  useEffect(() => {
    if (product) {
      setForm({
        name: product.name || "",
        description: product.description || "",
        price: product.price || "",
        stock: product.stock || "",
        categoryId: product.categoryId?.toString() || "",
        isActive: product.isActive ?? true,
      });
      setPreview(product.imageUrl || "");
    }
  }, [product]);

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

    const productData = {
      ...form,
      price: Number(form.price),
      stock: Number(form.stock),
      categoryId: Number(form.categoryId),
      isActive: form.isActive,
    };

    if (imageFile) {
      const uploadResult = await uploadImage.mutateAsync(imageFile);
      productData.imageUrl = uploadResult.url;
      productData.imagePublicId = uploadResult.publicId;
    }

    await updateProduct.mutateAsync({
      id: Number(id),
      ...productData,
    });
  };

  if (isLoading) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-3xl font-bold">Edit Product</h1>

      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        <input
          name="name"
          placeholder="Product Name"
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

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            name="isActive"
            checked={form.isActive}
            onChange={(event) =>
              setForm({ ...form, isActive: event.target.checked })
            }
          />
          <span>Active</span>
        </label>

        <div>
          <label className="block font-medium">Product Image</label>

          {preview && !imageFile && (
            <img
              src={preview}
              alt="Current"
              className="mt-2 h-64 w-full rounded-xl object-cover"
            />
          )}

          {preview && imageFile && (
            <img
              src={preview}
              alt="Preview"
              className="mt-2 h-64 w-full rounded-xl object-cover"
            />
          )}

          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="mt-2"
          />
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={updateProduct.isPending || uploadImage.isPending}
            className="rounded-lg bg-black px-6 py-3 text-white disabled:opacity-40"
          >
            {updateProduct.isPending || uploadImage.isPending ? "Saving..." : "Save Changes"}
          </button>

          <Link to="/admin/products" className="rounded-lg border px-6 py-3">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}

export default EditProduct;
