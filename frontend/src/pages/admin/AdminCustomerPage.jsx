import { useCustomers } from "../../hooks/useCustomers";
import { getFriendlyError } from "../../lib/getFriendlyError";
import { AlertCircle } from "lucide-react";

function Customers() {
  const {
    data: customers = [],
    isLoading,
    isError,
    error,
  } = useCustomers();

  if (isLoading) {
    return (
      <div className="p-8 flex items-center gap-3 text-slate-500">
        <div className="w-5 h-5 border-2 border-slate-300 border-t-blue-500 rounded-full animate-spin" />
        <span className="text-sm font-medium">Loading customers...</span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-red-600 shadow-sm">
        <AlertCircle className="h-5 w-5 shrink-0" />
        <span className="text-sm font-medium">{getFriendlyError(error, "Failed to load customers. Please check your connection and try again.")}</span>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-slate-900">
        Customers
      </h1>

      <div className="mt-8 overflow-x-auto rounded-xl border border-slate-200 bg-white">
        <table className="w-full min-w-[700px]">
          <thead>
            <tr className="border-b border-slate-200 text-left">
              <th className="p-4 text-slate-500 font-medium">Name</th>
              <th className="p-4 text-slate-500 font-medium">Email</th>
              <th className="p-4 text-slate-500 font-medium">Role</th>
              <th className="p-4 text-slate-500 font-medium">Joined</th>
            </tr>
          </thead>

          <tbody>
            {customers.map((customer) => (
              <tr
                key={customer.id}
                className="border-b border-slate-200"
              >
                <td className="p-4 text-slate-900">
                  {customer.name}
                </td>

                <td className="p-4 text-slate-700">
                  {customer.email}
                </td>

                <td className="p-4 text-slate-700">
                  {customer.role}
                </td>

                <td className="p-4 text-slate-500">
                  {new Date(customer.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Customers;
