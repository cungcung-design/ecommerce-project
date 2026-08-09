import { useMutation } from "@tanstack/react-query";
import api from "../services/api";

export function useUploadImage() {
  return useMutation({
    mutationFn: async (file) => {
      const formData = new FormData();
      formData.append("image", file);

      const response = await api.post("/upload/image", formData);

      return response.data.image;
    },
  });
}
