import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PaymentService {
  private apiUrl = 'http://localhost:8080/api';
  private transactionData: any = null;

  constructor(private http: HttpClient) {}

  initiateCheckout(request: CheckoutRequestDTO): Observable<CheckoutResponse> {
    return this.http.post<CheckoutResponse>(`${this.apiUrl}/ecom/checkout`, request);
  }

  login(request: LoginRequestDTO): Observable<LoginResponse> {
    return of({ redirectUrl: `/otp/${request.refId}` });
  }

  confirmTransaction(refId: string): Observable<ConfirmResponse> {
    return this.http.post<ConfirmResponse>(`${this.apiUrl}/auth/process/${refId}`, {});
  }

  verifyOtp(request: OtpRequestDTO): Observable<OtpResponse> {
    // Actual API call
    return this.http.post<OtpResponse>(`${this.apiUrl}/auth/otp/${request.refId}`, { otp: request.otp });
    // For testing, use:
    // return of({
    //   success: true,
    //   status: 'OK',
    //   code: '000',
    //   message: 'OTP verified successfully',
    //   redirectUrl: `/confirmation/${request.refId}`
    // });
  }

  setTransactionData(data: any) {
    this.transactionData = data;
  }

  getTransactionData() {
    return this.transactionData;
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
  redirectUrl: string;
}

interface ConfirmResponse {
  success: boolean;
  status: string;
  code: string;
  message: string;
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