import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { CheckoutRequestDTO, CheckoutResponse, LoginRequestDTO, LoginResponse, OtpRequest, OtpResponse, OtpValidationResponse, OtpVerifyRequestDTO, OtpVerifyResponse, PaymentRequestValidationResponse, ProcessTransactionResponse, UserResponse, TransactionData, AuthCheckResponse } from "../model/PaymentService.model";

@Injectable({ providedIn: "root" })
export class PaymentService {
  private apiUrl = "http://localhost:8080/api";
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

  validateOtpPage(refId: string): Observable<OtpValidationResponse> {
    return this.http.get<OtpValidationResponse>(`${this.apiUrl}/otp/${refId}`);
  }

  verifyOtp(request: OtpVerifyRequestDTO): Observable<OtpVerifyResponse> {
    return this.http.post<OtpVerifyResponse>(`${this.apiUrl}/otp/verification`, request);
  }

  validatePaymentRequest(refId: string): Observable<PaymentRequestValidationResponse> {
    return this.http.post<PaymentRequestValidationResponse>(`${this.apiUrl}/payment-requests/status`, { refId });
  }

  processTransaction(refId: string): Observable<ProcessTransactionResponse> {
    return this.http.post<ProcessTransactionResponse>(`${this.apiUrl}/payment/process`, { refId });
  }

  getUser(): Observable<UserResponse> {
    return this.http.get<UserResponse>(`${this.apiUrl}/user`);
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

