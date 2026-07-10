import { api } from "@/lib/api";

export const authService = {
  async login(data) {
    const res = await api.post("/api/auth/login", {
      usernameOrEmail: data.usernameOrEmail,
      password: data.password,
    });
    return res.data;
  },

  async register(data) {
    const res = await api.post("/api/auth/register", {
      userName: data.userName,
      email: data.email,
      password: data.password,
      confirmPassword: data.confirmPassword,
      phoneNumber: data.phoneNumber,
    });
    return res.data;
  },

  async logout() {
    await api.post("/api/auth/logout");
  },

  async me() {
    const res = await api.get("/api/auth/me");
    return res.data;
  },

  async updateRolesToUser(userId, roleIds) {
    const res = await api.put(`/api/auth/update-roles/${userId}`, {
      roleIds,
    });
    return res.data;
  },
};
