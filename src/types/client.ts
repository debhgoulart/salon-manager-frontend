export interface ClientRequest {
  name: string;
  email: string;
  phone: string;
  cpf?: string | undefined;
  notes?: string | undefined;
}

export interface ClientResponse {
  id: string;
  name: string;
  email: string;
  phone: string;
  cpf?: string | null;
  notes?: string | null;
  active: boolean;
  createdAt?: string;
  updatedAt?: string;
}
