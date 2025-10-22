import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DisputeService } from '../../../core/services/dispute';
import { Dispute, DisputeEvent } from '../../../core/models/dipute.model';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-dispute-events',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dispute-events.html',
  styleUrls: ['./dispute-events.scss']
})
export class DisputeEvents implements OnInit {
  dispute: Dispute | null = null;
  events: DisputeEvent[] = [];
  loading = true;
  error = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private disputeService: DisputeService
  ) {
    const nav = this.router.getCurrentNavigation();
    this.dispute = nav?.extras?.state?.['dispute'];
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadDisputeAndEvents(id);

    }
  }

  loadDisputeAndEvents(id: string): void {

    this.disputeService.getDisputeEvents(id)
      .subscribe({
        next: (events) => {
          this.events = events.sort((a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
          this.loading = false;

          console.log('Fetched dispute events:', this.events);
        },
        error: (err) => {
          this.error = 'Failed to load dispute details';
          this.loading = false;
        }
      });
  }

  // loadEvents(id: string): void {
  //   this.disputeService.getDisputeByTransactionId(id).subscribe({
  //     next: (data) => {
  //       this.events = data.sort((a, b) => 
  //         new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  //       );
  //       this.loading = false;
  //     },
  //     error: (err) => {
  //       this.error = 'Failed to load dispute events';
  //       this.loading = false;
  //     }
  //   });
  // }

  getStatusClass(status: string): string {
    return `status-${status.toLowerCase()}`;
  }

  getEventIcon(eventType: string): string {
    const icons: any = {
      'CREATED': 'plus-circle',
      'STATUS_UPDATED': 'refresh-cw',
      'COMMENT_ADDED': 'message-circle',
      'ATTACHMENT_UPLOADED': 'paperclip',
      'CLOSED': 'check-circle'
    };
    return icons[eventType] || 'circle';
  }

  goBack(): void {
    this.router.navigate(['/transactions', this.dispute?.transaction.id]);
  }
}
