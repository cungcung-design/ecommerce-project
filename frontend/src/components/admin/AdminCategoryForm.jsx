import { useEffect, useState } from "react";

function AdminCategoryForm({ initialData = {}, onSubmit, isLoading = false, submitLabel = "Save" }) {
  const [name, setName] = useState(initialData.name || "");

  useEffect(() => {
    setName(initialData.name || "");
  }, [initialData]);

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit({ name });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border border-slate-200 bg-white p-6">
      <div>
        <label className="block text-sm font-medium text-slate-900">Category Name</label>
        <input
          value={name}
          onChange={(event) => setName(event.target.value)}
          required
          className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
          placeholder="Enter category name"
        />
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white disabled:opacity-40 hover:bg-blue-400"
      >
        {isLoading ? "Saving..." : submitLabel}
      </button>
    </form>
  );
}

export default AdminCategoryForm;
