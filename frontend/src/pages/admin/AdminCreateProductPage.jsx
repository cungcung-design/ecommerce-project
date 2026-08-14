import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  useCreateProduct,
} from "../../hooks/useAdminProducts";

import { useUploadImage } from "../../hooks/useUploadImage";

import AdminProductForm
  from "../../components/admin/AdminProductForm";

function AdminCreateProduct() {
  const navigate = useNavigate();
  const createProduct = useCreateProduct();
  const uploadImage = useUploadImage();

  const [error, setError] = useState("");

  const handleSubmit = async (productData, imageFile) => {
    setError("");

    try {
      if (imageFile) {
        const uploadResult = await uploadImage.mutateAsync(imageFile);
        productData.imageUrl = uploadResult.url;
        productData.imagePublicId = uploadResult.publicId;
      }

      await createProduct.mutateAsync(productData);

      navigate("/admin/products");
    } catch (error) {
      setError(error.response?.data?.message || "Failed to create product");
    }
  };

  return (
    <div className="mx-auto max-w-xl">
      <h1 className="text-2xl font-bold text-slate-900">Create Product</h1>

      {error && (
        <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-4 text-red-600">
          {error}
        </div>
      )}

      <div className="mt-6">
        <AdminProductForm
          onSubmit={handleSubmit}
          submitLabel="Create Product"
          isSubmitting={createProduct.isPending || uploadImage.isPending}
        />
      </div>

      <div className="mt-4">
        <button
          type="button"
          onClick={() => navigate("/admin/products")}
          className="rounded-lg border border-slate-300 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

export default AdminCreateProduct;