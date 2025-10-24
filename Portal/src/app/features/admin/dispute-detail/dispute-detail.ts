import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { Dispute, DisputeEvent } from '../../../core/models/dipute.model';
import { DisputeService } from '../../../core/services/dispute';

@Component({
  selector: 'app-dispute-detail',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './dispute-detail.html',
  styleUrl: './dispute-detail.scss'
})
export class DisputeDetail implements OnInit {



  dispute: Dispute | null = null;
  events: DisputeEvent[] = [];
  loading = true;
  error = '';
  updating = false;
  statusForm: FormGroup;

  availableStatuses = [
    { code: 'PENDING', description: 'Pending' },
    { code: 'UNDER_REVIEW', description: 'Under Review' },
    { code: 'RESOLVED', description: 'Resolved' },
    { code: 'REJECTED', description: 'Rejected' },
    { code: 'CANCELLED', description: 'Cancelled' }
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private disputeService: DisputeService,
    private fb: FormBuilder
  ) {
    this.statusForm = this.fb.group({
      statusCode: ['', Validators.required]
    });
    const nav = this.router.getCurrentNavigation();
    console.log('Navigation extras state:', nav?.extras?.state);
    this.dispute = nav?.extras?.state?.['dispute'];
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      // this.loadDispute(id);
      console.log('Loaded dispute from navigation state:', this.dispute);
      this.loadEvents(id);
    }
  }
  // loadTransaction(id: string): void {
  //   this.loading = true;
  //   this.disputeService.getTra(id).subscribe({
  //     next: (data) => {
  //       this.dispute = data;
  //       this.statusForm.patchValue({ statusCode: data.status.code });
  //       this.loading = false;
  //     },
  //     error: (err) => {
  //       this.error = 'Failed to load dispute details';
  //       this.loading = false;
  //     }
  //   });
  // }

  loadDispute(id: string): void {
    this.loading = true;
    this.disputeService.getDisputeById(id).subscribe({
      next: (data) => {
        this.dispute = data;
        this.statusForm.patchValue({ statusCode: data.status.code });
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load dispute details';
        this.loading = false;
      }
    });
  }

  loadEvents(id: string): void {
    this.disputeService.getDisputeEvents(id).subscribe({
      next: (data) => {
        this.events = data.sort((a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );

        console.log('Loaded dispute events:', this.events);
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to load events', err);
        this.loading = false;
      },
      
    });
  }

  updateStatus(): void {
    if (this.statusForm.invalid || !this.dispute) return;

    const newStatusCode = this.statusForm.value.statusCode;
    if (newStatusCode === this.dispute.status.code) {
      alert('Status is already set to this value');
      return;
    }

    this.updating = true;
    this.disputeService.updateDisputeStatus(
      this.dispute.id,
      { statusCode: newStatusCode }
    ).subscribe({
      next: (updated) => {
        this.dispute = updated;
        this.updating = false;
        alert('Dispute status updated successfully');
        this.loadEvents(this.dispute.id);
      },
      error: (err) => {
        alert('Failed to update status');
        this.updating = false;
      }
    });
  }

  getStatusClass(status: string): string {
    return `status-${status.toLowerCase()}`;
  }

  getDaysOpen(): number {
    if (!this.dispute) return 0;
    const created = new Date(this.dispute.createdAt);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - created.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }

  goBack(): void {
    this.router.navigate(['/admin/disputes']);
  }
}
