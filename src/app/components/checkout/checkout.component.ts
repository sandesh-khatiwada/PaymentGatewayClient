import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { PaymentService } from '../../services/payment.service';
import { CommonModule } from '@angular/common';
import { CheckoutRequestDTO, CheckoutResponse} from '../../model/payment.model';


@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent {
  products = [
    { name: 'Wireless Earbuds', price: 100.0 },
    { name: 'Smartwatch', price: 200.0 },
    { name: 'Laptop', price: 1000.0 }
  ];
  showModal = false;
  remarksForm: FormGroup;
  selectedProduct: { name: string; price: number } | null = null;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private paymentService: PaymentService,
    private router: Router
  ) {
    this.remarksForm = this.fb.group({
      remarks: ['', Validators.required]
    });
  }

  openModal(product: { name: string; price: number }) {
    this.selectedProduct = product;
    this.showModal = true;
    this.errorMessage = null;
  }

  closeModal() {
    this.showModal = false;
    this.selectedProduct = null;
    this.remarksForm.reset();
    this.errorMessage = null;
  }

  proceedToPay() {
    if (this.remarksForm.valid && this.selectedProduct) {
      const request: CheckoutRequestDTO = {
        application: 'eCom1',
        particular: this.selectedProduct.name,
        remarks: this.remarksForm.value.remarks,
        amount: this.selectedProduct.price
      };
      this.errorMessage = null; // Clear previous errors
      this.paymentService.initiateCheckout(request).subscribe({
        next: (response: CheckoutResponse) => {
          if (response.success && response.data?.redirectURL) {
            this.paymentService.setTransactionData({
              initiator: 'eCom1',
              amount: this.selectedProduct!.price,
              particular: this.selectedProduct!.name,
              remarks: this.remarksForm.value.remarks,
              refId: response.data.refId
            });
            const redirectPath = response.data.redirectURL.replace('/api/auth', '');
            this.router.navigateByUrl(redirectPath);
          } else {
            this.errorMessage = response.errors?.join(', ') || response.message || 'Checkout failed';
          }
        },
        error: (err) => {
          this.errorMessage = err.error?.errors?.join(', ') || err.error?.message || 'Failed to initiate checkout';
        }
      });
    }
  }
}

