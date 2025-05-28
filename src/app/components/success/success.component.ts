
import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Router } from "@angular/router";

@Component({
  selector: "app-success",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./success.component.html",
  styleUrls: ["./success.component.scss"],
})
export class SuccessComponent {
  constructor(private router: Router) {}

  goHome() {
    this.router.navigateByUrl("/");
  }
}