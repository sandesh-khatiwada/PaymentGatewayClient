import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PaymentService } from '../../services/payment.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  refId: string = '';
  isLoading: boolean = true; 
  errorMessage: string | null = null;
  loadingState: 'idle' | 'loggingIn' | 'sendingOtp' = 'idle';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private paymentService: PaymentService
  ) {
    this.loginForm = this.fb.group({
      usernameOrEmail: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.refId = this.route.snapshot.paramMap.get('refId') || '';
    if (this.refId) {
      this.paymentService.getTransactionStatus(this.refId).subscribe({
        next: (response: AuthCheckResponse) => {
          if (response.success) {
            this.isLoading = false;
          } else {
            const errorMessage = response.errors?.join(', ') || response.message || 'Invalid transaction';
            this.paymentService.setErrorMessage(errorMessage);
            this.router.navigateByUrl('/error');
          }
        },
        error: (err) => {
          const errorMessage = err.error?.message || 'Failed to validate transaction';
          this.paymentService.setErrorMessage(errorMessage);
          this.router.navigateByUrl('/error');
        }
      });
    } else {
      this.paymentService.setErrorMessage('No transaction reference provided');
      this.router.navigateByUrl('/error');
    }
  }

  login() {
    if (this.loginForm.valid && this.loadingState === 'idle') {
      this.loadingState = 'loggingIn';
      this.errorMessage = null; // Clear previous errors
      const loginRequest: LoginRequestDTO = {
        refId: this.refId,
        usernameOrEmail: this.loginForm.value.usernameOrEmail,
        password: this.loginForm.value.password
      };
      this.paymentService.login(loginRequest).subscribe({
        next: (response: LoginResponse) => {
          if (response.success && response.data?.token) {
            localStorage.setItem('jwt', response.data.token);
            this.loadingState = 'sendingOtp';
            const otpRequest: OtpRequest = { refId: this.refId };
            this.paymentService.sendOtp(otpRequest).subscribe({
              next: (otpResponse: OtpResponse) => {
                if (otpResponse.success) {
                  this.router.navigateByUrl(`/otp/${this.refId}`);
                } else {
                  this.errorMessage = otpResponse.errors?.join(', ') || otpResponse.message || 'Failed to send OTP';
                  this.loadingState = 'idle';
                }
              },
              error: (err) => {
                this.errorMessage = err.error?.errors?.join(', ') || err.error?.message || 'Failed to send OTP';
                this.loadingState = 'idle';
              }
            });
          } else {
            this.errorMessage = response.errors?.join(', ') || response.message || 'Login failed';
            this.loadingState = 'idle';
          }
        },
        error: (err) => {
          this.errorMessage = err.error?.errors?.join(', ') || err.error?.message || 'Login failed';
          this.loadingState = 'idle';
        }
      });
    }
  }
}

interface AuthCheckResponse {
  success: boolean;
  status: string;
  code: string;
  message: string;
  data: null;
  errors: string[] | null;
  timestamp: string;
}

interface LoginRequestDTO {
  refId: string;
  usernameOrEmail: string;
  password: string;
}

interface LoginResponse {
  success: boolean;
  status: string;
  code: string;
  message: string;
  data: { token: string; username: string; email: string } | null;
  errors: string[] | null;
  timestamp: string;
}

interface OtpRequest {
  refId: string;
}

interface OtpResponse {
  success: boolean;
  status: string;
  code: string;
  message: string;
  data: null;
  errors: string[] | null;
  timestamp: string;
}