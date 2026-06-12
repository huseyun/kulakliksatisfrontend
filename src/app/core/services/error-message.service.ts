import { Injectable } from '@angular/core';

import { EErrorCode, ValidationErrorResponse } from '../../models/error.model';

/**
 * Backend'den gelen errorCode'a göre kullanıcı dostu Türkçe mesajlar üretir.
 * Backend'deki teknik mesajlar yerine insani mesajlar gösterir.
 */
@Injectable({
  providedIn: 'root'
})
export class ErrorMessageService {
  private readonly userMessages: Record<EErrorCode, string> = {
    [EErrorCode.INTERNAL_SERVER_ERROR]: 'Sunucuda beklenmeyen bir hata oluştu.',
    [EErrorCode.USER_NOT_FOUND]: 'Kullanıcı bulunamadı.',
    [EErrorCode.ADMIN_NOT_FOUND]: 'Yönetici bulunamadı.',
    [EErrorCode.SELLER_NOT_FOUND]: 'Satıcı bulunamadı.',
    [EErrorCode.SHOPPER_NOT_FOUND]: 'Alışverişçi bulunamadı.',
    [EErrorCode.ITEM_NOT_FOUND]: 'Ürün bulunamadı.',
    [EErrorCode.USERTYPE_NOT_FOUND]: 'Kullanıcı tipi bulunamadı.',
    [EErrorCode.CATEGORY_NOT_FOUND]: 'Kategori bulunamadı.',
    [EErrorCode.CART_NOT_FOUND]: 'Sepet bulunamadı.',
    [EErrorCode.AUTOEQ_HEADPHONE_NOT_FOUND]: 'Kulaklık ölçümü bulunamadı.',
    [EErrorCode.AUTOEQ_INVALID_ID]: "Geçersiz kulaklık ID'si.",
    [EErrorCode.AUTOEQ_NOT_SUPPORTED_FOR_PRODUCT]: 'Bu ürün için ses simülasyonu mevcut değil.',
    [EErrorCode.AUTOEQ_SERVICE_UNAVAILABLE]: 'Ses simülasyonu servisi şu an kullanılamıyor.',
    [EErrorCode.VALIDATION_ERROR]: 'Girdiğiniz bilgilerde hatalar var.'
  };

  /**
   * Backend'den gelen errorCode'a göre kullanıcı dostu Türkçe mesaj döner
   */
  getUserMessage(errorCode: EErrorCode, fallbackMessage?: string): string {
    return this.userMessages[errorCode] ?? fallbackMessage ?? 'Beklenmeyen bir hata oluştu.';
  }

  /**
   * Validation error'larını formatlı string olarak döner
   * Örn: "username: zorunlu alan, email: geçersiz format"
   */
  formatValidationErrors(validationErrors: ValidationErrorResponse[]): string {
    return validationErrors
      .map(ve => `${ve.field}: ${ve.message}`)
      .join(', ');
  }
}
