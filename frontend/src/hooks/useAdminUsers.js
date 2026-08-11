import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import api from "../services/api";

export function useAdminUsers(search = "") {
  return useQuery({
    queryKey: ["admin", "users", search],
    queryFn: async () => {
      const response = await api.get("/admin/users", {
        params: { search },
      });

      return response.data.data || [];
    },
  });
}

export function useUpdateAdminUserStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, isActive }) => {
      const response = await api.patch(`/admin/users/${id}/status`, {
        isActive,
      });

      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["admin", "users"],
      });
    },
  });
}

export function useUpdateAdminUserRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, role }) => {
      const response = await api.patch(`/admin/users/${id}/role`, {
        role,
      });

      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["admin", "users"],
      });
    },
  });
}
