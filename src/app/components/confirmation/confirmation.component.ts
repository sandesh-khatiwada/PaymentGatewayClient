import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ActivatedRoute, Router } from "@angular/router";
import { PaymentService } from "../../services/payment.service";
import { forkJoin } from "rxjs";

@Component({
  selector: "app-confirmation",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./confirmation.component.html",
  styleUrls: ["./confirmation.component.scss"],
})
export class ConfirmationComponent implements OnInit {
  balance: number | null = null; 
  username: string | null = null; 
  transactionData: TransactionData | null = null;
  refId: string = "";
  errorMessage: string | null = null; 
  isLoading: boolean = true;
  successMessage: string | null = null;
  showResult: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private paymentService: PaymentService,
  ) {}

  ngOnInit() {
    this.refId = this.route.snapshot.paramMap.get("refId") || "";
    if (this.refId) {
      forkJoin({
        user: this.paymentService.getUser(),
        paymentRequest: this.paymentService.validatePaymentRequest(this.refId),
      }).subscribe({
        next: ({ user, paymentRequest }) => {
          if (user.success && paymentRequest.success) {
            this.username = user.data?.username || "Unknown";
            this.balance = user.data?.balance ?? 0;
            this.transactionData = this.paymentService.getTransactionData();
            if (!this.transactionData && paymentRequest.data && user.data) {
              // Map paymentRequest.data to TransactionData
              this.transactionData = {
                initiator: user.data.username,
                amount: paymentRequest.data.amount,
                particular: paymentRequest.data.particular,
                remarks: paymentRequest.data.remarks,
                refId: paymentRequest.data.refId,
              };
              this.paymentService.setTransactionData(this.transactionData); // Cache
            }
            if (!this.transactionData) {
              this.errorMessage = "Transaction data is missing";
              console.error("No transaction data found for refId:", this.refId);
              this.paymentService.setErrorMessage(this.errorMessage);
              this.router.navigateByUrl("/error");
            } else {
              this.isLoading = false;
            }
          } else {
            const errorMessage =
              user.success
                ? paymentRequest.errors?.join(", ") || paymentRequest.message || "Invalid transaction"
                : user.errors?.join(", ") || user.message || "Failed to fetch user data";
            this.paymentService.setErrorMessage(errorMessage);
            this.router.navigateByUrl("/error");
          }
        },
        error: (err) => {
          const errorMessage = err.error?.message || "Failed to load page";
          this.paymentService.setErrorMessage(errorMessage);
          this.router.navigateByUrl("/error");
        },
      });
    } else {
      this.paymentService.setErrorMessage("No transaction reference provided");
      this.router.navigateByUrl("/error");
    }
  }

  confirm() {
    if (this.refId && this.transactionData && this.balance !== null) {
      this.paymentService.processTransaction(this.refId).subscribe({
        next: (response: ProcessTransactionResponse) => {
          this.showResult = true;
          if (response.success) {
            const updatedBalance = this.balance?this.balance:0 - (this.transactionData?.amount || 0);
            this.balance = updatedBalance;
            this.successMessage = response.message;
            setTimeout(() => {
              const successURL = response.data?.successURL || "/success";
              this.router.navigateByUrl(successURL);
            }, 5000);
          } else {
            this.errorMessage = response.errors?.join(", ") || response.message || "Transaction failed";
            setTimeout(() => {
              const failureURL = response.data?.failureURL || "/failed";
              this.router.navigateByUrl(failureURL);
            }, 5000);
          }
        },
        error: (err) => {
          this.showResult = true;
          this.errorMessage = err.error?.errors?.join(", ") || err.error?.message || "Transaction failed";
          setTimeout(() => {
            this.router.navigateByUrl("/failed");
          }, 5000);
        },
      });
    } else {
      this.errorMessage = "Invalid transaction data or user data";
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