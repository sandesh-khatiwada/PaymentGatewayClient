// src/app/components/error/error.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaymentService } from '../../services/payment.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-error',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.scss']
})
export class ErrorComponent {
  errorMessage: string = 'An unexpected error occurred';

  constructor(
    private paymentService: PaymentService,
    private router: Router
  ) {
    const message = this.paymentService.getErrorMessage();
    if (message) {
      this.errorMessage = message;
    }
  }

  goHome() {
    this.paymentService.setErrorMessage(null); 
    this.router.navigateByUrl('/');
  }
}