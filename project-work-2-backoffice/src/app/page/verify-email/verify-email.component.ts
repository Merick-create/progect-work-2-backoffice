import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../service/auth.service';

@Component({
  selector: 'app-verify-email',
  standalone: false,
  templateUrl: './verify-email.component.html',
  styleUrls: ['./verify-email.component.css']
})
export class VerifyEmailComponent implements OnInit {
  state: 'loading' | 'success' | 'error' = 'loading';
  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const token = this.route.snapshot.queryParamMap.get('token');

    if (!token) {
      this.state = 'error';
      this.errorMessage = 'Token di verifica mancante.';
      return;
    }

    // Ritardo di 5 secondi per far vedere la rotellina
    setTimeout(() => {
      this.authService.verifyEmail(token).subscribe({
        next: () => {
          this.router.navigate(['/verification-success']);
        },
        error: (err) => {
          this.state = 'error';
          this.errorMessage = err.error?.message || 'Errore durante la verifica. Il link potrebbe essere scaduto.';
        }
      });
    }, 5000);
  }
}