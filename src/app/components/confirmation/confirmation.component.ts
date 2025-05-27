import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { PaymentService } from '../../services/payment.service';

@Component({
  selector: 'app-confirmation',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './confirmation.component.html',
  styleUrls: ['./confirmation.component.scss']
})
export class ConfirmationComponent implements OnInit {
  balance: number = 1000; // Placeholder: Fetch from API
  transactionData: TransactionData | null = null;
  refId: string = '';
  errorMessage: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private paymentService: PaymentService
  ) {}

  ngOnInit() {
    this.refId = this.route.snapshot.paramMap.get('refId') || '';
    this.transactionData = this.paymentService.getTransactionData();
    
    if (!this.transactionData) {
      this.errorMessage = 'Transaction data is missing';
      console.error('No transaction data found for refId:', this.refId);
    }
  }

  confirm() {
    if (this.refId && this.transactionData) {
      this.paymentService.confirmTransaction(this.refId).subscribe({
        next: (response: ConfirmResponse) => {
          if (response.success) {
            this.balance -= this.transactionData? this.transactionData.amount:0; 
            alert('Transaction confirmed successfully');
            this.router.navigateByUrl('/');
          } else {
            this.errorMessage = response.message || 'Confirmation failed';
          }
        },
        error: (err) => {
          this.errorMessage = err.error?.message || 'Confirmation failed';
        }
      });
    } else {
      this.errorMessage = 'Invalid transaction data';
    }
  }
}

interface TransactionData {
  initiator: string;
  amount: number;
  particular: string;
  remarks: string;
  refId?: string;
}

interface ConfirmResponse {
  success: boolean;
  status: string;
  code: string;
  message: string;
}