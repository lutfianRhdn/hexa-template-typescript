
export type TResponse<T, M> = {
  code: number;
  status: "success" | "failed";
  message: string;
  data?: T;
  errors?: TErrorResponse[];
  metadata?: M;
}
export type TErrorResponse = {
  field: string;
  message: string;
  type: "not_found" | "invalid" | "required" | "conflict" | "internal_error" | "unique_constraint"
  | "validation_error" | "authentication_error" | "authorization_error" | "business_error"
  | "insufficient_stock" | "service_unavailable" | "invalid_request" | "duplicate_error"
  | "invalid_status" | "expired_error" | "invalid_credentials" | "forbidden";
}
export type TMetadataResponse = {
  page: number;
  limit: number;
  total_records: number;
  total_pages: number;
}

export type TMetadataResponseResponseToken = {
  token: string;
}
