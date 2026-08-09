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
      <h1 className="text-3xl font-bold">
        Customers
      </h1>

      <div className="mt-8 overflow-x-auto rounded-xl border">
        <table className="w-full min-w-[700px]">
          <thead>
            <tr className="border-b text-left">
              <th className="p-4">Name</th>
              <th className="p-4">Email</th>
              <th className="p-4">Role</th>
              <th className="p-4">Joined</th>
            </tr>
          </thead>

          <tbody>
            {customers.map((customer) => (
              <tr
                key={customer.id}
                className="border-b"
              >
                <td className="p-4">
                  {customer.name}
                </td>

                <td className="p-4">
                  {customer.email}
                </td>

                <td className="p-4">
                  {customer.role}
                </td>

                <td className="p-4">
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
