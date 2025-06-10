import { Component, OnInit, ViewChildren, QueryList, ElementRef } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from "@angular/forms";
import { PaymentService } from "../../services/payment.service";
import { CommonModule } from "@angular/common";
import { OtpValidationResponse, OtpVerifyRequestDTO, OtpVerifyResponse } from "../../model/payment.model";

@Component({
  selector: "app-otp",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: "./otp.component.html",
  styleUrls: ["./otp.component.scss"],
})
export class OtpComponent implements OnInit {
  otpForm: FormGroup;
  refId: string = "";
  isLoading: boolean = true;
  errorMessage: string | null = null;
  @ViewChildren('otpInputs') otpInputs!: QueryList<ElementRef>;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private paymentService: PaymentService,
  ) {
    this.otpForm = this.fb.group({
      otp0: ['', [Validators.required, Validators.pattern(/^\d$/)]],
      otp1: ['', [Validators.required, Validators.pattern(/^\d$/)]],
      otp2: ['', [Validators.required, Validators.pattern(/^\d$/)]],
      otp3: ['', [Validators.required, Validators.pattern(/^\d$/)]],
      otp4: ['', [Validators.required, Validators.pattern(/^\d$/)]],
      otp5: ['', [Validators.required, Validators.pattern(/^\d$/)]]
    });
  }

  ngOnInit() {
    this.refId = this.route.snapshot.paramMap.get("refId") || "";
    if (this.refId) {
      this.paymentService.validateOtpPage(this.refId).subscribe({
        next: (response: OtpValidationResponse) => {
          if (response.success) {
            this.isLoading = false;
          } else {
            const errorMessage = response.errors?.join(", ") || response.message || "Invalid transaction";
            this.paymentService.setErrorMessage(errorMessage);
            this.router.navigateByUrl("/error");
          }
        },
        error: (err) => {
          const errorMessage = err.error?.message || "Failed to validate OTP page";
          this.paymentService.setErrorMessage(errorMessage);
          this.router.navigateByUrl("/error");
        },
      });
    } else {
      this.paymentService.setErrorMessage("No transaction reference provided");
      this.router.navigateByUrl("/error");
    }
  }

  onInput(event: Event, index: number) {
    const input = event.target as HTMLInputElement;
    const value = input.value;

    if (value && index < 5) {
      this.otpInputs.toArray()[index + 1].nativeElement.focus();
    }

    if (!value && index > 0 && event instanceof InputEvent && (event as InputEvent).inputType === 'deleteContentBackward') {
      this.otpInputs.toArray()[index - 1].nativeElement.focus();
    }
  }

  onPaste(event: ClipboardEvent) {
    event.preventDefault();
    const pasteData = event.clipboardData?.getData('text')?.trim();
    if (pasteData && /^\d{6}$/.test(pasteData)) {
      const digits = pasteData.split('');
      digits.forEach((digit, index) => {
        this.otpForm.get(`otp${index}`)?.setValue(digit);
      });
      this.otpInputs.toArray()[5].nativeElement.focus();
    }
  }

  verifyOtp() {
    if (this.otpForm.valid) {
      const otp = Object.values(this.otpForm.value).join('');
      const request: OtpVerifyRequestDTO = {
        otp: otp,
        refId: this.refId,
      };
      this.errorMessage = null;
      this.paymentService.verifyOtp(request).subscribe({
        next: (response: OtpVerifyResponse) => {
          if (response.success) {
            this.router.navigateByUrl(`/confirmation/${this.refId}`);
          } else {
            this.errorMessage = response.errors?.join(", ") || response.message || "Invalid OTP";
          }
        },
        error: (err) => {
          this.errorMessage = err.error?.errors?.join(", ") || err.error?.message || "Failed to verify OTP";
        },
      });
    }
  }
}



