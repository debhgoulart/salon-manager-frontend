export type MonthlyClosingStatus = 'OPEN' | 'CLOSED' | 'REOPENED';

export interface MonthlyClosingItemResponse {
  id: string;
  employeeId: string;
  employeeName: string;
  totalServiceValue: number;
  totalCommission: number;
  appointmentsCount: number;
}

export interface MonthlyClosingResponse {
  id: string;
  year: number;
  month: number;
  totalRevenue: number;
  totalExpenses: number;
  totalCommissions: number;
  netProfit: number;
  status: MonthlyClosingStatus;
  notes?: string;
  auditNotes?: string;
  closedAt?: string;
  closedBy?: string;
  reopenedAt?: string;
  reopenedBy?: string;
  items: MonthlyClosingItemResponse[];
}

export interface MonthlyClosingRequest {
  year: number;
  month: number;
  notes?: string;
}

export interface MonthlyClosingReopenRequest {
  auditNotes: string;
}
