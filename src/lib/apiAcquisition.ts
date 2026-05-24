import { apiRequest } from "./apiClient";
import type {
  AcquisitionRequest,
  AcquisitionStatus,
  VendorContact,
  VendorReviewsResponse,
  Review,
} from "@/types/acquisition";

// ─── Customer: Create an acquisition request ─────────────────────────────────
export async function createAcquisitionRequest(data: {
  productId: string;
  message?: string;
}): Promise<{ request: AcquisitionRequest; vendorContact: VendorContact }> {
  const res = await apiRequest<{ request: AcquisitionRequest; vendorContact: VendorContact }>(
    "/api/v1/acquisition-requests",
    { method: "POST", body: JSON.stringify(data) }
  );
  if (!res.success) throw new Error(res.error.message);
  return res.data;
}

// ─── Customer: Fetch their requests ──────────────────────────────────────────
export async function getCustomerRequests(): Promise<AcquisitionRequest[]> {
  const res = await apiRequest<{ requests: AcquisitionRequest[] }>(
    "/api/v1/acquisition-requests",
    { method: "GET" }
  );
  if (!res.success) throw new Error(res.error.message);
  return res.data.requests;
}

// ─── Vendor: Fetch incoming requests ─────────────────────────────────────────
export async function getVendorRequests(): Promise<AcquisitionRequest[]> {
  const res = await apiRequest<{ requests: AcquisitionRequest[] }>(
    "/api/v1/acquisition-requests/vendor",
    { method: "GET" }
  );
  if (!res.success) throw new Error(res.error.message);
  return res.data.requests;
}

// ─── Vendor: Get pending request count for notification badge ────────────────
export async function getVendorRequestCount(): Promise<number> {
  const res = await apiRequest<{ count: number }>(
    "/api/v1/acquisition-requests/vendor/count",
    { method: "GET" }
  );
  if (!res.success) return 0;
  return res.data.count;
}

// ─── Shared: Update request status ───────────────────────────────────────────
export async function updateRequestStatus(
  id: string,
  status: AcquisitionStatus
): Promise<AcquisitionRequest> {
  const res = await apiRequest<{ request: AcquisitionRequest }>(
    `/api/v1/acquisition-requests/${id}/status`,
    { method: "PATCH", body: JSON.stringify({ status }) }
  );
  if (!res.success) throw new Error(res.error.message);
  return res.data.request;
}

// ─── Vendor: Mark transaction as complete ────────────────────────────────────
export async function completeTransaction(id: string): Promise<AcquisitionRequest> {
  const res = await apiRequest<{ request: AcquisitionRequest }>(
    `/api/v1/acquisition-requests/${id}/complete`,
    { method: "PATCH" }
  );
  if (!res.success) throw new Error(res.error.message);
  return res.data.request;
}

// ─── Customer: Submit a review ───────────────────────────────────────────────
export async function createReview(
  acquisitionRequestId: string,
  data: { rating: number; comment?: string }
): Promise<Review> {
  const res = await apiRequest<{ review: Review }>(
    `/api/v1/acquisition-requests/${acquisitionRequestId}/review`,
    { method: "POST", body: JSON.stringify(data) }
  );
  if (!res.success) throw new Error(res.error.message);
  return res.data.review;
}

// ─── Public: Get vendor reviews ───────────────────────────────────────────────
export async function getVendorReviews(vendorId: string): Promise<VendorReviewsResponse> {
  const res = await apiRequest<VendorReviewsResponse>(
    `/api/v1/reviews/vendor/${vendorId}`,
    { method: "GET" }
  );
  if (!res.success) throw new Error(res.error.message);
  return res.data;
}
