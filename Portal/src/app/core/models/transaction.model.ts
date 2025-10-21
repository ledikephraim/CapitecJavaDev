/**
 * Transaction entity representing a financial transaction
 */
export interface Transaction {
  id: string;
  userId: string;
  transactionId: string;
  amount: number;
  description: string;
  transactionDate: string;
  type: TransactionType;
  status: TransactionStatus;
  merchantName?: string;
  category?: string;
  createdAt: string;
  updatedAt?: string;
  currency: string;
  transactionType?: TransactionTypeEntity;
}

/**
 * Transaction types (DEBIT/CREDIT)
 */
export type TransactionType = 'DEBIT' | 'CREDIT';

/**
 * Transaction status
 */
export type TransactionStatus = 'COMPLETED' | 'PENDING' | 'DISPUTED' | 'REVERSED';

/**
 * Transaction type entity (from database lookup table)
 */
export interface TransactionTypeEntity {
  id: number;
  typeName: string;
}

/**
 * Transaction category
 */
export type TransactionCategory = 
  | 'GROCERIES' 
  | 'FUEL' 
  | 'ENTERTAINMENT' 
  | 'UTILITIES' 
  | 'SHOPPING' 
  | 'DINING' 
  | 'TRANSPORT' 
  | 'HEALTHCARE' 
  | 'OTHER';

/**
 * Transaction filter options
 */
export interface TransactionFilter {
  startDate?: string;
  endDate?: string;
  status?: TransactionStatus;
  type?: TransactionType;
  minAmount?: number;
  maxAmount?: number;
  category?: string;
  searchTerm?: string;
}

/**
 * Paginated transaction response
 */
export interface TransactionPageResponse {
  content: Transaction[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
}

/**
 * Transaction statistics
 */
export interface TransactionStatistics {
  totalTransactions: number;
  totalDebit: number;
  totalCredit: number;
  balance: number;
  disputedCount: number;
  completedCount: number;
  pendingCount: number;
  averageTransactionAmount: number;
}

/**
 * Transaction summary by period
 */
export interface TransactionSummary {
  period: string;
  totalAmount: number;
  transactionCount: number;
  debitAmount: number;
  creditAmount: number;
}

/**
 * Create transaction request (for testing/demo)
 */
export interface CreateTransactionRequest {
  userId: string;
  amount: number;
  description: string;
  type: TransactionType;
  merchantName?: string;
  category?: string;
  currency?: string;
}

/**
 * Helper function to format transaction amount with currency
 */
export function formatTransactionAmount(transaction: Transaction): string {
  const sign = transaction.type === 'DEBIT' ? '-' : '+';
  const formatted = new Intl.NumberFormat('en-ZA', {
    style: 'currency',
    currency: transaction.currency
  }).format(transaction.amount);
  
  return `${sign}${formatted}`;
}

/**
 * Helper function to check if transaction is debit
 */
export function isDebit(transaction: Transaction): boolean {
  return transaction.type === 'DEBIT';
}

/**
 * Helper function to check if transaction is credit
 */
export function isCredit(transaction: Transaction): boolean {
  return transaction.type === 'CREDIT';
}

/**
 * Helper function to check if transaction is completed
 */
export function isCompleted(transaction: Transaction): boolean {
  return transaction.status === 'COMPLETED';
}

/**
 * Helper function to check if transaction is disputed
 */
export function isDisputed(transaction: Transaction): boolean {
  return transaction.status === 'DISPUTED';
}

/**
 * Helper function to check if transaction can be disputed
 */
export function canBeDisputed(transaction: Transaction): boolean {
  // Can dispute if completed and not already disputed
  if (transaction.status === 'DISPUTED' || transaction.status === 'REVERSED') {
    return false;
  }

  // Check if within dispute window (60 days)
  const transactionDate = new Date(transaction.transactionDate);
  const now = new Date();
  const daysDiff = Math.floor((now.getTime() - transactionDate.getTime()) / (1000 * 60 * 60 * 24));
  
  return daysDiff <= 60;
}

/**
 * Helper function to get transaction age in days
 */
export function getTransactionAge(transaction: Transaction): number {
  const transactionDate = new Date(transaction.transactionDate);
  const now = new Date();
  return Math.floor((now.getTime() - transactionDate.getTime()) / (1000 * 60 * 60 * 24));
}

/**
 * Helper function to get status color class
 */
export function getStatusColorClass(status: TransactionStatus): string {
  const colorMap: { [key in TransactionStatus]: string } = {
    'COMPLETED': 'status-success',
    'PENDING': 'status-warning',
    'DISPUTED': 'status-info',
    'REVERSED': 'status-neutral'
  };
  
  return colorMap[status];
}

/**
 * Helper function to get type color class
 */
export function getTypeColorClass(type: TransactionType): string {
  return type === 'DEBIT' ? 'type-debit' : 'type-credit';
}