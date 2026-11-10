export type CommissionStatus = 'PENDING' | 'PAID';

export interface CommissionResponse {
  id: string;
  appointmentId: string;
  employeeId: string;
  employeeName: string;
  serviceName: string;
  serviceAmount: number;
  appliedRate: number;
  commissionAmount: number;
  status: CommissionStatus;
  createdAt: string;
}

export interface CommissionSummaryResponse {
  totalCommission: number;
  pendingAmount: number;
  paidAmount: number;
  count: number;
}
