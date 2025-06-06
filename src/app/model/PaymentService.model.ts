
 export interface CheckoutRequestDTO {
  application: string;
  amount: number;
  particular: string;
  remarks: string;
}

export  interface CheckoutResponse {
  success: boolean;
  status: string;
  code: string;
  message: string;
  data: { refId: string; redirectURL: string } | null;
  errors: string[] | null;
  timestamp: string;
}

export  interface LoginRequestDTO {
  refId: string;
  usernameOrEmail: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  status: string;
  code: string;
  message: string;
  data: { token: string; username: string; email: string } | null;
  errors: string[] | null;
  timestamp: string;
}

export interface OtpRequest {
  refId: string;
}

export interface OtpResponse {
  success: boolean;
  status: string;
  code: string;
  message: string;
  data: null;
  errors: string[] | null;
  timestamp: string;
}

export interface OtpValidationResponse {
  success: boolean;
  status: string;
  code: string;
  message: string;
  data: null;
  errors: string[] | null;
  timestamp: string;
}

export interface OtpVerifyRequestDTO {
  otp: string;
  refId: string;
}

export interface OtpVerifyResponse {
  success: boolean;
  status: string;
  code: string;
  message: string;
  data: null;
  errors: string[] | null;
  timestamp: string;
}

export interface PaymentRequestValidationResponse {
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

export interface ProcessTransactionResponse {
  success: boolean;
  status: string;
  code: string;
  message: string;
  data: { successURL: string; failureURL: string } | null;
  errors: string[] | null;
  timestamp: string;
}

export interface UserResponse {
  success: boolean;
  status: string;
  code: string;
  message: string;
  data: { id: number; username: string; email: string; balance: number } | null;
  errors: string[] | null;
  timestamp: string;
}

export interface TransactionData {
  initiator: string;
  amount: number;
  particular: string;
  remarks: string;
  refId?: string;
}

export interface AuthCheckResponse {
  success: boolean;
  status: string;
  code: string;
  message: string;
  data: null;
  errors: string[] | null;
  timestamp: string;
}


