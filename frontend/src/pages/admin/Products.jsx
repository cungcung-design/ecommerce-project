import { useState } from "react";
import { Link } from "react-router-dom";

import { useProducts } from "../../hooks/useProducts";
import { useCreateProduct } from "../../hooks/useCreateProduct";
import { useUpdateProduct } from "../../hooks/useUpdateProduct";
import { useUploadImage } from "../../hooks/useUploadImage";
import { useCategories } from "../../hooks/useCategories";

function Products() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");

  const {
    data,
    isLoading,
    isError,
    error,
  } = useProducts({
    search,
    category,
    page: 1,
    limit: 100,
  });

  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
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

  const handleSubmit = async (event) => {
    event.preventDefault();

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
  };

  const toggleActive = async (product) => {
    await updateProduct.mutateAsync({
      id: product.id,
      isActive: !product.isActive,
    });
  };

  if (isLoading) {
    return (
      <div className="p-8">
        Loading products...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-8">
        Failed to load products.
      </div>
    );
  }

  const products = data?.products || [];

  return (
    <div>
      <h1 className="text-3xl font-bold">
        Products
      </h1>

      <form
        onSubmit={handleSubmit}
        className="mt-8 grid gap-4 rounded-xl border p-6 sm:grid-cols-2 lg:grid-cols-3"
      >
        <input
          name="name"
          placeholder="Product Name"
          value={form.name}
          onChange={(event) =>
            setForm({ ...form, name: event.target.value })
          }
          required
          className="rounded-lg border p-3"
        />

        <input
          name="price"
          type="number"
          placeholder="Price"
          value={form.price}
          onChange={(event) =>
            setForm({ ...form, price: event.target.value })
          }
          required
          className="rounded-lg border p-3"
        />

        <input
          name="stock"
          type="number"
          placeholder="Stock"
          value={form.stock}
          onChange={(event) =>
            setForm({ ...form, stock: event.target.value })
          }
          required
          className="rounded-lg border p-3"
        />

        <select
          name="categoryId"
          value={form.categoryId}
          onChange={(event) =>
            setForm({ ...form, categoryId: event.target.value })
          }
          required
          className="rounded-lg border p-3"
        >
          <option value="">
            Select Category
          </option>

          {categories?.map((cat) => (
            <option
              key={cat.id}
              value={cat.id}
            >
              {cat.name}
            </option>
          ))}
        </select>

        <div>
          <label className="block font-medium">Product Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (!file) return;
              setImageFile(file);
              setPreview(URL.createObjectURL(file));
            }}
            className="mt-2"
          />
        </div>

        {preview && (
          <img
            src={preview}
            alt="Preview"
            className="h-48 w-full rounded-xl object-cover"
          />
        )}

        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={(event) =>
            setForm({ ...form, description: event.target.value })
          }
          className="rounded-lg border p-3"
        />

        <button
          type="submit"
          disabled={createProduct.isPending || uploadImage.isPending}
          className="rounded-lg bg-black px-6 py-3 text-white disabled:opacity-40 sm:col-span-2 lg:col-span-3"
        >
          {createProduct.isPending || uploadImage.isPending ? "Creating..." : "Add Product"}
        </button>
      </form>

      <div className="mt-8 overflow-x-auto rounded-xl border">
        <table className="w-full min-w-[700px]">
          <thead>
            <tr className="border-b text-left">
              <th className="p-4">Image</th>
              <th className="p-4">Name</th>
              <th className="p-4">Category</th>
              <th className="p-4">Price</th>
              <th className="p-4">Stock</th>
              <th className="p-4">Status</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>

          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-b">
                <td className="p-4">
                  {product.imageUrl ? (
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="h-12 w-12 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="h-12 w-12 rounded-lg bg-gray-200" />
                  )}
                </td>

                <td className="p-4">
                  {product.name}
                </td>

                <td className="p-4">
                  {product.category?.name}
                </td>

                <td className="p-4">
                  ${product.price}
                </td>

                <td className="p-4">
                  {product.stock}
                </td>

                <td className="p-4">
                  <span
                    className={`rounded-full px-2 py-1 text-xs ${
                      product.isActive
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {product.isActive ? "Active" : "Inactive"}
                  </span>
                </td>

                <td className="p-4">
                  <div className="flex gap-2">
                    <Link
                      to={`/admin/products/${product.id}/edit`}
                      className="rounded-lg border px-3 py-1 text-sm"
                    >
                      Edit
                    </Link>

                    <button
                      onClick={() => toggleActive(product)}
                      disabled={updateProduct.isPending}
                      className={`rounded-lg px-3 py-1 text-sm text-white disabled:opacity-40 ${
                        product.isActive
                          ? "bg-red-600"
                          : "bg-green-600"
                      }`}
                    >
                      {updateProduct.isPending
                        ? "Saving..."
                        : product.isActive
                          ? "Deactivate"
                          : "Activate"}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Products;
