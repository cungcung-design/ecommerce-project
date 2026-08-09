import { useQuery } from "@tanstack/react-query";
import api from "../services/api";

export function useCustomers() {
  return useQuery({
    queryKey: ["admin", "customers"],
    queryFn: async () => {
      const response = await api.get("/admin/customers");
      return response.data.customers;
    },
  });
}
