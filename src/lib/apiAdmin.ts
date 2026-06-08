import { apiRequest } from "./apiClient";

export interface AdminUser {
  _id: string;
  email: string;
  name: string | null;
  role: "customer" | "vendor" | "mechanic" | "admin";
  status: "active" | "suspended";
  isEmailVerified: boolean;
  verificationLevel: "basic" | "individual" | "business";
  createdAt: string;
}

export async function adminListUsers(params: { page?: number; limit?: number }) {
  const query = new URLSearchParams();
  if (params.page) query.set("page", params.page.toString());
  if (params.limit) query.set("limit", params.limit.toString());
  
  const res = await apiRequest<{ users: AdminUser[]; total: number; page: number; limit: number }>(
    `/api/v1/admin/users?${query.toString()}`,
    { method: "GET" }
  );
  if (!res.success) throw new Error(res.error.message);
  return res.data;
}

export async function adminUpdateUserStatus(userId: string, status: "active" | "suspended") {
  const res = await apiRequest<{ user: AdminUser }>(
    `/api/v1/admin/users/${userId}/status`,
    {
      method: "PATCH",
      body: JSON.stringify({ status }),
    }
  );
  if (!res.success) throw new Error(res.error.message);
  return res.data.user;
}

export async function adminUpdateUserRole(userId: string, role: "customer" | "vendor" | "mechanic" | "admin") {
  const res = await apiRequest<{ user: AdminUser }>(
    `/api/v1/admin/users/${userId}/role`,
    {
      method: "PATCH",
      body: JSON.stringify({ role }),
    }
  );
  if (!res.success) throw new Error(res.error.message);
  return res.data.user;
}

export async function adminDeleteUser(userId: string) {
  const res = await apiRequest<{ ok: boolean }>(
    `/api/v1/admin/users/${userId}`,
    { method: "DELETE" }
  );
  if (!res.success) throw new Error(res.error.message);
  return res.data;
}

export async function adminUpdateUserTier(userId: string, verificationLevel: "basic" | "individual" | "business") {
  const res = await apiRequest<{ user: AdminUser }>(
    `/api/v1/admin/users/${userId}/tier`,
    {
      method: "PATCH",
      body: JSON.stringify({ verificationLevel }),
    }
  );
  if (!res.success) throw new Error(res.error.message);
  return res.data.user;
}
