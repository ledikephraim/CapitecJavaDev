// src/app/core/models/dispute.model.ts
import { Pageable } from './pageable.model';
import { Transaction } from './transaction.model';

/**
 * Dispute entity representing a transaction dispute
 */
export interface Dispute {
  id: string;
  transactionId: string;
  userId: string;
  reason: DisputeReason;
  status: DisputeStatus;
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
  transaction: Transaction;
  assignedTo?: string;
  priority?: DisputePriority;
  resolutionNotes?: string;
}

export interface PagedDisputes {
  content: Dispute[];
  pageable: Pageable;
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

/**
 * Dispute reason lookup
 */
export interface DisputeReason {
  code: string;
  description: string;
}

/**
 * Dispute status lookup
 */
export interface DisputeStatus {
  code: string;
  description: string;
}

/**
 * Dispute status codes
 */
export type DisputeStatusCode = 
  | 'PENDING' 
  | 'UNDER_REVIEW' 
  | 'RESOLVED' 
  | 'REJECTED' 
  | 'CANCELLED';

/**
 * Dispute reason codes
 */
export type DisputeReasonCode = 
  | 'UNAUTHORIZED' 
  | 'DUPLICATE' 
  | 'INCORRECT_AMOUNT' 
  | 'MERCHANT_ERROR' 
  | 'FRAUD';

/**
 * Dispute priority levels
 */
export type DisputePriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

/**
 * Dispute event representing a status change or action
 */
export interface DisputeEvent {
  id: string;
  dispute: Dispute;
  eventType: DisputeEventType;
  eventData: any;
  createdAt: string;
}

/**
 * Dispute event type lookup
 */
export interface DisputeEventType {
  code: string;
  description: string;
}

/**
 * Dispute event type codes
 */
export type DisputeEventTypeCode = 
  | 'CREATED' 
  | 'STATUS_UPDATED' 
  | 'COMMENT_ADDED' 
  | 'ATTACHMENT_UPLOADED' 
  | 'CLOSED';

/**
 * Create dispute request
 */
export interface CreateDisputeRequest {
  transactionId: string;
  reasonCode: string;
}

/**
 * Update dispute status request
 */
export interface UpdateDisputeStatusRequest {
  statusCode: string;
  resolutionNotes?: string;
}

/**
 * Assign dispute request
 */
export interface AssignDisputeRequest {
  adminId: string;
}

/**
 * Add comment request
 */
export interface AddCommentRequest {
  comment: string;
  isInternal?: boolean;
}

/**
 * Dispute comment
 */
export interface DisputeComment {
  id: string;
  disputeId: string;
  userId: string;
  comment: string;
  isInternal: boolean;
  createdAt: string;
}

/**
 * Dispute attachment
 */
export interface DisputeAttachment {
  id: string;
  disputeId: string;
  fileName: string;
  fileUrl: string;
  fileType: string;
  uploadedBy: string;
  uploadedAt: string;
}

/**
 * Dispute filter options
 */
export interface DisputeFilter {
  status?: DisputeStatusCode;
  reasonCode?: DisputeReasonCode;
  priority?: DisputePriority;
  assignedTo?: string;
  startDate?: string;
  endDate?: string;
  minAmount?: number;
  maxAmount?: number;
}

/**
 * Dispute statistics
 */
export interface DisputeStatistics {
  total: number;
  pending: number;
  underReview: number;
  resolved: number;
  rejected: number;
  cancelled: number;
  totalAmount: number;
  averageResolutionTime: number;
}

/**
 * Dispute status history entry
 */
export interface DisputeStatusHistory {
  id: string;
  disputeId: string;
  oldStatus: string;
  newStatus: string;
  changedBy: string;
  notes?: string;
  changedAt: string;
}

/**
 * Paginated dispute response
 */
export interface DisputePageResponse {
  content: Dispute[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

/**
 * Helper function to check if dispute is pending
 */
export function isPending(dispute: Dispute): boolean {
  return dispute.status.code === 'PENDING';
}

/**
 * Helper function to check if dispute is under review
 */
export function isUnderReview(dispute: Dispute): boolean {
  return dispute.status.code === 'UNDER_REVIEW';
}

/**
 * Helper function to check if dispute is resolved
 */
export function isResolved(dispute: Dispute): boolean {
  return dispute.status.code === 'RESOLVED';
}

/**
 * Helper function to check if dispute is rejected
 */
export function isRejected(dispute: Dispute): boolean {
  return dispute.status.code === 'REJECTED';
}

/**
 * Helper function to check if dispute is closed (resolved or rejected)
 */
export function isClosed(dispute: Dispute): boolean {
  return isResolved(dispute) || isRejected(dispute);
}

/**
 * Helper function to get dispute priority based on amount
 */
export function getDisputePriority(amount: number): DisputePriority {
  if (amount > 10000) return 'URGENT';
  if (amount > 5000) return 'HIGH';
  if (amount > 1000) return 'MEDIUM';
  return 'LOW';
}

/**
 * Helper function to get days since dispute creation
 */
export function getDaysSinceCreated(dispute: Dispute): number {
  const created = new Date(dispute.createdAt);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - created.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Helper function to get resolution time in days
 */
export function getResolutionTime(dispute: Dispute): number | null {
  if (!dispute.resolvedAt) return null;
  
  const created = new Date(dispute.createdAt);
  const resolved = new Date(dispute.resolvedAt);
  const diffTime = Math.abs(resolved.getTime() - created.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Helper function to get status color class
 */
export function getDisputeStatusColorClass(status: DisputeStatusCode): string {
  const colorMap: { [key in DisputeStatusCode]: string } = {
    'PENDING': 'status-warning',
    'UNDER_REVIEW': 'status-info',
    'RESOLVED': 'status-success',
    'REJECTED': 'status-error',
    'CANCELLED': 'status-neutral'
  };
  
  return colorMap[status];
}

/**
 * Helper function to get priority color class
 */
export function getPriorityColorClass(priority: DisputePriority): string {
  const colorMap: { [key in DisputePriority]: string } = {
    'LOW': 'priority-low',
    'MEDIUM': 'priority-medium',
    'HIGH': 'priority-high',
    'URGENT': 'priority-urgent'
  };
  
  return colorMap[priority];
}

/**
 * Helper function to format status for display
 */
export function formatDisputeStatus(status: string): string {
  return status.replace(/_/g, ' ')
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Helper function to check if status transition is valid
 */
export function canTransitionTo(currentStatus: DisputeStatusCode, newStatus: DisputeStatusCode): boolean {
  const validTransitions: { [key in DisputeStatusCode]: DisputeStatusCode[] } = {
    'PENDING': ['UNDER_REVIEW', 'CANCELLED'],
    'UNDER_REVIEW': ['RESOLVED', 'REJECTED', 'PENDING'],
    'RESOLVED': [],
    'REJECTED': [],
    'CANCELLED': []
  };
  
  return validTransitions[currentStatus]?.includes(newStatus) || false;
}

/**
 * Helper function to get available status transitions
 */
export function getAvailableTransitions(currentStatus: DisputeStatusCode): DisputeStatusCode[] {
  const transitions: { [key in DisputeStatusCode]: DisputeStatusCode[] } = {
    'PENDING': ['UNDER_REVIEW', 'CANCELLED'],
    'UNDER_REVIEW': ['RESOLVED', 'REJECTED'],
    'RESOLVED': [],
    'REJECTED': [],
    'CANCELLED': []
  };
  
  return transitions[currentStatus] || [];
}

/**
 * Helper function to check if dispute can be cancelled
 */
export function canCancel(dispute: Dispute): boolean {
  return dispute.status.code === 'PENDING' || dispute.status.code === 'UNDER_REVIEW';
}

/**
 * Helper function to check if dispute can be edited
 */
export function canEdit(dispute: Dispute): boolean {
  return dispute.status.code === 'PENDING';
}