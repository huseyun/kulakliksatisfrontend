export type UserType = 'ADMIN' | 'SELLER' | 'SHOPPER' | 'USER';

export interface UserTypeResponse {
  userType: UserType;
}

export interface UserResponse {
  id: string | number;
  username: string;
  email: string;
  userType: UserTypeResponse[];
}

export interface ShopperResponse {
  id: string | number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
}

export interface SellerResponse {
  id: string | number;
  username: string;
  email: string;
  companyName: string;
}

export interface ItemSummaryResponse {
  id: string | number;
  title: string;
  price: number;
  images: string[];
}

export interface ItemResponse {
  id: string | number;
  title: string;
  brand: string;
  description: string;
  price: number;
  stock: number;
  sellerId: string | number;
  imageUrls: string[];
}

// Global Exception Handler Types
export interface ErrorResponse {
  statusCode: number;
  message: string;
  timestamp: string;
  validationErrors?: { field: string; message: string }[];
}
