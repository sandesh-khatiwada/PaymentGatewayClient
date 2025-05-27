// src/app/services/payment.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PaymentService {
  private apiUrl = 'http://localhost:8080/api';
  private transactionData: TransactionData | null = null;
  private errorMessage: string | null = null;

  constructor(private http: HttpClient) {}

  initiateCheckout(request: CheckoutRequestDTO): Observable<CheckoutResponse> {
    return this.http.post<CheckoutResponse>(`${this.apiUrl}/ecom/checkout`, request);
  }

  login(request: LoginRequestDTO): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/auth/login`, request);
  }

  sendOtp(request: OtpRequest): Observable<OtpResponse> {
    return this.http.post<OtpResponse>(`${this.apiUrl}/otp`, request);
  }

  verifyOtp(request: OtpVerifyRequestDTO): Observable<OtpVerifyResponse> {
    return this.http.post<OtpVerifyResponse>(`${this.apiUrl}/accept/${request.refId}`, { otp: request.otp });
  }

  confirmTransaction(refId: string): Observable<ConfirmResponse> {
    return this.http.post<ConfirmResponse>(`${this.apiUrl}/auth/process/${refId}`, {});
  }

  getTransactionStatus(refId: string): Observable<AuthCheckResponse> {
    return this.http.get<AuthCheckResponse>(`${this.apiUrl}/auth/login/${refId}`);
  }

  setTransactionData(data: TransactionData) {
    this.transactionData = data;
  }

  getTransactionData(): TransactionData | null {
    return this.transactionData;
  }

  setErrorMessage(message: string | null) {
    this.errorMessage = message;
  }

  getErrorMessage(): string | null {
    return this.errorMessage;
  }
}

interface CheckoutRequestDTO {
  application: string;
  amount: number;
  particular: string;
  remarks: string;
}

interface CheckoutResponse {
  success: boolean;
  status: string;
  code: string;
  message: string;
  data: { refId: string; redirectURL: string } | null;
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

interface OtpVerifyRequestDTO {
  refId: string;
  otp: string;
}

interface OtpVerifyResponse {
  success: boolean;
  status: string;
  code: string;
  message: string;
  redirectUrl: string;
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

interface AuthCheckResponse {
  success: boolean;
  status: string;
  code: string;
  message: string;
  data: null;
  errors: string[] | null;
  timestamp: string;
}