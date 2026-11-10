export type TransactionType = 'INCOME' | 'EXPENSE';
export type TransactionStatus = 'COMPLETED' | 'PENDING' | 'CANCELLED';

export interface FinancialTransactionRequest {
  type: TransactionType;
  category: string;
  description: string;
  amount: number;
  paymentMethod: string;
  transactionDate: string; // ISO 8601
}

export interface FinancialTransactionResponse {
  id: string;
  type: TransactionType;
  category: string;
  description: string;
  amount: number;
  paymentMethod: string;
  status: TransactionStatus;
  appointmentId?: string;
  monthlyClosingId?: string;
  transactionDate: string;
  createdAt: string;
}

export interface FinancialSummaryResponse {
  totalRevenue: number;
  totalExpenses: number;
  netIncome: number;
  transactionsCount: number;
}
