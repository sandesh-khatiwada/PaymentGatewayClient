import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PaymentService } from '../../services/payment.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-otp',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './otp.component.html',
  styleUrls: ['./otp.component.scss']
})
export class OtpComponent implements OnInit {
  otpForm: FormGroup;
  refId: string = '';
  errorMessage: string | null = null; // For error display

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private paymentService: PaymentService
  ) {
    this.otpForm = this.fb.group({
      otp: ['', [Validators.required, Validators.pattern(/^\d{6}$/)]]
    });
  }

  ngOnInit() {
    this.refId = this.route.snapshot.paramMap.get('refId') || '';
  }

  verifyOtp() {
    if (this.otpForm.valid) {
      const request: OtpRequestDTO = {
        refId: this.refId,
        otp: this.otpForm.value.otp
      };
      this.paymentService.verifyOtp(request).subscribe({
        next: (response: OtpResponse) => {
          if (response.success && response.redirectUrl) {
            // Remove /api/auth prefix for Angular routing
            const redirectPath = response.redirectUrl.replace('/api/auth', '');
            this.router.navigateByUrl(redirectPath);
          } else {
            this.errorMessage = response.message || 'OTP verification failed';
          }
        },
        error: (err) => {
          this.errorMessage = err.error?.message || 'OTP verification failed';
          if (err.error?.errors) {
            this.errorMessage += ': ' + err.error.errors.join(', ');
          }
        }
      });
    }
  }
}

interface OtpRequestDTO {
  refId: string;
  otp: string;
}

interface OtpResponse {
  success: boolean;
  status: string;
  code: string;
  message: string;
  redirectUrl: string;
}