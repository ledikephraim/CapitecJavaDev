import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { TransactionService } from '../../../core/services/transaction';
import { DisputeService } from '../../../core/services/dispute';
import { Transaction } from '../../../core/models/transaction.model';
import { Dispute } from '../../../core/models/dipute.model';
import { forkJoin } from 'rxjs/internal/observable/forkJoin';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
@Component({
  selector: 'app-transaction-detail',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './transaction-detail.html',
  styleUrl: './transaction-detail.scss'
})
export class TransactionDetail implements OnInit {

  transaction: Transaction | null = null;
  transactionDispute: Dispute | null = null;

  loading = true;
  error = '';
  showDisputeForm = false;
  disputeForm: FormGroup;
  submittingDispute = false;
  disputeReasons = [
    { code: 'UNAUTHORIZED', description: 'Unauthorized Transaction' },
    { code: 'DUPLICATE', description: 'Duplicate Transaction' },
    { code: 'INCORRECT_AMOUNT', description: 'Incorrect Amount' },
    { code: 'MERCHANT_ERROR', description: 'Merchant Error' },
    { code: 'FRAUD', description: 'Suspected Fraud' }
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private transactionService: TransactionService,
    private disputeService: DisputeService,
    private fb: FormBuilder
  ) {
    this.disputeForm = this.fb.group({
      reasonCode: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadTransaction(id);
    }
  }

  loadTransaction(id: string): void {
    this.loading = true;

    forkJoin({
      transaction: this.transactionService.getTransactionById(id),
      dispute: this.disputeService.getDisputeByTransactionId(id).pipe(
        catchError((error) => {
          console.error('Dispute fetch error:', error); // Helpful for debugging
          if (error instanceof HttpErrorResponse && error.status === 404) {
            return of(null);
          } else
            if (error.status === 404) {
              return of(null); // Dispute not found
            } else {
              throw error; // Other errors should still be caught in forkJoin
            }
        })
      )
    }).subscribe({
      next: ({ transaction, dispute }) => {
        this.transaction = transaction;
        this.transactionDispute = dispute;
        console.log('Fetched transaction details:', this.transaction);
        console.log('Fetched dispute details:', this.transactionDispute);
        this.loading = false;
      },
      error: (err) => {
        console.error('Load transaction failed:', err);
        this.error = 'Failed to load transaction details';
        this.loading = false;
      }
    });
  }


  toggleDisputeForm(): void {
    this.showDisputeForm = !this.showDisputeForm;
  }

  submitDispute(): void {
    if (this.disputeForm.invalid || !this.transaction) return;

    this.submittingDispute = true;
    const request = {
      transactionId: this.transaction.id,
      reasonCode: this.disputeForm.value.reasonCode
    };
  }

  getStatusClass(status: string): string {
    return `status-${status.toLowerCase()}`;
  }

  goBack(): void {
    this.router.navigate(['/transactions']);
  }
}