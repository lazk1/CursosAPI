import { api } from "@/lib/api";

export const cursoService = {
  async getAll() {
    const res = await api.get("/api/cursos");
    return res.data;
  },

  async getOneById(id) {
    const res = await api.get(`/api/cursos/${id}`);
    return res.data;
  },

  async createOne(data) {
    const res = await api.post("/api/cursos", data);
    return res.data;
  },

  async updateOneById(id, data) {
    const res = await api.put(`/api/cursos/${id}`, data);
    return res.data;
  },

  async deleteOneById(id) {
    const res = await api.delete(`/api/cursos/${id}`);
    return res.data;
  },
};
