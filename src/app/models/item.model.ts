import { SellerResponse } from './user.model';

export interface ItemSummaryResponse {
  id: number;
  title: string;
  price: number | null;
  isRecommended: boolean;
  thumbnailImageUrl: string | null;
}

// Backend ItemUpdateRequest record karşılığı (price backend'de henüz eksik — bilinen sorun)
export interface ItemUpdateRequest {
  name: string;
  title: string;
  brand: string;
  description: string | null;
}

// Backend ItemCreateRequest record karşılığı (price backend'de henüz eksik — bilinen sorun)
export interface ItemCreateRequest {
  name: string;
  title: string;
  brand: string;
  description: string | null;
}

// Backend Image entity karşılığı (⚠️ DTO değil entity sızıyor — S3 key'leri içeriyor, tam URL değil)
export interface ItemImage {
  originalKey: string;
  thumbnailKey: string;
  standardKey: string;
  isThumbnail: boolean;
  displayOrder: number;
}

// Backend ItemResponse record karşılığı
export interface ItemResponse {
  id: number;
  title: string;
  price: number | null;
  description: string | null;
  seller: SellerResponse;
  images: ItemImage[];
  autoeqId: string | null;
}
