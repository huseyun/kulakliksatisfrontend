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
  companyName: string;
}
