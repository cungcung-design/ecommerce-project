import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import api from "../../services/api";

import {
  useUpdateProduct,
} from "../../hooks/useAdminProducts";

import { useUploadImage } from "../../hooks/useUploadImage";

import AdminProductForm
  from "../../components/admin/AdminProductForm";

function AdminEditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();

  const updateProduct = useUpdateProduct();
  const uploadImage = useUploadImage();

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

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const response = await api.get(
          `/admin/products/${id}`
        );

        const product = response.data.data;

        setForm({
          name: product.name || "",
          description: product.description || "",
          price: product.price || "",
          stock: product.stock || "",
          categoryId: product.categoryId?.toString() || "",
          isActive: product.isActive ?? true,
        });
        setPreview(product.imageUrl || "");
      } catch (error) {
        setError(
          error.response?.data?.message ||
            "Failed to load product"
        );
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id]);

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (productData) => {
    try {
      setSaving(true);
      setError("");

      if (imageFile) {
        const uploadResult = await uploadImage.mutateAsync(imageFile);
        productData.imageUrl = uploadResult.url;
        productData.imagePublicId = uploadResult.publicId;
      }

      await updateProduct.mutateAsync({
        id: Number(id),
        ...productData,
      });

      navigate("/admin/products");
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to update product"
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-8">Loading product...</div>;
  }

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-3xl font-bold">Edit Product</h1>

      {error && (
        <div className="mt-6 rounded-lg bg-red-50 p-4 text-red-600">
          {error}
        </div>
      )}

      <div className="mt-8">
        <AdminProductForm
          initialData={form}
          onSubmit={handleSubmit}
          submitLabel="Save Changes"
          isLoading={saving || updateProduct.isPending || uploadImage.isPending}
        />
      </div>

      <div className="mt-8">
        <h3 className="mb-4 font-medium">Product Image</h3>

        {preview && !imageFile && (
          <img
            src={preview}
            alt="Current"
            className="mb-4 h-64 w-full rounded-xl object-cover"
          />
        )}

        {preview && imageFile && (
          <img
            src={preview}
            alt="Preview"
            className="mb-4 h-64 w-full rounded-xl object-cover"
          />
        )}

        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="mt-2"
        />
      </div>

      <div className="mt-6">
        <button
          type="button"
          onClick={() => navigate("/admin/products")}
          className="rounded-lg border px-6 py-3"
        >
          Back to Products
        </button>
      </div>
    </div>
  );
}

export default AdminEditProduct;
