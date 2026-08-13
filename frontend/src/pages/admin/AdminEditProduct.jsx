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

  const [initialImageUrl, setInitialImageUrl] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const response = await api.get(
          `/admin/products/${id}`
        );

        const product = response.data.product;

        setForm({
          name: product.name || "",
          description: product.description || "",
          price: product.price || "",
          stock: product.stock || "",
          categoryId: product.categoryId?.toString() || "",
          isActive: product.isActive ?? true,
        });
        setInitialImageUrl(product.imageUrl || "");
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

  const handleSubmit = async (productData, imageFile) => {
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
    <div className="mx-auto max-w-xl">
      <h1 className="text-2xl font-bold text-slate-900">Edit Product</h1>

      {error && (
        <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-4 text-red-600">
          {error}
        </div>
      )}

      <div className="mt-6">
        <AdminProductForm
          defaultValues={form}
          initialImageUrl={initialImageUrl}
          onSubmit={handleSubmit}
          submitLabel="Save Changes"
          isSubmitting={saving || updateProduct.isPending || uploadImage.isPending}
        />
      </div>

      <div className="mt-4">
        <button
          type="button"
          onClick={() => navigate("/admin/products")}
          className="rounded-lg border border-slate-300 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
        >
          Back to Products
        </button>
      </div>
    </div>
  );
}

export default AdminEditProduct;