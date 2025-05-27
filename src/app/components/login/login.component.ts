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
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  refId: string = '';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private paymentService: PaymentService
  ) {
    this.loginForm = this.fb.group({
      usernameOrEmail: ['',Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit() {
    this.refId = this.route.snapshot.paramMap.get('refId') || '';
  }

  login() {
    if (this.loginForm.valid) {
      const request = {
        refId: this.refId,
        usernameOrEmail: this.loginForm.value.usernameOrEmail,
        password: this.loginForm.value.password
      };
      this.paymentService.login(request).subscribe({
        next: (response) => {
          localStorage.setItem('jwt', 'dummy-token'); // Store JWT
          this.router.navigateByUrl(response.redirectUrl);
        },
        error: () => alert('Login failed')
      });
    }
  }
}