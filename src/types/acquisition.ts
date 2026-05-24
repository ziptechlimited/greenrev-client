export type AcquisitionStatus =
  | "pending"
  | "accepted"
  | "in_progress"
  | "completed"
  | "cancelled";

export interface VendorContact {
  name: string;
  email: string;
  phone: string | null;
  companyName: string | null;
}

export interface AcquisitionRequest {
  _id: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string | null;
  vendorId: string;
  vendorName: string;
  vendorEmail: string;
  vendorPhone: string | null;
  vendorCompanyName: string | null;
  productId: string;
  productName: string;
  productImage: string;
  productPrice: string;
  productMake: string | null;
  message: string | null;
  status: AcquisitionStatus;
  acceptedAt: string | null;
  completedAt: string | null;
  cancelledAt: string | null;
  vendorSeen: boolean;
  hasReview: boolean;
  review?: Review | null;
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  _id: string;
  acquisitionRequestId: string;
  customerId: string;
  vendorId: string;
  productId: string;
  rating: number;
  comment: string | null;
  customerName: string;
  productName: string;
  createdAt: string;
}

export interface VendorReviewsResponse {
  reviews: Review[];
  averageRating: number;
  totalReviews: number;
}
