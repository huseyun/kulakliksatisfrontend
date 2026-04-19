export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
}

/**
 * JWT token payload structure
 * Backend'de gelen token yapısı:
 * {
 *   "sub": "username",
 *   "roles": ["ROLE_ADMIN", "ROLE_SHOPPER", ...],
 *   "iat": 1234567890,
 *   "exp": 1234567890
 * }
 */
export interface JwtPayload {
  sub: string;      // username
  roles: string[];  // ROLE_ADMIN, ROLE_SHOPPER, etc.
  iat: number;      // issued at timestamp
  exp: number;      // expiration timestamp
}

/**
 * Kullanıcı rolleri enum
 * Backend'deki roller: ROLE_ADMIN, ROLE_SHOPPER, ROLE_SELLER
 */
export enum UserRole {
  ADMIN = 'ROLE_ADMIN',
  SHOPPER = 'ROLE_SHOPPER',
  SELLER = 'ROLE_SELLER'
}

/**
 * Kullanıcı bilgisi interface
 * Token'dan decode edilen ve kullanılan bilgiler
 */
export interface UserInfo {
  username: string;
  roles: string[];
  isAdmin: boolean;
  isShopper: boolean;
  isSeller: boolean;
}
