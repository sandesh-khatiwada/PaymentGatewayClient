import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Router } from "@angular/router";

@Component({
  selector: "app-failure",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./failure.component.html",
  styleUrls: ["./failure.component.scss"],
})
export class FailureComponent {
  constructor(private router: Router) {}

  goHome() {
    this.router.navigateByUrl("/");
  }
}