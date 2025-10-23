import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Transaction } from '../models/transaction.model';
import { environment } from '../../../environments/environment';
import { Dispute } from '../models/dipute.model';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {

  private apiUrl = `${environment.transactionsAPIBaseUrl}/transactions`;

  constructor(private http: HttpClient) { }


  /**
  * Generate a random transaction for current user
  */
  generateRandonTransactionForUser(): Observable<Transaction> {
    return this.http.post<Transaction>(`${this.apiUrl}/generate`, {})
      .pipe(
        catchError(this.handleError)
      );
  }
  /**
   * Get all transactions for current user
   */
  getTransactions(): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(this.apiUrl)
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Get paginated transactions
   */
  getTransactionsPaginated(page: number = 0, size: number = 20): Observable<any> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<any>(this.apiUrl, { params })
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Get single transaction by ID
   */
  getTransactionById(id: string): Observable<Transaction> {
    return this.http.get<Transaction>(`${this.apiUrl}/${id}`)
      .pipe(
        catchError(this.handleError)
      );
  }
  /**
 * Submit a transaction dispute
 */
  submitDispute(request: { transactionId: string; reasonCode: any; }) {
    return this.http.post<Dispute>(`${environment.transactionsAPIBaseUrl}/disputes`, request)
  }

  /**
   * Get transactions that can be disputed
   */
  getDisputableTransactions(): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(`${this.apiUrl}/disputable`)
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Search transactions with filters
   */
  searchTransactions(filters: {
    startDate?: string;
    endDate?: string;
    status?: string;
    type?: string;
    minAmount?: number;
    maxAmount?: number;
  }): Observable<Transaction[]> {
    let params = new HttpParams();

    if (filters.startDate) params = params.set('startDate', filters.startDate);
    if (filters.endDate) params = params.set('endDate', filters.endDate);
    if (filters.status) params = params.set('status', filters.status);
    if (filters.type) params = params.set('type', filters.type);
    if (filters.minAmount !== undefined) params = params.set('minAmount', filters.minAmount.toString());
    if (filters.maxAmount !== undefined) params = params.set('maxAmount', filters.maxAmount.toString());

    return this.http.get<Transaction[]>(`${this.apiUrl}/search`, { params })
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Get transactions by status
   */
  getTransactionsByStatus(status: string): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(`${this.apiUrl}?status=${status}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Get transactions by type (DEBIT/CREDIT)
   */
  getTransactionsByType(type: string): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(`${this.apiUrl}?type=${type}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Get transactions by date range
   */
  getTransactionsByDateRange(startDate: string, endDate: string): Observable<Transaction[]> {
    const params = new HttpParams()
      .set('startDate', startDate)
      .set('endDate', endDate);

    return this.http.get<Transaction[]>(`${this.apiUrl}/date-range`, { params })
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Get transaction statistics
   */
  getTransactionStatistics(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/statistics`)
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Calculate total amount for transactions
   */
  calculateTotalAmount(transactions: Transaction[]): number {
    return transactions.reduce((total, transaction) => {
      if (transaction.type === 'DEBIT') {
        return total - transaction.amount;
      } else {
        return total + transaction.amount;
      }
    }, 0);
  }

  /**
   * Filter transactions by search term
   */
  filterTransactions(transactions: Transaction[], searchTerm: string): Transaction[] {
    if (!searchTerm) return transactions;

    const term = searchTerm.toLowerCase();
    return transactions.filter(transaction =>
      transaction.description?.toLowerCase().includes(term) ||
      transaction.merchantName?.toLowerCase().includes(term) ||
      transaction.transactionId?.toLowerCase().includes(term) ||
      transaction.amount.toString().includes(term)
    );
  }

  /**
   * Sort transactions by date
   */
  sortTransactionsByDate(transactions: Transaction[], ascending: boolean = false): Transaction[] {
    return [...transactions].sort((a, b) => {
      const dateA = new Date(a.transactionDate).getTime();
      const dateB = new Date(b.transactionDate).getTime();
      return ascending ? dateA - dateB : dateB - dateA;
    });
  }

  /**
   * Sort transactions by amount
   */
  sortTransactionsByAmount(transactions: Transaction[], ascending: boolean = true): Transaction[] {
    return [...transactions].sort((a, b) => {
      return ascending ? a.amount - b.amount : b.amount - a.amount;
    });
  }

  /**
   * Group transactions by date
   */
  groupTransactionsByDate(transactions: Transaction[]): Map<string, Transaction[]> {
    const grouped = new Map<string, Transaction[]>();

    transactions.forEach(transaction => {
      const date = new Date(transaction.transactionDate).toDateString();
      if (!grouped.has(date)) {
        grouped.set(date, []);
      }
      grouped.get(date)?.push(transaction);
    });

    return grouped;
  }

  /**
   * Group transactions by month
   */
  groupTransactionsByMonth(transactions: Transaction[]): Map<string, Transaction[]> {
    const grouped = new Map<string, Transaction[]>();

    transactions.forEach(transaction => {
      const date = new Date(transaction.transactionDate);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

      if (!grouped.has(monthKey)) {
        grouped.set(monthKey, []);
      }
      grouped.get(monthKey)?.push(transaction);
    });

    return grouped;
  }

  /**
   * Get transactions summary
   */
  getTransactionsSummary(transactions: Transaction[]): {
    totalTransactions: number;
    totalDebit: number;
    totalCredit: number;
    balance: number;
    disputedCount: number;
  } {
    let totalDebit = 0;
    let totalCredit = 0;
    let disputedCount = 0;

    transactions.forEach(transaction => {
      if (transaction.type === 'DEBIT') {
        totalDebit += transaction.amount;
      } else {
        totalCredit += transaction.amount;
      }

      if (transaction.status === 'DISPUTED') {
        disputedCount++;
      }
    });

    return {
      totalTransactions: transactions.length,
      totalDebit,
      totalCredit,
      balance: totalCredit - totalDebit,
      disputedCount
    };
  }

  /**
   * Check if transaction can be disputed
   */
  canDispute(transaction: Transaction): boolean {
    // Transaction can be disputed if:
    // 1. Status is COMPLETED
    // 2. Not already disputed
    // 3. Within dispute window (e.g., 60 days)

    if (transaction.status === 'DISPUTED' || transaction.status === 'REVERSED') {
      return false;
    }

    const transactionDate = new Date(transaction.transactionDate);
    const now = new Date();
    const daysDifference = Math.floor((now.getTime() - transactionDate.getTime()) / (1000 * 60 * 60 * 24));

    // Allow disputes within 60 days
    return daysDifference <= 60;
  }

  /**
   * Format currency amount
   */
  formatAmount(amount: number, currency: string = 'ZAR'): string {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: currency
    }).format(amount);
  }

  /**
   * Handle HTTP errors
   */
  private handleError(error: any): Observable<never> {
    console.error('Transaction Service Error:', error);

    let errorMessage = 'An error occurred while processing your request.';

    if (error.error?.message) {
      errorMessage = error.error.message;
    } else if (error.status === 0) {
      errorMessage = 'Unable to connect to the server. Please check your connection.';
    } else if (error.status === 401) {
      errorMessage = 'You are not authorized to access this resource.';
    } else if (error.status === 404) {
      errorMessage = 'The requested transaction was not found.';
    } else if (error.status === 500) {
      errorMessage = 'A server error occurred. Please try again later.';
    }

    return throwError(() => new Error(errorMessage));
  }
}