import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-verification-success',
  standalone: false,
  templateUrl: './verification-success.component.html',
  styleUrls: ['./verification-success.component.css']
})
export class VerificationSuccessComponent implements OnInit {
  returnUrl: string | null = null;
  hasPendingReservation = false;

  constructor(private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.returnUrl = params['returnUrl'] || null;
    });
    this.hasPendingReservation = !!localStorage.getItem('pendingReservation');
  }

  goToLogin(): void {
    if (this.returnUrl) {
      this.router.navigate(['/login'], { queryParams: { requestedUrl: this.returnUrl } });
    } else {
      this.router.navigate(['/login']);
    }
  }

  continueReservation(): void {
    this.router.navigate(['/login'], { queryParams: { requestedUrl: '/reservation' } });
  }
}
