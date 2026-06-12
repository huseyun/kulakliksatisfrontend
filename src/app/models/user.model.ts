import { ItemSummaryResponse } from './item.model';

// Backend EUserType enum karşılığı
export enum EUserType {
  SHOPPER = 'SHOPPER',
  SELLER = 'SELLER',
  ADMIN = 'ADMIN'
}

// Backend UserTypeResponse record karşılığı
export interface UserTypeResponse {
  userType: EUserType;
}

// Backend UserResponse record karşılığı
export interface UserResponse {
  id: number;
  username: string;
  email: string;
  userType: UserTypeResponse[];
}

// Backend UserPasswordUpdateRequest record karşılığı
export interface UserPasswordUpdateRequest {
  password: string;
}

// Backend UserUpdateRequest record karşılığı
export interface UserUpdateRequest {
  username: string;
  email: string;
}

// Backend SellerResponse record karşılığı
export interface SellerResponse {
  id: number;
  username: string;
  email: string;
  companyName: string | null;
}

// Backend SellerDetailedResponse record karşılığı (items listesi dahil)
export interface SellerDetailedResponse {
  id: number;
  username: string;
  email: string;
  companyName: string | null;
  items: ItemSummaryResponse[];
}

// Backend SellerCreateRequest record karşılığı
export interface SellerCreateRequest {
  username: string;
  password: string;
  email: string;
  companyName: string | null;
}

// Backend SellerUpdateRequest record karşılığı
export interface SellerUpdateRequest {
  username: string;
  email: string;
  companyName: string | null;
}

// Backend SellerDetailsUpdateRequest record karşılığı (seller self-service)
export interface SellerDetailsUpdateRequest {
  companyName: string;
}

// Backend ShopperResponse record karşılığı
export interface ShopperResponse {
  id: number;
  username: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
}

// Backend ShopperCreateRequest record karşılığı
export interface ShopperCreateRequest {
  username: string;
  password: string;
  email: string;
}

// Backend ShopperUpdateRequest record karşılığı (admin kullanır)
export interface ShopperUpdateRequest {
  username: string;
  email: string;
  firstName: string;
  lastName: string;
}

// Backend ShopperDetailsUpdateRequest record karşılığı
export interface ShopperDetailsUpdateRequest {
  firstName: string;
  lastName: string;
}

// Backend AdminResponse record karşılığı
export interface AdminResponse {
  id: number;
  username: string;
  email: string;
}

// Backend UserCreateRequest record karşılığı (admin oluşturmak için)
export interface UserCreateRequest {
  username: string;
  password: string;
  email: string;
}
