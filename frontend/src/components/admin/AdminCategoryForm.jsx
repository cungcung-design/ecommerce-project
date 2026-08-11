import { useState } from "react";

function AdminCategoryForm({ initialData = {}, onSubmit, isLoading = false, submitLabel = "Save" }) {
  const [name, setName] = useState(initialData.name || "");

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit({ name });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border bg-white p-6">
      <div>
        <label className="block text-sm font-medium text-gray-700">Category Name</label>
        <input
          value={name}
          onChange={(event) => setName(event.target.value)}
          required
          className="mt-2 w-full rounded-lg border px-3 py-2"
          placeholder="Enter category name"
        />
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white disabled:opacity-40"
      >
        {isLoading ? "Saving..." : submitLabel}
      </button>
    </form>
  );
}

export default AdminCategoryForm;
