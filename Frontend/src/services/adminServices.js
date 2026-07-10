import { api } from "@/lib/api";

export const roleService = {
  async getAll() {
    const res = await api.get("/api/roles");
    return res.data;
  },
};

export const userService = {
  async getAll() {
    const res = await api.get("/api/users");
    return res.data;
  },

  async deleteOneById(id) {
    const res = await api.delete(`/api/users/${id}`);
    return res.data;
  },
};
