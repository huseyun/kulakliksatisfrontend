export interface EqualizeRequest {
  userHeadphoneId: string;
  productId: number;
}

export interface BiquadFilter {
  type: string;
  fc: number;
  q: number;
  gain: number;
}

export interface EqualizeResponse {
  fs: number;
  preampDb: number;
  filters: BiquadFilter[];
}

export interface AutoEQSearchEntry {
  id: string;
  label: string;
  form: string;
  source: string;
}

export interface AutoEQSearchResponse {
  results: AutoEQSearchEntry[];
  total: number;
}
