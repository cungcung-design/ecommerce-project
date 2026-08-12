import { useCustomers } from "../../hooks/useCustomers";

function Customers() {
  const {
    data: customers = [],
    isLoading,
    isError,
  } = useCustomers();

  if (isLoading) {
    return (
      <div className="p-8">
        Loading customers...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-8">
        Failed to load customers.
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
