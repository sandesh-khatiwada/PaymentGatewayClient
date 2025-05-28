
import { Routes } from "@angular/router";
import { CheckoutComponent } from "./components/checkout/checkout.component";
import { LoginComponent } from "./components/login/login.component";
import { OtpComponent } from "./components/otp/otp.component";
import { ConfirmationComponent } from "./components/confirmation/confirmation.component";
import { ErrorComponent } from "./components/error/error.component";
import { SuccessComponent } from "./components/success/success.component";
import { FailureComponent } from "./components/failure/failure.component";

export const routes: Routes = [
  { path: "", component: CheckoutComponent },
  { path: "login/:refId", component: LoginComponent },
  { path: "otp/:refId", component: OtpComponent },
  { path: "confirmation/:refId", component: ConfirmationComponent },
  { path: "success", component: SuccessComponent },
  { path: "failed", component: FailureComponent },
  { path: "error", component: ErrorComponent },
];