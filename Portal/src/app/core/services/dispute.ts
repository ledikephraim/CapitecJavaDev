import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Dispute } from '../models/dipute.model';
import { environment } from '../../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class DisputeService {

  private apiUrl = `${environment.transactionsAPIBaseUrl}/disputes/transaction`;

  constructor(private http: HttpClient) {}

  // ==================== CUSTOMER ENDPOINTS ====================

  /**
   * Create a new dispute for a transaction
   */
  // createDispute(request: CreateDisputeRequest): Observable<Dispute> {
  //   return this.http.post<Dispute>(this.apiUrl, request)
  //     .pipe(
  //       catchError(this.handleError)
  //     );
  // }

  /**
   * Get all disputes for current user
   */
  getMyDisputes(): Observable<Dispute[]> {
    return this.http.get<Dispute[]>(this.apiUrl)
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Get dispute by ID
   */
  getDisputeById(id: string): Observable<Dispute> {
    return this.http.get<Dispute>(`${this.apiUrl}/${id}`)
      .pipe(
        catchError(this.handleError)
      );
  }

    /**
   * Get dispute by transaction ID
   */
  getDisputeByTransactionId(id: string): Observable<Dispute> {
    return this.http.get<Dispute>(`${this.apiUrl}/${id}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Get all events for a specific dispute
   */
  // getDisputeEvents(disputeId: string): Observable<DisputeEvent[]> {
  //   return this.http.get<DisputeEvent[]>(`${this.apiUrl}/${disputeId}/events`)
  //     .pipe(
  //       catchError(this.handleError)
  //     );
  // }

  /**
   * Add comment to dispute
   */
  addDisputeComment(disputeId: string, comment: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/${disputeId}/comments`, { comment })
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Upload attachment to dispute
   */
  uploadDisputeAttachment(disputeId: string, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post<any>(`${this.apiUrl}/${disputeId}/attachments`, formData)
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Cancel dispute (customer initiated)
   */
  cancelDispute(disputeId: string): Observable<Dispute> {
    return this.http.put<Dispute>(`${this.apiUrl}/${disputeId}/cancel`, {})
      .pipe(
        catchError(this.handleError)
      );
  }

  // ==================== ADMIN ENDPOINTS ====================

  /**
   * Get all disputes (admin only)
   */
  getAllDisputes(status?: string, page?: number, size?: number): Observable<Dispute[]> {
    let params = new HttpParams();
    
    if (status) params = params.set('status', status);
    if (page !== undefined) params = params.set('page', page.toString());
    if (size !== undefined) params = params.set('size', size.toString());

    return this.http.get<Dispute[]>(`${this.apiUrl}/admin`, { params })
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Get disputes by status (admin only)
   */
  getDisputesByStatus(status: string): Observable<Dispute[]> {
    return this.http.get<Dispute[]>(`${this.apiUrl}/admin?status=${status}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Update dispute status (admin only)
   */
  // updateDisputeStatus(
  //   disputeId: string, 
  //   request: UpdateDisputeStatusRequest
  // ): Observable<Dispute> {
  //   return this.http.put<Dispute>(`${this.apiUrl}/${disputeId}/status`, request)
  //     .pipe(
  //       catchError(this.handleError)
  //     );
  // }

  /**
   * Assign dispute to admin (admin only)
   */
  assignDispute(disputeId: string, adminId: string): Observable<Dispute> {
    return this.http.put<Dispute>(`${this.apiUrl}/${disputeId}/assign`, { adminId })
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Add internal note to dispute (admin only)
   */
  addInternalNote(disputeId: string, note: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/${disputeId}/internal-notes`, { note })
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Get dispute statistics (admin only)
   */
  getDisputeStatistics(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/admin/statistics`)
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Get disputes assigned to current admin
   */
  getMyAssignedDisputes(): Observable<Dispute[]> {
    return this.http.get<Dispute[]>(`${this.apiUrl}/admin/assigned-to-me`)
      .pipe(
        catchError(this.handleError)
      );
  }

  // ==================== UTILITY METHODS ====================

  /**
   * Filter disputes by search term
   */
  filterDisputes(disputes: Dispute[], searchTerm: string): Dispute[] {
    if (!searchTerm) return disputes;

    const term = searchTerm.toLowerCase();
    return disputes.filter(dispute =>
      dispute.transaction.description?.toLowerCase().includes(term) ||
      dispute.transaction.merchantName?.toLowerCase().includes(term) ||
      dispute.transaction.transactionId?.toLowerCase().includes(term) ||
      dispute.reason.description?.toLowerCase().includes(term) ||
      dispute.id?.toLowerCase().includes(term)
    );
  }

  /**
   * Sort disputes by date
   */
  sortDisputesByDate(disputes: Dispute[], ascending: boolean = false): Dispute[] {
    return [...disputes].sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return ascending ? dateA - dateB : dateB - dateA;
    });
  }

  /**
   * Sort disputes by amount
   */
  sortDisputesByAmount(disputes: Dispute[], ascending: boolean = false): Dispute[] {
    return [...disputes].sort((a, b) => {
      return ascending 
        ? a.transaction.amount - b.transaction.amount 
        : b.transaction.amount - a.transaction.amount;
    });
  }

  /**
   * Group disputes by status
   */
  groupDisputesByStatus(disputes: Dispute[]): Map<string, Dispute[]> {
    const grouped = new Map<string, Dispute[]>();

    disputes.forEach(dispute => {
      const status = dispute.status.code;
      if (!grouped.has(status)) {
        grouped.set(status, []);
      }
      grouped.get(status)?.push(dispute);
    });

    return grouped;
  }

  /**
   * Get dispute statistics summary
   */
  getDisputesSummary(disputes: Dispute[]): {
    total: number;
    pending: number;
    underReview: number;
    resolved: number;
    rejected: number;
    cancelled: number;
    totalAmount: number;
  } {
    let pending = 0;
    let underReview = 0;
    let resolved = 0;
    let rejected = 0;
    let cancelled = 0;
    let totalAmount = 0;

    disputes.forEach(dispute => {
      totalAmount += dispute.transaction.amount;

      switch (dispute.status.code) {
        case 'PENDING':
          pending++;
          break;
        case 'UNDER_REVIEW':
          underReview++;
          break;
        case 'RESOLVED':
          resolved++;
          break;
        case 'REJECTED':
          rejected++;
          break;
        case 'CANCELLED':
          cancelled++;
          break;
      }
    });

    return {
      total: disputes.length,
      pending,
      underReview,
      resolved,
      rejected,
      cancelled,
      totalAmount
    };
  }

  /**
   * Calculate dispute resolution time in days
   */
  getResolutionTime(dispute: Dispute): number | null {
    if (dispute.status.code !== 'RESOLVED' && dispute.status.code !== 'REJECTED') {
      return null;
    }

    const created = new Date(dispute.createdAt);
    const updated = new Date(dispute.updatedAt);
    const diffTime = Math.abs(updated.getTime() - created.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  /**
   * Calculate days since dispute was created
   */
  getDaysSinceCreated(dispute: Dispute): number {
    const created = new Date(dispute.createdAt);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - created.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  /**
   * Get dispute priority based on amount
   */
  getDisputePriority(amount: number): 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT' {
    if (amount > 10000) return 'URGENT';
    if (amount > 5000) return 'HIGH';
    if (amount > 1000) return 'MEDIUM';
    return 'LOW';
  }

  /**
   * Check if dispute status can be changed to new status
   */
  canChangeStatus(currentStatus: string, newStatus: string): boolean {
    const validTransitions: { [key: string]: string[] } = {
      'PENDING': ['UNDER_REVIEW', 'CANCELLED'],
      'UNDER_REVIEW': ['RESOLVED', 'REJECTED', 'PENDING'],
      'RESOLVED': [],
      'REJECTED': [],
      'CANCELLED': []
    };

    return validTransitions[currentStatus]?.includes(newStatus) || false;
  }

  /**
   * Format dispute status for display
   */
  formatStatus(status: string): string {
    return status.replace(/_/g, ' ').toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  /**
   * Get available status transitions
   */
  getAvailableStatusTransitions(currentStatus: string): string[] {
    const transitions: { [key: string]: string[] } = {
      'PENDING': ['UNDER_REVIEW', 'CANCELLED'],
      'UNDER_REVIEW': ['RESOLVED', 'REJECTED'],
      'RESOLVED': [],
      'REJECTED': [],
      'CANCELLED': []
    };

    return transitions[currentStatus] || [];
  }

  /**
   * Export disputes to CSV format
   */
  exportToCSV(disputes: Dispute[]): string {
    const headers = ['ID', 'Transaction ID', 'User ID', 'Amount', 'Status', 'Reason', 'Created At', 'Updated At'];
    const rows = disputes.map(d => [
      d.id,
      d.transaction.transactionId,
      d.userId,
      d.transaction.amount,
      d.status.description,
      d.reason.description,
      d.createdAt,
      d.updatedAt
    ]);

    const csv = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    return csv;
  }

  /**
   * Handle HTTP errors
   */
  private handleError(error: any): Observable<never> {
    console.error('Dispute Service Error:', error);
    
    let errorMessage = 'An error occurred while processing your request.';
    
    if (error.error?.message) {
      errorMessage = error.error.message;
    } else if (error.status === 0) {
      errorMessage = 'Unable to connect to the server. Please check your connection.';
    } else if (error.status === 401) {
      errorMessage = 'You are not authorized to perform this action.';
    } else if (error.status === 403) {
      errorMessage = 'You do not have permission to access this resource.';
    } else if (error.status === 404) {
      errorMessage = 'The requested dispute was not found.';
    } else if (error.status === 409) {
      errorMessage = 'A dispute already exists for this transaction.';
    } else if (error.status === 500) {
      errorMessage = 'A server error occurred. Please try again later.';
    }

    return throwError(() => error);
  }
}