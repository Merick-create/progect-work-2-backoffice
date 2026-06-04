import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-verification-sent',
  standalone: false,
  templateUrl: './verification-sent.component.html',
  styleUrls: ['./verification-sent.component.css']
})
export class VerificationSentComponent {
  constructor(private router: Router) {}

  // Method to resend verification email if needed
  resendVerification() {
    // Implementation would call auth service to resend verification email
    console.log('Resend verification email');
  }
}