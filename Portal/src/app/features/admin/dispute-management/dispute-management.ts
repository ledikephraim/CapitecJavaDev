import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Dispute } from '../../../core/models/dipute.model';
import { DisputeService } from '../../../core/services/dispute';

@Component({
  selector: 'app-dispute-management',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dispute-management.html',
  styleUrl: './dispute-management.scss'
})
export class DisputeManagement implements OnInit {

  disputesPage: number = 0;
  disputesPageSize: number = 10;
  disputesBookSize: number = 1;;
  disputes: Dispute[] = [];
  filteredDisputes: Dispute[] = [];
  loading = true;
  error = '';
  selectedFilter = 'ALL';

  filters = [
    { value: 'ALL', label: 'All Disputes', count: 0 },
    { value: 'PENDING', label: 'Pending', count: 0 },
    { value: 'UNDER_REVIEW', label: 'Under Review', count: 0 },
    { value: 'RESOLVED', label: 'Resolved', count: 0 },
    { value: 'REJECTED', label: 'Rejected', count: 0 }
  ];

  constructor(
    private disputeService: DisputeService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadDisputes();
  }

  loadDisputes(): void {
    this.loading = true;
    this.disputeService.getAllDisputes(
      undefined,
      this.disputesPage,
      this.disputesPageSize,

    ).subscribe({
      next: (data) => {
        this.disputes = data.content;
        this.disputesPage = data.number;
        this.disputesBookSize = data.totalPages;

        this.updateFilterCounts();
        this.applyFilter();
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load disputes';
        this.loading = false;
      }
    });
  }

  updateFilterCounts(): void {
    this.filters[0].count = this.disputes.length;
    this.filters[1].count = this.disputes.filter(d => d.status.code === 'PENDING').length;
    this.filters[2].count = this.disputes.filter(d => d.status.code === 'UNDER_REVIEW').length;
    this.filters[3].count = this.disputes.filter(d => d.status.code === 'RESOLVED').length;
    this.filters[4].count = this.disputes.filter(d => d.status.code === 'REJECTED').length;
  }

  selectFilter(filter: string): void {
    this.selectedFilter = filter;
    this.applyFilter();
  }

  applyFilter(): void {
    if (this.selectedFilter === 'ALL') {
      this.filteredDisputes = this.disputes;
    } else {
      this.filteredDisputes = this.disputes.filter(d => d.status.code === this.selectedFilter);
    }
  }

  viewDispute(dispute: Dispute): void {

    // dispute.transaction = transaction;
    console.log('Navigating to dispute detail for dispute:', dispute);
    this.router.navigate(
      ['/admin/disputes', dispute.id],
      { state: { dispute } }
    );
  }

  getStatusClass(status: string): string {
    return `status-${status.toLowerCase()}`;
  }

  getPriorityClass(amount: number): string {
    if (amount > 10000) return 'priority-urgent';
    if (amount > 5000) return 'priority-high';
    if (amount > 1000) return 'priority-medium';
    return 'priority-low';
  }
}
