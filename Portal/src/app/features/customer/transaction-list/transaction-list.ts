import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TransactionService } from '../../../core/services/transaction';
import { Transaction } from '../../../core/models/transaction.model';

@Component({
  selector: 'app-transaction-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './transaction-list.html',
  styleUrls: ['./transaction-list.scss']
})
export class TransactionList implements OnInit {
  transactions: Transaction[] = [];
  loading = true;
  error = '';

  constructor(
    private transactionService: TransactionService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadTransactions();
  }

  loadTransactions(): void {
    this.loading = true;
    this.transactionService.getTransactions().subscribe({
      next: (data) => {
        
        this.transactions = [...data];
        console.log('Fetched transactions:', this.transactions);

        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load transactions';
        this.loading = false;
      }
    });
  }

  viewDetails(id: string): void {
    console.log('Navigating to transaction details for ID:', id);
    this.router.navigate(['/transactions', id]);
  }

  getStatusClass(status: string): string {
    return `status-${status.toLowerCase()}`;
  }
}
