import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-verification-success',
  standalone: false,
  templateUrl: './verification-success.component.html',
  styleUrls: ['./verification-success.component.css']
})
export class VerificationSuccessComponent {
  constructor(private router: Router) {}

  goToLogin(): void {
    this.router.navigate(['/login']);
  }
}