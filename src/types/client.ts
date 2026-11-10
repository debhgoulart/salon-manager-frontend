export interface ClientRequest {
  name: string;
  email: string;
  phone: string;
  cpf?: string;
  notes?: string;
}

export interface ClientResponse {
  id: string;
  name: string;
  email: string;
  phone: string;
  cpf?: string;
  notes?: string;
  active: boolean;
  createdAt?: string;
  updatedAt?: string;
}
