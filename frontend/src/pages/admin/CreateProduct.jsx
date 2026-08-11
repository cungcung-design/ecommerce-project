import { useState } from "react";
import { Link } from "react-router-dom";

import {
  useCreateProduct,
} from "../../hooks/useAdminProducts";

import { useUploadImage } from "../../hooks/useUploadImage";

import AdminProductForm
  from "../../components/admin/AdminProductForm";

function CreateProduct() {
  const createProduct = useCreateProduct();
  const uploadImage = useUploadImage();

  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [error, setError] = useState("");

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (productData) => {
    setError("");

    try {
      if (imageFile) {
        const uploadResult = await uploadImage.mutateAsync(imageFile);
        productData.imageUrl = uploadResult.url;
        productData.imagePublicId = uploadResult.publicId;
      }

      await createProduct.mutateAsync(productData);
    } catch (error) {
      setError(error.response?.data?.message || "Failed to create product");
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

      <div className="mt-8">
        <AdminProductForm
          onSubmit={handleSubmit}
          submitLabel="Create Product"
          isLoading={createProduct.isPending || uploadImage.isPending}
        />
      </div>

      <div className="mt-8">
        <h3 className="mb-4 font-medium">Product Image</h3>

        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="mt-2"
        />

        {preview && (
          <img
            src={preview}
            alt="Preview"
            className="mt-4 h-64 w-full rounded-xl object-cover"
          />
        )}
      </div>

      <div className="mt-6">
        <Link to="/admin/products" className="rounded-lg border px-6 py-3">
          Cancel
        </Link>
      </div>
    </div>
  );
}

export default CreateProduct;
