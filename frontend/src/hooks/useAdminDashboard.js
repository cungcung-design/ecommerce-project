import { useQuery } from "@tanstack/react-query";
import api from "../services/api";

export function useAdminDashboard() {
  return useQuery({
    queryKey: ["admin", "dashboard"],
    queryFn: async () => {
      const response = await api.get("/admin/dashboard");
      return response.data.stats;
    },
  });
}
