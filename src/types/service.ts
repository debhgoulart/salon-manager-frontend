export interface ServiceRequest {
  name: string;
  price: number;
  durationMinutes: number;
  customCommissionRate?: number | null;
}

export interface ServiceResponse {
  id: string;
  name: string;
  price: number;
  durationMinutes: number;
  customCommissionRate?: number | null;
  active: boolean;
  createdAt?: string;
  updatedAt?: string;
}
