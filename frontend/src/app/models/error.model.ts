/**
 * Backend: EErrorCode.java
 * Backend'deki tüm hata kodlarının frontend karşılığı
 */
export enum EErrorCode {
  INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR',
  USER_NOT_FOUND = 'USER_NOT_FOUND',
  ADMIN_NOT_FOUND = 'ADMIN_NOT_FOUND',
  SELLER_NOT_FOUND = 'SELLER_NOT_FOUND',
  SHOPPER_NOT_FOUND = 'SHOPPER_NOT_FOUND',
  ITEM_NOT_FOUND = 'ITEM_NOT_FOUND',
  USERTYPE_NOT_FOUND = 'USERTYPE_NOT_FOUND',
  VALIDATION_ERROR = 'VALIDATION_ERROR'
}

/**
 * Backend: ValidationErrorResponse.java
 * Validation hatası durumunda hangi alanın ve neden hatalı olduğunu gösterir
 */
export interface ValidationErrorResponse {
  field: string;
  message: string;
}

/**
 * Backend: ErrorResponse.java
 * Tüm hataların standart döndüğü DTO
 *
 * @JsonInclude(JsonInclude.Include.NON_NULL) olduğundan
 * validationErrors null olabilir, bu durumda response body'de yer almaz
 */
export interface ErrorResponse {
  statusCode: number;
  errorCode: EErrorCode;
  message: string;
  timestamp: string; // Backend LocalDateTime → ISO string
  validationErrors: ValidationErrorResponse[] | null;
}
