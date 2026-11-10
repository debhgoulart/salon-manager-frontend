export interface EmployeeRequest {
  name: string;
  email: string;
  phone: string;
  cpf: string;
  defaultCommissionRate: number; // Ex: 40.00
}

export interface EmployeeResponse {
  id: string;
  name: string;
  email: string;
  phone: string;
  cpf: string;
  defaultCommissionRate: number;
  active: boolean;
  createdAt?: string;
  updatedAt?: string;
}
