import { apiRequest } from "./apiClient";
import type {
  Product,
  CreateProductInput,
  UpdateProductInput,
} from "@/types/product";

export async function uploadProductImage(
  file: File,
): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);

  const response = await apiRequest<{ url: string }>("/api/v1/upload", {
    method: "POST",
    body: formData,
  });

  if (!response.success) {
    throw new Error(response.error.message);
  }

  return response.data.url;
}

export async function createProduct(
  data: CreateProductInput,
): Promise<Product> {
  const response = await apiRequest<Product>("/api/v1/products", {
    method: "POST",
    body: JSON.stringify(data),
  });

  if (!response.success) {
    throw new Error(response.error.message);
  }

  return response.data;
}

export async function getVendorProducts(): Promise<Product[]> {
  const response = await apiRequest<{ products: Product[] }>(
    "/api/v1/products/vendor",
    {
      method: "GET",
    },
  );

  if (!response.success) {
    throw new Error(response.error.message);
  }

  return response.data.products;
}

export async function getAllProducts(
  category?: "vehicle" | "part",
): Promise<Product[]> {
  let url = "/api/v1/products";
  if (category) {
    url += `?category=${category}`;
  }

  const response = await apiRequest<{ products: Product[] }>(url, {
    method: "GET",
  });

  if (!response.success) {
    throw new Error(response.error.message);
  }

  return response.data.products;
}

export async function getProduct(id: string): Promise<Product> {
  const response = await apiRequest<Product>(`/api/v1/products/${id}`, {
    method: "GET",
  });

  if (!response.success) {
    throw new Error(response.error.message);
  }

  return response.data;
}

export async function updateProduct(
  data: UpdateProductInput,
): Promise<Product> {
  const response = await apiRequest<Product>(`/api/v1/products/${data.id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });

  if (!response.success) {
    throw new Error(response.error.message);
  }

  return response.data;
}

export async function deleteProduct(id: string): Promise<void> {
  const response = await apiRequest<void>(`/api/v1/products/${id}`, {
    method: "DELETE",
  });

  if (!response.success) {
    throw new Error(response.error.message);
  }
}

export async function bulkDeleteProducts(
  ids: string[],
): Promise<{ deletedCount: number }> {
  const response = await apiRequest<{ deletedCount: number; message: string }>(
    "/api/v1/products/bulk",
    {
      method: "DELETE",
      body: JSON.stringify({ ids }),
    },
  );

  if (!response.success) {
    throw new Error(response.error.message);
  }

  return response.data;
}
