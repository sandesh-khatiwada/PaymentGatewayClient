import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

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

interface OtpValidationResponse {
  success: boolean;
  status: string;
  code: string;
  message: string;
  data: null;
  errors: string[] | null;
  timestamp: string;
}

interface OtpVerifyRequestDTO {
  otp: string;
  refId: string;
}

interface OtpVerifyResponse {
  success: boolean;
  status: string;
  code: string;
  message: string;
  data: null;
  errors: string[] | null;
  timestamp: string;
}

interface PaymentRequestValidationResponse {
  success: boolean;
  status: string;
  code: string;
  message: string;
  data: {
    application: string;
    amount: number;
    particular: string;
    remarks: string;
    refId: string;
    redirectURL: string | null;
  } | null;
  errors: string[] | null;
  timestamp: string;
}

interface ProcessTransactionResponse {
  success: boolean;
  status: string;
  code: string;
  message: string;
  data: { successURL: string; failureURL: string } | null;
  errors: string[] | null;
  timestamp: string;
}

interface UserResponse {
  success: boolean;
  status: string;
  code: string;
  message: string;
  data: { id: number; username: string; email: string; balance: number } | null;
  errors: string[] | null;
  timestamp: string;
}

interface TransactionData {
  initiator: string;
  amount: number;
  particular: string;
  remarks: string;
  refId?: string;
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