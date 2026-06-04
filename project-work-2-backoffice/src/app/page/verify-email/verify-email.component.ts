import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../service/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-verify-email',
  templateUrl: './verify-email.component.html',
  styleUrls: ['./verify-email.component.css']
})
export class VerifyEmailComponent implements OnInit {
  token: string = '';
  loading: boolean = false;
  error: string | null = null;
  success: boolean = false;
  
  private routeSub: Subscription | undefined;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.routeSub = this.route.queryParams.subscribe(params => {
      this.token = params['token'] || '';
      if (this.token) {
        this.verifyEmail();
      } else {
        this.error = 'Token non fornito nel link';
      }
    });
  }

  ngOnDestroy(): void {
    this.routeSub?.unsubscribe();
  }

  verifyEmail(): void {
    this.loading = true;
    this.error = null;
    this.success = false;

    // Simulate delay for spinner (4-5 seconds as requested)
    setTimeout(() => {
      this.authService.verifyEmail(this.token).subscribe({
        next: (response) => {
          this.loading = false;
          this.success = true;
          // Redirect to success page after a brief moment
          setTimeout(() => {
            this.router.navigate(['/verification-success']);
          }, 1500);
        },
        error: (err) => {
          this.loading = false;
          this.error = err.error?.message || 'Verifica fallita. Token scaduto o non valido.';
        }
      });
    }, 4000); // 4 second delay for spinner
  }
}